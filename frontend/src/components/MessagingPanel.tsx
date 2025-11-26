import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  MessageCircle,
  Send,
  Bell,
  Calendar,
  AlertCircle,
  Plus,
  Search,
} from "lucide-react";
import {
  mockMessages,
  mockStudents,
  mockTutors,
  mockSessions,
} from "../lib/mock-data";
import { Message } from "../types";
import { toast } from "sonner";

interface MessagingPanelProps {
  userId: string;
  userRole: "student" | "tutor";
}

const API_BASE = "http://localhost:5001/api"; // nếu backend chạy trên port khác thì chỉnh lại

export function MessagingPanel({ userId, userRole }: MessagingPanelProps) {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState("messages");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<string[]>([]);

  const fetchConversations = async () => {
    try {
      const params = new URLSearchParams({ userId });
      const res = await fetch(
        `${API_BASE}/messages/conversations?${params.toString()}`
      );

      if (!res.ok) {
        console.error(
          "fetchConversations failed:",
          res.status,
          await res.text()
        );
        return;
      }

      // BE: [{ partnerId: "s1" }, { partnerId: "t1" }, ... ]
      const data: { partnerId: string }[] = await res.json();
      setConversations(data.map((c) => c.partnerId));
    } catch (err) {
      console.error("fetchConversations error:", err);
    }
  };

  // ⬇️ THÊM: hàm fetch tin nhắn cho 1 cuộc hội thoại
  const fetchConversationMessages = async (partnerId: string) => {
    try {
      const params = new URLSearchParams({
        userId,
        partnerId,
      });
      const res = await fetch(`${API_BASE}/messages?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data: Message[] = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      // nếu lỗi thì bạn có thể toast hoặc giữ nguyên state cũ
      // toast.error('Không tải được tin nhắn');
    }
  };

  useEffect(() => {
    // gọi ngay lần đầu
    fetchConversations();

    // sau đó 3s gọi lại một lần để cập nhật khi có tin nhắn mới
    const interval = setInterval(() => {
      fetchConversations();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  // ⬇️ THÊM: khi chọn 1 cuộc hội thoại, bắt đầu fetch + poll tin nhắn
  useEffect(() => {
    if (!selectedConversation) return;

    // fetch ngay lần đầu
    fetchConversationMessages(selectedConversation);

    // sau đó poll mỗi 2 giây để cập nhật tin mới
    const interval = setInterval(() => {
      fetchConversationMessages(selectedConversation);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedConversation, userId]);

  // Get messages for current user (trên state messages đã fetch)
  const userMessages = messages.filter(
    (m) => m.senderId === userId || m.receiverId === userId
  );

  // Separate regular messages and notifications
  const regularMessages = userMessages.filter(
    (m) => !m.type || m.type === "regular"
  );
  const scheduleNotifications = userMessages.filter(
    (m) => m.type === "reschedule-notification" || m.type === "material-request"
  );

  // Ưu tiên dùng danh sách từ API getConversations,
  // fallback về tính từ messages nếu API chưa trả gì (cho an toàn)
  const conversationPartners =
    conversations.length > 0
      ? conversations
      : Array.from(
          new Set(
            regularMessages.map((m) =>
              m.senderId === userId ? m.receiverId : m.senderId
            )
          )
        );

  // Get unread counts
  const unreadMessagesCount = regularMessages.filter(
    (m) => m.receiverId === userId && !m.read
  ).length;
  const unreadNotificationsCount = scheduleNotifications.filter(
    (m) => m.receiverId === userId && !m.read
  ).length;
  const totalUnreadCount = unreadMessagesCount + unreadNotificationsCount;

  const getPartnerInfo = (partnerId: string) => {
    const allUsers = [...mockStudents, ...mockTutors];
    return allUsers.find((u) => u.id === partnerId);
  };

  // Get available users to start new conversation
  const getAvailableUsers = () => {
    const potentialUsers = userRole === "student" ? mockTutors : mockStudents;
    return potentialUsers.filter((user) => user.id !== userId);
  };

  const filteredAvailableUsers = getAvailableUsers().filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasExistingConversation = (partnerId: string) => {
    return conversationPartners.includes(partnerId);
  };

  const startNewConversation = (partnerId: string) => {
    setSelectedConversation(partnerId);
    setShowNewChatDialog(false);
    setSearchQuery("");
    // khi selectedConversation đổi, useEffect phía trên sẽ tự fetch
    setConversations((prev) =>
      prev.includes(partnerId) ? prev : [...prev, partnerId]
    );
  };

  const getConversationMessages = (partnerId: string) => {
    // bây giờ messages đã chỉ chứa conversation hiện tại
    // nhưng để chắc ăn vẫn filter thêm
    return messages
      .filter(
        (m) =>
          ((m.senderId === userId && m.receiverId === partnerId) ||
            (m.senderId === partnerId && m.receiverId === userId)) &&
          (!m.type || m.type === "regular")
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  };

  const getSessionInfo = (sessionId?: string) => {
    if (!sessionId) return null;
    return mockSessions.find((s) => s.id === sessionId);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === notificationId ? { ...m, read: true } : m))
    );
  };

  // ⬇️ SỬA handleSendMessage để gửi lên BE rồi refetch
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const payload = {
      senderId: userId,
      receiverId: selectedConversation,
      content: messageText.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const saved: Message = await res.json();
      // cập nhật local state ngay cho mượt
      setMessages((prev) => [...prev, saved]);
      setMessageText("");
      toast.success("Message sent");
    } catch (err) {
      console.error(err);
      toast.error("Không gửi được tin nhắn");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <MessageCircle className="h-4 w-4 mr-2" />
          Messages
          {totalUnreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {totalUnreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Messages & Notifications</SheetTitle>
          <SheetDescription>
            Communicate with {userRole === "student" ? "tutors" : "students"}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages" className="relative">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
              {unreadMessagesCount > 0 && (
                <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadMessagesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Schedule Alerts
              {unreadNotificationsCount > 0 && (
                <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="h-[calc(100vh-200px)]">
            <div className="flex h-full gap-4">
              {/* Conversations List */}
              <div className="w-1/3 border-r pr-4 flex flex-col">
                {/* New Message Button */}
                <div className="mb-3">
                  <Dialog
                    open={showNewChatDialog}
                    onOpenChange={setShowNewChatDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        New Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Start New Conversation</DialogTitle>
                        <DialogDescription>
                          Select a{" "}
                          {userRole === "student" ? "tutor" : "student"} to
                          start messaging
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {/* User List */}
                        <ScrollArea className="h-[300px] border rounded-lg">
                          <div className="p-2 space-y-1">
                            {filteredAvailableUsers.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-8">
                                No{" "}
                                {userRole === "student" ? "tutors" : "students"}{" "}
                                found
                              </p>
                            ) : (
                              filteredAvailableUsers.map((user) => {
                                const hasConversation = hasExistingConversation(
                                  user.id
                                );
                                return (
                                  <div
                                    key={user.id}
                                    onClick={() =>
                                      startNewConversation(user.id)
                                    }
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                  >
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={user.avatar} />
                                      <AvatarFallback>
                                        {user.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm truncate">
                                          {user.name}
                                        </p>
                                        {hasConversation && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            Active
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {conversationPartners.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No conversations yet
                      </p>
                    ) : (
                      conversationPartners.map((partnerId) => {
                        const partner = getPartnerInfo(partnerId);
                        const conversation = getConversationMessages(partnerId);
                        const lastMessage =
                          conversation[conversation.length - 1];
                        const hasUnread = conversation.some(
                          (m) => m.receiverId === userId && !m.read
                        );

                        return (
                          <div
                            key={partnerId}
                            onClick={() => setSelectedConversation(partnerId)}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                              selectedConversation === partnerId
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={partner?.avatar} />
                                <AvatarFallback>
                                  {partner?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm truncate">
                                    {partner?.name}
                                  </p>
                                  {hasUnread && (
                                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {lastMessage?.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Message Thread */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={getPartnerInfo(selectedConversation)?.avatar}
                          />
                          <AvatarFallback>
                            {getPartnerInfo(selectedConversation)?.name.charAt(
                              0
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{getPartnerInfo(selectedConversation)?.name}</p>
                          <p className="text-sm text-gray-500">
                            {getPartnerInfo(selectedConversation)?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 py-4">
                      <div className="space-y-4">
                        {getConversationMessages(selectedConversation).map(
                          (message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.senderId === userId
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.senderId === userId
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.senderId === userId
                                      ? "text-blue-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {new Date(
                                    message.timestamp
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="h-[calc(100vh-200px)]">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {scheduleNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bell className="h-12 w-12 mb-4 text-gray-300" />
                    <p>No schedule notifications</p>
                  </div>
                ) : (
                  scheduleNotifications
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    )
                    .map((notification) => {
                      const sender = getPartnerInfo(notification.senderId);
                      const session = getSessionInfo(
                        notification.relatedSessionId
                      );
                      const isUnread =
                        !notification.read &&
                        notification.receiverId === userId;

                      return (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 ${
                            isUnread ? "bg-blue-50 border-blue-200" : "bg-white"
                          }`}
                          onClick={() =>
                            isUnread && markNotificationAsRead(notification.id)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                notification.type === "reschedule-notification"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                              }`}
                            >
                              {notification.type ===
                              "reschedule-notification" ? (
                                <Calendar className="h-5 w-5 text-yellow-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm">
                                    {notification.type ===
                                    "reschedule-notification"
                                      ? "Schedule Change"
                                      : "Material Request"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    From: {sender?.name}
                                  </p>
                                </div>
                                {isUnread && (
                                  <Badge variant="default" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              {session && (
                                <div className="text-sm bg-gray-50 rounded p-2 mb-2">
                                  <p className="text-gray-600">
                                    Session: {session.subject}
                                  </p>
                                </div>
                              )}
                              <p className="text-sm text-gray-700 mb-2">
                                {notification.content}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
