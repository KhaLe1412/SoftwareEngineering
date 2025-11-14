import express from 'express';
import { getUserById, getAllStudents, getAllTutors, getAllAdmins } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/students - Phải đặt trước /:id để tránh match nhầm
router.get('/students', getAllStudents);

// GET /api/users/tutors - Phải đặt trước /:id để tránh match nhầm
router.get('/tutors', getAllTutors);

// GET /api/users/admins - Phải đặt trước /:id để tránh match nhầm
router.get('/admins', getAllAdmins);

// GET /api/users/:id - Phải đặt sau các route cụ thể
router.get('/:id', getUserById);

export default router;

