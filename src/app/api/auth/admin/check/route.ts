import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { verifyAdmin } from '@/lib/authUtils';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    
    if (!isAdmin) {
      return NextResponse.json(
        { isAdmin: false, message: 'User is not authenticated as admin' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ 
      isAdmin: true,
      message: 'User is authenticated as admin'
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
} 