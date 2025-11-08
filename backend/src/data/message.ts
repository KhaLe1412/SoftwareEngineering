import { Message } from "../types/type";

export const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "s1",
    receiverId: "t1",
    content:
      "Hi Dr. Le, could we schedule an extra session for next week? I need help with graph algorithms.",
    timestamp: "2025-10-28T10:30:00Z",
    read: false,
    type: "regular",
  },
  {
    id: "msg2",
    senderId: "t1",
    receiverId: "s1",
    content:
      "Hello An! Of course, I have availability on Wednesday at 14:00. Would that work for you?",
    timestamp: "2025-10-28T11:00:00Z",
    read: true,
    type: "regular",
  },
  {
    id: "msg3",
    senderId: "s2",
    receiverId: "t2",
    content:
      "Thank you for the last session! The explanations were very clear.",
    timestamp: "2025-10-27T16:00:00Z",
    read: true,
    type: "regular",
  },
  {
    id: "msg4",
    senderId: "s1",
    receiverId: "t1",
    content:
      'Session "Data Structures" has been rescheduled from 2025-10-25 14:00 to 2025-10-27 15:00. Reason: Student has conflicting exam.',
    timestamp: "2025-10-24T09:00:00Z",
    read: true,
    type: "reschedule-notification",
    relatedSessionId: "ses1",
  },
  {
    id: "msg5",
    senderId: "s1",
    receiverId: "t1",
    content:
      "Hi Dr. Le, could I get access to the recording and summary from our last Database Systems session?",
    timestamp: "2025-10-29T14:00:00Z",
    read: false,
    type: "material-request",
    relatedSessionId: "ses4",
  },
];
