// File: src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
// Import validation schema if defined separately
// import { registerSchema } from '@/utils/validation';

// Assume prisma client instance is correctly set up elsewhere or import it
// import prisma from '@/lib/db';
const prisma = new PrismaClient(); // Example instantiation

// Registration request schema validation (can be moved to utils/validation.ts)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  // Add confirmPassword if needed for frontend validation, but usually not sent to backend
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body;
    try {
        body = await request.json();
    } catch (e) {
         return NextResponse.json({ success: false, error: "Invalid request format." }, { status: 400 });
    }

    const validationResult = registerSchema.safeParse(body);

    // Handle validation errors
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { fullName, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already registered",
        },
        { status: 409 } // 409 Conflict is appropriate here
      );
    }

    // Hash password using Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MiB is a good default
      timeCost: 3,
      parallelism: 1, // Adjust based on server cores if needed
    });

    // Create user in database
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        emailVerified: false, // Requires email verification flow
        // Initialize other fields as needed per schema
        failedLoginAttempts: 0,
        accountLocked: false,
        isAdmin: false, // Default non-admin
      },
      select: { // Select only the necessary fields to return or use
        id: true,
        fullName: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // TODO: Implement Email Verification Flow
    // 1. Generate a unique verification token
    // const verificationToken = crypto.randomUUID(); // Use crypto for secure random IDs
    // 2. Store token and expiry in EmailVerification table linked to user.id
    // await prisma.emailVerification.create({ data: { userId: user.id, verificationToken, expiresAt: ... } });
    // 3. Send an email using a mail service (e.g., Resend, SendGrid) containing a verification link:
    //    `/verify-email?token=${verificationToken}`
    // console.log(`Verification token for ${email}: ${verificationToken}`); // Log for development ONLY

    // --- CORRECTED: Generate JWT token using 'sub' and set 'auth_token' cookie ---
    const token = sign(
      {
        sub: user.id, // Use 'sub' for user ID
        email: user.email,
        fullName: user.fullName,
        emailVerified: user.emailVerified, // Include verification status
      },
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
      {
        expiresIn: "1d", // Log in user for 1 day upon registration
      }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 1 * 24 * 60 * 60, // 1 day in seconds
      path: "/",
    };

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please check your email to verify your account.", // Update message
        user: { // Return minimal necessary user info
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 }
    );

    // Set auth token cookie
    response.cookies.set("auth_token", token, cookieOptions); // Use 'auth_token'

    // --- END CORRECTION ---

    return response;

  } catch (error: any) {
    console.error("Registration error:", error);
    // Check for specific Prisma errors, like unique constraint violation
     if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
         return NextResponse.json(
             { success: false, error: "This email is already registered" },
             { status: 409 }
         );
     }

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed. Please try again later.",
        ...(process.env.NODE_ENV !== "production" && { details: error.message }),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect(); // Only if prisma is not managed globally
  }
}