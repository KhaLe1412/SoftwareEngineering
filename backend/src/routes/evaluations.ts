import express from 'express';
import {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation
} from '../controllers/evaluationController.js';

const router = express.Router();

// GET /api/evaluations
router.get('/', getAllEvaluations);

// GET /api/evaluations/:id
router.get('/:id', getEvaluationById);

// POST /api/evaluations
router.post('/', createEvaluation);

// PUT /api/evaluations/:id
router.put('/:id', updateEvaluation);

export default router;

