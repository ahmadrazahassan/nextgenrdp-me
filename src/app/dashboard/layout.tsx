"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AuthUser } from "@/lib/clientAuth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();

  // Close menu when route changes on mobile
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Load user data
  useEffect(() => {
    let mounted = true;
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Simple fetch to get user data
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }
        
        const data = await response.json();
        
        if (mounted) {
          if (data.user) {
            setUser(data.user);
          } else {
            setAuthError("No user data returned. Please login again.");
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        
        if (mounted) {
          setAuthError("Failed to authenticate. Please try logging in again.");
          setLoading(false);
        }
      }
    };

    fetchUser();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-violet-50/40 to-gray-50 dark:from-gray-950 dark:via-violet-950/10 dark:to-gray-950">
        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 blur-xl opacity-40 rounded-full"></div>
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
              className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 opacity-80 rounded-xl"
            />
          </div>
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-violet-50/40 to-gray-50 dark:from-gray-950 dark:via-violet-950/10 dark:to-gray-950">
        <div className="flex flex-col items-center text-center max-w-md p-8 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xl border border-gray-200/80 dark:border-gray-800/50">
          <div className="relative h-20 w-20 mb-4">
            <div className="absolute inset-0 bg-rose-500/80 blur-xl opacity-50 rounded-full"></div>
            <div className="relative h-full w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
              <X className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{authError}</p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-600/90 hover:to-indigo-600/90 text-white px-8 py-2 shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  // If we're not loading and don't have a user or error, redirect to login
  if (!user && !loading && !authError) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // Create a dummy user if no user data (for development only)
  const displayUser = user || {
    id: "temp-user-id",
    email: "user@example.com",
    fullName: "Demo User",
    emailVerified: true,
    isAdmin: false
  };

  const headerClassName = "sticky top-0 z-30 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-violet-200/70 dark:border-violet-900/40 shadow-sm";

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-violet-50/40 to-gray-50 dark:from-gray-950 dark:via-violet-950/10 dark:to-gray-950" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl opacity-30" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        {/* Additional animated gradients */}
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-rose-600/10 to-orange-600/10 blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Enhanced header */}
      <DashboardHeader 
        user={displayUser} 
        className={headerClassName} 
      />
      
      {/* Mobile menu toggle button with enhanced styling */}
      {isMobile && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 blur-xl opacity-50"></div>
            <Button
              size="icon"
              variant="default"
              onClick={toggleMenu}
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 border-0 relative hover:shadow-xl transition-all"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar navigation - mobile version */}
        <AnimatePresence mode="wait">
          {(isMobile && isMenuOpen) && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md pt-16"
            >
              <div className="p-6 max-h-screen overflow-y-auto rounded-t-2xl">
                <DashboardNav />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Sidebar navigation - desktop version with enhanced width and gradient border */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block w-80 shrink-0 border-r border-violet-200/70 dark:border-violet-900/40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md min-h-[calc(100vh-4rem)] relative"
        >
          <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-violet-400/10 via-indigo-500/20 to-purple-500/10"></div>
          <div className="h-full py-8 pl-6 pr-4 overflow-y-auto">
            <DashboardNav />
          </div>
        </motion.aside>
        
        {/* Main content with improved styling and rounded corners */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="flex-1 overflow-x-hidden p-4 sm:p-6"
        >
          <div className="rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}