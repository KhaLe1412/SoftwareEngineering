import { Request, Response } from 'express';

// GET /api/messages/conversations
export const getConversations = (req: Request, res: Response) => {}

// GET /api/messages?partnerId=:id
export const getMessages = (req: Request, res: Response) => {}

// POST /api/messages
export const sendMessage = (req: Request, res: Response) => {}

// GET /api/messages/notifications
export const getNotifications = (req: Request, res: Response) => {}

// PATCH /api/messages/:id/read
export const markMessageAsRead = (req: Request, res: Response) => {}