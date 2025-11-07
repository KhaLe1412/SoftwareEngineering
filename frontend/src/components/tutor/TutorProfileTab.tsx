import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tutor } from '../../types';
import { toast } from 'sonner@2.0.3';

interface TutorProfileTabProps {
  tutor: Tutor;
}

export function TutorProfileTab({ tutor }: TutorProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expertise, setExpertise] = useState(tutor.expertise);
  const [newExpertise, setNewExpertise] = useState('');

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (exp: string) => {
    setExpertise(expertise.filter(e => e !== exp));
  };

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Areas of Expertise</CardTitle>
          <CardDescription>
            Subjects and topics you can teach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {expertise.map(exp => (
              <Badge 
                key={exp} 
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => isEditing && handleRemoveExpertise(exp)}
              >
                {exp}
                {isEditing && <span className="ml-2">×</span>}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a subject or topic..."
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
              />
              <Button onClick={handleAddExpertise}>Add</Button>
            </div>
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
                {tutorSessions.filter(s => s.studentId === tutorSessions[0]?.studentId).length}
              </div>
              <p className="text-sm text-gray-600">Students Helped</p>
            </div>
          </div>
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
    </div>
  );
}

// Mock data reference
const tutorSessions = [{ studentId: 's1' }]; // This would come from props in real implementation
