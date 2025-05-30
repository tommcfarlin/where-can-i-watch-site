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
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a movie or TV show..."
          className="w-full pl-14 pr-24 py-4 text-lg bg-card text-card-foreground rounded-full shadow-lg shadow-black/5 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground border border-transparent hover:border-primary/20"
          autoFocus
        />

        {/* Search Icon */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-primary"
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
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110"
          >
            <svg
              className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}