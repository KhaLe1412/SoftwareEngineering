import { Request, Response } from 'express';
import { mockSessions } from '../data/sessions.js';
import { mockOpenSessions } from '../data/open_session.js';

// GET /api/sessions - Lấy tất cả sessions (có thể filter theo tutorId, studentId, status)
export const getAllSessions = (req: Request, res: Response) => {
  try {
    const { tutorId, studentId, status } = req.query;
    
    let sessions = [...mockSessions, ...mockOpenSessions];

    // Filter theo tutorId
    if (tutorId) {
      sessions = sessions.filter(s => s.tutorId === tutorId);
    }

    // Filter theo studentId
    if (studentId) {
      sessions = sessions.filter(s => s.studentId === studentId);
    }

    // Filter theo status
    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sessions/:id - Lấy session theo ID
export const getSessionById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const allSessions = [...mockSessions, ...mockOpenSessions];
    const session = allSessions.find(s => s.id === id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/sessions - Tạo session mới
export const createSession = (req: Request, res: Response) => {
  try {
    const session = req.body;
    
    // Generate ID mới
    const newId = `ses${Date.now()}`;
    const newSession = {
      ...session,
      id: newId,
      status: session.status || 'scheduled'
    };

    // Trong thực tế, bạn sẽ lưu vào database
    // Ở đây chỉ trả về session đã tạo
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/sessions/:id - Cập nhật session
export const updateSession = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allSessions = [...mockSessions, ...mockOpenSessions];
    const sessionIndex = allSessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Trong thực tế, bạn sẽ cập nhật trong database
    const updatedSession = {
      ...allSessions[sessionIndex],
      ...updates
    };

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/sessions/:id - Xóa session
export const deleteSession = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const allSessions = [...mockSessions, ...mockOpenSessions];
    const session = allSessions.find(s => s.id === id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Trong thực tế, bạn sẽ xóa từ database
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sessions/open - Lấy tất cả open sessions
export const getOpenSessions = (req: Request, res: Response) => {
  try {
    res.status(200).json(mockOpenSessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

