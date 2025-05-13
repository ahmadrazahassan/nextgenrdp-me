"use client";

import { useState, useEffect } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Package,
  CheckCircle2,
  Clock,
  ServerCrash,
  XCircle,
  AlertTriangle,
  RefreshCw,
  User,
  UserPlus,
  Mail,
  Calendar,
  Lock,
  Unlock,
  Eye,
  FileText,
  Settings,
  Edit,
  UserCog,
  Shield,
  Users,
  BarChart,
} from "lucide-react";
import { UserDetailsSheet } from "@/components/admin/UserDetailsSheet";
import { useRouter } from "next/navigation";
import { motion } from "@/components/ui/motion";

// Define user interface
interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLogin: string | null;
  emailVerified: boolean;
  accountLocked: boolean;
  failedLoginAttempts: number;
  isAdmin: boolean;
  orderCount: number;
  activeServices: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
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
  
  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check admin authentication first
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
      }
    };
    
    // Fetch real users from API
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if user is admin
        const isAdmin = await checkAdmin();
        if (!isAdmin) return;
        
        const response = await fetch('/api/admin/users', {
          credentials: 'include', // Include cookies and authentication headers
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // Apply filters when search term or status filter changes
  useEffect(() => {
    if (users.length > 0) {
      let result = [...users];
      
      // Apply search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        result = result.filter(
          user => 
            user.email.toLowerCase().includes(lowercaseSearch) ||
            user.fullName.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        switch (statusFilter) {
          case "active":
            result = result.filter(user => !user.accountLocked && user.emailVerified);
            break;
          case "unverified":
            result = result.filter(user => !user.emailVerified);
            break;
          case "locked":
            result = result.filter(user => user.accountLocked);
            break;
          case "admin":
            result = result.filter(user => user.isAdmin);
            break;
        }
      }
      
      setFilteredUsers(result);
    }
  }, [searchTerm, statusFilter, users]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge for user
  const getUserStatusBadge = (user: User) => {
    if (user.accountLocked) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0 flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Locked</span>
        </Badge>
      );
    } else if (!user.emailVerified) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-0 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Unverified</span>
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>Active</span>
        </Badge>
      );
    }
  };

  // Handle viewing user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  // Handle user update
  const handleUserUpdated = (updatedUser: User) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    
    // Apply current filters
    let result = [...updatedUsers];
    
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.email.toLowerCase().includes(lowercaseSearch) ||
          user.fullName.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "active":
          result = result.filter(user => !user.accountLocked && user.emailVerified);
          break;
        case "unverified":
          result = result.filter(user => !user.emailVerified);
          break;
        case "locked":
          result = result.filter(user => user.accountLocked);
          break;
        case "admin":
          result = result.filter(user => user.isAdmin);
          break;
      }
    }
    
    setFilteredUsers(result);
  };

  // User stats summary
  const userStats = {
    total: users.length,
    active: users.filter(user => !user.accountLocked && user.emailVerified).length,
    unverified: users.filter(user => !user.emailVerified).length,
    locked: users.filter(user => user.accountLocked).length,
    admins: users.filter(user => user.isAdmin).length
  };

  if (!mounted) {
    return null; // Prevent hydration errors by not rendering anything on the server
  }

  return (
    <div className="flex-1 space-y-4 p-6 pb-10">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">User Management</h2>
          <p className="text-gray-500">Manage customer and admin accounts</p>
        </div>
        <div>
          <Button className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white border-0 shadow-lg shadow-blue-600/20">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Users</div>
                  <div className="text-3xl font-bold">{userStats.total}</div>
                </div>
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Active Users</div>
                  <div className="text-3xl font-bold">{userStats.active}</div>
                </div>
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Unverified</div>
                  <div className="text-3xl font-bold">{userStats.unverified}</div>
                </div>
                <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-rose-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Locked</div>
                  <div className="text-3xl font-bold">{userStats.locked}</div>
                </div>
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Admins</div>
                  <div className="text-3xl font-bold">{userStats.admins}</div>
                </div>
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error message if API fails */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tabs for user status */}
      <div>
        <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
          <TabsList className="grid grid-cols-5 gap-4 rounded-lg p-1 bg-gradient-to-r from-slate-100 to-gray-50 shadow-inner">
            <TabsTrigger 
              value="all" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-blue-500 transition-all"
            >
              All Users
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-green-500 transition-all"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="unverified" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-amber-500 transition-all"
            >
              Unverified
            </TabsTrigger>
            <TabsTrigger 
              value="locked" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-red-500 transition-all"
            >
              Locked
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-purple-500 transition-all"
            >
              Admins
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Users table */}
      <div>
        <Card className="border border-slate-200 shadow-xl bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
          <CardHeader className="px-6 py-5 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800 font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Users List
              </CardTitle>
              <CardDescription className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4">
            {isLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-10 w-10 mx-auto mb-4 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <div className="bg-blue-50 rounded-full p-5 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your search or filters to find the users you're looking for</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-600">Name / Email</TableHead>
                      <TableHead className="font-semibold text-gray-600">Status</TableHead>
                      <TableHead className="font-semibold text-gray-600">Joined</TableHead>
                      <TableHead className="font-semibold text-gray-600">Last Login</TableHead>
                      <TableHead className="font-semibold text-gray-600">Orders</TableHead>
                      <TableHead className="font-semibold text-gray-600">Active Services</TableHead>
                      <TableHead className="font-semibold text-gray-600">Role</TableHead>
                      <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-blue-50/30"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-md">
                              {user.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.fullName}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getUserStatusBadge(user)}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                            {formatDate(user.lastLogin)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold shadow-sm">
                              {user.orderCount}
                            </div>
                            <span className="text-gray-500 text-sm">orders</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center text-green-700 text-xs font-bold shadow-sm">
                              {user.activeServices}
                            </div>
                            <span className="text-gray-500 text-sm">active</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.isAdmin ? (
                            <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0 flex items-center gap-1 shadow-sm">
                              <Shield className="h-3 w-3" />
                              <span>Admin</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500 border-gray-200 bg-gray-50">
                              Customer
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => handleViewUserDetails(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-56 bg-white border border-gray-200 shadow-md rounded-lg py-1.5 z-[100]"
                                sideOffset={5}
                                alignOffset={0}
                                avoidCollisions={true}
                              >
                                <DropdownMenuItem onClick={() => handleViewUserDetails(user)} className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>View Orders</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                  <Edit className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>Edit User</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                  <UserCog className="h-4 w-4 mr-2 text-purple-600" />
                                  <span>Manage Permissions</span>
                                </DropdownMenuItem>
                                {user.accountLocked ? (
                                  <DropdownMenuItem className="cursor-pointer hover:bg-green-50 py-2 px-3 text-green-600">
                                    <Unlock className="h-4 w-4 mr-2" />
                                    <span>Unlock Account</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="cursor-pointer hover:bg-red-50 py-2 px-3 text-red-600">
                                    <Lock className="h-4 w-4 mr-2" />
                                    <span>Lock Account</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                  <Settings className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>Reset Password</span>
                                </DropdownMenuItem>
                                <div className="border-t border-gray-100 mt-1 pt-1 mx-3 flex justify-between">
                                  <button className="px-2 py-1 text-gray-400 text-xs">Previous</button>
                                  <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">1</span>
                                  <button className="px-2 py-1 text-gray-400 text-xs">Next</button>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="text-xs h-8" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8 bg-blue-50 text-blue-600">
                  1
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* User details panel */}
      {selectedUser && (
        <UserDetailsSheet
          user={selectedUser}
          open={isUserDetailsOpen}
          onOpenChange={setIsUserDetailsOpen}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
} 