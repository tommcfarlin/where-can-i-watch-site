import { NextRequest, NextResponse } from 'next/server';
import { getTMDBClient, TMDBApiError } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    // Get query parameter
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';

    // Validate query
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Get TMDB client and perform search
    const client = getTMDBClient();
    const results = await client.searchMulti(query, parseInt(page));

    // Filter out person results (we only want movies and TV shows)
    const filteredResults = {
      ...results,
      results: results.results.filter(item => item.media_type !== 'person')
    };

    return NextResponse.json(filteredResults);
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
