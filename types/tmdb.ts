// TMDB API Response Types

// Common types
export type MediaType = 'movie' | 'tv' | 'person';

// Base media item (common fields between movies and TV shows)
export interface BaseMediaItem {
  id: number;
  overview: string;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  media_type?: MediaType;
}

// Movie specific fields
export interface MovieItem extends BaseMediaItem {
  title: string;
  original_title: string;
  release_date: string;
  adult: boolean;
  video: boolean;
}

// TV show specific fields
export interface TVItem extends BaseMediaItem {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

// Combined search result type
export type SearchResultItem = (MovieItem | TVItem) & {
  media_type: MediaType;
};

// Search response
export interface SearchMultiResponse {
  page: number;
  results: SearchResultItem[];
  total_pages: number;
  total_results: number;
}

// Provider types
export interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface CountryProviders {
  link?: string;
  flatrate?: Provider[];  // Subscription services
  buy?: Provider[];       // Purchase options
  rent?: Provider[];      // Rental options
  free?: Provider[];      // Free with ads
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: CountryProviders;
  };
}

// Movie details (for future use)
export interface MovieDetails extends Omit<MovieItem, 'media_type' | 'genre_ids'> {
  adult: boolean;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
}

// TV details (for future use)
export interface TVDetails extends Omit<TVItem, 'media_type' | 'genre_ids'> {
  created_by: Creator[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode | null;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
}

// Supporting types
export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

// Error response
export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

// Type guards
export function isMovieItem(item: SearchResultItem): item is MovieItem & { media_type: MediaType } {
  return item.media_type === 'movie';
}

export function isTVItem(item: SearchResultItem): item is TVItem & { media_type: MediaType } {
  return item.media_type === 'tv';
}

export function isTMDBError(response: any): response is TMDBError {
  return response && typeof response.status_code === 'number' && !response.results;
}
