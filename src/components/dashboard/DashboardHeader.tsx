"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Sun, 
  Moon,
  Search,
  ChevronDown,
  Check,
  BarChart2,
  ShoppingCart,
  Shield,
  Star,
  Zap,
  LayoutDashboard,
  Server,
  Sparkles,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { AuthUser } from "@/lib/clientAuth";

// Types for notification
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  link?: string;
}

// Memoized notification item component
const NotificationItem = memo(({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) => {
  const { id, title, message, timestamp, read, type, link } = notification;
  
  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/40";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/40";
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/40";
      case "error":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/40";
    }
  };
  
  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-400 blur-[8px] opacity-60"></div>
            <HelpCircle className="relative h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
        );
      case "warning":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-400 blur-[8px] opacity-60"></div>
            <Bell className="relative h-4 w-4 text-amber-600 dark:text-amber-300" />
          </div>
        );
      case "success":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-400 blur-[8px] opacity-60"></div>
            <Check className="relative h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          </div>
        );
      case "error":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-rose-400 blur-[8px] opacity-60"></div>
            <ShoppingCart className="relative h-4 w-4 text-rose-600 dark:text-rose-300" />
          </div>
        );
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={cn(
        "flex items-start gap-3 p-3 text-sm border rounded-xl mb-2 transition-all duration-200 shadow-sm hover:shadow",
        read 
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-gray-200/70 dark:border-gray-800/70" 
          : getTypeStyles(type),
        link && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => link && window.open(link, "_blank")}
    >
      <div className={cn(
        "flex-shrink-0 rounded-full p-2",
        read 
          ? "bg-gray-100/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400" 
          : `${getTypeStyles(type)} bg-opacity-30`
      )}>
        {getTypeIcon(type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={cn(
            "font-medium truncate",
            read ? "text-gray-900 dark:text-gray-100" : ""
          )}>
            {title}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {new Date(timestamp).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        
        <p className={cn(
          "text-sm mt-1",
          read ? "text-gray-500 dark:text-gray-400" : ""
        )}>
          {message}
        </p>
        
        {!read && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs mt-2 h-7 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(id);
            }}
          >
            Mark as read
          </Button>
        )}
      </div>
    </motion.div>
  );
});
NotificationItem.displayName = "NotificationItem";

