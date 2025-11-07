// Example

import express from "express";
import cors from "cors";
//import tutorRoutes from './routes/tutors.js';
import sessionRoutes from "./src/routes/sessions.js"; // <-- Import file route mới

const app = express();
app.use(cors());
app.use(express.json());

// Lắp ráp routes
//app.use('/api/tutors', tutorRoutes);
app.use("/api/sessions", sessionRoutes); // <-- Thêm dòng này

// ...
app.listen(5000, () => {
  console.log(`Backend đang chạy tại http://localhost:5000`);
});
