import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/repositories/orderRepository';
import { verifyAdmin } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get all orders
    const orders = await getAllOrders();
    
    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderId: order.orderId,
      userId: order.userId,
      planName: order.planName,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      location: order.location,
      locationCode: order.locationCode,
      paymentMethod: order.paymentMethod,
      customerName: order.user?.fullName || 'Unknown',
      customerEmail: order.user?.email || '',
      isInitialized: order.isInitialized,
      ipAddress: order.ipAddress,
      username: order.username,
      password: order.password,
      expiryDate: order.expiryDate?.toISOString()
    }));
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 