import express from 'express';
import { getTutorInfo, createTutorInfo, updateTutorInfo, deleteTutorInfo } from '../components/user_managements.js';

const router = express.Router();
// GET /api/tutors
router.get('/', getTutorInfo);
// PATCH /api/tutors/:id    
router.patch('/:id', updateTutorInfo);
// POST /api/tutors
router.post('/', createTutorInfo);
// DELETE /api/tutors/:id
router.delete('/:id', deleteTutorInfo);

export default router;