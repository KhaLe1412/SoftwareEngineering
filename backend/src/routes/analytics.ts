import express from 'express';
import { getKPIs, getMonthlyTrends, getCoursePerformance } from '../components/reportings&analytics.js';

const router = express.Router();
// GET /api/analytics/kpis
router.get('/kpis', getKPIs);
// GET /api/analytics/monthly-trends
router.get('/monthly-trends', getMonthlyTrends);
// GET /api/analytics/course-performance
router.get('/course-performance', getCoursePerformance);

export default router;