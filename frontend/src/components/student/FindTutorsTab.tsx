import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Star, Calendar, MapPin, Video, Search, Sparkles, Send } from 'lucide-react';
import { mockTutors } from '../../lib/mock-data';
import { Student, Tutor } from '../../types';
import { toast } from 'sonner@2.0.3';

interface FindTutorsTabProps {
  student: Student;
}

export function FindTutorsTab({ student }: FindTutorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showMatchingDialog, setShowMatchingDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [requestDetails, setRequestDetails] = useState({
    subject: '',
    date: '',
    time: '',
    type: 'online' as 'in-person' | 'online',
    message: ''
  });
  const [matchingPreferences, setMatchingPreferences] = useState({
    subjects: [] as string[],
    type: 'both' as 'in-person' | 'online' | 'both',
    preferredDays: [] as number[]
  });

  const allSubjects = Array.from(new Set(mockTutors.flatMap(t => t.expertise)));

  const filteredTutors = mockTutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || tutor.expertise.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const handleBookSession = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setRequestDetails({
      subject: tutor.expertise[0] || '',
      date: '',
      time: '',
      type: 'online',
      message: ''
    });
    setShowRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    if (!requestDetails.subject || !requestDetails.date || !requestDetails.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    // To do: Send POST to backend to create a session request
    toast.success(`Session request sent to ${selectedTutor?.name}!`);
    setShowRequestDialog(false);
    setSelectedTutor(null);
  };

  const handleAutoMatch = () => {
    toast.success('Auto-matching initiated! We will notify you when a tutor is matched.');
    setShowMatchingDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Tutor</CardTitle>
          <CardDescription>Search by name or subject, or use auto-matching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tutors or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {allSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={showMatchingDialog} onOpenChange={setShowMatchingDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto-Match
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Automated Tutor Matching</DialogTitle>
                  <DialogDescription>
                    Tell us your preferences and we'll find the best tutor for you
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Subjects You Need Help With</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {student.supportNeeds.map(need => (
                        <Badge key={need} variant="secondary">{need}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Preferred Session Type</Label>
                    <Select defaultValue="both">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both In-Person & Online</SelectItem>
                        <SelectItem value="in-person">In-Person Only</SelectItem>
                        <SelectItem value="online">Online Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleAutoMatch}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Find My Perfect Match
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tutors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTutors.map(tutor => (
          <Card key={tutor.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={tutor.avatar} />
                  <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle>{tutor.name}</CardTitle>
                  <CardDescription>{tutor.department}</CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1">{tutor.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{tutor.totalSessions} sessions</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.expertise.map(exp => (
                    <Badge key={exp} variant="secondary">{exp}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">Availability</p>
                <div className="space-y-1">
                  {tutor.availability.map(avail => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={avail.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{days[avail.dayOfWeek]}: {avail.startTime} - {avail.endTime}</span>
                        {avail.type === 'in-person' && <MapPin className="h-3 w-3" />}
                        {avail.type === 'online' && <Video className="h-3 w-3" />}
                        {avail.type === 'both' && (
                          <>
                            <MapPin className="h-3 w-3" />
                            <Video className="h-3 w-3" />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button className="w-full" onClick={() => handleBookSession(tutor)}>
                Request Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No tutors found matching your criteria
          </CardContent>
        </Card>
      )}

      {/* Session Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Session with {selectedTutor?.name}</DialogTitle>
            <DialogDescription>
              Choose your preferred subject, date, and time
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Select 
                value={requestDetails.subject} 
                onValueChange={(v) => setRequestDetails({...requestDetails, subject: v})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTutor?.expertise.map(exp => (
                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred Date</Label>
              <Input 
                type="date" 
                className="mt-2"
                value={requestDetails.date}
                onChange={(e) => setRequestDetails({...requestDetails, date: e.target.value})}
              />
            </div>
            <div>
              <Label>Preferred Time</Label>
              <Select 
                value={requestDetails.time} 
                onValueChange={(v) => setRequestDetails({...requestDetails, time: v})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTutor?.availability.map(avail => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <SelectItem key={avail.id} value={`${days[avail.dayOfWeek]} ${avail.startTime}`}>
                        {days[avail.dayOfWeek]}: {avail.startTime} - {avail.endTime}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Session Type</Label>
              <Select 
                value={requestDetails.type} 
                onValueChange={(v: any) => setRequestDetails({...requestDetails, type: v})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Additional Message (Optional)</Label>
              <Textarea
                placeholder="Any specific topics or questions you'd like to cover..."
                value={requestDetails.message}
                onChange={(e) => setRequestDetails({...requestDetails, message: e.target.value})}
                rows={3}
                className="mt-2"
              />
            </div>
            <Button className="w-full" onClick={handleSubmitRequest}>
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
