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
      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-muted cursor-default" title={provider.provider_name}>
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
              <span className="inline-block px-ios-sm py-ios-xs text-ios-caption-1 font-medium bg-muted text-muted-foreground rounded-full cursor-default">
      {provider.provider_name}
    </span>
  );
}