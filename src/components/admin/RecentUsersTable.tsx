"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Check, AlertTriangle, Mail, Package, Users } from "lucide-react";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: string;
  orders: number;
}

interface RecentUsersTableProps {
  users?: User[];
}

export function RecentUsersTable({ users = [] }: RecentUsersTableProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
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
      case "inactive":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 font-medium shadow-sm px-2.5 py-0.5">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 font-medium shadow-sm px-2.5 py-0.5">
            {status}
          </Badge>
        );
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="h-20 w-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-5 shadow-inner border border-gray-200">
          <Users className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">No Recent Users</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          New users will appear here once they register
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 bg-blue-100 text-blue-600 border border-blue-200 shadow-sm">
              <AvatarFallback className="font-semibold">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                {user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full px-2.5 py-1 text-xs font-medium text-purple-700 flex items-center border border-purple-200 shadow-sm">
                <Package className="h-3 w-3 mr-1.5 text-purple-600" />
                <span>{user.orders}</span>
              </div>
            </div>
            <div>{getStatusBadge(user.status)}</div>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-full shadow-sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="text-center pt-2">
        <Button variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 px-5 py-2 shadow-sm">
          View all users
        </Button>
      </div>
    </div>
  );
} 