import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  // API Error with structured response
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string | string[]; error?: string } } };

    // Handle array of messages from validation errors
    if (Array.isArray(apiError.response?.data?.message)) {
      return apiError.response.data.message.join(', ');
    }

    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  // Unknown error
  return 'An unexpected error occurred';
}

/**
 * Handle error with flexible options
 * @param error - The error to handle
 * @param options - Configuration options
 * @returns Error message string
 */
export function handleError(
  error: unknown,
  options?: {
    showToast?: boolean;
    returnError?: boolean;
  }
): string {
  const { showToast = true, returnError = true } = options || {};
  const errorMessage = getErrorMessage(error);

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorMessage, error);
  }

  // Show toast if enabled
  if (showToast) {
    toast.error(errorMessage, {
      duration: 5000,
      position: 'top-right',
    });
  }

  // Return message if needed
  return returnError ? errorMessage : '';
}

/**
 * Handle success with toast notification
 */
export function handleSuccess(message: string): void {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
}
