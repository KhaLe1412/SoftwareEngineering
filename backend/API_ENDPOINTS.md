# API Endpoints Documentation

Tài liệu này liệt kê các API endpoints được định nghĩa trong hệ thống, phân loại theo từng module chức năng.

**Tiền tố chung (Base URL):** `/api`

## Mục lục
1. [Authentication (Xác thực)](#1-authentication)
2. [Students (Sinh viên)](#2-students)
3. [Tutors (Gia sư)](#3-tutors)
4. [Sessions (Lớp học/Phiên học)](#4-sessions)
5. [Messages (Tin nhắn & Thông báo)](#5-messages)
6. [Requests (Yêu cầu)](#6-requests)
7. [Reports (Báo cáo)](#7-reports)
8. [Analytics (Phân tích)](#8-analytics)
9. [Evaluations (Đánh giá)](#9-evaluations)
10. [Library (Thư viện)](#10-library)

---

## 1. Authentication
**Base Path:** `/api/auth`
*File nguồn: `auth.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | `handleLogin` | Đăng nhập người dùng (Student/Tutor/Admin) |
| `POST` | `/change-password` | `changePassword` | Đổi mật khẩu người dùng |

---

## 2. Students
**Base Path:** `/api/students`
*File nguồn: `students.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `getStudentInfo` | Lấy danh sách hoặc thông tin sinh viên |
| `POST` | `/` | `createStudentInfo` | Tạo hồ sơ sinh viên mới |
| `PATCH` | `/:id` | `updateStudentInfo` | Cập nhật thông tin sinh viên theo ID |
| `DELETE` | `/:id` | `deleteStudentInfo` | Xóa hồ sơ sinh viên theo ID |

---

## 3. Tutors
**Base Path:** `/api/tutors`
*File nguồn: `tutors.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `getTutorInfo` | Lấy danh sách hoặc thông tin gia sư |
| `POST` | `/` | `createTutorInfo` | Tạo hồ sơ gia sư mới |
| `PATCH` | `/:id` | `updateTutorInfo` | Cập nhật thông tin gia sư theo ID |
| `DELETE` | `/:id` | `deleteTutorInfo` | Xóa hồ sơ gia sư theo ID |

---

## 4. Sessions
**Base Path:** `/api/sessions`
*File nguồn: `sessions.ts`*

*Lưu ý: Một số route dùng chung controller `markSessionAsCompleted` cho cả DELETE và POST complete.*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `getAllSessions` | Lấy danh sách các lớp học/phiên học |
| `POST` | `/` | `createSessionManagement`| Tạo mới một lớp học |
| `PATCH` | `/:id` | `updateSessionById` | Cập nhật thông tin lớp học |
| `DELETE` | `/:id` | `markSessionAsCompleted` | Xóa (hoặc đánh dấu hoàn thành) lớp học |
| `POST` | `/:id/complete` | `markSessionAsCompleted` | Đánh dấu lớp học đã hoàn thành |
| `POST` | `/:id/join` | `joinSession` | Sinh viên đăng ký tham gia lớp học |
| `POST` | `/:id/leave` | `leaveSession` | Sinh viên hủy đăng ký/rời lớp học |
| `POST` | `/:id/reschedule` | `createRescheduleRequest`| Tạo yêu cầu dời lịch học |
| `POST` | `/auto-match` | `auto_matchTutor` | Tự động ghép cặp sinh viên với lớp/gia sư (AI) |
| `POST` | `/:id/review` | `submitSessionReview` | Gửi đánh giá về lớp học (từ sinh viên) |
| `POST` | `/:id/feedback` | `submitSessionFeedback` | Gửi phản hồi về lớp học (từ gia sư) |

---

## 5. Messages
**Base Path:** `/api/messages`
*File nguồn: `messages.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `getMessages` | Lấy nội dung tin nhắn (thường dùng kèm query `partnerId`) |
| `POST` | `/` | `sendMessage` | Gửi tin nhắn mới |
| `GET` | `/conversations` | `getConversations` | Lấy danh sách các cuộc hội thoại |
| `GET` | `/notifications` | `getNotifications` | Lấy danh sách thông báo hệ thống |
| `PATCH` | `/:id/read` | `markMessageAsRead` | Đánh dấu tin nhắn/thông báo đã đọc |

---

## 6. Requests
**Base Path:** `/api` (Giả định router được mount tại root vì path trong file đã chứa `/requests`)
*File nguồn: `requests.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/requests/reschedule/:id/approve` | `approveRescheduleRequest` | Chấp thuận yêu cầu dời lịch |
| `POST` | `/requests/reschedule/:id/reject` | `rejectRescheduleRequest` | Từ chối yêu cầu dời lịch |

---

## 7. Reports
**Base Path:** `/api/reports`
*File nguồn: `reports.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/student-credits` | `getStudentCreditsReport` | Lấy báo cáo tín chỉ rèn luyện sinh viên |
| `GET` | `/export` | `exportReport` | Xuất báo cáo ra file (Excel/PDF) |

---

## 8. Analytics
**Base Path:** `/api/analytics`
*File nguồn: `analytics.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/kpis` | `getKPIs` | Lấy các chỉ số KPI tổng quan |
| `GET` | `/monthly-trends` | `getMonthlyTrends` | Lấy dữ liệu xu hướng theo tháng |
| `GET` | `/course-performance` | `getCoursePerformance` | Lấy dữ liệu hiệu suất theo môn học |

---

## 9. Evaluations
**Base Path:** `/api/evaluations`
*File nguồn: `evaluations.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `getAllEvaluations` | Lấy danh sách tất cả các đánh giá |

---

## 10. Library
**Base Path:** `/api/library`
*File nguồn: `library.ts`*

| Method | Endpoint | Controller Function | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/resources` | `getLibraryResources` | Lấy danh sách tài liệu thư viện |
| `GET` | `/resources/:id/download` | `downloadLibraryResource` | Tải xuống tài liệu thư viện theo ID |