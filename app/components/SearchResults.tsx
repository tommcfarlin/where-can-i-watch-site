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
      {(results as any).detectedFranchise && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm">
            <span className="font-semibold text-purple-700 dark:text-purple-300">
              🎬 Franchise detected!
            </span>
            <span className="text-gray-700 dark:text-gray-300 ml-2">
              Showing additional {(results as any).detectedFranchise} universe content that might not contain "{searchQuery}" in the title.
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

      {/* No Results */}
      {!hasResults && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No results found for "{searchQuery}"
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
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === 'movie'
                  ? `No movies found for "${searchQuery}"`
                  : `No TV shows found for "${searchQuery}"`
                }
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
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
              <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="mt-1 h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}