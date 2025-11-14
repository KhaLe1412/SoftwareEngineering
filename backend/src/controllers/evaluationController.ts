import { Request, Response } from 'express';
import { mockStudentEvaluations } from '../data/student_evalution.js';

// GET /api/evaluations - Lấy tất cả evaluations (có thể filter)
export const getAllEvaluations = (req: Request, res: Response) => {
  try {
    const { studentId, tutorId, sessionId } = req.query;
    
    let evaluations = mockStudentEvaluations;

    // Filter theo studentId
    if (studentId) {
      evaluations = evaluations.filter(e => e.studentId === studentId);
    }

    // Filter theo tutorId
    if (tutorId) {
      evaluations = evaluations.filter(e => e.tutorId === tutorId);
    }

    // Filter theo sessionId
    if (sessionId) {
      evaluations = evaluations.filter(e => e.sessionId === sessionId);
    }

    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/evaluations/:id - Lấy evaluation theo ID
export const getEvaluationById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evaluation = mockStudentEvaluations.find(e => e.id === id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/evaluations - Tạo evaluation mới
export const createEvaluation = (req: Request, res: Response) => {
  try {
    const evaluation = req.body;
    
    const newId = `eval${Date.now()}`;
    const newEvaluation = {
      ...evaluation,
      id: newId,
      createdAt: evaluation.createdAt || new Date().toISOString()
    };

    res.status(201).json(newEvaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/evaluations/:id - Cập nhật evaluation
export const updateEvaluation = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const evaluationIndex = mockStudentEvaluations.findIndex(e => e.id === id);

    if (evaluationIndex === -1) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    const updatedEvaluation = {
      ...mockStudentEvaluations[evaluationIndex],
      ...updates
    };

    res.status(200).json(updatedEvaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

