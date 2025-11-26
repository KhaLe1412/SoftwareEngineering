/**
 * Test script cho các API endpoints của AUTH SERVICE
 * * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-auth-api.js
 */

const BASE_URL = 'http://localhost:5001/api/auth';

// Test Data (dựa trên account.json)
const VALID_USER = { username: 'student1', password: 'fat001', userId: 's1' };
const INVALID_USER = { username: 'student1', password: 'wrong_password' };
const NEW_PASSWORD = 'new_fat001';

// Helper function để gọi API
async function apiCall(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { status: 0, ok: false, error: error.message };
  }
}

async function runAuthTests() {
  console.log('--- BẮT ĐẦU TEST AUTH SERVICE ---');

  // 1. Test Login Thành Công
  console.log('\nTest 1: POST /login (Valid Credentials)');
  const res1 = await apiCall('POST', '/login', { 
      username: VALID_USER.username, 
      password: VALID_USER.password 
  });
  console.log(`Status: ${res1.status}`);
  if (res1.ok) {
      console.log(`Success! Logged in as: ${res1.data.name} (${res1.data.role})`);
  } else {
      console.log(`Failed: ${res1.data?.message}`);
  }

  // 2. Test Login Thất Bại
  console.log('\nTest 2: POST /login (Invalid Credentials)');
  const res2 = await apiCall('POST', '/login', INVALID_USER);
  console.log(`Status: ${res2.status}`); // Expected: 401
  if (!res2.ok) {
      console.log(`Success! Server rejected invalid login: "${res2.data.message}"`);
  } else {
      console.log('Failed! Server accepted invalid credentials.');
  }

  // 3. Test Change Password (Thành công)
  // Lưu ý: Test này sẽ thay đổi mật khẩu thật trong file account.json
  console.log('\nTest 3: POST /change-password');
  const changePassBody = {
      userId: VALID_USER.userId,
      oldPassword: VALID_USER.password,
      newPassword: NEW_PASSWORD
  };
  const res3 = await apiCall('POST', '/change-password', changePassBody);
  console.log(`Status: ${res3.status}`);
  if (res3.ok) {
      console.log(`Success! ${res3.data.message}`);
      
      // 3b. Revert Password (để giữ dữ liệu sạch cho lần test sau)
      console.log('   ...Reverting password back to original...');
      await apiCall('POST', '/change-password', {
          userId: VALID_USER.userId,
          oldPassword: NEW_PASSWORD,
          newPassword: VALID_USER.password
      });
      console.log('   Password reverted.');
  } else {
      console.log(`Failed: ${res3.data?.message}`);
  }

  console.log('\n--- HOÀN THÀNH TEST AUTH ---');
}

runAuthTests();