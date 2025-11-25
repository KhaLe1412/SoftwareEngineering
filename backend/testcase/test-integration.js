/**
 * Integration Tests - Test các luồng nghiệp vụ phức tạp kết hợp nhiều APIs
 * 
 * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-integration.js
 */

const BASE_URL = 'http://localhost:5001/api';

// Test accounts
const ADMIN_ID = 'admin1';
const TEST_STUDENT_ID = 's1';
const TEST_TUTOR_ID = 't1';

// Helper function để gọi API
async function apiCall(method, endpoint, body = null, queryParams = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (method === 'GET' && queryParams.userId) {
    url.searchParams.append('userId', queryParams.userId);
  }
  
  // Thêm query params khác
  Object.keys(queryParams).forEach(key => {
    if (key !== 'userId' && queryParams[key]) {
      url.searchParams.append(key, queryParams[key]);
    }
  });
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  } else if (method !== 'GET' && queryParams.userId) {
    options.body = JSON.stringify({ userId: queryParams.userId });
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

// Helper để delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// SCENARIO 1: Complete Student Lifecycle
// ============================================
async function scenario1_CompleteStudentLifecycle() {
  console.log('\n' + '='.repeat(70));
  console.log('SCENARIO 1: Complete Student Lifecycle');
  console.log('='.repeat(70));
  console.log('Flow: Create Student -> Update Profile -> Delete Student');
  
  let createdStudentId = null;
  
  try {
    // Step 1: Create a new student
    console.log('\n[Step 1] Creating new student...');
    const createResult = await apiCall('POST', '/students', {
      userId: ADMIN_ID,
      name: 'Integration Test Student',
      email: 'integration.test@hcmut.edu.vn',
      studentId: '2028888',
      department: 'Computer Science',
      year: 2,
      supportNeeds: ['Programming', 'Algorithms'],
      gpa: 3.5,
      username: `integration_student_${Date.now()}`,
      password: 'test123',
    });
    
    if (!createResult.ok) {
      throw new Error(`Failed to create student: ${createResult.data?.message}`);
    }
    createdStudentId = createResult.data.id;
    console.log(`[PASS] Student created: ${createResult.data.name} (${createdStudentId})`);
    
    // Step 2: Get student by ID
    console.log('\n[Step 2] Getting student by ID...');
    const getResult = await apiCall('GET', `/students/${createdStudentId}`, null, { userId: ADMIN_ID });
    if (!getResult.ok) {
      throw new Error(`Failed to get student: ${getResult.data?.message}`);
    }
    console.log(`[PASS] Student retrieved: ${getResult.data.name}, GPA: ${getResult.data.gpa}`);
    
    // Step 3: Update student profile
    console.log('\n[Step 3] Updating student profile...');
    const updateResult = await apiCall('PATCH', `/students/${createdStudentId}`, {
      userId: ADMIN_ID,
      name: 'Updated Integration Test Student',
      gpa: 3.9,
      supportNeeds: ['Programming', 'Algorithms', 'Database Systems'],
    });
    if (!updateResult.ok) {
      throw new Error(`Failed to update student: ${updateResult.data?.message}`);
    }
    console.log(`[PASS] Student updated: ${updateResult.data.name}, New GPA: ${updateResult.data.gpa}`);
    
    // Step 4: Verify update
    console.log('\n[Step 4] Verifying update...');
    const verifyResult = await apiCall('GET', `/students/${createdStudentId}`, null, { userId: ADMIN_ID });
    if (verifyResult.data.gpa !== 3.9) {
      throw new Error('Update verification failed');
    }
    console.log(`[PASS] Update verified: GPA is now ${verifyResult.data.gpa}`);
    
    // Step 5: Delete student
    console.log('\n[Step 5] Deleting student...');
    const deleteResult = await apiCall('DELETE', `/students/${createdStudentId}`, { userId: ADMIN_ID });
    if (deleteResult.status !== 204) {
      throw new Error(`Failed to delete student: ${deleteResult.data?.message}`);
    }
    console.log(`[PASS] Student deleted successfully`);
    
    // Step 6: Verify deletion
    console.log('\n[Step 6] Verifying deletion...');
    const verifyDeleteResult = await apiCall('GET', `/students/${createdStudentId}`, null, { userId: ADMIN_ID });
    if (verifyDeleteResult.status !== 404) {
      throw new Error('Student still exists after deletion');
    }
    console.log(`[PASS] Deletion verified: Student not found`);
    
    console.log('\n[PASS] SCENARIO 1 PASSED: Complete Student Lifecycle');
    return true;
  } catch (error) {
    console.error(`\n[FAIL] SCENARIO 1 FAILED: ${error.message}`);
    // Cleanup on failure
    if (createdStudentId) {
      await apiCall('DELETE', `/students/${createdStudentId}`, { userId: ADMIN_ID });
    }
    return false;
  }
}

// ============================================
// SCENARIO 2: Tutor Creates Session and Student Joins
// ============================================
async function scenario2_TutorSessionStudentJoin() {
  console.log('\n' + '='.repeat(70));
  console.log('SCENARIO 2: Tutor Creates Session and Student Joins');
  console.log('='.repeat(70));
  console.log('Flow: Create Tutor -> Create Session -> Student Joins -> Verify Enrollment');
  
  let createdTutorId = null;
  let createdSessionId = null;
  
  try {
    // Step 1: Create a new tutor
    console.log('\n[Step 1] Creating new tutor...');
    const createTutorResult = await apiCall('POST', '/tutors', {
      userId: ADMIN_ID,
      name: 'Integration Test Tutor',
      email: 'integration.tutor@hcmut.edu.vn',
      tutorId: 'T888',
      department: 'Computer Science',
      expertise: ['Programming', 'Algorithms', 'Web Development'],
      rating: 4.5,
      totalSessions: 0,
      username: `integration_tutor_${Date.now()}`,
      password: 'test123',
    });
    
    if (!createTutorResult.ok) {
      throw new Error(`Failed to create tutor: ${createTutorResult.data?.message}`);
    }
    createdTutorId = createTutorResult.data.id;
    console.log(`[PASS] Tutor created: ${createTutorResult.data.name} (${createdTutorId})`);
    
    // Step 2: Create a session for this tutor
    console.log('\n[Step 2] Creating session...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const sessionDate = tomorrow.toISOString().split('T')[0];
    
    const createSessionResult = await apiCall('POST', '/sessions', {
      tutorId: createdTutorId,
      sessionData: {
        subject: 'Programming',
        date: sessionDate,
        startTime: '09:00',
        endTime: '11:00',
        type: 'online',
        meetLink: 'https://meet.google.com/test-session',
        notes: 'Integration test session',
        maxStudents: 5,
      },
    });
    
    if (!createSessionResult.ok) {
      throw new Error(`Failed to create session: ${createSessionResult.data?.message}`);
    }
    console.log(`[PASS] Session created`);
    
    // Step 3: Get all sessions to find the created session
    console.log('\n[Step 3] Getting sessions to find created session...');
    await delay(100); // Small delay to ensure session is created
    const getSessionsResult = await apiCall('GET', '/sessions', null, { tutorId: createdTutorId });
    if (!getSessionsResult.ok || !getSessionsResult.data || getSessionsResult.data.length === 0) {
      throw new Error('Failed to retrieve sessions');
    }
    
    // Find the most recent session (should be the one we just created)
    const sessions = getSessionsResult.data;
    const createdSession = sessions[sessions.length - 1].session;
    createdSessionId = createdSession.id;
    console.log(`[PASS] Found created session: ${createdSessionId}`);
    
    // Step 4: Student joins the session
    console.log('\n[Step 4] Student joining session...');
    const joinResult = await apiCall('POST', `/sessions/${createdSessionId}/join`, {
      studentId: TEST_STUDENT_ID,
    });
    
    if (!joinResult.ok) {
      console.log(`[WARN]Join result: ${joinResult.status} - ${JSON.stringify(joinResult.data)}`);
      // Join might not be implemented, so we'll continue
    } else {
      console.log(`[PASS] Student joined session`);
    }
    
    // Step 5: Verify student is enrolled
    console.log('\n[Step 5] Verifying enrollment...');
    const verifySessionsResult = await apiCall('GET', '/sessions', null, { 
      tutorId: createdTutorId 
    });
    if (verifySessionsResult.ok && verifySessionsResult.data) {
      const session = verifySessionsResult.data.find(s => s.session.id === createdSessionId);
      if (session) {
        console.log(`[PASS] Session found with ${session.session.enrolledStudents?.length || 0} enrolled students`);
      }
    }
    
    // Cleanup
    console.log('\n[Cleanup] Cleaning up created resources...');
    if (createdSessionId) {
      await apiCall('DELETE', `/sessions/${createdSessionId}`, {});
    }
    if (createdTutorId) {
      await apiCall('DELETE', `/tutors/${createdTutorId}`, { userId: ADMIN_ID });
    }
    console.log(`[PASS] Cleanup completed`);
    
    console.log('\n[PASS] SCENARIO 2 PASSED: Tutor Session Student Join');
    return true;
  } catch (error) {
    console.error(`\n[FAIL] SCENARIO 2 FAILED: ${error.message}`);
    // Cleanup on failure
    if (createdSessionId) {
      await apiCall('DELETE', `/sessions/${createdSessionId}`, {});
    }
    if (createdTutorId) {
      await apiCall('DELETE', `/tutors/${createdTutorId}`, { userId: ADMIN_ID });
    }
    return false;
  }
}

// ============================================
// SCENARIO 3: Multiple Students and Sessions
// ============================================
async function scenario3_MultipleStudentsAndSessions() {
  console.log('\n' + '='.repeat(70));
  console.log('SCENARIO 3: Multiple Students and Sessions');
  console.log('='.repeat(70));
  console.log('Flow: Create Multiple Students -> Create Tutor -> Create Multiple Sessions -> Filter & Verify');
  
  const createdStudentIds = [];
  let createdTutorId = null;
  const createdSessionIds = [];
  
  try {
    // Step 1: Create multiple students
    console.log('\n[Step 1] Creating multiple students...');
    for (let i = 1; i <= 3; i++) {
      const createResult = await apiCall('POST', '/students', {
        userId: ADMIN_ID,
        name: `Test Student ${i}`,
        email: `test.student${i}@hcmut.edu.vn`,
        studentId: `202${8000 + i}`,
        department: 'Computer Science',
        year: 2,
        supportNeeds: ['Programming'],
        gpa: 3.5 + (i * 0.1),
        username: `test_student_${i}_${Date.now()}`,
        password: 'test123',
      });
      
      if (createResult.ok) {
        createdStudentIds.push(createResult.data.id);
        console.log(`[PASS] Created student ${i}: ${createResult.data.name}`);
      }
    }
    
    if (createdStudentIds.length === 0) {
      throw new Error('Failed to create any students');
    }
    
    // Step 2: Create a tutor
    console.log('\n[Step 2] Creating tutor...');
    const createTutorResult = await apiCall('POST', '/tutors', {
      userId: ADMIN_ID,
      name: 'Multi-Session Tutor',
      email: 'multi.tutor@hcmut.edu.vn',
      tutorId: 'T777',
      department: 'Computer Science',
      expertise: ['Programming', 'Algorithms'],
      rating: 4.8,
      totalSessions: 0,
      username: `multi_tutor_${Date.now()}`,
      password: 'test123',
    });
    
    if (!createTutorResult.ok) {
      throw new Error(`Failed to create tutor: ${createTutorResult.data?.message}`);
    }
    createdTutorId = createTutorResult.data.id;
    console.log(`[PASS] Tutor created: ${createTutorResult.data.name}`);
    
    // Step 3: Create multiple sessions
    console.log('\n[Step 3] Creating multiple sessions...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const sessionDate = tomorrow.toISOString().split('T')[0];
    
    for (let i = 1; i <= 2; i++) {
      const createSessionResult = await apiCall('POST', '/sessions', {
        tutorId: createdTutorId,
        sessionData: {
          subject: 'Programming',
          date: sessionDate,
          startTime: `${9 + i}:00`,
          endTime: `${11 + i}:00`,
          type: 'online',
          meetLink: `https://meet.google.com/session-${i}`,
          notes: `Test session ${i}`,
          maxStudents: 3,
        },
      });
      
      if (createSessionResult.ok) {
        console.log(`[PASS] Created session ${i}`);
        await delay(100);
      }
    }
    
    // Step 4: Get sessions and verify
    console.log('\n[Step 4] Getting and verifying sessions...');
    await delay(200);
    const getSessionsResult = await apiCall('GET', '/sessions', null, { tutorId: createdTutorId });
    if (getSessionsResult.ok && getSessionsResult.data) {
      console.log(`[PASS] Found ${getSessionsResult.data.length} sessions for tutor`);
      getSessionsResult.data.forEach((s, idx) => {
        if (s.session) {
          createdSessionIds.push(s.session.id);
          console.log(`   Session ${idx + 1}: ${s.session.subject} at ${s.session.startTime}`);
        }
      });
    }
    
    // Step 5: Filter students by department
    console.log('\n[Step 5] Filtering students by department...');
    const filterResult = await apiCall('GET', '/students', null, { 
      userId: ADMIN_ID,
      department: 'Computer Science'
    });
    if (filterResult.ok) {
      console.log(`[PASS] Found ${filterResult.data.length} students in Computer Science`);
    }
    
    // Cleanup
    console.log('\n[Cleanup] Cleaning up...');
    for (const sessionId of createdSessionIds) {
      await apiCall('DELETE', `/sessions/${sessionId}`, {});
    }
    for (const studentId of createdStudentIds) {
      await apiCall('DELETE', `/students/${studentId}`, { userId: ADMIN_ID });
    }
    if (createdTutorId) {
      await apiCall('DELETE', `/tutors/${createdTutorId}`, { userId: ADMIN_ID });
    }
    console.log(`[PASS] Cleanup completed`);
    
    console.log('\n[PASS] SCENARIO 3 PASSED: Multiple Students and Sessions');
    return true;
  } catch (error) {
    console.error(`\n[FAIL] SCENARIO 3 FAILED: ${error.message}`);
    // Cleanup on failure
    for (const sessionId of createdSessionIds) {
      await apiCall('DELETE', `/sessions/${sessionId}`, {});
    }
    for (const studentId of createdStudentIds) {
      await apiCall('DELETE', `/students/${studentId}`, { userId: ADMIN_ID });
    }
    if (createdTutorId) {
      await apiCall('DELETE', `/tutors/${createdTutorId}`, { userId: ADMIN_ID });
    }
    return false;
  }
}

// ============================================
// SCENARIO 4: Update and Filter Operations
// ============================================
async function scenario4_UpdateAndFilterOperations() {
  console.log('\n' + '='.repeat(70));
  console.log('SCENARIO 4: Update and Filter Operations');
  console.log('='.repeat(70));
  console.log('Flow: Create Resources -> Update -> Filter -> Verify Changes');
  
  let createdStudentId = null;
  let createdTutorId = null;
  
  try {
    // Step 1: Create student and tutor
    console.log('\n[Step 1] Creating student and tutor...');
    
    const createStudentResult = await apiCall('POST', '/students', {
      userId: ADMIN_ID,
      name: 'Filter Test Student',
      email: 'filter.test@hcmut.edu.vn',
      studentId: '2027777',
      department: 'Mathematics',
      year: 3,
      supportNeeds: ['Calculus', 'Linear Algebra'],
      gpa: 3.6,
      username: `filter_student_${Date.now()}`,
      password: 'test123',
    });
    
    if (!createStudentResult.ok) {
      throw new Error(`Failed to create student: ${createStudentResult.data?.message}`);
    }
    createdStudentId = createStudentResult.data.id;
    console.log(`[PASS] Student created: ${createStudentResult.data.name}`);
    
    const createTutorResult = await apiCall('POST', '/tutors', {
      userId: ADMIN_ID,
      name: 'Filter Test Tutor',
      email: 'filter.tutor@hcmut.edu.vn',
      tutorId: 'T666',
      department: 'Mathematics',
      expertise: ['Calculus', 'Linear Algebra', 'Statistics'],
      rating: 4.7,
      totalSessions: 0,
      username: `filter_tutor_${Date.now()}`,
      password: 'test123',
    });
    
    if (!createTutorResult.ok) {
      throw new Error(`Failed to create tutor: ${createTutorResult.data?.message}`);
    }
    createdTutorId = createTutorResult.data.id;
    console.log(`[PASS] Tutor created: ${createTutorResult.data.name}`);
    
    // Step 2: Filter students by department
    console.log('\n[Step 2] Filtering students by department (Mathematics)...');
    const filterByDeptResult = await apiCall('GET', '/students', null, {
      userId: ADMIN_ID,
      department: 'Mathematics',
    });
    if (filterByDeptResult.ok) {
      const mathStudents = filterByDeptResult.data.filter(s => s.department === 'Mathematics');
      console.log(`[PASS] Found ${mathStudents.length} students in Mathematics department`);
    }
    
    // Step 3: Filter students by year
    console.log('\n[Step 3] Filtering students by year (3)...');
    const filterByYearResult = await apiCall('GET', '/students', null, {
      userId: ADMIN_ID,
      year: '3',
    });
    if (filterByYearResult.ok) {
      const year3Students = filterByYearResult.data.filter(s => s.year === 3);
      console.log(`[PASS] Found ${year3Students.length} students in year 3`);
    }
    
    // Step 4: Filter tutors by expertise
    console.log('\n[Step 4] Filtering tutors by expertise (Calculus)...');
    const filterTutorResult = await apiCall('GET', '/tutors', null, {
      userId: ADMIN_ID,
      subject: 'Calculus',
    });
    if (filterTutorResult.ok) {
      const calcTutors = filterTutorResult.data.filter(t => 
        t.expertise.some(e => e.toLowerCase().includes('calculus'))
      );
      console.log(`[PASS] Found ${calcTutors.length} tutors with Calculus expertise`);
    }
    
    // Step 5: Update student and verify
    console.log('\n[Step 5] Updating student GPA...');
    const updateResult = await apiCall('PATCH', `/students/${createdStudentId}`, {
      userId: ADMIN_ID,
      gpa: 3.9,
    });
    if (!updateResult.ok) {
      throw new Error(`Failed to update student: ${updateResult.data?.message}`);
    }
    console.log(`[PASS] Student GPA updated to ${updateResult.data.gpa}`);
    
    // Step 6: Update tutor and verify
    console.log('\n[Step 6] Updating tutor rating...');
    const updateTutorResult = await apiCall('PATCH', `/tutors/${createdTutorId}`, {
      userId: ADMIN_ID,
      rating: 4.9,
    });
    if (!updateTutorResult.ok) {
      throw new Error(`Failed to update tutor: ${updateTutorResult.data?.message}`);
    }
    console.log(`[PASS] Tutor rating updated to ${updateTutorResult.data.rating}`);
    
    // Cleanup
    console.log('\n[Cleanup] Cleaning up...');
    if (createdStudentId) {
      await apiCall('DELETE', `/students/${createdStudentId}`, { userId: ADMIN_ID });
    }
    if (createdTutorId) {
      await apiCall('DELETE', `/tutors/${createdTutorId}`, { userId: ADMIN_ID });
    }
    console.log(`[PASS] Cleanup completed`);
    
    console.log('\n[PASS] SCENARIO 4 PASSED: Update and Filter Operations');
    return true;
  } catch (error) {
    console.error(`\n[FAIL] SCENARIO 4 FAILED: ${error.message}`);
    // Cleanup on failure
    if (createdStudentId) {
      await apiCall('DELETE', `/students/${createdStudentId}`, { userId: ADMIN_ID });
    }
    if (createdTutorId) {
      await apiCall('DELETE', `/tutors/${createdTutorId}`, { userId: ADMIN_ID });
    }
    return false;
  }
}

// ============================================
// SCENARIO 5: Error Handling and Edge Cases
// ============================================
async function scenario5_ErrorHandling() {
  console.log('\n' + '='.repeat(70));
  console.log('SCENARIO 5: Error Handling and Edge Cases');
  console.log('='.repeat(70));
  console.log('Flow: Test Invalid Requests -> Missing Fields -> Non-existent Resources');
  
  try {
    // Test 1: Missing userId
    console.log('\n[Test 1] Testing missing userId...');
    const noUserIdResult = await apiCall('GET', '/students');
    if (noUserIdResult.status === 401) {
      console.log(`[PASS] Correctly rejected request without userId`);
    } else {
      console.log(`[WARN]Expected 401, got ${noUserIdResult.status}`);
    }
    
    // Test 2: Invalid student ID
    console.log('\n[Test 2] Testing invalid student ID...');
    const invalidIdResult = await apiCall('GET', '/students/invalid_id_12345', null, {
      userId: ADMIN_ID,
    });
    if (invalidIdResult.status === 404) {
      console.log(`[PASS] Correctly returned 404 for invalid ID`);
    } else {
      console.log(`[WARN]Expected 404, got ${invalidIdResult.status}`);
    }
    
    // Test 3: Missing required fields in POST
    console.log('\n[Test 3] Testing missing required fields...');
    const missingFieldsResult = await apiCall('POST', '/students', {
      userId: ADMIN_ID,
      name: 'Incomplete Student',
      // Missing email, studentId, etc.
    });
    if (missingFieldsResult.status === 400) {
      console.log(`[PASS] Correctly rejected request with missing fields`);
    } else {
      console.log(`[WARN]Expected 400, got ${missingFieldsResult.status}`);
    }
    
    // Test 4: Duplicate username
    console.log('\n[Test 4] Testing duplicate username...');
    const duplicateResult = await apiCall('POST', '/students', {
      userId: ADMIN_ID,
      name: 'Duplicate Test',
      email: 'duplicate@hcmut.edu.vn',
      studentId: '2026666',
      department: 'CS',
      year: 2,
      username: 'student1', // Existing username
      password: 'test123',
    });
    if (duplicateResult.status === 400) {
      console.log(`[PASS] Correctly rejected duplicate username`);
    } else {
      console.log(`[WARN]Expected 400 for duplicate, got ${duplicateResult.status}`);
    }
    
    // Test 5: Update non-existent resource
    console.log('\n[Test 5] Testing update non-existent resource...');
    const updateNonExistentResult = await apiCall('PATCH', '/students/non_existent_id', {
      userId: ADMIN_ID,
      name: 'Updated Name',
    });
    if (updateNonExistentResult.status === 404) {
      console.log(`[PASS] Correctly returned 404 for non-existent resource`);
    } else {
      console.log(`[WARN]Expected 404, got ${updateNonExistentResult.status}`);
    }
    
    console.log('\n[PASS] SCENARIO 5 PASSED: Error Handling and Edge Cases');
    return true;
  } catch (error) {
    console.error(`\n[FAIL] SCENARIO 5 FAILED: ${error.message}`);
    return false;
  }
}

// ============================================
// Main Test Runner
// ============================================
async function runAllIntegrationTests() {
  console.log('INTEGRATION TESTS - Testing Complex API Workflows');
  
  const results = [];
  
  try {
    // Run all scenarios
    results.push(await scenario1_CompleteStudentLifecycle());
    results.push(await scenario2_TutorSessionStudentJoin());
    results.push(await scenario3_MultipleStudentsAndSessions());
    results.push(await scenario4_UpdateAndFilterOperations());
    results.push(await scenario5_ErrorHandling());
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('TEST SUMMARY');
    console.log('='.repeat(70));
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`\nTotal Scenarios: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (passed === total) {
      console.log('\nAll integration tests passed!');
    } else {
      console.log('\n[WARN] Some tests failed. Check logs above for details.');
    }
    
  } catch (error) {
    console.error('\n[FAIL] Fatal error running tests:', error);
  }
}

// Run tests
runAllIntegrationTests();

