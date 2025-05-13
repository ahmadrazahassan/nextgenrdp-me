"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSession } from "@/components/providers/SessionProvider";
import { FiMail, FiLock, FiEye, FiEyeOff, FiGithub, FiTwitter } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { LuFingerprint } from "react-icons/lu";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { isLoggedIn } from "@/lib/clientAuth";

// Login form schema with validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get('redirect') || '/dashboard' : '/dashboard';
  const { login } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric' | 'otp'>('password');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const email = watch('email');

  // Check if the user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      // User is already logged in, redirect to dashboard or other protected page
      toast.success("Already logged in. Redirecting...");
      
      // Use a timeout to let the toast appear before redirecting
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);
    }
  }, [redirectPath]);

  // Check if biometric authentication is available
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        // This is a simplified check - in a real app, you'd use the Web Authentication API
        if (window.PublicKeyCredential) {
          setBiometricAvailable(true);
        }
      } catch (error) {
        console.error("Error checking biometric availability:", error);
        setBiometricAvailable(false);
      }
    };

    checkBiometricAvailability();
  }, []);

  const handleBiometricLogin = async () => {
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Authenticating with biometrics...");
    
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.dismiss(loadingToastId);
      toast.success("Biometric authentication successful!");
      
      // Simulate successful login
      login({
        id: "biometric-user-id",
        email: email || "user@example.com",
        fullName: "Biometric User",
        emailVerified: true,
      });
      
      // Use direct location change for more reliable navigation
      window.location.href = redirectPath;
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Biometric authentication failed. Please try another method.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email || errors.email) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Sending verification code...");
    
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.dismiss(loadingToastId);
      toast.success("Verification code sent to your email!");
      setOtpSent(true);
      setShowOtpInput(true);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete verification code");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Verifying code...");
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.dismiss(loadingToastId);
      toast.success("Verification successful!");
      
      // Simulate successful login
      login({
        id: "otp-user-id",
        email: email,
        fullName: "OTP User",
        emailVerified: true,
      });
      
      // Use direct location change for more reliable navigation
      window.location.href = redirectPath;
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Signing in...");
    
    try {
      // Log login attempt for debugging
      console.log("[Login] Attempting login with:", { 
        email: data.email, 
        rememberMe: data.rememberMe 
      });
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // Ensure we're not using a cached response
        cache: "no-store",
      });
      
      // Log response status for debugging
      console.log("[Login] Login response status:", response.status);
      
      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
        console.log("[Login] Login response data:", responseData);
      } catch (parseError) {
        console.error("[Login] Error parsing JSON response:", parseError);
        throw {
          status: response.status,
          message: "Could not parse server response",
          originalError: parseError
        };
      }
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData?.error || "Login failed",
          data: responseData,
        };
      }
      
      toast.dismiss(loadingToastId);
      toast.success("Signed in successfully!");
      
      // Update session context
      if (responseData.user) {
        login(responseData.user);
      }
      
      // Allow a small delay for toast to be visible
      setTimeout(() => {
        // Use direct location change for more reliable navigation
        // Prioritize the redirect from URL parameters, then saved redirect, then default to dashboard
        const finalRedirect = redirectPath || localStorage.getItem('redirectAfterAuth') || '/dashboard';
        
        // Clear any saved redirect to prevent future unexpected redirects
        localStorage.removeItem('redirectAfterAuth');
        
        console.log(`[Login] Redirecting to: ${finalRedirect}`);
        window.location.href = finalRedirect;
      }, 300);
      
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      
      // Safely log error information with type checking
      console.log("[Login] Error type:", typeof error);
      console.log("[Login] Error details:", error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : "Empty error object");
      
      // Handle different error formats with fallbacks for empty objects
      let errorMessage = "Login failed. Please check credentials or try again.";
      
      if (error) {
        if (error.status === 401) {
          // Invalid credentials
          errorMessage = "Invalid email or password";
        } else if (error.status === 403) {
          // Account locked
          errorMessage = "Your account has been locked due to too many failed attempts";
        } else if (error.status === 400) {
          // Validation error
          errorMessage = "Please check your information and try again";
        } else if (error.message) {
          // Custom error message
          errorMessage = error.message;
        } else if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.loading(`Authenticating with ${provider}...`);
    // In a real implementation, this would redirect to the OAuth provider
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${provider} authentication coming soon!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-4"
              >
                <RiShieldKeyholeLine className="w-8 h-8" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FcGoogle className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FaFacebook className="w-6 h-6 text-blue-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FiGithub className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin('Twitter')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FiTwitter className="w-6 h-6 text-blue-400" />
              </motion.button>
            </div>
            
            <div className="relative flex items-center justify-center mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600 text-sm">or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setLoginMethod('password')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    loginMethod === 'password' 
                      ? 'bg-white shadow-sm text-indigo-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Password
                </button>
                {biometricAvailable && (
                  <button
                    onClick={() => setLoginMethod('biometric')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginMethod === 'biometric' 
                        ? 'bg-white shadow-sm text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Biometric
                  </button>
                )}
                <button
                  onClick={() => setLoginMethod('otp')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    loginMethod === 'otp' 
                      ? 'bg-white shadow-sm text-indigo-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  OTP
                </button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {loginMethod === 'password' && (
                <motion.form 
                  key="password-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6" 
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiMail className="text-gray-500" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        className={`pl-10 block w-full appearance-none rounded-lg border px-3 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        }`}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Password"
                        className={`pl-10 block w-full appearance-none rounded-lg border px-3 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                          errors.password ? "border-red-300" : "border-gray-300"
                        }`}
                        {...register("password")}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        {...register("rememberMe")}
                      />
                      <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </motion.button>
                  </div>
                </motion.form>
              )}
              
              {loginMethod === 'biometric' && (
                <motion.div
                  key="biometric-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiMail className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setValue('email', e.target.value)}
                        className="pl-10 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 cursor-pointer"
                      onClick={handleBiometricLogin}
                    >
                      <LuFingerprint className="w-12 h-12 text-indigo-600" />
                    </motion.div>
                    <p className="text-gray-700 text-center">
                      Click the icon to authenticate with your biometric data
                    </p>
                  </div>
                  
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleBiometricLogin}
                      className="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {isSubmitting ? "Authenticating..." : "Authenticate with Biometrics"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {loginMethod === 'otp' && (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiMail className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setValue('email', e.target.value)}
                        className="pl-10 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {!showOtpInput ? (
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        disabled={isSubmitting || !email}
                        onClick={handleSendOtp}
                        className="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {isSubmitting ? "Sending..." : "Send Verification Code"}
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-600 text-center">
                        Enter the 6-digit code sent to your email
                      </p>
                      <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            className="w-10 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setOtp(['', '', '', '', '', '']);
                            handleSendOtp();
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          Resend code
                        </button>
                        <p className="text-xs text-gray-500">
                          Code valid for 10 minutes
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        disabled={isSubmitting || otp.join('').length !== 6}
                        onClick={handleVerifyOtp}
                        className="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {isSubmitting ? "Verifying..." : "Verify Code"}
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
