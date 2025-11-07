import { MatchRequest } from "../types/type";

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