import { Request, Response } from 'express';
import { demoAccounts } from '../data/account.js'; // Import database giả

export const handleLogin = (req: Request, res: Response) => {
    try {
    // 1. Lấy username và password từ body
    // (Điều này chỉ hoạt động nếu bạn đã dùng app.use(express.json()))
    const { username, password } = req.body;

    console.log(`[ĐĂNG NHẬP]: Nhận được yêu cầu: username='${username}', password='${password}'`);
    // 2. Kiểm tra xem username, password có được gửi lên không
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    // 3. Tìm người dùng trong "database" giả
    const user = demoAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    // 4. Xử lý logic
    if (user) {
      // ĐĂNG NHẬP THÀNH CÔNG
      // Chỉ gửi lại thông tin cần thiết (KHÔNG BAO GIỜ GỬI LẠI MẬT KHẨU)
      console.log(`[ĐĂNG NHẬP]: Thành công, userID='${user.userId}', userRole='${user.role}`)
      res.status(200).json({
        message: 'Login successful',
        userId: user.userId,
        role: user.role
      });
    } else {
      // ĐĂNG NHẬP THẤT BẠI
      // Dùng mã 401 (Unauthorized)
      console.log(`[ĐĂNG NHẬP]: Thất bại, tài khoản không tồn tại`)
      res.status(401).json({ message: 'Invalid username or password' });
    }

  } catch (error) {
    // Bắt lỗi server (nếu có)
    res.status(500).json({ message: 'Server error' });
  }
};