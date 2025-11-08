import { SessionRequest } from "../types/type.js";

export const mockSessionRequests: SessionRequest[] = [
  {
    id: "sr1",
    studentId: "s1",
    tutorId: "t1",
    subject: "Graph Algorithms",
    preferredDate: "2025-11-05",
    preferredTime: "14:00",
    type: "online",
    message: "Need help with Dijkstra's algorithm and BFS/DFS",
    status: "pending",
  },
  {
    id: "sr2",
    studentId: "s2",
    tutorId: "t2",
    subject: "Signal Processing",
    preferredDate: "2025-11-03",
    preferredTime: "10:00",
    type: "in-person",
    message: "Want to review Fourier transforms",
    status: "pending",
  },
];
