import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Tutor } from '../../types';
import { mockStudents, mockSessions, mockRescheduleRequests } from '../../lib/mock-data';
import { toast } from 'sonner@2.0.3';

interface RequestsTabProps {
  tutor: Tutor;
}

export function RequestsTab({ tutor }: RequestsTabProps) {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [rescheduleRequests, setRescheduleRequests] = useState([]);

  const handleFetchData = () => {
    const tutorSessions = mockSessions.filter(s => s.tutorId === tutor.id);

    const allStudents = mockStudents;

    const relatedRequests = mockRescheduleRequests.filter(req =>
      tutorSessions.some(s => s.id === req.sessionId)
    );

    setSessions(tutorSessions);
    setStudents(allStudents);
    setRescheduleRequests(relatedRequests);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleApproveReschedule = async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/reschedule/${requestId}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve request');
  
      setRescheduleRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'approved' } : req
        )
      );
  
      toast.success('Reschedule approved!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve reschedule');
    }
  };
  
  const handleRejectReschedule = async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/reschedule/${requestId}/reject`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reject request');
  
      setRescheduleRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'rejected' } : req
        )
      );
  
      toast.error('Reschedule request rejected');
    } catch (error) {
      console.error(error);
      toast.error('Failed to reject reschedule');
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reschedule Requests</CardTitle>
          <CardDescription>Students requesting to reschedule existing sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rescheduleRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reschedule requests</p>
          ) : (
            rescheduleRequests.map(request => {
              const session = mockSessions.find(s => s.id === request.sessionId);
              const student = request.requesterRole === 'student' 
                ? mockStudents.find(s => s.id === request.requesterId)
                : null;
              
              return (
                <div key={request.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {student && (
                        <>
                          <Avatar>
                            <AvatarImage src={student?.avatar} />
                            <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{student?.name}</p>
                            <p className="text-sm text-gray-600">{session?.subject}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <Badge
                      variant={
                        request.status === 'approved'
                          ? 'default'
                          : request.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Current Schedule</p>
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-red-600" />
                          <span>{session?.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span>{session?.startTime} - {session?.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Proposed Schedule</p>
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span>{request.newDate}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>{request.newStartTime} - {request.newEndTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.reason && (
                    <div>
                      <p className="text-sm text-gray-600">Reason</p>
                      <div className="flex items-start gap-2 mt-1">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                        <p className="text-sm bg-gray-50 p-2 rounded flex-1">{request.reason}</p>
                      </div>
                    </div>
                  )}

                  {session?.status === 'open' && session.enrolledStudents && (
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        This is an open session with {session.enrolledStudents.length} enrolled student(s). 
                        Approving this reschedule will notify all enrolled students via Messages.
                      </p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleApproveReschedule(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRejectReschedule(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="py-6">
          <p className="mb-2">Important Note</p>
          <p className="text-sm text-gray-600">
            When you approve a reschedule request, all affected students will be automatically 
            notified via the messaging system with the new session details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
