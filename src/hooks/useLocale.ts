import { useParams } from 'next/navigation';

/**
 * Hook to access current locale and computed direction
 * @returns Current locale, direction (ltr/rtl), and helper flags
 */
export function useLocale() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return {
    locale,
    direction,
    isRTL,
    isLTR: !isRTL,
  };
}
