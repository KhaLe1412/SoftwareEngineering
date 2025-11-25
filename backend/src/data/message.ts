import { Message } from "../types/type.js";

export const mockMessages: Message[] = [
  // {
  //   id: 'msg1',
  //   senderId: 's1',
  //   receiverId: 't1',
  //   content: 'Hi Dr. Le, could we schedule an extra session for next week? I need help with graph algorithms.',
  //   timestamp: '2025-10-28T10:30:00Z',
  //   read: false,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg2',
  //   senderId: 't1',
  //   receiverId: 's1',
  //   content: 'Hello An! Of course, I have availability on Wednesday at 14:00. Would that work for you?',
  //   timestamp: '2025-10-28T11:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg3',
  //   senderId: 's2',
  //   receiverId: 't2',
  //   content: 'Thank you for the last session! The explanations were very clear.',
  //   timestamp: '2025-10-27T16:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg4',
  //   senderId: 's1',
  //   receiverId: 't1',
  //   content: 'Session \"Data Structures\" has been rescheduled from 2025-10-25 14:00 to 2025-10-27 15:00. Reason: Student has conflicting exam.',
  //   timestamp: '2025-10-24T09:00:00Z',
  //   read: true,
  //   type: 'reschedule-notification',
  //   relatedSessionId: 'ses1'
  // },
  // {
  //   id: 'msg5',
  //   senderId: 's1',
  //   receiverId: 't1',
  //   content: 'Hi Dr. Le, could I get access to the recording and summary from our last Database Systems session?',
  //   timestamp: '2025-10-29T14:00:00Z',
  //   read: false,
  //   type: 'material-request',
  //   relatedSessionId: 'ses4'
  // },
  // {
  //   id: 'msg6',
  //   senderId: 's3',
  //   receiverId: 't4',
  //   content: 'Dr. Khanh, I have some questions about React hooks. Could we discuss this in our next session?',
  //   timestamp: '2025-11-10T09:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg7',
  //   senderId: 't4',
  //   receiverId: 's3',
  //   content: 'Sure thing! Prepare your questions and we\'ll go through them step by step.',
  //   timestamp: '2025-11-10T09:30:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg8',
  //   senderId: 's4',
  //   receiverId: 't3',
  //   content: 'Ms. Hoa, could you recommend some additional practice problems for Linear Algebra?',
  //   timestamp: '2025-11-11T14:00:00Z',
  //   read: false,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg9',
  //   senderId: 's5',
  //   receiverId: 't2',
  //   content: 'Dr. Dung, I\'m having trouble understanding the Laplace transform. Can we cover this in detail?',
  //   timestamp: '2025-11-12T08:30:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg10',
  //   senderId: 't2',
  //   receiverId: 's5',
  //   content: 'Absolutely! The Laplace transform is fundamental for signal processing. Let\'s schedule a dedicated session.',
  //   timestamp: '2025-11-12T09:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg11',
  //   senderId: 's6',
  //   receiverId: 't4',
  //   content: 'I really enjoyed the last programming session! Looking forward to the next one.',
  //   timestamp: '2025-11-13T16:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg12',
  //   senderId: 's7',
  //   receiverId: 't7',
  //   content: 'Ms. Ngan, could you explain the free body diagram concept again? I want to make sure I understand it fully.',
  //   timestamp: '2025-11-08T10:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg13',
  //   senderId: 't7',
  //   receiverId: 's7',
  //   content: 'Of course! Free body diagrams are crucial. I\'ll prepare some extra examples for our next session.',
  //   timestamp: '2025-11-08T10:30:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg14',
  //   senderId: 's8',
  //   receiverId: 't5',
  //   content: 'Prof. Linh, can I request access to your probability lecture slides?',
  //   timestamp: '2025-11-09T15:00:00Z',
  //   read: false,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg15',
  //   senderId: 's9',
  //   receiverId: 't1',
  //   content: 'Dr. Le, I need help preparing for my algorithms midterm. Are you available this weekend?',
  //   timestamp: '2025-11-07T12:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg16',
  //   senderId: 't1',
  //   receiverId: 's9',
  //   content: 'I have some time on Saturday afternoon. Let\'s set up a session to review the key concepts.',
  //   timestamp: '2025-11-07T13:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg17',
  //   senderId: 's10',
  //   receiverId: 't6',
  //   content: 'Dr. Minh, the control systems lab was amazing! Thanks for the hands-on experience.',
  //   timestamp: '2025-11-06T17:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg18',
  //   senderId: 's3',
  //   receiverId: 't1',
  //   content: 'Hi Dr. Le, I\'m interested in joining your Programming Workshop. Is there still space?',
  //   timestamp: '2025-11-14T10:00:00Z',
  //   read: false,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg19',
  //   senderId: 't3',
  //   receiverId: 's4',
  //   content: 'Great work on the calculus assignment! Your understanding of integration is improving.',
  //   timestamp: '2025-11-05T14:00:00Z',
  //   read: true,
  //   type: 'regular'
  // },
  // {
  //   id: 'msg20',
  //   senderId: 's2',
  //   receiverId: 't2',
  //   content: 'Could I request access to the recording from our Digital Electronics session?',
  //   timestamp: '2025-10-19T10:00:00Z',
  //   read: true,
  //   type: 'material-request',
  //   relatedSessionId: 'ses5'
  // }
];