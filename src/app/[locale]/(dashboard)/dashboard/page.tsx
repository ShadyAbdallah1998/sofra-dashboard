'use client';

import { useEffect } from 'react';
import { useAuthStore, useDashboardStore, useCategoriesStore, useProductsStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/hooks/useLocale';
import { Package, FolderOpen, TrendingUp, Users, DollarSign, ShoppingCart, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const tSidebar = useTranslations('Sidebar');
  const { isRTL } = useLocale();

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
        <h1 className="fz-25 font-bold text-foreground">{t('title')}</h1>
        <p className="fz-14 text-muted-foreground">
          {t('welcomeBack', { name: user.fullname })}
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
                <h3 className="fz-18 font-semibold text-foreground">{tSidebar('categories')}</h3>
                <p className="fz-12 text-muted-foreground">
                  {t('categoriesAvailable', { count: categories?.length || 0 })}
                </p>
              </div>
            </div>
            <ArrowRight className={`h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all ${isRTL ? 'rotate-180' : ''}`} />
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
                <h3 className="fz-18 font-semibold text-foreground">{tSidebar('products')}</h3>
                <p className="fz-12 text-muted-foreground">
                  {t('productsInMenu', { count: products?.length || 0 })}
                </p>
              </div>
            </div>
            <ArrowRight className={`h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all ${isRTL ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="fz-20 font-semibold text-foreground">{t('statistics')}</h2>
            {lastUpdated && (
              <p className="fz-12 text-muted-foreground">
                {t('lastUpdated', { time: new Date(lastUpdated).toLocaleTimeString() })}
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
                  <p className="fz-12 text-muted-foreground font-medium">{t('totalUsers')}</p>
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
                  <p className="fz-12 text-muted-foreground font-medium">{t('activeUsers')}</p>
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
                  <p className="fz-12 text-muted-foreground font-medium">{t('revenue')}</p>
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
                  <p className="fz-12 text-muted-foreground font-medium">{t('orders')}</p>
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
    </div>
  );
}
