import { Request, Response } from "express";
import { mockSessions } from "../data/session.js";
import { mockStudents } from "../data/student.js";
import { mockTutors } from "../data/tutor.js";
import { mockMessages } from "../data/message.js";

import { Session } from "../types/type.js";
import { Message } from "../types/type.js";
import { send } from "process";

// Handler to get session managements
// GET /api/sessions
// Query Params: tutorId, studentId, status
// Description: Lấy tất cả session, gắn kèm thông tin của student và tutor
// Request body: none
// Response: {session: Session, students: Student[], tutor: Tutor}[]
export const getAllSessions = (req: Request, res: Response) => {
  console.log("Received getAllSessions request with query:", req.query);

  try {
    // Normalize and safely extract query params (handle arrays)
    const rawTutorId = req.query.tutorId;
    const rawStudentId = req.query.studentId;
    const rawStatus = req.query.status;

    const tutorId = Array.isArray(rawTutorId)
      ? String(rawTutorId[0])
      : rawTutorId
      ? String(rawTutorId)
      : undefined;
    const studentId = Array.isArray(rawStudentId)
      ? String(rawStudentId[0])
      : rawStudentId
      ? String(rawStudentId)
      : undefined;
    const status = Array.isArray(rawStatus)
      ? String(rawStatus[0])
      : rawStatus
      ? String(rawStatus)
      : undefined;

    // Lấy mock data từ mockSessions
    let sessions = [...mockSessions];
    const students = [...mockStudents];
    const tutors = [...mockTutors];

    // Filter theo tutorId (coerce types to string for safe comparison)
    if (tutorId) {
      sessions = sessions.filter((s) => String(s.tutorId) === tutorId);
    }
    // Filter theo studentId
    if (studentId) {
      sessions = sessions.filter(
        (s) =>
          Array.isArray(s.enrolledStudents) &&
          s.enrolledStudents.includes(studentId)
      );
    }
    // Filter theo status (string comparison)
    if (status) {
      sessions = sessions.filter((s) => String(s.status) === status);
    }

    // Gắn thông tin students và tutor vào sessions
    const sessionManagements = sessions.map((session) => {
      const sessionStudents = students.filter((stu) =>
        session.enrolledStudents.includes(stu.id)
      );
      const sessionTutor = tutors.find(
        (tut) => String(tut.id) === String(session.tutorId)
      );
      return {
        session: session,
        students: sessionStudents,
        tutor: sessionTutor || null,
      };
    });

    console.log("Thực hiện lấy thông tin sessions thành công");
    return res.status(200).json(sessionManagements);
  } catch (error) {
    console.error("getAllSessions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sessions/:id
// Description: Lấy thông tin một session theo ID, kèm thông tin tutor và danh sách học sinh đã đăng ký
// Params: id: string
export const getSessionById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = mockSessions.find((s) => s.id === id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const students = mockStudents.filter((stu) =>
      session.enrolledStudents.includes(stu.id)
    );
    const tutor = mockTutors.find((tut) => String(tut.id) === String(session.tutorId));

    return res.status(200).json({
      session,
      students,
      tutor: tutor || null,
    });
  } catch (error) {
    console.error("getSessionById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Handler to create a session management
// POST /api/sessions
// Description: Tạo một session management mới
// Request body: sessionData: {subject: string, date: string, startTime: string, endTime: string
//                             type: 'online' | 'in-person', location?: string, meetLink?: string
//                              notes?: string, maxStudents?: number}
//               tutorId: string
// Response: none
export const createSessionManagement = (req: Request, res: Response) => {
  try {
    // Get sessionData and tutorId from request body
    const sessionData = req.body.sessionData;
    const tutorId = req.body.tutorId;

    console.log("Received createSessionManagement request with body:", req.body);
    
    if (!sessionData || !tutorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Validate required fields
    const subject = sessionData.subject;
    const date = sessionData.date;
    const startTime = sessionData.startTime;
    const endTime = sessionData.endTime;
    const type = sessionData.type;
    const location = sessionData.location;
    const meetLink = sessionData.meetLink;
    const notes = sessionData.notes || "";
    const maxStudents = sessionData.maxStudents || 10;
    if ( !subject || !date || !startTime || !endTime || !type ){
        return res.status(400).json({ message: "Missing required session data fields" });
    }
    if (type !== 'online' && type !== 'in-person') {
        return res.status(400).json({ message: "Invalid session type" });
    }
    if (type === 'online' && !meetLink) {
        return res.status(400).json({ message: "Missing meetLink for online session" });
    }
    if (type === 'in-person' && !location) {
        return res.status(400).json({ message: "Missing location for in-person session" });
    }

    // Create new sessions (e.g., save to database)
    const newSession: Session = {
        id: `ses${Date.now()}`,
        tutorId: tutorId,
        subject: subject,
        date: date,
        startTime: startTime,
        endTime: endTime,
        type: type,
        status: 'open',
        location: location,
        meetingLink: meetLink,
        notes: notes,
        maxStudents: maxStudents,
        enrolledStudents: []
    };
    mockSessions.push(newSession);
    
    console.log("Creating new session management:", sessionData);
    return res.status(201).json({ message: "Session management created" });
  } catch (error) {
    console.error("createSessionManagement error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Handler to update session by ID
// PATCH /api/sessions/:id
// Description: Cập nhật thông tin session theo ID
// Params: id: string
// Request body: updateData: Partial<Session>
//               reason: string (only for notification)
// Response: none
// Note: If date, startTime, endTime are updated, ensure no conflicts with existing sessions for the tutor. 
// Also create a message notification to all enrolled students about the update.
export const updateSessionById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Treat incoming body as a partial Session, but enforce at runtime
    const updateData = req.body.updateData as Partial<Session>;
    const reason = req.body.reason as string | undefined;
    // Whitelist of allowed Session properties that may be updated
    const allowedKeys = new Set([
      "date",
      "startTime",
      "endTime",
      "type",
      "status",
      "location",
      "meetingLink",
      "notes",
      "maxStudents",
      "enrolledStudents",
    ]);

    // Filter updateData to only allowed keys (protects against extra/malicious fields)
    const filteredUpdate: Partial<Session> = {};
    Object.keys(updateData || {}).forEach((key) => {
      if (allowedKeys.has(key)) {
        // assign with any cast because keys are dynamic
        (filteredUpdate as any)[key] = (updateData as any)[key];
      }
    });

    if (Object.keys(filteredUpdate).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Minimal type checks for some fields (add more as needed or use a schema validator)
    if (
      filteredUpdate.maxStudents !== undefined &&
      typeof filteredUpdate.maxStudents !== "number"
    ) {
      return res.status(400).json({ message: "Invalid type for maxStudents" });
    }
    if (
      filteredUpdate.enrolledStudents !== undefined &&
      !Array.isArray(filteredUpdate.enrolledStudents)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid type for enrolledStudents; expected array" });
    }
    const sessionIndex = mockSessions.findIndex((s) => s.id === id);
    if (sessionIndex === -1) {
      return res.status(404).json({ message: "Session not found" });
    }

    function timeToMinutes(t: string) {
        const [h, m] = t.split(':').map(Number);
        return h*60 + m;
    }

    const newDate = filteredUpdate.date ?? mockSessions[sessionIndex].date;
    const newStart = filteredUpdate.startTime ?? mockSessions[sessionIndex].startTime;
    const newEnd = filteredUpdate.endTime ?? mockSessions[sessionIndex].endTime;

    const newStartMin = timeToMinutes(newStart);
    const newEndMin = timeToMinutes(newEnd);

    const conflicts = mockSessions.some(s =>
    s.id !== id &&
    String(s.tutorId) === String(mockSessions[sessionIndex].tutorId) &&
    String(s.date) === String(newDate) &&
    // khoảng thời gian chồng lấp
    !(timeToMinutes(s.endTime) <= newStartMin || timeToMinutes(s.startTime) >= newEndMin)
    );

    if (conflicts) {
        return res.status(409).json({ message: 'Schedule conflict with another session' });
    }

    if (newDate || newStart || newEnd) {
        // Tạo thông báo cho tất cả học sinh đã đăng ký về việc cập nhật lịch học
        const enrolledStudents = mockSessions[sessionIndex].enrolledStudents;
        enrolledStudents.forEach(studentId => {
            const newMessage: Message = {
                id: `msg-${Date.now()}-${studentId}`,
                senderId: String(mockSessions[sessionIndex].tutorId),
                receiverId: studentId,
                content: `The session "${mockSessions[sessionIndex].subject}" has been updated. New schedule: ${newDate} from ${newStart} to ${newEnd}. ${reason ? 'Reason: ' + reason : ''}`,
                timestamp: new Date().toISOString(),
                read: false,
                type: 'reschedule-notification',
                relatedSessionId: mockSessions[sessionIndex].id
            };
            mockMessages.push(newMessage);
        })
    }


    // Cập nhật session với dữ liệu đã được lọc
    mockSessions[sessionIndex] = {
      ...mockSessions[sessionIndex],
      ...filteredUpdate,
    };
    console.log("Updated session:", mockSessions[sessionIndex]);
    return res.status(200).json({ message: "Session updated" });
  } catch (error) {
    console.error("updateSessionById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Handler to delete session by ID
// DELETE /api/sessions/:id
// Description: Xóa một session management theo ID
// Params: id: string 
// Request body: none
// Response: none
export const deleteSessionById = (req: Request, res: Response) => {
  try {
    // Retrieve session ID from request parameters
    const { id } = req.params;
    const sessionIndex = mockSessions.findIndex((s) => s.id === id);
    if (sessionIndex === -1) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Remove the session from the mockSessions array
    mockSessions.splice(sessionIndex, 1);
    console.log(`Deleted session with ID: ${id}`);
    return res.status(200).json({ message: "Session deleted" });

  } catch (error) {
    console.error("deleteSessionById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


// Handler to mark completed sessions
// POST /api/sessions/:id/complete
// Description: Đánh dấu một session là completed
// Params: id: string 
// Request body: none
// Response: none
export const markSessionAsCompleted = (req: Request, res: Response) => {
  try {
    // Retrieve session ID from request parameters
    const { id } = req.params;
    const sessionIndex = mockSessions.findIndex((s) => s.id === id);


    // Log the received request ID
    console.log("Received markSessionAsCompleted request for ID:", id);
    
    if (sessionIndex === -1) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Mark the session as completed
    mockSessions[sessionIndex].status = 'completed';
    console.log(`Marked session with ID: ${id} as completed`);
    return res.status(200).json({ message: "Session marked as completed" });

  } catch (error) {
    console.error("markSessionAsCompleted error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}