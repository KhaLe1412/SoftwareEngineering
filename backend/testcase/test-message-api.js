/**
 * Test script cho các API endpoints của Messaging Service
 * * Cách chạy:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Chạy script: node test-messaging-api.js
 */

const BASE_URL = 'http://localhost:5001/api';

// Test Data dựa trên message.ts (file hiện đang rỗng comment, nên ta sẽ tạo mới)
const TEST_USER_ID = 's1'; // Student s1
const TEST_PARTNER_ID = 't1'; // Tutor t1 (Dr. Le)
let createdMessageId = ''; // Sẽ lưu ID sau khi tạo tin nhắn mới

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

// 1. Test Send Message
async function testSendMessage() {
  console.log('\nTest 1: POST /api/messages');
  
  const newMessage = {
    senderId: TEST_USER_ID,
    receiverId: TEST_PARTNER_ID,
    content: 'Hello Dr. Le, this is a test message from test script.',
    type: 'regular'
  };
  
  const result = await apiCall('POST', '/messages', newMessage);
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Message sent. ID: ${result.data.id}`);
    console.log(`Content: "${result.data.content}"`);
    createdMessageId = result.data.id; // Lưu lại ID để dùng cho test khác
    return result.data.id;
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
    return null;
  }
}

// 2. Test Get Conversations
async function testGetConversations() {
  console.log(`\nTest 2: GET /api/messages/conversations?userId=${TEST_USER_ID}`);
  
  const result = await apiCall('GET', '/messages/conversations', null, { userId: TEST_USER_ID });
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Found ${result.data.length} conversations.`);
    // Kiểm tra xem partner vừa chat có trong list không
    const foundPartner = result.data.find(c => c.partnerId === TEST_PARTNER_ID);
    if (foundPartner) {
        console.log(`   Found partner: ${foundPartner.partnerId}`);
    } else {
        console.log(`   Warning: Partner ${TEST_PARTNER_ID} not found in conversation list!`);
    }
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 3. Test Get Messages (Chat History)
async function testGetMessages() {
  console.log(`\nTest 3: GET /api/messages?userId=${TEST_USER_ID}&partnerId=${TEST_PARTNER_ID}`);
  
  const result = await apiCall('GET', '/messages', null, { 
      userId: TEST_USER_ID, 
      partnerId: TEST_PARTNER_ID 
  });
  console.log(`Status: ${result.status}`);
  
  if (result.ok) {
    console.log(`Success! Found ${result.data.length} messages in thread.`);
    // Kiểm tra xem tin nhắn vừa tạo có trong này không
    const lastMsg = result.data[result.data.length - 1];
    if (lastMsg) {
        console.log(`   Last message: "${lastMsg.content}" (Sender: ${lastMsg.senderId})`);
    }
  } else {
    console.log(`Failed: ${result.data?.message || result.error}`);
  }
}

// 4. Test Send Notification (Mocking a system notification)
async function testSendNotification() {
    console.log('\nTest 4: POST /api/messages (System Notification)');
    
    // Giả lập hệ thống gửi thông báo cho student
    const notification = {
      senderId: 'system',
      receiverId: TEST_USER_ID,
      content: 'Your session "Data Structures" has been rescheduled.',
      type: 'reschedule-notification',
      relatedSessionId: 'ses1'
    };
    
    const result = await apiCall('POST', '/messages', notification);
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! Notification sent. ID: ${result.data.id}`);
      return result.data.id; // Trả về ID để test mark read
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
      return null;
    }
}
  
// 5. Test Get Notifications
async function testGetNotifications() {
    console.log(`\nTest 5: GET /api/messages/notifications?userId=${TEST_USER_ID}`);
    
    const result = await apiCall('GET', '/messages/notifications', null, { userId: TEST_USER_ID });
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! Found ${result.data.length} notifications.`);
      // Tìm thông báo chưa đọc
      const unreadCount = result.data.filter(n => !n.read).length;
      console.log(`   Unread notifications: ${unreadCount}`);
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
}

// 6. Test Mark Message As Read
async function testMarkAsRead(msgId) {
    if (!msgId) {
        console.log('\nTest 6: Skipped (No message ID)');
        return;
    }
    console.log(`\nTest 6: PATCH /api/messages/${msgId}/read`);
    
    const result = await apiCall('PATCH', `/messages/${msgId}/read`);
    console.log(`Status: ${result.status}`);
    
    if (result.ok) {
      console.log(`Success! Message/Notification marked as read.`);
      console.log(`   Is read: ${result.data.read}`);
    } else {
      console.log(`Failed: ${result.data?.message || result.error}`);
    }
}

// --- Main Runner ---
async function runMessagingTests() {
  console.log('Bắt đầu test MESSAGING API endpoints...');
  console.log('='.repeat(60));
  
  try {
    // 1. Gửi tin nhắn thường
    await testSendMessage();

    // 2. Lấy danh sách hội thoại (kiểm tra tin nhắn vừa gửi có tạo ra hội thoại không)
    await testGetConversations();

    // 3. Lấy lịch sử chat chi tiết
    await testGetMessages();

    // 4. Gửi thông báo hệ thống
    const notifId = await testSendNotification();

    // 5. Kiểm tra danh sách thông báo
    await testGetNotifications();

    // 6. Đánh dấu thông báo là đã đọc
    await testMarkAsRead(notifId);
    
    console.log('\n' + '='.repeat(60));
    console.log('Hoàn thành các test Messaging!');
    
  } catch (error) {
    console.error('\nLỗi khi chạy tests:', error);
  }
}

runMessagingTests();