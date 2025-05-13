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
    
    // Get the admin ID (in a real app, this would come from the auth context)
    const adminId = "admin-1"; // Placeholder, should be replaced with the actual adminId
    
    // Count notifications by different criteria
    const [
      criticalCount, 
      systemCount, 
      userCount,
      unreadCount,
      allNotifications,
      systemStatusCheck
    ] = await Promise.all([
      // Count critical priority notifications
      prisma.notification.count({
        where: {
          adminId,
          priority: 'high',
          read: false
        }
      }),
      
      // Count system type notifications
      prisma.notification.count({
        where: {
          adminId,
          type: 'system'
        }
      }),
      
      // Count user type notifications
      prisma.notification.count({
        where: {
          adminId,
          type: 'user'
        }
      }),
      
      // Count all unread notifications
      prisma.notification.count({
        where: {
          adminId,
          read: false
        }
      }),
      
      // Get total count for aggregate stats
      prisma.notification.findMany({
        where: {
          adminId
        },
        select: {
          id: true
        }
      }),
      
      // Get system status from the status table
      prisma.systemStatus.findFirst({
        orderBy: {
          updatedAt: 'desc'
        },
        select: {
          status: true
        }
      })
    ]);
    
    // Prepare summary data
    const summary = {
      criticalCount,
      systemCount,
      userCount,
      systemStatus: systemStatusCheck?.status || "Unknown",
      unreadCount,
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching notification summary:', error);
    
    // Return a default summary object instead of an error
    return NextResponse.json({
      criticalCount: 0,
      systemCount: 0,
      userCount: 0,
      systemStatus: "Unknown",
      unreadCount: 0,
      lastUpdated: new Date().toISOString()
    });
  }
} 