'use client';

import { ExternalLink } from '@/lib/external-links';

interface ExternalLinksIconProps {
  links: ExternalLink[];
  className?: string;
}

/**
 * Simple icon display component for external links
 * Used when external IDs are already fetched
 */
export default function ExternalLinksIcon({ links, className = '' }: ExternalLinksIconProps) {
  if (links.length === 0) {
    return null;
  }

  const handleLinkClick = (url: string, name: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex gap-ios-xs ${className}`}>
      {links.map((link) => (
        <button
          key={link.name}
          onClick={() => handleLinkClick(link.url, link.name)}
          className="
            flex items-center justify-center
            w-6 h-6
            bg-muted/30 hover:bg-muted
            border border-muted/50 hover:border-muted
            rounded
            transition-all duration-200
            hover:scale-110
            focus:outline-none focus:ring-1 focus:ring-primary/50
            opacity-70 hover:opacity-100
          "
          title={`View on ${link.name}`}
          aria-label={`View on ${link.name}`}
        >
          <span className="text-sm">
            {link.icon}
          </span>
        </button>
      ))}
    </div>
  );
}