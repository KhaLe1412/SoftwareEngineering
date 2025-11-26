// file: backend/src/utils/db.ts
import fs from 'fs';
import path from 'path';

// Sử dụng process.cwd() để lấy đường dẫn gốc của dự án -> KHÔNG BAO GIỜ SAI ĐƯỜNG DẪN
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'account.json');

// Hàm đọc
export const readUsers = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error("❌ LỖI: Không tìm thấy file data tại", DB_PATH);
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Lỗi đọc DB:", error);
    return [];
  }
};

// Hàm ghi
export const writeUsers = (users: any[]) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
    console.log("✅ Đã lưu dữ liệu thành công vào file JSON");
    return true;
  } catch (error) {
    console.error("❌ Lỗi ghi DB:", error);
    return false;
  }
};