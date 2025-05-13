"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";

// Temporary mock chart component until the real one is available
const AnalyticsChart = ({ type, range }: { type: string, range: string }) => (
  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
    <p className="text-gray-500">Chart: {type} data for {range}</p>
  </div>
);

const Chart = dynamic(() => Promise.resolve(AnalyticsChart), {
  ssr: false, 
  loading: () => <div className="h-64 flex items-center justify-center">Loading chart...</div>
});

const RANGES = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "12mo", value: "12mo" },
];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("30d");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<any>(null);

  // Fetch analytics data
  const fetchData = async () => {
    setLoading(true);
    try {
      // For development, use mock data instead of fetching
      setData({
        totalOrders: 425,
        totalRevenue: 325000,
        revenueGrowth: 12.5,
        totalUsers: 187,
        userGrowth: 8.3,
        activeServices: 310,
        recentOrders: []
      });
      setLastUpdated(new Date());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Polling for real-time updates
  useEffect(() => {
    fetchData();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchData, 20000); // 20s
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [range]);

  // Stat card with animation and trending
  const StatCard = ({ icon, label, value, delta, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 min-w-[180px] bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col gap-2 justify-between hover:shadow-2xl transition-all glassmorphism"
    >
      <div className="flex items-center gap-2 text-gray-500 mb-2">{icon}<span className="font-medium text-gray-700">{label}</span></div>
      <motion.div
        key={value}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900"
      >
        {value}
      </motion.div>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
          {delta > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="flex-1 p-0 bg-gradient-to-br from-white via-sky-50 to-indigo-50 min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Analytics Overview</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map(r => (
            <Button
              key={r.value}
              variant={range === r.value ? "default" : "outline"}
              className={`rounded-full px-4 py-1 text-sm font-semibold ${range === r.value ? "bg-sky-600 text-white" : "bg-white text-gray-700 border-gray-200"}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 text-sm font-semibold border-gray-200"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<ShoppingCart className="h-6 w-6 text-blue-500" />} label="Total Orders" value={data?.totalOrders ?? "-"} />
          <StatCard icon={<DollarSign className="h-6 w-6 text-green-500" />} label="Total Revenue" value={`PKR ${data?.totalRevenue?.toLocaleString() ?? "-"}`} delta={data?.revenueGrowth} color={data?.revenueGrowth > 0 ? "text-green-600" : "text-red-600"} />
          <StatCard icon={<Users className="h-6 w-6 text-indigo-500" />} label="Total Users" value={data?.totalUsers ?? "-"} delta={data?.userGrowth} color={data?.userGrowth > 0 ? "text-green-600" : "text-red-600"} />
          <StatCard icon={<RefreshCcw className="h-6 w-6 text-amber-500" />} label="Active Services" value={data?.activeServices ?? "-"} />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading chart...</div>}>
                <Chart type="revenue" range={range} />
              </Suspense>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading chart...</div>}>
                <Chart type="users" range={range} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        {/* Recent orders and users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOrdersTable />
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100">
                <div className="p-6 text-center text-gray-400">No recent users</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 