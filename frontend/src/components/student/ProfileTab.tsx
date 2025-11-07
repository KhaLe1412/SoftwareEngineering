import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Student } from '../../types';
import { toast } from 'sonner@2.0.3';

interface ProfileTabProps {
  student: Student;
}

export function ProfileTab({ student }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [supportNeeds, setSupportNeeds] = useState(student.supportNeeds);
  const [newNeed, setNewNeed] = useState('');

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleAddNeed = () => {
    if (newNeed.trim() && !supportNeeds.includes(newNeed.trim())) {
      setSupportNeeds([...supportNeeds, newNeed.trim()]);
      setNewNeed('');
    }
  };

  const handleRemoveNeed = (need: string) => {
    setSupportNeeds(supportNeeds.filter(n => n !== need));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile and preferences</CardDescription>
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
                value={student.name} 
                disabled={!isEditing}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Student ID</Label>
              <Input 
                value={student.studentId} 
                disabled
                className="mt-2"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={student.email} 
                disabled={!isEditing}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input 
                value={student.department} 
                disabled
                className="mt-2"
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input 
                value={student.year} 
                type="number"
                disabled
                className="mt-2"
              />
            </div>
            <div>
              <Label>Current GPA</Label>
              <Input 
                value={student.gpa.toFixed(2)} 
                disabled
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Needs</CardTitle>
          <CardDescription>
            Subjects and topics where you need tutoring assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {supportNeeds.map(need => (
              <Badge 
                key={need} 
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => isEditing && handleRemoveNeed(need)}
              >
                {need}
                {isEditing && <span className="ml-2">×</span>}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a subject or topic..."
                value={newNeed}
                onChange={(e) => setNewNeed(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddNeed()}
              />
              <Button onClick={handleAddNeed}>Add</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription>Your tutoring program statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">12</div>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">8</div>
              <p className="text-sm text-gray-600">Hours of Tutoring</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">4.5</div>
              <p className="text-sm text-gray-600">Avg. Session Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-6">
          <p className="mb-2">Training Credits Earned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl">15</span>
            <span className="text-gray-600">/ 20 credits required for certification</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Keep attending sessions to earn more training credits towards scholarships and academic recognition!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
