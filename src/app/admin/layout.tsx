"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, Package, Tag, Database, Image, Home, 
  LogOut, Menu, X, BarChart3, Settings, Bell, Search,
  Shield, Server, AlertCircle, ChevronRight, 
  LayoutDashboard, Layers, Gauge, Globe,
  User,
  ShoppingCart,
  FileText,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  exact?: boolean;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Handle hydration by setting isClient after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Listen for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <User className="h-5 w-5" />,
      badge: 4,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      badge: 4,
    },
    {
      title: "Plans",
      href: "/admin/plans",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Media",
      href: "/admin/media",
      icon: <Upload className="h-5 w-5" />,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const securityNavItems: NavItem[] = [
    {
      title: "Security",
      href: "/admin/security",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Server Status",
      href: "/admin/server-status",
      icon: <Server className="h-5 w-5" />,
    },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { 
      width: "280px",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30
      } 
    },
    closed: { 
      width: "0px",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2
      } 
    }
  };

  const contentVariants = {
    open: { 
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const overlayVariants = {
    open: { 
      opacity: 0.5,
      display: "block" 
    },
    closed: { 
      opacity: 0,
      transitionEnd: { 
        display: "none" 
      }
    }
  };

  // Sidebar content separated for reuse
  const renderSidebarContent = () => {
    return (
      <>
        <div className="py-6 px-5 flex items-center justify-between border-b border-gray-100">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 font-bold text-xl text-blue-600"
          >
            <div className="bg-blue-600 text-white h-9 w-9 rounded-lg flex items-center justify-center shadow-lg">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <span>NextGenRDP</span>
              <div className="text-xs text-gray-500 font-normal">Admin Control Center</div>
            </div>
          </Link>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* System status */}
        <div className="px-3 py-4 mx-2 mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-inner">
          <div className="flex items-center px-2">
            <div className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2 shadow-sm shadow-green-500/50 ring-2 ring-green-100 animate-pulse"></div>
            <h2 className="text-sm font-medium text-gray-700">System Status</h2>
            <Badge variant="outline" className="ml-auto text-xs bg-green-100 text-green-800 border-green-200 px-1.5">Healthy</Badge>
          </div>
          <div className="mt-2 px-2">
            <p className="text-xs text-gray-500">All services operational</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-2 px-3 flex flex-col">
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </h2>
              <div className="space-y-0.5">
                {mainNavItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-blue-600 text-white shadow-md shadow-blue-300"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:border-blue-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex items-center justify-center h-7 w-7 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        className={cn(
                          "ml-auto",
                          pathname === item.href
                            ? "bg-blue-500 hover:bg-blue-400 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </h2>
              <div className="space-y-0.5">
                {secondaryNavItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-blue-600 text-white shadow-md shadow-blue-300"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:border-blue-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex items-center justify-center h-7 w-7 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Security
              </h2>
              <div className="space-y-0.5">
                {securityNavItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-blue-600 text-white shadow-md shadow-blue-300"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:border-blue-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex items-center justify-center h-7 w-7 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 bg-blue-100 border border-blue-200 shadow-sm">
              <AvatarImage src="/images/avatar.png" alt="Admin User" />
              <AvatarFallback className="text-blue-700 font-semibold">AD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500">admin@nextgenrdp.com</div>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    );
  };

  // Static content for SSR, animated content for client
  const renderMainContent = () => {
    if (!isClient) {
      return (
        <main className="min-h-screen" style={{ marginLeft: (!isMobile && isSidebarOpen) ? "280px" : "0px" }}>
          {renderMainBody()}
        </main>
      );
    }

    return (
      <motion.main
        initial={false}
        animate={isSidebarOpen && !isMobile ? "open" : "closed"}
        variants={contentVariants}
        className="min-h-screen pl-0"
      >
        {renderMainBody()}
      </motion.main>
    );
  };

  // Main content body separated for reuse
  const renderMainBody = () => {
    return (
      <>
        {/* Header */}
        <header className="h-16 px-6 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-gray-500"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search anything..." 
                className="w-full pl-9 pr-4 py-2 border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2 items-center border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm">
              <Globe className="h-4 w-4" />
              <span>Website</span>
            </Button>
            
            <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm relative">
              <Bell className="h-5 w-5" />
              <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </Button>
            
            <Avatar className="h-9 w-9 bg-blue-100 border border-blue-200 shadow-sm">
              <AvatarImage src="/images/avatar.png" alt="Admin User" />
              <AvatarFallback className="text-blue-700 font-semibold">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <div className="w-full py-8 px-6">
          {children}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col max-w-full overflow-hidden">
      <div className="flex flex-row flex-1 w-full bg-white shadow-md overflow-hidden rounded-lg">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={isSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className={
            isMobile
              ? "fixed top-0 left-0 h-screen bg-white z-40 flex flex-col bottom-0"
              : "sticky top-0 h-screen bg-white z-30 flex flex-col"
          }
          style={isMobile ? { maxHeight: '100vh' } : { width: '280px', minWidth: '280px', maxWidth: '280px' }}
        >
          {renderSidebarContent()}
        </motion.aside>
        {/* Main content */}
        <main className="flex-1 flex flex-col w-full min-w-0 border-l border-gray-50">
          {renderMainContent()}
        </main>
      </div>
      {/* Professional footer always at the bottom, never overlapped */}
      <footer className="w-full bg-white border-t border-gray-100 py-3 px-6 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} NextGenRDP Admin &mdash; All rights reserved.
      </footer>
      {/* Mobile overlay - only render on client side */}
      {isClient && isMobile && isSidebarOpen && (
        <AnimatePresence>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        </AnimatePresence>
      )}
    </div>
  );
} 