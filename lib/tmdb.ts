import {
  SearchMultiResponse,
  WatchProvidersResponse,
  ExternalIds,
  isTMDBError,
  MediaType,
  MovieItem,
  TVItem,
} from '@/types/tmdb';

// TMDB API configuration
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API client class
export class TMDBClient {
  private apiKey: string;
  private requestQueue: Promise<unknown> = Promise.resolve();
  private requestCount = 0;
  private resetTime = Date.now();

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('TMDB API key is required');
    }
    this.apiKey = apiKey;
  }

  // Rate limiting: 40 requests per 10 seconds
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();

    // Reset counter if 10 seconds have passed
    if (now - this.resetTime > 10000) {
      this.requestCount = 0;
      this.resetTime = now;
    }

    // If we've hit the limit, wait
    if (this.requestCount >= 39) { // Leave 1 request as buffer
      const waitTime = 10000 - (now - this.resetTime);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.resetTime = Date.now();
      }
    }

    this.requestCount++;
  }

  // Generic fetch method with error handling
  private async fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    await this.enforceRateLimit();

    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      ...params,
    });

    const url = `${BASE_URL}${endpoint}?${queryParams}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || isTMDBError(data)) {
        throw new TMDBApiError(
          data.status_message || 'Unknown error occurred',
          data.status_code || response.status
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof TMDBApiError) {
        throw error;
      }
      throw new TMDBApiError('Network error occurred', 0);
    }
  }

  // Search for movies and TV shows
  async searchMulti(query: string, page = 1): Promise<SearchMultiResponse> {
    if (!query || query.trim().length === 0) {
      throw new TMDBApiError('Search query cannot be empty', 400);
    }

    return this.fetchFromTMDB<SearchMultiResponse>('/search/multi', {
      query: query.trim(),
      page: page.toString(),
    });
  }

  // Get watch providers for a movie or TV show
  async getWatchProviders(id: number, mediaType: MediaType): Promise<WatchProvidersResponse> {
    if (mediaType === 'person') {
      throw new TMDBApiError('Cannot get watch providers for person', 400);
    }

    const endpoint = `/${mediaType}/${id}/watch/providers`;
    return this.fetchFromTMDB<WatchProvidersResponse>(endpoint);
  }

  // Get external IDs for a movie or TV show
  async getExternalIds(id: number, mediaType: MediaType): Promise<ExternalIds> {
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      throw new Error('External IDs are only available for movies and TV shows');
    }

    const endpoint = `/${mediaType}/${id}/external_ids`;
    return this.fetchFromTMDB<ExternalIds>(endpoint);
  }

  // Get popular movies (for fuzzy search database)
  async getPopularMovies(page = 1): Promise<{ results: MovieItem[] }> {
    const response = await this.fetchFromTMDB<{
      page: number;
      results: MovieItem[];
      total_pages: number;
      total_results: number;
    }>('/movie/popular', {
      page: page.toString(),
    });

    // Add media_type to each movie
    return {
      results: response.results.map(movie => ({
        ...movie,
        media_type: 'movie' as MediaType
      }))
    };
  }

  // Get popular TV shows (for fuzzy search database)
  async getPopularTVShows(page = 1): Promise<{ results: TVItem[] }> {
    const response = await this.fetchFromTMDB<{
      page: number;
      results: TVItem[];
      total_pages: number;
      total_results: number;
    }>('/tv/popular', {
      page: page.toString(),
    });

    // Add media_type to each TV show
    return {
      results: response.results.map(show => ({
        ...show,
        media_type: 'tv' as MediaType
      }))
    };
  }

  // Helper method to build image URLs
  static getImageUrl(path: string | null, size: 'w92' | 'w185' | 'w500' | 'original' = 'w185'): string | null {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  // Helper method to get provider logo URL
  static getProviderLogoUrl(logoPath: string | null): string | null {
    return TMDBClient.getImageUrl(logoPath, 'w92');
  }
}

// Custom error class for TMDB API errors
export class TMDBApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'TMDBApiError';
  }
}

// Singleton instance for server-side usage
let clientInstance: TMDBClient | null = null;

export function getTMDBClient(): TMDBClient {
  if (!clientInstance) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB_API_KEY environment variable is not set');
    }
    clientInstance = new TMDBClient(apiKey);
  }
  return clientInstance;
}