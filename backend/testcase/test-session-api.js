/**
 * Test script cho các API endpoints của Session Management
 * * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-session-api.js
 */

const BASE_URL = 'http://localhost:5001/api';

// Test Data
const TEST_TUTOR_ID = 't1'; // Dr. Le Minh Chau
const TEST_STUDENT_ID = 's1'; // Nguyen Van An
let createdSessionId = ''; // Sẽ lưu ID session mới tạo

// Helper function để gọi API (Giữ nguyên)
async function apiCall(method, endpoint, body = null, queryParams = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Thêm query params
  Object.keys(queryParams).forEach(key => {
      if (queryParams[key]) {
          url.searchParams.append(key, queryParams[key]);
      }
  });
  
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

// 1. Test Get All Sessions (No filters)
async function testGetAllSessions() {
  console.log('\nTest 1: GET /api/sessions (All)');
  const result = await apiCall('GET', '/sessions');
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Found ${result.data.length} sessions.`);
    if (result.data.length > 0) {
        // Kiểm tra xem session có được populate tutor/students không
        const firstSession = result.data[0];
        console.log(`   First session: ${firstSession.session.subject}`);
        console.log(`   Tutor: ${firstSession.tutor ? firstSession.tutor.name : 'N/A'}`);
    }
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 2. Test Get Sessions with Filters (tutorId & status)
async function testGetSessionsWithFilter() {
    console.log(`\nTest 2: GET /api/sessions?tutorId=${TEST_TUTOR_ID}&status=open`);
    const result = await apiCall('GET', '/sessions', null, { tutorId: TEST_TUTOR_ID, status: 'open' });
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! Found ${result.data.length} open sessions for tutor ${TEST_TUTOR_ID}.`);
      result.data.forEach(item => {
          if (item.session.tutorId !== TEST_TUTOR_ID || item.session.status !== 'open') {
              console.error('   Error: Filter failed for session', item.session.id);
          }
      });
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
  }

// 3. Test Create New Session
async function testCreateSession() {
  console.log('\nTest 3: POST /api/sessions');
  
  const newSessionData = {
    tutorId: TEST_TUTOR_ID,
    sessionData: {
        subject: 'Test Session Subject',
        date: '2025-12-31',
        startTime: '10:00',
        endTime: '11:30',
        type: 'online',
        meetLink: 'https://meet.google.com/test-create',
        notes: 'This is a test session created by script',
        maxStudents: 5
    }
  };
  
  const result = await apiCall('POST', '/sessions', newSessionData);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! ${result.data.message}`);
    // Vì API create không trả về ID, ta phải fetch lại để tìm ID của session vừa tạo (dựa vào subject)
    // Đây là điểm yếu của API hiện tại, nên cải thiện để trả về session object
    const checkResult = await apiCall('GET', '/sessions', null, { tutorId: TEST_TUTOR_ID });
    const createdSession = checkResult.data.find(item => item.session.subject === 'Test Session Subject');
    
    if (createdSession) {
        createdSessionId = createdSession.session.id;
        console.log(`   Found created session ID: ${createdSessionId}`);
        return createdSessionId;
    } else {
        console.log('   Warning: Cannot find the session just created.');
    }
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
    return null;
  }
}

// 4. Test Update Session
async function testUpdateSession(sessionId) {
    if (!sessionId) {
        console.log('\nTest 4: Skipped (No session ID)');
        return;
    }
    console.log(`\nTest 4: PATCH /api/sessions/${sessionId}`);
    
    const updateData = {
        updateData: {
            notes: 'Updated notes via test script',
            maxStudents: 10
        },
        reason: 'Testing update API'
    };
    
    const result = await apiCall('PATCH', `/sessions/${sessionId}`, updateData);
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! ${result.data.message}`);
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
}

// 5. Test Mark Session As Completed (POST /complete)
async function testCompleteSession(sessionId) {
    if (!sessionId) {
        console.log('\nTest 5: Skipped (No session ID)');
        return;
    }
    console.log(`\nTest 5: POST /api/sessions/${sessionId}/complete`);
    
    const result = await apiCall('POST', `/sessions/${sessionId}/complete`);
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! ${result.data.message}`);
      
      // Verify status update
      // Vì API GET getAllSessions trả về mảng wrapper {session, ...}, ta cần check lại
      // Tuy nhiên, do data chỉ lưu trong RAM (biến mockSessions), ta không thể check trực tiếp qua file
      // Ta chỉ check response 200 OK
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
}

// 6. Test Get Session By ID
async function testGetSessionById(sessionId) {
    if (!sessionId) {
        console.log('\nTest 6: Skipped (No session ID)');
        return;
    }
    console.log(`\nTest 6: GET /api/sessions/${sessionId}`);
    
    const result = await apiCall('GET', `/sessions/${sessionId}`);
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! Retrieved session for tutor: ${result.data.tutor?.name || 'Unknown'}`);
      console.log(`Session details:`, result.data.session);
      console.log(`Enrolled students:`, result.data.students);
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
}

// 7. Test Delete Session
async function testDeleteSession(sessionId) {
    if (!sessionId) {
        console.log('\nTest 7: Skipped (No session ID)');
        return;
    }
    console.log(`\nTest 7: DELETE /api/sessions/${sessionId}`);
    
    // Lưu ý: API hiện tại của bạn dùng hàm 'markSessionAsCompleted' cho DELETE
    // Điều này có vẻ không đúng semantic (DELETE nên xóa hẳn), nhưng ta test theo code hiện có
    const result = await apiCall('DELETE', `/sessions/${sessionId}`);
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! ${result.data.message}`);
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
}

// --- Main Runner ---
async function runSessionTests() {
  console.log('Bắt đầu test SESSION MANAGEMENT API endpoints...');
  console.log('='.repeat(60));
  
  try {
    // 1. Get All
    await testGetAllSessions();

    // 2. Get Filtered
    await testGetSessionsWithFilter();

    // 3. Create
    const newId = await testCreateSession();

    // 4. Update
    await testUpdateSession(newId);

    // 5. Complete
    await testCompleteSession(newId);
    // 6. Get By ID
    await testGetSessionById(newId);

    // 7. Delete (Mark Completed in current implementation)
    await testDeleteSession(newId);
    
    console.log('\n' + '='.repeat(60));
    console.log('Hoàn thành các test Session Management!');
    
  } catch (error) {
    console.error('\nLỗi khi chạy tests:', error);
  }
}

runSessionTests();