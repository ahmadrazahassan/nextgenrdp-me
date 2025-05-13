'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Mail, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // Import standard useToast
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

interface LoginFormProps {
  onLoginSuccess?: () => void;
  // onSwitchToRegister?: () => void; // Optional: if you have a toggle on the same view
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: authError, clearError } = useAuth();
  const { toast } = useToast(); // Get toast function

  const handleFieldChange = () => {
      if (formError) setFormError(null); // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError(); // Clear previous auth errors
    setIsLoading(true);

    if (!email || !password) {
      const errMsg = 'Email and password are required.';
      setFormError(errMsg); // Set inline error
      // toast({ title: "Login Error", description: errMsg, variant: "destructive" }); // Keep toast optional or remove if inline is enough
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password });
      // Login success is handled by AuthProvider updating state
      toast({ title: "Login Successful", description: "Welcome back!" }); // Optional success toast
      if (onLoginSuccess) onLoginSuccess(); 
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed. Please check your credentials.';
      setFormError(errorMsg); // Set inline error
      // toast({ title: "Login Failed", description: errorMsg, variant: "destructive" }); // Keep toast optional or remove if inline is enough
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       {/* Render inline error using Alert */}
       {formError && (
         <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            {/* <AlertTitle>Login Error</AlertTitle> */}
            <AlertDescription className="text-red-700">
                {formError}
            </AlertDescription>
         </Alert>
       )}

      <div>
        <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            id="email-login"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); handleFieldChange(); }}
            className="pl-10 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative rounded-md shadow-sm">
           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            id="password-login"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => { setPassword(e.target.value); handleFieldChange(); }}
            className="pl-10 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Optional: Remember me & Forgot password link */}
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-700" />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400"> Remember me </label>
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-400 hover:text-blue-300"> Forgot your password? </a>
        </div>
      </div> */}

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...</>
          ) : (
            'Log In'
          )}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm; 