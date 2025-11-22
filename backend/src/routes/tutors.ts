import express from 'express';
import {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor
} from '../controllers/tutorController.js';
import { requireUserId } from '../middleware/requireUserId.js';

const router = express.Router();

// Enforce userId on all routes
router.use(requireUserId);

// GET /api/tutors
router.get('/', getAllTutors);

// GET /api/tutors/:id
router.get('/:id', getTutorById);

// POST /api/tutors
router.post('/', createTutor);

// PATCH /api/tutors/:id
router.patch('/:id', updateTutor);

// DELETE /api/tutors/:id
router.delete('/:id', deleteTutor);

export default router;