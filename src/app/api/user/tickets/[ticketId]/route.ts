import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

// Schema for ticket reply
const replySchema = z.object({
  message: z.string().min(1, "Reply cannot be empty")
});

// Schema for ticket status update
const statusUpdateSchema = z.object({
  status: z.enum(["open", "closed", "resolved"])
});

// GET handler to fetch a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const ticketId = params.ticketId;
    
    // Fetch the ticket with replies
    const ticket = await prisma.SupportTicket.findUnique({
      where: { 
        id: ticketId,
        userId: user.id // Ensure the ticket belongs to the user
      },
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
    
    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

// PATCH handler to update ticket status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const ticketId = params.ticketId;
    const body = await request.json();
    
    // Validate the request body
    const validationResult = statusUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { status } = validationResult.data;
    
    // Check if the ticket exists and belongs to the user
    const existingTicket = await prisma.SupportTicket.findUnique({
      where: { 
        id: ticketId,
        userId: user.id
      }
    });
    
    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }
    
    // Update the ticket status
    const updatedTicket = await prisma.SupportTicket.update({
      where: { id: ticketId },
      data: { 
        status,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// POST handler to add a reply to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const ticketId = params.ticketId;
    const body = await request.json();
    
    // Validate the request body
    const validationResult = replySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { message } = validationResult.data;
    
    // Check if the ticket exists and belongs to the user
    const existingTicket = await prisma.SupportTicket.findUnique({
      where: { 
        id: ticketId,
        userId: user.id
      }
    });
    
    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }
    
    // Add the reply and update the ticket timestamp
    const reply = await prisma.TicketReply.create({
      data: {
        message,
        createdAt: new Date(),
        isStaffReply: false,
        userId: user.id,
        ticketId
      }
    });
    
    // Update the ticket's updatedAt timestamp
    await prisma.SupportTicket.update({
      where: { id: ticketId },
      data: { 
        updatedAt: new Date(),
        status: "open" // Reopen the ticket if it was closed
      }
    });
    
    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
} 