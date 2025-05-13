import { NextRequest, NextResponse } from 'next/server';
import { initializeOrder, getOrderById } from '@/repositories/orderRepository';
import { verifyAdmin } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { orderId, ipAddress, username, password, expiryDate, notes } = body;
    
    // Validate required fields
    if (!orderId || !ipAddress || !username || !password || !expiryDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the order
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Ensure order can be initialized
    if (order.isInitialized) {
      return NextResponse.json(
        { error: 'Order is already initialized' },
        { status: 400 }
      );
    }
    
    if (order.status !== 'pending' && order.status !== 'processing') {
      return NextResponse.json(
        { error: 'Order cannot be initialized in its current status' },
        { status: 400 }
      );
    }
    
    // Initialize the order
    const initializedOrder = await initializeOrder(orderId, {
      ipAddress,
      username,
      password,
      expiryDate: new Date(expiryDate),
      isInitialized: true,
      status: 'active'
    });
    
    // Format the response
    const formattedOrder = {
      id: initializedOrder.id,
      orderId: initializedOrder.orderId,
      userId: initializedOrder.userId,
      planName: initializedOrder.planName,
      status: initializedOrder.status,
      total: initializedOrder.total,
      createdAt: initializedOrder.createdAt.toISOString(),
      location: initializedOrder.location,
      locationCode: initializedOrder.locationCode,
      paymentMethod: initializedOrder.paymentMethod,
      customerName: order.user?.fullName || 'Unknown',
      customerEmail: order.user?.email || '',
      isInitialized: initializedOrder.isInitialized,
      ipAddress: initializedOrder.ipAddress,
      username: initializedOrder.username,
      password: initializedOrder.password,
      expiryDate: initializedOrder.expiryDate?.toISOString(),
      notes: notes
    };
    
    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error initializing order:', error);
    return NextResponse.json(
      { error: 'Failed to initialize order' },
      { status: 500 }
    );
  }
} 