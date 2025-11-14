import express from 'express';
import {
  getAllMatchRequests,
  getMatchRequestById,
  createMatchRequest,
  updateMatchRequest
} from '../controllers/matchRequestController.js';

const router = express.Router();

// GET /api/match-requests
router.get('/', getAllMatchRequests);

// GET /api/match-requests/:id
router.get('/:id', getMatchRequestById);

// POST /api/match-requests
router.post('/', createMatchRequest);

// PUT /api/match-requests/:id
router.put('/:id', updateMatchRequest);

export default router;

