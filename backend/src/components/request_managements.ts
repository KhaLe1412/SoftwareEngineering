import { Request, Response } from 'express';

// POST /api/sessions/:id/join
export const joinSession = (req: Request, res: Response) => {}

// POST /api/sessions/:id/leave
export const leaveSession = (req: Request, res: Response) => {}

// GET /api/requests/reschedule
export const getRescheduleRequest = (req: Request, res: Response) => {}

// POST /api/sessions/:id/reschedule
export const createRescheduleRequest = (req: Request, res: Response) => {}


// POST /api/requests/reschedule/:id/approve
export const approveRescheduleRequest = (req: Request, res: Response) => {}

// POST /api/requests/reschedule/:id/reject
export const rejectRescheduleRequest = (req: Request, res: Response) => {}

// POST /api/sessions/auto-match
export const auto_matchTutor = (req: Request, res: Response) => {}