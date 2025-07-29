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

    const fetchExternalIds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/external-ids?id=${id}&type=${mediaType}`);

        if (!response.ok) {
          throw new Error('Failed to fetch external IDs');
        }

        const data = await response.json();

        if (data.success && data.external_ids) {
          const links = getExternalLinks(data.external_ids);
          setExternalLinks(links);
        }
      } catch (err) {
        console.error('Error fetching external IDs:', err);
        setError('Failed to load external links');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExternalIds();
  }, [id, mediaType]);

  // Don't render anything if loading, error, or no links
  if (isLoading || error || externalLinks.length === 0) {
    return null;
  }

  const handleLinkClick = (url: string, name: string) => {
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');

    // Optional: Track analytics
    console.log(`External link clicked: ${name} for ${mediaType} ${id}`);
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {externalLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleLinkClick(link.url, link.name)}
          className="
            flex items-center justify-center
            w-8 h-8
            bg-card hover:bg-muted
            border border-muted hover:border-muted-foreground
            rounded-md
            transition-all duration-200
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-primary/50
            group
          "
          title={`View on ${link.name}`}
          aria-label={`View on ${link.name}`}
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
            {link.icon}
          </span>
        </button>
      ))}
    </div>
  );
}