'use client';

import { useState, useEffect } from 'react';
import { ExternalIds, MediaType } from '@/types/tmdb';
import { getExternalLinks, ExternalLink } from '@/lib/external-links';

interface ExternalLinksProps {
  id: number;
  mediaType: MediaType;
  className?: string;
}

export default function ExternalLinks({ id, mediaType, className = '' }: ExternalLinksProps) {
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    // Only fetch for movies and TV shows
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      setIsLoading(false);
      return;
    }

    // Debounce rapid re-renders
    const timeoutId = setTimeout(() => {
      const fetchExternalIds = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(`/api/external-ids?id=${id}&type=${mediaType}`, {
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch external IDs: ${response.status}`);
          }

          const data = await response.json();

          if (data.success && data.external_ids) {
            const links = getExternalLinks(data.external_ids);
            setExternalLinks(links);
          } else {
            console.warn('Invalid external IDs response:', data);
            setExternalLinks([]);
          }
        } catch (err) {
          // Don't log timeout errors as they're expected
          if (err instanceof Error && !err.name.includes('AbortError')) {
            console.error('Error fetching external IDs:', err);
          }
          setError('Failed to load external links');
          setExternalLinks([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchExternalIds();
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [id, mediaType]);

  // Don't render anything if loading, error, or no links
  if (isLoading || error || externalLinks.length === 0) {
    return null;
  }

    const handleLinkClick = (url: string, name: string) => {
    // Validate URL before opening
    try {
      new URL(url); // This will throw if URL is invalid

      // Open in new tab with security attributes
      window.open(url, '_blank', 'noopener,noreferrer');

      // Optional: Track analytics
      console.log(`External link clicked: ${name} for ${mediaType} ${id}`);
    } catch (error) {
      console.error('Invalid URL:', url, error);
      // Could show user notification here if needed
    }
  };

    const isInlineDisplay = className.includes('inline-display');

  if (isInlineDisplay) {
    // Inline display for below providers
    return (
      <div className={`flex items-center gap-3 text-sm ${className.replace('inline-display', '')}`}>
        {externalLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleLinkClick(link.url, link.name)}
            className="
              flex items-center gap-2
              text-muted-foreground hover:text-foreground
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/50
              rounded-md px-1
            "
            title={`View on ${link.name}`}
            aria-label={`View on ${link.name}`}
          >
            <img
              src="https://www.imdb.com/favicon.ico"
              alt="IMDb"
              className="w-4 h-4"
              onError={(e) => {
                // Fallback to emoji if favicon fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'inline';
              }}
            />
            <span className="hidden text-lg">{link.icon}</span>
            <span className="font-medium">View on {link.name}</span>
          </button>
        ))}
      </div>
    );
  }

  // Original icon display for other uses
  return (
    <div className={`flex gap-1 ${className}`}>
      {externalLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleLinkClick(link.url, link.name)}
          className="
            flex items-center justify-center
            w-8 h-8 sm:w-7 sm:h-7 md:w-8 md:h-8
            bg-card hover:bg-muted
            border border-muted hover:border-muted-foreground
            rounded-md
            transition-all duration-200
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-primary/50
            touch-manipulation
            group
          "
          title={`View on ${link.name}`}
          aria-label={`View on ${link.name}`}
        >
          <span className="text-lg sm:text-base md:text-lg group-hover:scale-110 transition-transform duration-200">
            {link.icon}
          </span>
        </button>
      ))}
    </div>
  );
}