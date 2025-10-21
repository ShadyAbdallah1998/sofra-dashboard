'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/authService';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const tValidation = useTranslations('validation');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const emailValue = watch('email');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.sendResetPasswordEmail(data);
      setEmailSent(true);
    } catch (error) {
      setError('root', {
        message: (error as { message?: string }).message || 'Failed to send reset email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <h1 className="fz-25 font-bold text-foreground">Reset Password</h1>
          <p className="fz-14 text-muted-foreground mt-2">Enter your email to receive reset instructions</p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="fz-14 text-destructive">{errors.root.message}</p>
              </div>
            )}

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="fz-14 text-foreground">
                Remember to check your spam folder if you don&apos;t see the email in your inbox
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block fz-14 font-medium text-foreground mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="username@example.com"
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground fz-14"
              />
              {errors.email && (
                <p className="mt-1 fz-12 text-destructive">{tValidation(errors.email.message?.replace('validation.', '') || 'invalidInput')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors fz-16 font-medium"
            >
              {isLoading ? 'Sending...' : 'Send Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full text-foreground py-2 px-4 hover:text-muted-foreground transition-colors flex items-center justify-center gap-2 fz-16"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
              <p className="fz-14 text-foreground font-medium">Reset email sent!</p>
              <p className="fz-14 text-muted-foreground mt-1">
                Check your inbox at <strong>{emailValue}</strong>
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="fz-14 font-medium text-foreground">What&apos;s next?</p>
              <ul className="fz-14 text-muted-foreground space-y-1 list-disc list-inside">
                <li>Check your email inbox</li>
                <li>Click the reset link we sent</li>
                <li>Create your new password</li>
              </ul>
            </div>

            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-accent py-2 px-4 hover:text-accent/80 transition-colors fz-16"
            >
              Didn&apos;t receive email? Try again
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4 fz-14 text-muted-foreground">
          <button className="hover:text-foreground">English</button>
          <span>•</span>
          <button className="hover:text-foreground">Light</button>
          <span>•</span>
          <button className="hover:text-foreground">Help</button>
        </div>
      </div>
    </div>
  );
}
