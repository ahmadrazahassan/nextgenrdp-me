import prisma from '@/lib/db';

/**
 * Get all users
 */
export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      lastLogin: true,
      emailVerified: true,
      accountLocked: true,
      failedLoginAttempts: true,
      isAdmin: true,
      _count: {
        select: {
          orders: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
      emailVerified: true,
      accountLocked: true,
      failedLoginAttempts: true,
      isAdmin: true,
      _count: {
        select: {
          orders: true
        }
      }
    }
  });
}

/**
 * Get user with orders
 */
export async function getUserWithOrders(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      lastLogin: true,
      emailVerified: true,
      accountLocked: true,
      failedLoginAttempts: true,
      isAdmin: true,
      orders: {
        select: {
          id: true,
          orderId: true,
          planName: true,
          status: true,
          total: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(userId: string) {
  return prisma.authAuditLog.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });
}

/**
 * Update user
 */
export async function updateUser(id: string, data: {
  fullName?: string;
  emailVerified?: boolean;
  accountLocked?: boolean;
  failedLoginAttempts?: number;
  isAdmin?: boolean;
}) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      lastLogin: true,
      emailVerified: true,
      accountLocked: true,
      failedLoginAttempts: true,
      isAdmin: true
    }
  });
}

/**
 * Reset a user's password
 */
export async function resetUserPassword(id: string, newPasswordHash: string) {
  return prisma.user.update({
    where: { id },
    data: {
      passwordHash: newPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id }
  });
}

/**
 * Count active services for user
 */
export async function countActiveServices(userId: string) {
  return prisma.order.count({
    where: {
      userId,
      status: 'active'
    }
  });
}

/**
 * Get user dashboard stats
 */
export async function getUserStats() {
  const totalUsers = await prisma.user.count();
  const newUsersLastMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    }
  });
  const newUsersPreviousMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        lt: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    }
  });

  // Calculate growth rate
  const userGrowth = newUsersPreviousMonth > 0 
    ? ((newUsersLastMonth - newUsersPreviousMonth) / newUsersPreviousMonth) * 100 
    : 0;

  return {
    totalUsers,
    newUsersLastMonth,
    userGrowth
  };
} 