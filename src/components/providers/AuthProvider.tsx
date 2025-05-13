'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName?: string;
  isAdmin?: boolean;
  // Add other user fields as needed from your User model
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>; // Define specific credentials type later
  register: (userData: any) => Promise<void>; // Define specific userData type later
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true to check initial auth status
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data); // Adjust based on your API response structure for /api/auth/me
      } else {
        setUser(null); // Not authenticated or error
        if (response.status !== 401) { // Don't set error for typical unauthenticated responses
            const errorData = await response.json().catch(() => ({}))
            setError(errorData.message || 'Failed to fetch user status.');
        }
      }
    } catch (err: any) {
      console.error("Auth provider error:", err);
      setUser(null);
      // Don't set error for network issues to prevent bad UX
      // setError(err.message || 'An error occurred while fetching user status.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Add a try-catch to prevent unhandled errors during initialization
    try {
      fetchCurrentUser();
    } catch (err) {
      console.error("Error in auth initialization:", err);
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setUser(data.user || data); // Adjust based on your API response structure
      // Optionally redirect or perform other actions
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
      setUser(null);
      throw err; // Re-throw to be caught by the form
    }
    setIsLoading(false);
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      // setUser(data.user || data); // Optionally auto-login or fetch user after registration
      // Typically, after registration, you might want to redirect to login or auto-fetch user
      await fetchCurrentUser(); // Re-fetch user to confirm session, or handle as per your flow
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setUser(null);
      throw err; // Re-throw to be caught by the form
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Logout failed');
      }
      setUser(null);
      // router.push('/login'); // Optional: redirect after logout
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout.');
    }
    setIsLoading(false);
  };

  const clearError = () => setError(null);

  // Return early with just children if there's a critical error
  // to prevent the app from being unusable
  if (error && process.env.NODE_ENV === 'production') {
    console.error("Critical auth error:", error);
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      error,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 