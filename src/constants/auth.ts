export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CHANGE_EMAIL: '/auth/change-email',
  CHANGE_PASSWORD: '/auth/change-password',
  SEND_VERIFY_EMAIL: '/auth/send-verify-email',
  VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
  SEND_RESET_PASSWORD_EMAIL: '/auth/send-reset-password-email',
  RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
} as const;
