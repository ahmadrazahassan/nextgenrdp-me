"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart4,
  Home,
  Settings,
  ShoppingCart,
  Package,
  CreditCard,
  HelpCircle,
  Server,
  Users,
  Shield,
  Bell,
  MonitorSmartphone,
  CloudCog,
  LayoutDashboard,
  ArrowUpRight,
  Cpu,
  Sparkles,
  Rocket,
  FileText,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  iconColor?: string;
  submenu?: NavItem[];
  badge?: {
    text: string;
    variant: "default" | "outline" | "secondary" | "destructive" | "new" | "pro";
  };
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    iconColor: "from-violet-500 to-indigo-500",
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: Server,
    iconColor: "from-blue-500 to-sky-500",
    submenu: [
      {
        title: "RDP Servers",
        href: "/dashboard/services/rdp",
        icon: MonitorSmartphone,
        iconColor: "from-blue-500 to-indigo-500",
      },
      {
        title: "VPS",
        href: "/dashboard/services/vps",
        icon: CloudCog,
        iconColor: "from-sky-500 to-cyan-500",
        badge: {
          text: "New",
          variant: "new",
        },
      },
    ],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    iconColor: "from-emerald-500 to-green-500",
    badge: {
      text: "3",
      variant: "default",
    },
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    iconColor: "from-orange-500 to-amber-500",
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: MessageSquare,
    iconColor: "from-teal-500 to-green-500",
    submenu: [
      {
        title: "Tickets",
        href: "/dashboard/support/tickets",
        icon: FileText,
        iconColor: "from-teal-500 to-emerald-500",
      },
      {
        title: "Help Docs",
        href: "/dashboard/support/docs",
        icon: HelpCircle,
        iconColor: "from-sky-500 to-blue-500",
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    iconColor: "from-purple-500 to-violet-500",
  },
];

// Admin-only nav items
const adminNavItems: NavItem[] = [
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart4,
    iconColor: "from-blue-500 to-indigo-500",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    iconColor: "from-violet-500 to-purple-500",
  },
  {
    title: "Plans",
    href: "/admin/plans",
    icon: Package,
    iconColor: "from-amber-500 to-orange-500",
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
    iconColor: "from-emerald-500 to-teal-500",
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    iconColor: "from-red-500 to-rose-500",
    badge: {
      text: "5",
      variant: "destructive",
    },
  },
];

