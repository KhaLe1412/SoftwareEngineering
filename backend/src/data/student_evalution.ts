import { StudentEvaluation } from "../types/type";

export const mockStudentEvaluations: StudentEvaluation[] = [
  {
    id: "eval1",
    studentId: "s1",
    tutorId: "t1",
    sessionId: "ses2",
    skills: {
      understanding: 4,
      participation: 5,
      preparation: 4,
    },
    attitude: 5,
    testResults: {
      score: 85,
      maxScore: 100,
      notes: "Strong performance on dynamic programming problems",
    },
    overallProgress:
      "Excellent progress. Student has shown significant improvement in algorithmic thinking and problem-solving skills.",
    recommendations:
      "Continue practicing more advanced algorithms. Ready to move on to graph algorithms.",
    createdAt: "2025-10-20T16:30:00Z",
  },
  {
    id: "eval2",
    studentId: "s1",
    tutorId: "t1",
    sessionId: "ses4",
    skills: {
      understanding: 4,
      participation: 4,
      preparation: 5,
    },
    attitude: 5,
    overallProgress:
      "Good understanding of database normalization and SQL joins. Student came well-prepared with questions.",
    recommendations:
      "Practice more complex queries involving multiple joins and subqueries.",
    createdAt: "2025-10-15T17:00:00Z",
  },
  {
    id: "eval3",
    studentId: "s2",
    tutorId: "t2",
    sessionId: "ses5",
    skills: {
      understanding: 5,
      participation: 4,
      preparation: 4,
    },
    attitude: 4,
    testResults: {
      score: 92,
      maxScore: 100,
      notes: "Excellent understanding of boolean algebra",
    },
    overallProgress:
      "Outstanding performance in Digital Electronics. Student grasps concepts quickly.",
    recommendations: "Ready for advanced topics in sequential circuits.",
    createdAt: "2025-10-18T12:00:00Z",
  },
];
