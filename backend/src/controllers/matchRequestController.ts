// import { Request, Response } from 'express';
// import { mockMatchRequests } from '../data/match_request.js';

// // GET /api/match-requests - Lấy tất cả match requests
// export const getAllMatchRequests = (req: Request, res: Response) => {
//   try {
//     const { studentId, status } = req.query;
    
//     let requests = mockMatchRequests;

//     // Filter theo studentId
//     if (studentId) {
//       requests = requests.filter(r => r.studentId === studentId);
//     }

//     // Filter theo status
//     if (status) {
//       requests = requests.filter(r => r.status === status);
//     }

//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET /api/match-requests/:id - Lấy match request theo ID
// export const getMatchRequestById = (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const request = mockMatchRequests.find(r => r.id === id);

//     if (!request) {
//       return res.status(404).json({ message: 'Match request not found' });
//     }

//     res.status(200).json(request);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // POST /api/match-requests - Tạo match request mới
// export const createMatchRequest = (req: Request, res: Response) => {
//   try {
//     const request = req.body;
    
//     // Generate ID mới
//     const newId = `mr${Date.now()}`;
//     const newRequest = {
//       ...request,
//       id: newId,
//       status: request.status || 'pending'
//     };

//     // Trong thực tế, bạn sẽ lưu vào database
//     res.status(201).json(newRequest);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // PUT /api/match-requests/:id - Cập nhật match request
// export const updateMatchRequest = (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const requestIndex = mockMatchRequests.findIndex(r => r.id === id);

//     if (requestIndex === -1) {
//       return res.status(404).json({ message: 'Match request not found' });
//     }

//     // Trong thực tế, bạn sẽ cập nhật trong database
//     const updatedRequest = {
//       ...mockMatchRequests[requestIndex],
//       ...updates
//     };

//     res.status(200).json(updatedRequest);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

