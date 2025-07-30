'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchResultItem, isMovieItem, CountryProviders } from '@/types/tmdb';
import ProviderBadge from './ProviderBadge';
import ExternalLinks from './ExternalLinks';

interface ResultCardProps {
  item: SearchResultItem;
  providers?: CountryProviders | null; // Optional: if provided, skip API fetch
}

interface ProviderApiResponse {
  id: number;
  providers: CountryProviders;
}

// Base64 encoded 1x1 transparent pixel as a lightweight placeholder
const BLUR_PLACEHOLDER = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

export default function ResultCard({ item, providers: externalProviders }: ResultCardProps) {
  const [providers, setProviders] = useState<ProviderApiResponse | null>(null);
  const [showProviders, setShowProviders] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const title = isMovieItem(item) ? item.title : item.name;
  const releaseDate = isMovieItem(item) ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  // Auto-fetch providers on mount for better UX (only if not provided externally)
  useEffect(() => {
    if (externalProviders !== undefined) {
      // Use externally provided providers data
      setProviders(externalProviders ? { id: item.id, providers: externalProviders } : null);
      return;
    }

    const fetchProviders = async () => {
      try {
        const response = await fetch(
          `/api/providers?id=${item.id}&type=${item.media_type}`
        );
        if (response.ok) {
          const data = await response.json();
          setProviders(data);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      }
    };

    fetchProviders();
  }, [item.id, item.media_type, externalProviders]);

  const handleCardClick = async () => {
    if (!showProviders && !providers) {
      setIsLoadingProviders(true);
      try {
        const response = await fetch(
          `/api/providers?id=${item.id}&type=${item.media_type}`
        );
        if (response.ok) {
          const data = await response.json();
          setProviders(data);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoadingProviders(false);
      }
    }
    setShowProviders(!showProviders);
  };

  const usProviders = providers?.providers;

  // Separate streaming providers (subscription/free) from purchase providers (buy/rent)
  const streamingProvidersWithDuplicates = [
    ...(usProviders?.flatrate || []),
    ...(usProviders?.free || [])
  ];

  const purchaseProvidersWithDuplicates = [
    ...(usProviders?.buy || []),
    ...(usProviders?.rent || [])
  ];

  // Deduplicate each category by provider_id
  const streamingProviders = streamingProvidersWithDuplicates.filter((provider, index, array) =>
    array.findIndex(p => p.provider_id === provider.provider_id) === index
  );

  const purchaseProviders = purchaseProvidersWithDuplicates.filter((provider, index, array) =>
    array.findIndex(p => p.provider_id === provider.provider_id) === index
  );

  // All providers combined for preview (maintain backward compatibility)
  const allProviders = [...streamingProviders, ...purchaseProviders].filter((provider, index, array) =>
    array.findIndex(p => p.provider_id === provider.provider_id) === index
  );

  return (
    <div className="group cursor-pointer animate-scale-in" onClick={handleCardClick}>
      <div className="relative overflow-hidden rounded-lg bg-card border border-muted hover:border-muted-foreground transition-all duration-200">
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-muted">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-20 h-20 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 backdrop-blur-sm text-white rounded-md">
              {item.media_type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
            </span>
          </div>


        </div>

        {/* Title and Info */}
        <div className="p-ios-sm">
          <h3 className="font-semibold text-sm line-clamp-1 text-card-foreground">
            {title}
          </h3>
          {year && (
            <p className="text-ios-caption-1 text-muted-foreground mt-ios-xs">
              {year}
            </p>
          )}

          {/* Quick Provider Preview */}
          {providers && allProviders.length > 0 && !showProviders && (
            <div className="mt-ios-sm flex items-center gap-ios-sm">
              <div className="flex -space-x-2">
                {allProviders.slice(0, 3).map((provider, index) => (
                  <div
                    key={provider.provider_id}
                    className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-card ring-1 ring-black/5 cursor-default"
                    style={{ zIndex: 3 - index }}
                  >
                    {provider.logo_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                ))}
              </div>
              {allProviders.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{allProviders.length - 3} more
                </span>
              )}
              <svg
                className={`w-4 h-4 text-muted-foreground ml-auto transition-transform duration-300 ${
                  showProviders ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Providers Section */}
        {showProviders && (
          <div className="border-t border-muted p-ios-sm animate-slide-in">
            {isLoadingProviders ? (
              <div className="flex justify-center py-ios-sm">
                <svg
                  className="animate-spin h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : streamingProviders.length > 0 || purchaseProviders.length > 0 ? (
              <div className="space-y-ios-sm">
                {/* Streaming Providers */}
                {streamingProviders.length > 0 && (
                  <div>
                    <p className="text-ios-caption-1 text-muted-foreground mb-ios-sm">
                      Stream on:
                    </p>
                    <div className="flex flex-wrap gap-ios-sm">
                      {streamingProviders.map((provider) => (
                        <ProviderBadge key={provider.provider_id} provider={provider} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Purchase Providers */}
                {purchaseProviders.length > 0 && (
                  <div>
                    <p className="text-ios-caption-1 text-muted-foreground mb-ios-sm">
                      Buy/Rent on:
                    </p>
                    <div className="flex flex-wrap gap-ios-sm">
                      {purchaseProviders.map((provider) => (
                        <ProviderBadge key={provider.provider_id} provider={provider} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-ios-caption-1 text-muted-foreground text-center py-ios-sm">
                Not available for streaming in the US
              </p>
            )}

            {/* External Links */}
            <div className="mt-ios-sm pt-ios-sm border-t border-muted">
              <ExternalLinks
                id={item.id}
                mediaType={item.media_type}
                className="inline-display"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}