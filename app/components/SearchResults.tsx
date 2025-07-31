'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ExtendedSearchResponse, CountryProviders, SearchResultItem } from '@/types/tmdb';
import { isStreamable } from '@/lib/streaming-detection';
import ResultCard from './ResultCard';
import DidYouMean from './DidYouMean';
import Tabs from './Tabs';
import LoadingSpinner from './LoadingSpinner';

interface SearchResultsProps {
  results: ExtendedSearchResponse;
  isLoading: boolean;
  searchQuery: string;
}

// Performance monitoring for development
const usePerformanceMonitoring = (enabled: boolean = false) => {
  const measureRender = useCallback((label: string) => {
    if (!enabled || typeof window === 'undefined') return () => {};

    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      if (duration > 16.67) { // Slower than 60fps
        console.warn(`🐌 Slow render (${label}): ${duration.toFixed(2)}ms`);
      } else {
        console.log(`✅ Fast render (${label}): ${duration.toFixed(2)}ms`);
      }
    };
  }, [enabled]);

  return { measureRender };
};

// Optimized batch processing for large result sets
const useBatchProcessor = (items: any[], batchSize: number = 20) => {
  const [processedBatches, setProcessedBatches] = useState<number>(1);

  useEffect(() => {
    setProcessedBatches(1); // Reset when items change
  }, [items]);

  useEffect(() => {
    if (processedBatches * batchSize >= items.length) return;

    // Use requestIdleCallback for non-critical batch processing
    const scheduleNextBatch = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 100 });
      } else {
        setTimeout(callback, 0);
      }
    };

    scheduleNextBatch(() => {
      setProcessedBatches(prev => prev + 1);
    });
  }, [processedBatches, items.length, batchSize]);

  return items.slice(0, processedBatches * batchSize);
};

