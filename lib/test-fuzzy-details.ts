// Detailed test for fuzzy search debugging
// Run with: npx tsx lib/test-fuzzy-details.ts

import { getPopularTitlesCache } from './popular-titles-cache';
import { getFuzzySearchService } from './fuzzy-search';

async function runDetailedTests() {
  console.log('🔍 Detailed Fuzzy Search Analysis\n');

  // Initialize services
  const cache = getPopularTitlesCache();
  const fuzzySearch = getFuzzySearchService();

  // Warm up
  await fuzzySearch.warmUp();

  // Get all titles
  const titles = await cache.getTitles();
  console.log(`📊 Total titles in cache: ${titles.length}\n`);

  // Check for specific popular titles
  const searchFor = ['The Office', 'Friends', 'Breaking Bad', 'Stranger Things', 'The Mandalorian'];

  console.log('🎯 Checking if popular titles are in cache:');
  for (const title of searchFor) {
    const found = titles.find(t =>
      t.originalTitle.toLowerCase() === title.toLowerCase()
    );
    console.log(`  ${found ? '✅' : '❌'} "${title}" ${found ? `(ID: ${found.id})` : 'NOT FOUND'}`);
  }

  // Show top 10 most popular titles
  console.log('\n📈 Top 10 most popular titles in cache:');
  titles.slice(0, 10).forEach((title, index) => {
    console.log(`  ${index + 1}. ${title.originalTitle} (${title.mediaType}, popularity: ${title.popularity.toFixed(1)})`);
  });

  // Test fuzzy matching with details
  console.log('\n🧪 Testing fuzzy matches:');
  const testQueries = [
    { query: 'The Ofice', expected: 'The Office' },
    { query: 'Strager Things', expected: 'Stranger Things' },
    { query: 'Breakng Bad', expected: 'Breaking Bad' },
    { query: 'Freinds', expected: 'Friends' },
  ];

  for (const test of testQueries) {
    const results = await fuzzySearch.search(test.query, 5);
    console.log(`\n  Query: "${test.query}" (expecting: "${test.expected}")`);

    if (results.length === 0) {
      console.log('    ❌ No matches found');
    } else {
      console.log('    Top matches:');
      results.slice(0, 3).forEach((result, index) => {
        const isExpected = result.item.originalTitle === test.expected;
        console.log(`      ${index + 1}. ${isExpected ? '✅' : '  '} "${result.item.originalTitle}" (score: ${result.score.toFixed(3)})`);
      });
    }
  }

  // Test the suggestion API
  console.log('\n💡 Testing suggestion API:');
  for (const test of testQueries) {
    const suggestion = await fuzzySearch.getSuggestion(test.query);
    if (suggestion) {
      const isCorrect = suggestion.suggestion === test.expected;
      console.log(`  "${test.query}" → ${isCorrect ? '✅' : '❌'} "${suggestion.suggestion}" (confidence: ${suggestion.confidence.toFixed(2)})`);
    } else {
      console.log(`  "${test.query}" → ❌ No suggestion`);
    }
  }
}

runDetailedTests().catch(console.error);