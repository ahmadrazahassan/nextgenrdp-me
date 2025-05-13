"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  date: string;
  status: 'pending' | 'paid' | 'processing' | 'active' | 'cancelled' | 'expired';
  amount: string;
}

// Sample data for demonstration
const recentOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    customer: 'John Doe',
    product: 'VPS Basic Plan',
    date: '2025-05-01',
    status: 'paid',
    amount: '$25.99',
  },
  {
    id: '2',
    orderId: 'ORD-002',
    customer: 'Jane Smith',
    product: 'RDP Standard Plan',
    date: '2025-05-05',
    status: 'processing',
    amount: '$49.99',
  },
  {
    id: '3',
    orderId: 'ORD-003',
    customer: 'Bob Johnson',
    product: 'VPS Premium Plan',
    date: '2025-05-07',
    status: 'active',
    amount: '$79.99',
  },
  {
    id: '4',
    orderId: 'ORD-004',
    customer: 'Alice Brown',
    product: 'RDP Basic Plan',
    date: '2025-05-08',
    status: 'pending',
    amount: '$19.99',
  },
  {
    id: '5',
    orderId: 'ORD-005',
    customer: 'Charlie Wilson',
    product: 'VPS Standard Plan',
    date: '2025-05-10',
    status: 'cancelled',
    amount: '$59.99',
  },
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'paid':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'active':
      return 'default';
    case 'cancelled':
      return 'destructive';
    case 'expired':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function RecentOrdersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>A list of recent orders across your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium">Order ID</th>
                <th className="py-3 text-left font-medium">Customer</th>
                <th className="py-3 text-left font-medium">Product</th>
                <th className="py-3 text-left font-medium">Date</th>
                <th className="py-3 text-left font-medium">Status</th>
                <th className="py-3 text-left font-medium">Amount</th>
                <th className="py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3">{order.orderId}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3">{order.product}</td>
                  <td className="py-3">{order.date}</td>
                  <td className="py-3">
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3">{order.amount}</td>
                  <td className="py-3">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 