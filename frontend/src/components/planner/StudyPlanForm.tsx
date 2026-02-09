import { useState, useEffect } from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadZone } from '@/components/archive/UploadZone';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DEPARTMENTS = [
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemistry',
  'Geology',
  'Physics',
  'Mathematics',
  'Microbiology',
  'Biochemistry',
  'Medicine',
  'Pharmacy',
  'Law',
  'Economics',
  'Accounting',
  'Political Science',
  'Mass Communication',
  'Architecture',
  'Theatre Arts',
];

interface StudyPlanFormProps {
  onSubmit: (data: {
    department: string;
    courseName: string;
    level: string;
    frequency: string;
    duration: string;
    files: File[];
  }) => void;
}

export function StudyPlanForm({ onSubmit }: StudyPlanFormProps) {
  const [courseName, setCourseName] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await api.get('/schools/courses');
        if (response.data.success && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
        } else if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFileUpload = (uploaded: File[]) => {
    setFiles(prev => [...prev, ...uploaded]);
    toast.success(`Attached ${uploaded.length} file(s)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName && department && level && frequency && duration) {
      onSubmit({ department, courseName, level, frequency, duration, files });
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
        <Select value={courseName} onValueChange={setCourseName}>
          <SelectTrigger id="courseName">
            <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Select Course"} />
          </SelectTrigger>
          <SelectContent side="bottom">
            {courses.length > 0 ? (
              courses.map((c: any) => {
                const value = c.code || c.name || c.title || c;
                const label = (typeof c === 'object' && c.code && c.title) 
                  ? `${c.code}: ${c.title}` 
                  : (c.name || c.title || c.code || c);
                return (
                  <SelectItem key={c.id || String(value)} value={String(value)}>
                    {label}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="none" disabled>No courses available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Department</Label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent side="bottom">
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <Label>Academic Level</Label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent side="bottom">
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
          <SelectContent side="bottom">
            <SelectItem value="daily">Daily Sessions</SelectItem>
            <SelectItem value="weekly">Weekly Sessions</SelectItem>
            <SelectItem value="bi-weekly">Bi-weekly Sessions</SelectItem>
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
          <SelectContent side="bottom">
            <SelectItem value="1">1 Month</SelectItem>
            <SelectItem value="2">2 Months</SelectItem>
            <SelectItem value="3">3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={!courseName || !department || !level || !frequency || !duration}
      >
        Generate Study Plan
      </Button>
    </form>
  );
}
