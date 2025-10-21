'use client';

import { useInitializeAxios } from '@/hooks/useInitializeAxios';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useInitializeAxios();

  return <>{children}</>;
}
