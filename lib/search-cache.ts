import { ExtendedSearchResponse } from '@/types/tmdb';

// Shared search cache interface
interface CachedSearchResult {
  data: ExtendedSearchResponse;
  timestamp: number;
  query: string;
  region: string;
}

// Cache storage interface for different implementations
interface CacheStorage {
  get(key: string): Promise<CachedSearchResult | null>;
  set(key: string, value: CachedSearchResult, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Implementation 1: Vercel KV (Redis-compatible, built-in)
class VercelKVStorage implements CacheStorage {
  private async getKV() {
    try {
      // Dynamic import to avoid build errors when package not installed
      return (await import('@vercel/kv')).kv;
    } catch (error) {
      throw new Error('Vercel KV package not available. Install with: npm install @vercel/kv');
    }
  }

  async get(key: string): Promise<CachedSearchResult | null> {
    try {
      const kv = await this.getKV();
      return await kv.get(key);
    } catch (error) {
      console.warn('VercelKV not available:', error);
      return null;
    }
  }

  async set(key: string, value: CachedSearchResult, ttlSeconds: number): Promise<void> {
    try {
      const kv = await this.getKV();
      await kv.setex(key, ttlSeconds, value);
    } catch (error) {
      console.warn('VercelKV not available:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const kv = await this.getKV();
      await kv.del(key);
    } catch (error) {
      console.warn('VercelKV not available:', error);
    }
  }

  async clear(): Promise<void> {
    // Implement if needed
  }
}

// Implementation 2: Memory storage with file backup (development/simple)
class MemoryWithFileStorage implements CacheStorage {
  private cache = new Map<string, CachedSearchResult>();
  private readonly backupFile = '/tmp/search-cache.json';

  constructor() {
    this.loadFromFile();
  }

  async get(key: string): Promise<CachedSearchResult | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    const now = Date.now();
    if (now - cached.timestamp > 30 * 60 * 1000) { // 30 minutes
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  async set(key: string, value: CachedSearchResult, ttlSeconds: number): Promise<void> {
    this.cache.set(key, value);
    await this.saveToFile();
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    await this.saveToFile();
  }

  async clear(): Promise<void> {
    this.cache.clear();
    await this.saveToFile();
  }

  private async loadFromFile(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.backupFile, 'utf-8');
      const parsed = JSON.parse(data);
      this.cache = new Map(parsed);
    } catch (error) {
      // File doesn't exist or is corrupted, start fresh
      console.log('Starting with empty search cache');
    }
  }

  private async saveToFile(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const data = JSON.stringify(Array.from(this.cache.entries()));
      await fs.writeFile(this.backupFile, data);
    } catch (error) {
      console.warn('Failed to save search cache to file:', error);
    }
  }
}

// Implementation 3: Database storage (most persistent)
class DatabaseStorage implements CacheStorage {
  async get(key: string): Promise<CachedSearchResult | null> {
    // Implement with your database of choice
    // Example: SELECT data FROM search_cache WHERE cache_key = ? AND expires_at > NOW()
    return null; // Placeholder
  }

  async set(key: string, value: CachedSearchResult, ttlSeconds: number): Promise<void> {
    // Implement with your database of choice
    // Example: INSERT INTO search_cache (cache_key, data, expires_at) VALUES (?, ?, ?)
  }

  async delete(key: string): Promise<void> {
    // Implement with your database of choice
  }

  async clear(): Promise<void> {
    // Implement with your database of choice
  }
}

// Main search cache class
class SharedSearchCache {
  private storage: CacheStorage;
  private readonly defaultTTL = 30 * 60; // 30 minutes

  constructor(storage?: CacheStorage) {
    // Auto-detect best storage option
    this.storage = storage || this.detectBestStorage();
  }

  private detectBestStorage(): CacheStorage {
    // Priority: Vercel KV > Memory with file > Memory only
    if (process.env.KV_URL) {
      return new VercelKVStorage();
    }
    return new MemoryWithFileStorage();
  }

  private getCacheKey(query: string, page: number = 1, region: string = 'US'): string {
    // Normalize query to improve cache hits
    const normalizedQuery = query.toLowerCase().trim();
    return `search:${normalizedQuery}:${page}:${region}`;
  }

  async get(query: string, page: number = 1, region: string = 'US'): Promise<ExtendedSearchResponse | null> {
    const key = this.getCacheKey(query, page, region);
    const cached = await this.storage.get(key);

    if (!cached) return null;

    console.log(`Cache HIT for "${query}" (saved TMDB API call)`);
    return cached.data;
  }

  async set(query: string, data: ExtendedSearchResponse, page: number = 1, region: string = 'US'): Promise<void> {
    const key = this.getCacheKey(query, page, region);
    const cached: CachedSearchResult = {
      data,
      timestamp: Date.now(),
      query: query.toLowerCase().trim(),
      region
    };

    await this.storage.set(key, cached, this.defaultTTL);
    console.log(`💾 Cached search results for "${query}"`);
  }

  async invalidate(query: string, page: number = 1, region: string = 'US'): Promise<void> {
    const key = this.getCacheKey(query, page, region);
    await this.storage.delete(key);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }

  // Get cache statistics
  getStats() {
    return {
      storage: this.storage.constructor.name,
      timestamp: Date.now()
    };
  }
}

// Global instance
let sharedSearchCache: SharedSearchCache | null = null;

export function getSharedSearchCache(): SharedSearchCache {
  if (!sharedSearchCache) {
    sharedSearchCache = new SharedSearchCache();
  }
  return sharedSearchCache;
}

export { SharedSearchCache, type CacheStorage, type CachedSearchResult };