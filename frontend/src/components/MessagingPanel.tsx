import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, Send } from 'lucide-react';
import { mockMessages, mockStudents, mockTutors } from '../lib/mock-data';
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

  // Get messages for current user
  const userMessages = messages.filter(
    m => m.senderId === userId || m.receiverId === userId
  );

  // Get unique conversation partners
  const conversationPartners = Array.from(
    new Set(
      userMessages.map(m => m.senderId === userId ? m.receiverId : m.senderId)
    )
  );

  // Get unread message count
  const unreadCount = userMessages.filter(m => m.receiverId === userId && !m.read).length;

  const getPartnerInfo = (partnerId: string) => {
    const allUsers = [...mockStudents, ...mockTutors];
    return allUsers.find(u => u.id === partnerId);
  };

  const getConversationMessages = (partnerId: string) => {
    return messages
      .filter(m => 
        (m.senderId === userId && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === userId)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
          <SheetDescription>
            Communicate with {userRole === 'student' ? 'tutors' : 'students'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-[calc(100vh-120px)] mt-4 gap-4">
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
      </SheetContent>
    </Sheet>
  );
}
