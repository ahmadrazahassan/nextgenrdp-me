"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the session context
const SessionContext = createContext(null);

// SessionProvider component
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session data on component mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        
        if (data.success) {
          setSession(data.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSession();
  }, []);

  // Function to update session after login
  const login = async (userData) => {
    setSession(userData);
  };

  // Function to clear session after logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SessionContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to use the session context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
