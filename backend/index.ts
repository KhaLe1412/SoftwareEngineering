// Trong index.ts
import express from "express";
import cors from "cors";

// Import các routes
//import tutorRoutes from './routes/tutors';
//import sessionRoutes from './routes/sessions';
import authRoutes from "./src/routes/auth.js";

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // <-- RẤT QUAN TRỌNG: để đọc req.body

// --- LẮP RÁP ROUTES ---
//app.use('/api/tutors', tutorRoutes);
//app.use('/api/sessions', sessionRoutes);
app.use("/api/auth", authRoutes); // <-- THÊM DÒNG NÀY

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại http://localhost:${PORT}`);
});
