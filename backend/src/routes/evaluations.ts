import express from 'express';
import {getAllEvaluations} from '../components/evaluation_managements.js';

const router = express.Router();

// GET /api/evaluations
router.get('/', getAllEvaluations);

export default router;

