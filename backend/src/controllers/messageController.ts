import { Request, Response } from 'express';
import { mockMessages } from '../data/message.js';

// GET /api/messages - Lấy tất cả messages (có thể filter theo senderId, receiverId)
export const getAllMessages = (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, conversationId } = req.query;
    
    let messages = mockMessages;

    // Filter theo senderId
    if (senderId) {
      messages = messages.filter(m => m.senderId === senderId);
    }

    // Filter theo receiverId
    if (receiverId) {
      messages = messages.filter(m => m.receiverId === receiverId);
    }

    // Filter theo conversation (messages giữa 2 users)
    if (conversationId && typeof conversationId === 'string') {
      const [userId1, userId2] = conversationId.split('-');
      messages = messages.filter(m => 
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/messages/:id - Lấy message theo ID
export const getMessageById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = mockMessages.find(m => m.id === id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/messages - Tạo message mới
export const createMessage = (req: Request, res: Response) => {
  try {
    const message = req.body;
    
    // Generate ID mới
    const newId = `msg${Date.now()}`;
    const newMessage = {
      ...message,
      id: newId,
      timestamp: message.timestamp || new Date().toISOString(),
      read: message.read || false
    };

    // Trong thực tế, bạn sẽ lưu vào database
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/messages/:id - Cập nhật message (ví dụ: đánh dấu đã đọc)
export const updateMessage = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const messageIndex = mockMessages.findIndex(m => m.id === id);

    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Trong thực tế, bạn sẽ cập nhật trong database
    const updatedMessage = {
      ...mockMessages[messageIndex],
      ...updates
    };

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

