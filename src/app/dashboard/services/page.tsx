"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Server, Copy, Search, ExternalLink, MonitorSmartphone, CloudCog, ArrowRight, ArrowUpRight, BarChart, Clock } from "lucide-react";
import Link from "next/link";

// Define the service interface
interface Service {
  id: string;
  orderId: string;
  orderIdReadable: string;
  planName: string;
  status: string;
  ipAddress: string;
  username: string;
  password: string;
  expiryDate: string;
  location: string;
  os: string;
  durationMonths: number;
}

// Define the ServiceStats interface
interface ServiceStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  expired: number;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  stats: ServiceStats;
  gradient: string;
  badge?: {
    text: string;
    variant: "default" | "outline" | "secondary" | "destructive" | "new" | "pro";
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        // Fetch orders from the API
        const response = await fetch("/api/user/orders");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to fetch services");
        }
        
        const data = await response.json();
        console.log('API Response:', data); // Debug API response
        
        // Extract services from orders and flatten the data structure
        const extractedServices: Service[] = [];
        
        // Check if the data is an array or has an orders property
        const orders = Array.isArray(data) ? data : data.orders || [];
        console.log('Orders to process:', orders.length); // Debug orders count
        
        orders.forEach(order => {
          console.log('Processing order:', order.id, order.status, 'initialized:', order.isInitialized); // Debug each order
          // Only include active and initialized orders
          if (order.status?.toLowerCase() === 'active' && order.isInitialized) {
            extractedServices.push({
              id: order.id,
              orderId: order.id,
              orderIdReadable: order.orderId || order.id.substring(0, 8),
              planName: order.planName || 'Unknown Plan',
              status: order.status,
              ipAddress: order.ipAddress || 'Pending',
              username: order.username || 'Pending',
              password: order.password || order.passwordEncrypted || 'Pending',
              expiryDate: order.expiryDate || 'Pending',
              location: order.location || 'Any',
              os: order.os || 'Windows',
              durationMonths: order.duration || 1
            });
          } else if (order.status?.toLowerCase() === 'active') {
            // Include non-initialized active orders as pending services
            extractedServices.push({
              id: order.id,
              orderId: order.id,
              orderIdReadable: order.orderId || order.id.substring(0, 8),
              planName: order.planName || 'Unknown Plan',
              status: "pending_setup",
              ipAddress: 'Pending',
              username: 'Pending',
              password: 'Pending',
              expiryDate: 'Pending',
              location: order.location || 'Any',
              os: order.os || 'Windows',
              durationMonths: order.duration || 1
            });
          }
        });
        
        setServices(extractedServices);
        setFilteredServices(extractedServices);

        // Process and count services by category
        const rdpCount = {
          total: 0,
          active: 0,
          pending: 0,
          suspended: 0,
          expired: 0
        };
        
        const vpsCount = {
          total: 0,
          active: 0,
          pending: 0,
          suspended: 0,
          expired: 0
        };
        
        orders.forEach(order => {
          // Determine service type based on plan name or type
          const isRdp = order.planName?.toLowerCase().includes('rdp') || order.planType === 'rdp';
          const isVps = order.planName?.toLowerCase().includes('vps') || order.planType === 'vps';
          
          if (isRdp) {
            rdpCount.total++;
            
            // Count by status
            if (order.status?.toLowerCase() === 'active') {
              rdpCount.active++;
            } else if (['pending', 'pending_setup', 'processing'].includes(order.status?.toLowerCase())) {
              rdpCount.pending++;
            } else if (order.status?.toLowerCase() === 'suspended') {
              rdpCount.suspended++;
            } else if (order.status?.toLowerCase() === 'expired') {
              rdpCount.expired++;
            }
          } else if (isVps) {
            vpsCount.total++;
            
            // Count by status
            if (order.status?.toLowerCase() === 'active') {
              vpsCount.active++;
            } else if (['pending', 'pending_setup', 'processing'].includes(order.status?.toLowerCase())) {
              vpsCount.pending++;
            } else if (order.status?.toLowerCase() === 'suspended') {
              vpsCount.suspended++;
            } else if (order.status?.toLowerCase() === 'expired') {
              vpsCount.expired++;
            }
          }
        });
        
        // Create service categories with stats
        const categories: ServiceCategory[] = [
          {
            id: 'rdp',
            name: 'RDP Servers',
            description: 'Windows Remote Desktop servers with dedicated resources',
            icon: <MonitorSmartphone className="h-5 w-5 text-blue-500" />,
            path: '/dashboard/services/rdp',
            stats: rdpCount,
            gradient: 'from-blue-600/20 via-indigo-600/15 to-violet-600/10'
          },
          {
            id: 'vps',
            name: 'VPS Servers',
            description: 'Virtual Private Servers with root access and full control',
            icon: <CloudCog className="h-5 w-5 text-sky-500" />,
            path: '/dashboard/services/vps',
            stats: vpsCount,
            gradient: 'from-sky-600/20 via-cyan-600/15 to-teal-600/10',
            badge: {
              text: 'New',
              variant: 'new'
            }
          }
        ];
        
        setServiceCategories(categories);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load services. Please try again.",
        });
        setServices([]);
        setFilteredServices([]);
        setServiceCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  // Filter services based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = services.filter(service => 
      service.planName.toLowerCase().includes(query) ||
      service.ipAddress.toLowerCase().includes(query) ||
      service.location.toLowerCase().includes(query) ||
      service.orderIdReadable.toLowerCase().includes(query)
    );
    
    setFilteredServices(filtered);
  }, [services, searchQuery]);

  const copyToClipboard = (text: string) => {
    if (!text || text === 'Pending') {
      toast({ title: "Nothing to copy", variant: "destructive", duration: 2000 });
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `"${text.length > 20 ? text.substring(0, 17) + '...' : text}" copied.`,
          duration: 2000,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({ 
          title: "Copy Failed", 
          description: "Could not copy text.", 
          variant: "destructive", 
          duration: 2000 
        });
      });
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array(2).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="border border-border/40 bg-background/60 backdrop-blur-lg mt-6">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/30 p-4 rounded-full mb-4 ring-1 ring-border/50">
          <Server className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">No Services Found</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          You don't have any active services yet. Purchase a plan to get started.
        </p>
        <Button asChild variant="default">
          <a href="/pricing">Explore Plans</a>
        </Button>
      </CardContent>
    </Card>
  );

  const renderServiceCategory = (category: ServiceCategory) => (
    <motion.div
      key={category.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative"
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${category.gradient} blur-xl opacity-70 -z-10`} />
      <Card className="border-border/40 bg-background/60 backdrop-blur-lg overflow-hidden h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                {category.icon}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  {category.name}
                  {category.badge && (
                    <Badge variant={category.badge.variant === "new" ? "default" : "secondary"} 
                      className={
                        category.badge.variant === "new" 
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : ""
                      }
                    >
                      {category.badge.text}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {category.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 py-2">
            <div className="flex flex-col items-center justify-center p-3 bg-muted/40 rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">Total</span>
              <span className="text-2xl font-bold">{category.stats.total}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-muted/40 rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">Active</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{category.stats.active}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-muted/40 rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">Pending</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">{category.stats.pending}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-muted/40 rounded-lg">
              <span className="text-sm text-muted-foreground mb-1">Expired</span>
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-500">{category.stats.expired}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/40 pt-4">
          <Button variant="outline" asChild>
            <Link href={`/pricing?type=${category.id}`}>
              <CloudCog className="h-4 w-4 mr-2" />
              New {category.name.split(' ')[0]}
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link href={category.path}>
              Manage Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-4 mb-6"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">My Services</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage all your cloud services from one place.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/orders">
              <Clock className="h-4 w-4 mr-2" />
              Orders History
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        renderSkeletons()
      ) : serviceCategories.every(cat => cat.stats.total === 0) ? (
        renderEmptyState()
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {serviceCategories.map(renderServiceCategory)}
        </motion.div>
      )}
      
      <div className="mt-8">
        <Card className="border-dashed border-2 border-border/60 bg-background/40">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-medium text-foreground mb-2">Looking for more services?</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Explore our full range of cloud services and solutions to find the perfect fit for your needs.
            </p>
            <Button asChild variant="default">
              <a href="/pricing">
                Browse All Services
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}