'use client';

import { useEffect } from 'react';
import { useAuthStore, useDashboardStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();

  // Auth store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggingOut = useAuthStore((state) => state.isLoading);

  // Dashboard store
  const stats = useDashboardStore((state) => state.stats);
  const isLoadingStats = useDashboardStore((state) => state.isLoading);
  const lastUpdated = useDashboardStore((state) => state.lastUpdated);
  const getStats = useDashboardStore((state) => state.getStats);
  const refreshStats = useDashboardStore((state) => state.refreshStats);

  // Fetch stats on mount
  useEffect(() => {
    getStats();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshStats();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      useDashboardStore.getState().reset();
    };
  }, [getStats, refreshStats]);

  const handleLogout = async () => {
    try {
      await logout();
      // Clear dashboard store
      useDashboardStore.getState().reset();
      // Navigate to login (i18n-aware)
      router.push('/auth/login');
      // Fallback: force reload to login page
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user anyway
      useAuthStore.getState().clearUser();
      useDashboardStore.getState().reset();
      // Force navigation
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="fz-25 font-bold text-foreground">Dashboard</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/categories')}
              >
                Categories
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/products')}
              >
                Products
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="fz-16"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>

          {user && (
            <div className="space-y-6">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <h2 className="fz-16 font-semibold text-foreground mb-3">User Information</h2>
                <div className="space-y-2 fz-14">
                  <p><span className="font-medium">ID:</span> {user.id}</p>
                  <p><span className="font-medium">Name:</span> {user.fullname}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Email Verified:</span> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
                  {user.role && <p><span className="font-medium">Role:</span> {user.role}</p>}
                  {user.firstname && <p><span className="font-medium">First Name:</span> {user.firstname}</p>}
                  {user.lastname && <p><span className="font-medium">Last Name:</span> {user.lastname}</p>}
                  <p><span className="font-medium">Joined:</span> {new Date(user.joinedAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(user.lastUpdatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Dashboard Stats */}
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="fz-16 font-semibold text-foreground">Dashboard Statistics</h2>
                  {lastUpdated && (
                    <span className="fz-12 text-muted-foreground">
                      Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {isLoadingStats && !stats ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="fz-12 text-muted-foreground mb-1">Total Users</p>
                      <p className="fz-20 font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="fz-12 text-muted-foreground mb-1">Active Users</p>
                      <p className="fz-20 font-bold text-chart-1">{stats.activeUsers.toLocaleString()}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="fz-12 text-muted-foreground mb-1">Revenue</p>
                      <p className="fz-20 font-bold text-chart-2">${stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="fz-12 text-muted-foreground mb-1">Orders</p>
                      <p className="fz-20 font-bold text-chart-3">{stats.orders.toLocaleString()}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
