'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { ExtendedSearchResponse } from '@/types/tmdb';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExtendedSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the fuzzy search cache on mount
  useEffect(() => {
    fetch('/api/init')
      .then(res => res.json())
      .then(data => console.log('Cache initialized:', data))
      .catch(err => console.error('Failed to initialize cache:', err));
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Where Can I Watch?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find out which streaming services have your favorite movies and TV shows
          </p>
        </header>

        {/* Search Section */}
        <div className={`transition-all duration-500 ${searchResults ? 'mb-8' : 'mt-20'}`}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && !error && (
          <SearchResults
            results={searchResults}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        )}

        {/* Initial State */}
        {!searchResults && !error && !isLoading && (
          <div className="text-center mt-20">
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Try searching for your favorite movie or TV show
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {['The Office', 'Stranger Things', 'Breaking Bad', 'The Mandalorian'].map((title) => (
                <button
                  key={title}
                  onClick={() => handleSearch(title)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
