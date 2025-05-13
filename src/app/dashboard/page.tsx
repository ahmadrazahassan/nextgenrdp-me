"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, ShoppingCart, CreditCard, Activity, BarChart3, PieChartIcon, TrendingUp, Clock, Calendar, Filter, Download, RefreshCw, Cpu, HardDrive, Wifi, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useInView } from "react-intersection-observer";

// Define interfaces
interface StatSummary {
    activeServices: number;
    pendingOrders: number;
    totalSpent: number;
}

interface AnalyticsData {
    timeRange: string;
    isRefreshing: boolean;
    cpuUsage: { hour: number; usage: number }[];
    ramUsage: { day: number; usage: number }[];
    networkUsage: { day: number; total: number; in: number; out: number }[];
    diskUsage: { day: number; usage: number }[];
    serviceUptime: { name: string; uptime: number }[];
    serviceDistribution: { name: string; value: number; color: string }[];
    dailyUsage: { hour: string; cpu: number; ram: number; disk: number; network: number }[];
    performanceScore: number;
}

// Define Order interface
interface Order {
    id: string;
    status?: string;
    total?: number;
    totalAmountPkr?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Memoized components for performance
const StatCard = memo(({ title, value, icon: Icon, description, change, changeType = "neutral" }: {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative"
    >
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-purple-600/10 blur-xl opacity-70 -z-10 
                  group-hover:opacity-85 transition-opacity duration-300"
      />
      <Card className="overflow-hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 
                      shadow-sm hover:shadow-md transition-all duration-200 rounded-xl relative z-10 h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-500 dark:to-indigo-500 bg-clip-text text-transparent">{value}</h3>
              {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
            </div>
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur-[6px] opacity-40"></div>
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 dark:from-violet-600/30 dark:to-indigo-600/30 flex items-center justify-center">
                <Icon className="h-6 w-6 text-violet-700 dark:text-violet-400" />
              </div>
            </div>
          </div>
          {change !== undefined && (
            <div className={`mt-4 flex items-center text-xs font-medium ${
              changeType === "positive" ? "text-emerald-600 dark:text-emerald-500" 
              : changeType === "negative" ? "text-rose-600 dark:text-rose-500" 
              : "text-gray-500 dark:text-gray-400"
            }`}>
              {changeType === "positive" ? <TrendingUp className="mr-1 h-3 w-3" /> : null}
              {changeType === "negative" ? <TrendingUp className="mr-1 h-3 w-3 transform rotate-180" /> : null}
              {change}% {changeType === "positive" ? "increase" : changeType === "negative" ? "decrease" : "change"} from last period
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
StatCard.displayName = "StatCard";

// Memoized chart component with enhanced styling
const ChartContainer = memo(({ title, description, children, isLoading }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="w-full relative group"
    >
      {/* Enhanced gradient background with animation */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-transparent 
                   blur-xl opacity-50 -z-10 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
      />
      <Card className="overflow-hidden border border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 
                      backdrop-blur-md shadow-sm group-hover:shadow-lg transition-all duration-200 rounded-xl">
        <CardHeader className="pb-3 border-b border-violet-100/50 dark:border-violet-900/30 bg-gradient-to-r from-violet-50/90 to-white/80 dark:from-violet-950/30 dark:to-gray-950/80">
          <div className="flex items-center">
            <div className="mr-2 relative h-5 w-5">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full opacity-20 blur-sm"></div>
              <Activity className="h-4 w-4 text-violet-600 dark:text-violet-400 relative" />
            </div>
            <CardTitle className="text-base font-semibold bg-gradient-to-r from-violet-800 to-indigo-700 dark:from-violet-300 dark:to-indigo-400 bg-clip-text text-transparent">{title}</CardTitle>
          </div>
          {description && (
            <CardDescription className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-950 dark:to-violet-950/10">
          {isLoading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="relative h-10 w-10 mb-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md opacity-70"
                  />
                </div>
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-1/2 mt-4 rounded-md" />
              </div>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
ChartContainer.displayName = "ChartContainer";

// Main dashboard component
export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<StatSummary>({
        activeServices: 0,
        pendingOrders: 0,
        totalSpent: 0,
    });
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        timeRange: "30days",
        isRefreshing: false,
        cpuUsage: [],
        ramUsage: [],
        networkUsage: [],
        diskUsage: [],
        serviceUptime: [],
        serviceDistribution: [],
        dailyUsage: [],
        performanceScore: 0,
    });
    
    const { toast } = useToast();
    const prefersReducedMotion = useReducedMotion();
    
    // Animation variants with reduced motion support
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.1,
                delayChildren: 0.1,
                duration: 0.5
            }
        }
    }), [prefersReducedMotion]);
    
    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: prefersReducedMotion ? 0.1 : 0.5
            }
        }
    }), [prefersReducedMotion]);
    
