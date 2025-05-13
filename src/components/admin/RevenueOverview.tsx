"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, BarChart3, PieChart, RefreshCw, Calendar, Info, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";

interface MonthlyRevenue {
  month: string;
  revenue: number;
  orderCount: number;
}

interface PlanRevenueData {
  planName: string;
  revenue: number;
  orderCount: number;
  percentage: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  ytdRevenue: number;
  momGrowth: number;
  threeMonthTrend: number;
  annualRunRate: number;
  thisMonth: number;
  lastMonth: number;
}

interface RevenueData {
  monthlyRevenue: MonthlyRevenue[];
  planRevenueData: PlanRevenueData[];
  revenueMetrics: RevenueMetrics;
}

export default function RevenueOverview() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RevenueData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/admin/dashboard/revenue', {
        withCredentials: true
      });
      
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Failed to load revenue data. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to load revenue data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRevenueData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

  // Load skeleton
  if (isLoading && !data) {
    return (
      <Card className="w-full h-[500px] border-2 border-blue-100 shadow-lg animate-pulse">
        <CardHeader className="space-y-2">
          <div className="h-8 w-48 bg-blue-100 rounded-md"></div>
          <div className="h-4 w-96 bg-blue-50 rounded-md"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-blue-50 rounded-lg"></div>
            <div className="h-32 bg-blue-50 rounded-lg"></div>
            <div className="h-32 bg-blue-50 rounded-lg"></div>
          </div>
          <div className="h-64 bg-blue-50 rounded-lg mt-6"></div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error && !data) {
    return (
      <Card className="w-full border-2 border-red-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Revenue Overview Error
          </CardTitle>
          <CardDescription className="text-red-500">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button onClick={fetchRevenueData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  // Determine growth indicators
  const momGrowthColor = data.revenueMetrics.momGrowth >= 0 ? "text-green-600" : "text-red-600";
  const MomGrowthIcon = data.revenueMetrics.momGrowth >= 0 ? ArrowUpRight : ArrowDownRight;
  const momGrowthBg = data.revenueMetrics.momGrowth >= 0 ? "bg-green-50" : "bg-red-50";
  const momGrowthBorder = data.revenueMetrics.momGrowth >= 0 ? "border-green-200" : "border-red-200";

  // Highest revenue plan
  const topPlan = data.planRevenueData[0] || { planName: 'No plans', revenue: 0, percentage: 0 };

  return (
    <Card className="w-full border-2 border-blue-100 shadow-lg overflow-hidden">
      <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-1">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of your business revenue streams
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={fetchRevenueData}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="text-sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="plans" className="text-sm">
              <PieChart className="h-4 w-4 mr-2" />
              Plans
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <Card className="border border-blue-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(data.revenueMetrics.totalRevenue)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Lifetime</p>
                </CardContent>
              </Card>
              
              {/* YTD Revenue */}
              <Card className="border border-green-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">YTD Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">
                    {formatCurrency(data.revenueMetrics.ytdRevenue)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Current year</p>
                </CardContent>
              </Card>
              
              {/* Monthly Growth */}
              <Card className={cn("border shadow-sm", data.revenueMetrics.momGrowth >= 0 ? "border-green-100" : "border-red-100")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-3xl font-bold flex items-center gap-1", momGrowthColor)}>
                    {Math.abs(data.revenueMetrics.momGrowth).toFixed(1)}%
                    <MomGrowthIcon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">Last month: {formatCurrency(data.revenueMetrics.lastMonth)}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Annual Run Rate */}
              <Card className="border border-purple-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Annual Run Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700">
                    {formatCurrency(data.revenueMetrics.annualRunRate)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Projected</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Revenue Chart */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trend for the last 12 months</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {formatCurrency(data.revenueMetrics.thisMonth)} This Month
                </Badge>
              </CardHeader>
              <CardContent className="h-[280px] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full p-4">
                    <div className="relative h-full">
                      {/* Chart bars */}
                      <div className="flex items-end justify-between h-[200px] gap-1">
                        {data.monthlyRevenue.map((month, index) => {
                          // Find maximum revenue for scaling
                          const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue));
                          // Calculate bar height as percentage of max
                          const heightPercentage = (month.revenue / maxRevenue) * 100;
                          // Determine if this is the current month
                          const isCurrentMonth = index === data.monthlyRevenue.length - 1;
                          
                          return (
                            <div key={month.month} className="flex flex-col items-center flex-1">
                              <div 
                                className={cn(
                                  "w-full rounded-t-sm transition-all duration-300 relative group",
                                  isCurrentMonth ? "bg-blue-600" : "bg-blue-400"
                                )}
                                style={{ height: `${heightPercentage}%` }}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                  <div className="font-bold">{formatCurrency(month.revenue)}</div>
                                  <div className="text-gray-300 text-[10px]">{month.orderCount} orders</div>
                                </div>
                              </div>
                              <div className="text-xs mt-2 text-gray-600 -rotate-45 origin-top-left translate-x-3">
                                {month.month}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Trends Tab Content */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Metrics */}
              <Card className="border border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Growth Metrics</CardTitle>
                  <CardDescription>Performance indicators over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Month over Month Growth */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Month over Month Growth</div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          data.revenueMetrics.momGrowth >= 0 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {formatPercentage(data.revenueMetrics.momGrowth)}
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min(Math.abs(data.revenueMetrics.momGrowth), 100)} 
                      className="h-2"
                      indicatorClassName={data.revenueMetrics.momGrowth >= 0 ? "bg-green-500" : "bg-red-500"}
                    />
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>Current: {formatCurrency(data.revenueMetrics.thisMonth)}</span>
                      <span>Previous: {formatCurrency(data.revenueMetrics.lastMonth)}</span>
                    </div>
                  </div>
                  
                  {/* 3-Month Trend */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">3-Month Trend</div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          data.revenueMetrics.threeMonthTrend >= 0 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {formatPercentage(data.revenueMetrics.threeMonthTrend)}
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min(Math.abs(data.revenueMetrics.threeMonthTrend), 100)} 
                      className="h-2"
                      indicatorClassName={data.revenueMetrics.threeMonthTrend >= 0 ? "bg-green-500" : "bg-red-500"}
                    />
                  </div>
                  
                  {/* Monthly Revenue Comparison */}
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Monthly Revenue Comparison</h4>
                    <div className="space-y-3">
                      {data.monthlyRevenue.slice(-3).reverse().map((month, index) => (
                        <div key={month.month} className="flex items-center">
                          <div className="w-24 flex-shrink-0 text-sm font-medium">
                            {month.month}
                          </div>
                          <div className="flex-1 ml-2">
                            <Progress 
                              value={index === 0 ? 100 : (month.revenue / data.monthlyRevenue[data.monthlyRevenue.length - 1].revenue) * 100} 
                              className="h-2"
                              indicatorClassName={
                                index === 0 ? "bg-blue-600" :
                                index === 1 ? "bg-blue-400" : 
                                "bg-blue-300"
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm font-medium w-24 text-right">
                            {formatCurrency(month.revenue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Revenue Analysis */}
              <Card className="border border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Order Revenue Analysis</CardTitle>
                  <CardDescription>Revenue per order statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Calculate average order value */}
                  {(() => {
                    // Extract order counts and revenues per month
                    const monthlyOrderCounts = data.monthlyRevenue.map(m => m.orderCount);
                    const monthlyRevenues = data.monthlyRevenue.map(m => m.revenue);
                    
                    // Calculate total orders and revenue
                    const totalOrders = monthlyOrderCounts.reduce((a, b) => a + b, 0);
                    const totalRevenue = monthlyRevenues.reduce((a, b) => a + b, 0);
                    
                    // Calculate average order value
                    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                    
                    // Calculate average orders per month
                    const avgOrdersPerMonth = totalOrders / monthlyOrderCounts.length;
                    
                    // Calculate average revenue per month
                    const avgRevenuePerMonth = totalRevenue / monthlyRevenues.length;
                    
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-700">
                              {formatCurrency(avgOrderValue)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Avg Order Value
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">
                              {avgOrdersPerMonth.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Avg Orders/Month
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-700">
                              {formatCurrency(avgRevenuePerMonth)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Avg Revenue/Month
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-3">Order Count vs Revenue</h4>
                          <div className="space-y-3">
                            {data.monthlyRevenue.slice(-3).reverse().map((month) => (
                              <div key={`orders-${month.month}`} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>{month.month}</span>
                                  <span>{month.orderCount} orders</span>
                                </div>
                                <Progress 
                                  value={100} 
                                  className="h-1 bg-blue-100"
                                  indicatorClassName="bg-blue-600"
                                />
                                <div className="flex items-center justify-between text-xs">
                                  <span></span>
                                  <span>{formatCurrency(month.revenue)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Plans Tab Content */}
          <TabsContent value="plans" className="space-y-6">
            <Card className="border border-blue-100 shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-medium">Plan Revenue Distribution</CardTitle>
                    <CardDescription>Revenue generated by different plans</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Top Plan: {topPlan.planName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.planRevenueData.map((plan, index) => (
                    <div key={plan.planName} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className={cn(
                              "h-3 w-3 rounded-full",
                              index === 0 ? "bg-blue-600" :
                              index === 1 ? "bg-blue-400" :
                              index === 2 ? "bg-blue-300" :
                              "bg-blue-200"
                            )}
                          ></div>
                          <span className="text-sm font-medium truncate max-w-[200px]">{plan.planName}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(plan.revenue)}
                        </span>
                      </div>
                      <Progress 
                        value={plan.percentage} 
                        className="h-2"
                        indicatorClassName={
                          index === 0 ? "bg-blue-600" :
                          index === 1 ? "bg-blue-400" :
                          index === 2 ? "bg-blue-300" :
                          "bg-blue-200"
                        }
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{plan.orderCount} orders</span>
                        <span>{formatPercentage(plan.percentage)} of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Plan Details Table */}
            <Card className="border border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">Plan Details</CardTitle>
                <CardDescription>Detailed revenue breakdown by plan</CardDescription>
              </CardHeader>
              <div className="px-6 overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 text-left font-medium text-gray-500">Plan Name</th>
                      <th className="py-3 text-right font-medium text-gray-500">Orders</th>
                      <th className="py-3 text-right font-medium text-gray-500">Revenue</th>
                      <th className="py-3 text-right font-medium text-gray-500">Avg. Value</th>
                      <th className="py-3 text-right font-medium text-gray-500">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.planRevenueData.map((plan) => (
                      <tr key={plan.planName} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-medium">{plan.planName}</td>
                        <td className="py-3 text-right">{plan.orderCount}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(plan.revenue)}</td>
                        <td className="py-3 text-right">
                          {formatCurrency(plan.orderCount > 0 ? plan.revenue / plan.orderCount : 0)}
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {formatPercentage(plan.percentage)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td className="py-3 font-bold">Total</td>
                      <td className="py-3 text-right font-bold">
                        {data.planRevenueData.reduce((sum, plan) => sum + plan.orderCount, 0)}
                      </td>
                      <td className="py-3 text-right font-bold">
                        {formatCurrency(data.planRevenueData.reduce((sum, plan) => sum + plan.revenue, 0))}
                      </td>
                      <td className="py-3 text-right"></td>
                      <td className="py-3 text-right font-bold">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <CardFooter className="pt-4 pb-4 text-xs text-gray-500">
                Data shows all-time revenue generation across different plans
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 