'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchResultItem, isMovieItem, isTVItem, WatchProvidersResponse } from '@/types/tmdb';
import ProviderBadge from './ProviderBadge';

interface ResultCardProps {
  item: SearchResultItem;
}

export default function ResultCard({ item }: ResultCardProps) {
  const [providers, setProviders] = useState<WatchProvidersResponse | null>(null);
  const [showProviders, setShowProviders] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const title = isMovieItem(item) ? item.title : item.name;
  const releaseDate = isMovieItem(item) ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

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

  const usProviders = providers?.results?.US;
  const allProviders = [
    ...(usProviders?.flatrate || []),
    ...(usProviders?.free || [])
  ];

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-gray-200 dark:bg-gray-700">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-20 h-20 text-gray-400"
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
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded">
              {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>
        </div>

        {/* Title and Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white">
            {title}
          </h3>
          {year && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {year}
            </p>
          )}

          {/* Rating */}
          {item.vote_average > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Providers Section */}
        {showProviders && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            {isLoadingProviders ? (
              <div className="flex justify-center py-2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-400"
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
            ) : allProviders.length > 0 ? (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Available on:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allProviders.map((provider) => (
                    <ProviderBadge key={provider.provider_id} provider={provider} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                Not available for streaming in the US
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}