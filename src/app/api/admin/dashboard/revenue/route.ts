import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdmin } from '@/lib/authUtils';

interface PlanRevenue {
  total: number;
  count: number;
}

interface PlanRevenueData {
  [key: string]: PlanRevenue;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get all orders for revenue analysis
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        planName: true,
        planId: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get current date for calculations
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Calculate monthly revenue for the past 12 months
    const monthlyRevenue = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthEnd = new Date(currentYear, currentMonth - i + 1, 0);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= month && orderDate <= monthEnd;
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
      const count = monthOrders.length;
      
      monthlyRevenue.unshift({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue,
        orderCount: count
      });
    }
    
    // Calculate revenue by plan
    const planRevenue: PlanRevenueData = orders.reduce((plans: PlanRevenueData, order) => {
      const planName = order.planName || 'Unknown Plan';
      if (!plans[planName]) {
        plans[planName] = {
          total: 0,
          count: 0
        };
      }
      plans[planName].total += order.total;
      plans[planName].count += 1;
      return plans;
    }, {});
    
    // Format plan revenue for response
    const planRevenueData = Object.entries(planRevenue).map(([name, data]) => ({
      planName: name,
      revenue: data.total,
      orderCount: data.count,
      percentage: orders.length > 0 ? (data.count / orders.length) * 100 : 0
    }));
    
    // Sort plans by revenue
    planRevenueData.sort((a, b) => b.revenue - a.revenue);
    
    // Calculate revenue growth metrics
    const thisMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
    const lastMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
    const twoMonthsAgo = monthlyRevenue[monthlyRevenue.length - 3]?.revenue || 0;
    
    // Calculate MoM (Month over Month) growth
    const momGrowth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
    
    // Calculate 3-month trend
    const threeMonthTrend = twoMonthsAgo > 0 ? ((thisMonth - twoMonthsAgo) / twoMonthsAgo) * 100 : 0;
    
    // Calculate Year-to-Date revenue
    const startOfYear = new Date(currentYear, 0, 1);
    const ytdRevenue = orders
      .filter(order => new Date(order.createdAt) >= startOfYear)
      .reduce((sum, order) => sum + order.total, 0);
    
    // Calculate projections based on current growth
    const annualRunRate = (thisMonth * 12); // Simple projection
    
    // Build revenue metrics
    const revenueMetrics = {
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      ytdRevenue,
      momGrowth,
      threeMonthTrend,
      annualRunRate,
      thisMonth,
      lastMonth
    };
    
    // Build response data
    const responseData = {
      monthlyRevenue,
      planRevenueData,
      revenueMetrics
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
} 