"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  FileText,
  Download,
  Clock,
  Calendar,
  ReceiptIcon,
  CheckCircle2,
  XCircle,
  Wallet,
  ArrowUpRight,
  Hourglass,
  Info,
  Search,
  Filter,
  FileSpreadsheet,
  RefreshCw,
  Receipt
} from "lucide-react";

// Define interfaces for type safety
interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  date: string;
  dueDate?: string;
  paidDate?: string;
  planName: string;
  orderType: string;
}

interface BillingSummary {
  totalSpent: number;
  unpaidAmount: number;
  activeSubscriptions: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const { toast } = useToast();

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Fetch billing data from the API
  const fetchBillingData = async () => {
    setIsLoading(true);
    try {
      // Fetch billing summary
      const summaryResponse = await fetch('/api/user/billing/summary', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch billing summary');
      }
      const summaryData = await summaryResponse.json();
      setBillingSummary(summaryData);
      
      // Fetch invoices
      const invoicesResponse = await fetch('/api/user/billing/invoices', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!invoicesResponse.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const invoicesData = await invoicesResponse.json();
      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData);
      
    } catch (error) {
      console.error("Error fetching billing data:", error);
      toast({
        title: "Error loading billing data",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchBillingData();
  }, []);
  
  // Apply filters when search term or status filter changes
  useEffect(() => {
    if (invoices.length > 0) {
      let filtered = [...invoices];
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(invoice => 
          invoice.id.toLowerCase().includes(term) ||
          invoice.orderId.toLowerCase().includes(term) ||
          invoice.planName.toLowerCase().includes(term)
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(invoice => 
          invoice.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }
      
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, statusFilter, invoices]);
  
  // Refresh billing data
  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchBillingData();
    toast({
      title: "Refreshed",
      description: "Billing information has been updated",
      duration: 2000,
    });
  };

  // Get status badge styling
  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return {
          variant: "default" as const,
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
        };
      case "pending":
        return {
          variant: "outline" as const,
          className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          icon: <Hourglass className="h-3.5 w-3.5 mr-1.5" />
        };
      case "overdue":
        return {
          variant: "outline" as const,
          className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          icon: <XCircle className="h-3.5 w-3.5 mr-1.5" />
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
          icon: <Info className="h-3.5 w-3.5 mr-1.5" />
        };
    }
  };

  return (
    <div className="w-full px-4 py-8 md:px-8">
      {/* Enhanced Page Header with Premium Design */}
      <div className="relative mb-8">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl -z-10 blur-xl opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10 backdrop-blur-sm bg-white/30 dark:bg-slate-950/30 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Billing & Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage your billing details and view payment history</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              onClick={refreshData} 
              variant="outline" 
              size="sm"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm rounded-xl"
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
              onClick={() => window.open('/dashboard/support', '_blank')}
              variant="outline" 
              size="sm"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm rounded-xl"
            >
              <Info className="mr-2 h-4 w-4" />
              Billing Support
            </Button>
          </div>
        </div>
      </div>

      {/* Colorful Tabs */}
      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto bg-slate-100/70 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm mb-8">
          <TabsTrigger 
            value="overview" 
            className="rounded-xl text-sm px-5 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="rounded-xl text-sm px-5 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="rounded-xl text-sm px-5 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Payment History
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab Content */}
            <TabsContent value="overview" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-48 rounded-2xl" />
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {/* Billing Summary Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden border-slate-200/70 shadow-md bg-white rounded-2xl h-full">
                      <CardHeader className="pb-4 bg-gradient-to-r from-violet-50 to-indigo-50">
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                          <div className="p-2 bg-violet-500 rounded-full shadow-sm">
                            <ReceiptIcon className="h-4 w-4 text-white" />
                          </div>
                          Billing Summary
                        </CardTitle>
                        <CardDescription>Your account billing overview</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        {billingSummary ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-100/50">
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-600">Total Spent</p>
                                <p className="text-lg font-bold text-violet-600">{formatCurrency(billingSummary.totalSpent)}</p>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                              <p className="text-sm font-medium text-slate-600 mb-3">Active Subscriptions</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                    <CreditCard className="h-4 w-4 text-indigo-600" />
                                  </div>
                                  <span className="font-medium">{billingSummary.activeSubscriptions} services</span>
                                </div>
                                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none">Active</Badge>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                            <Info className="h-10 w-10 text-slate-400 mb-2" />
                            <p className="font-medium text-slate-800">No billing information</p>
                            <p className="text-sm text-slate-500 mt-1">Your billing summary will appear here</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  {/* Next Payment Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden border-slate-200/70 shadow-md bg-white rounded-2xl h-full">
                      <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50">
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                          <div className="p-2 bg-amber-500 rounded-full shadow-sm">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          Upcoming Payment
                        </CardTitle>
                        <CardDescription>Your next scheduled payment</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        {billingSummary?.nextPaymentDate ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
                              <p className="text-sm font-medium text-amber-700 mb-2">Due Date</p>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-amber-600" />
                                <span className="font-semibold">{formatDate(billingSummary.nextPaymentDate)}</span>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-600">Amount Due</p>
                                <p className="text-lg font-bold text-amber-600">{formatCurrency(billingSummary.nextPaymentAmount || 0)}</p>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">Payment instructions will be sent via email.</p>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50"
                                onClick={() => window.open('/dashboard/support', '_blank')}
                              >
                                <Info className="h-4 w-4 mr-2" />
                                Payment Instructions
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                            <p className="font-medium text-slate-800">No upcoming payments</p>
                            <p className="text-sm text-slate-500 mt-1">All your subscriptions are paid</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  {/* Recent Activity Card */}
                  <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden border-slate-200/70 shadow-md bg-white rounded-2xl h-full">
                      <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                          <div className="p-2 bg-emerald-500 rounded-full shadow-sm">
                            <Wallet className="h-4 w-4 text-white" />
                          </div>
                          Recent Activity
                        </CardTitle>
                        <CardDescription>Latest billing activities</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        {invoices.length > 0 ? (
                          <div className="space-y-3">
                            {invoices.slice(0, 3).map((invoice) => (
                              <div 
                                key={invoice.id}
                                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                    invoice.status === 'paid' ? 'bg-emerald-100' : 'bg-amber-100'
                                  }`}>
                                    {invoice.status === 'paid' ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-amber-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{invoice.planName}</p>
                                    <p className="text-xs text-slate-500">{formatDate(invoice.date)}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-semibold ${invoice.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {formatCurrency(invoice.amount)}
                                  </p>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs mt-1 ${getStatusBadgeProps(invoice.status).className}`}
                                  >
                                    {getStatusBadgeProps(invoice.status).icon}
                                    {invoice.status.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                            <Info className="h-10 w-10 text-slate-400 mb-2" />
                            <p className="font-medium text-slate-800">No recent activity</p>
                            <p className="text-sm text-slate-500 mt-1">Your billing history will appear here</p>
                          </div>
                        )}
                      </CardContent>
                      {invoices.length > 0 && (
                        <CardFooter className="pt-0 pb-6 px-6">
                          <Button 
                            variant="outline" 
                            className="w-full rounded-xl"
                            onClick={() => setActiveTab("invoices")}
                          >
                            View All Invoices
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </TabsContent>

            {/* Invoices Tab Content */}
            <TabsContent value="invoices" className="mt-0">
              <Card className="overflow-hidden border-slate-200/70 shadow-md bg-white rounded-2xl">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <div className="p-2 bg-blue-500 rounded-full shadow-sm">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    Your Invoices
                  </CardTitle>
                  <CardDescription>Complete history of all your invoices</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 rounded-xl" />
                      <Skeleton className="h-16 rounded-xl" />
                      <Skeleton className="h-16 rounded-xl" />
                    </div>
                  ) : invoices.length > 0 ? (
                    <div className="space-y-4">
                      {/* Search and Filter Row */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-slate-500" />
                          <select 
                            className="rounded-xl border border-slate-200 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Invoice List */}
                      {filteredInvoices.length > 0 ? (
                        <div className="space-y-4">
                          {filteredInvoices.map((invoice) => (
                            <motion.div
                              key={invoice.id}
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                <div className="md:col-span-2">
                                  <h4 className="font-medium text-slate-800">{invoice.planName}</h4>
                                  <p className="text-xs text-slate-500">{invoice.orderType}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Invoice #</p>
                                  <p className="font-mono text-sm">{invoice.id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Date</p>
                                  <p className="text-sm">{formatDate(invoice.date)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Amount</p>
                                  <p className="text-sm font-semibold">{formatCurrency(invoice.amount)}</p>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={getStatusBadgeProps(invoice.status).className}
                                  >
                                    {getStatusBadgeProps(invoice.status).icon}
                                    {invoice.status.toUpperCase()}
                                  </Badge>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl h-8 gap-1"
                                    onClick={() => window.open(`/api/user/billing/invoices/${invoice.id}/download`, '_blank')}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    PDF
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Info className="h-10 w-10 text-slate-400 mb-2" />
                          <p className="font-medium text-slate-800">No matching invoices</p>
                          <p className="text-sm text-slate-500 mt-1">Try changing your search or filter criteria</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <FileText className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
                      <p className="text-slate-500 max-w-md">Once you make your first purchase, all your invoices will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment History Tab Content */}
            <TabsContent value="history" className="mt-0">
              <Card className="overflow-hidden border-slate-200/70 shadow-md bg-white rounded-2xl">
                <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <div className="p-2 bg-emerald-500 rounded-full shadow-sm">
                      <Receipt className="h-4 w-4 text-white" />
                    </div>
                    Payment History
                  </CardTitle>
                  <CardDescription>Record of all your completed payments</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 rounded-xl" />
                      <Skeleton className="h-16 rounded-xl" />
                      <Skeleton className="h-16 rounded-xl" />
                    </div>
                  ) : (
                    <>
                      {/* Payment Summary */}
                      {billingSummary && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs font-medium text-emerald-600 mb-1">Total Paid</p>
                            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(billingSummary.totalSpent)}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs font-medium text-slate-600 mb-1">Active Services</p>
                            <p className="text-2xl font-bold text-slate-800">{billingSummary.activeSubscriptions}</p>
                          </div>
                          {billingSummary.nextPaymentDate && (
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                              <p className="text-xs font-medium text-amber-600 mb-1">Next Payment</p>
                              <p className="text-lg font-bold text-amber-700">{formatCurrency(billingSummary.nextPaymentAmount || 0)}</p>
                              <p className="text-xs text-amber-600">Due on {formatDate(billingSummary.nextPaymentDate)}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Payment Method Note */}
                      <div className="p-4 mb-6 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Info className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-700 mb-1">Manual Payment Information</h4>
                            <p className="text-sm text-blue-600">
                              We process payments manually. When a payment is due, you'll receive detailed instructions via email on how to complete your payment.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment History */}
                      {invoices.filter(inv => inv.status === 'paid').length > 0 ? (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                          <div className="space-y-4">
                            {invoices.filter(inv => inv.status === 'paid').map((payment) => (
                              <motion.div
                                key={payment.id}
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                  <div className="md:col-span-2">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-slate-800">{payment.planName}</h4>
                                        <p className="text-xs text-slate-500">{payment.orderType}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500">Payment Date</p>
                                    <p className="text-sm">{formatDate(payment.paidDate || payment.date)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500">Reference</p>
                                    <p className="text-sm font-mono">{payment.orderId}</p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-slate-500">Amount</p>
                                      <p className="text-sm font-semibold text-emerald-600">{formatCurrency(payment.amount)}</p>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="rounded-xl h-8 gap-1"
                                      onClick={() => window.open(`/api/user/billing/receipts/${payment.id}/download`, '_blank')}
                                    >
                                      <FileSpreadsheet className="h-3.5 w-3.5" />
                                      Receipt
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Receipt className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No payment history</h3>
                          <p className="text-slate-500 max-w-md">Your completed payments will appear here</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
