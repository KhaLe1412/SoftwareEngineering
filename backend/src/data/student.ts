import { Student } from "../types/type";

// Dữ liệu Mock cho Student
export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Nguyen Van An",
    email: "an.nguyen@hcmut.edu.vn",
    role: "student",
    studentId: "2021001",
    department: "Computer Science",
    year: 3,
    supportNeeds: ["Data Structures", "Algorithms", "Database Systems"],
    gpa: 3.5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
  },
  {
    id: "s2",
    name: "Tran Thi Binh",
    email: "binh.tran@hcmut.edu.vn",
    role: "student",
    studentId: "2021002",
    department: "Electrical Engineering",
    year: 2,
    supportNeeds: ["Circuit Analysis", "Digital Electronics"],
    gpa: 3.8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Binh",
  },
];
