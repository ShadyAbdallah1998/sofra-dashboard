'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { resetPasswordConfirmSchema, type ResetPasswordConfirmFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/authService';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lock } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';
import { HelpCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';


export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const t = useTranslations('Auth.ResetPassword');
  const { isRTL } = useLocale();
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
        message: err.message || t('errorMessage'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                {t('newPassword')}
              </label>
              <Input
                {...register('newPassword')}
                type="password"
                id="newPassword"
                placeholder={t('newPasswordPlaceholder')}
                className="w-full"
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                {t('confirmPassword')}
              </label>
              <Input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                placeholder={t('confirmPasswordPlaceholder')}
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-primary">
                {t('passwordHint')}
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? t('resetting') : t('resetButton')}
            </Button>

            <Button
              type="button"
              onClick={() => router.push('/auth/login')}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className={`w-5 h-5 me-2 ${isRTL ? 'rotate-180' : ''}`} />
              {t('backToLogin')}
            </Button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <LanguageSwitcher />
            <ModeToggle />
            <button
              type="button"
              className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <HelpCircle className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
