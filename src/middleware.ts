// File: src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose instead of jsonwebtoken

// Define public routes that don't require authentication
const publicRoutes = [
  '/',                 // Homepage
  '/plans',
  '/pricing',
  '/support',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/faq',
  '/terms',
  '/privacy',
  '/help',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/check',
  '/api/auth/me',
  '/api/auth/admin/check',
  '/images/',
  '/favicon.ico',
  '/_next', // Add Next.js internal routes as public
  '/public/'
];

// Define admin-only routes
const adminRoutes = [
  '/admin'
];

// Routes that REQUIRE authentication
const protectedRoutes = [
  '/dashboard',
  '/account',
  '/orders',
  '/billing',
  '/profile',
  '/settings'
];

// JWT Secret (should match the one used to sign tokens)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  console.log(`[Middleware] Processing request for: ${pathname}`);
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Check if the path is a protected route that requires authentication
  const requiresAuth = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Check if the path is an admin-only route
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // If it's a public route, allow access without authentication
  if (isPublicRoute) {
    console.log(`[Middleware] Public route access granted: ${pathname}`);
    return NextResponse.next();
  }
  
  // If it's not a protected route and not an admin route, allow access without authentication
  if (!requiresAuth && !isAdminRoute) {
    console.log(`[Middleware] Non-protected route access granted: ${pathname}`);
    return NextResponse.next();
  }
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Check if the user is authenticated (only for routes that require auth)
  if (!token) {
    // Not authenticated, redirect to login (only for non-API routes)
    if (!pathname.startsWith('/api/')) {
      console.log(`[Middleware] Access denied. No token found. Redirecting to login from: ${pathname}`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Store the original destination
      return NextResponse.redirect(loginUrl);
    }
    
    // For API routes, return 401 Unauthorized
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
  
  try {
    // Verify the token using jose instead of jsonwebtoken
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }
    
    // Get the user ID from the token
    const userId = payload.sub || payload.id;
    
    if (!userId) {
      throw new Error('Invalid token: No user ID found');
    }
    
    // For admin routes, check if the user is an admin
    if (isAdminRoute && !payload.isAdmin) {
      console.log(`[Middleware] Admin access denied for user ${userId} to route: ${pathname}`);
      // Redirect non-admin users to dashboard
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    
    // User is authenticated, allow access
    console.log(`[Middleware] Access granted for user ${userId} to route: ${pathname}`);
    
    // Set a custom header with user info for backend routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId.toString());
    
    // Continue with the request, passing the user ID to the backend
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // For protected routes only, redirect to login on invalid token
    if (requiresAuth || isAdminRoute) {
      // Invalid token, redirect to login
      console.error(`[Middleware] Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Clear the invalid auth token cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      
      return response;
    }
    
    // For non-protected routes, still allow access even with invalid token
    console.log(`[Middleware] Non-critical token verification failed for non-protected route: ${pathname}`);
    return NextResponse.next();
  }
}

// Configure the middleware to match all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 