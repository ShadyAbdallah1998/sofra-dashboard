'use client';

import { HelpCircle } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';

export default function LoginFooter() {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <LanguageSwitcher />
      <ModeToggle />
      <button
        type="button"
        className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors p-2"
        onClick={() => {
          // Help logic here
        }}
      >
        <HelpCircle className="size-5" />
      </button>
    </div>
  );
}
