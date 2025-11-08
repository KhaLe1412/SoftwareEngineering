import { RescheduleRequest } from "../types/type.js";

export const mockRescheduleRequests: RescheduleRequest[] = [
  {
    id: "rr1",
    sessionId: "ses1",
    requesterId: "s1",
    requesterRole: "student",
    newDate: "2025-10-27",
    newStartTime: "15:00",
    newEndTime: "16:30",
    reason: "I have a conflicting exam on the original date.",
    status: "pending",
    createdAt: "2025-10-24T08:00:00Z",
  },
  {
    id: "rr2",
    sessionId: "ses3",
    requesterId: "s2",
    requesterRole: "student",
    newDate: "2025-10-28",
    newStartTime: "10:00",
    newEndTime: "11:30",
    reason: "Would like to move the session to next week.",
    status: "pending",
    createdAt: "2025-10-25T10:00:00Z",
  },
];
