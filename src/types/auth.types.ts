export type UserRole = 'admin' | 'moderator' | 'staff';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  fullname: string;
  joinedAt: string;
  lastUpdatedAt: string;
  firstname?: string;
  lastname?: string;
  picture?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

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
