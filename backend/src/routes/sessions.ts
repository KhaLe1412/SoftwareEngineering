import express from "express";
import {
  getSessionById,
  getAllSessions,
  createSessionManagement,
  updateSessionById,
  markSessionAsCompleted,
  deleteSessionById,
  joinSession,
  leaveSession,
  createRescheduleRequest,
  auto_matchTutor,
} from "../controllers/sessionController.js";
import {
  submitSessionFeedback,
  submitSessionReview,
} from "../controllers/evaluationController.js";
const router = express.Router();

// GET /api/sessions
router.get("/", getAllSessions);

// GET /api/sessions/:id
router.get("/:id", getSessionById);

// POST /api/sessions
router.post("/", createSessionManagement);

// PATCH /api/sessions/:id
router.patch("/:id", updateSessionById);

// DELETE /api/sessions/:id
router.delete("/:id", deleteSessionById);

// POST /api/sessions/:id/complete
router.post("/:id/complete", markSessionAsCompleted);

// POST /api/sessions/:id/join
router.post("/:id/join", joinSession);

// POST /api/sessions/:id/leave
router.post("/:id/leave", leaveSession);

// POST /api/sessions/:id/reschedule
router.post("/:id/reschedule", createRescheduleRequest);

// POST /api/sessions/auto-match
router.post("/auto-match", auto_matchTutor);

// POST /api/sessions/:id/review
router.post("/:id/review", submitSessionReview);

// POST /api/sessions/:id/feedback
router.post("/:id/feedback", submitSessionFeedback);

export default router;
