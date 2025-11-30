import { Request, Response } from "express";
import { RescheduleRequest } from "../types/type.js";
import { mockSessions } from "../data/session.js";
import { mockRescheduleRequests } from "../data/reschedule_request.js";
import { mockMessages } from "../data/message.js";
import { Message } from "../types/type.js";
/* ============================================
   POST /api/sessions/:id/join
============================================ */
export const joinSession = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, studentId } = req.body;

    // Accept both userId and studentId for compatibility
    const studentIdToUse = studentId || userId;
    if (!studentIdToUse) return res.status(400).json({ message: "Missing studentId or userId" });

    const session = mockSessions.find((s) => s.id === id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if session is open
    if (session.status !== "open") {
      return res.status(400).json({ message: "Session is not open for enrollment" });
    }

    // Initialize enrolledStudents if not exists
    if (!session.enrolledStudents) {
      session.enrolledStudents = [];
    }

    // Check if student already enrolled
    if (session.enrolledStudents.includes(studentIdToUse)) {
      return res.status(400).json({ message: "Student already enrolled in this session" });
    }

    // Check if session is full
    const currentEnrolled = session.enrolledStudents.length;
    if (currentEnrolled >= session.maxStudents) {
      return res.status(400).json({ message: "Session is full" });
    }

    // Add student to enrolledStudents
    session.enrolledStudents.push(studentIdToUse);

    // Update status to "full" if no slots left
    if (session.enrolledStudents.length >= session.maxStudents) {
      session.status = "full";
    }

    return res.status(200).json({
      message: "Student joined the session successfully",
      session,
    });
  } catch (error) {
    console.error("joinSession error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================
   POST /api/sessions/:id/leave
============================================ */
export const leaveSession = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, studentId } = req.body;

    // Accept both userId and studentId for compatibility
    const studentIdToUse = studentId || userId;
    if (!studentIdToUse) return res.status(400).json({ message: "Missing studentId or userId" });

    const session = mockSessions.find((s) => s.id === id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Initialize enrolledStudents if not exists
    if (!session.enrolledStudents) {
      session.enrolledStudents = [];
    }

    // Check if student is enrolled
    const studentIndex = session.enrolledStudents.indexOf(studentIdToUse);
    if (studentIndex === -1) {
      return res.status(400).json({ message: "Student is not enrolled in this session" });
    }

    // Remove student from enrolledStudents
    session.enrolledStudents.splice(studentIndex, 1);

    // Update status back to "open" if it was "full" and now has slots
    if (session.status === "full" && session.enrolledStudents.length < session.maxStudents) {
      session.status = "open";
    }

    return res.status(200).json({
      message: "Student left the session successfully",
      session,
    });
  } catch (error) {
    console.error("leaveSession error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================
   GET /api/requests/reschedule?userId=...
============================================ */
export const getRescheduleRequest = (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Missing or invalid userId" });
    }

    const requests = mockRescheduleRequests.filter((r) => {
      // Request phải do student gửi
      if (r.requesterRole !== "student") return false;

      const session = mockSessions.find((s) => s.id === r.sessionId);
      if (!session) return false;

      return session.tutorId === userId;
    });

    return res.status(200).json(requests);
  } catch (error) {
    console.error("getRescheduleRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* ============================================
   POST /api/sessions/:id/reschedule-request
   Body: {
      requesterId,
      requesterRole,
      newDate,
      newStartTime,
      newEndTime,
      reason
   }
============================================ */
export const createRescheduleRequest = (req: Request, res: Response) => {
  try {
    const { id } = req.params; // sessionId
    const { requesterId, requesterRole, newDate, newStartTime, newEndTime, reason } = req.body;

    if (!requesterId || requesterRole !== "student") {
      return res.status(400).json({ message: "Only students can request rescheduling" });
    }

    if (!newDate || !newStartTime || !newEndTime || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = mockSessions.find((s) => s.id === id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const newReq: RescheduleRequest = {
      id: "rr_" + Date.now(),
      sessionId: id,
      requesterId,
      requesterRole,
      newDate,
      newStartTime,
      newEndTime,
      reason,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    mockRescheduleRequests.push(newReq);

    return res.status(201).json({
      message: "Reschedule request created successfully",
      request: newReq,
    });
  } catch (error) {
    console.error("createRescheduleRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* ============================================
   POST /api/requests/reschedule/:id/approve
============================================ */
export const approveRescheduleRequest = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approverId } = req.body; // optional: id người approve (gia sư)

    const reqItem = mockRescheduleRequests.find((r) => r.id === id);
    if (!reqItem) return res.status(404).json({ message: "Request not found" });

    if (reqItem.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const session = mockSessions.find((s) => s.id === reqItem.sessionId);
    if (!session) return res.status(404).json({ message: "Related session not found" });

    // OPTIONAL: kiểm tra approver là tutor của session
    if (approverId && session.tutorId !== approverId) {
      return res.status(403).json({ message: "Only the session tutor can approve this request" });
    }

    // Lưu old time nếu cần (không bắt buộc)
    const oldDate = session.date;
    const oldStartTime = session.startTime;
    const oldEndTime = session.endTime;

    // Approve request và cập nhật session
    reqItem.status = "approved";
    session.date = reqItem.newDate;
    session.startTime = reqItem.newStartTime;
    session.endTime = reqItem.newEndTime;

    // Tạo thông báo message gửi đến tất cả enrolled students
    const notifications: Message[] = [];
    const now = Date.now();

    const messageContent = `Yêu cầu dời lịch cho buổi học "${session.subject}" (session ${session.id}) đã được chấp thuận.
Cũ: ${oldDate} ${oldStartTime} - ${oldEndTime}
Mới: ${reqItem.newDate} ${reqItem.newStartTime} - ${reqItem.newEndTime}
Vui lòng kiểm tra lịch học của bạn.`;

    (session.enrolledStudents || []).forEach((studentId, idx) => {
      const m: Message = {
        id: `msg_${now}_${idx}`,
        senderId: session.tutorId,
        receiverId: studentId,
        content: messageContent,
        timestamp: new Date(now + idx).toISOString(),
        read: false,
        type: "reschedule-notification",
        relatedSessionId: session.id,
      };
      mockMessages.push(m);
      notifications.push(m);
    });

    return res.status(200).json({
      message: "Reschedule approved",
      request: reqItem,
      updatedSession: session,
      notificationsSent: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("approveRescheduleRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================
   POST /api/requests/reschedule/:id/reject
============================================ */
export const rejectRescheduleRequest = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const request = mockRescheduleRequests.find((r) => r.id === id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";

    return res.status(200).json({
      message: "Reschedule rejected",
      request,
    });
  } catch (error) {
    console.error("rejectRescheduleRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================
   POST /api/sessions/auto-match
============================================ */
export const auto_matchTutor = (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Missing studentId" });
    }

    if (mockSessions.length === 0) {
      return res.status(404).json({ message: "No available sessions" });
    }

    // Chọn random session
    const randomIndex = Math.floor(Math.random() * mockSessions.length);
    const randomSession = mockSessions[randomIndex];

    return res.status(200).json({
      message: "Auto-matched session",
      matchedSession: randomSession,
    });

  } catch (error) {
    console.error("auto_matchTutor error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};