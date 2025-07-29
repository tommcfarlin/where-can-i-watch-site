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
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('tv');

  // Calculate counts for each media type
  const { movieCount, tvCount, filteredResults } = useMemo(() => {
    const movies = results.results.filter(item => item.media_type === 'movie');
    const tvShows = results.results.filter(item => item.media_type === 'tv');

    let filtered = results.results;
    if (activeTab === 'movie') {
      filtered = movies;
    } else if (activeTab === 'tv') {
      filtered = tvShows;
    }

    return {
      movieCount: movies.length,
      tvCount: tvShows.length,
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
        />
      )}

      {/* Empty state for specific tabs */}
      {activeTab !== 'all' && filteredResults.length === 0 && results.results.length > 0 && (
        <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
          No {activeTab === 'tv' ? 'TV shows' : 'movies'} found for &ldquo;{searchQuery}&rdquo;
        </p>
          <button
            onClick={() => setActiveTab('all')}
            className="text-primary hover:underline"
          >
            View all results
          </button>
        </div>
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
                {activeTab === 'movie'
                  ? `No movies found for &ldquo;${searchQuery}&rdquo;`
                  : `No TV shows found for &ldquo;${searchQuery}&rdquo;`
                }
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Try switching to the {activeTab === 'movie' ? 'TV Shows' : 'Movies'} tab
              </p>
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