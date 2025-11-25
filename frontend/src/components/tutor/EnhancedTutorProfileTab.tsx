import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Search, Calendar, Clock, MapPin, Video, Lock, Edit, Star, FileText } from 'lucide-react';
import { Tutor } from '../../types';
import { mockSessions, mockStudents } from '../../lib/mock-data';
import { toast } from 'sonner@2.0.3';

interface EnhancedTutorProfileTabProps {
  tutor: Tutor;
}

// Danh sách các môn học có sẵn
const AVAILABLE_SUBJECTS = [
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Web Development',
  'Machine Learning',
  'Circuit Analysis',
  'Digital Electronics',
  'Signal Processing',
  'Control Systems',
  'Calculus',
  'Linear Algebra',
  'Differential Equations',
  'Probability and Statistics',
  'Physics',
  'Chemistry',
  'Programming Fundamentals',
  'Object-Oriented Programming'
];

interface SessionReview {
  sessionId: string;
  rating?: number;
  summary?: string;
  recordingUrl?: string;
}

export function EnhancedTutorProfileTab({ tutor }: EnhancedTutorProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expertise, setExpertise] = useState(tutor.expertise);
  const [showAddExpertiseDialog, setShowAddExpertiseDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentReviewSessionId, setCurrentReviewSessionId] = useState<string | null>(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State to store session reviews
  const [sessionReviews, setSessionReviews] = useState<Record<string, SessionReview>>({
    'ses2': {
      sessionId: 'ses2',
      rating: 5,
      summary: 'Excellent session. Student showed great improvement in understanding dynamic programming concepts.',
      recordingUrl: 'https://example.com/recordings/session-ses2.mp4'
    },
    'ses4': {
      sessionId: 'ses4',
      rating: 4,
      summary: 'Good progress on SQL joins and database normalization. Student came well-prepared.',
      recordingUrl: 'https://example.com/recordings/session-ses4.mp4'
    }
  });

  const [reviewData, setReviewData] = useState({
    rating: 5,
    summary: '',
    recordingUrl: ''
  });

  // Load tutor session feedback from backend so tutor's feedback persists across navigation
  useEffect(() => {
    loadAllTutorFeedbacks();
  }, [tutor.id]);

  const loadAllTutorFeedbacks = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/sessions?tutorId=${tutor.id}&status=completed`);
      if (!res.ok) return;
      const data = await res.json(); // [{ session, students, tutor }]
      const map: Record<string, SessionReview> = {};
      data.forEach((item: any) => {
        const session = item.session;
        const fb = session.feedback;
        if (fb) {
          map[session.id] = {
            sessionId: session.id,
            rating: fb.studentRating ?? 5,
            summary: fb.tutorProgress ?? '',
            recordingUrl: fb.tutorNotes ?? ''
          };
        }
      });
      setSessionReviews(prev => ({ ...prev, ...map }));
    } catch (error) {
      console.error('loadAllTutorFeedbacks error', error);
    }
  };

  const tutorSessions = mockSessions.filter(s => s.tutorId === tutor.id);
  const completedSessions = tutorSessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => {
      // Sort by date descending (most recent first)
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      // If same date, sort by start time descending
      return b.startTime.localeCompare(a.startTime);
    });

  // Filter completed sessions by search query
  const filteredSessions = completedSessions.filter(session => {
    const student = mockStudents.find(s => session.enrolledStudents.includes(s.id));
    const searchLower = searchQuery.toLowerCase();
    return (
      session.subject.toLowerCase().includes(searchLower) ||
      session.date.includes(searchLower) ||
      student?.name.toLowerCase().includes(searchLower) ||
      student?.studentId.toLowerCase().includes(searchLower)
    );
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleAddExpertise = () => {
    if (selectedSubject && !expertise.includes(selectedSubject)) {
      setExpertise([...expertise, selectedSubject]);
      toast.success(`Added ${selectedSubject} to your expertise`);
      setShowAddExpertiseDialog(false);
      setSelectedSubject('');
    }
  };

  const handleRemoveExpertise = (exp: string) => {
    setExpertise(expertise.filter(e => e !== exp));
    toast.success(`Removed ${exp} from your expertise`);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    toast.success('Password changed successfully!');
    setChangePasswordDialogOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleOpenReviewDialog = (sessionId: string) => {
    setCurrentReviewSessionId(sessionId);
    const existingReview = sessionReviews[sessionId];
    const session = mockSessions.find(s => s.id === sessionId);
    if (existingReview) {
      const reviewDataToSet = {
        rating: existingReview.rating || 5,
        summary: existingReview.summary || '',
        recordingUrl: existingReview.recordingUrl || session?.recordingUrl || ''
      };
      console.log('Opening dialog with existing review:', reviewDataToSet);
      setReviewData(reviewDataToSet);
    } else {
      const reviewDataToSet = {
        rating: 5,
        summary: '',
        recordingUrl: session?.recordingUrl || ''
      };
      console.log('Opening dialog with default review:', reviewDataToSet);
      setReviewData(reviewDataToSet);
    }
    setReviewDialogOpen(true);
  };

  const handleSaveReview = () => {
    if (!currentReviewSessionId) return;

    if (!reviewData.summary.trim()) {
      toast.error('Please provide a summary');
      return;
    }

    console.log('Tutor saving review with data:', reviewData);

    (async () => {
      try {
        const payload = {
          studentRating: reviewData.rating,
          tutorProgress: reviewData.summary,
          tutorNotes: reviewData.recordingUrl
        };
        console.log('Tutor feedback payload:', payload);
        const res = await fetch(`http://localhost:5001/api/sessions/${currentReviewSessionId}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          toast.error('Failed to save feedback');
          return;
        }

        // refresh feedbacks from backend
        await loadAllTutorFeedbacks();

        toast.success('Session review saved successfully!');
        setReviewDialogOpen(false);
        setCurrentReviewSessionId(null);
      } catch (error) {
        console.error('save tutor review error', error);
        toast.error('Failed to save feedback');
      }
    })();
  };

  // Filter available subjects to exclude already added ones
  const availableToAdd = AVAILABLE_SUBJECTS.filter(subject => !expertise.includes(subject));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tutor Profile</CardTitle>
              <CardDescription>Manage your professional information</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input 
                value={tutor.name} 
                disabled={!isEditing}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Tutor ID</Label>
              <Input 
                value={tutor.tutorId} 
                disabled
                className="mt-2"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={tutor.email} 
                disabled={!isEditing}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input 
                value={tutor.department} 
                disabled
                className="mt-2"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => setChangePasswordDialogOpen(true)} variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Areas of Expertise</CardTitle>
              <CardDescription>Subjects and topics you can teach</CardDescription>
            </div>
            {isEditing && (
              <Dialog open={showAddExpertiseDialog} onOpenChange={setShowAddExpertiseDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">Add Subject</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Area of Expertise</DialogTitle>
                    <DialogDescription>Select a subject you can teach</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableToAdd.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddExpertiseDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddExpertise}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {expertise.length === 0 ? (
              <p className="text-sm text-gray-500">No expertise added yet</p>
            ) : (
              expertise.map(exp => (
                <Badge 
                  key={exp} 
                  variant="secondary"
                  className={isEditing ? "cursor-pointer hover:bg-red-100" : ""}
                  onClick={() => isEditing && handleRemoveExpertise(exp)}
                >
                  {exp}
                  {isEditing && <span className="ml-2">×</span>}
                </Badge>
              ))
            )}
          </div>
          {isEditing && (
            <p className="text-sm text-gray-600">Click on a badge to remove it, or click "Add Subject" to add more</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">{tutor.totalSessions}</div>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">{tutor.rating}</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">
                {new Set(tutorSessions.map(s => s.enrolledStudents)).size}
              </div>
              <p className="text-sm text-gray-600">Students Helped</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>View and review your completed sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject, student name, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchQuery ? 'No sessions found matching your search' : 'No completed sessions yet'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map(session => {
                const enrolledStudents = mockStudents.filter(s => session.enrolledStudents.includes(s.id));
                const review = sessionReviews[session.id];
                
                return (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p>{session.subject}</p>
                        <p className="text-sm text-gray-600">
                          {enrolledStudents.map(s => `${s.name} (${s.studentId})`).join(', ')}
                        </p>
                      </div>
                      <Badge>{session.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{session.startTime} - {session.endTime}</span>
                      </div>
                      {session.type === 'in-person' && session.location && (
                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                          <MapPin className="h-4 w-4" />
                          <span>{session.location}</span>
                        </div>
                      )}
                    </div>

                    {review && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">Your Rating: {review.rating}/5</span>
                        </div>
                        {review.summary && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">Session Summary:</p>
                            <p className="text-sm">{review.summary}</p>
                          </div>
                        )}
                        {review.recordingUrl && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Recording URL:</p>
                            <a href={review.recordingUrl} className="text-sm text-blue-600 hover:underline break-all">
                              {review.recordingUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {session.reviews && session.reviews.length > 0 && (
                      <div className="pt-3 border-t space-y-3 mb-3">
                        <p className="text-sm">Student Reviews:</p>
                        {session.reviews.map((studentReview, idx) => {
                          const student = mockStudents.find(s => s.id === studentReview.studentId);
                          return (
                            <div key={idx} className="bg-gray-50 rounded p-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm">{student?.name}</p>
                                <span className="text-sm">{studentReview.rating}/5 ⭐</span>
                              </div>
                              <p className="text-sm text-gray-600">{studentReview.comment}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(studentReview.submittedAt).toLocaleString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenReviewDialog(session.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {review ? 'Edit Summary & Recording' : 'Add Summary & Recording'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-6">
          <p className="mb-2">Tutor Recognition</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl">Outstanding Tutor</span>
          </div>
          <p className="text-sm text-gray-600">
            Your excellent performance and student feedback have earned you recognition from 
            the Office of Academic Affairs. Keep up the great work!
          </p>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Summary & Recording</DialogTitle>
            <DialogDescription>Add or edit your summary and recording link for this session</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating (1-5)</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1,2,3,4,5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      console.log('Tutor star clicked:', rating, 'prev rating:', reviewData.rating);
                      setReviewData(prev => ({ ...prev, rating })); 
                    }}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        rating <= reviewData.rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">{reviewData.rating}/5</span>
              </div>
            </div>
            <div>
              <Label>Session Summary *</Label>
              <Textarea
                value={reviewData.summary}
                onChange={(e) => setReviewData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Describe what was covered, student's progress, and any recommendations..."
                className="mt-2"
                rows={5}
              />
            </div>
            <div>
              <Label>Recording URL (Optional)</Label>
              <Input
                value={reviewData.recordingUrl}
                onChange={(e) => setReviewData(prev => ({ ...prev, recordingUrl: e.target.value }))}
                placeholder="https://example.com/recordings/session.mp4"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a link to the recording of this session
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReview}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="mt-2"
              />
            </div>
            <p className="text-sm text-gray-600">Password must be at least 6 characters long</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
