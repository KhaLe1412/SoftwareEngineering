import express from 'express';
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage
} from '../controllers/messageController.js';

const router = express.Router();

// GET /api/messages
router.get('/', getAllMessages);

// GET /api/messages/:id
router.get('/:id', getMessageById);

// POST /api/messages
router.post('/', createMessage);

// PUT /api/messages/:id
router.put('/:id', updateMessage);

export default router;

