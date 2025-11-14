import express from 'express';
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getOpenSessions
} from '../controllers/sessionController.js';

const router = express.Router();

// GET /api/sessions
router.get('/', getAllSessions);

// GET /api/sessions/open - Phải đặt trước /:id để tránh match nhầm
router.get('/open', getOpenSessions);

// GET /api/sessions/:id
router.get('/:id', getSessionById);

// POST /api/sessions
router.post('/', createSession);

// PUT /api/sessions/:id
router.put('/:id', updateSession);

// DELETE /api/sessions/:id
router.delete('/:id', deleteSession);

export default router;

