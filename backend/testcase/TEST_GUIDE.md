# Hướng dẫn Test API cho Students và Tutors

## 📋 Yêu cầu

1. **Server phải đang chạy**: `npm run dev` (chạy tại `http://localhost:5001`)
2. **UserID bắt buộc**: Tất cả requests phải có `userId`:
   - GET: `?userId=<userId>` trong query string
   - POST/PATCH/DELETE: `userId` trong request body

## 📚 Loại Tests

### 1. Unit Tests (`test-api.js`)
Test từng API endpoint riêng lẻ, kiểm tra CRUD operations cơ bản.

### 2. Integration Tests (`test-integration.js`)
Test các luồng nghiệp vụ phức tạp kết hợp nhiều APIs với nhau.

## 🔑 Test Accounts

Các account có sẵn trong `demoAccounts`:

| Username | Password | Role | UserID |
|----------|----------|------|--------|
| admin | admin123 | admin | admin1 |
| student1 | pass123 | student | s1 |
| tutor1 | pass123 | tutor | t1 |

## 🧪 Cách 1: Sử dụng Test Script (Khuyến nghị)

### Chạy script tự động:

```bash
# Đảm bảo server đang chạy
npm run dev

# Trong terminal khác, chạy test script
node test-api.js
```

Script sẽ tự động test tất cả các endpoints và hiển thị kết quả.

## 🧪 Cách 2: Sử dụng cURL

### 1. GET /api/students - Lấy danh sách sinh viên

```bash
curl -X GET "http://localhost:5001/api/students?userId=admin1" \
  -H "Content-Type: application/json"
```

### 2. GET /api/students/:id - Lấy sinh viên theo ID

```bash
curl -X GET "http://localhost:5001/api/students/s1?userId=admin1" \
  -H "Content-Type: application/json"
```

### 3. GET /api/students với filters

```bash
# Filter theo department
curl -X GET "http://localhost:5001/api/students?userId=admin1&department=Computer%20Science" \
  -H "Content-Type: application/json"

# Filter theo year
curl -X GET "http://localhost:5001/api/students?userId=admin1&year=3" \
  -H "Content-Type: application/json"

# Filter theo supportNeeds
curl -X GET "http://localhost:5001/api/students?userId=admin1&supportNeeds=Programming" \
  -H "Content-Type: application/json"
```

### 4. POST /api/students - Tạo sinh viên mới

```bash
curl -X POST "http://localhost:5001/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin1",
    "name": "Nguyen Van Test",
    "email": "test@hcmut.edu.vn",
    "studentId": "2029999",
    "department": "Computer Science",
    "year": 2,
    "supportNeeds": ["Programming", "Algorithms"],
    "gpa": 3.5,
    "username": "test_student",
    "password": "test123"
  }'
```

### 5. PATCH /api/students/:id - Cập nhật sinh viên

```bash
curl -X PATCH "http://localhost:5001/api/students/s1" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin1",
    "name": "Updated Name",
    "gpa": 3.8
  }'
```

### 6. DELETE /api/students/:id - Xóa sinh viên

```bash
curl -X DELETE "http://localhost:5001/api/students/s1" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin1"
  }'
```

### 7. GET /api/tutors - Lấy danh sách gia sư

```bash
curl -X GET "http://localhost:5001/api/tutors?userId=admin1" \
  -H "Content-Type: application/json"
```

### 8. GET /api/tutors/:id - Lấy gia sư theo ID

```bash
curl -X GET "http://localhost:5001/api/tutors/t1?userId=admin1" \
  -H "Content-Type: application/json"
```

### 9. GET /api/tutors với filters

```bash
# Filter theo department
curl -X GET "http://localhost:5001/api/tutors?userId=admin1&department=Computer%20Science" \
  -H "Content-Type: application/json"

# Filter theo expertise/subject
curl -X GET "http://localhost:5001/api/tutors?userId=admin1&subject=Programming" \
  -H "Content-Type: application/json"
```

### 10. POST /api/tutors - Tạo gia sư mới

```bash
curl -X POST "http://localhost:5001/api/tutors" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin1",
    "name": "Dr. Test Tutor",
    "email": "test.tutor@hcmut.edu.vn",
    "tutorId": "T999",
    "department": "Computer Science",
    "expertise": ["Web Development", "Database Systems"],
    "rating": 4.5,
    "totalSessions": 0,
    "username": "test_tutor",
    "password": "test123"
  }'
```

### 11. PATCH /api/tutors/:id - Cập nhật gia sư

```bash
curl -X PATCH "http://localhost:5001/api/tutors/t1" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin1",
    "name": "Updated Tutor Name",
    "rating": 4.9
  }'
```

### 12. DELETE /api/tutors/:id - Xóa gia sư

```bash
curl -X DELETE "http://localhost:5001/api/tutors/t1" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin1"
  }'
```

## 🧪 Cách 3: Sử dụng Postman

### Setup Postman Collection

1. **Tạo Collection mới**: "Students & Tutors API"

2. **Thiết lập Base URL**: 
   - Variable: `base_url` = `http://localhost:5001/api`
   - Variable: `user_id` = `admin1`

