import { create, StoreApi } from 'zustand';
import { rolesService } from '@/services/rolesService';
import { handleError } from '@/lib/utils';
import type {
  RoleUser,
  AddUserRoleRequest,
  UpdateUserRoleRequest,
  GetRoleUsersResponse,
  Role,
} from '@/types/roles.types';

type RolesState = {
  roleUsers: RoleUser[];
  currentUser: RoleUser | null;
  pagination: GetRoleUsersResponse['metadata'] | null;
  roles: Role[];
  isLoading: boolean;
  isLoadingRoles: boolean;
  error: string | null;
  currentPage: number;
  limit: number;
};

type RolesActions = {
  getRoles: () => Promise<{ success: boolean; error?: string }>;
  getRoleUsers: (page?: number, limit?: number) => Promise<{ success: boolean; error?: string }>;
  addUserRole: (data: AddUserRoleRequest) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (id: string, data: UpdateUserRoleRequest) => Promise<{ success: boolean; error?: string }>;
  deleteUserRole: (id: string) => Promise<{ success: boolean; error?: string }>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
  reset: () => void;
};

const initialState: RolesState = {
  roleUsers: [],
  currentUser: null,
  pagination: null,
  roles: [],
  isLoading: false,
  isLoadingRoles: false,
  error: null,
  currentPage: 1,
  limit: 10,
};

export const useRolesStore = create<RolesState & RolesActions>(
  (
    set: StoreApi<RolesState & RolesActions>['setState'],
    get: StoreApi<RolesState & RolesActions>['getState']
  ) => ({
    ...initialState,

    getRoles: async () => {
      set({ isLoadingRoles: true, error: null });
      try {
        const roles = await rolesService.getRoles();
        set({
          roles: roles,
          isLoadingRoles: false,
        });
        return { success: true };
      } catch (error) {
        const errorMessage = handleError(error, {
          showToast: false,
          returnError: true,
        });
        set({ error: errorMessage, isLoadingRoles: false });
        return { success: false, error: errorMessage };
      }
    },

    getRoleUsers: async (page?: number, limit?: number) => {
      const currentPage = page ?? get().currentPage;
      const currentLimit = limit ?? get().limit;

      set({ isLoading: true, error: null });
      try {
        const response = await rolesService.getRoleUsers(currentPage, currentLimit);
        set({
          roleUsers: response.data,
          pagination: response.metadata,
          currentPage,
          limit: currentLimit,
          isLoading: false,
        });
        return { success: true };
      } catch (error) {
        const errorMessage = handleError(error, {
          showToast: false,
          returnError: true,
        });
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

    addUserRole: async (data: AddUserRoleRequest) => {
      set({ isLoading: true, error: null });
      try {
        await rolesService.addUserRole(data);
        // Refresh the list after adding
        await get().getRoleUsers(get().currentPage, get().limit);
        return { success: true };
      } catch (error) {
        const errorMessage = handleError(error, {
          showToast: true,
          returnError: true,
        });
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

    updateUserRole: async (id: string, data: UpdateUserRoleRequest) => {
      set({ isLoading: true, error: null });
      try {
        await rolesService.updateUserRole(id, data);
        // Refresh the list after updating
        await get().getRoleUsers(get().currentPage, get().limit);
        return { success: true };
      } catch (error) {
        const errorMessage = handleError(error, {
          showToast: true,
          returnError: true,
        });
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

    deleteUserRole: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await rolesService.deleteUserRole(id);
        // Refresh the list after deletion
        await get().getRoleUsers(get().currentPage, get().limit);
        return { success: true };
      } catch (error) {
        const errorMessage = handleError(error, {
          showToast: true,
          returnError: true,
        });
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

    setPage: (page: number) => {
      set({ currentPage: page });
      get().getRoleUsers(page, get().limit);
    },

    setLimit: (limit: number) => {
      set({ limit, currentPage: 1 });
      get().getRoleUsers(1, limit);
    },

    clearError: () => set({ error: null }),

    reset: () => set(initialState),
  })
);
