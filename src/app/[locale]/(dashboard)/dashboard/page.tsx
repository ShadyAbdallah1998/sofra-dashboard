'use client';

import { useEffect } from 'react';
import { useAuthStore, useDashboardStore, useCategoriesStore, useProductsStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Package, FolderOpen, TrendingUp, Users, DollarSign, ShoppingCart, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const stats = useDashboardStore((state) => state.stats);
  const isLoadingStats = useDashboardStore((state) => state.isLoading);
  const lastUpdated = useDashboardStore((state) => state.lastUpdated);
  const getStats = useDashboardStore((state) => state.getStats);
  const refreshStats = useDashboardStore((state) => state.refreshStats);

  const categories = useCategoriesStore((state) => state.categories);
  const getCategories = useCategoriesStore((state) => state.getCategories);

  const products = useProductsStore((state) => state.products);
  const getProducts = useProductsStore((state) => state.getProducts);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    getStats();
    getCategories({ limit: 5 });
    getProducts({ limit: 5 });

    const interval = setInterval(() => {
      refreshStats();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      useDashboardStore.getState().reset();
    };
  }, [user, getStats, refreshStats, getCategories, getProducts, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="fz-25 font-bold text-foreground">Dashboard</h1>
        <p className="fz-14 text-muted-foreground">
          Welcome back, {user.fullname}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => router.push('/categories')}
          className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FolderOpen className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="fz-18 font-semibold text-foreground">Categories</h3>
                <p className="fz-12 text-muted-foreground">
                  {categories?.length || 0} categories available
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        <div
          onClick={() => router.push('/products')}
          className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
                <Package className="h-7 w-7 text-chart-2" />
              </div>
              <div className="space-y-1">
                <h3 className="fz-18 font-semibold text-foreground">Products</h3>
                <p className="fz-12 text-muted-foreground">
                  {products?.length || 0} products in menu
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="fz-20 font-semibold text-foreground">Statistics</h2>
            {lastUpdated && (
              <p className="fz-12 text-muted-foreground">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>

          {isLoadingStats && !stats ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="fz-12 text-muted-foreground font-medium">Total Users</p>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-1/10">
                    <Users className="h-5 w-5 text-chart-1" />
                  </div>
                </div>
                <p className="fz-25 font-bold text-foreground">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>

              <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="fz-12 text-muted-foreground font-medium">Active Users</p>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-2/10">
                    <TrendingUp className="h-5 w-5 text-chart-2" />
                  </div>
                </div>
                <p className="fz-25 font-bold text-chart-2">
                  {stats.activeUsers.toLocaleString()}
                </p>
              </div>

              <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="fz-12 text-muted-foreground font-medium">Revenue</p>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-3/10">
                    <DollarSign className="h-5 w-5 text-chart-3" />
                  </div>
                </div>
                <p className="fz-25 font-bold text-chart-3">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>

              <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="fz-12 text-muted-foreground font-medium">Orders</p>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-4/10">
                    <ShoppingCart className="h-5 w-5 text-chart-4" />
                  </div>
                </div>
                <p className="fz-25 font-bold text-chart-4">
                  {stats.orders.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Info */}
      <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="fz-20 font-semibold text-foreground">Account Information</h2>
          <p className="fz-12 text-muted-foreground">Your account details and status</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="fz-12 text-muted-foreground font-medium">Email Address</p>
            <p className="fz-14 font-semibold text-foreground">{user.email}</p>
          </div>
          <div className="space-y-2">
            <p className="fz-12 text-muted-foreground font-medium">Email Status</p>
            <p className="fz-14 font-semibold text-foreground">
              {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
            </p>
          </div>
          {user.role && (
            <div className="space-y-2">
              <p className="fz-12 text-muted-foreground font-medium">Role</p>
              <p className="fz-14 font-semibold text-foreground capitalize">{user.role}</p>
            </div>
          )}
          <div className="space-y-2">
            <p className="fz-12 text-muted-foreground font-medium">Member Since</p>
            <p className="fz-14 font-semibold text-foreground">
              {new Date(user.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
