import express from 'express';
import { getLibraryResources, downloadLibraryResource } from '../components/library_service.js';

const router = express.Router();

// GET /api/library/resources
router.get('/resources', getLibraryResources);

// GET /api/library/resources/:id/download
router.get('/resources/:id/download', downloadLibraryResource);

export default router;

