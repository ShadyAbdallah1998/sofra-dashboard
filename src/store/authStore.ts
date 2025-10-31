import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { reportError } from '@/lib/utils';
import type { User } from '@/types/users.types';
import type { LoginRequest, ChangePasswordRequest } from '@/types/auth.types';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: Error | undefined;
  hasHydrated: boolean;
};

type AuthActions = {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  setHasHydrated: (state: boolean) => void;
  clearError: () => void;
  reset: () => void;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: undefined,
  hasHydrated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await authService.login(credentials);
          set({ user, isLoading: false });
        } catch (err) {
          const error = err as Error;
          reportError(error, { componentStack: 'AuthStore.login' });
          set({ error, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: undefined });
        try {
          await authService.logout();
        } catch (err) {
          const error = err as Error;
          reportError(error, { componentStack: 'AuthStore.logout' });
          // Continue with logout even if API call fails
        } finally {
          // Always clear user data regardless of API response
          set({
            user: null,
            isLoading: false,
            error: undefined,
            hasHydrated: true
          });
        }
      },

      setUser: (user: User) => set({ user }),

      clearUser: () => set({ user: null }),

      changePassword: async (data: ChangePasswordRequest) => {
        set({ isLoading: true, error: undefined });
        try {
          await authService.changePassword(data);
          set({ isLoading: false });
        } catch (err) {
          const error = err as Error;
          reportError(error, { componentStack: 'AuthStore.changePassword' });
          set({ error, isLoading: false });
          throw error;
        }
      },

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      clearError: () => set({ error: undefined }),

      reset: () => set({ ...initialState, hasHydrated: true }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, hasHydrated: state.hasHydrated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
