import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, Clock, MapPin, Video, Users, UserPlus } from 'lucide-react';
import { mockOpenSessions, mockTutors } from '../../lib/mock-data';
import { Student } from '../../types';
import { toast } from 'sonner@2.0.3';

interface OpenSessionsTabProps {
  student: Student;
}

export function OpenSessionsTab({ student }: OpenSessionsTabProps) {
  const handleJoinSession = (sessionId: string, sessionTitle: string) => {
    toast.success(`Joined session: ${sessionTitle}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Group Sessions</CardTitle>
          <CardDescription>
            Join group tutoring sessions created by tutors
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockOpenSessions.map(session => {
          const tutor = mockTutors.find(t => t.id === session.tutorId);
          const isEnrolled = session.enrolledStudents?.includes(student.id);
          const spotsLeft = (session.maxStudents || 0) - (session.enrolledStudents?.length || 0);
          
          return (
            <Card key={session.id}>
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
                  {session.type === 'online' && session.meetingLink && (
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

                <div className="flex items-center gap-2">
                  {isEnrolled ? (
                    <Badge className="bg-green-100 text-green-800">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Enrolled
                    </Badge>
                  ) : spotsLeft > 0 ? (
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinSession(session.id, session.subject)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Session ({spotsLeft} spots left)
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      Session Full
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mockOpenSessions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No open sessions available at the moment
          </CardContent>
        </Card>
      )}
    </div>
  );
}
