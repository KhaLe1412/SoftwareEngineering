import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, Edit, Plus, Users, FileText, Download, AlertCircle } from 'lucide-react';
import { mockSessions, mockStudents, mockSessionRequests, mockRescheduleRequests, mockMaterialAccessRequests } from '../../lib/mock-data';
import { Tutor, Session, SessionRequest } from '../../types';
import { toast } from 'sonner@2.0.3';

interface SessionsTabProps {
  tutor: Tutor;
}

export function SessionsTab({ tutor }: SessionsTabProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [progressNotes, setProgressNotes] = useState('');
  const [tutorNotes, setTutorNotes] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'individual' | 'open'>('individual');
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<Session | null>(null);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [sessionForMaterial, setSessionForMaterial] = useState<Session | null>(null);
  const [sessionSummary, setSessionSummary] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  
  // Form state for creating sessions
  const [newSession, setNewSession] = useState({
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'online' as 'online' | 'in-person',
    location: '',
    meetingLink: '',
    notes: '',
    maxStudents: '10',
    studentId: ''
  });

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const tutorSessions = mockSessions.filter(s => s.tutorId === tutor.id);
  const scheduledSessions = tutorSessions.filter(s => s.status === 'scheduled');
  const completedSessions = tutorSessions.filter(s => s.status === 'completed');
  const pendingRequests = mockSessionRequests.filter(r => r.tutorId === tutor.id && r.status === 'pending');
  
  // Get reschedule requests for tutor's sessions
  const rescheduleRequests = mockRescheduleRequests.filter(r => {
    const session = mockSessions.find(s => s.id === r.sessionId);
    return session && session.tutorId === tutor.id && r.status === 'pending';
  });

  // Get material access requests for tutor's completed sessions
  const materialRequests = mockMaterialAccessRequests.filter(r => {
    const session = mockSessions.find(s => s.id === r.sessionId);
    return session && session.tutorId === tutor.id && r.status === 'pending';
  });

  const handleCompleteSession = (sessionId: string) => {
    toast.success('Session marked as completed');
    setSelectedSession(null);
  };

  const handleCancelSession = (sessionId: string) => {
    toast.success('Session cancelled');
  };

  const handleSaveProgress = () => {
    toast.success('Student progress saved successfully');
    setSelectedSession(null);
    setProgressNotes('');
    setTutorNotes('');
  };

  const handleCreateSession = () => {
    if (!newSession.subject || !newSession.date || !newSession.startTime || !newSession.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (sessionType === 'individual' && !newSession.studentId) {
      toast.error('Please select a student for individual session');
      return;
    }

    const sessionData = sessionType === 'open' 
      ? `Open session for ${newSession.maxStudents} students`
      : `Individual session with ${mockStudents.find(s => s.id === newSession.studentId)?.name}`;

    toast.success(`Session created successfully: ${sessionData}`);
    setCreateDialogOpen(false);
    setNewSession({
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'online',
      location: '',
      meetingLink: '',
      notes: '',
      maxStudents: '10',
      studentId: ''
    });
  };

  const handleApproveRequest = (request: SessionRequest) => {
    // Pre-fill the form with request data
    setNewSession({
      subject: request.subject,
      date: request.preferredDate,
      startTime: request.preferredTime,
      endTime: '',
      type: request.type,
      location: '',
      meetingLink: '',
      notes: request.message || '',
      maxStudents: '10',
      studentId: request.studentId
    });
    setSessionType('individual');
    setCreateDialogOpen(true);
    toast.success('Request approved - please complete session details');
  };

  const handleRejectRequest = (requestId: string) => {
    toast.success('Session request rejected');
  };

  const handleOpenReschedule = (session: Session) => {
    setSessionToReschedule(session);
    setRescheduleData({
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime
    });
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleSession = () => {
    if (!rescheduleData.date || !rescheduleData.startTime || !rescheduleData.endTime) {
      toast.error('Please fill in all fields');
      return;
    }
    const student = mockStudents.find(s => s.id === sessionToReschedule?.studentId);
    toast.success(`Session rescheduled to ${rescheduleData.date} at ${rescheduleData.startTime}`);
    // In a real app, this would send a notification message to the student
    setRescheduleDialogOpen(false);
    setSessionToReschedule(null);
  };

  const handleApproveRescheduleRequest = (requestId: string) => {
    toast.success('Reschedule request approved. Session has been rescheduled.');
  };

  const handleRejectRescheduleRequest = (requestId: string) => {
    toast.success('Reschedule request rejected');
  };

  const handleOpenMaterialDialog = (session: Session) => {
    setSessionForMaterial(session);
    setSessionSummary(session.summary || '');
    setRecordingUrl(session.recordingUrl || '');
    setMaterialDialogOpen(true);
  };

  const handleSaveMaterials = () => {
    toast.success('Session materials saved successfully');
    setMaterialDialogOpen(false);
    setSessionForMaterial(null);
  };

  const handleApproveMaterialRequest = (requestId: string) => {
    toast.success('Material access request approved. Student can now access the materials.');
  };

  const handleRejectMaterialRequest = (requestId: string) => {
    toast.success('Material access request rejected');
  };

  const renderSession = (session: Session, showActions: boolean = false) => {
    const student = mockStudents.find(s => s.id === session.studentId);
    
    return (
      <Card key={session.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={student?.avatar} />
                <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{session.subject}</CardTitle>
                <CardDescription>
                  {student?.name} - {student?.studentId}
                </CardDescription>
                <p className="text-sm text-gray-600 mt-1">
                  {student?.department}, Year {student?.year}
                </p>
              </div>
            </div>
            <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
              {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
            {session.type === 'in-person' && session.location && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{session.location}</span>
              </div>
            )}
            {session.type === 'online' && session.meetingLink && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Video className="h-4 w-4 text-gray-500" />
                <a href={session.meetingLink} className="text-blue-600 hover:underline">
                  {session.meetingLink}
                </a>
              </div>
            )}
          </div>

          {session.notes && (
            <div>
              <p className="text-sm mb-1">Session Notes</p>
              <p className="text-sm text-gray-600">{session.notes}</p>
            </div>
          )}

          {session.feedback && (
            <div className="border-t pt-4 space-y-3">
              {session.feedback.tutorProgress && (
                <div>
                  <p className="text-sm mb-1">Progress Assessment</p>
                  <p className="text-sm text-gray-600">{session.feedback.tutorProgress}</p>
                </div>
              )}
              {session.feedback.studentRating && (
                <div>
                  <p className="text-sm mb-1">Student Rating</p>
                  <div className="flex items-center gap-2">
                    <span>{session.feedback.studentRating}/5</span>
                    {session.feedback.studentComment && (
                      <span className="text-sm text-gray-600">- {session.feedback.studentComment}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {showActions && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => setSelectedSession(session)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete & Record Progress
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenReschedule(session)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleCancelSession(session.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Actions for completed sessions */}
          {session.status === 'completed' && (
            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOpenMaterialDialog(session)}
              >
                <FileText className="h-4 w-4 mr-2" />
                {session.summary || session.recordingUrl ? 'Edit Materials' : 'Add Summary/Recording'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reschedule Requests */}
      {rescheduleRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Reschedule Requests ({rescheduleRequests.length})
            </CardTitle>
            <CardDescription>Students requesting to reschedule sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rescheduleRequests.map(request => {
              const session = mockSessions.find(s => s.id === request.sessionId);
              const student = mockStudents.find(s => s.id === request.requesterId);
              if (!session) return null;
              
              return (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={student?.avatar} />
                          <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{student?.name}</p>
                          <p className="text-sm text-gray-600">Session: {session.subject}</p>
                        </div>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                    <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm">Current Schedule:</p>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{session.date} at {session.startTime}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">Requested Schedule:</p>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-600">{request.newDate} at {request.newStartTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">Reason:</p>
                        <p className="text-sm text-gray-600">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApproveRescheduleRequest(request.id)} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Reschedule
                      </Button>
                      <Button variant="outline" onClick={() => handleRejectRescheduleRequest(request.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Material Access Requests */}
      {materialRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Material Access Requests ({materialRequests.length})
            </CardTitle>
            <CardDescription>Students requesting summaries or recordings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materialRequests.map(request => {
              const session = mockSessions.find(s => s.id === request.sessionId);
              const student = mockStudents.find(s => s.id === request.studentId);
              if (!session) return null;
              
              return (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={student?.avatar} />
                          <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{student?.name}</p>
                          <p className="text-sm text-gray-600">Session: {session.subject} ({session.date})</p>
                        </div>
                      </div>
                      <Badge>{request.materialType === 'both' ? 'Summary & Recording' : request.materialType}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApproveMaterialRequest(request.id)} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Grant Access
                      </Button>
                      <Button variant="outline" onClick={() => handleRejectMaterialRequest(request.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Session Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Session Requests</CardTitle>
            <CardDescription>Students requesting sessions with you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map(request => {
              const student = mockStudents.find(s => s.id === request.studentId);
              return (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={student?.avatar} />
                          <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{student?.name}</p>
                          <p className="text-sm text-gray-600">{student?.studentId} - {student?.department}</p>
                        </div>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p><span className="text-sm">Subject:</span> {request.subject}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{request.preferredDate} at {request.preferredTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {request.type === 'online' ? (
                          <Video className="h-4 w-4 text-gray-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-gray-500" />
                        )}
                        <span>{request.type}</span>
                      </div>
                      {request.message && (
                        <div className="mt-2">
                          <p className="text-sm">Message:</p>
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApproveRequest(request)} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Schedule
                      </Button>
                      <Button variant="outline" onClick={() => handleRejectRequest(request.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Sessions you need to conduct</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Session</DialogTitle>
                  <DialogDescription>
                    Schedule a new tutoring session
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Session Type</Label>
                    <Select value={sessionType} onValueChange={(value: 'individual' | 'open') => setSessionType(value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Session</SelectItem>
                        <SelectItem value="open">Open Session (Group)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      {sessionType === 'individual' 
                        ? 'One-on-one session with a specific student'
                        : 'Open session available for multiple students to join'}
                    </p>
                  </div>

                  {sessionType === 'individual' && (
                    <div>
                      <Label>Student *</Label>
                      <Select value={newSession.studentId} onValueChange={(value) => setNewSession({...newSession, studentId: value})}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockStudents.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} - {student.studentId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {sessionType === 'open' && (
                    <div>
                      <Label>Maximum Students</Label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={newSession.maxStudents}
                        onChange={(e) => setNewSession({...newSession, maxStudents: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Subject *</Label>
                    <Input
                      value={newSession.subject}
                      onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                      placeholder="e.g., Data Structures, Calculus"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Delivery Type *</Label>
                      <Select value={newSession.type} onValueChange={(value: 'online' | 'in-person') => setNewSession({...newSession, type: value})}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time *</Label>
                      <Input
                        type="time"
                        value={newSession.startTime}
                        onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>End Time *</Label>
                      <Input
                        type="time"
                        value={newSession.endTime}
                        onChange={(e) => setNewSession({...newSession, endTime: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {newSession.type === 'online' && (
                    <div>
                      <Label>Meeting Link</Label>
                      <Input
                        value={newSession.meetingLink}
                        onChange={(e) => setNewSession({...newSession, meetingLink: e.target.value})}
                        placeholder="https://meet.google.com/..."
                        className="mt-2"
                      />
                    </div>
                  )}

                  {newSession.type === 'in-person' && (
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={newSession.location}
                        onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                        placeholder="Building, Room number"
                        className="mt-2"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Session Notes</Label>
                    <Textarea
                      value={newSession.notes}
                      onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                      placeholder="Topics to cover, preparation needed, etc."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateSession} className="flex-1">
                      {sessionType === 'individual' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Create Session
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Create Open Session
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {scheduledSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming sessions</p>
          ) : (
            <div className="space-y-4">
              {scheduledSessions.map(session => renderSession(session, true))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Sessions</CardTitle>
          <CardDescription>Your session history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {completedSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed sessions yet</p>
          ) : (
            <div className="space-y-4">
              {completedSessions.map(session => renderSession(session))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Recording Dialog */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Student Progress</DialogTitle>
              <DialogDescription>
                Document the student's improvement and session outcomes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Student</Label>
                <p className="mt-1">
                  {mockStudents.find(s => s.id === selectedSession.studentId)?.name}
                </p>
              </div>
              <div>
                <Label>Session Subject</Label>
                <p className="mt-1">{selectedSession.subject}</p>
              </div>
              <div>
                <Label>Progress Assessment</Label>
                <Textarea
                  placeholder="Describe the student's understanding, improvement areas, and achievements during this session..."
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Recommendations & Next Steps</Label>
                <Textarea
                  placeholder="What should the student focus on next? Any practice problems or resources to recommend?"
                  value={tutorNotes}
                  onChange={(e) => setTutorNotes(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSaveProgress}>
                  Save Progress & Complete Session
                </Button>
                <Button variant="outline" onClick={() => setSelectedSession(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Session</DialogTitle>
            <DialogDescription>
              Update the session date and time
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Session</Label>
              <p className="mt-1">{sessionToReschedule?.subject}</p>
            </div>
            <div>
              <Label>New Date *</Label>
              <Input
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={rescheduleData.startTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, startTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>End Time *</Label>
                <Input
                  type="time"
                  value={rescheduleData.endTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, endTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleRescheduleSession}>
                Confirm Reschedule
              </Button>
              <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Materials Dialog */}
      <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Materials</DialogTitle>
            <DialogDescription>
              Add or update session summary and recording
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Session</Label>
              <p className="mt-1">{sessionForMaterial?.subject} ({sessionForMaterial?.date})</p>
            </div>
            <div>
              <Label>Session Summary</Label>
              <Textarea
                placeholder="Provide a detailed summary of what was covered in this session..."
                value={sessionSummary}
                onChange={(e) => setSessionSummary(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Recording URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/recordings/session.mp4"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload your recording to a cloud storage service and paste the link here
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveMaterials}>
                <Download className="h-4 w-4 mr-2" />
                Save Materials
              </Button>
              <Button variant="outline" onClick={() => setMaterialDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
