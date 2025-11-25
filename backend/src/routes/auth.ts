// Trong /routes/auth.ts
// import express from 'express';
// import { handleLogin, changePassword } from '../components/auth_managements.js';   
import express from 'express';
import { handleLogin, changePassword }  from '../controllers/authController.js'; // Import logic xử lý
import { verifyToken } from '../middleware/authMiddleware.js';  // Import bảo vệ middleware


const router = express.Router();

// 1. Định nghĩa tuyến đường cho POST /api/auth/login
// (Tiền tố /api/auth sẽ được thêm ở file index.ts)
router.post('/login', handleLogin);
router.post('/change-password', changePassword);

export default router;