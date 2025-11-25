// file: backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// --- CẢNH BÁO: CHUỖI NÀY PHẢI GIỐNG HỆT BÊN AUTH CONTROLLER ---
// Nếu bên login dùng "abc", bên này cũng phải là "abc"
const SECRET_KEY = "khoa_bi_mat_cua_ban_123"; 

export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  console.log(`[MIDDLEWARE] 1. Bắt đầu kiểm tra xác thực...`);

  // Lấy token từ header: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  console.log(`[MIDDLEWARE] 2. Header Authorization nhận được: ${authHeader ? 'Có' : 'Không'}`);

  const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token phía sau chữ Bearer

  if (!token) {
    console.log(`[MIDDLEWARE] LỖI: Không tìm thấy Token trong header`);
    return res.status(403).json({ message: "Không có quyền truy cập (Thiếu Token)" });
  }

  console.log(`[MIDDLEWARE] 3. Đang giải mã Token...`);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      console.log(`[MIDDLEWARE] LỖI: Token không hợp lệ hoặc sai Key. Chi tiết: ${err.message}`);
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Nếu thành công
    console.log(`[MIDDLEWARE] 4. Xác thực thành công cho User ID: ${(user as any).id}`);
    
    // Lưu thông tin user vào request để dùng ở bước sau
    (req as any).user = user;
    next(); // Cho phép đi tiếp vào Controller
  });
};