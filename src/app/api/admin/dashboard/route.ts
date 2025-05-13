import { NextResponse } from 'next/server';
import { getDashboardData } from '@/repositories/orderRepository';
import { getUserStats } from '@/repositories/userRepository';
import { verifyAdmin } from '@/lib/authUtils';

export async function GET(request) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get dashboard data
    const orderStats = await getDashboardData();
    const userStats = await getUserStats();
    
    // Combine all stats
    const dashboardData = {
      ...orderStats,
      ...userStats
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 