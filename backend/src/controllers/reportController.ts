import { Request, Response } from "express";
import { mockStudents } from "../data/student.js";
import { mockSessions } from "../data/session.js";

// GET /api/reports/student-credits
export const getStudentCreditsReport = (req: Request, res: Response) => {
  try {
    const studentsWithCredits = mockStudents.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      //totalCredits: student.totalCredits || 0,
      completedSessions: mockSessions.filter(
        (session) =>
          session.enrolledStudents.includes(student.id) &&
          session.status === "completed",
      ).length,
    }));

    res.status(200).json(studentsWithCredits);
  } catch (error) {
    console.error("getStudentCreditsReport error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reports/export
export const exportReport = (req: Request, res: Response) => {
  try {
    const { type, format } = req.query;

    // Mock export functionality
    const exportData = {
      type: type || "general",
      format: format || "json",
      timestamp: new Date().toISOString(),
      data: {
        studentsCount: mockStudents.length,
        sessionsCount: mockSessions.length,
        completedSessions: mockSessions.filter((s) => s.status === "completed")
          .length,
      },
    };

    res.status(200).json({
      message: "Report exported successfully",
      export: exportData,
    });
  } catch (error) {
    console.error("exportReport error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
