import { z } from 'zod';

// Translation keys for validation errors
export const loginSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
  password: z.string().min(6, 'validation.passwordMin8'),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
});

export const resetPasswordConfirmSchema = z.object({
  newPassword: z.string().min(8, 'validation.passwordMin8'),
  confirmPassword: z.string().min(8, 'validation.passwordMin8'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "validation.passwordsNoMatch",
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'validation.currentPasswordRequired'),
  newPassword: z.string().min(8, 'validation.passwordMin8'),
  confirmPassword: z.string().min(8, 'validation.passwordMin8'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "validation.passwordsNoMatch",
  path: ['confirmPassword'],
});

export const changeEmailSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
  confirmEmail: z.string().email('validation.invalidEmail'),
  password: z.string().min(1, 'validation.passwordRequired'),
}).refine((data) => data.email === data.confirmEmail, {
  message: "validation.emailsNoMatch",
  path: ['confirmEmail'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordConfirmFormData = z.infer<typeof resetPasswordConfirmSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;
