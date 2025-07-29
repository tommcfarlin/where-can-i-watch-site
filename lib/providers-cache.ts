import { CountryProviders } from '@/types/tmdb';

interface CachedProvider {
  data: CountryProviders | null;
  timestamp: number;
  region: string;
}

class ProvidersCache {
  private cache = new Map<string, CachedProvider>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getKey(id: number, mediaType: string, region: string = 'US'): string {
    return `${mediaType}-${id}-${region}`;
  }

  get(id: number, mediaType: string, region: string = 'US'): CountryProviders | null | undefined {
    const key = this.getKey(id, mediaType, region);
    const cached = this.cache.get(key);

    if (!cached) {
      return undefined; // Not in cache
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return undefined; // Expired
    }

    return cached.data;
  }

  set(id: number, mediaType: string, data: CountryProviders | null, region: string = 'US'): void {
    const key = this.getKey(id, mediaType, region);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      region,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
const providersCache = new ProvidersCache();

// Cleanup every 5 minutes
setInterval(() => {
  providersCache.cleanup();
}, 5 * 60 * 1000);

export { providersCache };