// import { Request, Response } from 'express';
// import { demoAccounts } from '../data/account.js'; // Import database giả

// export const handleLogin = (req: Request, res: Response) => {
//     try {
//     // 1. Lấy username và password từ body
//     // (Điều này chỉ hoạt động nếu bạn đã dùng app.use(express.json()))
//     const { username, password } = req.body;

//     console.log(`[ĐĂNG NHẬP]: Nhận được yêu cầu: username='${username}', password='${password}'`);
//     // 2. Kiểm tra xem username, password có được gửi lên không
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Missing username or password' });
//     }

//     // 3. Tìm người dùng trong "database" giả
//     const user = demoAccounts.find(
//       (acc) => acc.username === username && acc.password === password
//     );

//     // 4. Xử lý logic
//     if (user) {
//       // ĐĂNG NHẬP THÀNH CÔNG
//       // Chỉ gửi lại thông tin cần thiết (KHÔNG BAO GIỜ GỬI LẠI MẬT KHẨU)
//       console.log(`[ĐĂNG NHẬP]: Thành công, userID='${user.userId}', userRole='${user.role}`)
//       res.status(200).json({
//         message: 'Login successful',
//         userId: user.userId,
//         role: user.role
//       });
//     } else {
//       // ĐĂNG NHẬP THẤT BẠI
//       // Dùng mã 401 (Unauthorized)
//       console.log(`[ĐĂNG NHẬP]: Thất bại, tài khoản không tồn tại`)
//       res.status(401).json({ message: 'Invalid username or password' });
//     }

//   } catch (error) {
//     // Bắt lỗi server (nếu có)
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // --- LOGIC ĐỔI MẬT KHẨU ---
// export const changePassword = (req: Request, res: Response): any => {
//   try {
//     // Lấy ID user từ token (do middleware verifyToken giải mã được)
//     const userId = (req as any).user.id;
//     const { oldPassword, newPassword } = req.body;

//     // 1. Tìm user
//     const userIndex =demoAccounts.findIndex(u => u.userId === userId);
//     if (userIndex === -1) return res.status(404).json({ message: "User không tồn tại" });

//     const user = demoAccounts[userIndex];

//     // 2. Kiểm tra mật khẩu cũ
//     if (user.password !== oldPassword) {
//       return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
//     }

//     // 3. Cập nhật mật khẩu mới (Trong thực tế phải Hash mật khẩu trước khi lưu)
//     demoAccounts[userIndex].password = newPassword;

//     return res.status(200).json({ message: "Đổi mật khẩu thành công!" });

//   } catch (error) {
//     return res.status(500).json({ message: "Lỗi Server" });
//   }
// };
// file: src/controllers/authController.ts
import { Request, Response } from 'express';
import { readUsers, writeUsers } from '../utils/db.js'; // Import hàm đọc ghi file vừa tạo

// --- XỬ LÝ ĐĂNG NHẬP ---
export const handleLogin = (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        console.log(`[ĐĂNG NHẬP]: Yêu cầu từ username='${username}'`);

        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu username hoặc password' });
        }

        // 1. ĐỌC DỮ LIỆU TỪ FILE JSON (thay vì import biến tĩnh)
        const users = readUsers();

        // 2. Tìm user
        const user = users.find(
            (acc: any) => acc.username === username && acc.password === password
        );

        if (user) {
            console.log(`[ĐĂNG NHẬP]: Thành công, userId='${user.userId}'`);
            res.status(200).json({
                message: 'Login successful',
                userId: user.userId,
                role: user.role,
                name: user.name
            });
        } else {
            console.log(`[ĐĂNG NHẬP]: Thất bại`);
            res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- XỬ LÝ ĐỔI MẬT KHẨU ---
export const changePassword = (req: Request, res: Response): any => {
    try {
        // Giả sử middleware verifyToken đã gắn thông tin user vào req.user
        // Nếu chưa có middleware, bạn có thể test bằng cách gửi userId từ body (tạm thời)
        const userId = (req as any).user?.id || req.body.userId; 
        const { oldPassword, newPassword } = req.body;

        if (!userId) return res.status(401).json({ message: "Không tìm thấy User ID (Chưa đăng nhập?)" });

        // 1. Đọc danh sách user mới nhất từ file
        const users = readUsers();

        // 2. Tìm vị trí (index) của user trong mảng
        const userIndex = users.findIndex((u: any) => u.userId === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        // 3. Kiểm tra mật khẩu cũ
        if (users[userIndex].password !== oldPassword) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        // 4. Cập nhật mật khẩu mới vào mảng
        users[userIndex].password = newPassword;

        // 5. GHI DỮ LIỆU LẠI VÀO FILE JSON
        const isSaved = writeUsers(users);

        if (isSaved) {
            console.log(`[ĐỔI PASS]: Thành công cho user ${userId}`);
            return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
        } else {
            return res.status(500).json({ message: "Lỗi khi lưu dữ liệu" });
        }

    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ message: "Lỗi Server" });
    }
};