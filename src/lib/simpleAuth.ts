import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { createApiError } from './apiErrorHandler';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'BgrOn4i1JGauECWtFO9L';

/**
 * Get user from JWT token
 */
export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id?: string; 
      sub?: string;
    };
    
    // Get the user ID from token (supporting both 'id' and 'sub' claims)
    const userId = decoded.id || decoded.sub;
    
    if (!userId) {
      return null;
    }
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        isAdmin: true
      }
    });
    
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

/**
 * Get current user from request (for API routes)
 */
export async function getCurrentUser(req: NextRequest): Promise<AuthUser | null> {
  // Get token from cookies
  const token = req.cookies.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }
  
  return getUserFromToken(token);
}

/**
 * Create a Higher Order Function that protects API routes
 */
export function withApiAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<Response>,
  options: { 
    adminOnly?: boolean 
  } = {}
) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return createApiError('UNAUTHORIZED', 'Authentication required');
    }
    
    if (options.adminOnly && !user.isAdmin) {
      return createApiError('FORBIDDEN', 'Admin access required');
    }
    
    return handler(req, user);
  };
}

/**
 * Log authentication events to database
 */
export async function logAuthEvent(
  eventType: string,
  userId: string | null,
  ipAddress?: string | null,
  userAgent?: string | null,
  details?: any
) {
  try {
    return await prisma.authAuditLog.create({
      data: {
        eventType,
        userId,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        details: details ? details : undefined
      }
    });
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
} 