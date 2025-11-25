import express from 'express';
import { createStudentInfo, deleteStudentInfo, getStudentInfo, updateStudentInfo } from '../components/user_managements.js';

const router = express.Router();
// GET /api/students
router.get('/', getStudentInfo);
// PATCH /api/students/:id
router.patch('/:id', updateStudentInfo);
// POST /api/students
router.post('/', createStudentInfo);
// DELETE /api/students/:id
router.delete('/:id', deleteStudentInfo);

export default router;