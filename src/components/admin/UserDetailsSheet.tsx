"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Package,
  Server,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  AlertTriangle,
  Shield,
  Edit,
  RefreshCw,
  Check,
  Key,
  FileText,
  Activity,
  Image,
  ExternalLink,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";

// Define user interface
interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLogin: string | null;
  emailVerified: boolean;
  accountLocked: boolean;
  failedLoginAttempts: number;
  isAdmin: boolean;
  orderCount: number;
  activeServices: number;
}

// Mock orders for the user
interface UserOrder {
  id: string;
  orderId: string;
  planName: string;
  status: string;
  total: number;
  createdAt: string;
}

// Mock activity logs for the user
interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  success: boolean;
}

interface UserDetailsSheetProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
}

export function UserDetailsSheet({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: UserDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [showResetPasswordOptions, setShowResetPasswordOptions] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Mock orders data for display
  const userOrders: UserOrder[] = [
    {
      id: "1",
      orderId: "NGR-16998754321",
      planName: "Windows RDP Premium",
      status: "active",
      total: 25000,
      createdAt: "2023-10-15T14:23:45Z",
    },
    {
      id: "2",
      orderId: "NGR-16997850123",
      planName: "Windows RDP Starter",
      status: "completed",
      total: 8000,
      createdAt: "2023-09-10T08:14:56Z",
    },
    {
      id: "3",
      orderId: "NGR-16996123456",
      planName: "VPS Basic",
      status: "cancelled",
      total: 12000,
      createdAt: "2023-08-05T09:12:30Z",
    },
  ];

  // Mock activity logs data for display
  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      action: "Login",
      timestamp: "2023-11-15T09:12:30Z",
      ipAddress: "198.51.100.42",
      details: "User logged in successfully",
      success: true,
    },
    {
      id: "2",
      action: "Order Created",
      timestamp: "2023-10-15T14:23:45Z",
      ipAddress: "198.51.100.42",
      details: "Created order NGR-16998754321",
      success: true,
    },
    {
      id: "3",
      action: "Password Reset",
      timestamp: "2023-09-20T16:45:12Z",
      ipAddress: "198.51.100.42",
      details: "User requested password reset",
      success: true,
    },
    {
      id: "4",
      action: "Login Failed",
      timestamp: "2023-09-19T10:32:18Z",
      ipAddress: "203.0.113.25",
      details: "Incorrect password",
      success: false,
    },
    {
      id: "5",
      action: "Profile Updated",
      timestamp: "2023-08-25T11:45:30Z",
      ipAddress: "198.51.100.42",
      details: "User updated profile information",
      success: true,
    },
  ];

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle saving edited user
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, you would make an API call here
      // const response = await fetch(`/api/admin/users/${user.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editedUser),
      // });
      
      // const data = await response.json();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the update handler with the edited user
      onUserUpdated(editedUser);
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user:", error);
      // Handle error (show error message, etc.)
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate a new password
  const handleGeneratePassword = async () => {
    setIsGeneratingPassword(true);
    
    try {
      // In a real application, you would make an API call here
      // const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
      //   method: 'POST',
      // });
      
      // const data = await response.json();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random password
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
      const length = 12;
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      setNewPassword(result);
    } catch (error) {
      console.error("Error generating password:", error);
      // Handle error (show error message, etc.)
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge for user
  const getUserStatusBadge = (user: User) => {
    if (user.accountLocked) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0 flex items-center gap-1 px-3 py-1 font-medium">
          <Lock className="h-3 w-3" />
          <span>Locked</span>
        </Badge>
      );
    } else if (!user.emailVerified) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-0 flex items-center gap-1 px-3 py-1 font-medium">
          <AlertTriangle className="h-3 w-3" />
          <span>Email Not Verified</span>
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1 px-3 py-1 font-medium">
          <CheckCircle2 className="h-3 w-3" />
          <span>Active</span>
        </Badge>
      );
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white border-l border-gray-200"
        overlayClassName="bg-black/30"
      >
        <SheetHeader className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <User className="h-5 w-5 text-blue-600" />
              User Details
            </SheetTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving}
            >
              {isEditing ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
          </div>
          <SheetDescription className="text-gray-500">
            View and manage user information for {user.fullName}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 pb-10">
          {/* User header with avatar and basic info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
              {user.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
            </div>
            <div className="flex flex-col items-center sm:items-start gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{user.email}</span>
                {!user.emailVerified && (
                  <Badge className="bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium rounded-md">
                    Email Not Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row mt-2 sm:mt-1 gap-2 sm:gap-4 items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold shadow-sm">
                    {user.orderCount}
                  </div>
                  <span className="text-gray-600 text-sm">orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center text-green-700 text-xs font-bold shadow-sm">
                    {user.activeServices}
                  </div>
                  <span className="text-gray-600 text-sm">active services</span>
                </div>
                <div className="flex items-center">
                  {user.isAdmin ? (
                    <Badge className="bg-purple-100 text-purple-800 border-0 flex items-center gap-1 shadow-sm">
                      <Shield className="h-3 w-3" />
                      <span>Admin</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                      Customer
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main tabs for user information */}
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-100 rounded-lg p-1 mb-6">
              <TabsTrigger 
                value="profile" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Profile tab content */}
            <TabsContent value="profile" className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">User ID:</Label>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 w-full truncate">
                          {user.id}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8 hover:bg-gray-100 text-gray-500"
                          onClick={() => copyToClipboard(user.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">Full Name:</Label>
                      {isEditing ? (
                        <Input 
                          value={editedUser.fullName}
                          onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                          className="border-gray-200"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                          {user.fullName}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">Email:</Label>
                      <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                        {user.email}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">Status:</Label>
                      <div>
                        {getUserStatusBadge(user)}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">Admin:</Label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={editedUser.isAdmin}
                            onCheckedChange={(checked) => setEditedUser({...editedUser, isAdmin: checked})}
                          />
                          <span className="text-sm text-gray-600">
                            {editedUser.isAdmin ? "Yes" : "No"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-800">
                          {user.isAdmin ? "Yes" : "No"}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">Joined:</Label>
                      <div className="flex items-center text-sm font-medium text-gray-800 gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-500">Last Login:</Label>
                      <div className="flex items-center text-sm font-medium text-gray-800 gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="border-gray-200 text-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium text-gray-900">Account Lock Status</h4>
                        <p className="text-sm text-gray-500">Toggle account access for this user</p>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={!editedUser.accountLocked}
                            onCheckedChange={(checked) => setEditedUser({...editedUser, accountLocked: !checked})}
                          />
                          <span className="text-sm text-gray-600">
                            {editedUser.accountLocked ? "Locked" : "Active"}
                          </span>
                        </div>
                      ) : (
                        <Badge className={`px-3 py-1 ${user.accountLocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                          {user.accountLocked ? "Locked" : "Active"}
                        </Badge>
                      )}
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium text-gray-900">Email Verification</h4>
                        <p className="text-sm text-gray-500">Toggle verification status for this user's email</p>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={editedUser.emailVerified}
                            onCheckedChange={(checked) => setEditedUser({...editedUser, emailVerified: checked})}
                          />
                          <span className="text-sm text-gray-600">
                            {editedUser.emailVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      ) : (
                        <Badge className={`px-3 py-1 ${user.emailVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      )}
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium text-gray-900">Reset Password</h4>
                        <p className="text-sm text-gray-500">Generate a new password for this user</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowResetPasswordOptions(!showResetPasswordOptions)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </Button>
                    </div>
                    
                    {showResetPasswordOptions && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200"
                              onClick={handleGeneratePassword}
                              disabled={isGeneratingPassword}
                            >
                              {isGeneratingPassword ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Key className="h-4 w-4 mr-2" />
                                  Generate Password
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500"
                              onClick={() => {
                                setShowResetPasswordOptions(false);
                                setNewPassword("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                          
                          {newPassword && (
                            <div className="mt-2">
                              <Label className="text-xs text-gray-500 mb-1">New Password:</Label>
                              <div className="flex">
                                <Input
                                  value={newPassword}
                                  readOnly
                                  className="font-mono text-sm border-gray-200 bg-white"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 text-gray-500"
                                  onClick={() => copyToClipboard(newPassword)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                This password is only shown once. Make sure to copy it now.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Orders tab content */}
            <TabsContent value="orders" className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Orders History</h3>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">
                    {userOrders.length} Orders
                  </Badge>
                </div>
                <div className="p-0">
                  {userOrders.length === 0 ? (
                    <div className="py-16 text-center">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h4 className="text-lg font-medium text-gray-800">No Orders Found</h4>
                      <p className="text-sm text-gray-500 mt-1">This user hasn't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="font-medium text-gray-600">Order ID</TableHead>
                            <TableHead className="font-medium text-gray-600">Plan</TableHead>
                            <TableHead className="font-medium text-gray-600">Date</TableHead>
                            <TableHead className="font-medium text-gray-600">Amount</TableHead>
                            <TableHead className="font-medium text-gray-600">Status</TableHead>
                            <TableHead className="text-right font-medium text-gray-600">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userOrders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium text-blue-600">
                                {order.orderId}
                              </TableCell>
                              <TableCell>{order.planName}</TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell>{formatCurrency(order.total)}</TableCell>
                              <TableCell>
                                <Badge className={
                                  order.status === "active" ? "bg-green-100 text-green-800" :
                                  order.status === "pending" ? "bg-amber-100 text-amber-800" :
                                  order.status === "completed" ? "bg-blue-100 text-blue-800" :
                                  "bg-red-100 text-red-800"
                                }>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-gray-600 hover:bg-gray-50"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Activity tab content */}
            <TabsContent value="activity" className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Account Activity</h3>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">
                    {activityLogs.length} Events
                  </Badge>
                </div>
                <div className="p-0">
                  {activityLogs.length === 0 ? (
                    <div className="py-16 text-center">
                      <Activity className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h4 className="text-lg font-medium text-gray-800">No Activity Found</h4>
                      <p className="text-sm text-gray-500 mt-1">No user activity has been logged yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="font-medium text-gray-600">Event</TableHead>
                            <TableHead className="font-medium text-gray-600">Details</TableHead>
                            <TableHead className="font-medium text-gray-600">IP Address</TableHead>
                            <TableHead className="font-medium text-gray-600">Date & Time</TableHead>
                            <TableHead className="font-medium text-gray-600">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activityLogs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell className="text-sm max-w-[200px] truncate" title={log.details}>
                                {log.details}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-gray-600">
                                {log.ipAddress}
                              </TableCell>
                              <TableCell>{formatDate(log.timestamp)}</TableCell>
                              <TableCell>
                                {log.success ? (
                                  <Badge className="bg-green-100 text-green-800 flex w-16 justify-center items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    OK
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 flex w-16 justify-center items-center">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Failed
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <Button variant="outline" size="sm" className="text-gray-500 border-gray-200">
                    Previous
                  </Button>
                  <div className="text-sm text-gray-600">
                    Page <span className="font-medium">1</span> of <span className="font-medium">1</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-gray-500 border-gray-200">
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="flex justify-between border-t border-gray-200 py-4 gap-2">
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
          <Button 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 