import { Session } from "../../types/type";

export const mockOpenSessions: Session[] = [
  {
    id: "open1",
    tutorId: "t1",
    subject: "Data Structures Workshop",
    date: "2025-11-01",
    startTime: "14:00",
    endTime: "16:00",
    type: "online",
    status: "open",
    meetingLink: "https://meet.google.com/workshop-ds",
    maxStudents: 10,
    enrolledStudents: [],
    notes: "Group session covering advanced data structures",
  },
  {
    id: "open2",
    tutorId: "t3",
    subject: "Calculus Problem Solving",
    date: "2025-10-30",
    startTime: "10:00",
    endTime: "12:00",
    type: "in-person",
    status: "open",
    location: "Building H3, Room 201",
    maxStudents: 15,
    enrolledStudents: [],
    notes: "Open problem-solving session for calculus questions",
  },
];
