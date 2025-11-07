// Example

import express from 'express';
import { handleSessionRequest } from '../controllers/sessionController.js';

const router = express.Router();

// 1. Tạo một đường dẫn cho phương thức POST
// Khi frontend gọi POST /api/sessions/request
// nó sẽ chạy hàm handleSessionRequest
router.post('/request', handleSessionRequest);

// Bạn cũng có thể thêm các route khác ở đây
// router.get('/', getAllSessions); 

export default router;