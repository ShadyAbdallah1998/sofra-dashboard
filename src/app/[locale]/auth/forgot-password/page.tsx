'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/auth/authService';

export default function ForgotPasswordPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-sm text-gray-600 mt-2">Enter your email to receive reset instructions</p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Remember to check your spam folder if you don&apos;t see the email in your inbox
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="username@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full text-gray-700 py-2 px-4 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Reset email sent!</p>
              <p className="text-sm text-green-600 mt-1">
                Check your inbox at <strong>{emailValue}</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-900">What&apos;s next?</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Check your email inbox</li>
                <li>Click the reset link we sent</li>
                <li>Create your new password</li>
              </ul>
            </div>

            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-blue-600 py-2 px-4 hover:text-blue-700 transition-colors"
            >
              Didn&apos;t receive email? Try again
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
          <button className="hover:text-gray-900">English</button>
          <span>•</span>
          <button className="hover:text-gray-900">Light</button>
          <span>•</span>
          <button className="hover:text-gray-900">Help</button>
        </div>
      </div>
    </div>
  );
}
