import { Link } from '@/i18n/navigation';
import {useLocale} from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const nextLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      href="/"
      locale={nextLocale}
      prefetch={false} // avoid prefetching the wrong locale
      className="px-3 py-1 rounded-md border text-sm"
    >
      {nextLocale.toUpperCase()}
    </Link>
  );
}
