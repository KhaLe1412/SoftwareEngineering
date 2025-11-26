/**
 * Test script cho các API endpoints của LIBRARY SERVICE
 * * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-library-api.js
 */

const BASE_URL = 'http://localhost:5001/api/library';

// Test Data (dựa trên lib_resource.ts)
const TEST_RESOURCE_ID = 'lib1'; // Introduction to Algorithms
const SEARCH_KEYWORD = 'Algorithms';
const FILTER_TYPE = 'textbook';

// Helper function để gọi API
async function apiCall(method, endpoint, queryParams = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(queryParams).forEach(key => {
      if (queryParams[key]) url.searchParams.append(key, queryParams[key]);
  });

  try {
    const response = await fetch(url);
    const data = await response.json().catch(() => null);
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { status: 0, ok: false, error: error.message };
  }
}

async function runLibraryTests() {
  console.log('--- BẮT ĐẦU TEST LIBRARY SERVICE ---');

  // 1. Test Get All Resources
  console.log('\nTest 1: GET /resources (No Filter)');
  const res1 = await apiCall('GET', '/resources');
  console.log(`Status: ${res1.status}`);
  if (res1.ok) {
      console.log(`Success! Found ${res1.data.length} resources.`);
  } else {
      console.log(`Failed: ${res1.data?.message}`);
  }

  // 2. Test Search (Keyword)
  console.log(`\nTest 2: GET /resources?q=${SEARCH_KEYWORD}`);
  const res2 = await apiCall('GET', '/resources', { q: SEARCH_KEYWORD });
  console.log(`Status: ${res2.status}`);
  if (res2.ok) {
      console.log(`Success! Found ${res2.data.length} items matching "${SEARCH_KEYWORD}".`);
      if (res2.data.length > 0) console.log(`   First match: ${res2.data[0].title}`);
  } else {
      console.log(`Failed: ${res2.data?.message}`);
  }

  // 3. Test Filter (Type)
  console.log(`\nTest 3: GET /resources?type=${FILTER_TYPE}`);
  const res3 = await apiCall('GET', '/resources', { type: FILTER_TYPE });
  console.log(`Status: ${res3.status}`);
  if (res3.ok) {
      console.log(`Success! Found ${res3.data.length} items of type "${FILTER_TYPE}".`);
      // Validate
      const isAllTextbook = res3.data.every(item => item.type === FILTER_TYPE);
      console.log(`   Validation: All items are textbooks? ${isAllTextbook ? 'YES' : 'NO'}`);
  } else {
      console.log(`Failed: ${res3.data?.message}`);
  }

  // 4. Test Download
  console.log(`\nTest 4: GET /resources/${TEST_RESOURCE_ID}/download`);
  const res4 = await apiCall('GET', `/resources/${TEST_RESOURCE_ID}/download`);
  console.log(`Status: ${res4.status}`);
  if (res4.ok) {
      console.log(`Success! Download link generated.`);
      console.log(`   File Name: ${res4.data.fileName}`);
      console.log(`   Download URL: ${res4.data.downloadUrl}`);
  } else {
      console.log(`Failed: ${res4.data?.message}`);
  }

  // 5. Test Download (Invalid ID)
  console.log(`\nTest 5: GET /resources/invalid-id/download`);
  const res5 = await apiCall('GET', `/resources/invalid-id/download`);
  console.log(`Status: ${res5.status}`); // Expected: 404
  if (!res5.ok) {
      console.log(`Success! Server correctly returned 404 for invalid ID.`);
  } else {
      console.log(`Failed! Server returned success for invalid ID.`);
  }

  console.log('\n--- HOÀN THÀNH TEST LIBRARY ---');
}

runLibraryTests();