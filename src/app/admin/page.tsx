"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, BarChart3, DollarSign, Users, Package, 
  Server, TrendingUp, Cpu, Calendar, Clock, ArrowUpRight,
  Calendar as CalendarIcon, AlertCircle, Bell, LucideIcon,
  DatabaseBackup, LineChart, PieChart, Activity, Gauge, 
  MemoryStick, Wifi, Shield, Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Components for the dashboard
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { RecentUsersTable } from "@/components/admin/RecentUsersTable";
import RevenueOverview from "@/components/admin/RevenueOverview";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ReportsDashboard from "@/components/admin/ReportsDashboard";
import NotificationsDashboard from "@/components/admin/NotificationsDashboard";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    activeServices: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    pendingInitializations: 0,
    recentOrders: [],
    recentUsers: [],
    userGrowth: 0,
    revenueGrowth: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Fetch real dashboard data from API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Add credentials: 'include' to ensure cookies are sent with the request
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          // Handle 403 specifically
          if (response.status === 403) {
            setError("Authentication failed. Please log in as an administrator.");
            // Redirect to login page after a short delay
            setTimeout(() => {
              window.location.href = '/login?redirect=/admin';
            }, 2000);
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Tab icons with types
  interface TabInfo {
    value: string;
    label: string;
    icon: LucideIcon;
  }

  const tabItems: TabInfo[] = [
    { value: "overview", label: "Overview", icon: Gauge },
    { value: "analytics", label: "Analytics", icon: LineChart },
    { value: "reports", label: "Reports", icon: PieChart },
    { value: "notifications", label: "Notifications", icon: Bell }
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Monitor and manage your system's performance and metrics</p>
        </div>
        <div className="flex items-center gap-3 p-2.5 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-md">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-sm font-medium text-gray-800" suppressHydrationWarning>
              {new Date().toLocaleDateString("en-US", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-xs text-gray-500" suppressHydrationWarning>
              {new Date().toLocaleTimeString("en-US", { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
      
      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      {/* Tabs navigation */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <div className="bg-white border-2 border-gray-200 rounded-xl p-1.5 shadow-xl">
          <TabsList className="grid grid-cols-4 bg-gray-50 p-1.5 gap-2 rounded-lg">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex items-center justify-center gap-3 py-3.5 rounded-lg border-2 transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-lg data-[state=active]:bg-blue-600"
                      : "hover:bg-blue-50 hover:text-blue-700 border-transparent hover:border-blue-200"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "text-gray-500"
                  )} />
                  <span className="font-semibold">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        
        {/* Overview tab content */}
        <TabsContent value="overview" className="space-y-8 mt-8">
          {/* Stats cards */}
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Users card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-blue-200 shadow-xl overflow-hidden rounded-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-white to-blue-50 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-blue-100 bg-white">
                  <CardTitle className="text-base font-bold text-gray-800">
                    Total Users
                  </CardTitle>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <div className="text-4xl font-extrabold text-gray-900 flex items-baseline">
                    {isLoading ? (
                      <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    ) : (
                      dashboardData.totalUsers.toLocaleString()
                    )}
                    <span className="ml-3 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 flex items-center whitespace-nowrap">
                      +{dashboardData.userGrowth.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mt-3">
                    Growth from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Revenue card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-green-200 shadow-xl overflow-hidden rounded-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-white to-green-50 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-green-100 bg-white">
                  <CardTitle className="text-base font-bold text-gray-800">
                    Total Revenue
                  </CardTitle>
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg ring-4 ring-green-100">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <div className="flex flex-col">
                    <div className="text-4xl font-extrabold text-gray-900">
                      {isLoading ? (
                        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                      ) : (
                        <div className="flex items-start">
                          <span className="text-sm font-semibold mt-1 mr-1">PKR</span>
                          <span>{Math.round(dashboardData.totalRevenue).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mt-3">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 flex items-center">
                        +{dashboardData.revenueGrowth.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-500">from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Active Services card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-amber-200 shadow-xl overflow-hidden rounded-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-white to-amber-50 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-amber-100 bg-white">
                  <CardTitle className="text-base font-bold text-gray-800">
                    Active Services
                  </CardTitle>
                  <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-lg ring-4 ring-amber-100">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <div className="text-4xl font-extrabold text-gray-900">
                    {isLoading ? (
                      <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    ) : (
                      dashboardData.activeServices.toLocaleString()
                    )}
                  </div>
                  <div className="mt-3 flex items-center">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                      {dashboardData.pendingInitializations}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      pending initialization
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Orders card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-purple-200 shadow-xl overflow-hidden rounded-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-white to-purple-50 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-purple-100 bg-white">
                  <CardTitle className="text-base font-bold text-gray-800">
                    Total Orders
                  </CardTitle>
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg ring-4 ring-purple-100">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <div className="text-4xl font-extrabold text-gray-900">
                    {isLoading ? (
                      <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    ) : (
                      dashboardData.totalOrders.toLocaleString()
                    )}
                  </div>
                  <div className="mt-3 flex items-center">
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200">
                      {dashboardData.pendingOrders}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      pending orders
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Charts and system resources */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            {/* Revenue chart */}
            <Card className="col-span-7 md:col-span-4 border-2 border-gray-200 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-blue-600" />
                      Revenue Overview
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                      Monthly revenue breakdown for the current year
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="h-80 w-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-gray-300" />
                  </div>
                ) : (
                  <RevenueOverview />
                )}
              </CardContent>
            </Card>
            
            {/* System Resources */}
            <Card className="col-span-7 md:col-span-3 border-2 border-gray-200 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      System Resources
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                      Current resource utilization across servers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-3 w-full bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* CPU Usage */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center shadow-md text-white">
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">CPU Usage</span>
                            <div className="text-xs text-gray-500">4 Cores / 8 Threads</div>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-sky-700">64%</span>
                      </div>
                      <div className="h-3 w-full bg-sky-100 rounded-full overflow-hidden shadow-inner border border-sky-200">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full shadow-md" style={{ width: "64%" }}></div>
                      </div>
                      <div className="text-xs text-right text-gray-500 flex justify-between">
                        <span className="font-medium">Usage</span>
                        <span><span className="text-sky-700 font-medium">21.3 GHz</span> / 33.4 GHz</span>
                      </div>
                    </div>
                    
                    {/* Memory Usage */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md text-white">
                            <MemoryStick className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">Memory Usage</span>
                            <div className="text-xs text-gray-500">DDR4 DIMM</div>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-green-700">72%</span>
                      </div>
                      <div className="h-3 w-full bg-green-100 rounded-full overflow-hidden shadow-inner border border-green-200">
                        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-md" style={{ width: "72%" }}></div>
                      </div>
                      <div className="text-xs text-right text-gray-500 flex justify-between">
                        <span className="font-medium">Allocated</span>
                        <span><span className="text-green-700 font-medium">115.2 GB</span> / 160 GB</span>
                      </div>
                    </div>
                    
                    {/* Network Usage */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md text-white">
                            <Wifi className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">Network Usage</span>
                            <div className="text-xs text-gray-500">Bandwidth</div>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-purple-700">48%</span>
                      </div>
                      <div className="h-3 w-full bg-purple-100 rounded-full overflow-hidden shadow-inner border border-purple-200">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-md" style={{ width: "48%" }}></div>
                      </div>
                      <div className="text-xs text-right text-gray-500 flex justify-between">
                        <span className="font-medium">Current</span>
                        <span><span className="text-purple-700 font-medium">4.8 Gbps</span> / 10 Gbps</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent activity tables */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {/* Recent Orders table */}
            <Card className="border-2 border-gray-200 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Orders
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                      Latest order activities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RecentOrdersTable orders={dashboardData.recentOrders} />
                )}
              </CardContent>
            </Card>
            
            {/* Recent Users table */}
            <Card className="border-2 border-gray-200 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Users
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                      Latest user activities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RecentUsersTable users={dashboardData.recentUsers} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Analytics tab content */}
        <TabsContent value="analytics" className="mt-8">
          <AnalyticsDashboard />
        </TabsContent>
        
        {/* Reports tab content */}
        <TabsContent value="reports" className="mt-8">
          <ReportsDashboard />
        </TabsContent>
        
        {/* Notifications tab content */}
        <TabsContent value="notifications" className="mt-8">
          <NotificationsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
} 