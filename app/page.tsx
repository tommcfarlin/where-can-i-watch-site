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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header - iOS Typography */}
        <header className="text-center mb-ios-2xl mt-ios-lg animate-fade-in">
          <h1 className="text-ios-large-title font-ios-bold text-foreground mb-ios-sm">
            Where Can I Watch?
          </h1>
          <p className="text-ios-body text-muted-foreground">
            Find out which streaming services have your favorite movies and TV shows
          </p>
        </header>

        {/* Search Section */}
        <div className={`transition-all duration-500 ${searchResults ? 'mb-8' : 'mb-32'}`}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="bg-card border border-muted rounded-lg p-4">
              <p className="text-foreground">{error}</p>
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
