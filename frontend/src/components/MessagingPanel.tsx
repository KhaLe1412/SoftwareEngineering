import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MessageCircle, Send, Bell, Calendar, AlertCircle } from 'lucide-react';
import { mockMessages, mockStudents, mockTutors, mockSessions } from '../lib/mock-data';
import { Message } from '../types';
import { toast } from 'sonner@2.0.3';

interface MessagingPanelProps {
  userId: string;
  userRole: 'student' | 'tutor';
}

export function MessagingPanel({ userId, userRole }: MessagingPanelProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState('messages');

  // Get messages for current user
  const userMessages = messages.filter(
    m => m.senderId === userId || m.receiverId === userId
  );

  // Separate regular messages and notifications
  const regularMessages = userMessages.filter(m => !m.type || m.type === 'regular');
  const scheduleNotifications = userMessages.filter(
    m => m.type === 'reschedule-notification' || m.type === 'material-request'
  );

  // Get unique conversation partners (only for regular messages)
  const conversationPartners = Array.from(
    new Set(
      regularMessages.map(m => m.senderId === userId ? m.receiverId : m.senderId)
    )
  );

  // Get unread counts
  const unreadMessagesCount = regularMessages.filter(m => m.receiverId === userId && !m.read).length;
  const unreadNotificationsCount = scheduleNotifications.filter(m => m.receiverId === userId && !m.read).length;
  const totalUnreadCount = unreadMessagesCount + unreadNotificationsCount;

  const getPartnerInfo = (partnerId: string) => {
    const allUsers = [...mockStudents, ...mockTutors];
    return allUsers.find(u => u.id === partnerId);
  };

  const getConversationMessages = (partnerId: string) => {
    return messages
      .filter(m => 
        ((m.senderId === userId && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === userId)) &&
        (!m.type || m.type === 'regular')
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getSessionInfo = (sessionId?: string) => {
    if (!sessionId) return null;
    return mockSessions.find(s => s.id === sessionId);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setMessages(messages.map(m => 
      m.id === notificationId ? { ...m, read: true } : m
    ));
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: userId,
      receiverId: selectedConversation,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    toast.success('Message sent');
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
            Communicate with {userRole === 'student' ? 'tutors' : 'students'}
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
              <div className="w-1/3 border-r pr-4">
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {conversationPartners.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">No conversations yet</p>
                    ) : (
                      conversationPartners.map(partnerId => {
                        const partner = getPartnerInfo(partnerId);
                        const conversation = getConversationMessages(partnerId);
                        const lastMessage = conversation[conversation.length - 1];
                        const hasUnread = conversation.some(m => m.receiverId === userId && !m.read);

                        return (
                          <div
                            key={partnerId}
                            onClick={() => setSelectedConversation(partnerId)}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                              selectedConversation === partnerId ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={partner?.avatar} />
                                <AvatarFallback>{partner?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm truncate">{partner?.name}</p>
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
                          <AvatarImage src={getPartnerInfo(selectedConversation)?.avatar} />
                          <AvatarFallback>
                            {getPartnerInfo(selectedConversation)?.name.charAt(0)}
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
                        {getConversationMessages(selectedConversation).map(message => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === userId ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderId === userId
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.senderId === userId
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(notification => {
                      const sender = getPartnerInfo(notification.senderId);
                      const session = getSessionInfo(notification.relatedSessionId);
                      const isUnread = !notification.read && notification.receiverId === userId;
                      
                      return (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 ${
                            isUnread ? 'bg-blue-50 border-blue-200' : 'bg-white'
                          }`}
                          onClick={() => isUnread && markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              notification.type === 'reschedule-notification' 
                                ? 'bg-yellow-100' 
                                : 'bg-green-100'
                            }`}>
                              {notification.type === 'reschedule-notification' ? (
                                <Calendar className="h-5 w-5 text-yellow-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm">
                                    {notification.type === 'reschedule-notification' 
                                      ? 'Schedule Change' 
                                      : 'Material Request'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    From: {sender?.name}
                                  </p>
                                </div>
                                {isUnread && (
                                  <Badge variant="default" className="text-xs">New</Badge>
                                )}
                              </div>
                              {session && (
                                <div className="text-sm bg-gray-50 rounded p-2 mb-2">
                                  <p className="text-gray-600">Session: {session.subject}</p>
                                </div>
                              )}
                              <p className="text-sm text-gray-700 mb-2">{notification.content}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(notification.timestamp).toLocaleString()}
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