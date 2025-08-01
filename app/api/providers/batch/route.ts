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
  let currentItem: BatchProviderRequest | null = null;

  try {
    const body = await request.json();
    const items: BatchProviderRequest[] = body.items;

    // 🔍 COMPREHENSIVE DEBUGGING LOGGING
    console.log('🔍 Batch request received:', {
      itemCount: items?.length || 0,
      requestBody: JSON.stringify(body, null, 2)
    });
    console.log('📊 Processing items:', items?.length);

    if (items?.length > 0) {
      items.forEach((item, index) => {
        console.log(`🎬 Item ${index}:`, {
          id: item?.id,
          media_type: item?.media_type,
          hasId: !!item?.id,
          hasMediaType: !!item?.media_type
        });
      });
    }

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
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      currentItem = item; // Track current item for error context

      try {
        console.log(`\n📡 Processing item ${itemIndex}/${items.length}:`, {
          id: item?.id,
          media_type: item?.media_type,
          itemData: JSON.stringify(item, null, 2)
        });

        // Validate item
        if (!item?.id || !item?.media_type) {
          console.log(`⚠️  Invalid item data - skipping:`, {
            hasId: !!item?.id,
            hasMediaType: !!item?.media_type,
            item: item
          });
          results.push({
            id: item?.id || 0,
            media_type: item?.media_type || 'movie',
            providers: null,
          });
          continue;
        }

        if (item.media_type !== 'movie' && item.media_type !== 'tv') {
          console.log(`⚠️  Invalid media type '${item.media_type}' - skipping`);
          results.push({
            id: item.id,
            media_type: item.media_type,
            providers: null,
          });
          continue;
        }

        // Fetch providers with comprehensive error handling
        console.log(`📡 Fetching providers for ${item.media_type} ${item.id}`);
        const providers = await client.getWatchProviders(item.id, item.media_type);
        console.log(`✅ Raw TMDB response for ${item.media_type}/${item.id}:`, {
          hasResults: !!providers?.results,
          hasUS: !!providers?.results?.US,
          responseKeys: providers ? Object.keys(providers) : [],
          resultsKeys: providers?.results ? Object.keys(providers.results) : []
        });

                // Validate provider response structure
        if (!providers || typeof providers !== 'object' || !providers.results) {
          console.warn(`⚠️  Invalid provider response for ${item.media_type}/${item.id}:`, {
            providers: providers,
            isObject: typeof providers === 'object',
            hasResults: !!providers?.results
          });
          results.push({
            id: item.id,
            media_type: item.media_type,
            providers: null,
          });
          continue;
        }

        // Extract US providers with comprehensive null safety
        const rawUSProviders = providers.results.US;
        console.log(`🇺🇸 US providers data for ${item.media_type}/${item.id}:`, {
          hasUSData: !!rawUSProviders,
          flatrateCount: rawUSProviders?.flatrate?.length || 0,
          buyCount: rawUSProviders?.buy?.length || 0,
          rentCount: rawUSProviders?.rent?.length || 0,
          freeCount: rawUSProviders?.free?.length || 0,
          hasLink: !!rawUSProviders?.link
        });

        // Helper function to safely filter and validate provider arrays
        const safeProviderArray = (arr: any[] | undefined | null, arrayName: string) => {
          console.log(`🔍 Processing ${arrayName} array:`, {
            isArray: Array.isArray(arr),
            length: arr?.length || 0,
            sample: arr?.[0] || null
          });

          if (!Array.isArray(arr)) {
            console.log(`⚠️  ${arrayName} is not an array:`, arr);
            return [];
          }

          const filtered = arr.filter((provider, providerIndex) => {
            const isValid = provider &&
              typeof provider === 'object' &&
              provider.provider_id &&
              provider.provider_name &&
              provider.logo_path;

            if (!isValid) {
              console.log(`⚠️  Invalid provider in ${arrayName}[${providerIndex}]:`, {
                provider: provider,
                hasObject: typeof provider === 'object',
                hasId: !!provider?.provider_id,
                hasName: !!provider?.provider_name,
                hasLogo: !!provider?.logo_path
              });
            }

            return isValid;
          });

          console.log(`✅ ${arrayName} filtered: ${arr.length} → ${filtered.length} valid providers`);
          return filtered;
        };

        const usProviders = {
          flatrate: safeProviderArray(rawUSProviders?.flatrate, 'flatrate'),
          buy: safeProviderArray(rawUSProviders?.buy, 'buy'),
          rent: safeProviderArray(rawUSProviders?.rent, 'rent'),
          free: safeProviderArray(rawUSProviders?.free, 'free'),
          link: rawUSProviders?.link || undefined
        };

        console.log(`📦 Final processed providers for ${item.media_type}/${item.id}:`, {
          flatrateCount: usProviders.flatrate.length,
          buyCount: usProviders.buy.length,
          rentCount: usProviders.rent.length,
          freeCount: usProviders.free.length,
          hasLink: !!usProviders.link
        });

                const resultObject = {
          id: item.id,
          media_type: item.media_type,
          providers: usProviders,
        };

        console.log(`✅ Successfully processed ${item.media_type}/${item.id} - adding to results`);
        results.push(resultObject);

        // Small delay to respect rate limits (only if not the last item)
        if (itemIndex < items.length - 1) {
          console.log(`⏱️  Rate limiting delay (${itemIndex + 1}/${items.length})`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`❌ Failed to fetch providers for ${item?.media_type}/${item?.id}:`, {
          error: error,
          currentItem: currentItem,
          itemIndex: itemIndex,
          totalItems: items.length
        });

        // Log additional details for debugging
        if (error instanceof Error) {
          console.error(`❌ Error details:`, {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
          });
        }

        const errorResult = {
          id: item?.id || 0,
          media_type: item?.media_type || 'movie',
          providers: null,
        };

        console.log(`⚠️  Adding error result for failed item:`, errorResult);
        results.push(errorResult);
      }
    }

    console.log(`\n🎉 Batch processing complete:`, {
      totalItems: items.length,
      successfulResults: results.length,
      resultsWithProviders: results.filter(r => r.providers !== null).length,
      resultsWithoutProviders: results.filter(r => r.providers === null).length
    });

    const response = {
      success: true,
      results,
      resultCount: results.length
    };

    console.log(`📤 Returning response:`, {
      success: response.success,
      resultCount: response.resultCount,
      sampleResult: results[0] || null
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ BATCH PROVIDERS API ERROR:', {
      error: error,
      currentItem: currentItem,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      resultCount: 0,
      currentItem: currentItem
    };

    console.log(`📤 Returning error response:`, errorResponse);

    if (error instanceof TMDBApiError) {
      return NextResponse.json(
        errorResponse,
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}