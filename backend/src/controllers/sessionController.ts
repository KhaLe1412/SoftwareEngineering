// Example

import { Request, Response } from 'express'; // <-- 1. Import kiểu dữ liệu

// Hàm này sẽ được gọi khi có request
export const handleSessionRequest = (req: Request, res: Response) => {
  try {
    // 1. Dữ liệu đã được express.json() "dịch"
    // và nằm gọn trong `req.body`
    const data = req.body;

    // 2. (Quan trọng) In ra để kiểm tra
    console.log('--- SERVER ĐÃ NHẬN ĐƯỢC ---');
    console.log(data);
    console.log('-----------------------------');

    // (Logic của bạn ở đây, ví dụ: lưu vào data/sessions.js)

    // 3. Gửi phản hồi thành công về cho frontend
    // Frontend sẽ nhận được và vào nhánh "response.ok"
    res.status(201).json({
      message: "Session request received successfully!",
      receivedData: data 
    });

  } catch (error) {
    // Nếu có lỗi, gửi phản hồi lỗi 500
    res.status(500).json({ message: "Server error processing request" });
  }
};