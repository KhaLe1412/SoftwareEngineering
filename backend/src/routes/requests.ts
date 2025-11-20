import express from 'express';
import { approveRescheduleRequest, rejectRescheduleRequest } from '../components/request_managements.js';

const router = express.Router();

// POST /api/requests/reschedule/:id/approve
router.post('/requests/reschedule/:id/approve', approveRescheduleRequest);

// POST /api/requests/reschedule/:id/reject
router.post('/requests/reschedule/:id/reject', rejectRescheduleRequest);

export default router;