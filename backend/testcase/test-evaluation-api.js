/**
 * Test script cho các API endpoints của Evaluation Management
 * * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-evaluation-api.js
 */

const BASE_URL = 'http://localhost:5001/api';

// Test Data
const TEST_STUDENT_ID = 's1';
const TEST_TUTOR_ID = 't1';
const TEST_SESSION_ID = 'ses2'; // Session đã có feedback
const TEST_SESSION_NO_REVIEW_ID = 'ses6'; // Session chưa có review
let createdEvaluationId = '';

// Helper function để gọi API
async function apiCall(method, endpoint, body = null, queryParams = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(queryParams).forEach(key => {
      if (queryParams[key]) url.searchParams.append(key, queryParams[key]);
  });
  
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

// --- TEST SUITE ---

// 1. Get All Evaluations
async function testGetAllEvaluations() {
  console.log('\nTest 1: GET /api/evaluations');
  
  // Test không filter
  const resultAll = await apiCall('GET', '/evaluations');
  console.log(`Status (All): ${resultAll.status}`);
  if (resultAll.ok) {
      console.log(`   Found ${resultAll.data.length} total evaluations.`);
      console.log(`First evaluation sample:`, resultAll.data[0]); // In mẫu eval đầu tiên
  }

  // Test filter theo studentId
  console.log(`\nTest 1b: GET /api/evaluations?studentId=${TEST_STUDENT_ID}`);
  const resultFilter = await apiCall('GET', '/evaluations', null, { studentId: TEST_STUDENT_ID });
  if (resultFilter.ok) {
      console.log(`   Found ${resultFilter.data.length} evaluations for student ${TEST_STUDENT_ID}.`);
  }
}

// 2. Create Evaluation
async function testCreateEvaluation() {
    console.log('\nTest 2: POST /api/evaluations');
    const newEval = {
        studentId: TEST_STUDENT_ID,
        tutorId: TEST_TUTOR_ID,
        sessionId: 'ses99', // Fake session ID
        skills: { understanding: 4, participation: 5, preparation: 3 },
        attitude: 5,
        testResults: 85,
        overallProgress: 'Good progress in API testing.',
        recommendations: 'Write more integration tests.'
    };

    const result = await apiCall('POST', '/evaluations', newEval);
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log(`Success! Created eval ID: ${result.data.id}`);
        createdEvaluationId = result.data.id;
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

// 3. Update Evaluation
async function testUpdateEvaluation() {
    if (!createdEvaluationId) {
        console.log('\nTest 3: Skipped (No ID)');
        return;
    }
    console.log(`\nTest 3: PUT /api/evaluations/${createdEvaluationId}`);
    const updates = {
        overallProgress: 'Updated progress: Excellent testing skills.',
        attitude: 4
    };

    const result = await apiCall('PUT', `/evaluations/${createdEvaluationId}`, updates); // Note: Code backend dùng PUT, không phải PATCH
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log(`Success! New progress: "${result.data.overallProgress}"`);
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

// 4. Get Evaluation By ID
async function testGetEvaluationById() {
    if (!createdEvaluationId) {
        console.log('\nTest 4: Skipped (No ID)');
        return;
    }
    console.log(`\nTest 4: GET /api/evaluations/${createdEvaluationId}`);
    const result = await apiCall('GET', `/evaluations/${createdEvaluationId}`);
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log(`Success! Retrieved eval for student: ${result.data.studentId}`);
        console.log(`Data:`, result.data);
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

// 5. Submit Session Review (Student to Tutor)
async function testSubmitSessionReview() {
    console.log(`\nTest 5: POST /api/sessions/${TEST_SESSION_NO_REVIEW_ID}/review`);
    const reviewData = {
        studentId: TEST_STUDENT_ID,
        rating: 5,
        comment: 'Amazing session, very helpful!'
    };

    const result = await apiCall('POST', `/sessions/${TEST_SESSION_NO_REVIEW_ID}/review`, reviewData);
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log(`Success! Review submitted: "${result.data.review.comment}"`);
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

// 6. Submit Session Feedback (Tutor to Student)
async function testSubmitSessionFeedback() {
    console.log(`\nTest 6: POST /api/sessions/${TEST_SESSION_NO_REVIEW_ID}/feedback`);
    const feedbackData = {
        tutorProgress: 'Student is grasping concepts quickly.',
        tutorNotes: 'Focus on edge cases next time.'
    };

    const result = await apiCall('POST', `/sessions/${TEST_SESSION_NO_REVIEW_ID}/feedback`, feedbackData);
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log(`Success! Feedback submitted. Notes: "${result.data.feedback.tutorNotes}"`);
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

//6.5 Test Get Session to verify review and feedback
async function testGetSessionVerification() {
    console.log(`\nTest 6.5: GET /api/sessions/${TEST_SESSION_NO_REVIEW_ID}`);
    const result = await apiCall('GET', `/sessions/${TEST_SESSION_NO_REVIEW_ID}`);
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log(`Review:`, result.data.session.reviews);
        console.log(`Feedback:`, result.data.session.feedback);
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

// 7. Delete Evaluation
async function testDeleteEvaluation() {
    if (!createdEvaluationId) {
        console.log('\nTest 7: Skipped (No ID)');
        return;
    }
    console.log(`\nTest 7: DELETE /api/evaluations/${createdEvaluationId}`);
    const result = await apiCall('DELETE', `/evaluations/${createdEvaluationId}`);
    console.log(`Status: ${result.status}`);
    if (result.ok) {
        console.log('Success! Evaluation deleted.');
    } else {
        console.log(`Failed: ${result.data?.message}`);
    }
}

// --- RUNNER ---
async function runEvaluationTests() {
  console.log('STARTING EVALUATION MANAGEMENT TESTS...');
  console.log('='.repeat(50));
  
  await testGetAllEvaluations();
  await testCreateEvaluation();
  await testUpdateEvaluation();
  await testGetEvaluationById();
  await testSubmitSessionReview();
  await testSubmitSessionFeedback();
  await testGetSessionVerification();
  await testDeleteEvaluation();
  
  console.log('\n' + '='.repeat(50));
  console.log('ALL EVALUATION TESTS COMPLETED');
}

runEvaluationTests();