export default function SearchResults({ results, isLoading, searchQuery }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('tv'); // Removed 'not-streaming'
  const [providersData, setProvidersData] = useState<Record<string, CountryProviders | null>>({});
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [isLargeResultSet, setIsLargeResultSet] = useState(false);
  const [hasDetectedFranchise, setHasDetectedFranchise] = useState(false);

  // Performance monitoring (enable in development)
  const { measureRender } = usePerformanceMonitoring(process.env.NODE_ENV === 'development');

    // Fetch providers data for all results using batch API
  useEffect(() => {
    const fetchAllProviders = async () => {
      if (results.results.length === 0) {
        setIsLoadingProviders(false);
        return;
      }

            // Detect if this will require extended processing
      // Either due to large result count OR franchise detection (which adds hidden results)
      const detectedFranchise = !!(results as any).detectedFranchise;
      setHasDetectedFranchise(detectedFranchise);
      const isLarge = results.results.length > 45 || detectedFranchise;
      setIsLargeResultSet(isLarge);

      setIsLoadingProviders(true);
      try {
        // Prepare batch request
        const items = results.results.map(item => ({
          id: item.id,
          media_type: item.media_type,
        }));

        const newProvidersData: Record<string, CountryProviders | null> = {};

        // Split into chunks of 50 to respect API limit
        const chunkSize = 50;
        const totalChunks = Math.ceil(items.length / chunkSize);
        setLoadingProgress({ current: 0, total: totalChunks });

        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);
          const chunkNumber = Math.floor(i / chunkSize) + 1;

          // Update progress
          setLoadingProgress({ current: chunkNumber, total: totalChunks });

          // Make batch request for this chunk
          const response = await fetch('/api/providers/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: chunk }),
          });

          if (!response.ok) {
            throw new Error(`Batch providers request failed for chunk ${chunkNumber}`);
          }

          const data = await response.json();

          // Process batch response for this chunk
          data.results?.forEach((result: { id: number; media_type: string; providers: CountryProviders | null }) => {
            const key = `${result.media_type}-${result.id}`;
            newProvidersData[key] = result.providers;
          });

          // Update providers data progressively so users see results as they load
          setProvidersData(prev => ({ ...prev, ...newProvidersData }));
        }

        setProvidersData(newProvidersData);
      } catch (error) {
        console.error('Failed to fetch providers batch:', error);
        // Fallback to empty providers data
        setProvidersData({});
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchAllProviders();
  }, [results.results]);

  // Calculate counts for each media type including streaming status
  const { movieCount, tvCount, notStreamingCount, filteredResults } = useMemo(() => {
    // Show results progressively as provider data becomes available
    // Only require that we have at least some provider data OR loading is complete
    if (isLoadingProviders && Object.keys(providersData).length === 0) {
      return {
        movieCount: 0,
        tvCount: 0,
        notStreamingCount: 0,
        filteredResults: [],
      };
    }

    // Helper function to get providers for an item
    const getItemProviders = (item: SearchResultItem) => {
      const key = `${item.media_type}-${item.id}`;
      return providersData[key] || null;
    };

    // Only categorize items that have provider data loaded
    const itemsWithProviders = results.results.filter(item => {
      const key = `${item.media_type}-${item.id}`;
      return providersData.hasOwnProperty(key);
    });

    // Categorize loaded items by media type and streaming status
    const allStreaming = itemsWithProviders.filter(item => {
      const providers = getItemProviders(item);
      return isStreamable(providers, 'US');
    });

    const allNotStreaming = itemsWithProviders.filter(item => {
      const providers = getItemProviders(item);
      return !isStreamable(providers, 'US');
    });

    // Filter streaming results by media type
    const streamingMovies = allStreaming.filter(item => item.media_type === 'movie');
    const streamingTVShows = allStreaming.filter(item => item.media_type === 'tv');

    // Determine filtered results based on active tab
    let filtered = allStreaming; // Default to all streaming content
    if (activeTab === 'movie') {
      filtered = streamingMovies;
    } else if (activeTab === 'tv') {
      filtered = streamingTVShows;
    }
    // Removed: not-streaming tab logic

    return {
      movieCount: streamingMovies.length,
      tvCount: streamingTVShows.length,
      notStreamingCount: allNotStreaming.length,
      filteredResults: filtered,
    };
  }, [results.results, activeTab, providersData, isLoadingProviders]);

  const hasResults = results.results && results.results.length > 0;

  return (
    <div className="w-full">
      {/* Did You Mean Section */}
      {results.suggestion && (
        <DidYouMean
          suggestion={results.suggestion.suggestion}
          confidence={results.suggestion.confidence}
          searchQuery={searchQuery}
        />
      )}

      {/* Franchise Detection Notice */}
      {(results as ExtendedSearchResponse & { detectedFranchise?: string }).detectedFranchise && (
                <div className="mb-ios-lg p-ios-md bg-card rounded-ios-card border border-muted">
          <p className="text-ios-subhead">
            <span className="font-ios-semibold text-ios-label">
              🎬 Franchise detected!
            </span>
            <span className="text-ios-secondary-label ml-ios-sm">
              Showing additional {(results as ExtendedSearchResponse & { detectedFranchise?: string }).detectedFranchise} universe content that might not contain &ldquo;{searchQuery}&rdquo; in the title.
            </span>
          </p>
        </div>
      )}

      {/* Tabs for filtering */}
      {hasResults && !isLoading && !isLoadingProviders && (
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          movieCount={movieCount}
          tvCount={tvCount}
          notStreamingCount={0} // Hidden for now
        />
      )}



      {/* General empty state */}
      {results.results.length === 0 && !isLoading && (
        <div className="text-center py-ios-3xl">
          <p className="text-ios-body text-ios-secondary-label">
            No results found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-ios-subhead text-ios-tertiary-label mt-ios-sm">
            Try checking your spelling or using different keywords
          </p>
        </div>
      )}

      {/* Loading providers state */}
      {hasResults && !isLoading && isLoadingProviders && (
        <div className="text-center py-ios-xl flex flex-col items-center">
          <LoadingSpinner size="md" color="secondary" />
          <p className="text-ios-subhead text-ios-secondary-label mt-ios-sm">
            {loadingProgress.total > 1 ? (
              `Checking availability... (${loadingProgress.current} of ${loadingProgress.total})`
            ) : (
              'Loading streaming availability...'
            )}
          </p>
          {loadingProgress.total > 1 && (
            <div className="mt-ios-sm">
              <div className="w-64 mx-auto bg-ios-tertiary-system-background rounded-full h-1">
                <div
                  className="bg-ios-link h-1 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-ios-caption-1 text-ios-tertiary-label mt-ios-xs">
                {hasDetectedFranchise
                  ? 'Franchise content detected'
                  : `Processing ${results.results.length} results`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Results Grid */}
      {hasResults && !isLoading && !isLoadingProviders && (
        <>
          {filteredResults.length > 0 ? (
            <div className="ios-result-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-ios-sm sm:gap-ios-md ios-momentum-scroll">
              {filteredResults.map((item) => {
                const key = `${item.media_type}-${item.id}`;
                const itemProviders = providersData[key];
                return (
                  <ResultCard
                    key={item.id}
                    item={item}
                    providers={itemProviders}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-ios-3xl">
              <p className="text-ios-body text-ios-secondary-label">
                {activeTab === 'movie' && `No movies found for "${searchQuery}"`}
                {activeTab === 'tv' && `No TV shows found for "${searchQuery}"`}
                {activeTab === 'all' && `No results found for "${searchQuery}"`}
              </p>
              <p className="text-ios-subhead text-ios-tertiary-label mt-ios-sm">
                {activeTab === 'movie' && 'Try switching to the TV Shows tab'}
                {activeTab === 'tv' && 'Try switching to the Movies tab'}
                {activeTab === 'all' && 'Try checking your spelling or using different keywords'}
              </p>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="mt-ios-md text-ios-tertiary-label hover:text-ios-label hover:underline ios-transition-quick ios-scale-press focus:outline-none focus:ring-2 focus:ring-ios-link/50 rounded-ios-button px-ios-xs py-ios-xs touch-manipulation"
                >
                  View all results
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-ios-sm sm:gap-ios-md">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse animate-ios-fade-slide-in"
            >
              <div className="aspect-[2/3] bg-ios-tertiary-system-background rounded-ios-card" />
              <div className="mt-ios-sm h-4 bg-ios-tertiary-system-background rounded w-3/4" />
              <div className="mt-ios-xs h-3 bg-ios-tertiary-system-background rounded w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}