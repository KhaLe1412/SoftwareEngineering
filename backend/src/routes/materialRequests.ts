import express from 'express';
import {
  getAllMaterialRequests,
  getMaterialRequestById,
  createMaterialRequest,
  updateMaterialRequest
} from '../controllers/materialRequestController.js';

const router = express.Router();

// GET /api/material-requests
router.get('/', getAllMaterialRequests);

// GET /api/material-requests/:id
router.get('/:id', getMaterialRequestById);

// POST /api/material-requests
router.post('/', createMaterialRequest);

// PUT /api/material-requests/:id
router.put('/:id', updateMaterialRequest);

export default router;

