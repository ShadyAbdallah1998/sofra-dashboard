'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Check if it's an auth page (login, forgot-password, verify-email, reset-password, etc.)
const isAuthPage = (pathname: string) => pathname.includes('/auth/');

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!hasHydrated) return;

    const isAuth = isAuthPage(pathname);

    // Allow verify-email and reset-password token pages for both logged-in and logged-out users
    const isVerifyEmailPage = pathname.includes('/auth/verify-email/') && pathname.split('/').length > 4;
    const isResetPasswordPage = pathname.includes('/auth/reset-password/') && pathname.split('/').length > 4;

    // Skip redirect logic for token-based auth pages
    if (isVerifyEmailPage || isResetPasswordPage) {
      return;
    }

    // If user is logged in and on auth page, redirect to dashboard
    if (user && isAuth) {
      router.replace(pathname.replace(/\/auth\/[^/]+/, '/dashboard'));
    }

    // If user is NOT logged in and NOT on auth page, redirect to login
    if (!user && !isAuth) {
      router.replace(pathname.replace(/\/[^/]+$/, '/auth/login'));
    }
  }, [user, hasHydrated, pathname, router]);

  // Show loading ONLY while waiting for hydration
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
