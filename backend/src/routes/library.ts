import express from 'express';
import {
  getAllLibraryResources,
  getLibraryResourceById
} from '../controllers/libraryController.js';

const router = express.Router();

// GET /api/library
router.get('/', getAllLibraryResources);

// GET /api/library/:id
router.get('/:id', getLibraryResourceById);

export default router;

