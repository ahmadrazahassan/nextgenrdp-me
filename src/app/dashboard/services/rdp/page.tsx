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
  MonitorSmartphone,
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
  CreditCard,
  Activity,
  Clock
} from "lucide-react";
import { RdpService, fetchUserServices, generateRdpFileContent } from "@/utils/services";

export default function RdpServicesPage() {
  const [services, setServices] = useState<RdpService[]>([]);
  const [filteredServices, setFilteredServices] = useState<RdpService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Function to generate and download RDP file
  const downloadRdpFile = (service: RdpService) => {
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
        // Use our utility function to fetch RDP services
        const rdpServices = await fetchUserServices<RdpService>('rdp');
        setServices(rdpServices);
        setFilteredServices(rdpServices);
      } catch (err) {
        console.error("Error fetching RDP services:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load RDP services. Please try again.",
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
        const rdpServices = await fetchUserServices<RdpService>('rdp');
        setServices(rdpServices);
        setFilteredServices(rdpServices);
        
        toast({
          title: "Refreshed",
          description: "RDP services have been refreshed",
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
  const formatDate = (dateString: string | Date) => {
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
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative h-24 w-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 via-indigo-600/30 to-purple-600/20 blur-xl opacity-70"></div>
        <div className="relative h-24 w-24 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-full border border-violet-200/50 dark:border-violet-800/30 shadow-md">
          <MonitorSmartphone className="h-12 w-12 text-violet-500" />
        </div>
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent mb-3">
        {searchQuery ? "No Matching Services" : "No RDP Services"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg">
          {searchQuery
          ? "No RDP services match your search criteria. Try adjusting your search or check your orders page."
          : "You don't have any active RDP servers yet. Purchase a plan to get started with your remote desktop experience."}
        </p>
        {!searchQuery && (
        <Button asChild variant="default" size="lg" className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
            <a href="/pricing">Explore RDP Plans</a>
          </Button>
        )}
    </div>
  );

  // Service detail view component
  const ServiceDetail = ({ service }: { service: RdpService }) => {
    const remainingDays = calculateRemainingDays(service.expiryDate);
    const isExpiringSoon = remainingDays !== null && remainingDays <= 7 && remainingDays > 0;
    const isExpired = remainingDays !== null && remainingDays <= 0;
    
    return (
      <Card className="border border-violet-200/50 dark:border-violet-800/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-violet-50/90 to-white/80 dark:from-violet-950/30 dark:to-gray-950/80 border-b border-violet-100/50 dark:border-violet-900/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">{service.planName}</CardTitle>
              <CardDescription className="mt-1">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  {service.location}
                </span>
              </CardDescription>
            </div>
            {getStatusBadge(service.status)}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="connection" className="w-full">
            <TabsList className="grid grid-cols-3 h-10 bg-violet-50/50 dark:bg-violet-950/30 p-0.5 m-0 rounded-none border-b border-violet-100/50 dark:border-violet-900/30">
              <TabsTrigger 
                value="connection" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 rounded-md"
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> 
                  <span>Connection</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 rounded-md"
              >
                <div className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" /> 
                  <span>Specs</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 rounded-md"
              >
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" /> 
                  <span>Billing</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connection" className="p-4 m-0 min-h-[250px] border-0 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/10">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg shadow-sm p-4 space-y-4 border border-violet-100/50 dark:border-violet-900/30">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center p-2 rounded-md bg-violet-50/70 dark:bg-violet-900/20 border border-violet-100/70 dark:border-violet-800/30">
                      <div className="flex items-center text-sm font-medium text-violet-700 dark:text-violet-300">
                        <Globe className="h-4 w-4 mr-2 text-indigo-500" />
                      IP Address
                    </div>
                    <div className="flex items-center">
                        <code className="px-2 py-1 rounded text-sm font-mono bg-white/70 dark:bg-gray-900/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                        {service.ipAddress}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                                className="h-7 w-7 ml-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                  
                    <div className="flex justify-between items-center p-2 rounded-md bg-violet-50/70 dark:bg-violet-900/20 border border-violet-100/70 dark:border-violet-800/30">
                      <div className="flex items-center text-sm font-medium text-violet-700 dark:text-violet-300">
                        <Lock className="h-4 w-4 mr-2 text-indigo-500" />
                      Username
                    </div>
                    <div className="flex items-center">
                        <code className="px-2 py-1 rounded text-sm font-mono bg-white/70 dark:bg-gray-900/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                        {service.username}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                                className="h-7 w-7 ml-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                  
                    <div className="flex justify-between items-center p-2 rounded-md bg-violet-50/70 dark:bg-violet-900/20 border border-violet-100/70 dark:border-violet-800/30">
                      <div className="flex items-center text-sm font-medium text-violet-700 dark:text-violet-300">
                        <Lock className="h-4 w-4 mr-2 text-indigo-500" />
                      Password
                    </div>
                    <div className="flex items-center">
                        <code className="px-2 py-1 rounded text-sm font-mono bg-white/70 dark:bg-gray-900/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                        {service.password}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                                className="h-7 w-7 ml-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                  
                    <div className="flex justify-between items-center p-2 rounded-md bg-violet-50/70 dark:bg-violet-900/20 border border-violet-100/70 dark:border-violet-800/30">
                      <div className="flex items-center text-sm font-medium text-violet-700 dark:text-violet-300">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                      Expiry Date
                    </div>
                    <div className="flex items-center">
                      {isExpiringSoon ? (
                          <div className="flex items-center text-amber-600 dark:text-amber-500 font-medium px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          {formatDate(service.expiryDate)} ({remainingDays} days left)
                        </div>
                      ) : isExpired ? (
                          <div className="flex items-center text-rose-600 dark:text-rose-500 font-medium px-2 py-1 rounded bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          Expired
                        </div>
                      ) : (
                          <span className="text-sm font-medium px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
                            {formatDate(service.expiryDate)}
                          </span>
                      )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="default" 
                      className="w-full h-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => downloadRdpFile(service)}
                      disabled={service.ipAddress === 'Pending' || service.status.toLowerCase() !== 'active'}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download RDP File
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="p-4 m-0 min-h-[250px] border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10">
              <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg shadow-sm p-5 border border-blue-100/50 dark:border-blue-900/30">
                <div className="grid grid-cols-1 gap-5">
                  {/* CPU & RAM */}
                  <div className="grid grid-cols-2 gap-5">
                    <TooltipProvider>
                      <div className="flex flex-col h-[125px] justify-between p-4 bg-gradient-to-br from-indigo-50/80 to-blue-50/50 dark:from-indigo-900/30 dark:to-blue-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-md flex-shrink-0">
                            <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate">CPU</span>
                        </div>
                        <div className="mt-1 pl-1 w-full">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className={`font-bold text-indigo-700 dark:text-indigo-300 line-clamp-2 ${(service.cpu || '').length > 20 ? 'text-base' : 'text-lg'}`}>
                                {service.cpu}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{service.cpu}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    
                      <div className="flex flex-col h-[125px] justify-between p-4 bg-gradient-to-br from-violet-50/80 to-purple-50/50 dark:from-violet-900/30 dark:to-purple-900/20 rounded-lg border border-violet-100/50 dark:border-violet-800/30 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-violet-100 dark:bg-violet-800/50 rounded-md flex-shrink-0">
                            <MemoryStick className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <span className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 truncate">RAM</span>
                        </div>
                        <div className="mt-1 pl-1 w-full">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className={`font-bold text-violet-700 dark:text-violet-300 line-clamp-2 ${(service.ram || '').length > 20 ? 'text-base' : 'text-lg'}`}>
                                {service.ram}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{service.ram}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                    </div>
                    </TooltipProvider>
                  </div>
                  
                  {/* Storage & Bandwidth */}
                  <div className="grid grid-cols-2 gap-5">
                    <TooltipProvider>
                      <div className="flex flex-col h-[125px] justify-between p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/50 dark:from-blue-900/30 dark:to-cyan-900/20 rounded-lg border border-blue-100/50 dark:border-blue-800/30 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-md flex-shrink-0">
                            <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">Storage</span>
                        </div>
                        <div className="mt-1 pl-1 w-full">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className={`font-bold text-blue-700 dark:text-blue-300 line-clamp-2 ${(service.storage || '').length > 20 ? 'text-base' : 'text-lg'}`}>
                                {service.storage}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{service.storage}</p>
                            </TooltipContent>
                          </Tooltip>
                    </div>
                  </div>
                  
                      <div className="flex flex-col h-[125px] justify-between p-4 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-900/30 dark:to-green-900/20 rounded-lg border border-emerald-100/50 dark:border-emerald-800/30 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-md flex-shrink-0">
                            <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">Bandwidth</span>
                        </div>
                        <div className="mt-1 pl-1 w-full">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className={`font-bold text-emerald-700 dark:text-emerald-300 line-clamp-2 ${(service.bandwidth || '').length > 20 ? 'text-base' : 'text-lg'}`}>
                                {service.bandwidth}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{service.bandwidth}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                    </div>
                    </TooltipProvider>
                  </div>
                  
                  {/* Operating System */}
                  <TooltipProvider>
                    <div className="flex flex-col h-[125px] justify-between p-4 bg-gradient-to-br from-purple-50/80 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/20 rounded-lg border border-purple-100/50 dark:border-purple-800/30 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-md flex-shrink-0">
                          <MonitorSmartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 truncate">Operating System</span>
                  </div>
                      <div className="mt-1 pl-1 w-full">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className={`font-bold text-purple-700 dark:text-purple-300 line-clamp-2 ${service.os.length > 25 ? 'text-base' : 'text-lg'}`}>
                              {service.os}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{service.os}</p>
                          </TooltipContent>
                        </Tooltip>
                </div>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="p-4 m-0 min-h-[250px] border-0 bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-900 dark:to-rose-950/10">
              <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg shadow-sm p-4 border border-rose-100/50 dark:border-rose-900/30">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border-b border-rose-100/40 dark:border-rose-800/30">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Plan</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">{service.planName}</span>
                </div>
                
                  <div className="flex justify-between items-center p-2 border-b border-rose-100/40 dark:border-rose-800/30">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Duration</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">
                      {service.durationMonths} {service.durationMonths === 1 ? 'month' : 'months'}
                    </span>
                </div>
                
                  <div className="flex justify-between items-center p-2 border-b border-rose-100/40 dark:border-rose-800/30">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Order ID</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">{service.orderIdReadable}</span>
                </div>
                
                  <div className="flex justify-between items-center p-2 border-b border-rose-100/40 dark:border-rose-800/30">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Next Renewal</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">{formatDate(service.expiryDate)}</span>
                </div>
                
                  <div className="flex justify-between items-center p-2 mt-1">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Renewal Price</span>
                    <span className="font-bold text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      PKR {(service.renewalPrice || 0).toLocaleString()}
                    </span>
                </div>
                
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-rose-200 hover:border-rose-300 dark:border-rose-800 dark:hover:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                      Upgrade Plan
                    </Button>
                    <Button variant="default" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                      Renew Service
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
    <div className="flex-1 space-y-8">
      {/* Hero section with gradient background */}
      <div className="relative bg-gradient-to-br from-violet-50 via-indigo-50/50 to-white dark:from-violet-950/50 dark:via-indigo-950/30 dark:to-gray-950 p-6 md:p-8 rounded-2xl border border-violet-200/50 dark:border-violet-800/30 shadow-sm overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] bg-center opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RDP Services
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
                Manage your Remote Desktop servers from one place. Access connection details, monitor performance, and manage your subscriptions.
              </p>
        </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search RDP services..."
                  className="w-full md:w-[280px] pl-9 bg-white dark:bg-gray-900 border-violet-200/70 dark:border-violet-800/30 focus:border-violet-400 dark:focus:border-violet-600 focus:ring-violet-400/20 dark:focus:ring-violet-600/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
                      className="h-10 w-10 border-violet-200/70 dark:border-violet-800/30"
          >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-violet-600 dark:text-violet-400' : 'text-gray-600 dark:text-gray-400'}`} />
          </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh services</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
        </div>
      </motion.div>

          {/* Stats row */}
          {!isLoading && filteredServices.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-violet-200/50 dark:border-violet-800/30 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                    <MonitorSmartphone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Services</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{services.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-violet-200/50 dark:border-violet-800/30 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {services.filter(s => s.status.toLowerCase() === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-violet-200/50 dark:border-violet-800/30 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {services.filter(s => ['pending', 'pending_setup', 'processing'].includes(s.status.toLowerCase())).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-violet-200/50 dark:border-violet-800/30 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Issues</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {services.filter(s => ['suspended', 'expired'].includes(s.status.toLowerCase())).length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 md:px-6">
      {isLoading ? (
        renderSkeletons()
      ) : filteredServices.length === 0 ? (
          <Card className="border border-violet-200/50 dark:border-violet-800/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
            <CardContent className="p-0">
              {renderEmptyState()}
            </CardContent>
          </Card>
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-purple-600/10 blur-xl opacity-70 -z-10 
                          group-hover:opacity-85 transition-opacity duration-300" />
              <ServiceDetail service={service} />
            </motion.div>
          ))}
          </motion.div>
        )}
      </div>
      
      {/* Help section */}
      {!isLoading && filteredServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 px-4 md:px-6"
        >
          <Card className="border border-violet-200/50 dark:border-violet-800/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50/90 to-white/80 dark:from-violet-950/30 dark:to-gray-950/80 border-b border-violet-100/50 dark:border-violet-900/30">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">Need Help?</CardTitle>
              <CardDescription>Quick tips for managing your RDP services</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col p-4 bg-violet-50/50 dark:bg-violet-950/30 rounded-lg border border-violet-100/50 dark:border-violet-900/30">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg w-fit mb-3">
                    <Download className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">RDP File</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Download and use the RDP file to connect to your server using Remote Desktop Connection.</p>
                </div>
                
                <div className="flex flex-col p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg w-fit mb-3">
                    <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Service Status</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Check the status badge on each service card to monitor if your server is active or needs attention.</p>
                </div>
                
                <div className="flex flex-col p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-lg border border-purple-100/50 dark:border-purple-900/30">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg w-fit mb-3">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Renewal</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Keep track of expiry dates and renew your services before they expire to avoid service interruption.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
} 