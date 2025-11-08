import { UserRole } from "../types/type.js";

export const demoAccounts = [
  // Students
  { username: 'student1', password: 'pass123', role: 'student' as UserRole, userId: 's1', name: 'Nguyen Van An', type: 'Student' },
  { username: 'student2', password: 'pass123', role: 'student' as UserRole, userId: 's2', name: 'Tran Thi Binh', type: 'Student' },
  
  // Tutors
  { username: 'tutor1', password: 'pass123', role: 'tutor' as UserRole, userId: 't1', name: 'Dr. Le Minh Chau', type: 'Tutor' },
  { username: 'tutor2', password: 'pass123', role: 'tutor' as UserRole, userId: 't2', name: 'Dr. Pham Hoang Dung', type: 'Tutor' },
  
  // Admin & Affairs
  { username: 'admin', password: 'admin123', role: 'admin' as UserRole, userId: 'admin1', name: 'Nguyen Van Admin', type: 'Administrator' },
  { username: 'academic', password: 'pass123', role: 'academic-affairs' as UserRole, userId: 'aa1', name: 'Academic Affairs', type: 'Academic Affairs' },
  { username: 'student-affairs', password: 'pass123', role: 'student-affairs' as UserRole, userId: 'sa1', name: 'Student Affairs', type: 'Student Affairs' },
];