// src/utils/validation.ts
import { z } from 'zod';

// Common password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

// Registration schema
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(10, 'Password must be at least 10 characters long')
    .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Password reset request schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Password reset schema
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(10, 'Password must be at least 10 characters long')
    .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(10, 'Password must be at least 10 characters long')
    .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Email verification schema
export const verifyEmailSchema = z.object({
  token: z.string(),
});

// Profile update schema
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
});

// Type definitions for schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
