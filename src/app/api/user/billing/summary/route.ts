import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Define custom error class for better error handling
class ApiError extends Error {
  status: number;
  code: string;
  
  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    // --- Authentication --- 
    const user = await getCurrentUser(request);
    if (!user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    console.log(`[${requestId}] Authenticated user: ${user.id}`);

    // --- Get All User Orders --- 
    const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        expiryDate: true,
      }
    }).catch(error => {
      console.error(`[${requestId}] DB error fetching orders:`, error);
      throw new ApiError('Database error', 500, 'DB_ERROR');
    });
    
    // --- Calculate Billing Summary ---
    
    // 1. Calculate total spent (sum of all paid orders)
    const totalSpent = userOrders
      .filter(order => order.status === 'paid' || order.status === 'active')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // 2. Count active subscriptions
    const activeSubscriptions = userOrders.filter(order => 
      order.status === 'active'
    ).length;
    
    // 3. Calculate unpaid amount (sum of all pending orders)
    const unpaidAmount = userOrders
      .filter(order => order.status === 'pending')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // 4. Find next payment date and amount (the nearest expiry date)
    let nextPaymentDate = null;
    let nextPaymentAmount = null;
    
    const activeOrdersWithExpiry = userOrders
      .filter(order => 
        order.status === 'active' && 
        order.expiryDate && 
        new Date(order.expiryDate) > new Date()
      )
      .sort((a, b) => 
        new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
      );
    
    if (activeOrdersWithExpiry.length > 0) {
      const nextOrder = activeOrdersWithExpiry[0];
      nextPaymentDate = nextOrder.expiryDate;
      nextPaymentAmount = nextOrder.total;
    }
    
    // --- Build and Return Response ---
    const billingSummary = {
      totalSpent,
      unpaidAmount,
      activeSubscriptions,
      ...(nextPaymentDate && { nextPaymentDate }),
      ...(nextPaymentAmount && { nextPaymentAmount }),
    };
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Processed GET /api/user/billing/summary in ${duration}ms`);
    
    return NextResponse.json(billingSummary);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof ApiError) {
      console.error(`[${requestId}] API Error (${error.code}): ${error.message} [${duration}ms]`);
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    } 
    console.error(`[${requestId}] Unhandled error:`, error, `[${duration}ms]`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 