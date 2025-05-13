"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCcw, Check, Clock, XCircle, AlertCircle, Package } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  orderId: string;
  planName: string;
  status: string;
  total: number;
  createdAt: string;
  customerName: string;
}

interface RecentOrdersTableProps {
  orders?: Order[];
}

export function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Get badge styling based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 font-medium shadow-sm px-2.5 py-0.5">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 font-medium shadow-sm px-2.5 py-0.5">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 font-medium shadow-sm px-2.5 py-0.5">
            <RefreshCcw className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 font-medium shadow-sm px-2.5 py-0.5">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 font-medium shadow-sm px-2.5 py-0.5">
            <AlertCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="h-20 w-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-5 shadow-inner border border-gray-200">
          <Package className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">No Recent Orders</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          New orders will appear here as they come in
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">{order.customerName}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-blue-600 font-medium">#{order.orderId}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">{order.planName}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>{getStatusBadge(order.status)}</div>
            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              PKR {order.total.toLocaleString()}
            </div>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-full shadow-sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="text-center pt-2">
        <Button variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 px-5 py-2 shadow-sm">
          View all orders
        </Button>
      </div>
    </div>
  );
} 