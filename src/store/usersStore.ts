import { create, StoreApi } from 'zustand';
import { usersService } from '@/services/usersService';
import { reportError } from '@/lib/utils';
import type { User, UpdateUserRequest } from '@/types/users.types';

type UsersState = {
    currentUser: User | null;
    isLoading: boolean;
    error: Error | undefined;
};

type UsersActions = {
    getUser: (id: string) => Promise<void>;
    updateUser: (id: string, data: UpdateUserRequest) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
};

const initialState: UsersState = {
    currentUser: null,
    isLoading: false,
    error: undefined,
};

export const useUsersStore = create<UsersState & UsersActions>(
    (
        set: StoreApi<UsersState & UsersActions>['setState'],
        get: StoreApi<UsersState & UsersActions>['getState']
    ) => ({
        ...initialState,

        getUser: async (id: string) => {
            set({ isLoading: true, error: undefined });
            try {
                const user = await usersService.getUser(id);
                set({ currentUser: user, isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'UsersStore.getUser' });
                set({ error, isLoading: false });
                throw error;
            }
        },

        updateUser: async (id: string, data: UpdateUserRequest) => {
            set({ isLoading: true, error: undefined });
            try {
                await usersService.updateUser(id, data);
                // Update current user if it's the same user
                const currentUser = get().currentUser;
                if (currentUser && currentUser.id === id) {
                    set({ currentUser: { ...currentUser, ...data }, isLoading: false });
                } else {
                    set({ isLoading: false });
                }
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'UsersStore.updateUser' });
                set({ error, isLoading: false });
                throw error;
            }
        },

        deleteUser: async (id: string) => {
            set({ isLoading: true, error: undefined });
            try {
                await usersService.deleteUser(id);
                set({ currentUser: null, isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'UsersStore.deleteUser' });
                set({ error, isLoading: false });
                throw error;
            }
        },

        clearError: () => set({ error: undefined }),

        reset: () => set(initialState),
    })
);
