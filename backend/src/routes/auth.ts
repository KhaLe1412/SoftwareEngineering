// Trong /routes/auth.ts
import express from 'express';
import { handleLogin, changePassword } from '../components/auth_managements.js';   

const router = express.Router();

// 1. Định nghĩa tuyến đường cho POST /api/auth/login
// (Tiền tố /api/auth sẽ được thêm ở file index.ts)
router.post('/login', handleLogin);
router.post('/change-password', changePassword);

export default router;