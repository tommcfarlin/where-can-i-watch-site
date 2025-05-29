import { NextResponse } from 'next/server';
import { getFuzzySearchService } from '@/lib/fuzzy-search';
import { getPopularTitlesCache } from '@/lib/popular-titles-cache';

export async function GET() {
  try {
    console.log('🚀 Initializing services...');

    // Warm up the fuzzy search service (which also loads the cache)
    const fuzzySearch = getFuzzySearchService();
    await fuzzySearch.warmUp();

    // Get statistics
    const stats = await fuzzySearch.getStats();

    return NextResponse.json({
      success: true,
      message: 'Services initialized successfully',
      stats
    });
  } catch (error) {
    console.error('Initialization error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize services',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
