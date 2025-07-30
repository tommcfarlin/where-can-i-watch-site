'use client';

import { useState, useEffect, useRef } from 'react';

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

    // Only search if query is empty or has at least 2 characters
    if (searchQuery.length === 0 || searchQuery.length >= 2) {
      debounceTimer.current = window.setTimeout(() => {
        onSearch(searchQuery);
      }, 300);
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
      <div className="relative group ios-search-container">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder="Search movies or TV shows..."
          className="w-full h-11 pl-12 pr-ios-xl text-ios-body bg-ios-secondary-system-background text-ios-label rounded-ios-button border-0 focus:outline-none focus:bg-ios-tertiary-system-background focus:shadow-sm transition-all duration-200 placeholder:text-ios-tertiary-label touch-manipulation"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
          role="searchbox"
          aria-label="Search movies and TV shows"
          autoFocus
        />

        {/* Search Icon - iOS Style */}
        <div className="absolute left-ios-md top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-ios-tertiary-label transition-colors duration-200 group-focus-within:text-ios-secondary-label"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </div>

        {/* Loading Spinner - iOS Style */}
        {isLoading && (
          <div className="absolute right-ios-md top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-ios-secondary-label"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Clear Button - iOS Style */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-ios-md top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-ios-tertiary-label hover:bg-ios-secondary-label transition-all duration-200 flex items-center justify-center touch-manipulation active:scale-95"
          >
            <svg
              className="w-3 h-3 text-ios-system-background"
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
