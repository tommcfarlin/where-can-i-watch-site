// TMDB API Test Script
// Run with: npx tsx lib/tmdb-test.ts

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.error('❌ TMDB_API_KEY not found in environment');
  console.log('Make sure to run: source .env.local or add to shell');
  process.exit(1);
}

console.log('🔑 API Key found:', API_KEY.substring(0, 5) + '...');

async function testEndpoint(name: string, url: string) {
  console.log(`\n📡 Testing ${name}...`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Error: ${response.status} - ${data.status_message}`);
      return;
    }

    console.log(`✅ Success! Results:`, JSON.stringify(data, null, 2).substring(0, 500) + '...');
    return data;
  } catch (error) {
    console.error(`❌ Failed:`, error);
  }
}

async function runTests() {
  console.log('🧪 Starting TMDB API Tests...\n');

  // Test 1: Search for "The Office"
  await testEndpoint(
    'Search Multi - "The Office"',
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent('The Office')}`
  );

  // Test 2: Search for misspelled "The Ofice"
  await testEndpoint(
    'Search Multi - "The Ofice" (misspelled)',
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent('The Ofice')}`
  );

  // Test 3: Get TV show details (The Office US - ID: 2316)
  await testEndpoint(
    'TV Details - The Office (US)',
    `${BASE_URL}/tv/2316?api_key=${API_KEY}`
  );

  // Test 4: Get watch providers for The Office
  const providers = await testEndpoint(
    'Watch Providers - The Office (US)',
    `${BASE_URL}/tv/2316/watch/providers?api_key=${API_KEY}`
  );

  if (providers?.results?.US) {
    console.log('\n📺 US Streaming Providers:');
    if (providers.results.US.flatrate) {
      console.log('Subscription:', providers.results.US.flatrate.map((p: any) => p.provider_name).join(', '));
    }
    if (providers.results.US.buy) {
      console.log('Purchase:', providers.results.US.buy.map((p: any) => p.provider_name).join(', '));
    }
  }

  // Test 5: Popular movies (for fuzzy search database)
  await testEndpoint(
    'Popular Movies',
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`
  );

  console.log('\n✅ All tests complete!');
}

runTests();
