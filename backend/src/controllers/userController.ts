// import { Request, Response } from 'express';
// import { mockStudents } from '../data/student.js';
// import { mockTutors } from '../data/tutor.js';
// import { mockAdmins } from '../data/admin.js';

// // GET /api/users/:id - Lấy thông tin user theo ID
// export const getUserById = (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     // Tìm trong students
//     const student = mockStudents.find(s => s.id === id);
//     if (student) {
//       return res.status(200).json(student);
//     }

//     // Tìm trong tutors
//     const tutor = mockTutors.find(t => t.id === id);
//     if (tutor) {
//       return res.status(200).json(tutor);
//     }

//     // Tìm trong admins
//     const admin = mockAdmins.find(a => a.id === id);
//     if (admin) {
//       return res.status(200).json(admin);
//     }

//     // Không tìm thấy
//     res.status(404).json({ message: 'User not found' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET /api/users/students - Lấy danh sách tất cả students
// export const getAllStudents = (req: Request, res: Response) => {
//   try {
//     res.status(200).json(mockStudents);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET /api/users/tutors - Lấy danh sách tất cả tutors
// export const getAllTutors = (req: Request, res: Response) => {
//   try {
//     res.status(200).json(mockTutors);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET /api/users/admins - Lấy danh sách tất cả admins
// export const getAllAdmins = (req: Request, res: Response) => {
//   try {
//     res.status(200).json(mockAdmins);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