// NavItem component with enhanced styling and animation
const NavItem = ({
  item,
  isActive,
  isOpen,
  onToggle,
  isAdmin,
}: {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isAdmin: boolean;
}) => {
  const hasSubmenu = !!item.submenu?.length;
  const Icon = item.icon;
  const iconColorClass = item.iconColor || "from-gray-500 to-gray-600";
  
  // Extract the primary color from the gradient for solid hover backgrounds
  const getPrimaryColor = (gradientClass: string) => {
    if (gradientClass.includes("violet")) return "bg-violet-50 dark:bg-violet-900/20";
    if (gradientClass.includes("indigo")) return "bg-indigo-50 dark:bg-indigo-900/20"; 
    if (gradientClass.includes("blue")) return "bg-blue-50 dark:bg-blue-900/20";
    if (gradientClass.includes("sky")) return "bg-sky-50 dark:bg-sky-900/20";
    if (gradientClass.includes("cyan")) return "bg-cyan-50 dark:bg-cyan-900/20";
    if (gradientClass.includes("emerald")) return "bg-emerald-50 dark:bg-emerald-900/20";
    if (gradientClass.includes("green")) return "bg-green-50 dark:bg-green-900/20";
    if (gradientClass.includes("teal")) return "bg-teal-50 dark:bg-teal-900/20";
    if (gradientClass.includes("amber")) return "bg-amber-50 dark:bg-amber-900/20";
    if (gradientClass.includes("orange")) return "bg-orange-50 dark:bg-orange-900/20";
    if (gradientClass.includes("rose")) return "bg-rose-50 dark:bg-rose-900/20";
    if (gradientClass.includes("pink")) return "bg-pink-50 dark:bg-pink-900/20";
    if (gradientClass.includes("purple")) return "bg-purple-50 dark:bg-purple-900/20";
    return "bg-gray-50 dark:bg-gray-800/50";
  };
  
  const getBorderColor = (gradientClass: string) => {
    if (gradientClass.includes("violet")) return "border-violet-200/50 dark:border-violet-800/30";
    if (gradientClass.includes("indigo")) return "border-indigo-200/50 dark:border-indigo-800/30"; 
    if (gradientClass.includes("blue")) return "border-blue-200/50 dark:border-blue-800/30";
    if (gradientClass.includes("sky")) return "border-sky-200/50 dark:border-sky-800/30";
    if (gradientClass.includes("cyan")) return "border-cyan-200/50 dark:border-cyan-800/30";
    if (gradientClass.includes("emerald")) return "border-emerald-200/50 dark:border-emerald-800/30";
    if (gradientClass.includes("green")) return "border-green-200/50 dark:border-green-800/30";
    if (gradientClass.includes("teal")) return "border-teal-200/50 dark:border-teal-800/30";
    if (gradientClass.includes("amber")) return "border-amber-200/50 dark:border-amber-800/30";
    if (gradientClass.includes("orange")) return "border-orange-200/50 dark:border-orange-800/30";
    if (gradientClass.includes("rose")) return "border-rose-200/50 dark:border-rose-800/30";
    if (gradientClass.includes("pink")) return "border-pink-200/50 dark:border-pink-800/30";
    if (gradientClass.includes("purple")) return "border-purple-200/50 dark:border-purple-800/30";
    return "border-gray-200/50 dark:border-gray-700/30";
  };
  
  const getTextColor = (gradientClass: string) => {
    if (gradientClass.includes("violet")) return "text-violet-700 dark:text-violet-300";
    if (gradientClass.includes("indigo")) return "text-indigo-700 dark:text-indigo-300"; 
    if (gradientClass.includes("blue")) return "text-blue-700 dark:text-blue-300";
    if (gradientClass.includes("sky")) return "text-sky-700 dark:text-sky-300";
    if (gradientClass.includes("cyan")) return "text-cyan-700 dark:text-cyan-300";
    if (gradientClass.includes("emerald")) return "text-emerald-700 dark:text-emerald-300";
    if (gradientClass.includes("green")) return "text-green-700 dark:text-green-300";
    if (gradientClass.includes("teal")) return "text-teal-700 dark:text-teal-300";
    if (gradientClass.includes("amber")) return "text-amber-700 dark:text-amber-300";
    if (gradientClass.includes("orange")) return "text-orange-700 dark:text-orange-300";
    if (gradientClass.includes("rose")) return "text-rose-700 dark:text-rose-300";
    if (gradientClass.includes("pink")) return "text-pink-700 dark:text-pink-300";
    if (gradientClass.includes("purple")) return "text-purple-700 dark:text-purple-300";
    return "text-gray-700 dark:text-gray-300";
  };
  
  const getIconColor = (gradientClass: string) => {
    if (gradientClass.includes("violet")) return "text-violet-600 dark:text-violet-400";
    if (gradientClass.includes("indigo")) return "text-indigo-600 dark:text-indigo-400"; 
    if (gradientClass.includes("blue")) return "text-blue-600 dark:text-blue-400";
    if (gradientClass.includes("sky")) return "text-sky-600 dark:text-sky-400";
    if (gradientClass.includes("cyan")) return "text-cyan-600 dark:text-cyan-400";
    if (gradientClass.includes("emerald")) return "text-emerald-600 dark:text-emerald-400";
    if (gradientClass.includes("green")) return "text-green-600 dark:text-green-400";
    if (gradientClass.includes("teal")) return "text-teal-600 dark:text-teal-400";
    if (gradientClass.includes("amber")) return "text-amber-600 dark:text-amber-400";
    if (gradientClass.includes("orange")) return "text-orange-600 dark:text-orange-400";
    if (gradientClass.includes("rose")) return "text-rose-600 dark:text-rose-400";
    if (gradientClass.includes("pink")) return "text-pink-600 dark:text-pink-400";
    if (gradientClass.includes("purple")) return "text-purple-600 dark:text-purple-400";
    return "text-gray-600 dark:text-gray-400";
  };
  
  const hoverClass = getPrimaryColor(iconColorClass);
  const hoverBorder = getBorderColor(iconColorClass);
  const hoverTextColor = getTextColor(iconColorClass);
  const iconColor = getIconColor(iconColorClass);
  
  return (
    <div className="mb-1.5">
      <Link
        href={hasSubmenu ? "#" : item.href}
        onClick={(e) => {
          if (hasSubmenu) {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative group border border-transparent",
          isActive 
            ? `${hoverClass} ${hoverBorder}` 
            : `text-gray-700 dark:text-gray-300 hover:${hoverClass} hover:${hoverBorder}`,
          hasSubmenu && "justify-between",
        )}
      >
        <div className="flex items-center gap-3">
          {isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/20"
            />
          )}
          <div className="relative z-10">
            <div className={cn(
              "relative flex items-center justify-center w-8 h-8",
              isActive && "text-primary"
            )}>
              {isActive && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r", 
                  iconColorClass, 
                  "blur-md opacity-25 rounded-full"
                )} />
              )}
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg",
                isActive && "bg-opacity-10"
              )}>
                <Icon className={cn(
                  "h-[18px] w-[18px]",
                  isActive 
                    ? iconColor
                    : "text-gray-500 dark:text-gray-400 group-hover:" + iconColor.split(" ")[0]
                )} />
              </div>
            </div>
          </div>
          <span className={cn(
            "relative z-10 font-medium",
            isActive 
              ? iconColor
              : `text-gray-700 dark:text-gray-300 group-hover:${hoverTextColor}`
          )}>
            {item.title}
          </span>
        </div>
        
        {hasSubmenu && (
          <div className="flex items-center gap-1">
            {item.badge && (
              <div className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                item.badge.variant === "default" && "bg-primary/10 text-primary dark:bg-primary/20",
                item.badge.variant === "secondary" && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                item.badge.variant === "destructive" && "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
                item.badge.variant === "outline" && "border border-gray-200 dark:border-gray-800",
                item.badge.variant === "new" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                item.badge.variant === "pro" && "bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold",
              )}>
                {item.badge.text}
              </div>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "transform rotate-180" : ""
              )}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        )}
        
        {!hasSubmenu && item.badge && (
          <div className={cn(
            "relative",
            item.badge.variant === "destructive" && "animate-pulse"
          )}>
            {item.badge.variant === "destructive" && (
              <div className="absolute inset-0 rounded-full bg-rose-500 blur-sm opacity-60" />
            )}
            <div className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px] font-medium relative",
              item.badge.variant === "default" && "bg-primary/10 text-primary dark:bg-primary/20",
              item.badge.variant === "secondary" && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
              item.badge.variant === "destructive" && "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
              item.badge.variant === "outline" && "border border-gray-200 dark:border-gray-800",
              item.badge.variant === "new" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
              item.badge.variant === "pro" && "bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold",
            )}>
              {item.badge.text}
            </div>
          </div>
        )}
      </Link>
      
      {hasSubmenu && (
        <motion.div
          initial={isOpen ? { height: "auto" } : { height: 0 }}
          animate={isOpen ? { height: "auto" } : { height: 0 }}
          className="overflow-hidden ml-8 pl-3 border-l border-gray-200 dark:border-gray-800"
          transition={{ duration: 0.2 }}
        >
          <div className="pt-1 pb-1">
            {item.submenu?.map((subItem) => {
              const isSubActive = subItem.href === usePathname();
              const subIconColorClass = subItem.iconColor || iconColorClass;
              const subHoverClass = getPrimaryColor(subIconColorClass);
              const subHoverBorder = getBorderColor(subIconColorClass);
              const subIconColor = getIconColor(subIconColorClass);
              
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 relative group border border-transparent",
                    isSubActive
                      ? `${subHoverClass} ${subHoverBorder}`
                      : `text-gray-700 dark:text-gray-300 hover:${subHoverClass} hover:${subHoverBorder}`,
                  )}
                >
                  {isSubActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/20"
                    />
                  )}
                  <div className="relative z-10">
                    <div className={cn(
                      "relative flex items-center justify-center w-6 h-6"
                    )}>
                      {isSubActive && (
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-r", 
                          subIconColorClass, 
                          "blur-md opacity-25 rounded-full"
                        )} />
                      )}
                      <div className={cn(
                        "flex items-center justify-center rounded-lg"
                      )}>
                        <subItem.icon className={cn(
                          "h-4 w-4",
                          isSubActive 
                            ? subIconColor
                            : "text-gray-500 dark:text-gray-400 group-hover:" + subIconColor.split(" ")[0]
                        )} />
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    "relative z-10",
                    isSubActive 
                      ? subIconColor
                      : `text-gray-700 dark:text-gray-300 group-hover:${getTextColor(subIconColorClass)}`
                  )}>
                    {subItem.title}
                  </span>
                  
                  {subItem.badge && (
                    <div className={cn(
                      "ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-medium relative",
                      subItem.badge.variant === "default" && "bg-primary/10 text-primary dark:bg-primary/20",
                      subItem.badge.variant === "secondary" && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                      subItem.badge.variant === "destructive" && "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
                      subItem.badge.variant === "outline" && "border border-gray-200 dark:border-gray-800",
                      subItem.badge.variant === "new" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                      subItem.badge.variant === "pro" && "bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold",
                    )}>
                      {subItem.badge.text}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function DashboardNav() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the current path starts with any of these admin paths
  const isAdminPath = pathname?.startsWith('/admin') ?? false;
  
  // Effect to check if user is admin
  useEffect(() => {
    // For demo purposes, we'll just use the path to determine admin status
    setIsAdmin(isAdminPath);
    
    // In reality, you'd want to check from user data like:
    // const checkAdmin = async () => {
    //   const user = await getCurrentUser();
    //   setIsAdmin(user?.isAdmin || false);
    // };
    // checkAdmin();
  }, [isAdminPath]);
  
  // Initialize open state based on active path
  useEffect(() => {
    const initialOpenItems: string[] = [];
    
    [...navItems, ...(isAdmin ? adminNavItems : [])].forEach(item => {
      if (item.submenu?.some(subItem => subItem.href === pathname)) {
        initialOpenItems.push(item.title);
      }
    });
    
    setOpenItems(initialOpenItems);
  }, [pathname, isAdmin]);
  
  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };
  
  // Get all nav items based on user role
  const allNavItems = [...navItems, ...(isAdmin ? adminNavItems : [])];
  
  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="mb-4">
          <div className="relative px-3 py-2">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 opacity-90 blur-md" />
            <div className="relative flex items-center gap-2 py-1.5 px-2">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full bg-amber-500 blur-sm opacity-40"></div>
                <Shield className="h-4 w-4 relative text-amber-600 dark:text-amber-500" />
              </div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">Admin Panel</span>
            </div>
          </div>
        </div>
      )}
      
      <nav>
        <div className="space-y-1">
          {allNavItems.map((item) => {
            // Check if this item or any of its subitems is active
            const isItemActive = item.href === pathname ||
              Boolean(item.submenu?.some(subItem => subItem.href === pathname));
            
            // Check if submenu is open
            const isOpen = openItems.includes(item.title);
            
            return (
              <NavItem
                key={item.title}
                item={item}
                isActive={isItemActive}
                isOpen={isOpen}
                onToggle={() => toggleSubmenu(item.title)}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>
      </nav>
      
      <div className="mt-8">
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-indigo-500/20 to-transparent opacity-70 dark:opacity-40 blur-md" />
          <div className="relative p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl">
            <div className="flex items-center mb-3">
              <div className="relative mr-2">
                <div className="absolute inset-0 rounded-full bg-indigo-500 blur-sm opacity-40"></div>
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 relative" />
              </div>
              <h4 className="font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Need Help?</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <div className="flex gap-2">
              <Link 
                href="/dashboard/support" 
                className="inline-flex items-center justify-center rounded-lg text-xs px-3 py-1.5 font-medium transition-colors 
                           bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-md hover:from-violet-500 hover:to-indigo-500"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Contact Support
              </Link>
              <Link 
                href="/dashboard/support/docs" 
                className="inline-flex items-center justify-center rounded-lg text-xs px-3 py-1.5 font-medium transition-colors 
                           border border-violet-200 dark:border-violet-900/40 hover:bg-white/80 dark:hover:bg-gray-800/80 text-violet-700 dark:text-violet-300"
              >
                <FileText className="h-3 w-3 mr-1" />
                Help Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}