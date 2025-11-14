# API Endpoints Documentation

## Authentication
- `POST /api/auth/login` - Đăng nhập

## Users
- `GET /api/users/:id` - Lấy thông tin user theo ID
- `GET /api/users/students` - Lấy danh sách tất cả students
- `GET /api/users/tutors` - Lấy danh sách tất cả tutors
- `GET /api/users/admins` - Lấy danh sách tất cả admins

## Sessions
- `GET /api/sessions` - Lấy tất cả sessions (query params: tutorId, studentId, status)
- `GET /api/sessions/open` - Lấy tất cả open sessions
- `GET /api/sessions/:id` - Lấy session theo ID
- `POST /api/sessions` - Tạo session mới
- `PUT /api/sessions/:id` - Cập nhật session
- `DELETE /api/sessions/:id` - Xóa session

## Session Requests
- `GET /api/session-requests` - Lấy tất cả session requests (query params: studentId, tutorId, status)
- `GET /api/session-requests/:id` - Lấy session request theo ID
- `POST /api/session-requests` - Tạo session request mới
- `PUT /api/session-requests/:id` - Cập nhật session request (approve/reject)

## Match Requests
- `GET /api/match-requests` - Lấy tất cả match requests (query params: studentId, status)
- `GET /api/match-requests/:id` - Lấy match request theo ID
- `POST /api/match-requests` - Tạo match request mới
- `PUT /api/match-requests/:id` - Cập nhật match request

## Messages
- `GET /api/messages` - Lấy tất cả messages (query params: senderId, receiverId, conversationId)
- `GET /api/messages/:id` - Lấy message theo ID
- `POST /api/messages` - Tạo message mới
- `PUT /api/messages/:id` - Cập nhật message (ví dụ: đánh dấu đã đọc)

## Library Resources
- `GET /api/library` - Lấy tất cả library resources (query params: subject, type)
- `GET /api/library/:id` - Lấy library resource theo ID

## Reschedule Requests
- `GET /api/reschedule-requests` - Lấy tất cả reschedule requests (query params: sessionId, requesterId, status)
- `GET /api/reschedule-requests/:id` - Lấy reschedule request theo ID
- `POST /api/reschedule-requests` - Tạo reschedule request mới
- `PUT /api/reschedule-requests/:id` - Cập nhật reschedule request

## Material Requests
- `GET /api/material-requests` - Lấy tất cả material access requests (query params: sessionId, studentId, status)
- `GET /api/material-requests/:id` - Lấy material request theo ID
- `POST /api/material-requests` - Tạo material request mới
- `PUT /api/material-requests/:id` - Cập nhật material request

## Evaluations
- `GET /api/evaluations` - Lấy tất cả evaluations (query params: studentId, tutorId, sessionId)
- `GET /api/evaluations/:id` - Lấy evaluation theo ID
- `POST /api/evaluations` - Tạo evaluation mới
- `PUT /api/evaluations/:id` - Cập nhật evaluation

