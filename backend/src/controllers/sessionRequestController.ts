import { Request, Response } from 'express';
import { mockSessionRequests } from '../data/session_request.js';

// GET /api/session-requests - Lấy tất cả session requests (có thể filter)
export const getAllSessionRequests = (req: Request, res: Response) => {
  try {
    const { studentId, tutorId, status } = req.query;
    
    let requests = mockSessionRequests;

    // Filter theo studentId
    if (studentId) {
      requests = requests.filter(r => r.studentId === studentId);
    }

    // Filter theo tutorId
    if (tutorId) {
      requests = requests.filter(r => r.tutorId === tutorId);
    }

    // Filter theo status
    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/session-requests/:id - Lấy session request theo ID
export const getSessionRequestById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = mockSessionRequests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ message: 'Session request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/session-requests - Tạo session request mới
export const createSessionRequest = (req: Request, res: Response) => {
  try {
    const request = req.body;
    
    // Generate ID mới
    const newId = `sr${Date.now()}`;
    const newRequest = {
      ...request,
      id: newId,
      status: request.status || 'pending'
    };

    // Trong thực tế, bạn sẽ lưu vào database
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/session-requests/:id - Cập nhật session request (approve/reject)
export const updateSessionRequest = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const requestIndex = mockSessionRequests.findIndex(r => r.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Session request not found' });
    }

    // Trong thực tế, bạn sẽ cập nhật trong database
    const updatedRequest = {
      ...mockSessionRequests[requestIndex],
      ...updates
    };

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

