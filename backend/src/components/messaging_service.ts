import { Request, Response } from "express";
import { mockMessages } from "../data/message.js";
import { Message } from "../types/type.js";

// GET /api/messages/conversations?userId=...
// Trả về: danh sách các người mà user đã từng nói chuyện
// [{ partnerId: "s1" }, { partnerId: "t2" }, ...]
export const getConversations = (req: Request, res: Response) => {
  console.log("getConversations query:", req.query);

  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    // Lấy tất cả message có liên quan đến user này
    const userMessages = mockMessages.filter(
      (m) => m.senderId === userId || m.receiverId === userId
    );

    // Lấy ra danh sách partnerId (người nói chuyện với user)
    const partnerIds = new Set<string>();

    for (const m of userMessages) {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
      partnerIds.add(partnerId);
    }

    // Format trả về: [{ partnerId: "..." }, ...]
    const conversations = Array.from(partnerIds).map((pid) => ({
      partnerId: pid,
    }));

    console.log("getConversations result:", conversations);
    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversations:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET /api/messages?userId=...&partnerId=...
// Lấy tất cả tin nhắn giữa userId và partnerId
// ==========================
export const getMessages = (req: Request, res: Response) => {
  console.log("getMessages query:", req.query);

  try {
    const { partnerId, userId } = req.query;

    if (
      !partnerId ||
      typeof partnerId !== "string" ||
      !userId ||
      typeof userId !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing partnerId or userId" });
    }

    const messages = mockMessages
      .filter(
        (m) =>
          (m.senderId === userId && m.receiverId === partnerId) ||
          (m.senderId === partnerId && m.receiverId === userId)
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    console.log("getMessages result:", messages.length);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// POST /api/messages
// Body: { senderId, receiverId, content, type?, relatedSessionId? }
// Backend tự sinh: id, timestamp, read=false
// ==========================
export const sendMessage = (req: Request, res: Response) => {
  console.log("sendMessage body:", req.body);

  try {
    const { senderId, receiverId, content, type, relatedSessionId } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "Invalid message data" });
    }

    const now = new Date();

    const newMessage: Message = {
      id: `msg_${now.getTime()}`,
      senderId,
      receiverId,
      content,
      timestamp: now.toISOString(),
      read: false,
      type: type ?? "regular",
      relatedSessionId,
    };

    mockMessages.push(newMessage);

    console.log("sendMessage pushed:", newMessage.id);
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET /api/messages/notifications?userId=...
// Lấy các tin nhắn dạng thông báo (type != 'regular')
// gửi tới user đó
// ==========================
export const getNotifications = (req: Request, res: Response) => {
  console.log("getNotifications query:", req.query);

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const notifications = mockMessages
      .filter((m) => m.receiverId === userId && m.type && m.type !== "regular")
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    console.log("getNotifications result:", notifications.length);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// PATCH /api/messages/:id/read
// Đánh dấu 1 message là đã đọc
// ==========================
export const markMessageAsRead = (req: Request, res: Response) => {
  console.log("markMessageAsRead params:", req.params);

  try {
    const { id } = req.params;

    const msg = mockMessages.find((m) => m.id === id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    msg.read = true;

    console.log("markMessageAsRead updated:", id);
    return res.status(200).json(msg);
  } catch (error) {
    console.error("Error in markMessageAsRead:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
