import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

/**
 * Standard error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
  code?: string;
  statusCode: number;
  timestamp: string;
  reference?: string; 
}

/**
 * Error types that can be handled by the API
 */
export type ApiErrorType = 
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'DATABASE_ERROR';

/**
 * Detailed error options
 */
interface ErrorOptions {
  details?: any;
  code?: string;
  reference?: string;
  originalError?: Error | unknown;
  log?: boolean;
}

/**
 * Error codes to HTTP status mapping
 */
const ERROR_STATUS_MAP: Record<ApiErrorType, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  DATABASE_ERROR: 500,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Creates and logs standardized API error responses
 * @param type Error type
 * @param message Error message
 * @param options Additional error options
 * @returns NextResponse with appropriate status and formatted error
 */
export function createApiError(
  type: ApiErrorType, 
  message: string, 
  options: ErrorOptions = {}
): NextResponse<ApiErrorResponse> {
  const {
    details,
    code,
    reference = `err_${Date.now().toString(36)}`,
    originalError,
    log = true
  } = options;
  
  const statusCode = ERROR_STATUS_MAP[type];
  
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    reference,
  };
  
  if (details) errorResponse.details = details;
  if (code) errorResponse.code = code;

  // Log error for server monitoring
  if (log) {
    const errorStack = originalError instanceof Error ? originalError.stack : undefined;
    
    console.error(`[API Error][${type}][${reference}] ${message}`, {
      statusCode,
      details,
      stack: errorStack,
    });
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Handles unknown errors and converts them to standardized API errors
 * @param error Any error caught in try/catch
 * @returns NextResponse with appropriate error details
 */
export function handleUnknownError(error: unknown): NextResponse {
  // Prisma specific errors
  if (isPrismaError(error)) {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'P2002': // Unique constraint violation
        return createApiError('CONFLICT', 'A record with this identifier already exists', { 
          originalError: error,
          code: 'UNIQUE_CONSTRAINT'
        });
      case 'P2025': // Not found
        return createApiError('NOT_FOUND', 'The requested resource was not found', { 
          originalError: error,
          code: 'RECORD_NOT_FOUND'
        });
      case 'P2003': // Foreign key constraint failure
        return createApiError('BAD_REQUEST', 'Invalid reference to a related record', { 
          originalError: error,
          code: 'FOREIGN_KEY_CONSTRAINT'
        });
      default:
        return createApiError('DATABASE_ERROR', 'A database error occurred', { 
          originalError: error,
          code: `DB_${errorCode}`
        });
    }
  }
  
  // Standard Error objects
  if (error instanceof Error) {
    return createApiError('INTERNAL_SERVER_ERROR', error.message, { 
      originalError: error
    });
  }
  
  // Unknown errors
  return createApiError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred', {
    details: error ? String(error) : undefined
  });
}

/**
 * Type guard for Prisma errors
 */
function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error && 
    typeof error.code === 'string' &&
    error.code.startsWith('P')
  );
}

/**
 * Utility to create a successful API response
 */
export function createApiSuccess<T>(data: T, statusCode = 200) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  }, { status: statusCode });
}

/**
 * Higher-order function to wrap API route handlers with standardized error handling
 */
export function withErrorHandling(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleUnknownError(error);
    }
  };
} 