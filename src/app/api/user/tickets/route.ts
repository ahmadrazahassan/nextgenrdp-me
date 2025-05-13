import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

// Schema for ticket creation
const ticketSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters long"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["billing", "technical", "account", "other"])
});

// GET handler to fetch all tickets for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Fetch tickets from newest to oldest
    const tickets = await prisma.SupportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            message: true,
            createdAt: true,
            isStaffReply: true,
            staffName: true
          }
        }
      }
    });
    
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST handler to create a new ticket
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate the request body
    const validationResult = ticketSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { subject, message, priority, category } = validationResult.data;
    
    // Create the ticket
    const ticket = await prisma.SupportTicket.create({
      data: {
        subject,
        status: "open",
        priority,
        category,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Create the initial message as the first reply
        replies: {
          create: {
            message,
            createdAt: new Date(),
            isStaffReply: false,
            userId: user.id
          }
        }
      },
      include: {
        replies: true
      }
    });
    
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
} 