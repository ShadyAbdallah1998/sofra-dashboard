import { User } from './users.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = User;

export interface ChangeEmailRequest {
  email: string;
  confirmEmail: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SendVerifyEmailRequest {
  email: string;
}

export interface SendResetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}
