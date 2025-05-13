import prisma from '@/lib/db';

/**
 * Get all orders
 */
export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      }
    }
  });
}

/**
 * Get order by order ID
 */
export async function getOrderByOrderId(orderId: string) {
  return prisma.order.findUnique({
    where: { orderId },
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      }
    }
  });
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 5) {
  return prisma.order.findMany({
    take: limit,
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Initialize order with credentials
 */
export async function initializeOrder(
  id: string, 
  data: {
    ipAddress: string;
    username: string;
    password: string;
    expiryDate: Date;
    isInitialized: boolean;
    status: string;
  }
) {
  return prisma.order.update({
    where: { id },
    data
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status }
  });
}

/**
 * Update order details
 */
export async function updateOrder(
  id: string, 
  data: {
    status?: string;
    ipAddress?: string;
    username?: string;
    password?: string;
    expiryDate?: Date;
    isInitialized?: boolean;
  }
) {
  return prisma.order.update({
    where: { id },
    data
  });
}

/**
 * Delete order
 */
export async function deleteOrder(id: string) {
  return prisma.order.delete({
    where: { id }
  });
}

/**
 * Get order stats
 */
export async function getOrderStats() {
  const totalOrders = await prisma.order.count();
  const activeServices = await prisma.order.count({
    where: { status: 'active' }
  });
  const pendingOrders = await prisma.order.count({
    where: { status: 'pending' }
  });
  const pendingInitializations = await prisma.order.count({
    where: {
      OR: [
        { status: 'pending' },
        { status: 'processing' }
      ],
      isInitialized: false
    }
  });

  // Calculate revenue stats
  const allOrders = await prisma.order.findMany({
    select: {
      total: true,
      createdAt: true
    }
  });

  // Calculate total revenue
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

  // Calculate revenue for last month
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthRevenue = allOrders
    .filter(order => order.createdAt > lastMonth)
    .reduce((sum, order) => sum + order.total, 0);

  // Calculate revenue for previous month
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 2);
  const previousMonthRevenue = allOrders
    .filter(order => order.createdAt > previousMonth && order.createdAt < lastMonth)
    .reduce((sum, order) => sum + order.total, 0);

  // Calculate growth rate
  const revenueGrowth = previousMonthRevenue > 0 
    ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
    : 0;

  return {
    totalOrders,
    activeServices,
    pendingOrders,
    pendingInitializations,
    totalRevenue,
    revenueGrowth
  };
}

/**
 * Get complete dashboard data
 */
export async function getDashboardData() {
  const stats = await getOrderStats();
  const recentOrders = await getRecentOrders(5);
  
  const formattedOrders = recentOrders.map(order => ({
    id: order.id,
    orderId: order.orderId,
    planName: order.planName,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    customerName: order.user.fullName || 'Unknown',
    customerEmail: order.user.email
  }));

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      emailVerified: true,
      accountLocked: true,
      _count: {
        select: {
          orders: true
        }
      }
    }
  });

  const formattedUsers = recentUsers.map(user => ({
    id: user.id,
    name: user.fullName || 'Unknown',
    email: user.email,
    joinDate: user.createdAt.toISOString(),
    status: user.accountLocked ? 'inactive' : (user.emailVerified ? 'active' : 'unverified'),
    orders: user._count.orders
  }));

  return {
    ...stats,
    recentOrders: formattedOrders,
    recentUsers: formattedUsers
  };
} 