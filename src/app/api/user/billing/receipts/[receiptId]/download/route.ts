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

export async function GET(
  request: NextRequest,
  { params }: { params: { receiptId: string } }
) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const { receiptId } = params;
  
  try {
    if (!receiptId) {
      throw new ApiError('Receipt ID is required', 400, 'MISSING_RECEIPT_ID');
    }
    
    // --- Authentication --- 
    const user = await getCurrentUser(request);
    if (!user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    console.log(`[${requestId}] Authenticated user: ${user.id} downloading receipt ${receiptId}`);
    
    // Extract order ID from receipt ID (removing 'INV-' prefix if present)
    const orderId = receiptId.replace('INV-', '');
    
    // Find the corresponding order
    const order = await prisma.order.findFirst({
      where: {
        id: { startsWith: orderId },
        userId: user.id,
        // Only get paid or active orders for receipts
        OR: [
          { status: 'paid' },
          { status: 'active' }
        ]
      },
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
      console.error(`[${requestId}] DB error fetching order:`, error);
      throw new ApiError('Database error', 500, 'DB_ERROR');
    });
    
    if (!order) {
      throw new ApiError('Receipt not found or payment not completed', 404, 'RECEIPT_NOT_FOUND');
    }
    
    // Calculate payment date (in a real app, this would be stored in a payment table)
    const creationDate = new Date(order.createdAt);
    const paymentDate = new Date(creationDate);
    paymentDate.setDate(paymentDate.getDate() + 1);
    
    // Generate transaction ID
    const transactionId = `TXN-${order.id.substring(0, 6)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Processed GET /api/user/billing/receipts/${receiptId}/download in ${duration}ms`);
    
    // Simulate PDF generation by creating receipt data
    const receiptData = {
      receiptId: `REC-${order.id.substring(0, 8)}`,
      invoiceId: `INV-${order.id.substring(0, 8)}`,
      orderId: order.orderId,
      transactionId,
      customerName: user.name,
      customerEmail: user.email,
      paymentDate: paymentDate.toISOString(),
      invoiceDate: order.createdAt,
      planName: order.planName,
      amount: order.total,
      status: 'paid',
      paymentMethod: 'Manual Bank Transfer',
      receiptItems: [
        {
          description: `${order.planName} Subscription`,
          quantity: 1,
          unitPrice: order.total,
          total: order.total
        }
      ],
      subtotal: order.total,
      discount: 0,
      tax: 0,
      total: order.total,
      message: "Thank you for your payment. This is a simulated receipt download.",
      companyDetails: {
        name: "NextGen RDP Services",
        address: "123 Server Avenue, Cloud District",
        email: "billing@nextgenrdp.com",
        phone: "+1 (555) 123-4567"
      }
    };
    
    return NextResponse.json(receiptData);
    
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