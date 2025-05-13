import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

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

// Simplified Query Schema for Pagination
const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(5).max(50).default(8), // Default to 8 for card layout
});

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    // --- Authentication --- 
    const user = await getCurrentUser(request);
    if (!user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    console.log(`[${requestId}] Authenticated user: ${user.id}`);

    // --- Parse Pagination Params --- 
    const searchParams = request.nextUrl.searchParams;
    const queryParams = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!queryParams.success) {
        throw new ApiError('Invalid query parameters', 400, 'INVALID_QUERY');
    }
    const { page, limit } = queryParams.data;
    
    // --- Database Query --- 
    const whereClause: Prisma.OrderWhereInput = { userId: user.id };
    const totalOrders = await prisma.order.count({ where: whereClause });

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }, // Default sort: newest first
      skip: (page - 1) * limit,
      take: limit,
      select: { // Select fields needed for card display & details link
        id: true,
        orderId: true,
        planName: true,
        status: true,
        total: true,
        createdAt: true,
        location: true,
        isInitialized: true,
        // Include service details directly if available
        ipAddress: true,
        username: true,
        expiryDate: true,
        // Avoid selecting password here for security
      }
    }).catch(error => {
      console.error(`[${requestId}] DB error fetching orders:`, error);
      throw new ApiError('Database error', 500, 'DB_ERROR');
    });
    
    const totalPages = Math.ceil(totalOrders / limit);

    // --- Response --- 
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Processed GET /api/user/orders (Paginated) in ${duration}ms`);
    
    return NextResponse.json({
        orders,
        pagination: { totalItems: totalOrders, totalPages, currentPage: page, pageSize: limit }
    });

  } catch (error) {
     // ... Error Handling ... 
     const duration = Date.now() - startTime;
     if (error instanceof ApiError) {
       console.error(`[${requestId}] API Error (${error.code}): ${error.message} [${duration}ms]`);
       return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
     } 
     console.error(`[${requestId}] Unhandled error:`, error, `[${duration}ms]`);
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get a specific order by ID for the current user
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    console.log(`[${requestId}] Processing POST /api/user/orders request`);
    
    // Verify authentication
    const user = await getCurrentUser(request);
    if (!user) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    
    // Parse request body with error handling
    const data = await request.json().catch(() => {
      throw new ApiError('Invalid JSON in request body', 400, 'INVALID_JSON');
    });
    
    const { orderId } = data;
    
    if (!orderId) {
      throw new ApiError('Order ID is required', 400, 'MISSING_ORDER_ID');
    }
    
    // Get the specific order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    }).catch(error => {
      console.error(`[${requestId}] Database error:`, error);
      throw new ApiError('Database error', 500, 'DB_ERROR');
    });
    
    if (!order) {
      throw new ApiError('Order not found', 404, 'ORDER_NOT_FOUND');
    }
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Successfully processed POST /api/user/orders in ${duration}ms`);
    
    return NextResponse.json(order);
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error instanceof ApiError) {
      console.error(`[${requestId}] API Error (${error.code}): ${error.message} [${duration}ms]`);
      return NextResponse.json(
        { error: error.message, code: error.code, requestId }, 
        { status: error.status }
      );
    }
    
    console.error(`[${requestId}] Unhandled error fetching specific order:`, error, `[${duration}ms]`);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR', requestId }, 
      { status: 500 }
    );
  }
}