import express from 'express';
import {
  getAllRescheduleRequests,
  getRescheduleRequestById,
  createRescheduleRequest,
  updateRescheduleRequest
} from '../controllers/rescheduleController.js';

const router = express.Router();

// GET /api/reschedule-requests
router.get('/', getAllRescheduleRequests);

// GET /api/reschedule-requests/:id
router.get('/:id', getRescheduleRequestById);

// POST /api/reschedule-requests
router.post('/', createRescheduleRequest);

// PUT /api/reschedule-requests/:id
router.put('/:id', updateRescheduleRequest);

export default router;

