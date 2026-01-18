import { Request, Response } from 'express';
import { mockStudentEvaluations } from '../data/student_evaluation.js';
import { mockSessions } from '../data/session.js';
import { StudentEvaluation, Session } from '../types/type.js';

// GET /api/evaluations
export const getAllEvaluations = (req: Request, res: Response) => {
	try {
		const { studentId, tutorId, sessionId } = req.query;

		let evaluations = [...mockStudentEvaluations];

		if (studentId) {
			evaluations = evaluations.filter((e) => e.studentId === String(studentId));
		}
		if (tutorId) {
			evaluations = evaluations.filter((e) => e.tutorId === String(tutorId));
		}
		if (sessionId) {
			evaluations = evaluations.filter((e) => e.sessionId === String(sessionId));
		}

		return res.status(200).json(evaluations);
	} catch (error) {
		console.error('getAllEvaluations error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

// GET /api/evaluations/:id
export const getEvaluationById = (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const evaluation = mockStudentEvaluations.find((e) => e.id === id);
		if (!evaluation) {
			return res.status(404).json({ message: 'Evaluation not found' });
		}
		return res.status(200).json(evaluation);
	} catch (error) {
		console.error('getEvaluationById error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

// POST /api/evaluations
export const createEvaluation = (req: Request, res: Response) => {
	try {
		const payload = req.body as Partial<StudentEvaluation>;
		if (!payload || !payload.studentId || !payload.tutorId || !payload.sessionId) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const newEval: StudentEvaluation = {
			id: `eval${Date.now()}`,
			studentId: payload.studentId,
			tutorId: payload.tutorId,
			sessionId: payload.sessionId,
			skills: payload.skills || { understanding: 0, participation: 0, preparation: 0 },
			attitude: payload.attitude ?? 0,
			testResults: payload.testResults,
			overallProgress: payload.overallProgress || '',
			recommendations: payload.recommendations || '',
			createdAt: new Date().toISOString(),
		};

		mockStudentEvaluations.push(newEval);
		console.log('Created evaluation:', newEval);
		return res.status(201).json(newEval);
	} catch (error) {
		console.error('createEvaluation error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

// PUT /api/evaluations/:id
export const updateEvaluation = (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updates = req.body as Partial<StudentEvaluation>;
		const idx = mockStudentEvaluations.findIndex((e) => e.id === id);
		if (idx === -1) return res.status(404).json({ message: 'Evaluation not found' });

		mockStudentEvaluations[idx] = {
			...mockStudentEvaluations[idx],
			...updates,
		};

		return res.status(200).json(mockStudentEvaluations[idx]);
	} catch (error) {
		console.error('updateEvaluation error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

// DELETE /api/evaluations/:id
export const deleteEvaluation = (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const idx = mockStudentEvaluations.findIndex((e) => e.id === id);
		if (idx === -1) return res.status(404).json({ message: 'Evaluation not found' });
		mockStudentEvaluations.splice(idx, 1);
		return res.status(200).json({ message: 'Evaluation deleted' });
	} catch (error) {
		console.error('deleteEvaluation error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

// POST /api/sessions/:id/review
// Adds a review entry under session.reviews
export const submitSessionReview = (req: Request, res: Response) => {
	try {
		const { id } = req.params; // session id
		const { studentId, rating, comment } = req.body as { studentId?: string; rating?: number; comment?: string };
		if (!studentId || rating === undefined) {
			return res.status(400).json({ message: 'Missing studentId or rating' });
		}

		const session = mockSessions.find((s) => s.id === id) as Session | undefined;
		if (!session) return res.status(404).json({ message: 'Session not found' });

		if (!session.reviews) session.reviews = [];

		// If the same student already submitted a review for this session, update it instead of appending
		const existingIdx = session.reviews.findIndex(r => r.studentId === studentId);
		const reviewObj = { studentId, rating, comment: comment || '', submittedAt: new Date().toISOString() } as any;
		if (existingIdx !== -1) {
			// merge with previous (preserve any other fields)
			session.reviews[existingIdx] = { ...session.reviews[existingIdx], ...reviewObj };
			return res.status(200).json({ message: 'Review updated', review: session.reviews[existingIdx] });
		} else {
			session.reviews.push(reviewObj);
			return res.status(201).json({ message: 'Review submitted', review: reviewObj });
		}
	} catch (error) {
		console.error('submitSessionReview error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

// POST /api/sessions/:id/feedback
// Adds or updates the tutor feedback object for the session
export const submitSessionFeedback = (req: Request, res: Response) => {
	try {
		const { id } = req.params; // session id
		const feedback = req.body;
		if (!feedback) return res.status(400).json({ message: 'Missing feedback payload' });

		const session = mockSessions.find((s) => s.id === id) as Session | undefined;
		if (!session) return res.status(404).json({ message: 'Session not found' });

		if (!session.feedback) {
			// create new feedback
			session.feedback = {
				id: `fb-${Date.now()}`,
				sessionId: id,
				studentRating: feedback.studentRating ?? null,
				studentComment: feedback.studentComment ?? '',
				tutorProgress: feedback.tutorProgress ?? '',
				tutorNotes: feedback.tutorNotes ?? '',
				submittedAt: new Date().toISOString(),
			} as any;
			return res.status(201).json({ message: 'Feedback submitted', feedback: session.feedback });
		} else {
			// update existing feedback (merge)
			session.feedback = {
				...session.feedback,
				sessionId: id,
				studentRating: feedback.studentRating ?? session.feedback.studentRating ?? null,
				studentComment: feedback.studentComment ?? session.feedback.studentComment ?? '',
				tutorProgress: feedback.tutorProgress ?? session.feedback.tutorProgress ?? '',
				tutorNotes: feedback.tutorNotes ?? session.feedback.tutorNotes ?? '',
				submittedAt: new Date().toISOString(),
			} as any;
			return res.status(200).json({ message: 'Feedback updated', feedback: session.feedback });
		}
	} catch (error) {
		console.error('submitSessionFeedback error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};