import express from 'express';
import { getStudentCreditsReport, exportReport } from '../components/reportings&analytics.js';

const router = express.Router();
// GET /api/reports/student-credits
router.get('/student-credits', getStudentCreditsReport);
// GET /api/reports/export
router.get('/export', exportReport);

export default router;