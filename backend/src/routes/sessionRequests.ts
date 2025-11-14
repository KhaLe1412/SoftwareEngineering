import express from 'express';
import {
  getAllSessionRequests,
  getSessionRequestById,
  createSessionRequest,
  updateSessionRequest
} from '../controllers/sessionRequestController.js';

const router = express.Router();

// GET /api/session-requests
router.get('/', getAllSessionRequests);

// GET /api/session-requests/:id
router.get('/:id', getSessionRequestById);

// POST /api/session-requests
router.post('/', createSessionRequest);

// PUT /api/session-requests/:id
router.put('/:id', updateSessionRequest);

export default router;

