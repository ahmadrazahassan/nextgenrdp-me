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
        orderId: true,
        planName: true,
        total: true,
        status: true,
        createdAt: true,
        expiryDate: true,
      }
    }).catch(error => {
      console.error(`[${requestId}] DB error fetching orders:`, error);
      throw new ApiError('Database error', 500, 'DB_ERROR');
    });
    
    // --- Transform Orders into Invoices --- 
    const invoices = userOrders.map(order => {
      // Determine invoice type
      let orderType = 'New Subscription';
      
      // For demo purposes, randomly assign different order types
      // In a real application, this would be determined by order history analysis
      const typeRandom = Math.random();
      if (typeRandom > 0.7) {
        orderType = 'Renewal';
      } else if (typeRandom > 0.4) {
        orderType = 'Upgrade';
      }
      
      // Calculate due and paid dates
      let dueDate = null;
      let paidDate = null;
      
      if (order.status === 'active' || order.status === 'paid') {
        // For paid orders, set paid date to 1 day after creation
        const creationDate = new Date(order.createdAt);
        paidDate = new Date(creationDate);
        paidDate.setDate(paidDate.getDate() + 1);
      } else if (order.status === 'pending') {
        // For pending orders, set due date to 7 days after creation
        const creationDate = new Date(order.createdAt);
        dueDate = new Date(creationDate);
        dueDate.setDate(dueDate.getDate() + 7);
      }
      
      // Generate invoice object
      return {
        id: `INV-${order.id.substring(0, 8)}`,
        orderId: order.orderId,
        amount: order.total,
        status: order.status === 'active' ? 'paid' : order.status,
        date: order.createdAt,
        planName: order.planName,
        orderType,
        ...(dueDate && { dueDate: dueDate.toISOString() }),
        ...(paidDate && { paidDate: paidDate.toISOString() }),
      };
    });
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Processed GET /api/user/billing/invoices in ${duration}ms`);
    
    return NextResponse.json(invoices);
    
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

// API route for downloading a specific invoice PDF
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    // --- Authentication --- 
    const user = await getCurrentUser(request);
    if (!user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    
    // Parse request body
    const data = await request.json().catch(() => {
      throw new ApiError('Invalid JSON in request body', 400, 'INVALID_JSON');
    });
    
    const { invoiceId } = data;
    
    if (!invoiceId) {
      throw new ApiError('Invoice ID is required', 400, 'MISSING_INVOICE_ID');
    }
    
    // Extract order ID from invoice ID (removing 'INV-' prefix)
    const orderId = invoiceId.replace('INV-', '');
    
    // Find the corresponding order
    const order = await prisma.order.findFirst({
      where: {
        id: { startsWith: orderId },
        userId: user.id
      }
    });
    
    if (!order) {
      throw new ApiError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    // In a real application, you would generate a PDF here
    // For now, we'll just return success
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Processed POST /api/user/billing/invoices in ${duration}ms`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Invoice download initiated",
      invoiceUrl: `/api/user/billing/invoices/${invoiceId}/download`
    });
    
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