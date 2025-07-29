import { NextRequest, NextResponse } from 'next/server';
import { getTMDBClient, TMDBApiError } from '@/lib/tmdb';
import { MediaType } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const mediaType = searchParams.get('type') as MediaType;

    // Validate parameters
    if (!id || !mediaType) {
      return NextResponse.json(
        { error: 'Both id and type parameters are required' },
        { status: 400 }
      );
    }

    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return NextResponse.json(
        { error: 'Type must be either "movie" or "tv"' },
        { status: 400 }
      );
    }

    // Get TMDB client and fetch external IDs
    const client = getTMDBClient();
    const externalIds = await client.getExternalIds(parseInt(id), mediaType);

    return NextResponse.json({
      success: true,
      external_ids: externalIds,
    });

  } catch (error) {
    console.error('External IDs API error:', error);

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