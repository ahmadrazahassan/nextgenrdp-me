"use client";

import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, Filter, MoreHorizontal, Package, CheckCircle2, 
  Clock, ServerCrash, XCircle, AlertTriangle, RefreshCw,
  Download, Copy, Check, Eye, PencilLine, DollarSign,
  ShoppingCart, BarChart3, FileText, Calendar, MapPin,
  CreditCard, Tag, TrendingUp, Users, Truck, Shield, Mail
} from "lucide-react";
import { OrderInitializeDialog } from "@/components/admin/OrderInitializeDialog";
import { OrderDetailsSheet } from "@/components/admin/OrderDetailsSheet";
import { motion } from "@/components/ui/motion";
import { Progress } from "@/components/ui/progress";

// Define order interface
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
}

// Define plan interface
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  isActive: boolean;
}

// Define media interface
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export default function AdminOrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInitializeDialogOpen, setIsInitializeDialogOpen] = useState(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    cancelledOrders: 0,
    failedOrders: 0,
    recentActivityCount: 0
  });

  // Ensure client-side rendering only
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch real data from API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders
        const ordersResponse = await fetch('/api/admin/orders');
        
        if (!ordersResponse.ok) {
          throw new Error(`Error ${ordersResponse.status}: ${ordersResponse.statusText}`);
        }
        
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        
        // Calculate summary data
        const totalOrders = ordersData.length;
        const activeOrders = ordersData.filter((order: Order) => order.status.toLowerCase() === 'active').length;
        const pendingOrders = ordersData.filter((order: Order) => order.status.toLowerCase() === 'pending').length;
        const processingOrders = ordersData.filter((order: Order) => order.status.toLowerCase() === 'processing').length;
        const cancelledOrders = ordersData.filter((order: Order) => order.status.toLowerCase() === 'cancelled').length;
        const failedOrders = ordersData.filter((order: Order) => order.status.toLowerCase() === 'failed').length;
        
        const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + order.total, 0);
        
        // Get orders from the last 7 days as recent activity
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentActivityCount = ordersData.filter(
          (order: Order) => new Date(order.createdAt) >= sevenDaysAgo
        ).length;
        
        setSummaryData({
          totalOrders,
          activeOrders,
          totalRevenue,
          pendingOrders,
          processingOrders,
          cancelledOrders,
          failedOrders,
          recentActivityCount
        });
        
        // Fetch plans
        const plansResponse = await fetch('/api/admin/plans');
        
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setPlans(plansData);
        }
        
        // Fetch media
        const mediaResponse = await fetch('/api/admin/media');
        
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          setMedia(mediaData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when search term or status filter changes
  useEffect(() => {
    if (orders.length > 0) {
      let result = [...orders];
      
      // Apply search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        result = result.filter(
          (order) => 
            order.orderId.toLowerCase().includes(lowercaseSearch) ||
            order.planName.toLowerCase().includes(lowercaseSearch) ||
            order.customerName.toLowerCase().includes(lowercaseSearch) ||
            order.customerEmail.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        result = result.filter((order) => order.status.toLowerCase() === statusFilter.toLowerCase());
      }
      
      setFilteredOrders(result);
    }
  }, [searchTerm, statusFilter, orders]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge styling with enhanced visuals
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-0 flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="h-3 w-3" />
            <span>Active</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-0 flex items-center gap-1 shadow-sm">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 flex items-center gap-1 shadow-sm">
            <RefreshCw className="h-3 w-3" />
            <span>Processing</span>
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-0 flex items-center gap-1 shadow-sm">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border-0 flex items-center gap-1 shadow-sm">
            <ServerCrash className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-0 flex items-center gap-1 shadow-sm">
            <AlertTriangle className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        );
    }
  };

  // Calculate order fulfillment rate
  const calculateFulfillmentRate = () => {
    if (orders.length === 0) return 0;
    
    const fulfilledOrders = orders.filter((order) => 
      order.status.toLowerCase() === 'active' || 
      order.isInitialized
    ).length;
    
    return Math.round((fulfilledOrders / orders.length) * 100);
  };

  // Handler for initializing an order
  const handleInitializeOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsInitializeDialogOpen(true);
  };

  // Handler for viewing order details
  const handleViewOrderDetails = (order: Order) => {
    // Enrich order with plan and media data if needed
    const enrichedOrder = {
      ...order,
      planDetails: plans.find((plan) => plan.name === order.planName),
      mediaDetails: media.filter((m) => m.userId === order.userId)
    };
    
    setSelectedOrder(enrichedOrder as Order);
    setIsOrderDetailsOpen(true);
  };

  // Handler for copying to clipboard
  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handler for order initialization completion
  const handleInitializationComplete = (initializedOrder: Order) => {
    // Update the order in the list
    const updatedOrders = orders.map((order) => 
      order.id === initializedOrder.id ? { ...order, ...initializedOrder, isInitialized: true } : order
    );
    
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders.filter((order) => {
      // Apply current filters
      if (statusFilter !== "all" && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        return order.orderId.toLowerCase().includes(lowercaseSearch) ||
          order.planName.toLowerCase().includes(lowercaseSearch) ||
          order.customerName.toLowerCase().includes(lowercaseSearch) ||
          order.customerEmail.toLowerCase().includes(lowercaseSearch);
      }
      
      return true;
    }));
    
    // Close the dialog
    setIsInitializeDialogOpen(false);
  };

  // Prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-6 pb-10">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Orders Management</h2>
          <p className="text-gray-500">Manage customer orders and service initializations</p>
        </div>
        <div>
          <Button className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white border-0 shadow-lg shadow-blue-600/20">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Order statistics dashboard */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Orders</div>
                  <div className="text-3xl font-bold">{summaryData.totalOrders}</div>
                </div>
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                  <div className="text-3xl font-bold">{formatCurrency(summaryData.totalRevenue)}</div>
                </div>
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Active Orders</div>
                  <div className="text-3xl font-bold">{summaryData.activeOrders}</div>
                </div>
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Pending Orders</div>
                  <div className="text-3xl font-bold">{summaryData.pendingOrders}</div>
                </div>
                <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order fulfillment metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="border border-slate-200 shadow-lg bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Order Fulfillment Rate
            </CardTitle>
            <CardDescription>How effectively orders are being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Progress</span>
                <span className="text-sm font-semibold text-blue-600">{calculateFulfillmentRate()}%</span>
              </div>
              <Progress value={calculateFulfillmentRate()} className="h-2 bg-blue-100" />
              
              <div className="pt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                    <span className="text-gray-700">Pending</span>
                  </div>
                  <span className="font-semibold">{summaryData.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                    <span className="text-gray-700">Processing</span>
                  </div>
                  <span className="font-semibold">{summaryData.processingOrders}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <span className="text-gray-700">Cancelled</span>
                  </div>
                  <span className="font-semibold">{summaryData.cancelledOrders}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <span className="text-gray-700">Active</span>
                  </div>
                  <span className="font-semibold">{summaryData.activeOrders}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Order activity in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      New Orders (Last 7 days)
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="h-2 rounded-full bg-blue-100 w-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                          style={{ width: `${(summaryData.recentActivityCount / summaryData.totalOrders) * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{summaryData.recentActivityCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Conversion rate:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {orders.length > 0
                      ? `${Math.round((summaryData.activeOrders / orders.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Avg. Order Value</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {orders.length > 0
                      ? formatCurrency(summaryData.totalRevenue / orders.length)
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Initialization Rate</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {orders.length > 0
                      ? `${Math.round((orders.filter(o => o.isInitialized).length / orders.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders by ID, customer, or plan..."
            className="pl-10 border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tabs for order status */}
      <div>
        <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
          <TabsList className="grid grid-cols-6 gap-4 rounded-lg p-1 bg-gradient-to-r from-slate-100 to-gray-50 shadow-inner">
            <TabsTrigger 
              value="all" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-blue-500 transition-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-green-500 transition-all"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-amber-500 transition-all"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="processing" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-blue-500 transition-all"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-red-500 transition-all"
            >
              Cancelled
            </TabsTrigger>
            <TabsTrigger 
              value="failed" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-rose-500 transition-all"
            >
              Failed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders table */}
      <div>
        <Card className="border border-slate-200 shadow-xl bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
          <CardHeader className="px-6 py-5 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800 font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Orders List
              </CardTitle>
              <CardDescription className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4">
            {isLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-10 w-10 mx-auto mb-4 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="bg-blue-50 rounded-full p-5 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your search or filters to find the orders you're looking for</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-600">Order ID</TableHead>
                      <TableHead className="font-semibold text-gray-600">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-600">Plan</TableHead>
                      <TableHead className="font-semibold text-gray-600">Date</TableHead>
                      <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-600">Status</TableHead>
                      <TableHead className="font-semibold text-gray-600">Initialized</TableHead>
                      <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => (
                      <TableRow
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-blue-50/30"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                              <FileText className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-medium text-blue-700">{order.orderId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {order.customerEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="font-medium text-gray-800">{order.planName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-emerald-700">
                            {formatCurrency(order.total)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {order.isInitialized ? (
                            <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-0 flex items-center gap-1 shadow-sm">
                              <Check className="h-3 w-3" />
                              <span>Yes</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 flex items-center gap-1 bg-amber-50">
                              <Clock className="h-3 w-3" />
                              <span>No</span>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(!order.isInitialized && (order.status === "pending" || order.status === "processing")) && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm"
                                onClick={() => handleInitializeOrder(order)}
                              >
                                Initialize
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-56 bg-white border border-gray-200 shadow-md rounded-lg py-1.5 z-[100]"
                                sideOffset={5}
                                alignOffset={0}
                                avoidCollisions={true}
                              >
                                <DropdownMenuItem
                                  onClick={() => handleViewOrderDetails(order)}
                                  className="cursor-pointer hover:bg-gray-50 py-2 px-3"
                                >
                                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer hover:bg-gray-50 py-2 px-3"
                                  onClick={() => handleCopyToClipboard(order.orderId, "orderId")}
                                >
                                  {copiedField === "orderId" ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2 text-green-600" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2 text-blue-600" />
                                      <span>Copy Order ID</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {order.status !== "cancelled" && (
                                  <DropdownMenuItem className="cursor-pointer hover:bg-red-50 py-2 px-3 text-red-600">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    <span>Cancel Order</span>
                                  </DropdownMenuItem>
                                )}
                                {order.isInitialized && (
                                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                    <PencilLine className="h-4 w-4 mr-2 text-blue-600" />
                                    <span>Edit Details</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="text-xs h-8" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8 bg-blue-50 text-blue-600">
                  1
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Order initialization dialog */}
      {selectedOrder && (
        <OrderInitializeDialog 
          order={selectedOrder}
          open={isInitializeDialogOpen}
          onOpenChange={setIsInitializeDialogOpen}
          onComplete={handleInitializationComplete}
          plans={plans} // Pass plans to initialization dialog
        />
      )}

      {/* Order details sheet */}
      {selectedOrder && (
        <OrderDetailsSheet
          order={selectedOrder}
          open={isOrderDetailsOpen}
          onOpenChange={setIsOrderDetailsOpen}
          plans={plans} // Pass plans to details sheet
          media={media.filter(m => m.userId === selectedOrder.userId)} // Pass relevant media to details sheet
          onOrderUpdated={(updatedOrder) => {
            // Update the order in the list
            const updatedOrders = orders.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            );
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
          }}
        />
      )}
    </div>
  );
} 