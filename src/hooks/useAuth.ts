// src/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { redirectToLogin } from '@/lib/clientAuth';

interface UserData {
    id: string; // Changed from number to string for UUID compatibility
    fullName: string; // Changed from name to fullName to match API response
    email: string;
    emailVerified?: boolean; // Added to match API response
    isAdmin?: boolean;
    lastLogin?: string | Date;
    createdAt?: string | Date;
}

interface AuthState {
    user: UserData | null;
    isLoggedIn: boolean | null; // null = loading
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

// Define the hook
export function useAuth(): AuthState {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Function to check authentication status with the backend
    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log("[useAuth] Checking authentication status...");
            const response = await axios.get('/api/auth/me', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            console.log("[useAuth] Auth check response:", response.data);
            
            if (response.status === 200 && response.data.isLoggedIn) {
                setUser(response.data.user);
                setIsLoggedIn(true);
                // We no longer use localStorage to store user data for security reasons
            } else {
                // Explicitly set to not logged in based on API response
                setUser(null);
                setIsLoggedIn(false);
                // Clear any local storage data
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error("[useAuth] checkAuth failed:", error);
            // Any error during check usually means not authenticated
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this function doesn't change

    // Function to handle logout
    const logout = useCallback(async () => {
        const logoutToastId = toast.loading("Logging out...");
        try {
            await axios.post('/api/auth/logout'); // Ask backend to clear HttpOnly cookie
            toast.success("Logged out successfully.", { id: logoutToastId });
        } catch (error) {
            console.error("[useAuth] logout failed:", error);
            toast.error("Logout failed. Please try again.", { id: logoutToastId });
        } finally {
            // Clear client-side state regardless of API success
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('user');
            // Use the safer redirect function
            redirectToLogin();
        }
    }, []);

    // Run the check once when the hook mounts
    useEffect(() => {
        checkAuth();
        
        // Set up periodic checks to keep session alive
        const interval = setInterval(() => {
            // Only check if we think we're already logged in to avoid unnecessary requests
            if (isLoggedIn) {
                checkAuth();
            }
        }, 5 * 60 * 1000); // Check every 5 minutes
        
        return () => clearInterval(interval);
    }, [checkAuth, isLoggedIn]);

    // Return the state and functions
    return { user, isLoggedIn, isLoading, checkAuth, logout };
}