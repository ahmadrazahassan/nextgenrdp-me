import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authUtils';
import prisma from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get the admin ID (in a real app, this would come from the auth context)
    const adminId = "admin-1"; // Placeholder, should be replaced with actual adminId
    
    // Mark all notifications as read in the database
    const result = await prisma.notification.updateMany({
      where: {
        adminId,
        read: false
      },
      data: {
        read: true,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'All notifications marked as read',
      count: result.count
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
} 