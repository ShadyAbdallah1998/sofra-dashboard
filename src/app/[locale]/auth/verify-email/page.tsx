'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { verifyEmailSchema, type VerifyEmailFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/authService';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  const tValidation = useTranslations('validation');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true);
    try {
      await authService.sendVerifyEmail(data);
      setEmailSent(true);
    } catch (error) {
      setError('root', {
        message: (error as { message?: string }).message || 'Failed to send verification email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="fz-25 font-bold text-foreground">Email Verification Required</h1>
          <p className="fz-14 text-muted-foreground mt-2">Your email address isn&apos;t verified yet</p>
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
                We&apos;ve sent a verification email to <strong>test@example.com</strong>
              </p>
              <p className="fz-14 text-muted-foreground mt-2">
                Please check your inbox and click the verification link to activate your account.
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
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 fz-16 font-medium"
            >
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Resend Verification Email
                </>
              )}
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
              <p className="fz-14 text-foreground font-medium">Email sent successfully!</p>
              <p className="fz-14 text-muted-foreground mt-1">Please check your inbox.</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <p className="fz-14 text-foreground mb-2">
                <strong>Resend available in:</strong>
              </p>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="fz-14 text-muted-foreground">2:00 minutes</span>
              </div>
            </div>

            <button
              onClick={handleResend}
              className="w-full text-accent py-2 px-4 hover:text-accent/80 transition-colors fz-16"
            >
              Send to different email
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
