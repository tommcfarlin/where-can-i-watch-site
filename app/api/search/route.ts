import { NextRequest, NextResponse } from 'next/server';
import { getTMDBClient, TMDBApiError } from '@/lib/tmdb';
import { getFuzzySearchService } from '@/lib/fuzzy-search';
import { detectFranchise, getFranchiseSearchTerms } from '@/lib/franchise-mappings';
import { ExtendedSearchResponse } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const autoCorrect = searchParams.get('autoCorrect') !== 'false'; // Default true

    // Validate query
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Get TMDB client and fuzzy search service
    const client = getTMDBClient();
    const fuzzySearch = getFuzzySearchService();

    // Perform the initial search
    const results = await client.searchMulti(query, parseInt(page));

    // Filter out person results (we only want movies and TV shows)
    const filteredResults = results.results.filter(item => item.media_type !== 'person');

    // Check for franchise detection
    const detectedFranchise = detectFranchise(query);

    if (detectedFranchise && page === '1') {
      // Get additional franchise-related titles
      const franchiseTerms = getFranchiseSearchTerms(detectedFranchise);
      const seenIds = new Set(filteredResults.map(item => `${item.media_type}-${item.id}`));

      // Search for each related title
      for (const relatedTitle of franchiseTerms.slice(0, 5)) { // Limit to avoid too many API calls
        try {
          const relatedResults = await client.searchMulti(relatedTitle, 1);
          const relatedFiltered = relatedResults.results
            .filter(item => item.media_type !== 'person')
            .filter(item => !seenIds.has(`${item.media_type}-${item.id}`));

          // Add unique results
          for (const item of relatedFiltered) {
            seenIds.add(`${item.media_type}-${item.id}`);
            filteredResults.push(item);
          }
        } catch (error) {
          // Continue with other searches if one fails
          console.error(`Failed to search for related title "${relatedTitle}":`, error);
        }
      }
    }

    // Check if we should suggest a correction
    const suggestion = await fuzzySearch.getSuggestion(query);
    const hasLikelyTypo = await fuzzySearch.hasLikelyTypo(query, filteredResults.length);

    // Prepare response
    const response = {
      ...results,
      results: filteredResults,
      suggestion: null,
      didAutoCorrect: false,
      detectedFranchise
    } as ExtendedSearchResponse & { detectedFranchise?: string };

    // If we have a likely typo and a good suggestion
    if (hasLikelyTypo && suggestion && autoCorrect) {
      // Re-search with the corrected query
      const correctedResults = await client.searchMulti(suggestion.suggestion, 1);
      const correctedFiltered = correctedResults.results.filter(item => item.media_type !== 'person');

      // If the corrected search has better results, use those
      if (correctedFiltered.length > filteredResults.length) {
        response.results = correctedFiltered;
        response.total_results = correctedResults.total_results;
        response.total_pages = correctedResults.total_pages;
        response.suggestion = suggestion;
        response.didAutoCorrect = true;
        response.originalQuery = query;
      } else {
        // Still provide the suggestion but keep original results
        response.suggestion = suggestion;
      }
    } else if (suggestion && filteredResults.length < 3) {
      // Provide suggestion even without auto-correct
      response.suggestion = suggestion;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);

    if (error instanceof TMDBApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
