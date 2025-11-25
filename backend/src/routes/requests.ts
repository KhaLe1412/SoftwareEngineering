import express from 'express';
import { approveRescheduleRequest, rejectRescheduleRequest } from '../components/request_managements.js';

const router = express.Router();

// POST /api/requests/reschedule/:id/approve
router.post('/reschedule/:id/approve', approveRescheduleRequest);

// POST /api/requests/reschedule/:id/reject
router.post('/reschedule/:id/reject', rejectRescheduleRequest);

export default router;