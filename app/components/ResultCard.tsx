'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchResultItem, isMovieItem, CountryProviders } from '@/types/tmdb';
import ProviderBadge from './ProviderBadge';
import ExternalLinks from './ExternalLinks';
import LoadingSpinner from './LoadingSpinner';

// Progressive image loading component
function ProgressiveImage({
  src,
  alt,
  className = "",
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Blur placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-ios-tertiary-system-background via-ios-quaternary-system-background to-ios-tertiary-system-background transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 animate-ios-shimmer" />
      </div>

      {/* Main image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className={`${className} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? "eager" : "lazy"}
          quality={85}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          priority={priority}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-ios-tertiary-system-background">
          <svg
            className="w-8 h-8 text-ios-tertiary-label"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

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
    <article
      className="group cursor-pointer animate-ios-spring-in ios-result-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} - ${item.media_type === 'movie' ? 'Movie' : 'TV Show'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="relative overflow-hidden rounded-ios-card bg-ios-secondary-system-background hover:bg-ios-tertiary-system-background ios-scale-button ios-transition-standard shadow-sm hover:shadow-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-ios-link/50">
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-ios-tertiary-system-background overflow-hidden">
          {item.poster_path ? (
            <ProgressiveImage
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={`${title} poster`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full" role="img" aria-label="No poster available">
              <svg
                className="w-20 h-20 text-ios-tertiary-label"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-ios-xs right-ios-xs">
            <span className="px-ios-xs py-ios-xs text-ios-caption-2 bg-ios-system-background/80 backdrop-blur-sm text-ios-label rounded-ios-button border border-ios-separator/30 font-ios-medium">
              {item.media_type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-ios-sm space-y-ios-xs">
          {/* Title */}
          <h3 className="font-ios-semibold text-ios-body line-clamp-1 text-ios-label">
            {title}
          </h3>
          {year && (
            <p className="text-ios-caption-1 text-ios-secondary-label mt-ios-xs">
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
                    className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-ios-secondary-system-background ring-1 ring-ios-separator/20 cursor-default"
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
                      <div className="w-full h-full bg-ios-tertiary-system-background" />
                    )}
                  </div>
                ))}
              </div>
              {allProviders.length > 3 && (
                <span className="text-ios-caption-1 text-ios-tertiary-label">
                  +{allProviders.length - 3} more
                </span>
              )}
              <svg
                className={`w-4 h-4 text-ios-tertiary-label ml-auto ios-transition-standard ${
                  showProviders ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Providers Section */}
        {showProviders && (
          <div className="border-t border-ios-separator p-ios-sm animate-ios-fade-slide-in bg-ios-tertiary-system-background/50">
            {isLoadingProviders ? (
              <div className="flex justify-center py-ios-sm">
                <LoadingSpinner size="md" color="secondary" />
              </div>
            ) : streamingProviders.length > 0 || purchaseProviders.length > 0 ? (
              <div className="space-y-ios-sm">
                {/* Streaming Providers */}
                {streamingProviders.length > 0 && (
                  <div>
                    <p className="text-ios-caption-1 text-ios-tertiary-label mb-ios-sm">
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
                    <p className="text-ios-caption-1 text-ios-tertiary-label mb-ios-sm">
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
              <p className="text-ios-caption-1 text-ios-tertiary-label text-center py-ios-sm">
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
    </article>
  );
}