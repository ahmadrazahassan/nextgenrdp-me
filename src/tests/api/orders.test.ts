/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/orders/sample-route';
import { AuthUser } from '@/lib/simpleAuth';
import { createApiError } from '@/lib/apiErrorHandler';
import prisma from '@/lib/db';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  order: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn()
  },
  $transaction: jest.fn((promises) => Promise.all(promises))
}));

jest.mock('@/lib/simpleAuth', () => ({
  withApiAuth: jest.fn((handler) => {
    return async (req: NextRequest) => {
      // For testing, we'll simulate the authentication ourselves
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        fullName: 'Test User',
        emailVerified: true,
        isAdmin: false
      };
      
      return handler(req, mockUser);
    };
  })
}));

jest.mock('@/lib/apiErrorHandler', () => ({
  createApiSuccess: jest.fn((data, status = 200) => {
    return Response.json(
      { success: true, data },
      { status }
    );
  }),
  createApiError: jest.fn((type, message) => {
    return Response.json(
      { success: false, error: message },
      { status: 401 }
    );
  }),
  withErrorHandling: jest.fn((handler) => handler)
}));

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET', () => {
    it('should return paginated orders', async () => {
      // Mock data
      const mockOrders = [
        { id: '1', orderId: 'ORDER-1', planName: 'Basic VPS', status: 'active', total: 100 },
        { id: '2', orderId: 'ORDER-2', planName: 'Premium RDP', status: 'pending', total: 200 }
      ];
      
      // Setup mocks
      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prisma.order.count as jest.Mock).mockResolvedValue(2);
      
      // Create a mock request
      const req = new NextRequest('http://localhost:3000/api/orders?limit=10&page=1');
      
      // Call the API
      const response = await GET(req);
      const result = await response.json();
      
      // Assertions
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.orders).toEqual(mockOrders);
      expect(result.data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        pages: 1
      });
    });
  });
  
  describe('POST', () => {
    it('should create a new order', async () => {
      // Mock created order
      const mockOrder = {
        id: 'new-id',
        orderId: 'VPS-123456-789012',
        userId: 'test-user-id',
        planId: 'vps-basic',
        planName: 'Basic VPS',
        status: 'pending',
        total: 100
      };
      
      // Setup mocks
      (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);
      
      // Create a mock request with order data
      const req = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          planId: 'vps-basic',
          planName: 'Basic VPS',
          quantity: 1,
          duration: 1,
          location: 'US East',
          paymentMethod: 'wise',
          total: 100
        })
      });
      
      // Call the API
      const response = await POST(req);
      const result = await response.json();
      
      // Assertions
      expect(response.status).toBe(201);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrder);
      expect(prisma.order.create).toHaveBeenCalledTimes(1);
    });
  });
}); 