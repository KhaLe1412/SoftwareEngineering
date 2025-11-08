import { MaterialAccessRequest } from "../types/type.js";

export const mockMaterialAccessRequests: MaterialAccessRequest[] = [
  {
    id: "mar1",
    sessionId: "ses2",
    studentId: "s1",
    materialType: "both",
    status: "pending",
    createdAt: "2025-10-21T10:00:00Z",
  },
  {
    id: "mar2",
    sessionId: "ses4",
    studentId: "s1",
    materialType: "recording",
    status: "approved",
    createdAt: "2025-10-16T14:00:00Z",
  },
  {
    id: "mar3",
    sessionId: "ses5",
    studentId: "s2",
    materialType: "summary",
    status: "pending",
    createdAt: "2025-10-19T09:00:00Z",
  },
];
