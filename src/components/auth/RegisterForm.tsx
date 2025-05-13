'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User as UserIcon, Mail, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  // onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, error: authError, clearError } = useAuth();
  const { toast } = useToast();

  const handleFieldChange = () => {
      if (formError) setFormError(null); // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();
    setIsLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      const errMsg = 'All fields are required.';
      setFormError(errMsg);
      toast({ title: "Registration Error", description: errMsg, variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      const errMsg = 'Passwords do not match.';
      setFormError(errMsg);
      toast({ title: "Registration Error", description: errMsg, variant: "destructive" });
      setIsLoading(false);
      return;
    }
    // Add more password validation if needed (length, complexity)

    try {
      await register({ fullName, email, password });
      toast({ title: "Registration Successful", description: "Please check your email for verification if required, then log in." });
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setFormError(errorMsg);
      toast({ title: "Registration Failed", description: errorMsg, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       {/* Render inline error using Alert */}
       {formError && (
         <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
                {formError}
            </AlertDescription>
         </Alert>
       )}

      <div>
        <label htmlFor="fullName-register" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
          </div>
          <Input
            id="fullName-register"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); handleFieldChange(); }}
            className="pl-10 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your Full Name"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative rounded-md shadow-sm">
           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true"/>
          </div>
          <Input
            id="email-register"
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
        <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
         <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </div>
            <Input
                id="password-register"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); handleFieldChange(); }}
                className="pl-10 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Create a password"
                disabled={isLoading}
            />
         </div>
      </div>

      <div>
        <label htmlFor="confirmPassword-register" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
         <div className="relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </div>
            <Input
                id="confirmPassword-register"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); handleFieldChange(); }}
                 className="pl-10 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm your password"
                disabled={isLoading}
            />
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...</>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm; 