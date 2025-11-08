import { Tutor } from "../types/type";

// Dữ liệu hardcode cho các gia sư
export const mockTutors: Tutor[] = [
  {
    id: "t1",
    name: "Dr. Le Minh Chau",
    email: "chau.le@hcmut.edu.vn",
    role: "tutor",
    tutorId: "T001",
    department: "Computer Science",
    expertise: [
      "Data Structures",
      "Algorithms",
      "Programming",
      "Database Systems",
    ],
    rating: 4.8,
    totalSessions: 156,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chau",
    availability: [
      {
        id: "a1",
        dayOfWeek: 1,
        startTime: "14:00",
        endTime: "17:00",
        type: "both",
      },
      {
        id: "a2",
        dayOfWeek: 3,
        startTime: "14:00",
        endTime: "17:00",
        type: "both",
      },
    ],
  },
  {
    id: "t2",
    name: "Dr. Pham Hoang Dung",
    email: "dung.pham@hcmut.edu.vn",
    role: "tutor",
    tutorId: "T002",
    department: "Electrical Engineering",
    expertise: ["Circuit Analysis", "Digital Electronics", "Signal Processing"],
    rating: 4.9,
    totalSessions: 203,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dung",
    availability: [
      {
        id: "a3",
        dayOfWeek: 2,
        startTime: "09:00",
        endTime: "12:00",
        type: "in-person",
      },
      {
        id: "a4",
        dayOfWeek: 4,
        startTime: "13:00",
        endTime: "16:00",
        type: "online",
      },
    ],
  },
  {
    id: "t3",
    name: "Ms. Vo Thi Hoa",
    email: "hoa.vo@hcmut.edu.vn",
    role: "tutor",
    tutorId: "T003",
    department: "Mathematics",
    expertise: ["Calculus", "Linear Algebra", "Discrete Mathematics"],
    rating: 4.7,
    totalSessions: 89,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa",
    availability: [
      {
        id: "a5",
        dayOfWeek: 1,
        startTime: "10:00",
        endTime: "13:00",
        type: "both",
      },
      {
        id: "a6",
        dayOfWeek: 5,
        startTime: "14:00",
        endTime: "17:00",
        type: "online",
      },
    ],
  },
];
