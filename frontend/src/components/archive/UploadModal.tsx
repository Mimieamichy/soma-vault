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
import { Input } from '@/components/ui/input';
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


  

export type UploadType = 'notes' | 'pq';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  level: string;
  setLevel: (val: string) => void;
  group: string;
  setGroup: (val: string) => void;
  courseName: string;
  setCourseName: (val: string) => void;
  materialType: UploadType;
  setMaterialType: (val: UploadType) => void;
  onFileSelect: (files: File[]) => void;
  isLoading?: boolean;
}

export function UploadModal({
  open,
  onOpenChange,
  onSubmit,
  level,
  setLevel,
  group,
  setGroup,
  courseName,
  setCourseName,
  materialType,
  setMaterialType,
  onFileSelect,
  isLoading = false,
}: UploadModalProps) {
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
              value={materialType} 
              onValueChange={(val) => setMaterialType(val as UploadType)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-foreground text-sm">Group</Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="h-10 w-full mb-2">
                  <SelectValue placeholder={loadingGroups ? "Loading groups..." : "Select Group"} />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-[200px]">
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
            <div className="space-y-2">
              <Label className="font-semibold text-foreground text-sm">Course Title</Label>
              <Input 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)} 
                placeholder="e.g., CS101: Intro to Logic"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-foreground text-sm">Academic Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-[200px]">
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
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"} <Zap className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
