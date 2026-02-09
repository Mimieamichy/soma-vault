import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadZone } from './UploadZone';

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

export type UploadType = 'materials' | 'pq';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  level: string;
  setLevel: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  courseName: string;
  setCourseName: (val: string) => void;
  uploadType: UploadType;
  setUploadType: (val: UploadType) => void;
  onFileSelect: (files: File[]) => void;
}

export function UploadModal({
  open,
  onOpenChange,
  onSubmit,
  level,
  setLevel,
  department,
  setDepartment,
  courseName,
  setCourseName,
  uploadType,
  setUploadType,
  onFileSelect,
}: UploadModalProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[85vh] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Upload Material</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add documents to the Soma Vault 
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="space-y-3 pt-4">
            <Label className="font-semibold text-foreground text-sm">Upload Type</Label>
            <RadioGroup 
              value={uploadType} 
              onValueChange={(val) => setUploadType(val as UploadType)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="materials" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">Materials</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pq" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">Past Question</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-foreground text-sm">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Department" />
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
            <div className="space-y-2">
              <Label className="font-semibold text-foreground text-sm">Course Title</Label>
              <Select value={courseName} onValueChange={setCourseName}>
                <SelectTrigger className="h-10">
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
              <Label className="font-semibold text-foreground text-sm">Academic Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Level" />
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
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-foreground text-sm">File Attachment</Label>
            <UploadZone multiple={false} onFileSelect={onFileSelect} />
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground m-6 gap-2 px-6" 
              onClick={onSubmit}
            >
              Upload <Zap className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
