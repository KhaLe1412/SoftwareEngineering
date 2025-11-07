import { Student, Tutor, Admin, Session, LibraryResource, MatchRequest, Message, SessionRequest, RescheduleRequest, MaterialAccessRequest, StudentEvaluation } from '../types';

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Nguyen Van An',
    email: 'an.nguyen@hcmut.edu.vn',
    role: 'student',
    studentId: '2021001',
    department: 'Computer Science',
    year: 3,
    supportNeeds: ['Data Structures', 'Algorithms', 'Database Systems'],
    gpa: 3.5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An'
  },
  {
    id: 's2',
    name: 'Tran Thi Binh',
    email: 'binh.tran@hcmut.edu.vn',
    role: 'student',
    studentId: '2021002',
    department: 'Electrical Engineering',
    year: 2,
    supportNeeds: ['Circuit Analysis', 'Digital Electronics'],
    gpa: 3.8,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh'
  }
];

// Demo Admin Account
export const mockAdmins: Admin[] = [
  {
    id: 'admin1',
    name: 'Nguyen Van Admin',
    email: 'admin@hcmut.edu.vn',
    role: 'admin',
    adminId: 'ADM001',
    department: 'Administration',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  }
];

export const mockTutors: Tutor[] = [
  {
    id: 't1',
    name: 'Dr. Le Minh Chau',
    email: 'chau.le@hcmut.edu.vn',
    role: 'tutor',
    tutorId: 'T001',
    department: 'Computer Science',
    expertise: ['Data Structures', 'Algorithms', 'Programming', 'Database Systems'],
    rating: 4.8,
    totalSessions: 156,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chau',
    availability: [
      {
        id: 'a1',
        dayOfWeek: 1,
        startTime: '14:00',
        endTime: '17:00',
        type: 'both'
      },
      {
        id: 'a2',
        dayOfWeek: 3,
        startTime: '14:00',
        endTime: '17:00',
        type: 'both'
      }
    ]
  },
  {
    id: 't2',
    name: 'Dr. Pham Hoang Dung',
    email: 'dung.pham@hcmut.edu.vn',
    role: 'tutor',
    tutorId: 'T002',
    department: 'Electrical Engineering',
    expertise: ['Circuit Analysis', 'Digital Electronics', 'Signal Processing'],
    rating: 4.9,
    totalSessions: 203,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung',
    availability: [
      {
        id: 'a3',
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '12:00',
        type: 'in-person'
      },
      {
        id: 'a4',
        dayOfWeek: 4,
        startTime: '13:00',
        endTime: '16:00',
        type: 'online'
      }
    ]
  },
  {
    id: 't3',
    name: 'Ms. Vo Thi Hoa',
    email: 'hoa.vo@hcmut.edu.vn',
    role: 'tutor',
    tutorId: 'T003',
    department: 'Mathematics',
    expertise: ['Calculus', 'Linear Algebra', 'Discrete Mathematics'],
    rating: 4.7,
    totalSessions: 89,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa',
    availability: [
      {
        id: 'a5',
        dayOfWeek: 1,
        startTime: '10:00',
        endTime: '13:00',
        type: 'both'
      },
      {
        id: 'a6',
        dayOfWeek: 5,
        startTime: '14:00',
        endTime: '17:00',
        type: 'online'
      }
    ]
  }
];

