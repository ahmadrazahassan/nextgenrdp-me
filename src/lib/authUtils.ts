import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

// Helper function to verify admin
export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return false;
  }
  
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return Boolean(payload.isAdmin);
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}

// Helper function to verify token and get payload
export async function verifyToken(token: string): Promise<any | null> {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set.");
    return null;
  }
  
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error: any) {
    // Log different types of JWT errors
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.log("Token verification failed: Expired");
    } else if (error.code === 'ERR_JWS_INVALID' || error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      console.warn("Token verification failed: Invalid signature/format");
    } else {
      console.error("Token verification error:", error.message);
    }
    return null;
  }
}

// Helper function to check if user is authenticated
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return false;
  }
  
  const payload = await verifyToken(token);
  return !!payload;
} 