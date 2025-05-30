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
  const [darkMode, setDarkMode] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  // Initialize dark mode from system preference and listen for changes
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme-preference');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Apply saved preference or system preference
    if (savedTheme === 'dark' || (savedTheme !== 'light' && systemPrefersDark.matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Listen for system theme changes (only if not manually overridden)
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-preference')) {
        setDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }
    };

    systemPrefersDark.addEventListener('change', handleChange);
    return () => systemPrefersDark.removeEventListener('change', handleChange);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setManualOverride(true);

    // Save preference
    localStorage.setItem('theme-preference', newDarkMode ? 'dark' : 'light');

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

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
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 rounded-full bg-card shadow-lg shadow-black/5 hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16 mt-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Where Can I Watch?
          </h1>
          <p className="text-lg text-muted-foreground">
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
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-400">{error}</p>
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
