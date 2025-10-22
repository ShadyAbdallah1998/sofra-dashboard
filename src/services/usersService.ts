import { getApiCore } from './index';
import { USERS_ENDPOINTS } from '@/constants/users';
import type {
  GetUserResponse,
  UpdateUserRequest,
} from '@/types/users.types';

export const usersService = {
  async getUser(id: string): Promise<GetUserResponse> {
    const api = getApiCore();
    const response = await api.get<GetUserResponse>(USERS_ENDPOINTS.GET_USER(id));
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<void> {
    const api = getApiCore();
    await api.patch(USERS_ENDPOINTS.UPDATE_USER(id), data);
  },

  async deleteUser(id: string): Promise<void> {
    const api = getApiCore();
    await api.delete(USERS_ENDPOINTS.DELETE_USER(id));
  },
};
