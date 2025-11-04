'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/authService';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, KeyRound } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';
import { HelpCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth.ResetPassword');
  const tValidation = useTranslations('validation');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { isRTL } = useLocale();


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
      const err = error as Error;
      console.error('Error sending reset email:', err);
      setError('root', {
        message: err.message || 'Failed to send reset email',
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
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('requestTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('requestSubtitle')}</p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{errors.root.message}</p>
                </div>
              )}

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  {t('spamNotice')}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  {t('email')}
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder={t('emailPlaceholder')}
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{tValidation(errors.email.message?.replace('validation.', '') || 'invalidInput')}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? t('sending') : t('sendButton')}
              </Button>

              <Button
                type="button"
                onClick={() => window.history.back()}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className={`w-5 h-5 me-2 ${isRTL ? 'rotate-180' : ''}`} />
                {t('backToLogin')}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                <p className="text-sm text-foreground font-medium">{t('emailSentTitle')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('emailSentMessage')} <strong>{emailValue}</strong>
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">{t('nextStepsTitle')}</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>{t('nextStep1')}</li>
                  <li>{t('nextStep2')}</li>
                  <li>{t('nextStep3')}</li>
                </ul>
              </div>

              <Button
                onClick={() => setEmailSent(false)}
                variant="link"
                className="w-full"
                size="lg"
              >
                {t('didntReceive')}
              </Button>
            </div>
          )}

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
