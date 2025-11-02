'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getInitials, getAvatarColor } from './utils';

/**
 * Avatar preview component with automatic fallback to initials on error
 * @component
 */
export function AvatarPreview({
  url,
  firstname,
  lastname,
  userEmail,
  size = '80px',
  className = ''
}: {
  url: string;
  firstname?: string;
  lastname?: string;
  userEmail: string;
  size?: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${getAvatarColor(userEmail)} ${className}`}>
        <span className="text-white font-semibold fz-20">
          {getInitials(firstname, lastname)}
        </span>
      </div>
    );
  }

  return (
    <Image
      key={url} // Force remount when URL changes
      src={url}
      alt="Profile preview"
      fill
      className={`object-cover ${className}`}
      sizes={size}
      onError={() => setHasError(true)}
    />
  );
}
