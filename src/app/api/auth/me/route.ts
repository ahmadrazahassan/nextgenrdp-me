// File: src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Auth/me endpoint called');
    
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      console.log('[API] Auth/me check failed: No token found');
      return NextResponse.json(
        { 
          isLoggedIn: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }
    
    try {
      // Verify the token
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // If we can successfully decode the token, we'll consider the user logged in
      // even without database verification (for simplicity)
      const userId = payload.sub?.toString();
      
      if (!userId) {
        console.log('[API] Auth/me check failed: Invalid token (no subject)');
        return NextResponse.json(
          { isLoggedIn: false, error: 'Invalid token' },
          { status: 401 }
        );
      }
      
      // Try to get user from database
      let user;
      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            fullName: true,
            emailVerified: true,
            isAdmin: true,
            lastLogin: true,
            createdAt: true
          }
        });
      } catch (dbError) {
        // If database is down or error occurs, extract basic user info from token
        console.warn('[API] Database error, using token data instead:', dbError);
        user = {
          id: userId,
          email: payload.email as string || 'user@example.com',
          fullName: payload.fullName as string || 'User',
          emailVerified: payload.emailVerified as boolean || false,
          isAdmin: payload.isAdmin as boolean || false,
          lastLogin: new Date(),
          createdAt: new Date()
        };
      }
      
      if (!user) {
        // Create fallback user data from token
        user = {
          id: userId,
          email: payload.email as string || 'user@example.com',
          fullName: payload.fullName as string || 'User',
          emailVerified: payload.emailVerified as boolean || false,
          isAdmin: payload.isAdmin as boolean || false,
          lastLogin: new Date(),
          createdAt: new Date()
        };
      }
      
      console.log(`[API] Auth/me check successful for user: ${user.id}`);
      
      return NextResponse.json({
        isLoggedIn: true,
        user: user
      });
      
    } catch (error) {
      console.error('[API] Token verification failed:', error);
      
      // Clear the invalid cookie
      const response = NextResponse.json(
        { isLoggedIn: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      
      return response;
    }
    
  } catch (error) {
    console.error('[API] Error in auth/me:', error);
    return NextResponse.json(
      { isLoggedIn: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}