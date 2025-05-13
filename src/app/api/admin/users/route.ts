import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, countActiveServices } from '@/repositories/userRepository';
import { verifyAdmin } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication using authUtils
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 401 }
      );
    }
    
    // Get all users
    const users = await getAllUsers();
    
    // Get active services count for each user
    const usersWithServices = await Promise.all(
      users.map(async (user) => {
        const activeServices = await countActiveServices(user.id);
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName || 'Unknown',
          createdAt: user.createdAt.toISOString(),
          lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
          emailVerified: user.emailVerified,
          accountLocked: user.accountLocked,
          failedLoginAttempts: user.failedLoginAttempts,
          isAdmin: user.isAdmin,
          orderCount: user._count.orders,
          activeServices
        };
      })
    );
    
    return NextResponse.json(usersWithServices);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 