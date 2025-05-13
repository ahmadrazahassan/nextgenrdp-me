"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Search,
  Cpu,
  MemoryStick,
  HardDrive,
  RefreshCw,
  Lock,
  Globe,
  Calendar,
  Download,
  AlertCircle,
  Server,
  Wallet,
  Activity,
  AreaChart,
  Gauge,
  NetworkIcon,
  Shield,
  Sparkles,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { VpsService, fetchUserServices, generateRdpFileContent } from "@/utils/services";

export default function VpsServicesPage() {
  const [services, setServices] = useState<VpsService[]>([]);
  const [filteredServices, setFilteredServices] = useState<VpsService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Function to generate and download RDP file (for Windows VPS)
  const downloadRdpFile = (service: VpsService) => {
    if (service.ipAddress === 'Pending' || service.username === 'Pending') {
      toast({
        title: "Cannot download RDP file",
        description: "Service is not fully provisioned yet",
        variant: "destructive"
      });
      return;
    }

    // Create RDP file content
    const rdpContent = generateRdpFileContent(service);
    
    // Create a Blob with the RDP content
    const blob = new Blob([rdpContent], { type: 'application/rdp' });
    
    // Create a temporary link element and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${service.planName.replace(/\s+/g, '_')}_${service.ipAddress}.rdp`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    toast({
      description: "RDP file downloaded. Use it to connect with Remote Desktop.",
      duration: 3000,
    });
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, label: string = "Text") => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        // Use our utility function to fetch VPS services
        const vpsServices = await fetchUserServices<VpsService>('vps');
        setServices(vpsServices);
        setFilteredServices(vpsServices);
      } catch (err) {
        console.error("Error fetching VPS services:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load VPS services. Please try again.",
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchServices();
  }, [toast]);

  // Filter services when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
      return;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = services.filter(service => 
      service.planName.toLowerCase().includes(lowercasedQuery) ||
      service.ipAddress.toLowerCase().includes(lowercasedQuery) ||
      service.location.toLowerCase().includes(lowercasedQuery) ||
      service.os.toLowerCase().includes(lowercasedQuery)
    );
    
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Re-fetch orders using our utility function
    const fetchServices = async () => {
      try {
        const vpsServices = await fetchUserServices<VpsService>('vps');
        setServices(vpsServices);
        setFilteredServices(vpsServices);
        
        toast({
          title: "Refreshed",
          description: "VPS services have been refreshed",
        });
      } catch (err) {
        console.error("Error refreshing services:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to refresh services. Please try again.",
        });
      } finally {
        setIsRefreshing(false);
      }
    };
    
    fetchServices();
  };

  // Format date to readable format
  const formatDate = (dateString: string | Date): string => {
    if (dateString === 'Pending') return 'Pending';
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return String(dateString);
    }
  };

  // Calculate remaining days
  const calculateRemainingDays = (expiryDate: string | Date) => {
    if (expiryDate === 'Pending') return null;
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 shadow-sm">Active</Badge>;
      case 'pending':
      case 'pending_setup':
      case 'processing':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/40 shadow-sm">Setup Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="shadow-sm">Suspended</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/40 shadow-sm">Expired</Badge>;
      default:
        return <Badge variant="secondary" className="shadow-sm">{status}</Badge>;
    }
  };

  const renderSkeletons = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[280px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <Card className="border border-border/40 bg-background/60 backdrop-blur-lg mt-6 shadow-md">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/30 p-5 rounded-full mb-6 ring-1 ring-border/50">
          <Server className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-medium text-foreground mb-3">No VPS Services</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-8">
          {searchQuery
            ? "No VPS services match your search. Try clearing the search or check your orders page."
            : "You don't have any active VPS servers. Purchase a plan to get started."}
        </p>
        {!searchQuery && (
          <Button asChild variant="default" size="lg" className="px-8 py-6 h-auto text-base font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <a href="/pricing">Explore VPS Plans</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Service detail view component
  const ServiceDetail = ({ service }: { service: VpsService }) => {
    const remainingDays = calculateRemainingDays(service.expiryDate);
    const isExpiringSoon = remainingDays !== null && remainingDays <= 7 && remainingDays > 0;
    const isExpired = remainingDays !== null && remainingDays <= 0;
    const isWindowsOS = service.os.toLowerCase().includes('windows');
    const formattedExpiryDate = formatDate(service.expiryDate);
    
    return (
      <Card className="border-border/40 bg-background/60 backdrop-blur-lg shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3 border-b border-border/10 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-800/80">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                {service.planName}
              </CardTitle>
              <CardDescription className="mt-2">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  {service.location}
                </span>
              </CardDescription>
            </div>
            {getStatusBadge(service.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-4">
          <Tabs defaultValue="connection" className="space-y-4">
            <TabsList className="grid grid-cols-3 h-10 p-1 rounded-xl bg-muted/70 backdrop-blur-md">
              <TabsTrigger value="connection" className="rounded-lg text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
                <Server className="h-3.5 w-3.5 mr-1.5" />
                Connection
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-lg text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                <Cpu className="h-3.5 w-3.5 mr-1.5" />
                Specs
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-lg text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                <Wallet className="h-3.5 w-3.5 mr-1.5" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connection" className="space-y-4 mt-2">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 space-y-3 ring-1 ring-blue-200/30 dark:ring-blue-800/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <Globe className="h-4 w-4 mr-2 text-blue-500" />
                    IP Address
                  </div>
                  <div className="flex items-center">
                    <code className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-sm font-mono border border-blue-100 dark:border-blue-900/50">
                      {service.ipAddress}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1 text-blue-600 dark:text-blue-400"
                            onClick={() => copyToClipboard(service.ipAddress, "IP Address")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy IP Address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <Lock className="h-4 w-4 mr-2 text-blue-500" />
                    Username
                  </div>
                  <div className="flex items-center">
                    <code className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-sm font-mono border border-blue-100 dark:border-blue-900/50">
                      {service.username}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1 text-blue-600 dark:text-blue-400"
                            onClick={() => copyToClipboard(service.username, "Username")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy Username</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <Lock className="h-4 w-4 mr-2 text-blue-500" />
                    Password
                  </div>
                  <div className="flex items-center">
                    <code className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-sm font-mono border border-blue-100 dark:border-blue-900/50">
                      {service.password}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1 text-blue-600 dark:text-blue-400"
                            onClick={() => copyToClipboard(service.password, "Password")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy Password</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    Expiry Date
                  </div>
                  <div className="flex items-center">
                    {isExpiringSoon ? (
                      <div className="flex items-center text-amber-600 dark:text-amber-500 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        {formattedExpiryDate} ({remainingDays} days left)
                      </div>
                    ) : isExpired ? (
                      <div className="flex items-center text-rose-600 dark:text-rose-500 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        Expired
                      </div>
                    ) : (
                      <span className="text-sm font-medium">{formattedExpiryDate}</span>
                    )}
                  </div>
                </div>
                
                {isWindowsOS && (
                  <div className="mt-4 pt-4 border-t border-blue-200/30 dark:border-blue-800/30">
                    <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50">
                      <div className="flex items-center mb-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/70 rounded-full mr-2">
                          <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Windows Remote Desktop Connection
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Download the RDP configuration file to connect to your Windows VPS
                      </p>
                      <Button 
                        variant="default" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md transition-all h-9"
                        onClick={() => downloadRdpFile(service)}
                        disabled={service.ipAddress === 'Pending' || service.status.toLowerCase() !== 'active'}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download VPS 
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="space-y-4 mt-2">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 space-y-4 ring-1 ring-emerald-200/30 dark:ring-emerald-800/20">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mr-3">
                      <Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">CPU</p>
                      <p className="text-sm font-medium mt-0.5">{service.cpu}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-teal-100 dark:border-teal-900/50 shadow-sm">
                    <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/50 mr-3">
                      <MemoryStick className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-400">RAM</p>
                      <p className="text-sm font-medium mt-0.5">{service.ram}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mr-3">
                      <HardDrive className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Storage</p>
                      <p className="text-sm font-medium mt-0.5">{service.storage}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-teal-100 dark:border-teal-900/50 shadow-sm">
                    <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/50 mr-3">
                      <NetworkIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-400">Bandwidth</p>
                      <p className="text-sm font-medium mt-0.5">{service.bandwidth}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mr-3">
                      <Server className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Operating System</p>
                      <p className="text-sm font-medium mt-0.5">{service.os}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resource Usage Monitoring - Specific to VPS */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl p-4 space-y-4 ring-1 ring-teal-200/30 dark:ring-teal-800/20">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  System Resource Usage
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-teal-700 dark:text-teal-400 font-medium">CPU Usage</span>
                      <span className="font-medium">24%</span>
                    </div>
                    <div className="w-full bg-white/80 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-teal-700 dark:text-teal-400 font-medium">Memory Usage</span>
                      <span className="font-medium">41%</span>
                    </div>
                    <div className="w-full bg-white/80 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full" style={{ width: '41%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-teal-700 dark:text-teal-400 font-medium">Disk Usage</span>
                      <span className="font-medium">37%</span>
                    </div>
                    <div className="w-full bg-white/80 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-sky-500 to-cyan-500 h-2.5 rounded-full" style={{ width: '37%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs shadow-sm rounded-lg border-teal-200 dark:border-teal-800/70 hover:bg-teal-50 dark:hover:bg-teal-900/50"
                    onClick={() => toast({
                      description: "Refreshing usage statistics...",
                      duration: 2000,
                    })}
                  >
                    <RefreshCw className="h-3 w-3 mr-1.5 text-teal-600 dark:text-teal-400" />
                    Refresh Stats
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4 mt-2">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 space-y-3 ring-1 ring-amber-200/30 dark:ring-amber-800/20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full mr-2">
                    <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Billing Information</h3>
                </div>
                
                <div className="flex justify-between items-center border-b border-amber-200/30 dark:border-amber-800/20 pb-3">
                  <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">Plan</span>
                  <span className="font-medium">{service.planName}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-amber-200/30 dark:border-amber-800/20 pb-3">
                  <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">Duration</span>
                  <span className="font-medium">{service.durationMonths} {service.durationMonths === 1 ? 'month' : 'months'}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-amber-200/30 dark:border-amber-800/20 pb-3">
                  <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">Order ID</span>
                  <span className="font-medium">{service.orderIdReadable}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-amber-200/30 dark:border-amber-800/20 pb-3">
                  <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">Next Renewal</span>
                  <span className="font-medium">{formattedExpiryDate}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> 
                    Renewal Price
                  </span>
                  <span className="font-bold text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/50 px-3 py-1 rounded-full">
                    PKR {service.renewalPrice ? service.renewalPrice.toLocaleString() : '0'}
                  </span>
                </div>
                
                <div className="pt-5">
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-lg shadow-sm border-amber-200 dark:border-amber-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center justify-center gap-2 h-10"
                    >
                      <AreaChart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>Upgrade Plan</span>
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1 text-amber-600 dark:text-amber-400" />
                    </Button>
                    
                    <Button 
                      variant="default" 
                      className="rounded-lg shadow-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 flex items-center justify-center gap-2 h-10"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Renew Service</span>
                      <Gauge className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-5 md:p-7 pt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5 mb-6"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Server className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            VPS Services
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">Manage your Virtual Private Servers from one place.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full md:w-auto relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search VPS services..."
              className="w-full md:w-72 pl-10 bg-background/80 rounded-lg border-border/40 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-11 w-11 rounded-lg shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        renderSkeletons()
      ) : filteredServices.length === 0 ? (
        renderEmptyState()
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-cyan-600/5 blur-xl opacity-70 -z-10 transition-opacity duration-300" />
              <ServiceDetail service={service} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 