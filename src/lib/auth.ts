// src/lib/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { createApiError } from './apiErrorHandler';

const prismaClient = new PrismaClient();

// Constants
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
const JWT_SECRET = process.env.JWT_SECRET || 'BgrOn4i1JGauECWtFO9L'; // Use env variable or fallback

// Password hashing with Argon2id (superior to bcrypt)
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id, // Most secure variant
    memoryCost: 2 ** 16, // 64 MiB
    timeCost: 3, // 3 iterations
    parallelism: 1, // 1 thread
    saltLength: 16, // 16 bytes salt
  });
}

// Password verification
export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

// Generate JWT tokens
export function generateTokens(user: User) {
  // Create payload with minimal user info
  const payload = {
    sub: user.id,
    email: user.email,
    verified: user.emailVerified,
  };

  // Generate access token
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  // Generate refresh token (with unique ID)
  const refreshToken = jwt.sign(
    { ...payload, jti: uuidv4() },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

// Store refresh token in database
export async function storeRefreshToken(
  userId: string,
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Calculate expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  // Store in database
  return prismaClient.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
      ipAddress,
      userAgent,
      isValid: true,
    },
  });
}

// Validate refresh token
export async function validateRefreshToken(token: string) {
  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    // Find token in database
    const session = await prismaClient.session.findFirst({
      where: {
        userId: decoded.sub as string,
        refreshToken: token,
        isValid: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error validating refresh token:', error);
    return null;
  }
}

// Invalidate refresh token (on logout)
export async function invalidateRefreshToken(token: string) {
  try {
    // Find and update the session
    return prismaClient.session.updateMany({
      where: {
        refreshToken: token,
      },
      data: {
        isValid: false,
      },
    });
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
    throw error;
  }
}

// Set auth cookies
export function setAuthCookies(
  res: NextApiResponse,
  accessToken: string,
  refreshToken: string
) {
  // Set access token cookie (short-lived)
  res.setHeader('Set-Cookie', [
    cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    }),
    // Set refresh token cookie (longer-lived)
    cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    }),
  ]);
}

// Clear auth cookies
export function clearAuthCookies(res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    cookie.serialize('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    }),
    cookie.serialize('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    }),
  ]);
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
}

/**
 * Get the current authenticated user from the request
 * @param req NextRequest object (optional, only needed for API routes)
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser(req?: NextRequest): Promise<AuthUser | null> {
  try {
    // Get token from cookies based on context (API route or Server Component)
    let token: string | undefined;
    
    if (req) {
      // For API routes, get token from request cookies
      token = req.cookies.get('auth_token')?.value;
    } else {
      // For Server Components, use the cookies() function
      const cookiesList = await cookies();
      token = cookiesList.get('auth_token')?.value;
    }
    
    if (!token) {
      return null;
    }
    
    const jwtSecret = process.env.JWT_SECRET || 'BgrOn4i1JGauECWtFO9L';
    
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, jwtSecret) as { 
        id?: string;
        sub?: string;
        email?: string;
      };
      
      // Support both 'id' and 'sub' claim formats
      const userId = decoded.id || decoded.sub;
      
      if (!userId) {
        return null;
      }
      
      // Fetch user from database with minimal fields
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
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Authentication middleware for API routes
 * @param handler API route handler function
 * @param options Authentication options
 * @returns NextResponse
 */
export function withAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<Response>,
  options: { 
    adminOnly?: boolean;
    emailVerifiedRequired?: boolean;
  } = {}
) {
  return async (req: NextRequest) => {
    const { adminOnly = false, emailVerifiedRequired = false } = options;
    
    const user = await getCurrentUser(req);
    
    if (!user) {
      return createApiError('UNAUTHORIZED', 'Authentication required');
    }
    
    if (adminOnly && !user.isAdmin) {
      return createApiError('FORBIDDEN', 'Admin access required');
    }
    
    if (emailVerifiedRequired && !user.emailVerified) {
      return createApiError('FORBIDDEN', 'Email verification required');
    }
    
    return handler(req, user);
  };
}

/**
 * Helper function to check if the current user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true }
    });
    
    return !!user?.isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Log authentication event
 */
export async function logAuthEvent(
  userId: string | null,
  eventType: string, 
  ipAddress?: string,
  userAgent?: string,
  details?: any
) {
  return prisma.authAuditLog.create({
    data: {
      userId,
      eventType,
      ipAddress,
      userAgent,
      details,
    }
  });
}

// Rate limiting implementation
const loginAttempts = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_LOGIN_ATTEMPTS = 5; // 5 attempts per minute

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  // If no record exists or window has expired, create new record
  if (!record || now > record.resetTime) {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false; // Not rate limited
  }

  // Increment attempt count
  record.count += 1;
  
  // Check if rate limited
  if (record.count > MAX_LOGIN_ATTEMPTS) {
    return true; // Rate limited
  }

  return false; // Not rate limited
}

// Clean up expired rate limit records (call periodically)
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now > value.resetTime) {
      loginAttempts.delete(key);
    }
  }
}
