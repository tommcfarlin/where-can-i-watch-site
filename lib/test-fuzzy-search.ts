// Test script for fuzzy search functionality
// Run with: npx tsx lib/test-fuzzy-search.ts

const FUZZY_API_BASE = 'http://localhost:3000/api';

async function testEndpoint(name: string, url: string) {
  console.log(`\n📡 Testing ${name}...`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Error: ${response.status}`, data);
      return;
    }

    console.log(`✅ Success!`);
    return data;
  } catch (error) {
    console.error(`❌ Failed:`, error);
  }
}

async function runTests() {
  console.log('🧪 Testing Fuzzy Search...\n');
  console.log('Make sure the dev server is running: npm run dev\n');

  // First, initialize the fuzzy search cache
  console.log('📥 Initializing fuzzy search cache...');
  const initResult = await testEndpoint(
    'Initialize Services',
    `${FUZZY_API_BASE}/init`
  );

  if (initResult?.stats) {
    console.log('Cache stats:', initResult.stats);
  }

  // Wait a moment for cache to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 1: Misspelled "The Ofice" (missing 'f')
  const oficeResult = await testEndpoint(
    'Search - "The Ofice" (misspelled)',
    `${FUZZY_API_BASE}/search?query=${encodeURIComponent('The Ofice')}`
  );

  if (oficeResult?.suggestion) {
    console.log(`🎯 Suggestion: "${oficeResult.suggestion.suggestion}" (confidence: ${oficeResult.suggestion.confidence.toFixed(2)})`);
    console.log(`📝 Did auto-correct: ${oficeResult.didAutoCorrect}`);
  }

  // Test 2: More misspellings
  const testQueries = [
    'Strager Things',     // Stranger Things
    'Breakng Bad',        // Breaking Bad
    'Freinds',           // Friends
    'The Mandolorian',   // The Mandalorian
    'Spiderman',         // Spider-Man
  ];

  for (const query of testQueries) {
    const result = await testEndpoint(
      `Search - "${query}"`,
      `${FUZZY_API_BASE}/search?query=${encodeURIComponent(query)}`
    );

    if (result?.suggestion) {
      console.log(`🎯 Suggestion: "${result.suggestion.suggestion}" (confidence: ${result.suggestion.confidence.toFixed(2)})`);
    }
    if (result?.results?.[0]) {
      const firstResult = result.results[0];
      console.log(`📺 First result: ${firstResult.title || firstResult.name}`);
    }
  }

  // Test 3: Disable auto-correct
  const noAutoCorrect = await testEndpoint(
    'Search - "The Ofice" (auto-correct disabled)',
    `${FUZZY_API_BASE}/search?query=${encodeURIComponent('The Ofice')}&autoCorrect=false`
  );

  console.log(`📝 Auto-correct disabled - Did auto-correct: ${noAutoCorrect?.didAutoCorrect}`);
  if (noAutoCorrect?.suggestion) {
    console.log(`💡 Still got suggestion: "${noAutoCorrect.suggestion.suggestion}"`);
  }

  console.log('\n✅ All tests complete!');
}

runTests();