export const mockSessions: Session[] = [
  {
    id: 'ses1',
    tutorId: 't1',
    studentId: 's1',
    subject: 'Data Structures',
    date: '2025-10-25',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Review tree traversal algorithms'
  },
  {
    id: 'ses2',
    tutorId: 't1',
    studentId: 's1',
    subject: 'Algorithms',
    date: '2025-10-20',
    startTime: '14:00',
    endTime: '15:30',
    type: 'in-person',
    status: 'completed',
    location: 'Building H6, Room 501',
    summary: 'Covered dynamic programming concepts including memoization and tabulation. Student demonstrated good understanding of the basic principles.',
    recordingUrl: 'https://example.com/recordings/session-ses2.mp4',
    feedback: {
      id: 'fb1',
      sessionId: 'ses2',
      studentRating: 5,
      studentComment: 'Very helpful session! Understood dynamic programming much better.',
      tutorProgress: 'Student shows good improvement in problem-solving approach',
      tutorNotes: 'Recommend more practice on optimization problems',
      submittedAt: '2025-10-20T16:00:00Z'
    }
  },
  {
    id: 'ses3',
    tutorId: 't2',
    studentId: 's2',
    subject: 'Circuit Analysis',
    date: '2025-10-26',
    startTime: '09:00',
    endTime: '10:30',
    type: 'in-person',
    status: 'scheduled',
    location: 'Building H2, Lab 203'
  },
  {
    id: 'ses4',
    tutorId: 't1',
    studentId: 's1',
    subject: 'Database Systems',
    date: '2025-10-15',
    startTime: '15:00',
    endTime: '16:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/db-session',
    notes: 'Covered SQL joins and normalization',
    summary: 'Reviewed SQL JOIN operations (INNER, LEFT, RIGHT, FULL) and database normalization up to 3NF. Student practiced writing complex queries.',
    recordingUrl: 'https://example.com/recordings/session-ses4.mp4'
  },
  {
    id: 'ses5',
    tutorId: 't2',
    studentId: 's2',
    subject: 'Digital Electronics',
    date: '2025-10-18',
    startTime: '10:00',
    endTime: '11:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/digital-elec',
    summary: 'Covered boolean algebra and logic gates. Student completed practical exercises on Karnaugh maps.',
    recordingUrl: 'https://example.com/recordings/session-ses5.mp4'
  }
];

export const mockLibraryResources: LibraryResource[] = [
  {
    id: 'lib1',
    title: 'Introduction to Algorithms (CLRS)',
    type: 'textbook',
    subject: 'Algorithms',
    author: 'Cormen, Leiserson, Rivest, Stein',
    url: '#'
  },
  {
    id: 'lib2',
    title: 'Database System Concepts',
    type: 'textbook',
    subject: 'Database Systems',
    author: 'Silberschatz, Korth, Sudarshan',
    url: '#'
  },
  {
    id: 'lib3',
    title: 'Circuit Analysis: Theory and Practice',
    type: 'textbook',
    subject: 'Circuit Analysis',
    author: 'Robbins, Miller',
    url: '#'
  },
  {
    id: 'lib4',
    title: 'Dynamic Programming Lecture Notes',
    type: 'document',
    subject: 'Algorithms',
    author: 'Dr. Le Minh Chau',
    url: '#'
  },
  {
    id: 'lib5',
    title: 'Data Structures Video Tutorials',
    type: 'video',
    subject: 'Data Structures',
    author: 'HCMUT CS Department',
    url: '#'
  }
];

export const mockMatchRequests: MatchRequest[] = [
  {
    id: 'mr1',
    studentId: 's1',
    subjects: ['Data Structures', 'Algorithms'],
    preferredType: 'both',
    preferredTimes: ['Monday 14:00-17:00', 'Wednesday 14:00-17:00'],
    status: 'matched',
    matchedTutorId: 't1'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 's1',
    receiverId: 't1',
    content: 'Hi Dr. Le, could we schedule an extra session for next week? I need help with graph algorithms.',
    timestamp: '2025-10-28T10:30:00Z',
    read: false,
    type: 'regular'
  },
  {
    id: 'msg2',
    senderId: 't1',
    receiverId: 's1',
    content: 'Hello An! Of course, I have availability on Wednesday at 14:00. Would that work for you?',
    timestamp: '2025-10-28T11:00:00Z',
    read: true,
    type: 'regular'
  },
  {
    id: 'msg3',
    senderId: 's2',
    receiverId: 't2',
    content: 'Thank you for the last session! The explanations were very clear.',
    timestamp: '2025-10-27T16:00:00Z',
    read: true,
    type: 'regular'
  },
  {
    id: 'msg4',
    senderId: 's1',
    receiverId: 't1',
    content: 'Session "Data Structures" has been rescheduled from 2025-10-25 14:00 to 2025-10-27 15:00. Reason: Student has conflicting exam.',
    timestamp: '2025-10-24T09:00:00Z',
    read: true,
    type: 'reschedule-notification',
    relatedSessionId: 'ses1'
  },
  {
    id: 'msg5',
    senderId: 's1',
    receiverId: 't1',
    content: 'Hi Dr. Le, could I get access to the recording and summary from our last Database Systems session?',
    timestamp: '2025-10-29T14:00:00Z',
    read: false,
    type: 'material-request',
    relatedSessionId: 'ses4'
  }
];

