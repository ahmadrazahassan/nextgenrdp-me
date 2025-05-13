'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, CheckCircle, Loader2 } from 'lucide-react';

const UserDisplay: React.FC = () => {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return null; // Or a fallback if this component is rendered when no user (should not happen in intended flow)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    // AuthProvider will clear user, OrderPage will re-render based on isAuthenticated
  };

  return (
    <div className="p-4 sm:p-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-3">
        <UserCircle className="h-10 w-10 text-indigo-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">Logged in as:</p>
          <p className="text-base font-semibold text-gray-900 truncate" title={user.email}>{user.fullName || user.email}</p>
        </div>
      </div>
      <div className="flex items-center text-green-600 space-x-2">
        <CheckCircle size={18} />
        <p className="text-sm font-medium">You can proceed with this account.</p>
      </div>
      <Button
        variant="outline"
        onClick={handleLogout}
        disabled={isAuthLoading || isLoggingOut}
        className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 disabled:opacity-60"
      >
        {isLoggingOut ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        Log Out
      </Button>
      <p className="text-xs text-gray-500 text-center pt-1">Not you? Log out to switch account.</p>
    </div>
  );
};

export default UserDisplay; 