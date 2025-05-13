// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('[API /auth/logout] Logout request received.');
    try {
        // Create response
        const response = NextResponse.json({ 
            success: true,
            message: 'Logged out successfully'
        });
        
        // Clear auth_token cookie
        response.cookies.delete('auth_token');
        
        return response;
    } catch (error: any) {
        console.error('[API /auth/logout] Error during logout:', error);
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        );
    }
}