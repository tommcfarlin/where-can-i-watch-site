import { ExternalIds } from '@/types/tmdb';

/**
 * Utility functions for constructing external links from TMDB external IDs
 */

export interface ExternalLink {
  name: string;
  url: string;
  icon: string; // Icon identifier
}

/**
 * Validate IMDB ID format
 * @param imdbId - IMDB ID to validate
 * @returns boolean indicating if ID is valid
 */
function isValidIMDBId(imdbId: string): boolean {
  // IMDB IDs follow the pattern: tt followed by 7-8 digits
  return /^tt\d{7,8}$/.test(imdbId);
}

/**
 * Construct IMDB URL from external IDs
 * @param externalIds - External IDs from TMDB API
 * @returns IMDB link object or null if no valid IMDB ID
 */
export function getIMDBLink(externalIds: ExternalIds): ExternalLink | null {
  if (!externalIds.imdb_id || !isValidIMDBId(externalIds.imdb_id)) {
    return null;
  }

  return {
    name: 'IMDb',
    url: `https://www.imdb.com/title/${externalIds.imdb_id}`,
    icon: 'imdb', // IMDB icon identifier
  };
}

/**
 * Construct external links from TMDB external IDs
 * Note: Rotten Tomatoes is not directly supported by TMDB external IDs
 * @param externalIds - External IDs from TMDB API
 * @returns Array of available external links
 */
export function getExternalLinks(externalIds: ExternalIds): ExternalLink[] {
  // Validate input
  if (!externalIds || typeof externalIds !== 'object') {
    console.warn('Invalid external IDs provided:', externalIds);
    return [];
  }

  const links: ExternalLink[] = [];

  // Add IMDB link if available
  const imdbLink = getIMDBLink(externalIds);
  if (imdbLink) {
    links.push(imdbLink);
  }

  // Could add other external links here if needed:
  // - Wikidata (if wikidata_id exists and is valid)
  // - The TVDB (for TV shows, if tvdb_id exists and is valid)
  // - Social media links (Twitter, Facebook, Instagram)

  return links;
}

/**
 * Check if any external links are available
 * @param externalIds - External IDs from TMDB API
 * @returns boolean indicating if any links are available
 */
export function hasExternalLinks(externalIds: ExternalIds): boolean {
  return getExternalLinks(externalIds).length > 0;
}

/**
 * Get primary external link (prioritizing IMDB)
 * @param externalIds - External IDs from TMDB API
 * @returns Primary external link or null
 */
export function getPrimaryExternalLink(externalIds: ExternalIds): ExternalLink | null {
  const links = getExternalLinks(externalIds);

  // Prioritize IMDB
  const imdbLink = links.find(link => link.name === 'IMDb');
  if (imdbLink) {
    return imdbLink;
  }

  // Return first available link
  return links.length > 0 ? links[0] : null;
}