import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authUtils';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Fetch notifications from the database
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
        type: true,
        priority: true,
        read: true,
        source: true
      }
    });
    
    // Format notifications for the frontend
    const formattedNotifications = notifications.map(notification => {
      // Format the timestamp as a relative time string
      const timestamp = formatRelativeTime(notification.createdAt);
      
      return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        timestamp,
        type: notification.type,
        priority: notification.priority,
        read: notification.read,
        source: notification.source
      };
    });
    
    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    
    // Return empty array instead of error to prevent frontend issues
    return NextResponse.json([]);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get the admin ID (in a real app, this would come from the auth context)
    const adminId = "admin-1"; // Placeholder, should be replaced with the actual adminId
    
    // Delete all notifications for this admin
    await prisma.notification.deleteMany({
      where: {
        adminId
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { error: 'Failed to clear notifications' },
      { status: 500 }
    );
  }
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffMinutes / (24 * 60));
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  }
} 