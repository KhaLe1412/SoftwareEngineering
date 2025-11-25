import express from 'express';
import { approveRescheduleRequest, rejectRescheduleRequest, getRescheduleRequest } from '../components/request_managements.js';

const router = express.Router();

// GET /api/requests/reschedule
router.get('/reschedule', getRescheduleRequest);

// POST /api/requests/reschedule/:id/approve
router.post('/reschedule/:id/approve', approveRescheduleRequest);

// POST /api/requests/reschedule/:id/reject
router.post('/reschedule/:id/reject', rejectRescheduleRequest);

export default router;