import { getApiCore } from './index';
import type {
  AddUserRoleRequest,
  GetRoleUsersResponse,
  UpdateUserRoleRequest,
  GetRolesResponse,
} from '@/types/roles.types';

export const rolesService = {
  /**
   * Get all available roles
   */
  async getRoles() {
    const api = getApiCore();
    const response = await api.get<GetRolesResponse>('/roles');
    return response.data;
  },

  /**
   * Get paginated list of users with their roles
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  async getRoleUsers(page: number = 1, limit: number = 10) {
    const api = getApiCore();
    const response = await api.get<GetRoleUsersResponse>(
      '/roles-management/users',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Add a new user with a role
   * @param data - User email, fullname, and role ID
   */
  async addUserRole(data: AddUserRoleRequest) {
    const api = getApiCore();
    const response = await api.post('/roles-management/users', data);
    return response.data;
  },

  /**
   * Update a user's role
   * @param id - User ID
   * @param data - New role ID
   */
  async updateUserRole(id: string, data: UpdateUserRoleRequest) {
    const api = getApiCore();
    const response = await api.patch(`/roles-management/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user role
   * @param id - User ID to remove
   */
  async deleteUserRole(id: string) {
    const api = getApiCore();
    const response = await api.delete(`/roles-management/users/${id}`);
    return response.data;
  },
};
