// This file contains the SessionProvider component for managing authentication state

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Define user type
type User = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
};

// Define session context type
type SessionContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

// Create context with default values
const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshSession: async () => {},
});

// Custom hook to use the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// SessionProvider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch current session
  // In the refreshSession function
  const refreshSession = async () => {
    try {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
        console.error('Session refresh timed out');
      }, 10000); // 10 second timeout
      
      const response = await fetch("/api/auth/me");
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.isLoggedIn && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    // Store minimal user info in localStorage for UI purposes only
    // The actual authentication relies on HTTP-only cookies
    try {
      localStorage.setItem('userEmail', userData.email);
    } catch (error) {
      console.error("Failed to store user info in localStorage:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        setUser(null);
        // Clear localStorage
        try {
          localStorage.removeItem('userEmail');
        } catch (error) {
          console.error("Failed to clear localStorage:", error);
        }
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    refreshSession();
    
    // Set up periodic session refresh (every 15 minutes)
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Provide session context to children
  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
