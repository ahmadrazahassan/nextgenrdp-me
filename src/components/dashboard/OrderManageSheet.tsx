import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Globe,
  HardDrive,
  Info,
  Server,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Cpu,
  MemoryStick,
  Database,
  Network,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MonitorSmartphone,
  Calendar,
  Eye
} from "lucide-react";

// Define interfaces for type safety
interface Order {
  id: string;
  orderId: string;
  planName: string;
  status: string;
  total: number;
  createdAt: string;
  location: string;
  ipAddress?: string;
  username?: string;
  password?: string;
  expiryDate?: string;
  isInitialized?: boolean;
  specs?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    bandwidth?: string;
    cpuUsage?: number;
    ramUsage?: number;
    storageUsage?: number;
    bandwidthUsage?: number;
  };
}

interface OrderManageSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onRefresh: () => void;
}

export function OrderManageSheet({ open, onOpenChange, order, onRefresh }: OrderManageSheetProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status styling
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied({ ...isCopied, [field]: true });
        
      toast({
          title: "Copied to clipboard",
          description: `${field} has been copied to your clipboard.`,
          duration: 2000,
        });
        
    setTimeout(() => {
          setIsCopied({ ...isCopied, [field]: false });
    }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      toast({
          title: "Copy failed",
          description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-y-auto bg-gradient-to-b from-white to-slate-50/90 backdrop-blur-sm rounded-l-3xl border-l-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{order.planName || "Service Details"}</SheetTitle>
        </SheetHeader>
        
        {/* Enhanced Header */}
        <div className="p-6 border-b border-slate-200/70 bg-white/40 backdrop-blur-sm rounded-tl-3xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{order.planName || "Service Details"}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4" />
                {order.location || "Unknown Location"}
              </p>
                </div>
                
            <div className="flex items-center gap-3">
              <Badge className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium shadow-sm ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status?.toUpperCase() || "UNKNOWN"}
                    </Badge>
              
              <Button size="sm" variant="outline" onClick={onRefresh} className="gap-1.5 shadow-sm rounded-xl">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
                    </div>
                </div>
              </div>
              
        {/* Improved Colorful Tabs Area */}
        <div className="p-6 pt-5 pb-10 bg-gradient-to-b from-white/80 to-slate-50/80">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full grid grid-cols-4 bg-slate-100/80 p-1 rounded-2xl mb-6 shadow-sm">
                    <TabsTrigger 
                      value="details" 
                className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                    >
                      Details
                    </TabsTrigger>
                    <TabsTrigger 
                value="connection" 
                className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                    >
                Connection
                    </TabsTrigger>
                    <TabsTrigger 
                value="resources" 
                className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                Billing
                    </TabsTrigger>
                  </TabsList>

                {/* Details Tab */}
            <TabsContent value="details" className="mt-0 focus-visible:outline-none">
              <Card className="border-slate-200/70 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <div className="p-2 bg-blue-500 rounded-full shadow-sm">
                      <Info className="h-4 w-4 text-white" />
                              </div>
                    Service Information
                  </CardTitle>
                  <CardDescription>
                    Essential details about your {order.planName} service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pb-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.orderId && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <p className="text-sm font-medium text-slate-500">Order ID</p>
                        <p className="font-mono text-sm mt-1 text-slate-800">{order.orderId}</p>
                      </div>
                    )}
                    
                    {order.createdAt && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <p className="text-sm font-medium text-slate-500">Created On</p>
                        <p className="text-sm mt-1 text-slate-800">{formatDate(order.createdAt)}</p>
                              </div>
                    )}
                    
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <p className="text-sm font-medium text-slate-500">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}></span>
                        <p className="text-sm text-slate-800">{order.status || "Unknown"}</p>
                              </div>
                        </div>

                    {typeof order.total === 'number' && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <p className="text-sm font-medium text-slate-500">Price</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          {formatCurrency(order.total)}
                        </p>
                          </div>
                        )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Connection Tab */}
            <TabsContent value="connection" className="mt-0 focus-visible:outline-none">
              <Card className="border-slate-200/70 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-violet-50">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <div className="p-2 bg-purple-500 rounded-full shadow-sm">
                      <MonitorSmartphone className="h-4 w-4 text-white" />
                                </div>
                    Connection Details
                  </CardTitle>
                  <CardDescription>
                    Credentials and information needed to connect to your service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-6 pt-6">
                  {order.ipAddress && (
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors">
                      <h3 className="text-sm font-medium mb-3 text-slate-700">Service Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">IP Address</span>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-800">
                              {order.ipAddress}
                                </code>
                                  <Button 
                                    size="icon" 
                              variant="ghost"
                              className="h-8 w-8 hover:bg-slate-100 rounded-lg"
                              onClick={() => order.ipAddress && copyToClipboard(order.ipAddress, "IP Address")}
                            >
                              <Copy className={`h-4 w-4 ${isCopied["IP Address"] ? "text-green-500" : "text-slate-500"}`} />
                                  </Button>
                              </div>
                            </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Location</span>
                          <span className="text-sm text-slate-800">{order.location || "Unknown"}</span>
                                </div>
                              </div>
                    </div>
                  )}
                  
                  {order.username && (
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors">
                      <h3 className="text-sm font-medium mb-3 text-slate-700">Login Credentials</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Username</span>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-800">
                              {order.username}
                                </code>
                                  <Button 
                                    size="icon" 
                              variant="ghost"
                              className="h-8 w-8 hover:bg-slate-100 rounded-lg"
                              onClick={() => order.username && copyToClipboard(order.username, "Username")}
                            >
                              <Copy className={`h-4 w-4 ${isCopied["Username"] ? "text-green-500" : "text-slate-500"}`} />
                                  </Button>
                              </div>
                            </div>
                            
                        {order.password && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Password</span>
                            <div className="flex items-center gap-2">
                              <code className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-sm font-mono text-slate-800 shadow-sm min-w-[120px] text-center">
                                {order.password}
                                </code>
                                  <Button 
                                    size="icon" 
                                variant="ghost"
                                className="h-8 w-8 hover:bg-slate-100 rounded-lg"
                                onClick={() => order.password && copyToClipboard(order.password, "Password")}
                              >
                                <Copy className={`h-4 w-4 ${isCopied["Password"] ? "text-green-500" : "text-slate-500"}`} />
                                  </Button>
                              </div>
                            </div>
                        )}
                            </div>
                          </div>
                  )}
                  
                  <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-100/80">
                    <h3 className="text-sm font-medium text-purple-700 mb-3">Connection Instructions</h3>
                    <ul className="space-y-3 text-sm text-purple-800">
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-xs font-semibold text-purple-700">1</span>
                        <span>Open Remote Desktop Connection (on Windows) or use an RDP client.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-xs font-semibold text-purple-700">2</span>
                        <span>Enter the IP address in the computer field.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-xs font-semibold text-purple-700">3</span>
                        <span>When prompted, enter the username and password provided above.</span>
                      </li>
                    </ul>
                            </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-slate-100 pt-4 pb-6 bg-gradient-to-r from-purple-50/50 to-violet-50/50">
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 rounded-xl shadow-md">
                    <ExternalLink className="h-4 w-4" />
                    Connection Guide
                            </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" className="mt-0 focus-visible:outline-none">
              <Card className="border-slate-200/70 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <div className="p-2 bg-emerald-500 rounded-full shadow-sm">
                      <Server className="h-4 w-4 text-white" />
                            </div>
                    System Resources
                  </CardTitle>
                  <CardDescription>
                    Monitor hardware specifications and resource usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-6 pt-6">
                  {/* Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.specs?.cpu && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                          <Cpu className="h-5 w-5 text-blue-600" />
                            </div>
                        <div>
                          <p className="text-xs text-slate-500">CPU</p>
                          <p className="text-sm font-medium text-slate-800">{order.specs.cpu}</p>
                            </div>
                            </div>
                    )}
                    
                    {order.specs?.ram && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                          <MemoryStick className="h-5 w-5 text-purple-600" />
                            </div>
                        <div>
                          <p className="text-xs text-slate-500">Memory</p>
                          <p className="text-sm font-medium text-slate-800">{order.specs.ram}</p>
                            </div>
                          </div>
                    )}
                    
                    {order.specs?.storage && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shadow-sm">
                          <HardDrive className="h-5 w-5 text-amber-600" />
                            </div>
                        <div>
                          <p className="text-xs text-slate-500">Storage</p>
                          <p className="text-sm font-medium text-slate-800">{order.specs.storage}</p>
                                </div>
                              </div>
                    )}
                    
                    {order.specs?.bandwidth && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                          <Network className="h-5 w-5 text-green-600" />
                                </div>
                        <div>
                          <p className="text-xs text-slate-500">Bandwidth</p>
                          <p className="text-sm font-medium text-slate-800">{order.specs.bandwidth}</p>
                              </div>
                              </div>
                    )}
                            </div>
                            
                  {/* Usage Meters */}
                  {order.specs && (
                    <div className="space-y-5 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                      <h3 className="text-sm font-medium text-slate-700 mb-4">Resource Usage</h3>
                      
                      {typeof order.specs.cpuUsage === 'number' && (
                        <div>
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="font-medium text-slate-700">CPU Usage</span>
                            <span className="font-medium text-blue-600">{order.specs.cpuUsage}%</span>
                            </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                              style={{ width: `${order.specs.cpuUsage}%` }}
                            />
                          </div>
                          </div>
                      )}
                      
                      {typeof order.specs.ramUsage === 'number' && (
                        <div>
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="font-medium text-slate-700">Memory Usage</span>
                            <span className="font-medium text-purple-600">{order.specs.ramUsage}%</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                              style={{ width: `${order.specs.ramUsage}%` }}
                            />
                        </div>
                      </div>
                    )}
                      
                      {typeof order.specs.storageUsage === 'number' && (
                        <div>
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="font-medium text-slate-700">Storage Usage</span>
                            <span className="font-medium text-amber-600">{order.specs.storageUsage}%</span>
                            </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                              style={{ width: `${order.specs.storageUsage}%` }}
                            />
                          </div>
                          </div>
                      )}
                      
                      {typeof order.specs.bandwidthUsage === 'number' && (
                        <div>
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="font-medium text-slate-700">Bandwidth Usage</span>
                            <span className="font-medium text-green-600">{order.specs.bandwidthUsage}%</span>
                            </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{ width: `${order.specs.bandwidthUsage}%` }}
                            />
                          </div>
                          </div>
                      )}
                            </div>
                  )}
                        </CardContent>
                      </Card>
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-0 focus-visible:outline-none">
              <Card className="border-slate-200/70 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <div className="p-2 bg-amber-500 rounded-full shadow-sm">
                      <CreditCard className="h-4 w-4 text-white" />
                            </div>
                    Billing Information
                  </CardTitle>
                  <CardDescription>
                    Payment details and subscription information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-6 pt-6">
                  {/* Payment Summary */}
                  <div className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-xl border border-amber-200/50 shadow-sm">
                    <h3 className="text-sm font-medium text-amber-700 mb-3">Payment Summary</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-slate-600">{order.planName}</p>
                        <p className="text-xs text-slate-500">Ordered on {formatDate(order.createdAt)}</p>
                          </div>
                      <p className="text-xl font-semibold text-amber-600">
                        {typeof order.total === 'number' ? formatCurrency(order.total) : 'N/A'}
                      </p>
                          </div>
                    </div>
                    
                  {/* Next Payment */}
                  {order.status === "active" && order.expiryDate && (
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-amber-50/30 rounded-xl border border-amber-200/30 shadow-sm">
                      <h3 className="text-sm font-medium text-amber-700 mb-3">Next Payment</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shadow-sm">
                            <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Due on {order.expiryDate ? formatDate(order.expiryDate) : "N/A"}</p>
                            <p className="text-xs text-slate-500">Auto-renewal enabled</p>
                    </div>
                  </div>
                        <p className="text-sm font-semibold text-amber-600">
                          {typeof order.total === 'number' ? formatCurrency(order.total) : 'N/A'}
                        </p>
                          </div>
                    </div>
                  )}
                  
                  {/* Invoices */}
                  <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Invoices</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                          <div>
                            <p className="text-sm text-slate-800">Invoice #{order.orderId?.split('-')[2] || '000000'}</p>
                            <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                          <Download className="h-3.5 w-3.5" />
                          PDF
                </Button>
              </div>
            </div>
        </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
