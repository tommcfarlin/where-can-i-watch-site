'use client';

import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<number | null>(null);

  // Debounced search function
  const debouncedSearch = (searchQuery: string) => {
    // Clear any existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only search if query is empty or has at least 3 characters
    if (searchQuery.length === 0 || searchQuery.length >= 3) {
      debounceTimer.current = window.setTimeout(() => {
        onSearch(searchQuery);
      }, 500);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto animate-fade-up">
      <div className="relative group">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder="Search movies or TV shows..."
          className="w-full h-11 pl-12 pr-10 text-sm bg-accents-1 text-foreground rounded-md border border-accents-3 focus:outline-none focus:border-primary focus:bg-accents-2 transition-all duration-200 placeholder:text-accents-5"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
          role="searchbox"
          aria-label="Search movies and TV shows"
          aria-describedby="search-help"
          aria-expanded={query.length > 0}
          aria-autocomplete="list"
          autoFocus
        />

        {/* Hidden help text for screen readers */}
        <div id="search-help" className="sr-only">
          Start typing to search for movies or TV shows. Results will appear automatically as you type.
        </div>

        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-accents-5 transition-colors duration-200 group-focus-within:text-accents-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <LoadingSpinner size="sm" color="secondary" showPulse />
          </div>
        )}

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accents-5 hover:bg-accents-7 transition-all duration-200 flex items-center justify-center"
          >
            <svg
              className="w-3 h-3 text-accents-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
