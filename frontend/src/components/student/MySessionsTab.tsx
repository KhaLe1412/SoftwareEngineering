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
import { Calendar, Clock, MapPin, Video, Star, X, Edit, FileText, Download } from 'lucide-react';
import { mockSessions, mockTutors } from '../../lib/mock-data';
import { Student, Session } from '../../types';
import { toast } from 'sonner@2.0.3';

interface MySessionsTabProps {
  student: Student;
}

export function MySessionsTab({ student }: MySessionsTabProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<Session | null>(null);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });
  const [materialRequestDialogOpen, setMaterialRequestDialogOpen] = useState(false);
  const [sessionForMaterial, setSessionForMaterial] = useState<Session | null>(null);
  const [materialType, setMaterialType] = useState<'summary' | 'recording' | 'both'>('both');

  const studentSessions = mockSessions.filter(s => s.studentId === student.id);
  const scheduledSessions = studentSessions.filter(s => s.status === 'scheduled');
  const completedSessions = studentSessions.filter(s => s.status === 'completed');

  const handleCancelSession = (sessionId: string) => {
    toast.success('Session cancelled successfully');
  };

  const handleOpenReschedule = (session: Session) => {
    setSessionToReschedule(session);
    setRescheduleDialogOpen(true);
  };

  const handleSubmitRescheduleRequest = () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime || !rescheduleData.reason) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Reschedule request sent to tutor. You will be notified when the tutor responds.');
    setRescheduleDialogOpen(false);
    setRescheduleData({ newDate: '', newTime: '', reason: '' });
    setSessionToReschedule(null);
  };

  const handleSubmitFeedback = () => {
    toast.success('Thank you for your feedback!');
    setSelectedSession(null);
    setRating(0);
    setFeedback('');
  };

  const handleOpenMaterialRequest = (session: Session) => {
    setSessionForMaterial(session);
    setMaterialRequestDialogOpen(true);
  };

  const handleRequestMaterial = () => {
    const typeText = materialType === 'both' ? 'summary and recording' : materialType;
    toast.success(`Request sent to tutor for ${typeText} access`);
    setMaterialRequestDialogOpen(false);
    setSessionForMaterial(null);
    setMaterialType('both');
  };

  const renderSession = (session: Session, showActions: boolean = false) => {
    const tutor = mockTutors.find(t => t.id === session.tutorId);
    
    return (
      <Card key={session.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={tutor?.avatar} />
                <AvatarFallback>{tutor?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{session.subject}</CardTitle>
                <CardDescription>with {tutor?.name}</CardDescription>
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
                  Join Meeting
                </a>
              </div>
            )}
          </div>
          
          {session.notes && (
            <div>
              <p className="text-sm mb-1">Notes</p>
              <p className="text-sm text-gray-600">{session.notes}</p>
            </div>
          )}

          {session.status === 'completed' && session.feedback && (
            <div className="border-t pt-4">
              <p className="text-sm mb-2">Your Feedback</p>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (session.feedback?.studentRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {session.feedback.studentComment && (
                <p className="text-sm text-gray-600">{session.feedback.studentComment}</p>
              )}
              {session.feedback.tutorProgress && (
                <div className="mt-3">
                  <p className="text-sm mb-1">Tutor's Assessment</p>
                  <p className="text-sm text-gray-600">{session.feedback.tutorProgress}</p>
                </div>
              )}
            </div>
          )}

          {showActions && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleOpenReschedule(session)}>
                <Edit className="h-4 w-4 mr-2" />
                Request Reschedule
              </Button>
              <Button variant="outline" onClick={() => handleCancelSession(session.id)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {session.status === 'completed' && (session.summary || session.recordingUrl) && (
            <div className="border-t pt-4">
              <p className="text-sm mb-2">Session Materials</p>
              <div className="space-y-2">
                {session.summary && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm mb-1">Summary</p>
                    <p className="text-sm text-gray-600">{session.summary}</p>
                  </div>
                )}
                {session.recordingUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Recording
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {session.status === 'completed' && !session.summary && !session.recordingUrl && (
            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOpenMaterialRequest(session)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Request Summary/Recording
              </Button>
            </div>
          )}

          {session.status === 'completed' && !session.feedback && (
            <div className="border-t pt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                <p className="text-sm">
                  Please share your feedback about this session to help us improve
                </p>
              </div>
              <Dialog open={selectedSession?.id === session.id} onOpenChange={(open) => !open && setSelectedSession(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedSession(session)}>
                    <Star className="h-4 w-4 mr-2" />
                    Leave Feedback
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Session Feedback</DialogTitle>
                  <DialogDescription>
                    Rate your session with {tutor?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Comments</Label>
                    <Textarea
                      placeholder="Share your experience with this session..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <Button className="w-full" onClick={handleSubmitFeedback} disabled={rating === 0}>
                    Submit Feedback
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled tutoring sessions</CardDescription>
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
          <CardTitle>Session History</CardTitle>
          <CardDescription>Your completed sessions</CardDescription>
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
              <Label>Session</Label>
              <p className="mt-1">{sessionToReschedule?.subject}</p>
              <p className="text-sm text-gray-600">
                Current: {sessionToReschedule?.date} at {sessionToReschedule?.startTime}
              </p>
            </div>
            <div>
              <Label>New Date *</Label>
              <Input
                type="date"
                value={rescheduleData.newDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>New Time *</Label>
              <Input
                type="time"
                value={rescheduleData.newTime}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
                className="mt-2"
              />
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
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSubmitRescheduleRequest}>
                Send Request
              </Button>
              <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Material Request Dialog */}
      <Dialog open={materialRequestDialogOpen} onOpenChange={setMaterialRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Session Materials</DialogTitle>
            <DialogDescription>
              Request access to the session summary and/or recording
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Session</Label>
              <p className="mt-1">{sessionForMaterial?.subject}</p>
              <p className="text-sm text-gray-600">{sessionForMaterial?.date}</p>
            </div>
            <div>
              <Label>Material Type</Label>
              <Select value={materialType} onValueChange={(value: 'summary' | 'recording' | 'both') => setMaterialType(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Only</SelectItem>
                  <SelectItem value="recording">Recording Only</SelectItem>
                  <SelectItem value="both">Both Summary & Recording</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Your tutor will be notified of this request. You'll receive a notification once they respond.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleRequestMaterial}>
                <FileText className="h-4 w-4 mr-2" />
                Send Request
              </Button>
              <Button variant="outline" onClick={() => setMaterialRequestDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