export const mockSessionRequests: SessionRequest[] = [
  {
    id: 'sr1',
    studentId: 's1',
    tutorId: 't1',
    subject: 'Graph Algorithms',
    preferredDate: '2025-11-05',
    preferredTime: '14:00',
    type: 'online',
    message: 'Need help with Dijkstra\'s algorithm and BFS/DFS',
    status: 'pending'
  },
  {
    id: 'sr2',
    studentId: 's2',
    tutorId: 't2',
    subject: 'Signal Processing',
    preferredDate: '2025-11-03',
    preferredTime: '10:00',
    type: 'in-person',
    message: 'Want to review Fourier transforms',
    status: 'pending'
  }
];

// Add open sessions
export const mockOpenSessions: Session[] = [
  {
    id: 'open1',
    tutorId: 't1',
    subject: 'Data Structures Workshop',
    date: '2025-11-01',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/workshop-ds',
    maxStudents: 10,
    enrolledStudents: ['s1'],
    notes: 'Group session covering advanced data structures'
  },
  {
    id: 'open2',
    tutorId: 't3',
    subject: 'Calculus Problem Solving',
    date: '2025-10-30',
    startTime: '10:00',
    endTime: '12:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H3, Room 201',
    maxStudents: 15,
    enrolledStudents: [],
    notes: 'Open problem-solving session for calculus questions'
  }
];

export const mockRescheduleRequests: RescheduleRequest[] = [
  {
    id: 'rr1',
    sessionId: 'ses1',
    requesterId: 's1',
    requesterRole: 'student',
    newDate: '2025-10-27',
    newStartTime: '15:00',
    newEndTime: '16:30',
    reason: 'I have a conflicting exam on the original date.',
    status: 'pending',
    createdAt: '2025-10-24T08:00:00Z'
  },
  {
    id: 'rr2',
    sessionId: 'ses3',
    requesterId: 's2',
    requesterRole: 'student',
    newDate: '2025-10-28',
    newStartTime: '10:00',
    newEndTime: '11:30',
    reason: 'Would like to move the session to next week.',
    status: 'pending',
    createdAt: '2025-10-25T10:00:00Z'
  }
];

export const mockMaterialAccessRequests: MaterialAccessRequest[] = [
  {
    id: 'mar1',
    sessionId: 'ses2',
    studentId: 's1',
    materialType: 'both',
    status: 'pending',
    createdAt: '2025-10-21T10:00:00Z'
  },
  {
    id: 'mar2',
    sessionId: 'ses4',
    studentId: 's1',
    materialType: 'recording',
    status: 'approved',
    createdAt: '2025-10-16T14:00:00Z'
  },
  {
    id: 'mar3',
    sessionId: 'ses5',
    studentId: 's2',
    materialType: 'summary',
    status: 'pending',
    createdAt: '2025-10-19T09:00:00Z'
  }
];

export const mockStudentEvaluations: StudentEvaluation[] = [
  {
    id: 'eval1',
    studentId: 's1',
    tutorId: 't1',
    sessionId: 'ses2',
    skills: {
      understanding: 4,
      participation: 5,
      preparation: 4
    },
    attitude: 5,
    testResults: {
      score: 85,
      maxScore: 100,
      notes: 'Strong performance on dynamic programming problems'
    },
    overallProgress: 'Excellent progress. Student has shown significant improvement in algorithmic thinking and problem-solving skills.',
    recommendations: 'Continue practicing more advanced algorithms. Ready to move on to graph algorithms.',
    createdAt: '2025-10-20T16:30:00Z'
  },
  {
    id: 'eval2',
    studentId: 's1',
    tutorId: 't1',
    sessionId: 'ses4',
    skills: {
      understanding: 4,
      participation: 4,
      preparation: 5
    },
    attitude: 5,
    overallProgress: 'Good understanding of database normalization and SQL joins. Student came well-prepared with questions.',
    recommendations: 'Practice more complex queries involving multiple joins and subqueries.',
    createdAt: '2025-10-15T17:00:00Z'
  },
  {
    id: 'eval3',
    studentId: 's2',
    tutorId: 't2',
    sessionId: 'ses5',
    skills: {
      understanding: 5,
      participation: 4,
      preparation: 4
    },
    attitude: 4,
    testResults: {
      score: 92,
      maxScore: 100,
      notes: 'Excellent understanding of boolean algebra'
    },
    overallProgress: 'Outstanding performance in Digital Electronics. Student grasps concepts quickly.',
    recommendations: 'Ready for advanced topics in sequential circuits.',
    createdAt: '2025-10-18T12:00:00Z'
  }
];
