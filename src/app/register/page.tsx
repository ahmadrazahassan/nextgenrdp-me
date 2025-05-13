"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSession } from "@/components/providers/SessionProvider";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiGithub, FiTwitter } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { HiOutlineDocumentCheck } from "react-icons/hi2";

// Registration form schema with validation
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const password = watch("password");
  const fullName = watch("fullName");
  const email = watch("email");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }

    let strength = 0;
    let feedback = "";

    // Length check
    if (password.length >= 10) {
      strength += 1;
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1;
    }

    // Number check
    if (/\d/.test(password)) {
      strength += 1;
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
      strength += 1;
    }

    // Set feedback based on strength
    if (strength === 0) {
      feedback = "Very weak";
    } else if (strength === 1) {
      feedback = "Weak";
    } else if (strength === 2) {
      feedback = "Fair";
    } else if (strength === 3) {
      feedback = "Good";
    } else if (strength === 4) {
      feedback = "Strong";
    } else {
      feedback = "Very strong";
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ["fullName", "email"] 
      : ["password", "confirmPassword", "agreeToTerms"];
    
    const result = await trigger(fieldsToValidate as any);
    
    if (result) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Creating your account...");
    
    try {
      // Log registration attempt for debugging
      console.log("Attempting registration with:", { 
        fullName: data.fullName, 
        email: data.email 
      });
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });
      
      // Log response status for debugging
      console.log("Registration response status:", response.status);
      
      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
        console.log("Registration response data:", responseData);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw {
          status: response.status,
          message: "Could not parse server response",
          originalError: parseError
        };
      }
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData?.error || "Registration failed",
          data: responseData,
        };
      }
      
      toast.dismiss(loadingToastId);
      toast.success("Account created successfully!");
      
      // Show success animation
      setCurrentStep(3);
      
      // Login user after successful registration if user data is available
      if (responseData.user) {
        setTimeout(() => {
          login(responseData.user);
          // Redirect to dashboard or home page
          router.push("/dashboard");
        }, 2000);
      } else {
        // Redirect to login page after success animation
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 2000);
      }
      
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      
      // Safely log error information with type checking
      console.log("Error type:", typeof error);
      console.log("Error details:", error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : "Empty error object");
      
      // Handle different error formats with fallbacks for empty objects
      let errorMessage = "Registration failed. Please try again later.";
      
      if (error) {
        if (error.status === 409) {
          // Email already exists
          errorMessage = "This email is already registered";
          setCurrentStep(1); // Go back to email step
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

  const handleSocialSignup = (provider: string) => {
    toast.loading(`Signing up with ${provider}...`);
    // In a real implementation, this would redirect to the OAuth provider
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${provider} signup coming soon!`);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
              <p className="text-gray-600">Join our community today</p>
            </div>
            
            {/* Progress indicator */}
            {currentStep < 3 && (
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      1
                    </div>
                    <div className={`ml-2 text-sm ${
                      currentStep >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'
                    }`}>
                      Account
                    </div>
                  </div>
                  <div className={`flex-grow mx-4 h-1 ${
                    currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}></div>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                    <div className={`ml-2 text-sm ${
                      currentStep >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'
                    }`}>
                      Security
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiUser className="text-gray-500" />
                        </div>
                        <input
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder="Full name"
                          className={`pl-10 block w-full appearance-none rounded-lg border px-3 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                            errors.fullName ? "border-red-300" : "border-gray-300"
                          }`}
                          {...register("fullName")}
                        />
                      </div>
                      {errors.fullName && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.fullName.message}
                        </motion.p>
                      )}
                    </div>

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

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                          Already have an account?
                        </Link>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        disabled={!fullName || !email || !!errors.fullName || !!errors.email}
                        className="inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Continue
                      </motion.button>
                    </div>
                    
                    <div className="relative flex items-center justify-center mt-6">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="flex-shrink mx-4 text-gray-600 text-sm">or sign up with</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialSignup('Google')}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <FcGoogle className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialSignup('Facebook')}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <FaFacebook className="w-6 h-6 text-blue-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialSignup('GitHub')}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <FiGithub className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialSignup('Twitter')}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <FiTwitter className="w-6 h-6 text-blue-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {currentStep === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create password"
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
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-gray-700">Password strength:</div>
                          <div className={`text-xs font-medium ${
                            passwordStrength < 3 ? 'text-red-500' : 
                            passwordStrength < 5 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {passwordFeedback}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                            className={`h-full ${
                              passwordStrength < 3 ? 'bg-red-500' : 
                              passwordStrength < 5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          ></motion.div>
                        </div>
                        <div className="grid grid-cols-4 gap-1 mt-2">
                          <div className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                            • Uppercase
                          </div>
                          <div className={`text-xs ${/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                            • Lowercase
                          </div>
                          <div className={`text-xs ${/\d/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                            • Number
                          </div>
                          <div className={`text-xs ${/[@$!%*?&]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                            • Symbol
                          </div>
                        </div>
                      </div>
                    )}
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

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        className={`pl-10 block w-full appearance-none rounded-lg border px-3 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                          errors.confirmPassword ? "border-red-300" : "border-gray-300"
                        }`}
                        {...register("confirmPassword")}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        {...register("agreeToTerms")}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-700">
                        I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                      </label>
                      {errors.agreeToTerms && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.agreeToTerms.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={prevStep}
                      className="inline-flex justify-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </motion.button>
                  </div>
                </motion.form>
              )}
              
              {currentStep === 3 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
                  >
                    <HiOutlineDocumentCheck className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                  <p className="text-gray-600 text-center mb-6">
                    Your account has been successfully created. You'll be redirected shortly.
                  </p>
                  <div className="w-full max-w-xs">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-green-500"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