// Main DashboardHeader component
const DashboardHeader = ({ user, className }: { user: AuthUser; className?: string }) => {
  const [theme, setTheme] = useState("light");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useReducedMotion();
  
  // Get user display name
  const displayName = user?.fullName || user?.email?.split('@')[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };
  
  // Handle mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  // Handle mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  // Fetch notifications (demo with mock data)
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      try {
        // Try to fetch from API
        const response = await fetch("/api/user/notifications");
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          // Mock data for demonstration
          setTimeout(() => {
            setNotifications([
              {
                id: "1",
                title: "New Order Confirmed",
                message: "Your order #ORD-2023-1234 has been confirmed and is being processed.",
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                read: false,
                type: "success",
                link: "/dashboard/orders"
              },
              {
                id: "2",
                title: "Payment Reminder",
                message: "Your invoice #INV-2023-4567 is due in 3 days.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
                read: true,
                type: "warning",
                link: "/dashboard/billing"
              },
              {
                id: "3",
                title: "New Feature Available",
                message: "Check out our new analytics dashboard with enhanced reporting.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                read: false,
                type: "info",
                link: "/dashboard/analytics"
              }
            ]);
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className={cn("w-full shadow-lg", className)}>
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          {/* Enhanced Logo and Title with animation */}
          <Link href="/dashboard" className="flex items-center mr-6 group">
            <div className="relative h-14 w-14 mr-3">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 opacity-90 blur-[12px] group-hover:blur-[14px] group-hover:scale-110 transition-all duration-300"></div>
              <div className="relative h-full w-full flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 border-2 border-white/30 dark:border-gray-800/30 group-hover:from-violet-500 group-hover:to-indigo-500 transition-all duration-300 shadow-md">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="relative"
                >
                  <Sparkles className="h-7 w-7 text-white" />
                </motion.div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent block leading-tight group-hover:from-violet-400 group-hover:to-indigo-400 transition-all duration-300 drop-shadow-sm">
                NextGenRDP
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block bg-gradient-to-r from-gray-600 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                Client Dashboard
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links with enhanced styling */}
          <nav className="hidden md:flex space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-violet-500 blur-[6px] opacity-30"></div>
                  <LayoutDashboard className="h-4 w-4 relative text-violet-600 dark:text-violet-400" />
                </div>
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/services">
              <Button variant="ghost" size="sm" className="rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 blur-[6px] opacity-30"></div>
                  <Server className="h-4 w-4 relative text-indigo-600 dark:text-indigo-400" />
                </div>
                Services
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-sky-500 blur-[6px] opacity-30"></div>
                  <ShoppingCart className="h-4 w-4 relative text-sky-600 dark:text-sky-400" />
                </div>
                Orders
              </Button>
            </Link>
            <Link href="/dashboard/support">
              <Button variant="ghost" size="sm" className="rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-teal-500 blur-[6px] opacity-30"></div>
                  <HelpCircle className="h-4 w-4 relative text-teal-600 dark:text-teal-400" />
                </div>
                Support
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Search with improved styling */}
          <AnimatePresence mode="wait">
            {isSearchVisible ? (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: isMobile ? "100%" : "250px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[3px]"></div>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full h-9 pl-9 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-violet-200/70 dark:border-violet-900/30 rounded-full focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 relative"
                  autoFocus
                  onBlur={() => setIsSearchVisible(false)}
                />
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-violet-500 dark:text-violet-400" />
              </motion.div>
            ) : (
              <motion.div
                key="search-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30 relative"
                  onClick={() => setIsSearchVisible(true)}
                >
                  <div className="absolute inset-0 rounded-full bg-violet-500/10 dark:bg-violet-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                  <Search className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="sr-only">Search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Theme Toggle with improved effects */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-full relative hover:bg-amber-100 dark:hover:bg-indigo-900/30"
            onClick={toggleTheme}
          >
            <div className="absolute inset-0 rounded-full bg-amber-500/10 dark:bg-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity"></div>
            {theme === "light" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Notifications with improved dropdown styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full relative hover:bg-rose-100 dark:hover:bg-rose-900/30"
              >
                {unreadCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-rose-500 blur-[3px] opacity-80"></div>
                      <Badge 
                        variant="destructive" 
                        className="h-5 min-w-5 rounded-full p-0 px-[5px] relative bg-gradient-to-r from-rose-500 to-pink-500 border-none flex items-center justify-center text-white text-[10px] font-bold"
                      >
                        {unreadCount}
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-rose-500/10 dark:bg-rose-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                <Bell className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-[380px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/70 dark:border-gray-800/70 p-4 rounded-xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              
              {isLoading ? (
                <div className="py-12 flex items-center justify-center">
                  <div className="relative h-10 w-10">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                        borderRadius: ["25%", "50%", "25%"]
                      }}
                      transition={{ 
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-75"
                    />
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</h4>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2">
                  <AnimatePresence initial={false}>
                    {notifications.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        onMarkAsRead={handleMarkAsRead} 
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu with enhanced glassmorphism styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-2 pr-2 pl-3 rounded-full h-10 bg-gradient-to-r from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-800/85 backdrop-blur-md border border-violet-200/60 dark:border-violet-900/40 hover:shadow-md hover:border-violet-300/70 dark:hover:border-violet-800/50 transition-all duration-200"
              >
                <div className="hidden sm:flex text-sm mr-1">
                  <span className="font-medium bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-100 dark:to-gray-200 bg-clip-text text-transparent">{displayName}</span>
                </div>
                <div className="relative h-7 w-7">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 opacity-90 blur-[4px]"></div>
                  <Avatar className="relative h-7 w-7 border-2 border-white dark:border-gray-800 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <ChevronDown className="h-3.5 w-3.5 ml-0 text-gray-500 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/70 dark:border-gray-800/70 rounded-xl shadow-xl"
            >
              <div className="p-3 flex items-center space-x-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 opacity-90 blur-[4px]"></div>
                  <Avatar className="relative h-10 w-10 border-2 border-white dark:border-gray-800">
                    <AvatarFallback className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 truncate">{displayName}</p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="rounded-lg focus:bg-violet-50 dark:focus:bg-violet-900/20">
                  <div className="relative w-5 h-5 mr-2">
                    <div className="absolute inset-0 rounded-full bg-violet-500 blur-[4px] opacity-20"></div>
                    <User className="h-4 w-4 relative text-violet-600 dark:text-violet-400" />
                  </div>
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-900/20">
                  <div className="relative w-5 h-5 mr-2">
                    <div className="absolute inset-0 rounded-full bg-indigo-500 blur-[4px] opacity-20"></div>
                    <BarChart2 className="h-4 w-4 relative text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span>Analytics</span>
                  <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg focus:bg-amber-50 dark:focus:bg-amber-900/20">
                  <div className="relative w-5 h-5 mr-2">
                    <div className="absolute inset-0 rounded-full bg-amber-500 blur-[4px] opacity-20"></div>
                    <Settings className="h-4 w-4 relative text-amber-600 dark:text-amber-400" />
                  </div>
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg focus:bg-emerald-50 dark:focus:bg-emerald-900/20">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-emerald-500 blur-[4px] opacity-20"></div>
                  <Shield className="h-4 w-4 relative text-emerald-600 dark:text-emerald-400" />
                </div>
                <span>Security</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg focus:bg-yellow-50 dark:focus:bg-yellow-900/20">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-yellow-500 blur-[4px] opacity-20"></div>
                  <Star className="h-4 w-4 relative text-yellow-600 dark:text-yellow-400" />
                </div>
                <span>Upgrade Plan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg focus:bg-rose-50 dark:focus:bg-rose-900/20">
                <div className="relative w-5 h-5 mr-2">
                  <div className="absolute inset-0 rounded-full bg-rose-500 blur-[4px] opacity-20"></div>
                  <LogOut className="h-4 w-4 relative text-rose-600 dark:text-rose-400" />
                </div>
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 