import express from 'express';
import {getAllEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation, createEvaluation} from '../components/evaluation_managements.js';

const router = express.Router();

// GET /api/evaluations
router.get('/', getAllEvaluations);

// GET /api/evaluations/:id
router.get('/:id', getEvaluationById);

// POST /api/evaluations
router.post('/', createEvaluation);

// PUT /api/evaluations/:id
router.put('/:id', updateEvaluation);

// DELETE /api/evaluations/:id
router.delete('/:id', deleteEvaluation);

export default router;

