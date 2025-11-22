import { Request, Response } from 'express';
import { mockStudents } from '../data/student.js';
import { demoAccounts } from '../data/account.js';
import { Student } from '../types/type.js';

// GET /api/students - Lấy danh sách sinh viên
export const getAllStudents = (req: Request, res: Response) => {
  try {
    const { department, year, supportNeeds } = req.query;
    
    let students = [...mockStudents];

    // Filter theo department
    if (department) {
      students = students.filter(s => s.department === department);
    }

    // Filter theo year
    if (year) {
      const yearNum = parseInt(year as string);
      students = students.filter(s => s.year === yearNum);
    }

    // Filter theo supportNeeds
    if (supportNeeds && typeof supportNeeds === 'string') {
      students = students.filter(s => 
        s.supportNeeds.some(need => need.toLowerCase().includes(supportNeeds.toLowerCase()))
      );
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/students/:id - Lấy sinh viên theo ID
export const getStudentById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = mockStudents.find(s => s.id === id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/students - Tạo sinh viên mới và tài khoản
export const createStudent = (req: Request, res: Response) => {
  try {
    const { name, email, studentId, department, year, supportNeeds, gpa, username, password } = req.body;
    const requestUserId = req.body.userId; // userId của user đang thực hiện request

    // Validate required fields
    if (!name || !email || !studentId || !department || !year || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Kiểm tra username đã tồn tại chưa
    if (demoAccounts.find(acc => acc.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Tạo student mới
    const newStudentId = `s${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name,
      email,
      role: 'student',
      studentId,
      department,
      year: parseInt(year),
      supportNeeds: supportNeeds || [],
      gpa: gpa || 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };

    // Tạo account mới
    demoAccounts.push({
      username,
      password,
      role: 'student',
      userId: newStudentId,
      name,
      type: 'Student'
    });

    mockStudents.push(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/students/:id - Cập nhật thông tin sinh viên
export const updateStudent = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, supportNeeds, department, year, gpa } = req.body;

    const studentIndex = mockStudents.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Cập nhật các field được phép
    const updatedStudent: Student = {
      ...mockStudents[studentIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(supportNeeds && { supportNeeds }),
      ...(department && { department }),
      ...(year && { year: parseInt(year) }),
      ...(gpa !== undefined && { gpa: parseFloat(gpa) })
    };

    mockStudents[studentIndex] = updatedStudent;
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/students/:id - Xóa sinh viên và tài khoản
export const deleteStudent = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestUserId = req.body.userId; // userId của user đang thực hiện request

    const studentIndex = mockStudents.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Xóa account liên quan
    const accountIndex = demoAccounts.findIndex(acc => acc.userId === id);
    if (accountIndex !== -1) {
      demoAccounts.splice(accountIndex, 1);
    }

    // Xóa student
    mockStudents.splice(studentIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};