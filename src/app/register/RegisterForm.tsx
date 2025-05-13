import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/components/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

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

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { login } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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

  // Calculate password strength
  useState(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 10) strength += 1;
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    // Number check
    if (/\d/.test(password)) strength += 1;
    // Special character check
    if (/[@$!%*?&]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Creating your account...");
    
    try {
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
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData?.error || "Registration failed");
      }
      
      toast.dismiss(loadingToastId);
      toast.success("Account created successfully!");
      
      // Login user after successful registration if user data is available
      if (responseData.user) {
        login(responseData.user);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        
        {/* Password strength indicator */}
        {password && (
          <div className="mt-2">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${passwordStrength <= 1 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 10 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          id="agreeToTerms"
          type="checkbox"
          className="h-4 w-4 text-green-600 border-gray-300 rounded"
          {...register("agreeToTerms")}
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
          I agree to the <a href="/terms" className="text-green-600 hover:text-green-500">Terms of Service</a> and <a href="/privacy" className="text-green-600 hover:text-green-500">Privacy Policy</a>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}