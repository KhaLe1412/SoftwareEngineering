// import { Request, Response } from 'express';

// // GET /api/library/resources
// export const getLibraryResources = (req: Request, res: Response) => {}

// // GET /api/library/resources/:id/download
// export const downloadLibraryResource = (req: Request, res: Response) => {}
import { Request, Response } from 'express';
// Import dữ liệu giả lập từ file data. Lưu ý đường dẫn ../data/lib_resource.js
import { mockLibraryResources } from '../data/lib_resource.js'; 

// GET /api/library/resources
// API này hỗ trợ các query param: ?q=...&subject=...&type=...
export const getLibraryResources = (req: Request, res: Response) => {
  try {
    const { q, subject, type } = req.query;

    let results = mockLibraryResources;

    // 1. Lọc theo từ khóa tìm kiếm (Title hoặc Author)
    if (q) {
      const searchTerm = (q as string).toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.author.toLowerCase().includes(searchTerm)
      );
    }

    // 2. Lọc theo Môn học (Subject)
    // Frontend thường gửi 'All' nếu không chọn gì, nên cần check điều kiện này
    if (subject && subject !== 'All') {
      const subjectFilter = (subject as string).toLowerCase();
      results = results.filter(item => 
        item.subject.toLowerCase() === subjectFilter
      );
    }

    // 3. Lọc theo Loại tài liệu (Type: textbook, video, document...)
    if (type && type !== 'all') {
      const typeFilter = (type as string).toLowerCase();
      results = results.filter(item => 
        item.type.toLowerCase() === typeFilter
      );
    }

    console.log(`[LIBRARY] Tìm kiếm: q='${q || ''}', subject='${subject || ''}', kết quả: ${results.length}`);
    
    res.status(200).json(results);

  } catch (error) {
    console.error("[LIBRARY] Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách tài liệu" });
  }
};

// GET /api/library/resources/:id/download
export const downloadLibraryResource = (req: Request, res: Response): any => {
  try {
    const { id } = req.params;
    
    // Tìm tài liệu theo ID
    const resource = mockLibraryResources.find(r => r.id === id);

    if (!resource) {
      return res.status(404).json({ message: "Tài liệu không tồn tại" });
    }

    // Vì đây là Mock Data (url là '#'), ta trả về thông tin giả lập để frontend xử lý
    console.log(`[LIBRARY] Yêu cầu tải xuống: ${resource.title}`);

    res.status(200).json({
      message: "Link tải xuống đã sẵn sàng",
      downloadUrl: resource.url, // Trả về URL gốc
      fileName: `${resource.title}` // Trả về tên file để frontend hiển thị
    });

  } catch (error) {
    console.error("[LIBRARY] Lỗi tải xuống:", error);
    res.status(500).json({ message: "Lỗi server khi tải tài liệu" });
  }
};