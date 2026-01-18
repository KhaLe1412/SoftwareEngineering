import { Request, Response } from "express";
import { mockStudents } from "../data/student.js";
import { mockSessions } from "../data/session.js";
import { mockTutors } from "../data/tutor.js";

// GET /api/analytics/kpis
export const getKPIs = (req: Request, res: Response) => {
  try {
    const kpis = {
      totalStudents: mockStudents.length,
      totalTutors: mockTutors.length,
      totalSessions: mockSessions.length,
      completedSessions: mockSessions.filter((s) => s.status === "completed")
        .length,
      //activeStudents: mockStudents.filter((s) => s.isActive).length,
      //activeTutors: mockTutors.filter((t) => t.isActive).length,
    };

    res.status(200).json(kpis);
  } catch (error) {
    console.error("getKPIs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/analytics/monthly-trends
export const getMonthlyTrends = (req: Request, res: Response) => {
  try {
    // Mock monthly trends data
    const trends = {
      sessions: [
        { month: "Jan", total: 45, completed: 38 },
        { month: "Feb", total: 52, completed: 45 },
        { month: "Mar", total: 48, completed: 41 },
        { month: "Apr", total: 61, completed: 56 },
      ],
      students: [
        { month: "Jan", active: 120 },
        { month: "Feb", active: 135 },
        { month: "Mar", active: 142 },
        { month: "Apr", active: 158 },
      ],
    };

    res.status(200).json(trends);
  } catch (error) {
    console.error("getMonthlyTrends error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/analytics/course-performance
export const getCoursePerformance = (req: Request, res: Response) => {
  try {
    // Mock course performance data
    const coursePerformance = [
      {
        subject: "Mathematics",
        totalSessions: 25,
        averageRating: 4.5,
        completionRate: 92,
      },
      {
        subject: "Physics",
        totalSessions: 18,
        averageRating: 4.2,
        completionRate: 88,
      },
      {
        subject: "Chemistry",
        totalSessions: 22,
        averageRating: 4.6,
        completionRate: 95,
      },
      {
        subject: "Biology",
        totalSessions: 15,
        averageRating: 4.3,
        completionRate: 87,
      },
    ];

    res.status(200).json(coursePerformance);
  } catch (error) {
    console.error("getCoursePerformance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
