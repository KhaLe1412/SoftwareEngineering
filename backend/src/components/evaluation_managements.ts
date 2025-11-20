import { Request, Response } from 'express';

// GET /api/tutors/:id/evaluations (Bỏ, dùng query param cho getAllEvalutation thay vì route param)
//export const getTutorEvaluations = (req: Request, res: Response) => {}

// GET /api/evaluations
export const getAllEvaluations = (req: Request, res: Response) => {}

// POST /api/evaluations
export const createEvaluation = (req: Request, res: Response) => {}

// POST /api/sessions/:id/review
export const submitSessionReview = (req: Request, res: Response) => {}

// POST /api/sessions/:id/feedback
export const submitSessionFeedback = (req: Request, res: Response) => {}

