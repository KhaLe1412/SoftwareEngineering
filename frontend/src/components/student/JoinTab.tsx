import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Calendar, Clock, MapPin, Video, Users, UserPlus, Search, Sparkles, X, LogOut, Loader2 } from 'lucide-react';
import { Student, Session, Tutor } from '../../types';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5001/api';

interface JoinTabProps {
  student: Student;
}

export function JoinTab({ student }: JoinTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [autoMatchDialogOpen, setAutoMatchDialogOpen] = useState(false);
  const [autoMatchDescription, setAutoMatchDescription] = useState('');
  const [matchedSession, setMatchedSession] = useState<Session | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSessions, setOpenSessions] = useState<Session[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);

  // Fetch open sessions from API
  const fetchOpenSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/sessions?status=open`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Response format: [{session: Session, students: Student[], tutor: Tutor}]
      
      // Extract sessions
      const sessions = data.map((item: any) => item.session);
      setOpenSessions(sessions);
      
      // Extract unique tutors from all sessions
      const allTutors = new Map<string, Tutor>();
      data.forEach((item: any) => {
        if (item.tutor && !allTutors.has(item.tutor.id)) {
          allTutors.set(item.tutor.id, item.tutor);
        }
      });
      
      setTutors(Array.from(allTutors.values()));
    } catch (error) {
      console.error('Error fetching open sessions:', error);
      toast.error('Failed to load open sessions');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchOpenSessions();
    
    // Listen for custom event to refresh when enrollment changes (from MySessionsTab cancel)
    const handleRefresh = () => {
      fetchOpenSessions();
    };
    
    window.addEventListener('sessionEnrollmentChanged', handleRefresh);
    
    return () => {
      window.removeEventListener('sessionEnrollmentChanged', handleRefresh);
    };
  }, []);
  
  // Get unique subjects
  const uniqueSubjects = Array.from(new Set(openSessions.map(s => s.subject)));

  // Separate enrolled and not enrolled sessions
  const enrolledSessions = openSessions.filter(session => 
    session.enrolledStudents?.includes(student.id)
  );
  const availableSessions = openSessions.filter(session => 
    !session.enrolledStudents?.includes(student.id)
  );

  // Filter sessions based on search and filters
  const filterSessions = (sessions: Session[]) => {
    return sessions.filter(session => {
      const tutor = tutors.find(t => t.id === session.tutorId);
      const matchesSearch = 
        session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = filterSubject === 'all' || session.subject === filterSubject;
      const matchesType = filterType === 'all' || session.type === filterType;
      
      return matchesSearch && matchesSubject && matchesType;
    });
  };

  const filteredEnrolledSessions = filterSessions(enrolledSessions);
  const filteredAvailableSessions = filterSessions(availableSessions);

  // Helper function to check if two time ranges overlap
  const checkTimeOverlap = (date1: string, start1: string, end1: string, date2: string, start2: string, end2: string): boolean => {
    // If different dates, no overlap
    if (date1 !== date2) return false;
    
    // Convert time to minutes for easier comparison
    const timeToMinutes = (time: string): number => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };
    
    const start1Min = timeToMinutes(start1);
    const end1Min = timeToMinutes(end1);
    const start2Min = timeToMinutes(start2);
    const end2Min = timeToMinutes(end2);
    
    // Check if time ranges overlap
    // Overlap occurs if: start1 < end2 && start2 < end1
    return start1Min < end2Min && start2Min < end1Min;
  };

  // Check if session overlaps with any enrolled sessions
  const checkSessionOverlap = (newSession: Session): Session | null => {
    for (const enrolledSession of enrolledSessions) {
      if (checkTimeOverlap(
        newSession.date,
        newSession.startTime,
        newSession.endTime,
        enrolledSession.date,
        enrolledSession.startTime,
        enrolledSession.endTime
      )) {
        return enrolledSession;
      }
    }
    return null;
  };

  const handleJoinSession = async (sessionId: string, sessionTitle: string) => {
    const sessionToJoin = openSessions.find(s => s.id === sessionId);
    if (!sessionToJoin) {
      toast.error('Session not found');
      return;
    }

    // Check for time overlap with enrolled sessions
    const conflictingSession = checkSessionOverlap(sessionToJoin);
    if (conflictingSession) {
      toast.error(
        `Cannot join this session! You already have a session "${conflictingSession.subject}" scheduled at the same time (${conflictingSession.date} ${conflictingSession.startTime}-${conflictingSession.endTime}). Please leave that session first or choose a different time.`,
        { duration: 6000 }
      );
      return;
    }

    // Optimistic update: update state immediately
    setOpenSessions(prevSessions => 
      prevSessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            enrolledStudents: [...(session.enrolledStudents || []), student.id],
            status: (session.enrolledStudents?.length || 0) + 1 >= session.maxStudents ? 'full' : session.status
          };
        }
        return session;
      })
    );

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id
        })
      });

      if (!response.ok) {
        // Rollback on error
        await fetchOpenSessions();
        const errorData = await response.json().catch(() => ({ message: 'Failed to join session' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh sessions list to get latest data from server
      await fetchOpenSessions();
      
      // Dispatch event to notify MySessionsTab to refresh
      window.dispatchEvent(new Event('sessionEnrollmentChanged'));
      
      toast.success(`Successfully joined session: ${sessionTitle}`);
    } catch (error: any) {
      console.error('Error joining session:', error);
      toast.error(error.message || 'Failed to join session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveSession = async (sessionId: string, sessionTitle: string) => {
    // Optimistic update: update state immediately
    // Remove student from enrolledStudents array
    setOpenSessions(prevSessions => 
      prevSessions.map(session => {
        if (session.id === sessionId) {
          const newEnrolledStudents = (session.enrolledStudents || []).filter(id => id !== student.id);
          return {
            ...session,
            enrolledStudents: newEnrolledStudents,
            status: session.status === 'full' && newEnrolledStudents.length < session.maxStudents ? 'open' : session.status
          };
        }
        return session;
      })
    );

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id
        })
      });

      if (!response.ok) {
        // Rollback on error - refresh from server
        await fetchOpenSessions();
        const errorData = await response.json().catch(() => ({ message: 'Failed to leave session' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh sessions list to get latest data from server (this ensures state is in sync)
      await fetchOpenSessions();
      
      // Dispatch event to notify MySessionsTab to refresh
      window.dispatchEvent(new Event('sessionEnrollmentChanged'));
      
      toast.success(`Left session: ${sessionTitle}`);
    } catch (error: any) {
      console.error('Error leaving session:', error);
      toast.error(error.message || 'Failed to leave session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoMatch = () => {
    if (!autoMatchDescription.trim()) {
      toast.error('Please describe your learning needs');
      return;
    }

    setIsMatching(true);
    
    // Simulate AI matching (in real app, this would call an AI API)
    setTimeout(() => {
      // Simple matching logic based on keywords
      const keywords = autoMatchDescription.toLowerCase();
      let bestMatch = availableSessions[0];
      
      // Try to find a match based on student's support needs
      for (const session of availableSessions) {
        if (keywords.includes(session.subject.toLowerCase())) {
          bestMatch = session;
          break;
        }
        // Check if any of student's support needs match
        for (const need of student.supportNeeds) {
          if (keywords.includes(need.toLowerCase()) && 
              session.subject.toLowerCase().includes(need.toLowerCase())) {
            bestMatch = session;
            break;
          }
        }
      }

      setMatchedSession(bestMatch);
      setIsMatching(false);
    }, 1500);
  };

  const handleAcceptMatch = () => {
    if (matchedSession) {
      handleJoinSession(matchedSession.id, matchedSession.subject);
      setAutoMatchDialogOpen(false);
      setAutoMatchDescription('');
      setMatchedSession(null);
    }
  };

  const handleRejectMatch = () => {
    toast.info('Match rejected. Try describing your needs differently.');
    setMatchedSession(null);
    setAutoMatchDescription('');
  };

  const renderSessionCard = (session: Session, isEnrolled: boolean = false) => {
    const tutor = tutors.find(t => t.id === session.tutorId);
    const spotsLeft = (session.maxStudents || 0) - (session.enrolledStudents?.length || 0);
    
    return (
      <Card key={session.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{session.subject}</CardTitle>
              <CardDescription>by {tutor?.name}</CardDescription>
            </div>
            <Badge variant={session.type === 'online' ? 'default' : 'secondary'}>
              {session.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={tutor?.avatar} />
              <AvatarFallback>{tutor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">{tutor?.name}</p>
              <p className="text-xs text-gray-500">{tutor?.department}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
            {session.type === 'in-person' && session.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{session.location}</span>
              </div>
            )}
            {session.type === 'online' && (
              <div className="flex items-center gap-2 text-sm">
                <Video className="h-4 w-4 text-gray-500" />
                <span>Online Meeting</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{session.enrolledStudents?.length || 0} / {session.maxStudents} enrolled</span>
            </div>
          </div>

          {session.notes && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{session.notes}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t">
            {isEnrolled ? (
              <Button 
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => handleLeaveSession(session.id, session.subject)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave Session
                  </>
                )}
              </Button>
            ) : spotsLeft > 0 ? (
              <Button 
                className="w-full"
                onClick={() => handleJoinSession(session.id, session.subject)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Session ({spotsLeft} spots left)
                  </>
                )}
              </Button>
            ) : (
              <Badge variant="destructive" className="w-full justify-center py-2">
                Session Full
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Auto-Match Feature */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Auto-Match
              </CardTitle>
              <CardDescription>
                Describe your learning needs and let AI find the perfect session for you
              </CardDescription>
            </div>
            <Dialog open={autoMatchDialogOpen} onOpenChange={setAutoMatchDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Try Auto-Match
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>AI Auto-Match</DialogTitle>
                  <DialogDescription>
                    Tell us about your learning goals and we'll find the best session for you
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {!matchedSession ? (
                    <>
                      <div>
                        <Label>Describe your learning needs</Label>
                        <Textarea
                          placeholder="Example: I need help understanding data structures, particularly binary trees and graph algorithms. I prefer online sessions and need to prepare for an exam next week..."
                          value={autoMatchDescription}
                          onChange={(e) => setAutoMatchDescription(e.target.value)}
                          rows={6}
                          className="mt-2"
                        />
                      </div>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700" 
                        onClick={handleAutoMatch}
                        disabled={isMatching}
                      >
                        {isMatching ? (
                          <>
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                            Finding best match...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Find Match
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="flex items-center gap-2 text-green-800 mb-2">
                          <Sparkles className="h-4 w-4" />
                          We found a perfect match for you!
                        </p>
                      </div>
                      
                      {renderSessionCard(matchedSession, false)}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700" 
                          onClick={handleAcceptMatch}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join This Session
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleRejectMatch}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Open Sessions</CardTitle>
          <CardDescription>
            Search and filter available tutoring sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject or tutor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {uniqueSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            {enrolledSessions.length > 0 && `${enrolledSessions.length} enrolled • `}
            {filteredAvailableSessions.length} available session(s)
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Sessions */}
      {filteredEnrolledSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">Your Enrolled Sessions</Badge>
            <span className="text-sm text-gray-600">You can leave these sessions at any time</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEnrolledSessions.map(session => renderSessionCard(session, true))}
          </div>
        </div>
      )}

      {/* Available Sessions */}
      {filteredAvailableSessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              {searchQuery || filterSubject !== 'all' || filterType !== 'all'
                ? 'No sessions found matching your criteria'
                : 'No open sessions available at the moment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrolledSessions.length > 0 && (
            <div className="flex items-center gap-2 pt-4 border-t">
              <Badge variant="outline">Available Sessions</Badge>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAvailableSessions.map(session => renderSessionCard(session, false))}
          </div>
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <p className="mb-2">Join Sessions</p>
          <p className="text-sm text-gray-600">
            Use AI Auto-Match to quickly find sessions that match your needs, or browse all available sessions manually. 
            Your enrolled sessions appear at the top and will also show in your "My Sessions" calendar. 
            You can leave any session before it starts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
