import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // Using Zod for validation
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/lib/auth'; // Import the real function

// Remove the placeholder function
/*
async function getCurrentUserId(request: NextRequest): Promise<string | null> {
  console.warn("Using placeholder auth in /api/orders - IMPLEMENT REAL AUTH!");
  return "dummy-user-id"; 
}
*/

const prisma = new PrismaClient();

// Zod schema for order creation validation
const createOrderSchema = z.object({
  planId: z.string().min(1),
  planName: z.string().min(1),
  location: z.string().min(1), // e.g., 'us-dal'
  paymentMethod: z.string().min(1), // e.g., 'wise'
  paymentProofUrl: z.string().min(1),
  subtotal: z.number().optional(), // Base price before discount
  total: z.number(), // Final price after discount
  // quantity: z.number().int().min(1).default(1), // Add if needed
  // duration: z.number().int().min(1), // Add if needed
});

export async function POST(request: NextRequest) {
  try {
    // Use the real getCurrentUser function
    const user = await getCurrentUser(request);
    if (!user) { // Check if user object exists
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = user.id; // Extract the user ID

    const rawBody = await request.json();
    
    // Validate request body
    const validationResult = createOrderSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.error("Order validation failed:", validationResult.error.flatten());
      return NextResponse.json({ error: 'Invalid order data.', details: validationResult.error.flatten() }, { status: 400 });
    }
    const validatedData = validationResult.data;

    // Generate a unique order ID (e.g., prefix + timestamp + random part)
    const uniqueOrderId = `NGR-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;

    const newOrder = await prisma.order.create({
      data: {
        orderId: uniqueOrderId,
        userId: userId,
        planId: validatedData.planId,
        planName: validatedData.planName,
        location: validatedData.location,
        locationCode: validatedData.location,
        paymentMethod: validatedData.paymentMethod,
        paymentProofUrl: validatedData.paymentProofUrl,
        subtotal: validatedData.subtotal ?? validatedData.total, // Use total if subtotal not provided
        total: validatedData.total,
        status: 'pending', // Initial status, admin needs to verify payment
        // Set default values or add fields as per your prisma schema
        quantity: 1, // Assuming default quantity 1
        duration: 1, // Assuming default duration 1 month (adjust as needed)
        // locationCode: validatedData.location, // If locationCode is same as location id
        // transactionReference: null, // Optional reference from payment proof?
        // ipAddress: request.ip, // Get user IP if needed
        // username: null, // Will be set by admin later?
        // password: null, // Will be set by admin later?
        // expiryDate: null, // Set after activation
      },
    });

    return NextResponse.json({ success: true, message: 'Order placed successfully!', order: newOrder }, { status: 201 });

  } catch (error: any) {
    console.error("Order creation error:", error);
    // Check for specific Prisma errors if needed
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    return NextResponse.json({ error: "Failed to create order.", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 