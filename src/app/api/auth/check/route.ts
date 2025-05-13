import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Auth check requested');
    
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;
    
    if (!token) {
      console.log('[API] Auth check failed: No token found');
      return NextResponse.json(
        { 
          authenticated: false, 
          error: "No authentication token",
          redirectTo: '/login'
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Pragma': 'no-cache'
          }
        }
      );
    }
    
    try {
      // Verify the token using jose
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.log('[API] Auth check failed: Token expired');
        return NextResponse.json(
          { 
            authenticated: false, 
            error: "Token expired",
            redirectTo: '/login'
          },
          { 
            status: 401,
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache'
            }
          }
        );
      }
      
      // Get user ID from token (supporting both 'sub' and 'id' claims)
      const userId = payload.sub || payload.id;
      
      if (!userId) {
        console.log('[API] Auth check failed: Invalid token format (no user ID)');
        return NextResponse.json(
          { 
            authenticated: false, 
            error: "Invalid token format",
            redirectTo: '/login'
          },
          { 
            status: 401,
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache'
            }
          }
        );
      }
      
      console.log(`[API] Checking user ID: ${userId}`);
      
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { id: userId.toString() },
        select: {
          id: true,
          email: true,
          fullName: true,
          emailVerified: true,
          isAdmin: true,
          accountLocked: true
        }
      });
      
      if (!user) {
        console.log(`[API] Auth check failed: User not found for ID: ${userId}`);
        return NextResponse.json(
          { 
            authenticated: false, 
            error: "User not found",
            redirectTo: '/login'
          },
          { 
            status: 401,
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache'
            }
          }
        );
      }
      
      // Check if account is locked
      if (user.accountLocked) {
        console.log(`[API] Auth check failed: Account locked for user: ${userId}`);
        return NextResponse.json(
          { 
            authenticated: false, 
            error: "Account locked",
            redirectTo: '/login'
          },
          { 
            status: 403,
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache'
            }
          }
        );
      }
      
      // User is authenticated
      console.log(`[API] Auth check successful for user: ${userId}`);
      
      // Update user's last activity timestamp (optional)
      try {
        await prisma.user.update({
          where: { id: userId.toString() },
          data: { lastLogin: new Date() }
        });
      } catch (updateError) {
        // Non-critical error, just log it
        console.warn(`[API] Failed to update last login for user ${userId}:`, updateError);
      }
      
      return NextResponse.json(
        { 
          authenticated: true, 
          isLoggedIn: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            emailVerified: user.emailVerified,
            isAdmin: user.isAdmin
          } 
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Pragma': 'no-cache'
          }
        }
      );
      
    } catch (verifyError) {
      console.error("[API] Token verification error:", verifyError);
      
      return NextResponse.json(
        { 
          authenticated: false, 
          error: "Invalid token",
          redirectTo: '/login'
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Pragma': 'no-cache'
          }
        }
      );
    }
  } catch (error) {
    console.error("[API] Auth check error:", error);
    
    return NextResponse.json(
      { 
        authenticated: false, 
        error: "Authentication check failed",
        redirectTo: '/login'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache'
        }
      }
    );
  }
} 