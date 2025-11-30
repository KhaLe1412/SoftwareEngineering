import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Calendar, Clock, MapPin, Video, X, Edit, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Student, Session, Tutor } from '../../types';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5001/api';

interface EnhancedMySessionsTabProps {
  student: Student;
}

export function EnhancedMySessionsTab({ student }: EnhancedMySessionsTabProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentSessions, setStudentSessions] = useState<Session[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newStartTime: '',
    newEndTime: '',
    reason: ''
  });

  // Fetch student's enrolled sessions from API
  const fetchStudentSessions = async () => {
    try {
      setIsLoading(true);
      // Fetch all open sessions where student is enrolled
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
      
      // Filter sessions where student is enrolled
      const enrolledSessions = data
        .map((item: any) => item.session)
        .filter((session: Session) => 
          session.status === 'open' && 
          session.enrolledStudents?.includes(student.id)
        );
      
      setStudentSessions(enrolledSessions);
      
      // Extract unique tutors from all sessions
      const allTutors = new Map<string, Tutor>();
      data.forEach((item: any) => {
        if (item.tutor && !allTutors.has(item.tutor.id)) {
          allTutors.set(item.tutor.id, item.tutor);
        }
      });
      
      setTutors(Array.from(allTutors.values()));
    } catch (error) {
      console.error('Error fetching student sessions:', error);
      toast.error('Failed to load your sessions');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount and when student changes
  useEffect(() => {
    fetchStudentSessions();
    
    // Listen for custom event to refresh when join/leave happens
    const handleRefresh = () => {
      fetchStudentSessions();
    };
    
    window.addEventListener('sessionEnrollmentChanged', handleRefresh);
    
    // Also refresh when window gains focus (user switches tabs)
    const handleFocus = () => {
      fetchStudentSessions();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('sessionEnrollmentChanged', handleRefresh);
      window.removeEventListener('focus', handleFocus);
    };
  }, [student.id]);

  const selectedSession = studentSessions.find(s => s.id === selectedSessionId);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getSessionsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return studentSessions.filter(s => s.date === dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleOpenReschedule = () => {
    if (selectedSession) {
      setRescheduleData({
        newDate: selectedSession.date,
        newStartTime: selectedSession.startTime,
        newEndTime: selectedSession.endTime,
        reason: ''
      });
      setRescheduleDialogOpen(true);
    }
  };

  const handleSubmitRescheduleRequest = () => {
    if (!rescheduleData.newDate || !rescheduleData.newStartTime || !rescheduleData.newEndTime || !rescheduleData.reason) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Reschedule request sent to tutor. You will be notified via Messages when the tutor responds.');
    setRescheduleDialogOpen(false);
    setSelectedSessionId(null);
  };

  const handleCancelSession = async () => {
    if (!selectedSession) return;

    const sessionId = selectedSession.id;
    const sessionTitle = selectedSession.subject;

    // Optimistic update: remove session from state immediately
    setStudentSessions(prevSessions => 
      prevSessions.filter(session => session.id !== sessionId)
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
        // Rollback on error
        await fetchStudentSessions();
        const errorData = await response.json().catch(() => ({ message: 'Failed to cancel session' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh sessions list to get latest data from server
      await fetchStudentSessions();
      
      // Dispatch event to notify JoinTab to refresh
      window.dispatchEvent(new Event('sessionEnrollmentChanged'));
      
      toast.success(`Session cancelled successfully: ${sessionTitle}`);
      setSelectedSessionId(null);
    } catch (error: any) {
      console.error('Error cancelling session:', error);
      toast.error(error.message || 'Failed to cancel session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Sessions Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[150px] text-center">
                {monthNames[month]} {year}
              </span>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Click on a session to view details, reschedule, or cancel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            /* Calendar Grid */
            <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm border-b">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[100px] p-2 border rounded-lg bg-gray-50" />
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
              const day = dayIdx + 1;
              const date = new Date(year, month, day);
              const sessionsOnDate = getSessionsForDate(date);
              const isToday = new Date().toDateString() === date.toDateString();
              
              return (
                <div 
                  key={day} 
                  className={`min-h-[100px] p-2 border rounded-lg ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                >
                  <div className="text-sm mb-1">
                    <span className={isToday ? 'font-bold text-blue-700' : 'text-gray-600'}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {sessionsOnDate.map(session => {
                      const sessionColor = session.type === 'online' 
                        ? 'bg-blue-100 hover:bg-blue-200 border-blue-300' 
                        : 'bg-green-100 hover:bg-green-200 border-green-300';
                      return (
                        <div
                          key={session.id}
                          onClick={() => setSelectedSessionId(session.id)}
                          className={`text-xs p-1.5 rounded cursor-pointer border ${sessionColor}`}
                        >
                          <p className="truncate">{session.subject}</p>
                          <p className="text-gray-600">{session.startTime}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSessionId} onOpenChange={(open) => !open && setSelectedSessionId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>View and manage this session</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p>{selectedSession.subject}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Tutor</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={tutors.find(t => t.id === selectedSession.tutorId)?.avatar} />
                    <AvatarFallback>
                      {tutors.find(t => t.id === selectedSession.tutorId)?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{tutors.find(t => t.id === selectedSession.tutorId)?.name}</span>
                </div>
              </div>

              {selectedSession.status === 'open' && (
                <div>
                  <p className="text-sm text-gray-600">Enrolled Students</p>
                  <p>{selectedSession.enrolledStudents?.length || 0} / {selectedSession.maxStudents}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedSession.date}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedSession.startTime} - {selectedSession.endTime}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Type</p>
                <Badge>{selectedSession.type}</Badge>
              </div>

              {selectedSession.type === 'in-person' && selectedSession.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedSession.location}</span>
                  </div>
                </div>
              )}

              {selectedSession.type === 'online' && selectedSession.meetingLink && (
                <div>
                  <p className="text-sm text-gray-600">Meeting Link</p>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <a href={selectedSession.meetingLink} className="text-blue-600 hover:underline text-sm">
                      {selectedSession.meetingLink}
                    </a>
                  </div>
                </div>
              )}

              {selectedSession.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedSession.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleOpenReschedule} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Request Reschedule
                </Button>
                <Button variant="outline" onClick={handleCancelSession} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Request Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to Reschedule Session</DialogTitle>
            <DialogDescription>
              Request a new date and time for your session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Date *</Label>
              <Input
                type="date"
                value={rescheduleData.newDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={rescheduleData.newStartTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newStartTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>End Time *</Label>
                <Input
                  type="time"
                  value={rescheduleData.newEndTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newEndTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Reason for Rescheduling *</Label>
              <Textarea
                placeholder="Please explain why you need to reschedule..."
                value={rescheduleData.reason}
                onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitRescheduleRequest}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
