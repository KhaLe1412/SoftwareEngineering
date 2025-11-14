import { Request, Response } from 'express';
import { mockRescheduleRequests } from '../data/reschedule_request.js';

// GET /api/reschedule-requests - Lấy tất cả reschedule requests
export const getAllRescheduleRequests = (req: Request, res: Response) => {
  try {
    const { sessionId, requesterId, status } = req.query;
    
    let requests = mockRescheduleRequests;

    // Filter theo sessionId
    if (sessionId) {
      requests = requests.filter(r => r.sessionId === sessionId);
    }

    // Filter theo requesterId
    if (requesterId) {
      requests = requests.filter(r => r.requesterId === requesterId);
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

// GET /api/reschedule-requests/:id
export const getRescheduleRequestById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = mockRescheduleRequests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/reschedule-requests - Tạo reschedule request mới
export const createRescheduleRequest = (req: Request, res: Response) => {
  try {
    const request = req.body;
    
    const newId = `rr${Date.now()}`;
    const newRequest = {
      ...request,
      id: newId,
      status: request.status || 'pending',
      createdAt: request.createdAt || new Date().toISOString()
    };

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/reschedule-requests/:id - Cập nhật reschedule request
export const updateRescheduleRequest = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const requestIndex = mockRescheduleRequests.findIndex(r => r.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    const updatedRequest = {
      ...mockRescheduleRequests[requestIndex],
      ...updates
    };

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

