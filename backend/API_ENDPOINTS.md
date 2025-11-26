# API Endpoints Documentation (Detailed)

Tài liệu kỹ thuật mô tả các API endpoints của hệ thống Tutoring, bao gồm phương thức, tham số (params), truy vấn (query), cấu trúc dữ liệu gửi đi (Request Body) và dữ liệu trả về (Response).

**Base URL:** `http://localhost:5001/api`

## Mục lục
1. [Authentication](#1-authentication)
2. [User Management (Students & Tutors)](#2-user-management)
3. [Session Management](#3-session-management)
4. [Messaging Service](#4-messaging-service)
5. [Request Management](#5-request-management)
6. [Evaluation & Feedback](#6-evaluation--feedback)
7. [Reporting & Analytics](#7-reporting--analytics)
8. [Library](#8-library)

---

## 1. Authentication
**Router:** `auth.ts` | **Controller:** `authController.ts`

### 1.1. Đăng nhập
* **Endpoint:** `POST /auth/login`
* **Mô tả:** Xác thực người dùng dựa trên username và password (sử dụng mock DB `account.json`).
* **Request Body:**
    ```json
    {
      "username": "student1",
      "password": "password123"
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "message": "Login successful",
      "userId": "s1",
      "role": "student",
      "name": "Nguyen Van An"
    }
    ```
* **Error (401):** `{ "message": "Sai tên đăng nhập hoặc mật khẩu" }`

### 1.2. Đổi mật khẩu
* **Endpoint:** `POST /auth/change-password`
* **Mô tả:** Thay đổi mật khẩu người dùng và lưu lại vào file JSON.
* **Request Body:**
    ```json
    {
      "userId": "s1",
      "oldPassword": "old_pass",
      "newPassword": "new_pass"
    }
    ```
* **Response (200 OK):** `{ "message": "Đổi mật khẩu thành công!" }`

---

## 2. User Management
**Router:** `students.ts`, `tutors.ts` | **Controller:** `user_managements.ts`

### 2.1. Lấy danh sách (Students/Tutors)
* **Endpoint:** * `GET /students`
    * `GET /tutors`
* **Query Params:**
    * `?department=...` (Lọc theo khoa)
    * `?search=...` (Tìm kiếm theo tên)
* **Response (200 OK):** Mảng danh sách user.
    ```json
    [
      {
        "id": "s1",
        "name": "Nguyen Van An",
        "role": "student",
        "department": "Computer Science",
        "gpa": 3.5,
        ...
      }
    ]
    ```

### 2.2. Tạo người dùng mới
* **Endpoint:** `POST /students` hoặc `POST /tutors`
* **Request Body:** Object chứa thông tin user mới (cấu trúc tùy thuộc Student hoặc Tutor).
* **Response (201 Created):** Trả về user object vừa tạo kèm ID mới.

### 2.3. Cập nhật thông tin
* **Endpoint:** `PATCH /students/:id` hoặc `PATCH /tutors/:id`
* **Path Params:** `id` (ID của user cần sửa)
* **Request Body:** Các trường cần thay đổi.
    ```json
    { "gpa": 3.8, "supportNeeds": ["Math"] }
    ```
* **Response (200 OK):** User object sau khi update.

### 2.4. Xóa người dùng
* **Endpoint:** `DELETE /students/:id` hoặc `DELETE /tutors/:id`
* **Response (204 No Content):** Thành công (hoặc JSON message).

---

## 3. Session Management
**Router:** `sessions.ts` | **Controller:** `session_managements.ts`

### 3.1. Lấy danh sách lớp học
* **Endpoint:** `GET /sessions`
* **Query Params (Optional):**
    * `tutorId`: Lọc theo ID gia sư.
    * `studentId`: Lọc các lớp sinh viên này tham gia.
    * `status`: Lọc theo trạng thái (`open`, `scheduled`, `completed`).
* **Response (200 OK):** Danh sách session đã được **populate** thông tin sinh viên và gia sư.
    ```json
    [
      {
        "session": {
          "id": "ses1",
          "subject": "Data Structures",
          "status": "open",
          ...
        },
        "students": [ { "id": "s1", "name": "..." } ],
        "tutor": { "id": "t1", "name": "..." }
      }
    ]
    ```

### 3.2. Tạo lớp học mới
* **Endpoint:** `POST /sessions`
* **Request Body:**
    ```json
    {
      "tutorId": "t1",
      "sessionData": {
        "subject": "Math",
        "date": "2025-12-01",
        "startTime": "10:00",
        "endTime": "12:00",
        "type": "online",
        "meetLink": "https://meet...",
        "maxStudents": 10
      }
    }
    ```
* **Response (201 Created):** `{ "message": "Session management created" }`

### 3.3. Cập nhật lớp học (Dời lịch/Sửa nội dung)
* **Endpoint:** `PATCH /sessions/:id`
* **Request Body:**
    ```json
    {
      "updateData": {
        "date": "2025-12-02",
        "startTime": "14:00"
      },
      "reason": "Tutor bận đột xuất" // Tùy chọn, dùng để gửi thông báo
    }
    ```
* **Response:** `{ "message": "Session updated" }` (Hệ thống tự động gửi tin nhắn thông báo cho sinh viên).

### 3.4. Kết thúc / Hủy lớp học
* **Endpoint:** * `DELETE /sessions/:id` (Xóa/Hủy)
    * `POST /sessions/:id/complete` (Đánh dấu hoàn thành)
* **Response:** `{ "message": "Session marked as completed/deleted" }`

---

## 4. Messaging Service
**Router:** `messages.ts` | **Controller:** `messaging_service.ts`

### 4.1. Lấy danh sách hội thoại
* **Endpoint:** `GET /messages/conversations`
* **Query Params:** `userId` (ID của người đang đăng nhập).
* **Response:** Danh sách các partner đã từng chat.
    ```json
    [ { "partnerId": "t1" }, { "partnerId": "s2" } ]
    ```

### 4.2. Lấy lịch sử tin nhắn
* **Endpoint:** `GET /messages`
* **Query Params:** * `userId`: ID người xem.
    * `partnerId`: ID người chat cùng.
* **Response:** Mảng các tin nhắn, sắp xếp theo thời gian.

### 4.3. Gửi tin nhắn
* **Endpoint:** `POST /messages`
* **Request Body:**
    ```json
    {
      "senderId": "s1",
      "receiverId": "t1",
      "content": "Hello teacher",
      "type": "regular" // hoặc 'reschedule-notification'
    }
    ```
* **Response:** Tin nhắn vừa tạo (kèm ID và timestamp).

### 4.4. Lấy thông báo (Notifications)
* **Endpoint:** `GET /messages/notifications`
* **Query Params:** `userId`
* **Mô tả:** Lấy các tin nhắn có `type` khác "regular" (ví dụ: thông báo dời lịch).

### 4.5. Đánh dấu đã đọc
* **Endpoint:** `PATCH /messages/:id/read`
* **Response:** `{ ...messageData, "read": true }`

---

## 5. Request Management
**Router:** `sessions.ts`, `requests.ts` | **Controller:** `request_managements.ts`

### 5.1. Tham gia / Rời lớp
* **Endpoint:** `POST /sessions/:id/join` hoặc `POST /sessions/:id/leave`
* **Request Body:** `{ "userId": "s1" }`
* **Response:** Cập nhật danh sách `enrolledStudents` của session.

### 5.2. Yêu cầu dời lịch (Từ sinh viên)
* **Endpoint:** `POST /sessions/:id/reschedule`
* **Request Body:**
    ```json
    {
      "requesterId": "s1",
      "requesterRole": "student",
      "newDate": "...",
      "newStartTime": "...",
      "reason": "..."
    }
    ```
* **Response:** Tạo một `RescheduleRequest` mới trạng thái "pending".

### 5.3. Duyệt / Từ chối yêu cầu dời lịch (Từ Tutor)
* **Endpoint:** * `POST /requests/reschedule/:id/approve`
    * `POST /requests/reschedule/:id/reject`
* **Request Body (Approve):** `{ "approverId": "t1" }`
* **Logic:**
    * **Approve:** Cập nhật lịch session mới, đổi trạng thái request thành "approved", gửi thông báo cho sinh viên.
    * **Reject:** Đổi trạng thái request thành "rejected".

### 5.4. AI Auto-Match
* **Endpoint:** `POST /sessions/auto-match`
* **Request Body:** `{ "studentId": "s1" }`
* **Response:** Trả về một session ngẫu nhiên phù hợp (Mock AI).

### 5.5 Lấy danh sách yêu cầu (Tutor View)
* **Endpoint:** `GET /requests/reschedule`
* **Query Params:** `userId` (ID của Tutor).
* **Response:** Danh sách các yêu cầu dời lịch gửi đến Tutor này.

---

## 6. Evaluation & Feedback
**Router:** `sessions.ts`, `evaluations.ts` | **Controller:** `evaluation_managements.ts`

### 6.1. Sinh viên đánh giá lớp học
* **Endpoint:** `POST /sessions/:id/review`
* **Request Body:**
    ```json
    {
      "studentId": "s1",
      "rating": 5,
      "comment": "Great class!"
    }
    ```
* **Response:** Thêm review vào mảng `reviews` của Session.

### 6.2. Gia sư phản hồi về lớp học
* **Endpoint:** `POST /sessions/:id/feedback`
* **Request Body:**
    ```json
    {
      "tutorNotes": "Students understood basic concepts",
      "tutorProgress": "Good progress"
    }
    ```
* **Response:** Cập nhật object `feedback` trong Session.

### 6.3. Lấy danh sách đánh giá (Student Evaluations)
* **Endpoint:** `GET /evaluations`
* **Query Params:** `studentId`, `tutorId` (Lọc theo sinh viên hoặc gia sư).
* **Response:** Danh sách các `StudentEvaluation` object (đánh giá chi tiết kỹ năng, thái độ).

### 6.4. Tạo đánh giá chi tiết (Tutor -> Student)
* **Endpoint:** `POST /evaluations`
* **Request Body:**
    ```json
    {
      "studentId": "s1",
      "tutorId": "t1",
      "sessionId": "ses1",
      "skills": { "understanding": 4, ... },
      "overallProgress": "..."
    }
    ```

---

## 7. Reporting & Analytics
**Router:** `reports.ts`, `analytics.ts` | **Controller:** `reportings&analytics.ts`

### 7.1. Báo cáo tín chỉ sinh viên
* **Endpoint:** `GET /reports/student-credits`
* **Response:** Danh sách sinh viên kèm tổng số session đã hoàn thành và số tín chỉ tích lũy.

### 7.2. Các chỉ số phân tích (KPIs)
* **Endpoint:** `GET /analytics/kpis`
* **Response:**
    ```json
    {
      "totalSessions": 150,
      "activeStudents": 45,
      "avgImprovement": 20
    }
    ```

### 7.3. Xu hướng và Hiệu suất
* **Endpoint:** `GET /analytics/monthly-trends` (Xu hướng theo tháng)
* **Endpoint:** `GET /analytics/course-performance` (Hiệu suất theo môn học)

### 7.4. Xuất báo cáo
* **Endpoint:** `GET /reports/export`
* **Query Params:** `type` (ví dụ: 'monthly', 'credits').
* **Response:** File download hoặc thông báo thành công (Mock).

---

## 8. Library
**Router:** `library.ts` | **Controller:** `library_service.ts`

### 8.1. Tìm kiếm tài liệu
* **Endpoint:** `GET /library/resources`
* **Query Params:**
    * `q`: Từ khóa tìm kiếm (tiêu đề, tác giả).
    * `subject`: Lọc theo môn học.
    * `type`: Lọc theo loại (textbook, video...).
* **Response:** Mảng các tài liệu phù hợp.

### 8.2. Tải tài liệu
* **Endpoint:** `GET /library/resources/:id/download`
* **Response:**
    ```json
    {
      "message": "Link tải xuống đã sẵn sàng",
      "downloadUrl": "...",
      "fileName": "..."
    }
    ```