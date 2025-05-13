"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Globe, Calendar, Clock, User, Key, AlertTriangle, 
  Copy, Check, RefreshCw, CreditCard, Truck, Edit,
  HardDrive, Cpu, Network, LifeBuoy, FileText, X,
  Clipboard, Download, Trash2, ShieldAlert, Image
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Order {
  id: string;
  orderId: string;
  userId: string;
  planName: string;
  status: string;
  total: number;
  createdAt: string;
  location: string;
  locationCode?: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  isInitialized: boolean;
  ipAddress?: string;
  username?: string;
  password?: string;
  expiryDate?: string;
  planDetails?: Plan;
  mediaDetails?: Media[];
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  isActive: boolean;
}

interface Media {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimetype: string;
  path: string;
  size: number;
  isApproved: boolean;
  createdAt: string;
}

interface OrderDetailsSheetProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated: (order: Order) => void;
  plans?: Plan[];
  media?: Media[];
}

export function OrderDetailsSheet({ 
  order, 
  open, 
  onOpenChange, 
  onOrderUpdated,
  plans = [],
  media = []
}: OrderDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState({ ...order });
  const [isSaving, setIsSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-0";
      case "pending":
        return "bg-amber-100 text-amber-800 border-0";
      case "processing":
        return "bg-blue-100 text-blue-800 border-0";
      case "cancelled":
        return "bg-red-100 text-red-800 border-0";
      case "failed":
        return "bg-red-100 text-red-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };
  
  // Copy to clipboard handler
  const copyToClipboard = (text: string | undefined, field: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle saving edited order
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, you would make an API call here
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedOrder),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Call the update handler with the edited order
      onOrderUpdated(data);
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving order:", error);
      // Handle error (show error message, etc.)
    } finally {
      setIsSaving(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditedOrder({ ...order });
    setIsEditing(false);
  };

  // Get plan details either from order or plans array
  const planDetails = order.planDetails || plans.find(p => p.name === order.planName);
  
  // Get media for this order
  const orderMedia = order.mediaDetails || media;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[450px] overflow-y-auto bg-white">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-sky-600" />
              Order Details
            </SheetTitle>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
          <SheetDescription>
            View and manage details for order {order.orderId}
          </SheetDescription>
        </SheetHeader>
        
        <Separator className="my-4" />
        
        {/* Order Summary Header */}
        <div className="space-y-3 mb-6 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {isEditing ? editedOrder.planName : order.planName}
              </h3>
              <p className="text-sm text-gray-500 font-mono">{order.orderId}</p>
            </div>
            <Badge className={`uppercase text-xs font-bold ${getStatusBadge(isEditing ? editedOrder.status : order.status)}`}>
              {isEditing ? editedOrder.status : order.status}
            </Badge>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-lg p-3 flex justify-between mt-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-sky-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                <p className="text-xs text-gray-500">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-sky-600" />
              <p className="text-sm font-medium text-gray-900">{order.location}</p>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4 w-full bg-gray-50">
            <TabsTrigger value="details" className="text-xs sm:text-sm px-2">Details</TabsTrigger>
            <TabsTrigger value="credentials" className="text-xs sm:text-sm px-2">Credentials</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm px-2">Billing</TabsTrigger>
            <TabsTrigger value="media" className="text-xs sm:text-sm px-2">Media</TabsTrigger>
          </TabsList>
          
          {/* Details Tab */}
          <TabsContent value="details" className="mt-4 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="planName">Plan Name</Label>
                  <select 
                    id="planName"
                    value={editedOrder.planName}
                    onChange={(e) => setEditedOrder({...editedOrder, planName: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {plans.length > 0 ? (
                      plans.map(plan => (
                        <option key={plan.id} value={plan.name}>{plan.name}</option>
                      ))
                    ) : (
                      <option value={editedOrder.planName}>{editedOrder.planName}</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status"
                    value={editedOrder.status}
                    onChange={(e) => setEditedOrder({...editedOrder, status: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={editedOrder.location}
                    onChange={(e) => setEditedOrder({...editedOrder, location: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveChanges}
                    className="h-8 bg-sky-600 hover:bg-sky-700 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Plan Type</p>
                    <p className="font-medium">{planDetails?.type || "Standard"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Date Created</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {planDetails && (
                  <div className="p-3 rounded-lg bg-white border border-gray-200">
                    <h4 className="font-medium mb-2 flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-gray-600" />
                      Plan Details
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{planDetails.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-medium text-emerald-700">PKR {planDetails.price.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Status</p>
                        <Badge variant={planDetails.isActive ? "default" : "secondary"}>
                          {planDetails.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-medium mb-2 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-sky-600" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3 bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{order.customerEmail}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-medium mb-2 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-sky-600" />
                    Location Details
                  </h4>
                  <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">{order.location}</p>
                      </div>
                      {order.locationCode && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Location Code</p>
                          <p className="font-medium">{order.locationCode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Credentials Tab */}
          <TabsContent value="credentials" className="mt-4 space-y-4">
            {!order.isInitialized ? (
              <div className="p-6 text-center bg-white rounded-lg border border-gray-200">
                <ShieldAlert className="h-8 w-8 mx-auto mb-3 text-amber-500" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Not Initialized</h3>
                <p className="text-gray-500 mb-4">This order hasn't been initialized yet. No credentials are available.</p>
                <Button 
                  variant="outline" 
                  className="bg-white"
                >
                  Initialize Now
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-medium mb-3 flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-blue-600" />
                    Access Credentials
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700 font-medium">IP Address</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs px-2 text-blue-600 hover:bg-blue-50"
                          onClick={() => copyToClipboard(order.ipAddress, "ip")}
                        >
                          {copiedField === "ip" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copiedField === "ip" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 font-mono text-sm flex items-center">
                        <div className="flex-1 overflow-x-auto whitespace-nowrap">
                          {order.ipAddress || "Not available"}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700 font-medium">Username</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs px-2 text-blue-600 hover:bg-blue-50"
                          onClick={() => copyToClipboard(order.username, "username")}
                        >
                          {copiedField === "username" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copiedField === "username" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 font-mono text-sm flex items-center">
                        <div className="flex-1 overflow-x-auto whitespace-nowrap">
                          {order.username || "Not available"}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700 font-medium">Password</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs px-2 text-blue-600 hover:bg-blue-50"
                          onClick={() => copyToClipboard(order.password, "password")}
                        >
                          {copiedField === "password" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copiedField === "password" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 font-mono text-sm flex items-center">
                        <div className="flex-1 overflow-x-auto whitespace-nowrap">
                          {order.password || "Not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-medium mb-3 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-600" />
                    Expiration Details
                  </h4>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-medium">
                        {formatDate(order.expiryDate)}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0">
                      Active
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-medium mb-3 flex items-center gap-1.5">
                    <HardDrive className="h-4 w-4 text-emerald-600" />
                    System Specifications
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded-md">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">CPU</p>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3.5 w-3.5 text-gray-400" />
                        <p className="font-medium">2 vCores</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">RAM</p>
                      <div className="flex items-center gap-1">
                        <Network className="h-3.5 w-3.5 text-gray-400" />
                        <p className="font-medium">8 GB</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Storage</p>
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3.5 w-3.5 text-gray-400" />
                        <p className="font-medium">50 GB SSD</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">OS</p>
                      <div className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 text-gray-400" />
                        <p className="font-medium">Windows 10</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Billing Tab */}
          <TabsContent value="billing" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-sm text-gray-500">Payment Status</p>
                <Badge className="bg-green-100 text-green-800 border-0">
                  Paid
                </Badge>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-gray-500">Payment Method</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <h4 className="font-medium mb-3">Order Summary</h4>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Plan ({order.planName})</p>
                  <p>PKR {order.total.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Taxes & Fees</p>
                  <p>PKR 0</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between mt-3 font-medium">
                <p>Total</p>
                <p>PKR {order.total.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <h4 className="font-medium mb-2">Billing Information</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="font-medium font-mono">{order.orderId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Button variant="outline" className="gap-2 w-full">
                <Download className="h-4 w-4" />
                Download Invoice
              </Button>
            </div>
          </TabsContent>
          
          {/* Media Tab */}
          <TabsContent value="media" className="mt-4 space-y-4">
            {orderMedia && orderMedia.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Customer Documents</h4>
                  <Badge className="bg-blue-100 text-blue-800 border-0">
                    {orderMedia.length} Files
                  </Badge>
                </div>
                
                <div className="grid gap-3">
                  {orderMedia.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium mb-0.5 leading-tight">{item.originalName}</p>
                            <p className="text-xs text-gray-500">
                              {(item.size / 1024).toFixed(2)} KB • {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge className={item.isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                          {item.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6 text-center bg-white rounded-lg border border-gray-200">
                <Image className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Media Found</h3>
                <p className="text-gray-500 mb-4">There are no uploaded documents associated with this order.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          {isEditing ? (
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline"
                className="gap-2 bg-white"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button 
                className="gap-2 bg-sky-600 hover:bg-sky-700 text-white"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="gap-2 text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                Close
              </Button>
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => setActiveTab(activeTab === "details" ? "credentials" : "details")}
              >
                {activeTab === "details" ? (
                  <>
                    <Key className="h-4 w-4" />
                    View Credentials
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    View Details
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 