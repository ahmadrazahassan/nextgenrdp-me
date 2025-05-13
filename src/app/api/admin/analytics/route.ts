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
    
    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get('range') || '30days';
    
    // Calculate the date range based on the parameter
    const now = new Date();
    let dayCount = 30;
    
    switch (rangeParam) {
      case '7days':
        dayCount = 7;
        break;
      case '30days':
        dayCount = 30;
        break;
      case '90days':
        dayCount = 90;
        break;
      case 'year':
        dayCount = 365;
        break;
      default:
        dayCount = 30;
    }
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - dayCount);
    
    // Fetch page views data from database
    const pageViewsData = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
    
    // Fetch visitor data from database
    const visitorData = await prisma.visitor.findMany({
      where: {
        visitDate: {
          gte: startDate
        }
      },
      orderBy: {
        visitDate: 'asc'
      }
    });
    
    // Fetch traffic source data
    const trafficSourceData = await prisma.trafficSource.findMany({
      select: {
        source: true,
        count: true,
      }
    });
    
    // Calculate total visitors for percentage
    const totalVisits = trafficSourceData.reduce((sum, source) => sum + source.count, 0);
    
    // Process page views data by date
    const processedDates = new Map();
    const pageViews = [];
    const uniqueVisitors = [];
    
    // Initialize dates
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (dayCount - 1 - i));
      const formattedDate = date.toISOString().split('T')[0];
      processedDates.set(formattedDate, { pageViews: 0, visitors: 0 });
    }
    
    // Process page views
    pageViewsData.forEach(view => {
      const dateKey = view.timestamp.toISOString().split('T')[0];
      if (processedDates.has(dateKey)) {
        const data = processedDates.get(dateKey);
        data.pageViews += 1;
        processedDates.set(dateKey, data);
      }
    });
    
    // Process unique visitors
    visitorData.forEach(visitor => {
      const dateKey = visitor.visitDate.toISOString().split('T')[0];
      if (processedDates.has(dateKey)) {
        const data = processedDates.get(dateKey);
        data.visitors += 1;
        processedDates.set(dateKey, data);
      }
    });
    
    // Convert Map to arrays
    processedDates.forEach((value, key) => {
      pageViews.push({
        date: key,
        count: value.pageViews
      });
      uniqueVisitors.push({
        date: key,
        count: value.visitors
      });
    });
    
    // Process traffic sources
    const sources = trafficSourceData.map(source => ({
      source: source.source,
      percentage: totalVisits > 0 ? (source.count / totalVisits) * 100 : 0,
      count: source.count
    }));
    
    // Fetch conversion data
    const conversions = await prisma.conversion.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 30
    });
    
    // Calculate overall conversion rate
    const totalConversions = conversions.reduce((sum, conv) => sum + conv.conversions, 0);
    const totalAttempts = conversions.reduce((sum, conv) => sum + conv.attempts, 0);
    const overallRate = totalAttempts > 0 ? (totalConversions / totalAttempts) * 100 : 0;
    
    // Get previous period for comparison
    const prevPeriodStart = new Date(startDate);
    prevPeriodStart.setDate(prevPeriodStart.getDate() - dayCount);
    
    const prevPeriodConversions = await prisma.conversion.findMany({
      where: {
        date: {
          gte: prevPeriodStart,
          lt: startDate
        }
      }
    });
    
    const prevTotalConversions = prevPeriodConversions.reduce((sum, conv) => sum + conv.conversions, 0);
    const prevTotalAttempts = prevPeriodConversions.reduce((sum, conv) => sum + conv.attempts, 0);
    const prevOverallRate = prevTotalAttempts > 0 ? (prevTotalConversions / prevTotalAttempts) * 100 : 0;
    
    // Calculate change in conversion rate
    const rateChange = overallRate - prevOverallRate;
    
    // Fetch orders for average order value
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        totalAmount: true
      }
    });
    
    const totalOrderAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = orders.length > 0 ? totalOrderAmount / orders.length : 0;
    
    // Fetch user activity by hour
    const userActivityData = await prisma.userActivity.findMany();
    
    const userActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourData = userActivityData.find(data => data.hour === hour);
      return {
        hour,
        percentage: hourData ? hourData.activityPercentage : 0
      };
    });
    
    // Fetch page conversion rates
    const pageConversions = await prisma.pageConversion.findMany();
    
    const pageRates = pageConversions.map(pc => ({
      page: pc.pageName,
      rate: pc.conversionRate
    }));
    
    // Construct complete analytics data
    const analyticsData = {
      pageViews,
      uniqueVisitors,
      sources,
      userActivity,
      conversionRates: {
        overall: overallRate,
        change: rateChange,
        avgOrderValue,
        pageRates
      }
    };
    
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // If database error, fall back to a minimal but valid data structure
    const fallbackData = {
      pageViews: [],
      uniqueVisitors: [],
      sources: [],
      userActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, percentage: 0 })),
      conversionRates: {
        overall: 0,
        change: 0,
        avgOrderValue: 0,
        pageRates: []
      }
    };
    
    return NextResponse.json(
      fallbackData,
      { status: 200 }
    );
  }
} 