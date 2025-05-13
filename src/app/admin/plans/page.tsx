"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Server,
  Monitor,
  Database,
  Eye,
  ArrowUpDown,
  Cpu,
  HardDrive,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Check,
  X,
  Star,
  MemoryStick,
  Globe,
  Tags,
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react";
import { PlanDialog } from "@/components/admin/PlanDialog";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatedButton } from "@/components/ui/animated-button";

// Define plan interface
interface Plan {
  id: string;
  name: string;
  type: "rdp" | "vps";
  price: number;
  discountedPrice?: number;
  isPopular: boolean;
  active: boolean;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
    location: string;
  };
  duration: number; // in months
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

const PlansPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle creating a new plan
  const handleCreatePlan = () => {
    setCurrentPlan(null);
    setIsPlanDialogOpen(true);
  };

  // Handle editing a plan
  const handleEditPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsPlanDialogOpen(true);
  };

  // Handle toggling plan active status
  const handleTogglePlanStatus = async (plan: Plan) => {
    try {
      // Update the plan in the API
      const response = await fetch(`/api/admin/plans`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: plan.id,
          active: !plan.active,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const updatedPlan = await response.json();
      
      // Update the plans list
      setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      
      // Show toast notification
      toast.success(`Plan ${updatedPlan.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan status. Please try again.");
    }
  };

  // Handle deleting a plan
  const handleDeletePlan = async (plan: Plan) => {
    // Confirm deletion with the user
    if (!confirm(`Are you sure you want to delete the plan "${plan.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Delete the plan from the API
      const response = await fetch(`/api/admin/plans?id=${plan.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Remove the plan from the list
      setPlans(plans.filter(p => p.id !== plan.id));
      
      // Show toast notification
      toast.success(`Plan "${plan.name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  // Handle plan creation/update completion
  const handlePlanDialogComplete = (plan: Plan, isNew: boolean) => {
    if (isNew) {
      // Add the new plan to the list
      setPlans([...plans, plan]);
    } else {
      // Update the plan in the list
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
    }
    
    // Close the dialog
    setIsPlanDialogOpen(false);
    
    // Show success message
    toast.success(isNew ? "Plan created successfully" : "Plan updated successfully");
  };
  
  const handleRetry = () => {
    console.log("Retrying plan fetch with force import");
    // Force the API to reimport plans
    toast.info("Attempting to import plans...");
    
    // Set loading state
    setIsLoading(true);
    setIsRetrying(true);
    
    // Make a special request to trigger plan import
    fetch('/api/admin/plans?forceImport=true', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Plans imported:", data.length);
      setPlans(data);
      setFilteredPlans(data);
      toast.success(`Successfully imported ${data.length} plans`);
    })
    .catch(error => {
      console.error("Error importing plans:", error);
      toast.error("Failed to import plans. Please try again.");
    })
    .finally(() => {
      setIsLoading(false);
      setIsRetrying(false);
    });
  };

  // Check admin authentication first
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/admin/check');
        const data = await response.json();
        
        if (!data.isAdmin) {
          // Redirect to login if not admin
          router.push('/admin/login');
          return false;
        }
        
        return true;
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push('/admin/login');
        return false;
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAdmin();
  }, [router]);

  // Fetch plans from API
  useEffect(() => {
    if (isAuthChecking) return; // Don't fetch until auth check completes
    
    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching plans...");
        const response = await fetch('/api/admin/plans', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Plans API response status:", response.status);
        
        if (response.status === 401 || response.status === 403) {
          // Handle auth errors
          console.log("Authentication error, redirecting to login");
          router.push('/admin/login');
          return;
        }
        
        if (!response.ok) {
          console.error("Response not OK:", response.statusText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Plans data received:", data);
        console.log("Plans count:", data.length);
        
        setPlans(data);
        setFilteredPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Failed to load plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [isAuthChecking, router, isRetrying]);

  // Apply filters when search term, type filter, or status filter changes
  useEffect(() => {
    if (plans.length > 0) {
      let result = [...plans];
      
      // Apply search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        result = result.filter(
          plan => 
            plan.name.toLowerCase().includes(lowercaseSearch) ||
            plan.description?.toLowerCase().includes(lowercaseSearch) ||
            plan.specs.cpu.toLowerCase().includes(lowercaseSearch) ||
            plan.specs.ram.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Apply type filter
      if (typeFilter !== "all") {
        result = result.filter(plan => plan.type === typeFilter);
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        const isActive = statusFilter === "active";
        result = result.filter(plan => plan.active === isActive);
      }
      
      setFilteredPlans(result);
    }
  }, [searchTerm, typeFilter, statusFilter, plans]);

  // If checking authentication, show loading spinner
  if (isAuthChecking) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600 mx-auto" />
          <p className="mt-2 text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Plans Management</h2>
          <p className="text-gray-500">Create and manage service plans for your customers</p>
        </div>
        <AnimatedButton 
          gradient 
          icon={<Plus className="h-4 w-4" />} 
          onClick={handleCreatePlan}
        >
          Add New Plan
        </AnimatedButton>
      </motion.div>
      
      {/* Stats overview */}
      <AnimatePresence>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Plans</div>
                    <div className="text-3xl font-bold">{plans.length}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {plans.filter(p => p.active).length} active
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Server className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Active Plans</div>
                    <div className="text-3xl font-bold">{plans.filter(p => p.active).length}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.round((plans.filter(p => p.active).length / (plans.length || 1)) * 100)}% of total
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">RDP Plans</div>
                    <div className="text-3xl font-bold">{plans.filter(p => p.type === 'rdp').length}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {plans.filter(p => p.type === 'rdp' && p.active).length} active
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Monitor className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">VPS Plans</div>
                    <div className="text-3xl font-bold">{plans.filter(p => p.type === 'vps').length}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {plans.filter(p => p.type === 'vps' && p.active).length} active
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                    <Server className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AnimatePresence>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center">
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry} 
                  className="ml-2 bg-white text-red-800 border-red-300 hover:bg-red-50"
                >
                  <RefreshCw className={cn("h-3 w-3 mr-1", isRetrying && "animate-spin")} />
                  {isRetrying ? "Retrying..." : "Retry"}
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <motion.div
            initial={{ opacity: 0, width: "80%" }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Input
              placeholder="Search plans by name, specs, or description..."
              className="pl-10 w-full bg-white border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </div>
    
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Tabs defaultValue="all" value={typeFilter} onValueChange={setTypeFilter} className="w-full">
          <TabsList className="bg-white border border-gray-200 rounded-md p-1 shadow-sm">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-gray-700 border border-transparent data-[state=active]:border-blue-600 transition-all duration-200"
            >
              All Plans
            </TabsTrigger>
            <TabsTrigger 
              value="rdp" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-gray-700 border border-transparent data-[state=active]:border-blue-600 transition-all duration-200"
            >
              <Monitor className="h-3.5 w-3.5 mr-1.5" />
              RDP Plans
            </TabsTrigger>
            <TabsTrigger 
              value="vps" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-gray-700 border border-transparent data-[state=active]:border-blue-600 transition-all duration-200"
            >
              <Server className="h-3.5 w-3.5 mr-1.5" />
              VPS Plans
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
    
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="flex items-center gap-2"
      >
        <span className="text-sm text-gray-500">Status:</span>
        <div className="flex gap-2">
          <AnimatedButton
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" 
              ? "bg-gradient-to-r from-blue-600 to-indigo-700 border-0 shadow-sm" 
              : "bg-white text-gray-700 border-gray-300 shadow-sm"}
          >
            All
          </AnimatedButton>
          <AnimatedButton
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" 
              ? "bg-gradient-to-r from-green-600 to-emerald-700 border-0 shadow-sm" 
              : "bg-white text-gray-700 border-gray-300 shadow-sm"}
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            Active
          </AnimatedButton>
          <AnimatedButton
            variant={statusFilter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("inactive")}
            className={statusFilter === "inactive" 
              ? "bg-gradient-to-r from-gray-600 to-slate-700 border-0 shadow-sm" 
              : "bg-white text-gray-700 border-gray-300 shadow-sm"}
            icon={<XCircle className="h-4 w-4" />}
          >
            Inactive
          </AnimatedButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="shadow-lg border border-gray-200 bg-white overflow-hidden rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 px-6">
            <div>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-600" />
                Plans List
              </CardTitle>
              <CardDescription className="text-gray-500">
                {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'} found
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-[300px] w-full rounded-md" />
              </div>
            ) : filteredPlans.length === 0 ? (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-96 text-center p-4"
                >
                  <Server className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">No plans found</h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    {plans.length === 0
                      ? "You haven't created any plans yet. You can import the default plans or create a new one."
                      : "No plans match your current filters. Try adjusting your search or filters."}
                  </p>
                  {plans.length === 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <AnimatedButton 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        icon={<RefreshCw className="h-4 w-4" />}
                        onClick={handleRetry}
                        size="lg"
                        loading={isRetrying}
                      >
                        Import Default Plans
                      </AnimatedButton>
                      <AnimatedButton 
                        gradient
                        icon={<Plus className="h-4 w-4" />}
                        onClick={handleCreatePlan}
                        size="lg"
                      >
                        Create New Plan
                      </AnimatedButton>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="overflow-auto">
                <Table className="border-collapse w-full">
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="w-[250px] text-gray-700 font-semibold">Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Price</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Specs</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Last Updated</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredPlans.map((plan, index) => (
                        <motion.tr
                          key={plan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-blue-50/40 border-b border-gray-200 text-gray-900"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">
                                {plan.name}
                                {plan.isPopular && (
                                  <Badge className="ml-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {plan.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "shadow-sm",
                                plan.type === 'rdp' 
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700' 
                                  : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-700'
                              )}
                            >
                              {plan.type === 'rdp' ? (
                                <Monitor className="h-3 w-3 mr-1" />
                              ) : (
                                <Server className="h-3 w-3 mr-1" />
                              )}
                              {plan.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">{formatPrice(plan.price)}</div>
                            {plan.discountedPrice && (
                              <div className="text-sm text-green-600 flex items-center gap-1">
                                <ArrowUpDown className="h-3 w-3" />
                                Discounted: {formatPrice(plan.discountedPrice)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-xs text-gray-700">
                                <Cpu className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                <span>{plan.specs.cpu}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-700">
                                <MemoryStick className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                <span>{plan.specs.ram}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-700">
                                <HardDrive className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                <span>{plan.specs.storage}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-700">
                                <Globe className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                <span>{plan.specs.location}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.div 
                              className="flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Switch 
                                checked={plan.active} 
                                onCheckedChange={() => handleTogglePlanStatus(plan)}
                                className="mr-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                              />
                              <motion.span 
                                animate={{ color: plan.active ? '#16a34a' : '#64748b' }}
                                transition={{ duration: 0.3 }}
                              >
                                {plan.active ? "Active" : "Inactive"}
                              </motion.span>
                            </motion.div>
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {formatDate(plan.updatedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AnimatedButton 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-blue-600"
                                      onClick={() => handleEditPlan(plan)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </AnimatedButton>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Plan</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <DropdownMenu>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <DropdownMenuTrigger asChild>
                                        <AnimatedButton 
                                          variant="ghost" 
                                          className="h-8 w-8 p-0 text-gray-500"
                                        >
                                          <span className="sr-only">Open menu</span>
                                          <MoreHorizontal className="h-4 w-4" />
                                        </AnimatedButton>
                                      </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>More Actions</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <DropdownMenuContent 
                                  align="end" 
                                  className="w-56 bg-white border border-gray-200 shadow-md rounded-lg py-1.5 z-[100]"
                                  sideOffset={5}
                                  alignOffset={0}
                                  avoidCollisions={true}
                                >
                                  <DropdownMenuItem 
                                    onClick={() => handleEditPlan(plan)}
                                    className="cursor-pointer hover:bg-gray-50 py-2 px-3"
                                  >
                                    <Edit className="h-4 w-4 mr-2 text-blue-600" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePlanStatus(plan)}
                                    className="cursor-pointer hover:bg-gray-50 py-2 px-3"
                                  >
                                    {plan.active ? (
                                      <>
                                        <XCircle className="h-4 w-4 mr-2 text-amber-500" />
                                        <span>Deactivate</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                        <span>Activate</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="my-1 bg-gray-200" />
                                  <DropdownMenuItem
                                    className="cursor-pointer hover:bg-red-50 py-2 px-3 text-red-600"
                                    onClick={() => handleDeletePlan(plan)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 px-6">
            <div className="text-sm text-gray-500">
              Showing {filteredPlans.length} of {plans.length} plans
            </div>
            <AnimatedButton 
              variant="outline" 
              size="sm"
              onClick={handleCreatePlan}
              className="bg-white border-gray-300 text-gray-700"
              icon={<Plus className="h-4 w-4" />}
            >
              New Plan
            </AnimatedButton>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Plan dialog */}
      <PlanDialog
        open={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
        plan={currentPlan}
        onComplete={handlePlanDialogComplete}
      />
    </div>
  );
};

export default PlansPage; 