    // Generate analytics data with memoization
    const generateAnalyticsData = useCallback((timeRange: string) => {
        console.log(`Generating analytics for: ${timeRange}`);
        
        const days = timeRange === '7days' ? 7 : timeRange === '90days' ? 90 : 30;

        // Optimized data generation - only generates what's needed
        const cpuData = Array.from({ length: 24 }, (_, i) => ({ 
            hour: i, 
            usage: Math.floor(25 + Math.random() * 45) 
        }));
        
        const ramData = Array.from({ length: days }, (_, i) => ({ 
            day: i + 1, 
            usage: Math.floor(40 + Math.random() * 30) 
        }));
        
        const networkData = Array.from({ length: days }, (_, i) => ({ 
            day: i + 1, 
            total: Math.floor(100 + Math.random() * 900), 
            in: Math.floor(50 + Math.random() * 400), 
            out: Math.floor(50 + Math.random() * 500) 
        }));
        
        const diskData = Array.from({ length: days }, (_, i) => ({ 
            day: i + 1, 
            usage: Math.floor(30 + Math.random() * 20) 
        }));
        
        const uptimeData = [ 
            { name: 'RDP Server', uptime: 99.8 + (Math.random()*0.2) }, 
            { name: 'VPS Basic', uptime: 99.9 + (Math.random()*0.1) }, 
            { name: 'VPS Pro', uptime: 100 }, 
            { name: 'Database', uptime: 99.7 + (Math.random()*0.3) }, 
            { name: 'Storage', uptime: 99.5 + (Math.random()*0.5) } 
        ].map(s => ({...s, uptime: parseFloat(s.uptime.toFixed(1))}));
        
        const distributionData = [ 
            { name: 'RDP', value: 45 + Math.floor(Math.random()*10-5), color: '#3b82f6' }, 
            { name: 'VPS Basic', value: 30+ Math.floor(Math.random()*10-5), color: '#8b5cf6' }, 
            { name: 'VPS Pro', value: 15+ Math.floor(Math.random()*10-5), color: '#10b981' }, 
            { name: 'Storage', value: 10+ Math.floor(Math.random()*10-5), color: '#f59e0b' } 
        ];
        
        // Only generate 24h cycle data once to improve performance
        const dailyUsageData = Array.from({ length: 24 }, (_, i) => ({ 
            hour: `${i}:00`, 
            cpu: Math.floor(20 + Math.random() * 50), 
            ram: Math.floor(30 + Math.random() * 40), 
            disk: Math.floor(10 + Math.random() * 30), 
            network: Math.floor(15 + Math.random() * 45) 
        }));

        // Calculate performance score efficiently
        const avgCpuUsage = cpuData.reduce((sum, item) => sum + item.usage, 0) / cpuData.length;
        const avgRamUsage = ramData.reduce((sum, item) => sum + item.usage, 0) / ramData.length;
        const avgDiskUsage = diskData.reduce((sum, item) => sum + item.usage, 0) / diskData.length;
        const performanceScore = Math.round(
            (Math.max(0, 100 - avgCpuUsage) * 0.4) + 
            (Math.max(0, 100 - avgRamUsage) * 0.4) + 
            (Math.max(0, 100 - avgDiskUsage) * 0.2)
        );

        setAnalyticsData(prev => ({
            ...prev,
            timeRange,
            cpuUsage: cpuData,
            ramUsage: ramData,
            networkUsage: networkData,
            diskUsage: diskData,
            serviceUptime: uptimeData,
            serviceDistribution: distributionData,
            dailyUsage: dailyUsageData,
            performanceScore,
        }));
    }, []);

    // Memoized handlers for better performance
    const handleTimeRangeChange = useCallback((value: string) => {
        setAnalyticsData(prev => ({
            ...prev,
            timeRange: value,
            isRefreshing: true
        }));
        
        // Simulate fetching new data based on time range
        setTimeout(() => {
            generateAnalyticsData(value);
        }, 500);
    }, [generateAnalyticsData]);

    const handleRefreshAnalytics = useCallback(() => {
        setAnalyticsData(prev => ({ ...prev, isRefreshing: true }));
        
        setTimeout(() => {
            generateAnalyticsData(analyticsData.timeRange);
            setAnalyticsData(prev => ({ ...prev, isRefreshing: false }));
            toast({ 
                title: "Analytics Refreshed", 
                duration: 2000 
            });
        }, 1500);
    }, [analyticsData.timeRange, generateAnalyticsData, toast]);