3. **Tạo các requests**:

#### GET Students
- **Method**: GET
- **URL**: `{{base_url}}/students?userId={{user_id}}`
- **Headers**: `Content-Type: application/json`

#### GET Student by ID
- **Method**: GET
- **URL**: `{{base_url}}/students/s1?userId={{user_id}}`
- **Headers**: `Content-Type: application/json`

#### POST Create Student
- **Method**: POST
- **URL**: `{{base_url}}/students`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "admin1",
  "name": "Nguyen Van Test",
  "email": "test@hcmut.edu.vn",
  "studentId": "2029999",
  "department": "Computer Science",
  "year": 2,
  "supportNeeds": ["Programming", "Algorithms"],
  "gpa": 3.5,
  "username": "test_student",
  "password": "test123"
}
```

#### PATCH Update Student
- **Method**: PATCH
- **URL**: `{{base_url}}/students/s1`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "admin1",
  "name": "Updated Name",
  "gpa": 3.8
}
```

#### DELETE Student
- **Method**: DELETE
- **URL**: `{{base_url}}/students/s1`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "admin1"
}
```

#### GET Tutors
- **Method**: GET
- **URL**: `{{base_url}}/tutors?userId={{user_id}}`
- **Headers**: `Content-Type: application/json`

#### GET Tutor by ID
- **Method**: GET
- **URL**: `{{base_url}}/tutors/t1?userId={{user_id}}`
- **Headers**: `Content-Type: application/json`

#### POST Create Tutor
- **Method**: POST
- **URL**: `{{base_url}}/tutors`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "admin1",
  "name": "Dr. Test Tutor",
  "email": "test.tutor@hcmut.edu.vn",
  "tutorId": "T999",
  "department": "Computer Science",
  "expertise": ["Web Development", "Database Systems"],
  "rating": 4.5,
  "totalSessions": 0,
  "username": "test_tutor",
  "password": "test123"
}
```

#### PATCH Update Tutor
- **Method**: PATCH
- **URL**: `{{base_url}}/tutors/t1`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "admin1",
  "name": "Updated Tutor Name",
  "rating": 4.9
}
```

#### DELETE Tutor
- **Method**: DELETE
- **URL**: `{{base_url}}/tutors/t1`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "admin1"
}
```

## ⚠️ Lưu ý

1. **UserID bắt buộc**: Nếu thiếu `userId`, API sẽ trả về `401 Unauthorized`
2. **POST yêu cầu username/password**: Khi tạo student/tutor mới, phải cung cấp `username` và `password` để tạo account
3. **DELETE xóa cả account**: Khi xóa student/tutor, account liên quan cũng bị xóa
4. **Filters**: Có thể kết hợp nhiều filters trong GET requests

## 📊 Response Codes

- `200 OK`: Request thành công
- `201 Created`: Tạo mới thành công
- `204 No Content`: Xóa thành công
- `400 Bad Request`: Thiếu hoặc sai dữ liệu
- `401 Unauthorized`: Thiếu userId
- `404 Not Found`: Không tìm thấy resource
- `500 Server Error`: Lỗi server

## 🧪 Cách 4: Integration Tests (Test Luồng Nghiệp Vụ Phức Tạp)

### Chạy Integration Tests:

```bash
# Đảm bảo server đang chạy
npm run dev

# Trong terminal khác, chạy integration tests
npm run test:integration
# hoặc
node test-integration.js
```

### Các Scenarios được Test:

#### **Scenario 1: Complete Student Lifecycle**
- Tạo student mới → Lấy thông tin → Cập nhật profile → Xóa student
- Kiểm tra toàn bộ vòng đời của một student

#### **Scenario 2: Tutor Creates Session and Student Joins**
- Tạo tutor → Tạo session → Student join session → Verify enrollment
- Test luồng tạo session và đăng ký tham gia

#### **Scenario 3: Multiple Students and Sessions**
- Tạo nhiều students → Tạo tutor → Tạo nhiều sessions → Filter & Verify
- Test khả năng xử lý nhiều resources cùng lúc

#### **Scenario 4: Update and Filter Operations**
- Tạo resources → Update → Filter theo nhiều tiêu chí → Verify changes
- Test các operations filter và update phức tạp

#### **Scenario 5: Error Handling and Edge Cases**
- Test missing userId → Invalid IDs → Missing fields → Duplicate username → Non-existent resources
- Đảm bảo API xử lý lỗi đúng cách

### Chạy Tất Cả Tests:

```bash
# Chạy cả unit tests và integration tests
npm run test:all
```

## 🔍 Debug Tips

1. **Kiểm tra server đang chạy**: Mở `http://localhost:5001` trong browser
2. **Xem logs**: Kiểm tra console của server để xem errors
3. **Test từng endpoint**: Bắt đầu với GET requests trước
4. **Kiểm tra userId**: Đảm bảo userId hợp lệ từ `demoAccounts`
5. **Integration tests tự động cleanup**: Các resources được tạo sẽ tự động xóa sau khi test xong

