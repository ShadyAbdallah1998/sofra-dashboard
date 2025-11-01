'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { resetPasswordConfirmSchema, type ResetPasswordConfirmFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/authService';

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordConfirmFormData>({
    resolver: zodResolver(resetPasswordConfirmSchema),
  });

  const onSubmit = async (data: ResetPasswordConfirmFormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(token, { newPassword: data.newPassword });
      router.push('/auth/login?reset=success');
    } catch (error) {
      const err = error as Error;
      console.error('Error resetting password:', err);
      setError('root', {
        message: err.message || 'Failed to reset password',
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
          <p className="text-sm text-gray-600 mt-2">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              {...register('newPassword')}
              type="password"
              id="newPassword"
              placeholder="••••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              placeholder="••••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              Password must be at least 8 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="w-full text-gray-700 py-2 px-4 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        </form>

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
