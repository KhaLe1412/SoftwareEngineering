import express from 'express';
import { getMessages, getConversations, sendMessage, getNotifications, markMessageAsRead  } from '../components/messaging_service.js';

const router = express.Router();

// GET api/messages/conversations
router.get('/conversations', getConversations);

// GET /api/messages?partnerId=:id
router.get('/', getMessages);

// POST /api/messages
router.post('/', sendMessage);

// GET /api/messages/notifications
router.get('/notifications', getNotifications);

// PATCH /api/messages/:id/read
router.patch('/:id/read', markMessageAsRead);

export default router;

