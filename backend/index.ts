// Trong index.ts
import express from "express";
import cors from "cors";

// Import các routes
import authRoutes from "./src/routes/auth.js";
import analyticsRoutes from "./src/routes/analytics.js";
import evaluationsRoutes from "./src/routes/evaluations.js";
import libraryRoutes from "./src/routes/library.js";
import messagesRoutes from "./src/routes/messages.js";
import reportsRoutes from "./src/routes/reports.js";
import requestsRoutes from "./src/routes/requests.js";
import sessionsRoutes from "./src/routes/sessions.js";
import studentsRoutes from "./src/routes/students.js";
import tutorsRoutes from "./src/routes/tutors.js";


const app = express();
const PORT = 5001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // <-- RẤT QUAN TRỌNG: để đọc req.body

// --- LẮP RÁP ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/evaluations", evaluationsRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/tutors", tutorsRoutes);


// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại http://localhost:${PORT}`);
  console.log(`API endpoints đã sẵn sàng!`);
});
