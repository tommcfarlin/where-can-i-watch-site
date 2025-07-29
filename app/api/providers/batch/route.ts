import { NextRequest, NextResponse } from 'next/server';
import { getTMDBClient, TMDBApiError } from '@/lib/tmdb';
import { MediaType, CountryProviders } from '@/types/tmdb';

interface BatchProviderRequest {
  id: number;
  media_type: MediaType;
}

interface BatchProviderResponse {
  id: number;
  media_type: MediaType;
  providers: CountryProviders | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: BatchProviderRequest[] = body.items;

    // Validate request
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 items allowed per batch request' },
        { status: 400 }
      );
    }

    const client = getTMDBClient();
    const results: BatchProviderResponse[] = [];

    // Process requests with rate limiting consideration
    // Add small delay between requests to respect rate limits
    for (const item of items) {
      try {
        // Validate item
        if (!item.id || !item.media_type) {
          results.push({
            id: item.id || 0,
            media_type: item.media_type || 'movie',
            providers: null,
          });
          continue;
        }

        if (item.media_type !== 'movie' && item.media_type !== 'tv') {
          results.push({
            id: item.id,
            media_type: item.media_type,
            providers: null,
          });
          continue;
        }

        // Fetch providers
        const providers = await client.getWatchProviders(item.id, item.media_type);

        // Extract US providers (or return empty if not available)
        const usProviders = providers.results.US || {
          flatrate: [],
          buy: [],
          rent: [],
          free: []
        };

        results.push({
          id: item.id,
          media_type: item.media_type,
          providers: usProviders,
        });

        // Small delay to respect rate limits (only if not the last item)
        if (items.indexOf(item) < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`Failed to fetch providers for ${item.media_type}/${item.id}:`, error);
        results.push({
          id: item.id,
          media_type: item.media_type,
          providers: null,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error('Batch providers API error:', error);

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