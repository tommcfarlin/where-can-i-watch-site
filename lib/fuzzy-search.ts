import Fuse, { IFuseOptions } from 'fuse.js';
import { getPopularTitlesCache, SimplifiedTitle } from '@/lib/popular-titles-cache';

export interface FuzzySearchResult {
  item: SimplifiedTitle;
  score: number;  // Lower is better (0 = perfect match)
}

export interface SearchSuggestion {
  query: string;
  suggestion: string;
  confidence: number;  // 0-1, higher is more confident
}

class FuzzySearchService {
  private fuse: Fuse<SimplifiedTitle> | null = null;
  private currentTitlesCount = 0;

  // Fuse.js configuration for title matching
  private readonly fuseOptions: IFuseOptions<SimplifiedTitle> = {
    keys: [
      {
        name: 'title',
        weight: 0.7
      },
      {
        name: 'originalTitle',
        weight: 0.3
      }
    ],
    threshold: 0.3,  // 0 = perfect match, 1 = match anything
    includeScore: true,
    minMatchCharLength: 2,
    shouldSort: true,
    findAllMatches: false,
    ignoreLocation: true,  // Don't care where in the string the match occurs
  };

  // Initialize or update the fuzzy search index
  private async ensureIndexReady(): Promise<void> {
    const cache = getPopularTitlesCache();
    const titles = await cache.getTitles();

    if (!this.fuse || this.currentTitlesCount !== titles.length) {
      console.log('🔄 Updating fuzzy search index...');
      this.fuse = new Fuse(titles, this.fuseOptions);
      this.currentTitlesCount = titles.length;
    }
  }

  // Search for titles that match the query
  async search(query: string, limit: number = 5): Promise<FuzzySearchResult[]> {
    await this.ensureIndexReady();

    if (!this.fuse) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return [];
    }

    const results = this.fuse.search(normalizedQuery, { limit });

    return results.map(result => ({
      item: result.item,
      score: result.score || 0
    }));
  }

  // Get a "Did you mean?" suggestion for a query
  async getSuggestion(query: string): Promise<SearchSuggestion | null> {
    const results = await this.search(query, 1);

    if (results.length === 0) {
      return null;
    }

    const bestMatch = results[0];

    // Only suggest if:
    // 1. The match is good enough (score < 0.5)
    // 2. The suggestion is different from the query
    if (bestMatch.score < 0.5 &&
        bestMatch.item.originalTitle.toLowerCase() !== query.toLowerCase()) {

      // Calculate confidence based on score (0 = perfect match = 100% confidence)
      const confidence = 1 - bestMatch.score;

      return {
        query: query,
        suggestion: bestMatch.item.originalTitle,
        confidence: confidence
      };
    }

    return null;
  }

  // Check if a query likely has a typo
  async hasLikelyTypo(query: string, tmdbResultCount: number): Promise<boolean> {
    // If TMDB found good results, probably no typo
    if (tmdbResultCount >= 3) {
      return false;
    }

    // Check if we have a good fuzzy match
    const suggestion = await this.getSuggestion(query);

    // If we have a high-confidence suggestion and TMDB found few/no results
    return suggestion !== null &&
           suggestion.confidence > 0.7 &&
           tmdbResultCount < 2;
  }

  // Get multiple suggestions for a query (for autocomplete)
  async getMultipleSuggestions(query: string, limit: number = 5): Promise<SimplifiedTitle[]> {
    const results = await this.search(query, limit);
    return results
      .filter(r => r.score < 0.5)  // Only reasonably good matches
      .map(r => r.item);
  }

  // Warm up the cache (pre-load popular titles)
  async warmUp(): Promise<void> {
          console.log('Warming up fuzzy search...');
    await this.ensureIndexReady();
    console.log('Fuzzy search ready');
  }

  // Get cache statistics
  async getStats() {
    const cache = getPopularTitlesCache();
    const cacheStats = cache.getStats();

    return {
      ...cacheStats,
      indexSize: this.currentTitlesCount,
      isReady: this.fuse !== null
    };
  }
}

// Singleton instance
let serviceInstance: FuzzySearchService | null = null;

export function getFuzzySearchService(): FuzzySearchService {
  if (!serviceInstance) {
    serviceInstance = new FuzzySearchService();
  }
  return serviceInstance;
}