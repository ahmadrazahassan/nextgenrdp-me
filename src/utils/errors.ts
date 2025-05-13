// src/utils/errors.ts
import { NextApiResponse } from 'next';
import { ZodError } from 'zod';

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  SERVER = 'SERVER_ERROR',
  DATABASE = 'DATABASE_ERROR',
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    details?: any;
  };
}

// Success response interface
interface SuccessResponse<T> {
  success: true;
  data: T;
}

// API response type
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Handle validation errors (Zod)
export function handleValidationError(res: NextApiResponse, error: ZodError) {
  const formattedErrors = error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  return res.status(400).json({
    success: false,
    error: {
      type: ErrorType.VALIDATION,
      message: 'Validation failed',
      details: formattedErrors,
    },
  });
}

// Handle authentication errors
export function handleAuthError(
  res: NextApiResponse, 
  message: string = 'Authentication failed'
) {
  return res.status(401).json({
    success: false,
    error: {
      type: ErrorType.AUTHENTICATION,
      message,
    },
  });
}

// Handle authorization errors
export function handleForbiddenError(
  res: NextApiResponse, 
  message: string = 'You do not have permission to perform this action'
) {
  return res.status(403).json({
    success: false,
    error: {
      type: ErrorType.AUTHORIZATION,
      message,
    },
  });
}

// Handle not found errors
export function handleNotFoundError(
  res: NextApiResponse, 
  message: string = 'Resource not found'
) {
  return res.status(404).json({
    success: false,
    error: {
      type: ErrorType.NOT_FOUND,
      message,
    },
  });
}

// Handle rate limit errors
export function handleRateLimitError(
  res: NextApiResponse, 
  message: string = 'Too many requests, please try again later'
) {
  return res.status(429).json({
    success: false,
    error: {
      type: ErrorType.RATE_LIMIT,
      message,
    },
  });
}

// Handle server errors
export function handleServerError(
  res: NextApiResponse, 
  error: any,
  message: string = 'Internal server error'
) {
  // Log the error for debugging (but don't expose details to client)
  console.error('Server error:', error);
  
  return res.status(500).json({
    success: false,
    error: {
      type: ErrorType.SERVER,
      message,
    },
  });
}

// Handle database errors
export function handleDatabaseError(
  res: NextApiResponse, 
  error: any,
  message: string = 'Database operation failed'
) {
  // Log the error for debugging (but don't expose details to client)
  console.error('Database error:', error);
  
  return res.status(500).json({
    success: false,
    error: {
      type: ErrorType.DATABASE,
      message,
    },
  });
}

// Send success response
export function sendSuccessResponse<T>(
  res: NextApiResponse,
  data: T,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}
