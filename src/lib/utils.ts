import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function reportError(error: Error, context?: { componentStack?: string }) {
  // Log error with context
  console.error('Error:', error.message, context);

  // You can integrate with error tracking services like Sentry here
  // Example: Sentry.captureException(error, { contexts: { react: context } });
}
