"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, PieChart, Calendar, Filter, ArrowDown, Share2, RefreshCw, AlertTriangle, LineChart, Activity, Users, Server } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
  charts: number;
  fileSize?: string;
}

export default function ReportsDashboard() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/admin/reports', {
        withCredentials: true
      });
      
      setReports(response.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReports();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchReports, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate a new report
  const generateReport = async (type: string) => {
    try {
      toast({
        title: "Generating Report",
        description: `Generating ${type} report...`,
      });
      
      await axios.post('/api/admin/reports', { type }, {
        withCredentials: true
      });
      
      toast({
        title: "Success",
        description: "Report generation has started. It will be available shortly.",
      });
      
      // Refresh reports list after a delay
      setTimeout(fetchReports, 3000);
    } catch (err) {
      console.error("Error generating report:", err);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Download a report
  const downloadReport = async (reportId: string) => {
    try {
      toast({
        title: "Downloading",
        description: "Your report download has started.",
      });
      
      window.open(`/api/admin/reports/${reportId}/download`, '_blank');
    } catch (err) {
      console.error("Error downloading report:", err);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter reports based on selected type
  const filteredReports = filterType === "all" 
    ? reports 
    : reports.filter(report => report.type === filterType);
  
  // Get badge color based on report type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "financial": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "analytics": return "bg-blue-100 text-blue-800 border-blue-200";
      case "operational": return "bg-amber-100 text-amber-800 border-amber-200";
      case "customer": return "bg-violet-100 text-violet-800 border-violet-200";
      case "technical": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get icon for report type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "financial": return <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center"><BarChart3 className="h-4 w-4 text-emerald-600" /></div>;
      case "analytics": return <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center"><LineChart className="h-4 w-4 text-blue-600" /></div>;
      case "operational": return <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center"><Activity className="h-4 w-4 text-amber-600" /></div>;
      case "customer": return <div className="h-8 w-8 bg-violet-100 rounded-full flex items-center justify-center"><Users className="h-4 w-4 text-violet-600" /></div>;
      case "technical": return <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center"><Server className="h-4 w-4 text-slate-600" /></div>;
      default: return <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center"><FileText className="h-4 w-4 text-gray-600" /></div>;
    }
  };

  // Show loading state
  if (isLoading && reports.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && reports.length === 0) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Reports</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchReports}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Reports Dashboard
          </h2>
          <p className="text-gray-600 text-sm">Generate and access detailed system reports</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select 
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full sm:w-auto"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Report Types</option>
              <option value="financial">Financial</option>
              <option value="analytics">Analytics</option>
              <option value="operational">Operational</option>
              <option value="customer">Customer</option>
              <option value="technical">Technical</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => generateReport("comprehensive")}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Generate New Report
          </Button>
        </div>
      </div>

      {/* Available Reports */}
      <Card className="border-2 border-gray-200 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Available Reports
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                View and download system generated reports
              </CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-gray-200"
              onClick={fetchReports}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredReports.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2">No reports available</p>
                <p className="text-sm">Generate a new report to get started</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(report.type)}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">{report.title}</h3>
                          <Badge variant="outline" className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.date}
                          </span>
                          <span className="flex items-center">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {report.charts} charts
                          </span>
                          {report.fileSize && (
                            <span className="text-xs text-gray-500">
                              {report.fileSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-gray-200">
                        <Share2 className="h-4 w-4 mr-1" /> Share
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-100 shadow-md rounded-xl hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-800">Financial Reports</CardTitle>
              {getTypeIcon("financial")}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Revenue analysis, transaction history, and financial performance metrics
            </p>
            <Button 
              variant="outline" 
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => generateReport("financial")}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 shadow-md rounded-xl hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-800">Customer Reports</CardTitle>
              {getTypeIcon("customer")}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              User demographics, satisfaction metrics, and engagement analysis
            </p>
            <Button 
              variant="outline" 
              className="w-full border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => generateReport("customer")}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 shadow-md rounded-xl hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-800">System Reports</CardTitle>
              {getTypeIcon("technical")}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Performance metrics, infrastructure status, and service availability
            </p>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => generateReport("technical")}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 