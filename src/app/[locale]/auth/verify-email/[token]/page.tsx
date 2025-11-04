'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/store';
import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VerificationStatus = 'verifying' | 'success' | 'error';

export default function VerifyEmailTokenPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('Auth.VerifyEmail');

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  const user = useAuthStore((state) => state.user);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  useEffect(() => {
    const token = params.token as string;

    if (!token) {
      setStatus('error');
      setErrorMessage(t('errorMessage'));
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setErrorMessage(t('errorMessage'));
      }
    };

    verify();
  }, [params.token, verifyEmail, t]);

  const handleRedirect = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-chart-1/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-chart-1" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {status === 'verifying' && t('title')}
            {status === 'success' && t('successTitle')}
            {status === 'error' && t('errorTitle')}
          </h1>

          {/* Message */}
          <p className="text-muted-foreground mb-8 fz-14">
            {status === 'verifying' && t('verifying')}
            {status === 'success' && t('successMessage')}
            {status === 'error' && errorMessage}
          </p>

          {/* Actions */}
          {status !== 'verifying' && (
            <div className="space-y-3">
              <Button
                onClick={handleRedirect}
                className="w-full"
                size="lg"
              >
                {user ? t('goToDashboard') : t('goToLogin')}
              </Button>

              {/* {status === 'error' && (
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {t('backToHome')}
                </Button>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
