import { useState } from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadZone } from '@/components/archive/UploadZone';
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
    level: string;
    frequency: string;
    duration: string;
    files: File[];
  }) => void;
}

export function StudyPlanForm({ onSubmit }: StudyPlanFormProps) {
  const [courseName, setCourseName] = useState('');
  const [level, setLevel] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (uploaded: File[]) => {
    setFiles(prev => [...prev, ...uploaded]);
    toast.success(`Attached ${uploaded.length} file(s)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName && level && frequency && duration) {
      onSubmit({ courseName, level, frequency, duration, files });
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
        <UploadZone onFileSelect={handleFileUpload} />
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                <FileText className="h-4 w-4" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Name */}
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Title</Label>
        <Input
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="e.g., Organic Chemistry"
        />
      </div>

      {/* Level */}
      <div className="space-y-2">
        <Label>Academic Level</Label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100 Level</SelectItem>
            <SelectItem value="200">200 Level</SelectItem>
            <SelectItem value="300">300 Level</SelectItem>
            <SelectItem value="400">400 Level</SelectItem>
            <SelectItem value="500">500 Level</SelectItem>
          </SelectContent>
        </Select>
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
        disabled={!courseName || !level || !frequency || !duration}
      >
        Generate Study Plan
      </Button>
    </form>
  );
}
