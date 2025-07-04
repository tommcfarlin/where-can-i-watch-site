'use client';

import Image from 'next/image';
import { Provider } from '@/types/tmdb';

interface ProviderBadgeProps {
  provider: Provider;
}

export default function ProviderBadge({ provider }: ProviderBadgeProps) {
  const logoUrl = provider.logo_path
    ? `https://image.tmdb.org/t/p/original${provider.logo_path}`
    : null;

  if (logoUrl) {
    return (
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm" title={provider.provider_name}>
        <Image
          src={logoUrl}
          alt={provider.provider_name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    );
  }

  // Fallback to text if no logo
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
      {provider.provider_name}
    </span>
  );
}