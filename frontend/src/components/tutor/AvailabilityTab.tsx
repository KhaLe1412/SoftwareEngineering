import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, Clock, MapPin, Video, Plus, Trash } from 'lucide-react';
import { Tutor, Availability } from '../../types';
import { toast } from 'sonner@2.0.3';

interface AvailabilityTabProps {
  tutor: Tutor;
}

export function AvailabilityTab({ tutor }: AvailabilityTabProps) {
  const [availability, setAvailability] = useState(tutor.availability);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00',
    type: 'both' as 'in-person' | 'online' | 'both'
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddSlot = () => {
    const slot: Availability = {
      id: `a${Date.now()}`,
      ...newSlot
    };
    setAvailability([...availability, slot]);
    toast.success('Availability slot added');
    setShowAddDialog(false);
    setNewSlot({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      type: 'both'
    });
  };

  const handleRemoveSlot = (id: string) => {
    setAvailability(availability.filter(a => a.id !== id));
    toast.success('Availability slot removed');
  };

  const groupedAvailability = availability.reduce((acc, slot) => {
    const day = slot.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<number, Availability[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Your Availability</CardTitle>
              <CardDescription>
                Set when you're available for tutoring sessions
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Availability Slot</DialogTitle>
                  <DialogDescription>
                    Set a new time when you're available for tutoring
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Day of Week</Label>
                    <Select 
                      value={newSlot.dayOfWeek.toString()} 
                      onValueChange={(v) => setNewSlot({...newSlot, dayOfWeek: parseInt(v)})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Select 
                        value={newSlot.startTime} 
                        onValueChange={(v) => setNewSlot({...newSlot, startTime: v})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Select 
                        value={newSlot.endTime} 
                        onValueChange={(v) => setNewSlot({...newSlot, endTime: v})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Session Type</Label>
                    <Select 
                      value={newSlot.type} 
                      onValueChange={(v: any) => setNewSlot({...newSlot, type: v})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both In-Person & Online</SelectItem>
                        <SelectItem value="in-person">In-Person Only</SelectItem>
                        <SelectItem value="online">Online Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleAddSlot}>
                    Add Availability
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day, dayIdx) => {
          const slots = groupedAvailability[dayIdx] || [];
          return (
            <Card key={dayIdx}>
              <CardHeader>
                <CardTitle className="text-base">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {slots.length === 0 ? (
                  <p className="text-sm text-gray-500">No availability</p>
                ) : (
                  slots.map(slot => (
                    <div key={slot.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        {slot.type === 'in-person' && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            In-Person
                          </Badge>
                        )}
                        {slot.type === 'online' && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        )}
                        {slot.type === 'both' && (
                          <>
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              In-Person
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Video className="h-3 w-3 mr-1" />
                              Online
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <p className="mb-2">Automatic Notifications</p>
          <p className="text-sm text-gray-600">
            Students will be notified of your availability changes. Session requests that match 
            your availability will be sent to you for approval.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
