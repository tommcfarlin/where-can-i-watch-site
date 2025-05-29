// Test script for API routes
// Run with: npx tsx lib/test-api-routes.ts

const API_BASE_URL = 'http://localhost:3000/api';

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
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    return data;
  } catch (error) {
    console.error(`❌ Failed:`, error);
  }
}

async function runTests() {
  console.log('🧪 Testing API Routes...\n');
  console.log('Make sure the dev server is running: npm run dev\n');

  // Test 1: Search endpoint
  const searchResult = await testEndpoint(
    'Search - "The Office"',
    `${API_BASE_URL}/search?query=${encodeURIComponent('The Office')}`
  );

  // Test 2: Search with misspelling
  await testEndpoint(
    'Search - "The Ofice" (misspelled)',
    `${API_BASE_URL}/search?query=${encodeURIComponent('The Ofice')}`
  );

  // Test 3: Get providers for The Office (if we found it)
  if (searchResult?.results?.[0]) {
    const firstResult = searchResult.results[0];
    await testEndpoint(
      `Providers - ${firstResult.title || firstResult.name}`,
      `${API_BASE_URL}/providers?id=${firstResult.id}&type=${firstResult.media_type}`
    );
  }

  // Test 4: Error handling - missing query
  await testEndpoint(
    'Search - Missing query (should error)',
    `${API_BASE_URL}/search`
  );

  console.log('\n✅ All tests complete!');
}

runTests();