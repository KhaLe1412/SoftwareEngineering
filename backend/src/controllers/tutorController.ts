import { Request, Response } from "express";
import { mockTutors } from "../data/tutor.js";
import { demoAccounts } from "../data/account.js";
import { Tutor } from "../types/type.js";

// GET /api/tutors - Lấy danh sách gia sư
export const getAllTutors = (req: Request, res: Response) => {
  try {
    const { department, expertise, subject } = req.query;

    let tutors = [...mockTutors];

    // Filter theo department
    if (department) {
      tutors = tutors.filter((t) => t.department === department);
    }

    // Filter theo expertise hoặc subject
    if (expertise && typeof expertise === "string") {
      tutors = tutors.filter((t) =>
        t.expertise.some((exp) =>
          exp.toLowerCase().includes(expertise.toLowerCase())
        )
      );
    }

    if (subject && typeof subject === "string") {
      tutors = tutors.filter((t) =>
        t.expertise.some((exp) =>
          exp.toLowerCase().includes(subject.toLowerCase())
        )
      );
    }

    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tutors/:id - Lấy tutor theo ID
export const getTutorById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tutor = mockTutors.find((t) => t.id === id);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.status(200).json(tutor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/tutors - Tạo gia sư mới và tài khoản
export const createTutor = (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      tutorId,
      department,
      expertise,
      rating,
      totalSessions,
      username,
      password,
    } = req.body;
    const requestUserId = req.body.userId; // userId của user đang thực hiện request

    // Validate required fields
    if (!name || !email || !tutorId || !department || !expertise || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra username đã tồn tại chưa
    if (demoAccounts.find(acc => acc.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Tạo tutor mới
    const newTutorId = `t${Date.now()}`;
    const newTutor: Tutor = {
      id: newTutorId,
      name,
      email,
      role: "tutor",
      tutorId,
      department,
      expertise: Array.isArray(expertise) ? expertise : [expertise],
      rating: rating || 0,
      totalSessions: totalSessions || 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };

    // Tạo account mới
    demoAccounts.push({
      username,
      password,
      role: "tutor",
      userId: newTutorId,
      name,
      type: "Tutor",
    });

    mockTutors.push(newTutor);
    res.status(201).json(newTutor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/tutors/:id - Cập nhật thông tin gia sư
export const updateTutor = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, expertise, department, rating, totalSessions } =
      req.body;

    const tutorIndex = mockTutors.findIndex((t) => t.id === id);

    if (tutorIndex === -1) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Cập nhật các field được phép
    const updatedTutor: Tutor = {
      ...mockTutors[tutorIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(expertise && {
        expertise: Array.isArray(expertise) ? expertise : [expertise],
      }),
      ...(department && { department }),
      ...(rating !== undefined && { rating: parseFloat(rating) }),
      ...(totalSessions !== undefined && {
        totalSessions: parseInt(totalSessions),
      }),
    };

    mockTutors[tutorIndex] = updatedTutor;
    res.status(200).json(updatedTutor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tutors/:id - Xóa gia sư và tài khoản
export const deleteTutor = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestUserId = req.body.userId; // userId của user đang thực hiện request

    const tutorIndex = mockTutors.findIndex((t) => t.id === id);

    if (tutorIndex === -1) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Xóa account liên quan
    const accountIndex = demoAccounts.findIndex(acc => acc.userId === id);
    if (accountIndex !== -1) {
      demoAccounts.splice(accountIndex, 1);
    }

    // Xóa tutor
    mockTutors.splice(tutorIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
