import { Request, Response } from "express";
import { mockStudents } from "../data/student.js";
import { mockTutors } from "../data/tutor.js";
import { demoAccounts } from "../data/account.js";
import { Student, Tutor } from "../types/type.js";

// GET /api/students - Lấy danh sách sinh viên
export const getStudentInfo = (req: Request, res: Response) => {
  try {
    const { department, year, supportNeeds } = req.query;

    let students = [...mockStudents];

    if (department) {
      students = students.filter((s) => s.department === department);
    }

    if (year) {
      const yearNum = parseInt(year as string);
      students = students.filter((s) => s.year === yearNum);
    }

    if (supportNeeds && typeof supportNeeds === "string") {
      students = students.filter((s) =>
        s.supportNeeds.some((need) =>
          need.toLowerCase().includes(supportNeeds.toLowerCase())
        )
      );
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/students/:id - Cập nhật thông tin sinh viên
export const updateStudentInfo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, supportNeeds, department, year, gpa } = req.body;

    const studentIndex = mockStudents.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedStudent: Student = {
      ...mockStudents[studentIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(supportNeeds && {
        supportNeeds: Array.isArray(supportNeeds)
          ? supportNeeds
          : [supportNeeds],
      }),
      ...(department && { department }),
      ...(year && { year: parseInt(year) }),
      ...(gpa !== undefined && { gpa: parseFloat(gpa) }),
    };

    mockStudents[studentIndex] = updatedStudent;
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/students - Tạo sinh viên mới và tài khoản
export const createStudentInfo = (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      studentId,
      department,
      year,
      supportNeeds,
      gpa,
      username,
      password,
    } = req.body;
    const requestUserId = req.body.userId; 

    if (
      !name ||
      !email ||
      !studentId ||
      !department ||
      !year ||
      !username ||
      !password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (demoAccounts.find((acc) => acc.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newStudentId = `s${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name,
      email,
      role: "student",
      studentId,
      department,
      year: parseInt(year),
      supportNeeds: supportNeeds || [],
      gpa: gpa || 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };

    demoAccounts.push({
      username,
      password,
      role: "student",
      userId: newStudentId,
      name,
      type: "Student",
    });

    mockStudents.push(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/students/:id - Xóa sinh viên và tài khoản
export const deleteStudentInfo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestUserId = req.body.userId;

    const studentIndex = mockStudents.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    const accountIndex = demoAccounts.findIndex((acc) => acc.userId === id);
    if (accountIndex !== -1) {
      demoAccounts.splice(accountIndex, 1);
    }

    mockStudents.splice(studentIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tutors - Lấy danh sách gia sư
export const getTutorInfo = (req: Request, res: Response) => {
  try {
    const { department, expertise, subject } = req.query;

    let tutors = [...mockTutors];

    if (department) {
      tutors = tutors.filter((t) => t.department === department);
    }

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

// PATCH /api/tutors/:id - Cập nhật thông tin gia sư
export const updateTutorInfo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, expertise, department, rating, totalSessions } =
      req.body;

    const tutorIndex = mockTutors.findIndex((t) => t.id === id);

    if (tutorIndex === -1) {
      return res.status(404).json({ message: "Tutor not found" });
    }

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

// POST /api/tutors - Tạo gia sư mới và tài khoản
export const createTutorInfo = (req: Request, res: Response) => {
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
    const requestUserId = req.body.userId;
    // Validate required fields
    if (
      !name ||
      !email ||
      !tutorId ||
      !department ||
      !expertise ||
      !username ||
      !password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (demoAccounts.find((acc) => acc.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

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

// DELETE /api/tutors/:id - Xóa gia sư và tài khoản
export const deleteTutorInfo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestUserId = req.body.userId;

    const tutorIndex = mockTutors.findIndex((t) => t.id === id);

    if (tutorIndex === -1) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const accountIndex = demoAccounts.findIndex((acc) => acc.userId === id);
    if (accountIndex !== -1) {
      demoAccounts.splice(accountIndex, 1);
    }

    mockTutors.splice(tutorIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
