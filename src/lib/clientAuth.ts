import { jwtDecode } from 'jwt-decode';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
}

/**
 * Parse cookies from document.cookie string
 */
function parseCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  
  return document.cookie
    .split(';')
    .reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=').map(c => c.trim());
      if (name) cookies[name] = value || '';
      return cookies;
    }, {} as Record<string, string>);
}

/**
 * Utility to determine if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    if (!decoded.exp) return true;
    
    // Add a 30-second buffer to account for clock differences
    const now = Math.floor(Date.now() / 1000) + 30;
    return decoded.exp < now;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't decode it, consider it expired
  }
}

/**
 * Client-side function to get the current user from cookies
 * This does not validate the token with the server - only decodes it
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Get token from client-side cookies
    const cookies = parseCookies();
    const token = cookies['auth_token'];
    
    if (!token) {
      console.log('[clientAuth] No auth token found in cookies');
      return null;
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('[clientAuth] Auth token expired');
      return null;
    }
    
    // Decode the token (no validation on client side)
    const decoded = jwtDecode<{ 
      id?: string;
      sub?: string;
      email?: string;
      fullName?: string | null;
      emailVerified?: boolean;
      isAdmin?: boolean;
    }>(token);
    
    // Support both 'id' and 'sub' claim formats
    const userId = decoded.id || decoded.sub;
    
    if (!userId) {
      console.log('[clientAuth] No user ID found in token');
      return null;
    }
    
    // Return user data from token claims
    return {
      id: userId,
      email: decoded.email || '',
      fullName: decoded.fullName || null,
      emailVerified: decoded.emailVerified || false,
      isAdmin: decoded.isAdmin || false
    };
  } catch (error) {
    console.error('[clientAuth] Error getting current user:', error);
    return null;
  }
}

/**
 * Check if the user is logged in
 */
export function isLoggedIn(): boolean {
  try {
    const cookies = parseCookies();
    const token = cookies['auth_token'];
    
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    return !isTokenExpired(token);
  } catch (error) {
    console.error('[clientAuth] Error checking login status:', error);
    return false;
  }
}

/**
 * Safely redirect to login page with appropriate parameters
 */
export function redirectToLogin(currentPath?: string): void {
  // Construct login URL with redirect parameter if path is provided
  let loginUrl = '/login';
  if (currentPath && currentPath !== '/login' && !currentPath.includes('/api/')) {
    loginUrl += `?redirect=${encodeURIComponent(currentPath)}`;
  }
  
  // Use window.location for more reliable navigation
  window.location.href = loginUrl;
}

/**
 * Logout the user by removing the auth cookie and redirecting
 */
export function logout(redirectPath = '/login'): void {
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = redirectPath;
}

/**
 * Verify authentication with server
 * This makes an API call to verify the token with the server
 */
export async function verifyAuthWithServer(): Promise<AuthUser | null> {
  try {
    console.log('[clientAuth] Verifying authentication with server...');
    
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
      credentials: 'include' // Include cookies
    });
    
    if (!response.ok) {
      console.log('[clientAuth] Auth verification failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.authenticated || !data.user) {
      console.log('[clientAuth] Not authenticated according to server');
      return null;
    }
    
    console.log('[clientAuth] Server authentication successful');
    return data.user as AuthUser;
  } catch (error) {
    console.error('[clientAuth] Error verifying authentication with server:', error);
    return null;
  }
}

/**
 * Initialize authentication by checking both local token and server verification
 * Returns user data if authentication is valid, null otherwise
 */
export async function initializeAuth(forceServerCheck = false): Promise<AuthUser | null> {
  // First do a quick check with the client-side token
  if (!isLoggedIn() && !forceServerCheck) {
    console.log('[clientAuth] Client-side token check failed, user not logged in');
    return null;
  }
  
  // If client-side check passed or we're forcing a server check, verify with server
  try {
    const user = await verifyAuthWithServer();
    if (!user) {
      console.log('[clientAuth] Server verification failed');
      logout(); // Clear invalid token and redirect
      return null;
    }
    return user;
  } catch (error) {
    console.error('[clientAuth] Error initializing auth:', error);
    return null;
  }
} 