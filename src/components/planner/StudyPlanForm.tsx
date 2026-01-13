import { useState } from 'react';
import { Upload, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StudyPlanFormProps {
  onSubmit: (data: {
    courseName: string;
    frequency: string;
    duration: string;
  }) => void;
}

export function StudyPlanForm({ onSubmit }: StudyPlanFormProps) {
  const [courseName, setCourseName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName && frequency && duration) {
      onSubmit({ courseName, frequency, duration });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border shadow-card space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-accent/10 rounded-lg">
          <BookOpen className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Create Study Plan</h3>
          <p className="text-sm text-muted-foreground">Generate a personalized study schedule</p>
        </div>
      </div>

      {/* Upload Material */}
      <div className="space-y-2">
        <Label>Study Material</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop files or click to upload
          </p>
        </div>
      </div>

      {/* Course Name */}
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Name</Label>
        <Input
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="e.g., Organic Chemistry"
        />
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label>Study Frequency</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly Sessions</SelectItem>
            <SelectItem value="daily">Daily Sessions</SelectItem>
            <SelectItem value="weekly">Weekly Sessions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label>Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Month</SelectItem>
            <SelectItem value="2">2 Months</SelectItem>
            <SelectItem value="3">3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={!courseName || !frequency || !duration}
      >
        Generate Study Plan
      </Button>
    </form>
  );
}
