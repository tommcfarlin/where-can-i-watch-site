import { CountryProviders } from '@/types/tmdb';

/**
 * Utility functions for detecting streaming availability
 * Currently supports US region, designed for future multi-region support
 */

export interface StreamingStatus {
  isStreaming: boolean;
  hasSubscription: boolean; // flatrate
  hasPurchase: boolean;     // buy
  hasRental: boolean;       // rent
  hasFree: boolean;         // free with ads
  region: string;
}

/**
 * Determines if content is available for streaming based on provider data
 * @param providers - Provider data from TMDB API
 * @param region - Region code (default: 'US')
 * @returns StreamingStatus object
 */
export function getStreamingStatus(
  providers: CountryProviders | null | undefined,
  region: string = 'US'
): StreamingStatus {
  // If no provider data, not streaming
  if (!providers) {
    return {
      isStreaming: false,
      hasSubscription: false,
      hasPurchase: false,
      hasRental: false,
      hasFree: false,
      region,
    };
  }

  const hasSubscription = Boolean(providers.flatrate && providers.flatrate.length > 0);
  const hasPurchase = Boolean(providers.buy && providers.buy.length > 0);
  const hasRental = Boolean(providers.rent && providers.rent.length > 0);
  const hasFree = Boolean(providers.free && providers.free.length > 0);

  // Content is considered "streaming" if it has any of these options
  const isStreaming = hasSubscription || hasPurchase || hasRental || hasFree;

  return {
    isStreaming,
    hasSubscription,
    hasPurchase,
    hasRental,
    hasFree,
    region,
  };
}

/**
 * Quick check if content is streamable (any option available)
 * @param providers - Provider data from TMDB API
 * @param region - Region code (default: 'US')
 * @returns boolean
 */
export function isStreamable(
  providers: CountryProviders | null | undefined,
  region: string = 'US'
): boolean {
  return getStreamingStatus(providers, region).isStreaming;
}

/**
 * Filter array of items by streaming status
 * @param items - Array of items with provider data
 * @param getProviders - Function to extract providers from each item
 * @param streamingOnly - If true, return only streaming items; if false, return only non-streaming
 * @param region - Region code (default: 'US')
 * @returns Filtered array
 */
export function filterByStreamingStatus<T>(
  items: T[],
  getProviders: (item: T) => CountryProviders | null | undefined,
  streamingOnly: boolean,
  region: string = 'US'
): T[] {
  return items.filter(item => {
    const providers = getProviders(item);
    const streaming = isStreamable(providers, region);
    return streamingOnly ? streaming : !streaming;
  });
}