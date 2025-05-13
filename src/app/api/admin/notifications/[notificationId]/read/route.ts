import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authUtils';
import prisma from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    const notificationId = params.notificationId;
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    // Get the admin ID (in a real app, this would come from the auth context)
    const adminId = "admin-1"; // Placeholder, should be replaced with actual adminId
    
    // Mark the notification as read in the database
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
        adminId
      },
      data: {
        read: true,
        updatedAt: new Date()
      }
    });
    
    if (!updatedNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      id: notificationId,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    
    // Check if it's a Prisma error
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
} 