'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { initializeAxios } from '@/services';

export function useInitializeAxios() {
  const locale = useLocale();

  useEffect(() => {
    initializeAxios({
      xContent: 'desktop',
      apiLocale: locale,
    });
  }, [locale]);
}
