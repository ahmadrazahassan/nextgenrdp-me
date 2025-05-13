"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, Globe, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface TrafficData {
  pageViews: { date: string; count: number }[];
  uniqueVisitors: { date: string; count: number }[];
  sources: { source: string; percentage: number; count: number }[];
  userActivity: { hour: number; percentage: number }[];
  conversionRates: {
    overall: number;
    change: number;
    avgOrderValue: number;
    pageRates: { page: string; rate: number }[];
  };
}

export default function AnalyticsDashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TrafficData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/admin/analytics?range=${timeRange}`, {
        withCredentials: true
      });
      
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  // If data is still loading and we have no cached data
  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200 p-6">
          <div className="text-center text-red-600">
            <p className="font-semibold text-lg">{error}</p>
            <Button 
              onClick={fetchAnalyticsData} 
              variant="outline" 
              className="mt-4 border-red-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data for Traffic Analytics
  const trafficChartData = {
    labels: data?.pageViews.map(item => item.date.substring(5)) || [],
    datasets: [
      {
        label: 'Page Views',
        data: data?.pageViews.map(item => item.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Unique Visitors',
        data: data?.uniqueVisitors.map(item => item.count) || [],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Prepare chart data for Traffic Sources
  const sourceChartData = {
    labels: data?.sources.map(item => item.source) || [],
    datasets: [
      {
        label: 'Traffic Sources',
        data: data?.sources.map(item => item.percentage) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(249, 115, 22)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for User Activity
  const userActivityData = {
    labels: data?.userActivity.map(item => `${item.hour}:00`) || [],
    datasets: [
      {
        label: 'Activity Level',
        data: data?.userActivity.map(item => item.percentage) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Traffic Analytics</h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <select 
            className="text-sm border border-gray-200 rounded-md p-1 bg-white"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            disabled={isLoading}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This year</option>
          </select>
          <Button 
            size="sm" 
            variant="outline"
            onClick={fetchAnalyticsData}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Analytics */}
        <Card className="border-2 border-gray-200 shadow-xl rounded-xl overflow-hidden lg:col-span-2">
          <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Traffic Analytics
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                  User sessions and page views over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] relative">
              {data && (
                <Line
                  data={trafficChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-2 border-gray-200 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Traffic Sources
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 font-medium mt-1">
              Where your visitors come from
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] relative mb-4">
              {data && (
                <Pie
                  data={sourceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              )}
            </div>
            
            {/* Legend and details */}
            {data && (
              <div className="space-y-2 mt-4">
                {data.sources.map((source, index) => {
                  const colors = [
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-yellow-500',
                    'bg-purple-500',
                    'bg-orange-500'
                  ];
                  
                  return (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-sm mr-2`}></div>
                        <span className="text-sm text-gray-600">{source.source}</span>
                      </div>
                      <span className="text-sm font-medium">{source.percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Activity & Conversion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <Card className="border-2 border-gray-200 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              User Activity
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 font-medium mt-1">
              Most active hours and user engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] relative">
              {data && (
                <Bar
                  data={userActivityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Activity: ${context.parsed.y}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      },
                    },
                  }}
                />
              )}
            </div>
            {data && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm font-medium text-gray-700">
                  Peak hours: {data.userActivity.reduce((peak, current) => 
                    current.percentage > peak.percentage ? current : peak, 
                    {hour: 0, percentage: 0}).hour}:00
                </div>
                <div className="text-sm text-gray-500">Average session: 8 min</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Rates */}
        <Card className="border-2 border-gray-200 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <ArrowUpRight className="h-5 w-5 mr-2 text-green-600" />
              Conversion Metrics
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 font-medium mt-1">
              Sales and conversion performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Conversion Rate</div>
                <div className="text-2xl font-bold text-green-700 flex items-center">
                  {data?.conversionRates.overall.toFixed(1)}%
                  <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${data?.conversionRates.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {data?.conversionRates.change > 0 ? '+' : ''}{data?.conversionRates.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Avg. Order Value</div>
                <div className="text-2xl font-bold text-blue-700">
                  PKR {data?.conversionRates.avgOrderValue.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {data?.conversionRates.pageRates.map((page) => {
                const getColor = (pageName: string) => {
                  if (pageName === 'Overall Funnel') return 'bg-purple-500';
                  if (pageName === 'Checkout') return 'bg-green-500';
                  if (pageName === 'Landing Page') return 'bg-blue-500';
                  if (pageName === 'Pricing Page') return 'bg-amber-500';
                  return 'bg-blue-500';
                };

                return (
                  <div key={page.page}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">{page.page}</div>
                      <div className="text-sm font-medium">{page.rate.toFixed(1)}%</div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getColor(page.page)}`} 
                        style={{ width: `${page.rate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 