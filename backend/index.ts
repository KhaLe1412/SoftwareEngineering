// Trong index.ts
import express from "express";
import cors from "cors";

// Import các routes
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import sessionRoutes from "./src/routes/sessions.js";
import sessionRequestRoutes from "./src/routes/sessionRequests.js";
import matchRequestRoutes from "./src/routes/matchRequests.js";
import messageRoutes from "./src/routes/messages.js";
import libraryRoutes from "./src/routes/library.js";
import rescheduleRequestRoutes from "./src/routes/rescheduleRequests.js";
import materialRequestRoutes from "./src/routes/materialRequests.js";
import evaluationRoutes from "./src/routes/evaluations.js";

const app = express();
const PORT = 5001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // <-- RẤT QUAN TRỌNG: để đọc req.body

// --- LẮP RÁP ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/session-requests", sessionRequestRoutes);
app.use("/api/match-requests", matchRequestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/reschedule-requests", rescheduleRequestRoutes);
app.use("/api/material-requests", materialRequestRoutes);
app.use("/api/evaluations", evaluationRoutes);

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại http://localhost:${PORT}`);
  console.log(`API endpoints đã sẵn sàng!`);
});
