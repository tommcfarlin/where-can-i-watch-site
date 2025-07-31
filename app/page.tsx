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

  // Apply permanent dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

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
          <div className="min-h-screen bg-background text-ios-label">
              <div className="container mx-auto px-ios-md max-w-7xl">
        {/* Header - iOS Typography with Proper Safe Area */}
                  <header
                    className="text-center mb-ios-2xl animate-ios-fade-slide-in"
                    style={{
                      paddingTop: 'max(var(--ios-safe-padding-top), 48px)',
                      marginTop: '32px'
                    }}
                  >
          <h1 className="text-ios-large-title font-ios-bold text-ios-label mb-ios-sm">
            Where Can I Watch?
          </h1>
          <p className="text-ios-body text-ios-secondary-label max-w-md mx-auto">
            Find out which streaming services have your favorite movies and TV shows
          </p>
        </header>

        {/* Search Section */}
        <div className={`ios-transition-emphasized ${searchResults ? 'mb-ios-md' : 'mb-ios-4xl'}`}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-ios-sm animate-ios-fade-slide-in">
            <div className="bg-card border border-muted rounded-ios-card p-ios-md">
              <p className="text-ios-label">{error}</p>
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
      </div>
    </div>
  );
}
