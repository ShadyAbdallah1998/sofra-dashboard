import { create, StoreApi } from 'zustand';
import { reportError } from '@/lib/utils';

// Example types - replace with actual dashboard types
type DashboardStats = {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    orders: number;
};

type DashboardState = {
    stats: DashboardStats | null;
    isLoading: boolean;
    error: Error | undefined;
    lastUpdated: Date | null;
};

type DashboardActions = {
    getStats: () => Promise<void>;
    refreshStats: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
};

const initialState: DashboardState = {
    stats: null,
    isLoading: false,
    error: undefined,
    lastUpdated: null,
};

export const useDashboardStore = create<DashboardState & DashboardActions>(
    (
        set: StoreApi<DashboardState & DashboardActions>['setState']
    ) => ({
        ...initialState,

        getStats: async () => {
            set({ isLoading: true, error: undefined });
            try {
                // Replace with actual API call
                // const stats = await dashboardService.getStats();

                // Mock data for demonstration
                const stats: DashboardStats = {
                    totalUsers: 1250,
                    activeUsers: 890,
                    revenue: 45000,
                    orders: 320,
                };

                set({
                    stats,
                    isLoading: false,
                    lastUpdated: new Date(),
                });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'DashboardStore.getStats' });
                set({ error, isLoading: false });
                throw error;
            }
        },

        refreshStats: async () => {
            // Refresh without showing loading state
            try {
                const stats: DashboardStats = {
                    totalUsers: 1250,
                    activeUsers: 890,
                    revenue: 45000,
                    orders: 320,
                };

                set({
                    stats,
                    lastUpdated: new Date(),
                });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'DashboardStore.refreshStats' });
            }
        },

        clearError: () => set({ error: undefined }),

        reset: () => set(initialState),
    })
);
