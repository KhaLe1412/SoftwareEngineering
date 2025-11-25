/**
 * Test script cho các API endpoints của Request Management
 * (Sessions: Join, Leave, Reschedule, Approve/Reject, Auto-match)
 * * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-request-api.js
 */

const BASE_URL = 'http://localhost:5001/api';

// Test Data dựa trên session.ts và reschedule_request.ts
const TEST_STUDENT_ID = 's1'; // Student s1 (đang học ses1)
const TEST_TUTOR_ID = 't1';   // Tutor t1 (dạy ses1)
const TEST_SESSION_ID = 'ses1'; // Session Data Structures
const TEST_EMPTY_SESSION_ID = 'ses7'; // Session Graph Algorithms (đang open và chưa có student)
const TEST_EXISTING_REQUEST_ID = 'rr2'; // Request có sẵn trong mock data (status: pending)

// Helper function để gọi API (Giữ nguyên từ file cũ)
async function apiCall(method, endpoint, body = null, queryParams = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Thêm query params
  if (method === 'GET' && queryParams.userId) {
    url.searchParams.append('userId', queryParams.userId);
  }
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Thêm body cho POST/PATCH/DELETE
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    
    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

// --- Test Functions ---

// 1. Test Auto Match
async function testAutoMatch() {
  console.log('\nTest 1: POST /api/sessions/auto-match');
  const body = { studentId: TEST_STUDENT_ID };
  
  const result = await apiCall('POST', '/sessions/auto-match', body);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Matched with session: ${result.data.matchedSession.subject} (${result.data.matchedSession.id})`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 2. Test Join Session
async function testJoinSession() {
  console.log(`\nTest 2: POST /api/sessions/${TEST_EMPTY_SESSION_ID}/join`);
  // Student s1 tham gia vào ses7 (Graph Algorithms)
  const body = { userId: TEST_STUDENT_ID };
  
  const result = await apiCall('POST', `/sessions/${TEST_EMPTY_SESSION_ID}/join`, body);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Student ${TEST_STUDENT_ID} joined session ${TEST_EMPTY_SESSION_ID}`);
    console.log(`New Status: ${result.data.session.status}`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 3. Test Leave Session
async function testLeaveSession() {
  console.log(`\nTest 3: POST /api/sessions/${TEST_EMPTY_SESSION_ID}/leave`);
  // Student s1 rời khỏi ses7 (vừa join ở trên)
  const body = { userId: TEST_STUDENT_ID };
  
  const result = await apiCall('POST', `/sessions/${TEST_EMPTY_SESSION_ID}/leave`, body);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Student ${TEST_STUDENT_ID} left session ${TEST_EMPTY_SESSION_ID}`);
    console.log(`New Status: ${result.data.session.status}`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 4. Test Create Reschedule Request
async function testCreateRescheduleRequest() {
  console.log(`\nTest 4: POST /api/sessions/${TEST_SESSION_ID}/reschedule`);
  
  const newRequest = {
    requesterId: TEST_STUDENT_ID,
    requesterRole: 'student',
    newDate: '2025-12-25',
    newStartTime: '08:00',
    newEndTime: '09:30',
    reason: 'Testing reschedule API'
  };
  
  const result = await apiCall('POST', `/sessions/${TEST_SESSION_ID}/reschedule`, newRequest);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Created request ID: ${result.data.request.id}`);
    return result.data.request.id; // Trả về ID để test approve
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
    return null;
  }
}

// 5. Test Get Reschedule Requests (View của Tutor)
async function testGetRescheduleRequests() {
  console.log('\nTest 5: GET /api/requests/reschedule (Tutor View)');
  // Lấy danh sách request gửi tới tutor t1
  const result = await apiCall('GET', '/requests/reschedule', null, { userId: TEST_TUTOR_ID });
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Found ${result.data.length} requests for tutor ${TEST_TUTOR_ID}`);
    result.data.forEach(r => {
      console.log(` - Request ${r.id}: ${r.status} (Session: ${r.sessionId})`);
    });
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 6. Test Approve Reschedule Request
async function testApproveRescheduleRequest(requestId) {
  if (!requestId) {
    console.log('\nTest 6: Skipped (No request ID created)');
    return;
  }
  console.log(`\nTest 6: POST /api/requests/reschedule/${requestId}/approve`);
  
  const body = { approverId: TEST_TUTOR_ID };
  const result = await apiCall('POST', `/requests/reschedule/${requestId}/approve`, body);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Request approved.`);
    console.log(`Session updated to: ${result.data.updatedSession.date} ${result.data.updatedSession.startTime}`);
    console.log(`Notifications sent: ${result.data.notificationsSent}`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 7. Test Reject Reschedule Request
async function testRejectRescheduleRequest() {
  console.log(`\nTest 7: POST /api/requests/reschedule/${TEST_EXISTING_REQUEST_ID}/reject`);
  // Reject request 'rr2' (đang pending trong mock data)
  
  const result = await apiCall('POST', `/requests/reschedule/${TEST_EXISTING_REQUEST_ID}/reject`);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Request ${TEST_EXISTING_REQUEST_ID} rejected.`);
    console.log(`Request status: ${result.data.request.status}`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// --- Main Runner ---
async function runRequestTests() {
  console.log('Bắt đầu test REQUEST MANAGEMENT APIs...');
  console.log('='.repeat(60));
  
  try {
    // 1. Auto Match
    await testAutoMatch();

    // 2. Join & Leave
    await testJoinSession();
    await testLeaveSession();

    // 3. Create Reschedule -> Get -> Approve
    const newRequestId = await testCreateRescheduleRequest();
    await testGetRescheduleRequests(); // Kiểm tra xem request mới có hiện trong list không
    await testApproveRescheduleRequest(newRequestId);

    // 4. Reject (dùng data có sẵn)
    await testRejectRescheduleRequest();
    
    console.log('\n' + '='.repeat(60));
    console.log('Hoàn thành các test Request Management!');
    
  } catch (error) {
    console.error('\nLỗi khi chạy tests:', error);
  }
}

runRequestTests();