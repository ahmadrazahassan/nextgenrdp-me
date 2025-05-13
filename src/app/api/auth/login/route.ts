// File: src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, User as PrismaUser } from "@prisma/client"; // Import PrismaUser type
import * as argon2 from "argon2";
import { z } from "zod";
import { SignJWT } from "jose"; // Import SignJWT from jose instead of jsonwebtoken
import { cookies } from "next/headers"; // Import cookies from next/headers

// Assume prisma client instance is correctly set up elsewhere or import it
// import prisma from '@/lib/db';
const prisma = new PrismaClient(); // Example instantiation

// Login request schema validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

// Maximum failed login attempts before account lockout
const MAX_FAILED_ATTEMPTS = 5;

// Define a type that extends the Prisma User type with security fields
// Ensure this type matches the fields you actually have in your Prisma schema
type UserWithSecurity = PrismaUser & {
  failedLoginAttempts?: number | null; // Allow null if the field is optional
  accountLocked?: boolean | null; // Allow null if the field is optional
  isAdmin?: boolean | null; // Allow null if the field is optional
};

export async function POST(request: NextRequest) {
  try {
    // Log request for debugging
    console.log("Login request received");

    // Parse and validate request body
    let body;
    try {
        body = await request.json();
        console.log("Request body:", body);
    } catch (e) {
        console.error("Failed to parse request body:", e);
        return NextResponse.json(
            { success: false, error: "Invalid request format." },
            { status: 400 }
        );
    }

    const validationResult = loginSchema.safeParse(body);

    // Handle validation errors
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.format());
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // User not found - return generic error for security
    if (!user) {
      console.log("User not found:", email);
      // Consider rate limiting here based on email/IP
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Cast user to our extended type
    const userWithSecurity = user as UserWithSecurity; // Use the combined type
    console.log("User found:", { id: userWithSecurity.id, email: userWithSecurity.email });

    // Check if account is locked - with type safety
    if (userWithSecurity.accountLocked) {
      console.log("Account locked:", userWithSecurity.id);
      return NextResponse.json(
        {
          success: false,
          error: "Your account has been locked due to too many failed attempts. Please reset your password.",
        },
        { status: 403 }
      );
    }

    // Verify password
    let passwordValid = false;
    try {
      // Ensure passwordHash is not null or undefined before verifying
      if (userWithSecurity.passwordHash) {
        passwordValid = await argon2.verify(userWithSecurity.passwordHash, password);
      } else {
          console.error("Password hash is missing for user:", userWithSecurity.id);
          // Handle cases where password hash might be missing (e.g., legacy accounts)
          // Depending on policy, either fail login or trigger a password reset flow
      }
      console.log("Password verification result:", passwordValid);
    } catch (error) {
      console.error("Password verification error:", error);
      // Don't reveal specific argon2 errors to the client
       return NextResponse.json(
           { success: false, error: "An error occurred during login. Please try again." },
           { status: 500 }
       );
    }

    // Handle invalid password
    if (!passwordValid) {
      // Increment failed login attempts - with type safety
      const failedAttempts = (userWithSecurity.failedLoginAttempts ?? 0) + 1;
      const updateData: Partial<UserWithSecurity> = { failedLoginAttempts: failedAttempts }; // Use Partial for update data

      console.log("Failed login attempt:", {
        userId: userWithSecurity.id,
        failedAttempts,
        maxAttempts: MAX_FAILED_ATTEMPTS
      });

      // Lock account if max attempts reached
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        updateData.accountLocked = true;
        console.log("Account locked due to max failed attempts:", userWithSecurity.id);
      }

      // Update user record
      await prisma.user.update({
        where: { id: userWithSecurity.id },
        data: updateData,
      });

      // Return error response
      const attemptsRemaining = MAX_FAILED_ATTEMPTS - failedAttempts;
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
          ...(attemptsRemaining >= 0 && { attemptsRemaining: attemptsRemaining }) // Show remaining only if not locked
        },
        { status: 401 }
      );
    }

    // Reset failed login attempts on successful login
    await prisma.user.update({
      where: { id: userWithSecurity.id },
      data: {
        failedLoginAttempts: 0,
        lastLogin: new Date(),
        // Optionally reset accountLocked here if you allow unlocking on successful login
        // accountLocked: false,
      },
    });

    console.log("Login successful:", userWithSecurity.id);

    // Convert JWT Secret to proper format for jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-change-in-production"
    );

    // Generate JWT token using jose's SignJWT
    const token = await new SignJWT({
      // Include necessary non-sensitive claims
      email: userWithSecurity.email,
      fullName: userWithSecurity.fullName,
      emailVerified: userWithSecurity.emailVerified,
      isAdmin: userWithSecurity.isAdmin || false, // Add isAdmin flag to token
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userWithSecurity.id) // Set subject to user ID
      .setIssuedAt()
      .setExpirationTime(rememberMe ? '30d' : '1d') // Standard expiry '1d' or longer for rememberMe
      .sign(secret);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 1 * 24 * 60 * 60, // 30 days or 1 day in seconds
      path: "/",
    };

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: { // Return minimal necessary user info to the client
          id: userWithSecurity.id,
          email: userWithSecurity.email,
          fullName: userWithSecurity.fullName,
          emailVerified: userWithSecurity.emailVerified,
          isAdmin: userWithSecurity.isAdmin || false,
        },
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache'
        }
      }
    );

    // Set cookies in response
    response.cookies.set("auth_token", token, cookieOptions);

    return response;

  } catch (error: any) {
    // Log the error for debugging
    console.error("Login error:", error);
    console.error("Error stack:", error?.stack);

    // Return appropriate error response
    return NextResponse.json(
      {
        success: false,
        error: "Login failed. Please try again later.",
        // Include error details in development, remove in production
        ...(process.env.NODE_ENV !== "production" && {
          details: error?.message || "Unknown error",
          // stack: error?.stack // Avoid sending stack trace to client
        }),
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client if it was instantiated locally in this function
    // await prisma.$disconnect(); // Only if prisma is not managed globally/elsewhere
  }
}