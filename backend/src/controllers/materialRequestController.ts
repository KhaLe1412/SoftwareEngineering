import { Request, Response } from 'express';
import { mockMaterialAccessRequests } from '../data/material_request.js';

// GET /api/material-requests - Lấy tất cả material access requests
export const getAllMaterialRequests = (req: Request, res: Response) => {
  try {
    const { sessionId, studentId, status } = req.query;
    
    let requests = mockMaterialAccessRequests;

    // Filter theo sessionId
    if (sessionId) {
      requests = requests.filter(r => r.sessionId === sessionId);
    }

    // Filter theo studentId
    if (studentId) {
      requests = requests.filter(r => r.studentId === studentId);
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

// GET /api/material-requests/:id
export const getMaterialRequestById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = mockMaterialAccessRequests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ message: 'Material request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/material-requests - Tạo material request mới
export const createMaterialRequest = (req: Request, res: Response) => {
  try {
    const request = req.body;
    
    const newId = `mar${Date.now()}`;
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

// PUT /api/material-requests/:id - Cập nhật material request
export const updateMaterialRequest = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const requestIndex = mockMaterialAccessRequests.findIndex(r => r.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Material request not found' });
    }

    const updatedRequest = {
      ...mockMaterialAccessRequests[requestIndex],
      ...updates
    };

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

