import { getTMDBClient } from '@/lib/tmdb';
import { SearchResultItem, isMovieItem, isTVItem, MovieItem, TVItem } from '@/types/tmdb';

export interface SimplifiedTitle {
  id: number;
  title: string;  // Normalized title for searching
  originalTitle: string;  // Original title for display
  mediaType: 'movie' | 'tv';
  popularity: number;
  year: string;
}

// Curated list of commonly searched titles with their TMDB IDs
const CURATED_TITLES = [
  // Popular TV Shows
  { id: 2316, title: 'The Office', mediaType: 'tv', popularity: 1000 },
  { id: 1668, title: 'Friends', mediaType: 'tv', popularity: 1000 },
  { id: 1396, title: 'Breaking Bad', mediaType: 'tv', popularity: 1000 },
  { id: 66732, title: 'Stranger Things', mediaType: 'tv', popularity: 1000 },
  { id: 82856, title: 'The Mandalorian', mediaType: 'tv', popularity: 1000 },
  { id: 1399, title: 'Game of Thrones', mediaType: 'tv', popularity: 1000 },
  { id: 60735, title: 'The Flash', mediaType: 'tv', popularity: 900 },
  { id: 1402, title: 'The Walking Dead', mediaType: 'tv', popularity: 900 },
  { id: 60574, title: 'Peaky Blinders', mediaType: 'tv', popularity: 900 },
  { id: 63174, title: 'Lucifer', mediaType: 'tv', popularity: 900 },

  // Popular Movies
  { id: 680, title: 'Pulp Fiction', mediaType: 'movie', popularity: 900 },
  { id: 155, title: 'The Dark Knight', mediaType: 'movie', popularity: 900 },
  { id: 13, title: 'Forrest Gump', mediaType: 'movie', popularity: 900 },
  { id: 550, title: 'Fight Club', mediaType: 'movie', popularity: 900 },
  { id: 27205, title: 'Inception', mediaType: 'movie', popularity: 900 },
  { id: 603, title: 'The Matrix', mediaType: 'movie', popularity: 900 },
  { id: 11, title: 'Star Wars', mediaType: 'movie', popularity: 900 },
  { id: 24428, title: 'The Avengers', mediaType: 'movie', popularity: 900 },
  { id: 157336, title: 'Interstellar', mediaType: 'movie', popularity: 900 },
  { id: 118340, title: 'Guardians of the Galaxy', mediaType: 'movie', popularity: 900 },
];

class PopularTitlesCache {
  private cache: SimplifiedTitle[] = [];
  private lastUpdated: number = 0;
  private readonly cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  private isLoading = false;

  // Get all cached titles
  async getTitles(): Promise<SimplifiedTitle[]> {
    if (this.needsUpdate() && !this.isLoading) {
      await this.updateCache();
    }
    return this.cache;
  }

  // Check if cache needs updating
  private needsUpdate(): boolean {
    return Date.now() - this.lastUpdated > this.cacheTimeout || this.cache.length === 0;
  }

  // Update the cache with fresh data
  private async updateCache(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    console.log('📥 Updating popular titles cache...');

    try {
      const client = getTMDBClient();
      const titles: SimplifiedTitle[] = [];

      // Add curated titles first (these are the most commonly searched)
      for (const curated of CURATED_TITLES) {
        titles.push({
          id: curated.id,
          title: curated.title.toLowerCase(),
          originalTitle: curated.title,
          mediaType: curated.mediaType as 'movie' | 'tv',
          popularity: curated.popularity,
          year: '' // We'll fetch this if needed
        });
      }

      // Fetch popular movies (3 pages = 60 movies)
      for (let page = 1; page <= 3; page++) {
        const response = await client.getPopularMovies(page);
        const simplified = response.results
          .map(movie => ({
            id: movie.id,
            title: movie.title.toLowerCase(),
            originalTitle: movie.title,
            mediaType: 'movie' as const,
            popularity: movie.popularity,
            year: movie.release_date ? movie.release_date.substring(0, 4) : ''
          }));
        titles.push(...simplified);
      }

      // Fetch popular TV shows (3 pages = 60 shows)
      for (let page = 1; page <= 3; page++) {
        const response = await client.getPopularTVShows(page);
        const simplified = response.results
          .map(show => ({
            id: show.id,
            title: show.name.toLowerCase(),
            originalTitle: show.name,
            mediaType: 'tv' as const,
            popularity: show.popularity,
            year: show.first_air_date ? show.first_air_date.substring(0, 4) : ''
          }));
        titles.push(...simplified);
      }

      // Remove duplicates (in case curated titles appear in popular)
      const uniqueTitles = Array.from(
        new Map(titles.map(item => [`${item.id}-${item.mediaType}`, item])).values()
      );

      // Sort by popularity
      uniqueTitles.sort((a, b) => b.popularity - a.popularity);

      this.cache = uniqueTitles;
      this.lastUpdated = Date.now();
      console.log(`✅ Cache updated with ${uniqueTitles.length} titles`);
    } catch (error) {
      console.error('❌ Failed to update popular titles cache:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Force refresh the cache
  async refresh(): Promise<void> {
    this.lastUpdated = 0;
    await this.updateCache();
  }

  // Get cache stats
  getStats() {
    return {
      totalTitles: this.cache.length,
      movies: this.cache.filter(t => t.mediaType === 'movie').length,
      tvShows: this.cache.filter(t => t.mediaType === 'tv').length,
      lastUpdated: new Date(this.lastUpdated).toISOString(),
      isStale: this.needsUpdate()
    };
  }
}

// Singleton instance
let cacheInstance: PopularTitlesCache | null = null;

export function getPopularTitlesCache(): PopularTitlesCache {
  if (!cacheInstance) {
    cacheInstance = new PopularTitlesCache();
  }
  return cacheInstance;
}