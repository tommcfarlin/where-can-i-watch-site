'use client';

import { useState, useMemo } from 'react';
import { ExtendedSearchResponse } from '@/types/tmdb';
import ResultCard from './ResultCard';
import DidYouMean from './DidYouMean';
import Tabs from './Tabs';

interface SearchResultsProps {
  results: ExtendedSearchResponse;
  isLoading: boolean;
  searchQuery: string;
}

export default function SearchResults({ results, isLoading, searchQuery }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv' | 'not-streaming'>('tv');

  // Calculate counts for each media type including streaming status
  const { movieCount, tvCount, notStreamingCount, filteredResults } = useMemo(() => {
    // For now, treat all results as streaming until we implement the streaming detection logic
    // This will be updated in Task 3.2
    const movies = results.results.filter(item => item.media_type === 'movie');
    const tvShows = results.results.filter(item => item.media_type === 'tv');
    const notStreaming: any[] = []; // Placeholder - will be implemented in next task

    let filtered = results.results;
    if (activeTab === 'movie') {
      filtered = movies;
    } else if (activeTab === 'tv') {
      filtered = tvShows;
    } else if (activeTab === 'not-streaming') {
      filtered = notStreaming;
    }

    return {
      movieCount: movies.length,
      tvCount: tvShows.length,
      notStreamingCount: notStreaming.length,
      filteredResults: filtered,
    };
  }, [results.results, activeTab]);

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
                <div className="mb-6 p-4 bg-card rounded-lg border border-muted">
          <p className="text-sm">
            <span className="font-semibold text-foreground">
              🎬 Franchise detected!
            </span>
            <span className="text-muted-foreground ml-2">
              Showing additional {(results as ExtendedSearchResponse & { detectedFranchise?: string }).detectedFranchise} universe content that might not contain &ldquo;{searchQuery}&rdquo; in the title.
            </span>
          </p>
        </div>
      )}

      {/* Tabs for filtering */}
      {hasResults && !isLoading && (
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          movieCount={movieCount}
          tvCount={tvCount}
          notStreamingCount={notStreamingCount}
        />
      )}



      {/* General empty state */}
      {results.results.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Try checking your spelling or using different keywords
          </p>
        </div>
      )}

      {/* Results Grid */}
      {hasResults && !isLoading && (
        <>
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredResults.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {activeTab === 'movie' && `No movies found for "${searchQuery}"`}
                {activeTab === 'tv' && `No TV shows found for "${searchQuery}"`}
                {activeTab === 'not-streaming' && `No non-streaming content found for "${searchQuery}"`}
                {activeTab === 'all' && `No results found for "${searchQuery}"`}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {activeTab === 'movie' && 'Try switching to the TV Shows tab'}
                {activeTab === 'tv' && 'Try switching to the Movies tab'}
                {activeTab === 'not-streaming' && 'Try switching to the All tab'}
                {activeTab === 'all' && 'Try checking your spelling or using different keywords'}
              </p>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="mt-4 text-muted-foreground hover:text-foreground hover:underline transition-colors"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
            >
                      <div className="aspect-[2/3] bg-muted rounded-lg" />
        <div className="mt-2 h-4 bg-muted rounded w-3/4" />
        <div className="mt-1 h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}