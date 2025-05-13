"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingCart, Calendar, Clock, Settings, Server, 
  Globe, RefreshCw, Eye, Search, Filter, CheckCircle2, XCircle,
  AlertCircle, HelpCircle, ArrowUp, ArrowDown, BarChart3, 
  Zap, PlusCircle, Package, Activity, Plus,
  Sparkles, ArrowRight, Cpu, Shield, Download, Share2, MoreHorizontal,
  Info, ChevronDown, ChevronRight, CreditCard, Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderManageSheet } from "@/components/dashboard/OrderManageSheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { saveAs } from 'file-saver';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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

export default function OrdersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const { toast } = useToast();

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: { 
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters when search term or status filter changes
  useEffect(() => {
    if (orders.length > 0) {
      applyFilters();
    }
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching orders from API...");
      // Fetch from API
      const response = await fetch("/api/user/orders");
      
      console.log("API Response Status:", response.status);
      
      // If API call succeeds, use the response data
      if (response.ok) {
        const data = await response.json();
        console.log("API Response Data:", data);
        
        // Ensure we have an orders array
        if (data && data.orders && Array.isArray(data.orders)) {
          console.log(`Found ${data.orders.length} orders in API response`);
        setOrders(data.orders);
        setFilteredOrders(data.orders);
        } else if (Array.isArray(data)) {
          // Handle case where API returns the array directly
          console.log(`Found ${data.length} orders in API response array`);
          setOrders(data);
          setFilteredOrders(data);
        } else {
          console.error("API did not return an array of orders:", data);
          toast({
            title: "Data Format Error",
            description: "Orders data format is incorrect",
            variant: "destructive",
          });
          setOrders([]);
          setFilteredOrders([]);
        }
      } else {
        // If API call fails, show error and set empty array
        console.error("Failed to fetch orders: ", response.statusText);
        toast({
          title: "Error fetching orders",
          description: "Please try again later or contact support",
          variant: "destructive",
        });
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      // If there's a network error, show error and set empty array
      console.error("Error fetching orders:", error);
      toast({
        title: "Network error",
        description: "Could not connect to the server. Please check your connection.",
        variant: "destructive",
      });
      setOrders([]);
      setFilteredOrders([]);
    } finally {
        setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    setIsRefreshing(true);
    try {
      console.log("Refreshing orders from API...");
      // Fetch from API
      const response = await fetch("/api/user/orders");
      
      console.log("Refresh API Response Status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Refresh API Response Data:", data);
        
        // Ensure we have an orders array
        if (data && data.orders && Array.isArray(data.orders)) {
          console.log(`Found ${data.orders.length} orders in refresh response`);
        setOrders(data.orders);
        setFilteredOrders(data.orders);
        } else if (Array.isArray(data)) {
          // Handle case where API returns the array directly
          console.log(`Found ${data.length} orders in refresh response array`);
          setOrders(data);
          setFilteredOrders(data);
      } else {
          console.error("API did not return an array of orders during refresh:", data);
          toast({
            title: "Data Format Error",
            description: "Orders data format is incorrect",
            variant: "destructive",
          });
      }
      
      toast({
        title: "Refreshed",
        description: "Orders list has been updated",
        duration: 2000,
      });
      } else {
        console.error("Failed to refresh orders: ", response.statusText);
        toast({
          title: "Refresh failed",
          description: "Could not update orders list. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast({
        title: "Refresh failed",
        description: "Network error occurred. Please check your connection.",
        variant: "destructive",
      });
    } finally {
        setIsRefreshing(false);
    }
  };

  const navigateToNewOrder = () => {
    // Navigate to the pricing page
    router.push('/pricing');
    
    toast({
      title: "New Order",
      description: "Choose a plan that fits your needs",
      duration: 2000,
    });
  };

  const applyFilters = () => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        order => 
          order.orderId?.toLowerCase().includes(lowercaseSearch) ||
          order.planName?.toLowerCase().includes(lowercaseSearch) ||
          order.location?.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    
    setFilteredOrders(result);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "pending":
      case "processing":
        return "outline";
      case "cancelled":
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500 text-white";
      case "pending":
        return "bg-amber-500 text-white";
      case "processing":
        return "bg-blue-500 text-white";
      case "cancelled":
      case "failed":
        return "bg-rose-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10";
      case "pending":
        return "bg-amber-500/10";
      case "processing":
        return "bg-blue-500/10";
      case "cancelled":
      case "failed":
        return "bg-rose-500/10";
      default:
        return "bg-slate-500/10";
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "border-emerald-500/20";
      case "pending":
        return "border-amber-500/20";
      case "processing":
        return "border-blue-500/20";
      case "cancelled":
      case "failed":
        return "border-rose-500/20";
      default:
        return "border-slate-500/20";
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-emerald-500";
      case "pending":
        return "text-amber-500";
      case "processing":
        return "text-blue-500";
      case "cancelled":
      case "failed":
        return "text-rose-500";
      default:
        return "text-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleManage = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate time remaining for active orders
  const getTimeRemaining = (expiryDate: string | undefined) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} left`;
    }
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };

  return (
    <div className="w-full px-4 py-8 md:px-8">
      {/* Enhanced Page Header with More Premium Design */}
      <div className="relative mb-8">
        {/* Advanced Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl -z-10 blur-xl opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10 backdrop-blur-sm bg-white/30 dark:bg-slate-950/30 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Your Orders</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all your active services</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Button 
              onClick={refreshOrders} 
              variant="outline" 
              size="sm"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            
            <Button
              onClick={navigateToNewOrder}
              variant="default"
              size="sm"
              className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
                </div>
              </div>

      {/* Enhanced Filter and Search Bar */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-5">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
              placeholder="Search by ID, plan name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all duration-300 shadow-sm"
              />
          </div>
            </div>
            
        <div className="flex items-center space-x-2 md:col-span-4">
          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all duration-300 shadow-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All orders</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>

        <div className="flex justify-end items-center md:col-span-3">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
              <Button 
              variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
              className="rounded-md"
              >
              <Package className="h-4 w-4" />
              </Button>
              <Button 
              variant={view === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
              className="rounded-md"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Tabbed View */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="w-full md:w-auto bg-slate-100/70 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <TabsTrigger value="all" className="rounded-xl text-xs sm:text-sm px-5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-medium">
            All Orders
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl text-xs sm:text-sm px-5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-medium">
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl text-xs sm:text-sm px-5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-medium">
            Pending
          </TabsTrigger>
          <TabsTrigger value="processing" className="rounded-xl text-xs sm:text-sm px-5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-medium">
            Processing
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Content with enhanced styling */}
      <AnimatePresence>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[280px] rounded-xl overflow-hidden shadow-md">
                <Skeleton className="h-full w-full" />
                </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-slate-50/50 dark:bg-slate-900/50 shadow-sm"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner">
              <Package className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No orders found</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md">
              {searchTerm || statusFilter !== "all"
                ? "Try changing your search or filter criteria"
                : "Place your first order to get started with our services"}
            </p>
            <Button
              onClick={navigateToNewOrder}
              className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-md px-6 py-2.5"
            >
              <Plus className="mr-2 h-4 w-4" />
              Browse Plans
            </Button>
        </motion.div>
      ) : view === "grid" ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="h-full overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  {/* Enhanced Status Indicator */}
                  <div className={`absolute top-0 right-0 w-28 h-28 -mt-14 -mr-14 transform rotate-45 ${getStatusColor(order.status || 'pending')}`}>
                    <div className="absolute bottom-5 right-1 transform -rotate-45 text-xs font-bold tracking-wide">
                      {(order.status || 'PENDING').toUpperCase()}
                    </div>
                  </div>
                  
                  <CardHeader className="p-6 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                          {order.planName || 'Unnamed Plan'}
                        </CardTitle>
                        <CardDescription className="text-sm flex items-center">
                          <svg className="h-3.5 w-3.5 mr-1.5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M2 12H4M12 2V4M22 12H20M12 22V20M4.92893 4.92893L6.34315 6.34315M19.0711 4.92893L17.6569 6.34315M4.92893 19.0711L6.34315 17.6569M19.0711 19.0711L17.6569 17.6569" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          {order.location || 'Unknown Location'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleManage(order)}>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Manage</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              <span>Refresh</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Info className="mr-2 h-4 w-4" />
                              <span>Details</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-0 pb-4">
                    <div className="mt-2 space-y-4">
                      {/* Order ID with Enhanced Styling */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Order ID</div>
                        <div className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {order.orderId ? order.orderId.split('-')[2] || order.orderId : 'N/A'}
                        </div>
                    </div>
                      
                      {/* Order Date with Enhanced Styling */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordered</div>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                          {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                        </div>
                    </div>
                      
                      {/* Price with Enhanced Styling - PKR */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Price</div>
                        <div className="text-sm font-bold flex items-center text-indigo-600 dark:text-indigo-400">
                          <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                          {typeof order.total === 'number' ? formatCurrency(order.total) : 'N/A'}
                    </div>
                  </div>

                      {/* Time Remaining for Active Orders with Enhanced Styling */}
                      {order.status === "active" && order.expiryDate && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Expires</div>
                          <div className="text-sm flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                            {getTimeRemaining(order.expiryDate)}
                    </div>
                    </div>
                      )}
                  </div>
                </CardContent>
                
                  <CardFooter className="p-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <Badge 
                      variant="outline"
                      className={`rounded-full px-3 py-1 text-xs flex items-center gap-1.5 ${getStatusBgColor(order.status || 'pending')} ${getStatusBorderColor(order.status || 'pending')}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status || 'pending')}`}></span>
                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                    </Badge>
                    
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManage(order)}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50 font-medium"
                    >
                      Manage
                      <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-slate-500 dark:text-slate-400">Plan</th>
                    <th className="px-6 py-4 text-left font-medium text-slate-500 dark:text-slate-400">Order ID</th>
                    <th className="px-6 py-4 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-6 py-4 text-left font-medium text-slate-500 dark:text-slate-400">Location</th>
                    <th className="px-6 py-4 text-left font-medium text-slate-500 dark:text-slate-400">Date</th>
                    <th className="px-6 py-4 text-left font-medium text-slate-500 dark:text-slate-400">Price</th>
                    <th className="px-6 py-4 text-right font-medium text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            delay: index * 0.05,
                            duration: 0.2
                          }
                        }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{order.planName || 'Unnamed Plan'}</div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{order.orderId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="outline"
                            className={`rounded-full px-2.5 py-0.5 text-xs flex items-center gap-1.5 ${getStatusBgColor(order.status || 'pending')} ${getStatusBorderColor(order.status || 'pending')}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(order.status || 'pending')}`}></span>
                            {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-slate-400" />
                            {order.location || 'Unknown Location'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600 dark:text-indigo-400">{typeof order.total === 'number' ? formatCurrency(order.total) : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                          <Button 
                              variant="ghost"
                              size="icon"
                            onClick={() => handleManage(order)}
                              className="h-8 w-8"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                          </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleManage(order)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  <span>Manage</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  <span>Refresh</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Info className="mr-2 h-4 w-4" />
                                  <span>Details</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </td>
                      </motion.tr>
                  ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Order Management Sheet */}
        {selectedOrder && (
          <OrderManageSheet 
          open={isDialogOpen}
          onOpenChange={(open) => setIsDialogOpen(open)}
            order={selectedOrder}
            onRefresh={refreshOrders}
          />
        )}
    </div>
  );
}