    // Custom tooltip component (memoized)
    const CustomTooltip = memo(({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg text-xs">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-gray-800 pb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={`item-${index}`} className="flex items-center py-1">
                            <span className="w-3 h-3 inline-block mr-2 rounded-sm" style={{ backgroundColor: entry.color }}></span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{entry.name}: </span>
                            <span className="ml-1 text-gray-900 dark:text-gray-100 font-semibold">{entry.value}{entry.unit || ''}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    });
    CustomTooltip.displayName = "CustomTooltip";

    // Optimized data fetching
    useEffect(() => {
        let isMounted = true;
        
        const fetchDashboardData = async () => {
            setIsLoading(true);
            
            try {
                const ordersResponse = await fetch("/api/user/orders", {
                    // Add cache control to improve performance
                    cache: 'no-store',
                    next: { revalidate: 300 } // Revalidate every 5 minutes
                });
                
                if (!ordersResponse.ok) {
                    let errorMsg = "Failed to fetch dashboard stats";
                    try {
                        const errorData = await ordersResponse.json();
                        errorMsg = errorData.error?.message || errorMsg;
                    } catch (_) {}
                    throw new Error(errorMsg);
                }
                
                const responseData = await ordersResponse.json();
                const orders = responseData.orders || [];

                if (isMounted) {
                    // Calculate stats efficiently
                    const activeServices = orders.filter((order: Order) => 
                        order.status?.toLowerCase() === "active"
                    ).length;
                    
                    const pendingOrders = orders.filter((order: Order) => 
                        order.status ? ["pending", "pending_payment", "processing"].includes(order.status.toLowerCase()) : false
                    ).length;
                    
                    const totalSpent = orders
                        .filter((order: Order) => 
                            order.status ? !["cancelled", "failed", "refunded"].includes(order.status.toLowerCase()) : true
                        )
                        .reduce((sum: number, order: Order) => 
                            sum + (order.totalAmountPkr ?? order.total ?? 0), 0
                        );

                    setStats({ activeServices, pendingOrders, totalSpent });
                    
                    // Generate initial analytics data
                    generateAnalyticsData("30days");
                }
            } catch (error: any) {
                console.error("Error fetching dashboard data:", error);
                if (isMounted) {
                    toast({
                        title: "Error Loading Dashboard",
                        description: error.message || "Could not load dashboard data. Please refresh.",
                        variant: "destructive",
                    });
                    
                    // Still generate some analytics data for better UX even in error cases
                    generateAnalyticsData("30days");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDashboardData();
        
        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [generateAnalyticsData, toast]);

    // Memoize chart data to prevent unnecessary recalculations
    const pieChartData = useMemo(() => analyticsData.serviceDistribution, [analyticsData.serviceDistribution]);
    const networkChartData = useMemo(() => analyticsData.networkUsage, [analyticsData.networkUsage]);
    const cpuChartData = useMemo(() => analyticsData.cpuUsage, [analyticsData.cpuUsage]);
    const ramChartData = useMemo(() => analyticsData.ramUsage, [analyticsData.ramUsage]);
    const diskChartData = useMemo(() => analyticsData.diskUsage, [analyticsData.diskUsage]);
    const serviceUptimeData = useMemo(() => analyticsData.serviceUptime, [analyticsData.serviceUptime]);
    const dailyUsageData = useMemo(() => analyticsData.dailyUsage, [analyticsData.dailyUsage]);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-gray-50 via-violet-50/20 to-gray-50 dark:from-gray-950 dark:via-violet-950/10 dark:to-gray-950 min-h-screen">
            {/* Enhanced background patterns */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-violet-500/5 via-indigo-500/5 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-violet-500/5 via-indigo-500/5 to-transparent"></div>
                <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/5 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl"></div>
            </div>
            
            <motion.div
                key="dashboard-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 relative z-10"
            >
                <div>
                    <div className="relative">
                        <div className="absolute -top-6 -left-8 h-20 w-20 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-full blur-xl"></div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">Dashboard</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">
                        Welcome to your NextGenRDP client portal
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Select value={analyticsData.timeRange} onValueChange={handleTimeRangeChange}>
                        <SelectTrigger className="w-[160px] rounded-lg border-gray-200/80 dark:border-gray-800/80 shadow-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                            <div className="relative w-5 h-5 mr-2">
                                <div className="absolute inset-0 rounded-full bg-violet-500 blur-[4px] opacity-20"></div>
                                <Calendar className="h-4 w-4 relative text-violet-600 dark:text-violet-400" />
                            </div>
                            <SelectValue placeholder="30 Days" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefreshAnalytics}
                        disabled={analyticsData.isRefreshing}
                        className="rounded-lg border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 
                                  bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
                    >
                        <div className="relative w-5 h-5 mr-2">
                            <div className="absolute inset-0 rounded-full bg-violet-500 blur-[4px] opacity-20"></div>
                            {analyticsData.isRefreshing ? (
                                <RefreshCw className="h-4 w-4 relative animate-spin text-violet-600 dark:text-violet-400" />
                            ) : (
                                <RefreshCw className="h-4 w-4 relative text-violet-600 dark:text-violet-400" />
                            )}
                        </div>
                        Refresh
                    </Button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div 
                        key="loading-stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {Array(4).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="stats-cards"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        <StatCard
                            title="Active Services"
                            value={stats.activeServices}
                            icon={Server}
                            description="Currently active RDP/VPS"
                        />
                        <StatCard
                            title="Pending Orders"
                            value={stats.pendingOrders}
                            icon={ShoppingCart}
                            description="Orders awaiting processing"
                        />
                        <StatCard
                            title="Total Spent"
                            value={`PKR ${stats.totalSpent.toLocaleString()}`}
                            icon={CreditCard}
                            description="Lifetime spending"
                        />
                        <StatCard
                            title="Performance Score"
                            value={`${analyticsData.performanceScore}%`}
                            icon={Activity}
                            description="Overall system performance"
                            change={5.2}
                            changeType="positive"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-12 mb-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 p-1 shadow-sm">
                    <TabsTrigger value="overview" className="rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                        <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Overview
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                        <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2" />
                            Performance
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                        <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Billing
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartContainer 
                            title="Services Distribution" 
                            description="Distribution of your active services by type"
                            isLoading={isLoading}
                        >
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>

                        <ChartContainer 
                            title="Service Uptime" 
                            description="Uptime percentage for your active services"
                            isLoading={isLoading}
                        >
                            <div className="space-y-4 mt-4">
                                {serviceUptimeData.map((service) => (
                                    <div key={service.name} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{service.name}</span>
                                            <Badge variant={service.uptime >= 99.9 ? "default" : "secondary"} className="px-2 py-0 h-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                                                {service.uptime}%
                                            </Badge>
                                        </div>
                                        <div className="relative pt-1">
                                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-800">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${service.uptime}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-full"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChartContainer>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <ChartContainer 
                            title="Daily Activity Overview" 
                            description="24-hour overview of system resources"
                            isLoading={isLoading}
                        >
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dailyUsageData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="cpu" stroke="#8b5cf6" name="CPU" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="ram" stroke="#6366f1" name="RAM" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="disk" stroke="#10b981" name="Disk" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="network" stroke="#f59e0b" name="Network" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartContainer 
                            title="CPU Usage" 
                            description="24-hour CPU usage pattern"
                            isLoading={isLoading}
                        >
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={cpuChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="usage" 
                                            stroke="#8b5cf6" 
                                            fill="url(#cpuGradient)" 
                                            fillOpacity={0.2} 
                                            name="CPU Usage" 
                                            unit="%" 
                                        />
                                        <defs>
                                            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>

                        <ChartContainer 
                            title="RAM Usage" 
                            description={`RAM usage over the last ${analyticsData.ramUsage.length} days`}
                            isLoading={isLoading}
                        >
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ramChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="usage" 
                                            stroke="#6366f1" 
                                            fill="url(#ramGradient)" 
                                            fillOpacity={0.2} 
                                            name="RAM Usage" 
                                            unit="%" 
                                        />
                                        <defs>
                                            <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>
                    </div>
                </TabsContent>

                <TabsContent value="billing" className="pt-6 space-y-6">
                    <ChartContainer 
                        title="Network Traffic" 
                        description={`Network usage over the last ${analyticsData.networkUsage.length} days`}
                        isLoading={isLoading}
                    >
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={networkChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="in" 
                                        stackId="1"
                                        stroke="#10b981" 
                                        fill="url(#networkInGradient)" 
                                        fillOpacity={0.5} 
                                        name="Inbound" 
                                        unit=" MB" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="out" 
                                        stackId="1"
                                        stroke="#f59e0b" 
                                        fill="url(#networkOutGradient)" 
                                        fillOpacity={0.5} 
                                        name="Outbound" 
                                        unit=" MB" 
                                    />
                                    <defs>
                                        <linearGradient id="networkInGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                                        </linearGradient>
                                        <linearGradient id="networkOutGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>
                </TabsContent>
            </Tabs>
        </div>
    );
}