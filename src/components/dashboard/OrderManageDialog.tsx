"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  Server, Globe, Calendar, Clock, User, Key, AlertTriangle, 
  Copy, Check, RefreshCw, ArrowRight, Laptop, Shield, 
  HardDrive, Cpu, Network, LifeBuoy, FileText, Wifi, X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define interfaces for type safety
interface Order {
  id: string;
  orderId: string;
  planName: string;
  status: string;
  total: number;
  createdAt: string;
  location: string;
  isInitialized?: boolean;
  ipAddress?: string;
  username?: string;
  password?: string;
  expiryDate?: string;
}

interface OrderManageDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function OrderManageDialog({ order, open, onOpenChange, onRefresh }: OrderManageDialogProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [copied, setCopied] = useState<string | null>(null);
  const [isRefreshingDetails, setIsRefreshingDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch the detailed order information when opened
  useEffect(() => {
    if (open && order) {
      fetchOrderDetails(order.id);
    }
  }, [open, order]);

  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Fallback to the provided order if API fails
      setOrderDetails(order);
      toast({
        title: "Error",
        description: "Failed to fetch detailed order information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days remaining if expiryDate exists
  const getDaysRemaining = () => {
    if (!orderDetails?.expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(orderDetails.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Get progress value for expiry progress bar
  const getExpiryProgress = () => {
    if (!orderDetails?.expiryDate) return 0;
    
    const today = new Date();
    const created = new Date(orderDetails.createdAt);
    const expiry = new Date(orderDetails.expiryDate);
    
    const totalDuration = expiry.getTime() - created.getTime();
    const elapsed = today.getTime() - created.getTime();
    
    if (elapsed < 0) return 0;
    if (elapsed > totalDuration) return 100;
    
    return Math.floor((elapsed / totalDuration) * 100);
  };

  const copyToClipboard = (text: string | undefined, field: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    setCopied(field);
    
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
      duration: 2000,
    });
    
    setTimeout(() => setCopied(null), 2000);
  };

  const refreshOrderDetails = async () => {
    setIsRefreshingDetails(true);
    try {
      if (orderDetails?.id) {
        await fetchOrderDetails(orderDetails.id);
      }
      
      toast({
        title: "Refreshed",
        description: "Order details updated successfully",
        duration: 2000,
      });
      
      // Refresh the orders list to get updated data
      onRefresh();
    } catch (error) {
      console.error("Error refreshing order details:", error);
      toast({
        title: "Error",
        description: "Failed to refresh order details",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingDetails(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default"; // Changed from success to default
      case "pending":
      case "processing":
        return "outline"; // Changed from warning to outline
      case "cancelled":
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // If order details don't exist yet, use the provided order
  const displayOrder = orderDetails || order;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.5 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          
          {/* Side Sheet */}
          <motion.div 
            className="fixed inset-y-0 right-0 z-50 flex max-w-full"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex h-full w-full flex-col sm:w-[90vw] md:w-[650px] overflow-y-auto bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 shadow-2xl border-l border-emerald-600/50">
              {/* Header */}
              <div className="relative p-6 pb-0">
                <div className="absolute top-5 right-5 z-10">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-50"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col mb-4">
                  <div className="pb-2">
                    <Badge 
                      variant={getStatusBadgeVariant(displayOrder.status)} 
                      className="capitalize text-xs font-bold px-2 py-1 mb-3"
                    >
                      {displayOrder.status}
                    </Badge>
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
                      <Server className="h-5 w-5 text-orange-400" />
                      {displayOrder.planName}
                    </h2>
                    <p className="mt-1 text-sm text-emerald-100">
                      Order ID: {displayOrder.orderId}
                    </p>
                  </div>
                  
                  {/* Refreshing notice */}
                  {isLoading && (
                    <div className="flex items-center gap-2 bg-emerald-800/50 p-2 rounded-md text-xs text-emerald-100 my-2">
                      <RefreshCw className="h-3 w-3 animate-spin text-orange-400" />
                      <span>Loading order details...</span>
                    </div>
                  )}
                </div>
                
                {/* Vibrant separator */}
                <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full my-1 opacity-80" />
              </div>
              
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-6 border-b border-emerald-700/60">
                  <TabsList className="w-full bg-emerald-800/40 justify-start gap-1 p-0 h-12">
                    <TabsTrigger 
                      value="details" 
                      className="flex-1 data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-400 data-[state=active]:shadow-none px-3 rounded-none text-emerald-200"
                    >
                      Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="specs" 
                      className="flex-1 data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-pink-400 data-[state=active]:shadow-none px-3 rounded-none text-emerald-200"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="support" 
                      className="flex-1 data-[state=active]:bg-emerald-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:shadow-none px-3 rounded-none text-emerald-200"
                    >
                      Support
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Details Tab */}
                <TabsContent value="details" className="flex-1 p-6 pt-4 focus-visible:outline-none focus-visible:ring-0 text-emerald-50 overflow-y-auto">
                  <div className="space-y-5">
                    {displayOrder.isInitialized ? (
                      <>
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-3 mb-6">
                          <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm text-white">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                              <Calendar className="h-7 w-7 text-orange-400 mb-2 mt-2" />
                              <h3 className="text-sm font-semibold mb-1">Start Date</h3>
                              <p className="text-emerald-200 text-xs">{formatDate(displayOrder.createdAt)}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm text-white">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                              <Clock className="h-7 w-7 text-pink-400 mb-2 mt-2" />
                              <h3 className="text-sm font-semibold mb-1">Expiry Date</h3>
                              <p className="text-emerald-200 text-xs">{formatDate(displayOrder.expiryDate)}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm text-white">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                              <Laptop className="h-7 w-7 text-purple-400 mb-2 mt-2" />
                              <h3 className="text-sm font-semibold mb-1">Status</h3>
                              <Badge variant={getStatusBadgeVariant(displayOrder.status)} className="mt-1 capitalize">
                                {displayOrder.status}
                              </Badge>
                            </CardContent>
                          </Card>
                        </div>

                        {daysRemaining !== null && (
                          <div className="p-4 border border-emerald-700/50 rounded-lg bg-emerald-800/30 backdrop-blur-sm mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-sm font-medium">Service Duration</div>
                              <div className="text-sm font-bold text-orange-400">{daysRemaining} days remaining</div>
                            </div>
                            <div className="h-2 w-full bg-emerald-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full"
                                style={{ width: `${getExpiryProgress()}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <h3 className="text-base font-semibold flex items-center text-white">
                            <Shield className="h-4 w-4 mr-2 text-orange-400" />
                            Connection Details
                          </h3>
                          
                          <div className="p-4 border border-emerald-700/50 rounded-lg bg-emerald-800/30 backdrop-blur-sm space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2 text-emerald-300" />
                                <span className="text-emerald-300">IP Address</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <code className="relative rounded bg-emerald-900 px-[0.5rem] py-[0.25rem] font-mono text-sm text-emerald-100">
                                  {displayOrder.ipAddress || "Not assigned"}
                                </code>
                                {displayOrder.ipAddress && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 hover:bg-emerald-700 text-emerald-100"
                                    onClick={() => copyToClipboard(displayOrder.ipAddress, "IP Address")}
                                  >
                                    {copied === "IP Address" ? (
                                      <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <Separator className="my-2 bg-emerald-700" />
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2 text-emerald-300" />
                                <span className="text-emerald-300">Username</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <code className="relative rounded bg-emerald-900 px-[0.5rem] py-[0.25rem] font-mono text-sm text-emerald-100">
                                  {displayOrder.username || "Not assigned"}
                                </code>
                                {displayOrder.username && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 hover:bg-emerald-700 text-emerald-100"
                                    onClick={() => copyToClipboard(displayOrder.username, "Username")}
                                  >
                                    {copied === "Username" ? (
                                      <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <Separator className="my-2 bg-emerald-700" />
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm">
                                <Key className="h-4 w-4 mr-2 text-emerald-300" />
                                <span className="text-emerald-300">Password</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <code className="relative rounded bg-emerald-900 px-[0.5rem] py-[0.25rem] font-mono text-sm text-emerald-100">
                                  {displayOrder.password ? "••••••••" : "Not assigned"}
                                </code>
                                {displayOrder.password && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 hover:bg-emerald-700 text-emerald-100"
                                    onClick={() => copyToClipboard(displayOrder.password, "Password")}
                                  >
                                    {copied === "Password" ? (
                                      <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-5">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="p-5 border border-orange-500/30 rounded-lg bg-orange-500/10 text-center space-y-3"
                        >
                          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto" />
                          <h3 className="text-lg font-semibold text-orange-100">Not Initialized Yet</h3>
                          <p className="text-emerald-100 max-w-md mx-auto">
                            This order has not been initialized by the administrator yet. Once initialized, 
                            you will see connection details here. Please check back later or contact support.
                          </p>
                          <div className="pt-1">
                            <Button 
                              variant="outline" 
                              onClick={refreshOrderDetails}
                              disabled={isRefreshingDetails}
                              className="mt-2 bg-emerald-800 hover:bg-emerald-700 text-white border-orange-500/50 hover:border-orange-500"
                            >
                              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingDetails ? "animate-spin" : ""} text-orange-400`} />
                              Check for updates
                            </Button>
                          </div>
                        </motion.div>
                        
                        <div className="border border-emerald-700/50 rounded-lg p-4 space-y-3 bg-emerald-800/30">
                          <h3 className="text-base font-medium text-white">Order Information</h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div className="text-emerald-300">Plan Name:</div>
                            <div className="font-medium text-white">{displayOrder.planName}</div>
                            
                            <div className="text-emerald-300">Order Date:</div>
                            <div className="font-medium text-white">{formatDate(displayOrder.createdAt)}</div>
                            
                            <div className="text-emerald-300">Status:</div>
                            <div className="font-medium text-white capitalize">{displayOrder.status}</div>
                            
                            <div className="text-emerald-300">Location:</div>
                            <div className="font-medium text-white">{displayOrder.location}</div>
                            
                            <div className="text-emerald-300">Amount:</div>
                            <div className="font-medium text-white">PKR {displayOrder.total.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="border border-emerald-700/50 rounded-lg p-4 bg-emerald-800/30">
                          <h3 className="text-base font-medium mb-3 text-white">Order Timeline</h3>
                          <div className="space-y-4">
                            <div className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className="rounded-full h-8 w-8 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                                <div className="h-full w-0.5 bg-emerald-700 mt-1"></div>
                              </div>
                              <div className="pt-1 pb-4">
                                <p className="font-medium text-white">Order Placed</p>
                                <p className="text-emerald-200 text-sm">{formatDate(displayOrder.createdAt)}</p>
                              </div>
                            </div>
                            
                            <div className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`rounded-full h-8 w-8 ${displayOrder.status === "pending" ? "bg-orange-500" : displayOrder.status === "processing" ? "bg-gradient-to-r from-orange-500 to-pink-500" : "bg-emerald-700"} flex items-center justify-center`}>
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                                <div className="h-full w-0.5 bg-emerald-700 mt-1"></div>
                              </div>
                              <div className="pt-1 pb-4">
                                <p className="font-medium text-white">Payment Processing</p>
                                <p className="text-emerald-200 text-sm">
                                  {displayOrder.status === "pending" ? "In progress" : displayOrder.status === "processing" ? "Completed" : "Waiting"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`rounded-full h-8 w-8 ${displayOrder.status === "processing" ? "bg-orange-500" : "bg-emerald-700"} flex items-center justify-center`}>
                                  <Server className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="font-medium text-white">Service Activation</p>
                                <p className="text-emerald-200 text-sm">
                                  {displayOrder.status === "processing" ? "In progress" : "Waiting"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Specs Tab */}
                <TabsContent value="specs" className="flex-1 p-6 pt-4 focus-visible:outline-none focus-visible:ring-0 text-emerald-50 overflow-y-auto">
                  <div className="space-y-5">
                    <h3 className="text-base font-semibold flex items-center text-white">
                      <HardDrive className="h-4 w-4 mr-2 text-pink-400" />
                      System Specifications
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 border-b border-emerald-700/60 bg-gradient-to-r from-orange-500/10 to-orange-500/5">
                            <div className="flex items-center">
                              <Cpu className="h-5 w-5 mr-2 text-orange-400" />
                              <h3 className="font-medium text-white">Processor</h3>
                            </div>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Type</span>
                                <span className="font-medium text-white">Intel Xeon</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Cores</span>
                                <span className="font-medium text-white">4 vCPU</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Clock Speed</span>
                                <span className="font-medium text-white">2.5 GHz</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 border-b border-emerald-700/60 bg-gradient-to-r from-pink-500/10 to-pink-500/5">
                            <div className="flex items-center">
                              <HardDrive className="h-5 w-5 mr-2 text-pink-400" />
                              <h3 className="font-medium text-white">Memory & Storage</h3>
                            </div>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-emerald-300">RAM</span>
                                <span className="font-medium text-white">8 GB</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Storage</span>
                                <span className="font-medium text-white">120 GB SSD</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Type</span>
                                <span className="font-medium text-white">NVMe</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 border-b border-emerald-700/60 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5">
                            <div className="flex items-center">
                              <Network className="h-5 w-5 mr-2 text-yellow-400" />
                              <h3 className="font-medium text-white">Network</h3>
                            </div>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Bandwidth</span>
                                <span className="font-medium text-white">Unmetered</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Speed</span>
                                <span className="font-medium text-white">1 Gbps</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">DDoS Protection</span>
                                <span className="font-medium text-white">Yes</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 border-b border-emerald-700/60 bg-gradient-to-r from-lime-500/10 to-lime-500/5">
                            <div className="flex items-center">
                              <Wifi className="h-5 w-5 mr-2 text-lime-400" />
                              <h3 className="font-medium text-white">Operating System</h3>
                            </div>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-emerald-300">OS</span>
                                <span className="font-medium text-white">Windows Server</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Version</span>
                                <span className="font-medium text-white">2022</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-emerald-300">Remote Access</span>
                                <span className="font-medium text-white">RDP</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="pt-2">
                      <div className="text-xs text-emerald-300 italic">
                        * Specifications may vary slightly based on resource allocation and system updates.
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Support Tab */}
                <TabsContent value="support" className="flex-1 p-6 pt-4 focus-visible:outline-none focus-visible:ring-0 text-emerald-50 overflow-y-auto">
                  <div className="space-y-5">
                    <h3 className="text-base font-semibold flex items-center text-white">
                      <LifeBuoy className="h-4 w-4 mr-2 text-purple-400" />
                      Support Options
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-4 flex flex-col h-full">
                          <div className="flex items-center mb-3">
                            <FileText className="h-5 w-5 mr-2 text-teal-400" />
                            <h3 className="font-medium text-white">Documentation</h3>
                          </div>
                          <p className="text-sm text-emerald-200 mb-4 flex-grow">
                            Access our knowledge base for guides on using your RDP/VPS service.
                          </p>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between group relative overflow-hidden bg-emerald-800 hover:bg-emerald-700 border-teal-500/30 hover:border-teal-400 text-white"
                          >
                            <span>View Documentation</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-teal-400" />
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-emerald-700/50 bg-emerald-800/30 hover:bg-emerald-800/50 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-4 flex flex-col h-full">
                          <div className="flex items-center mb-3">
                            <LifeBuoy className="h-5 w-5 mr-2 text-purple-400" />
                            <h3 className="font-medium text-white">Contact Support</h3>
                          </div>
                          <p className="text-sm text-emerald-200 mb-4 flex-grow">
                            Need help with your service? Our support team is available 24/7.
                          </p>
                          <Button 
                            className="w-full justify-between group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-900/20"
                          >
                            <span className="z-10 relative">Contact Support</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform z-10 relative" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="border border-emerald-700/50 rounded-lg p-4 mt-5 bg-emerald-800/30">
                      <h3 className="text-base font-medium mb-3 text-white">Order Information for Support</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-emerald-300">Order ID:</div>
                        <div className="font-medium text-white">{displayOrder.orderId}</div>
                        
                        <div className="text-emerald-300">Plan:</div>
                        <div className="font-medium text-white">{displayOrder.planName}</div>
                        
                        <div className="text-emerald-300">Created:</div>
                        <div className="font-medium text-white">{formatDate(displayOrder.createdAt)}</div>
                        
                        <div className="text-emerald-300">Status:</div>
                        <div className="font-medium text-white capitalize">{displayOrder.status}</div>
                      </div>
                      <div className="mt-4 text-xs text-emerald-300">
                        Please reference this information when contacting support about this order.
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Footer actions */}
              <div className="p-6 pt-4 flex justify-end gap-3 border-t border-emerald-700/60 bg-emerald-900/40">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-700"
                >
                  Close
                </Button>
                <Button 
                  onClick={refreshOrderDetails}
                  disabled={isRefreshingDetails}
                  className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-pink-900/20"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingDetails ? "animate-spin" : ""}`} />
                  Refresh Details
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 