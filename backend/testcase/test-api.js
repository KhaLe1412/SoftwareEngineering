/**
 * Test script cho các API endpoints của Students và Tutors
 * 
 * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-api.js
 */

const BASE_URL = 'http://localhost:5001/api';

// Test accounts từ demoAccounts
const TEST_USER_ID = 'admin1'; // Admin có thể tạo/xóa users
const TEST_STUDENT_ID = 's1'; // Student ID để test
const TEST_TUTOR_ID = 't1'; // Tutor ID để test

// Helper function để gọi API
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
  } else if (method !== 'GET' && queryParams.userId) {
    // Thêm userId vào body nếu không có body
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

// Test functions
async function testGetAllStudents() {
  console.log('\nTest 1: GET /api/students');
  const result = await apiCall('GET', '/students', null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Found ${result.data?.length || 0} students`);
    if (result.data && result.data.length > 0) {
      console.log(`   First student: ${result.data[0].name} (${result.data[0].id})`);
    }
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testGetStudentById() {
  console.log('\nTest 2: GET /api/students/:id');
  const result = await apiCall('GET', `/students/${TEST_STUDENT_ID}`, null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Student: ${result.data?.name} (${result.data?.id})`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testCreateStudent() {
  console.log('\nTest 3: POST /api/students');
  const newStudent = {
    userId: TEST_USER_ID,
    name: 'Test Student',
    email: 'test.student@hcmut.edu.vn',
    studentId: '2029999',
    department: 'Computer Science',
    year: 2,
    supportNeeds: ['Programming', 'Algorithms'],
    gpa: 3.5,
    username: `test_student_${Date.now()}`,
    password: 'test123',
  };
  
  const result = await apiCall('POST', '/students', newStudent);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Created student: ${result.data?.name} (${result.data?.id})`);
    return result.data?.id; // Return ID để test delete sau
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
    return null;
  }
}

async function testUpdateStudent(studentId) {
  console.log('\nTest 4: PATCH /api/students/:id');
  const updates = {
    userId: TEST_USER_ID,
    name: 'Updated Test Student',
    gpa: 3.8,
  };
  
  const result = await apiCall('PATCH', `/students/${studentId}`, updates);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Updated student: ${result.data?.name}, GPA: ${result.data?.gpa}`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testDeleteStudent(studentId) {
  console.log('\nTest 5: DELETE /api/students/:id');
  const result = await apiCall('DELETE', `/students/${studentId}`, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.status === 204) {
    console.log(`Success! Student deleted`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testGetAllTutors() {
  console.log('\nTest 6: GET /api/tutors');
  const result = await apiCall('GET', '/tutors', null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Found ${result.data?.length || 0} tutors`);
    if (result.data && result.data.length > 0) {
      console.log(`   First tutor: ${result.data[0].name} (${result.data[0].id})`);
    }
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testGetTutorById() {
  console.log('\nTest 7: GET /api/tutors/:id');
  const result = await apiCall('GET', `/tutors/${TEST_TUTOR_ID}`, null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Tutor: ${result.data?.name} (${result.data?.id})`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testCreateTutor() {
  console.log('\nTest 8: POST /api/tutors');
  const newTutor = {
    userId: TEST_USER_ID,
    name: 'Test Tutor',
    email: 'test.tutor@hcmut.edu.vn',
    tutorId: 'T999',
    department: 'Computer Science',
    expertise: ['Web Development', 'Database Systems'],
    rating: 4.5,
    totalSessions: 0,
    username: `test_tutor_${Date.now()}`,
    password: 'test123',
  };
  
  const result = await apiCall('POST', '/tutors', newTutor);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Created tutor: ${result.data?.name} (${result.data?.id})`);
    return result.data?.id; // Return ID để test delete sau
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
    return null;
  }
}

async function testUpdateTutor(tutorId) {
  console.log('\nTest 9: PATCH /api/tutors/:id');
  const updates = {
    userId: TEST_USER_ID,
    name: 'Updated Test Tutor',
    rating: 4.9,
  };
  
  const result = await apiCall('PATCH', `/tutors/${tutorId}`, updates);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Updated tutor: ${result.data?.name}, Rating: ${result.data?.rating}`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testDeleteTutor(tutorId) {
  console.log('\nTest 10: DELETE /api/tutors/:id');
  const result = await apiCall('DELETE', `/tutors/${tutorId}`, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.status === 204) {
    console.log(`Success! Tutor deleted`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testFilterStudents() {
  console.log('\nTest 11: GET /api/students với filters');
  const result = await apiCall('GET', '/students?department=Computer Science&year=3', null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Found ${result.data?.length || 0} students with filters`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

async function testFilterTutors() {
  console.log('\nTest 12: GET /api/tutors với filters');
  const result = await apiCall('GET', '/tutors?department=Computer Science&subject=Programming', null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Success! Found ${result.data?.length || 0} tutors with filters`);
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
  return result;
}

// Main test runner
async function runAllTests() {
  console.log('Bắt đầu test các API endpoints...');
  console.log('='.repeat(60));
  
  try {
    // Test Students
    await testGetAllStudents();
    await testGetStudentById();
    await testFilterStudents();
    
    const newStudentId = await testCreateStudent();
    if (newStudentId) {
      await testUpdateStudent(newStudentId);
      await testDeleteStudent(newStudentId);
    }
    
    // Test Tutors
    await testGetAllTutors();
    await testGetTutorById();
    await testFilterTutors();
    
    const newTutorId = await testCreateTutor();
    if (newTutorId) {
      await testUpdateTutor(newTutorId);
      await testDeleteTutor(newTutorId);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Hoàn thành tất cả tests!');
    
  } catch (error) {
    console.error('\nLỗi khi chạy tests:', error);
  }
}

// Chạy tests
runAllTests();

