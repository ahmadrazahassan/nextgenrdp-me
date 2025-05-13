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
  { params }: { params: { invoiceId: string } }
) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const { invoiceId } = params;
  
  try {
    if (!invoiceId) {
      throw new ApiError('Invoice ID is required', 400, 'MISSING_INVOICE_ID');
    }
    
    // --- Authentication --- 
    const user = await getCurrentUser(request);
    if (!user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    console.log(`[${requestId}] Authenticated user: ${user.id} downloading invoice ${invoiceId}`);
    
    // Extract order ID from invoice ID (removing 'INV-' prefix)
    const orderId = invoiceId.replace('INV-', '');
    
    // Find the corresponding order
    const order = await prisma.order.findFirst({
      where: {
        id: { startsWith: orderId },
        userId: user.id
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
      throw new ApiError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    // In a real application, you would generate a PDF here using a library
    // like PDFKit or jsPDF and return it as a stream
    // For now, we'll just return a JSON response simulating the PDF generation
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Processed GET /api/user/billing/invoices/${invoiceId}/download in ${duration}ms`);
    
    // Simulate PDF generation by creating invoice data
    const invoiceData = {
      invoiceId,
      orderId: order.orderId,
      customerName: user.name,
      customerEmail: user.email,
      invoiceDate: order.createdAt,
      planName: order.planName,
      amount: order.total,
      status: order.status === 'active' ? 'paid' : order.status,
      paymentMethod: 'Manual Bank Transfer',
      invoiceItems: [
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
      message: "This is a simulated invoice download. In a real application, this would return a PDF file."
    };
    
    return NextResponse.json(invoiceData);
    
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