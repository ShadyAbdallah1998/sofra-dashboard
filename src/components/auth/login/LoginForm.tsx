'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.schema';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
  const t = useTranslations('Auth.Login');
  const tValidation = useTranslations('validation');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      console.log('Login successful:', response);
      router.push('/dashboard');
    } catch (error) {
      setError('root', {
        message: (error as { message?: string }).message || 'Login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errors.root && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="fz-14 text-center text-destructive">{errors.root.message}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block fz-14 font-medium text-foreground">
          {t('email')}
        </label>
        <div className="relative">
          <Mail className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            className="ltr:pl-10 rtl:pr-10 fz-14"
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && (
          <p className="fz-12 text-destructive">{tValidation(errors.email.message?.replace('validation.', '') || 'invalidInput')}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block fz-14 font-medium text-foreground">
            {t('password')}
          </label>
          <Link
            href="/auth/forgot-password"
            className="fz-12 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            className="ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10 fz-14"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="fz-12 text-destructive">{tValidation(errors.password.message?.replace('validation.', '') || 'invalidInput')}</p>
        )}
      </div>

      <div className="flex items-center ltr:space-x-2 rtl:space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <label
          htmlFor="remember"
          className="fz-14 text-foreground cursor-pointer select-none"
        >
          {t('rememberMe')}
        </label>
      </div>

      <Button
        type="submit"
        className="w-full fz-16 font-medium"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? t('loggingIn') : t('loginButton')}
      </Button>
    </form>
  );
}
