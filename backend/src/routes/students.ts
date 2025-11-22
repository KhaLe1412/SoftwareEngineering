import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { requireUserId } from '../middleware/requireUserId.js';

const router = express.Router();

// Enforce userId on all routes
router.use(requireUserId);

// GET /api/students
router.get('/', getAllStudents);

// GET /api/students/:id
router.get('/:id', getStudentById);

// POST /api/students
router.post('/', createStudent);

// PATCH /api/students/:id
router.patch('/:id', updateStudent);

// DELETE /api/students/:id
router.delete('/:id', deleteStudent);

export default router;