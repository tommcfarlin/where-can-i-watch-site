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

        // Fetch providers with comprehensive error handling
        const providers = await client.getWatchProviders(item.id, item.media_type);

        // Validate provider response structure
        if (!providers || typeof providers !== 'object' || !providers.results) {
          console.warn(`Invalid provider response for ${item.media_type}/${item.id}:`, providers);
          results.push({
            id: item.id,
            media_type: item.media_type,
            providers: null,
          });
          continue;
        }

        // Extract US providers with comprehensive null safety
        const rawUSProviders = providers.results.US;

        // Helper function to safely filter and validate provider arrays
        const safeProviderArray = (arr: any[] | undefined | null) => {
          if (!Array.isArray(arr)) return [];
          return arr.filter(provider =>
            provider &&
            typeof provider === 'object' &&
            provider.provider_id &&
            provider.provider_name &&
            provider.logo_path
          );
        };

        const usProviders = {
          flatrate: safeProviderArray(rawUSProviders?.flatrate),
          buy: safeProviderArray(rawUSProviders?.buy),
          rent: safeProviderArray(rawUSProviders?.rent),
          free: safeProviderArray(rawUSProviders?.free),
          link: rawUSProviders?.link || undefined
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

        // Log additional details for debugging
        if (error instanceof Error) {
          console.error(`Error details: ${error.message}`);
          console.error(`Stack trace: ${error.stack}`);
        }

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