import { Session } from "../types/type.js";

export const mockSessions: Session[] = [
  {
    id: 'ses1',
    tutorId: 't1',
    subject: 'Data Structures',
    date: '2025-11-17',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Review tree traversal algorithms',
    maxStudents: 20,
    enrolledStudents: ['s1', 's3']
  },
  {
    id: 'ses2',
    tutorId: 't1',
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
    },
    maxStudents: 15,
    enrolledStudents: ['s4', 's5'],
    reviews: [
      {
        studentId: 's4',
        rating: 5,
        comment: 'Very helpful session! Understood dynamic programming much better.',
        submittedAt: '2025-10-20T16:00:00Z'
      },
      {
        studentId: 's5',
        rating: 4,
        comment: 'Good session, but would like more practice problems.',
        submittedAt: '2025-10-20T16:30:00Z'
      }
    ]
  },
  {
    id: 'ses3',
    tutorId: 't2',
    // FIX: Xóa 'studentId: s2'
    subject: 'Circuit Analysis',
    date: '2025-11-15',
    startTime: '09:00',
    endTime: '10:30',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 203',
    notes: 'Kirchhoff\'s laws and mesh analysis',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 13,
    enrolledStudents: ['s2']
  },
  {
    id: 'ses4',
    tutorId: 't1',
    // FIX: Xóa 'studentId: s1'
    subject: 'Database Systems',
    date: '2025-10-15',
    startTime: '15:00',
    endTime: '16:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/db-session',
    notes: 'Covered SQL joins and normalization',
    summary: 'Reviewed SQL JOIN operations (INNER, LEFT, RIGHT, FULL) and database normalization up to 3NF. Student practiced writing complex queries.',
    recordingUrl: 'https://example.com/recordings/session-ses4.mp4',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 12,
    enrolledStudents: ['s1'],
    reviews: [
      // {
      //   studentId: 's1',
      //   rating: 5,
      //   comment: 'Excellent session! The SQL join examples were very clear and practical.',
      //   submittedAt: '2025-10-15T17:00:00Z'
      // }
    ]
  },
  {
    id: 'ses5',
    tutorId: 't2',
    // FIX: Xóa 'studentId: s2'
    subject: 'Digital Electronics',
    date: '2025-10-18',
    startTime: '10:00',
    endTime: '11:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/digital-elec',
    summary: 'Covered boolean algebra and logic gates. Student completed practical exercises on Karnaugh maps.',
    recordingUrl: 'https://example.com/recordings/session-ses5.mp4',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 11,
    enrolledStudents: ['s2'],
    reviews: [
      {
        studentId: 's2',
        rating: 5,
        comment: 'Great hands-on session! The Karnaugh map exercises really helped me understand.',
        submittedAt: '2025-10-18T12:00:00Z'
      }
    ]
  },
  {
    id: 'ses6',
    tutorId: 't1',
    subject: 'Programming Workshop',
    date: '2025-11-18',
    startTime: '10:00',
    endTime: '12:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/prog-workshop',
    maxStudents: 15,
    enrolledStudents: ['s1'],
    notes: 'Group workshop on advanced programming concepts'
  },
  {
    id: 'ses7',
    tutorId: 't1',
    subject: 'Graph Algorithms',
    date: '2025-11-19',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/graph-algo',
    maxStudents: 10,
    enrolledStudents: [],
    notes: 'Deep dive into graph algorithms and applications'
  },
  // Additional sessions for diverse testing
  {
    id: 'ses8',
    tutorId: 't3',
    // FIX: Xóa 'studentId: s4'
    subject: 'Calculus',
    date: '2025-11-18',
    startTime: '10:00',
    endTime: '11:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/calc-session',
    notes: 'Integration techniques and applications',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s4']
  },
  {
    id: 'ses9',
    tutorId: 't4',
    // FIX: Xóa 'studentId: s3'
    subject: 'Web Development',
    date: '2025-11-20',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/web-dev',
    notes: 'React fundamentals and hooks',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s3']
  },
  {
    id: 'ses10',
    tutorId: 't5',
    // FIX: Xóa 'studentId: s4'
    subject: 'Statistics',
    date: '2025-10-25',
    startTime: '09:00',
    endTime: '10:30',
    type: 'in-person',
    status: 'completed',
    location: 'Building H3, Room 305',
    summary: 'Hypothesis testing and confidence intervals. Student performed well on practice problems.',
    feedback: {
      id: 'fb2',
      sessionId: 'ses10',
      studentRating: 5,
      studentComment: 'Excellent explanations! Now I understand statistical tests better.',
      tutorProgress: 'Student has strong grasp of statistical concepts',
      tutorNotes: 'Ready for regression analysis',
      submittedAt: '2025-10-25T11:00:00Z'
    },
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s4'],
    reviews: [
      {
        studentId: 's4',
        rating: 5,
        comment: 'Excellent explanations! Now I understand statistical tests better.',
        submittedAt: '2025-10-25T11:00:00Z'
      }
    ]
  },
  {
    id: 'ses11',
    tutorId: 't6',
    // FIX: Xóa 'studentId: s5'
    subject: 'Control Systems',
    date: '2025-11-16',
    startTime: '13:00',
    endTime: '14:30',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 105',
    notes: 'Transfer functions and stability analysis',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s5']
  },
  {
    id: 'ses12',
    tutorId: 't2',
    // FIX: Xóa 'studentId: s10'
    subject: 'Microprocessors',
    date: '2025-11-17',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/micro-session',
    notes: '8051 architecture and assembly language',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s10']
  },
  {
    id: 'ses13',
    tutorId: 't7',
    // FIX: Xóa 'studentId: s7'
    subject: 'Engineering Mechanics',
    date: '2025-10-22',
    startTime: '10:00',
    endTime: '11:30',
    type: 'in-person',
    status: 'completed',
    location: 'Building H1, Room 402',
    summary: 'Covered statics and dynamics principles. Student worked through several beam analysis problems.',
    recordingUrl: 'https://example.com/recordings/session-ses13.mp4',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s7'],
    reviews: [
      {
        studentId: 's7',
        rating: 4,
        comment: 'Good session with practical examples. Would appreciate more problem-solving practice.',
        submittedAt: '2025-10-22T12:00:00Z'
      }
    ]
  },
  {
    id: 'ses14',
    tutorId: 't4',
    // FIX: Xóa 'studentId: s6'
    subject: 'Programming',
    date: '2025-11-19',
    startTime: '10:00',
    endTime: '11:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/prog-basics',
    notes: 'Introduction to object-oriented programming',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s6']
  },
  {
    id: 'ses15',
    tutorId: 't3',
    // FIX: Xóa 'studentId: s8'
    subject: 'Linear Algebra',
    date: '2025-10-28',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/linalg',
    summary: 'Matrix operations, eigenvalues and eigenvectors. Strong understanding demonstrated.',
    recordingUrl: 'https://example.com/recordings/session-ses15.mp4',
    feedback: {
      id: 'fb3',
      sessionId: 'ses15',
      studentRating: 4,
      studentComment: 'Good session, would like more practice problems.',
      tutorProgress: 'Steady improvement in linear algebra',
      tutorNotes: 'Assign additional eigenvalue problems',
      submittedAt: '2025-10-28T16:00:00Z'
    },
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s8'],
    reviews: [
      {
        studentId: 's8',
        rating: 4,
        comment: 'Good session, would like more practice problems.',
        submittedAt: '2025-10-28T16:00:00Z'
      }
    ]
  },
  {
    id: 'ses16',
    tutorId: 't1',
    // FIX: Xóa 'studentId: s3'
    subject: 'Data Structures',
    date: '2025-11-18',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/ds-trees',
    notes: 'Binary search trees and AVL trees',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s3']
  },
  {
    id: 'ses17',
    tutorId: 't5',
    // FIX: Xóa 'studentId: s8'
    subject: 'Statistics',
    date: '2025-11-21',
    startTime: '09:00',
    endTime: '10:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/stats-session',
    notes: 'Descriptive statistics and data visualization',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s8']
  },
  {
    id: 'ses18',
    tutorId: 't1',
    // FIX: Xóa 'studentId: s9'
    subject: 'Algorithms',
    date: '2025-10-30',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/algo-intro',
    summary: 'Introduction to sorting algorithms. Covered bubble sort, insertion sort, and merge sort.',
    recordingUrl: 'https://example.com/recordings/session-ses18.mp4',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s9'],
    reviews: [
      {
        studentId: 's9',
        rating: 5,
        comment: 'Very clear explanations of sorting algorithms. The visualizations were extremely helpful!',
        submittedAt: '2025-10-30T16:00:00Z'
      }
    ]
  },
  {
    id: 'ses19',
    tutorId: 't6',
    // FIX: Xóa 'studentId: s10'
    subject: 'Circuit Analysis',
    date: '2025-10-26',
    startTime: '13:00',
    endTime: '14:30',
    type: 'in-person',
    status: 'completed',
    location: 'Building H2, Lab 201',
    summary: 'AC circuit analysis using phasor diagrams. Student showed good understanding.',
    feedback: {
      id: 'fb4',
      sessionId: 'ses19',
      studentRating: 5,
      studentComment: 'Great hands-on session with lab work.',
      tutorProgress: 'Excellent lab skills',
      tutorNotes: 'Ready for power systems',
      submittedAt: '2025-10-26T15:00:00Z'
    },
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s10'],
    reviews: [
      {
        studentId: 's10',
        rating: 5,
        comment: 'Great hands-on session with lab work. Really helped with understanding AC circuits.',
        submittedAt: '2025-10-26T15:00:00Z'
      }
    ]
  },
  {
    id: 'ses20',
    tutorId: 't4',
    // FIX: Xóa 'studentId: s3'
    subject: 'Programming',
    date: '2025-10-24',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/prog-oop',
    summary: 'Object-oriented programming concepts: classes, inheritance, polymorphism.',
    recordingUrl: 'https://example.com/recordings/session-ses20.mp4',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s3'],
    reviews: [
      {
        studentId: 's3',
        rating: 5,
        comment: 'Excellent introduction to OOP! The examples with real code made everything clear.',
        submittedAt: '2025-10-24T16:00:00Z'
      }
    ]
  },
  // Multiple sessions on same day for calendar testing
  {
    id: 'ses21',
    tutorId: 't1',
    // FIX: Xóa 'studentId: s1'
    subject: 'Algorithms',
    date: '2025-11-18',
    startTime: '16:00',
    endTime: '17:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/algo-advanced',
    notes: 'Advanced algorithmic techniques',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s1']
  },
  {
    id: 'ses22',
    tutorId: 't3',
    // FIX: Xóa 'studentId: s4'
    subject: 'Linear Algebra',
    date: '2025-11-20',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/linalg-2',
    notes: 'Vector spaces and transformations',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s4']
  },
  {
    id: 'ses23',
    tutorId: 't2',
    // FIX: Xóa 'studentId: s5'
    subject: 'Signal Processing',
    date: '2025-11-21',
    startTime: '13:00',
    endTime: '14:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/signal-proc',
    notes: 'Digital filters and FFT',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s5']
  },
  {
    id: 'ses24',
    tutorId: 't7',
    // FIX: Xóa 'studentId: s7'
    subject: 'Physics',
    date: '2025-11-22',
    startTime: '10:00',
    endTime: '11:30',
    type: 'in-person',
    status: 'open',
    location: 'Building H1, Room 301',
    notes: 'Thermodynamics fundamentals',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s7']
  },
  {
    id: 'ses25',
    tutorId: 't5',
    // FIX: Xóa 'studentId: s4'
    subject: 'Probability',
    date: '2025-11-23',
    startTime: '09:00',
    endTime: '10:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/prob-session',
    notes: 'Random variables and probability distributions',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s4']
  },
  // Cancelled session
  {
    id: 'ses26',
    tutorId: 't1',
    // FIX: Xóa 'studentId: s1'
    subject: 'Database Systems',
    date: '2025-10-12',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'cancelled',
    meetingLink: 'https://meet.google.com/db-cancelled',
    notes: 'Cancelled due to tutor illness',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s1']
  },
  // More sessions with enrolled students for testing
  {
    id: 'ses27',
    tutorId: 't3',
    // FIX: Xóa 'studentId: s8'
    subject: 'Discrete Mathematics',
    date: '2025-11-25',
    startTime: '10:00',
    endTime: '11:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/discrete-math',
    notes: 'Graph theory and combinatorics',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s8']
  },
  {
    id: 'ses28',
    tutorId: 't4',
    // FIX: Xóa 'studentId: s6'
    subject: 'Web Development',
    date: '2025-11-26',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/web-advanced',
    notes: 'Advanced React patterns and state management',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s6']
  },
  {
    id: 'ses29',
    tutorId: 't5',
    // FIX: Xóa 'studentId: s8'
    subject: 'Probability',
    date: '2025-11-27',
    startTime: '09:00',
    endTime: '10:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/probability',
    notes: 'Conditional probability and Bayes theorem',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s8']
  },
  {
    id: 'ses30',
    tutorId: 't6',
    // FIX: Xóa 'studentId: s10'
    subject: 'Microprocessors',
    date: '2025-11-28',
    startTime: '13:00',
    endTime: '14:30',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 305',
    notes: 'ARM architecture and assembly programming with hands-on exercises',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s10']
  },
  // Additional completed sessions for history
  {
    id: 'ses31',
    tutorId: 't3',
    // FIX: Xóa 'studentId: s4'
    subject: 'Calculus',
    date: '2025-10-29',
    startTime: '10:00',
    endTime: '11:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/calc-limits',
    summary: 'Limits and continuity. Covered epsilon-delta definition and limit theorems.',
    recordingUrl: 'https://example.com/recordings/session-ses31.mp4',
    feedback: {
      id: 'fb5',
      sessionId: 'ses31',
      studentRating: 5,
      studentComment: 'Crystal clear explanations! Finally understood limits.',
      tutorProgress: 'Excellent grasp of fundamental concepts',
      tutorNotes: 'Ready for derivatives',
      submittedAt: '2025-10-29T12:00:00Z'
    },
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s4'],
    reviews: [
      {
        studentId: 's4',
        rating: 5,
        comment: 'Crystal clear explanations! Finally understood limits.',
        submittedAt: '2025-10-29T12:00:00Z'
      }
    ]
  },
  {
    id: 'ses32',
    tutorId: 't4',
    // FIX: Xóa 'studentId: s3'
    subject: 'Software Engineering',
    date: '2025-10-31',
    startTime: '14:00',
    endTime: '15:30',
    type: 'online',
    status: 'completed',
    meetingLink: 'https://meet.google.com/software-eng',
    summary: 'Design patterns: Singleton, Factory, Observer. Practical examples in JavaScript.',
    recordingUrl: 'https://example.com/recordings/session-ses32.mp4',
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s3'],
    reviews: [
      {
        studentId: 's3',
        rating: 5,
        comment: 'Design patterns finally make sense! The JavaScript examples were perfect.',
        submittedAt: '2025-10-31T16:00:00Z'
      }
    ]
  },
  {
    id: 'ses33',
    tutorId: 't2',
    // FIX: Xóa 'studentId: s5'
    subject: 'Circuit Analysis',
    date: '2025-11-01',
    startTime: '09:00',
    endTime: '10:30',
    type: 'in-person',
    status: 'completed',
    location: 'Building H2, Lab 203',
    summary: 'Thevenin and Norton equivalent circuits. Solved several network problems.',
    feedback: {
      id: 'fb6',
      sessionId: 'ses33',
      studentRating: 4,
      studentComment: 'Good session, but need more practice problems.',
      tutorProgress: 'Making steady progress',
      tutorNotes: 'Provide additional practice worksheets',
      submittedAt: '2025-11-01T11:00:00Z'
    },
    // FIX: Thêm maxStudents và enrolledStudents
    maxStudents: 10,
    enrolledStudents: ['s5'],
    reviews: [
      {
        studentId: 's5',
        rating: 4,
        comment: 'Good session, but need more practice problems.',
        submittedAt: '2025-11-01T11:00:00Z'
      }
    ]
  },
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
  },
  // Many more open sessions for comprehensive testing
  {
    id: 'open3',
    tutorId: 't1',
    subject: 'Advanced Algorithms',
    date: '2025-11-24',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/adv-algo',
    maxStudents: 12,
    enrolledStudents: ['s1', 's3', 's9'],
    notes: 'Graph algorithms, dynamic programming, and greedy algorithms'
  },
  {
    id: 'open4',
    tutorId: 't2',
    subject: 'Electronics Lab Session',
    date: '2025-11-25',
    startTime: '09:00',
    endTime: '11:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 204',
    maxStudents: 8,
    enrolledStudents: ['s2', 's5', 's10'],
    notes: 'Hands-on practice with oscilloscopes and circuit building'
  },
  {
    id: 'open5',
    tutorId: 't3',
    subject: 'Linear Algebra Review',
    date: '2025-11-26',
    startTime: '10:00',
    endTime: '12:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/linalg-review',
    maxStudents: 20,
    enrolledStudents: ['s4', 's8'],
    notes: 'Comprehensive review of eigenvalues, eigenvectors, and matrix decomposition'
  },
  {
    id: 'open6',
    tutorId: 't4',
    subject: 'React Masterclass',
    date: '2025-11-27',
    startTime: '14:00',
    endTime: '17:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/react-master',
    maxStudents: 15,
    enrolledStudents: ['s3', 's6'],
    notes: 'Deep dive into React hooks, context API, and performance optimization'
  },
  {
    id: 'open7',
    tutorId: 't5',
    subject: 'Statistics Workshop',
    date: '2025-11-28',
    startTime: '09:00',
    endTime: '11:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/stats-workshop',
    maxStudents: 18,
    enrolledStudents: ['s4', 's8', 's1'],
    notes: 'Hypothesis testing, regression analysis, and ANOVA'
  },
  {
    id: 'open8',
    tutorId: 't6',
    subject: 'Microcontroller Programming',
    date: '2025-11-29',
    startTime: '13:00',
    endTime: '15:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 306',
    maxStudents: 10,
    enrolledStudents: ['s5', 's10'],
    notes: 'Arduino and ARM programming workshop'
  },
  {
    id: 'open9',
    tutorId: 't7',
    subject: 'Engineering Mechanics Workshop',
    date: '2025-11-30',
    startTime: '10:00',
    endTime: '12:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H1, Room 403',
    maxStudents: 12,
    enrolledStudents: ['s7'],
    notes: 'Statics, dynamics, and mechanics of materials'
  },
  {
    id: 'open10',
    tutorId: 't1',
    subject: 'Database Design Patterns',
    date: '2025-12-01',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/db-patterns',
    maxStudents: 15,
    enrolledStudents: ['s1'],
    notes: 'Advanced database design, indexing strategies, and query optimization'
  },
  {
    id: 'open11',
    tutorId: 't4',
    subject: 'JavaScript Deep Dive',
    date: '2025-12-02',
    startTime: '14:00',
    endTime: '16:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/js-deep',
    maxStudents: 20,
    enrolledStudents: ['s3', 's6', 's9'],
    notes: 'Closures, prototypes, async/await, and modern JavaScript features'
  },
  {
    id: 'open12',
    tutorId: 't2',
    subject: 'Signal Processing Fundamentals',
    date: '2025-12-03',
    startTime: '13:00',
    endTime: '15:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/signal-fund',
    maxStudents: 12,
    enrolledStudents: ['s2', 's5'],
    notes: 'Fourier analysis, filters, and frequency domain'
  },
  {
    id: 'open13',
    tutorId: 't3',
    subject: 'Discrete Math for CS',
    date: '2025-12-04',
    startTime: '10:00',
    endTime: '12:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/discrete-cs',
    maxStudents: 16,
    enrolledStudents: ['s6', 's8', 's9'],
    notes: 'Logic, set theory, graph theory, and combinatorics'
  },
  {
    id: 'open14',
    tutorId: 't5',
    subject: 'Probability Theory',
    date: '2025-12-05',
    startTime: '09:00',
    endTime: '11:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H3, Room 302',
    maxStudents: 14,
    enrolledStudents: ['s4', 's8'],
    notes: 'Random variables, distributions, and conditional probability'
  },
  {
    id: 'open15',
    tutorId: 't1',
    subject: 'Competitive Programming',
    date: '2025-12-06',
    startTime: '14:00',
    endTime: '17:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/comp-prog',
    maxStudents: 10,
    enrolledStudents: ['s1', 's3'],
    notes: 'Practice session for ACM ICPC preparation'
  },
  {
    id: 'open16',
    tutorId: 't6',
    subject: 'Control Systems Design',
    date: '2025-12-07',
    startTime: '13:00',
    endTime: '15:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 107',
    maxStudents: 8,
    enrolledStudents: ['s5', 's10'],
    notes: 'PID controllers and feedback systems'
  },
  {
    id: 'open17',
    tutorId: 't4',
    subject: 'Full Stack Development',
    date: '2025-12-08',
    startTime: '10:00',
    endTime: '13:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/fullstack',
    maxStudents: 12,
    enrolledStudents: ['s3', 's6'],
    notes: 'Build a complete web application from scratch'
  },
  {
    id: 'open18',
    tutorId: 't7',
    subject: 'Physics Problem Solving',
    date: '2025-12-09',
    startTime: '10:00',
    endTime: '12:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H1, Room 302',
    maxStudents: 15,
    enrolledStudents: ['s7'],
    notes: 'Mechanics, thermodynamics, and electromagnetism problems'
  },
  {
    id: 'open19',
    tutorId: 't5',
    subject: 'Machine Learning Basics',
    date: '2025-12-10',
    startTime: '14:00',
    endTime: '16:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/ml-basics',
    maxStudents: 20,
    enrolledStudents: ['s1', 's3', 's4', 's8'],
    notes: 'Introduction to ML algorithms and Python libraries'
  },
  {
    id: 'open20',
    tutorId: 't2',
    subject: 'Digital Circuit Design',
    date: '2025-12-11',
    startTime: '09:00',
    endTime: '11:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 205',
    maxStudents: 10,
    enrolledStudents: ['s2', 's10'],
    notes: 'Combinational and sequential circuit design'
  },
  {
    id: 'open21',
    tutorId: 't3',
    subject: 'Calculus for Engineers',
    date: '2025-12-12',
    startTime: '10:00',
    endTime: '12:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/calc-eng',
    maxStudents: 18,
    enrolledStudents: ['s4', 's7', 's8'],
    notes: 'Applications of calculus in engineering problems'
  },
  {
    id: 'open22',
    tutorId: 't1',
    subject: 'System Design Interview Prep',
    date: '2025-12-13',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/sys-design',
    maxStudents: 12,
    enrolledStudents: ['s1'],
    notes: 'Scalability, databases, caching, and distributed systems'
  },
  {
    id: 'open23',
    tutorId: 't4',
    subject: 'Mobile App Development',
    date: '2025-12-14',
    startTime: '13:00',
    endTime: '15:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/mobile-dev',
    maxStudents: 15,
    enrolledStudents: ['s3', 's6', 's9'],
    notes: 'React Native fundamentals and mobile UI/UX'
  },
  {
    id: 'open24',
    tutorId: 't6',
    subject: 'Embedded Systems Workshop',
    date: '2025-12-15',
    startTime: '13:00',
    endTime: '16:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 308',
    maxStudents: 8,
    enrolledStudents: ['s5', 's10'],
    notes: 'Real-time operating systems and IoT applications'
  },
  {
    id: 'open25',
    tutorId: 't5',
    subject: 'Data Analysis with Python',
    date: '2025-12-16',
    startTime: '09:00',
    endTime: '11:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/data-python',
    maxStudents: 20,
    enrolledStudents: ['s1', 's4', 's8'],
    notes: 'Pandas, NumPy, and data visualization'
  },
  {
    id: 'open26',
    tutorId: 't2',
    subject: 'Power Electronics',
    date: '2025-12-17',
    startTime: '13:00',
    endTime: '15:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H2, Lab 206',
    maxStudents: 10,
    enrolledStudents: ['s2', 's5'],
    notes: 'Converters, inverters, and motor drives'
  },
  {
    id: 'open27',
    tutorId: 't7',
    subject: 'Fluid Mechanics',
    date: '2025-12-18',
    startTime: '10:00',
    endTime: '12:00',
    type: 'in-person',
    status: 'open',
    location: 'Building H1, Room 404',
    maxStudents: 12,
    enrolledStudents: ['s7'],
    notes: 'Fluid statics, dynamics, and Bernoulli equation'
  },
  {
    id: 'open28',
    tutorId: 't1',
    subject: 'Software Testing Workshop',
    date: '2025-12-19',
    startTime: '14:00',
    endTime: '16:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/testing',
    maxStudents: 15,
    enrolledStudents: ['s1', 's3'],
    notes: 'Unit testing, integration testing, and TDD'
  },
  {
    id: 'open29',
    tutorId: 't3',
    subject: 'Abstract Algebra',
    date: '2025-12-20',
    startTime: '10:00',
    endTime: '12:00',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/abstract-alg',
    maxStudents: 10,
    enrolledStudents: ['s4', 's8'],
    notes: 'Groups, rings, and fields'
  },
  {
    id: 'open30',
    tutorId: 't4',
    subject: 'DevOps Fundamentals',
    date: '2025-12-21',
    startTime: '14:00',
    endTime: '16:30',
    type: 'online',
    status: 'open',
    meetingLink: 'https://meet.google.com/devops',
    maxStudents: 18,
    enrolledStudents: ['s3', 's6'],
    notes: 'CI/CD, Docker, Kubernetes, and cloud deployment'
  }
];