import { useState, useEffect } from 'react';
import { BookOpen, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UploadZone } from '@/components/archive/UploadZone';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



interface StudyPlanFormProps {
  onSubmit: (data: {
    group: string;
    title: string;
    level: string;
    studyFrequency: string;
    duration: string;
    startDate: Date;
    materialType: 'notes' | 'pq';
    files: File[];
  }) => void;
  isLoading?: boolean;
}

export function StudyPlanForm({ onSubmit, isLoading = false }: StudyPlanFormProps) {
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('');
  const [level, setLevel] = useState('');
  const [studyFrequency, setStudyFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [materialType, setMaterialType] = useState<'notes' | 'pq'>('notes');
  const [files, setFiles] = useState<File[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true);
      try {
        const response = await api.get('/schools/course-groups');
        console.log('Group API Response:', response);
        if (response.data.success && response.data.data?.courses) {
          setGroups(response.data.data.courses);
        } else if (response.data.success && Array.isArray(response.data.data)) {
          setGroups(response.data.data);
        } else if (Array.isArray(response.data)) {
          setGroups(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch groups', error);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  const handleFileUpload = (uploaded: File[]) => {
    setFiles(prev => [...prev, ...uploaded]);
    toast.success(`Attached ${uploaded.length} file(s)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && group && level && studyFrequency && duration && startDate) {
      onSubmit({ group, title, level, studyFrequency, duration, startDate, materialType, files });
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

      <div className="space-y-3">
        <Label className="font-semibold text-foreground text-sm">Upload Type</Label>
        <RadioGroup 
          value={materialType} 
          onValueChange={(val) => setMaterialType(val as 'notes' | 'pq')}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notes" id="r1" />
            <Label htmlFor="r1" className="cursor-pointer">Notes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pq" id="r2" />
            <Label htmlFor="r2" className="cursor-pointer">Past Question</Label>
          </div>
        </RadioGroup>
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
        <Label htmlFor="title">Course Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g., CS101: Intro to Logic" 
        />
      </div>

      <div className="space-y-2">
        <Label>Group</Label>
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loadingGroups ? "Loading groups..." : "Select group"} />
          </SelectTrigger>
          <SelectContent side="bottom">
            {groups.length > 0 ? (
              groups.map((g: any) => {
                const value = g.code || g.name || g.title || g;
                const label = (typeof g === 'object' && g.code && g.title) 
                  ? `${g.code}: ${g.title}` 
                  : (g.name || g.title || g.code || g);
                return (
                  <SelectItem key={g.id || String(value)} value={String(value)}>
                    {label}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="none" disabled>No groups available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <Label>Academic Level</Label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full">
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
        <Select value={studyFrequency} onValueChange={setStudyFrequency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="DAILY">Daily Sessions</SelectItem>
            <SelectItem value="WEEKLY">Weekly Sessions</SelectItem>
            <SelectItem value="BIWEEKLY">Bi-weekly Sessions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label>Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="1">1 Month</SelectItem>
            <SelectItem value="2">2 Months</SelectItem>
            <SelectItem value="3">3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Start Date */}
      <div className="space-y-2 flex flex-col">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={!title || !group || !level || !studyFrequency || !duration || !startDate || isLoading}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Generating Plan...
          </>
        ) : (
          "Generate Study Plan"
        )}
      </Button>
    </form>
  );
}
