"use client";

import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<ButtonProps, "asChild"> {
  icon?: React.ReactNode;
  gradient?: boolean;
  loading?: boolean;
  spinnerIcon?: React.ReactNode;
}

const MotionButton = motion(Button);

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  icon,
  gradient = false,
  loading = false,
  spinnerIcon,
  ...props
}: AnimatedButtonProps) {
  const gradientStyles = gradient
    ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/20 border-0 text-white"
    : "";

  const defaultSpinner = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <MotionButton
      className={cn(gradientStyles, className)}
      variant={variant}
      size={size}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          {spinnerIcon || defaultSpinner}
          {children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </MotionButton>
  );
}