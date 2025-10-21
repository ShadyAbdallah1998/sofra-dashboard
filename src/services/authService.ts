import { getApiCore } from './index';
import { AUTH_ENDPOINTS } from '@/constants/auth';
import type {
  LoginRequest,
  LoginResponse,
  ChangeEmailRequest,
  ChangePasswordRequest,
  SendVerifyEmailRequest,
  SendResetPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth.types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const api = getApiCore();
    const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);
    return response.data;
  },

  async logout(): Promise<void> {
    const api = getApiCore();
    await api.delete(AUTH_ENDPOINTS.LOGOUT);
  },

  async changeEmail(data: ChangeEmailRequest): Promise<void> {
    const api = getApiCore();
    await api.post(AUTH_ENDPOINTS.CHANGE_EMAIL, data);
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const api = getApiCore();
    await api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  async sendVerifyEmail(data: SendVerifyEmailRequest): Promise<void> {
    const api = getApiCore();
    await api.post(AUTH_ENDPOINTS.SEND_VERIFY_EMAIL, data);
  },

  async verifyEmail(token: string): Promise<void> {
    const api = getApiCore();
    await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL(token));
  },

  async sendResetPasswordEmail(data: SendResetPasswordRequest): Promise<void> {
    const api = getApiCore();
    await api.post(AUTH_ENDPOINTS.SEND_RESET_PASSWORD_EMAIL, data);
  },

  async resetPassword(token: string, data: ResetPasswordRequest): Promise<void> {
    const api = getApiCore();
    await api.post(AUTH_ENDPOINTS.RESET_PASSWORD(token), data);
  },
};
