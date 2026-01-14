import { Zap } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadZone } from './UploadZone';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  level: string;
  setLevel: (val: string) => void;
  courseName: string;
  setCourseName: (val: string) => void;
  onFileSelect: (files: File[]) => void;
}

export function UploadModal({
  open,
  onOpenChange,
  onSubmit,
  level,
  setLevel,
  courseName,
  setCourseName,
  onFileSelect,
}: UploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Upload Material</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add documents to the Study Vault 
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6">
          <div className="grid grid-cols-2 gap-6 pt-4">
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
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Level" />
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
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-foreground text-sm">File Attachment</Label>
            <UploadZone multiple={false} onFileSelect={onFileSelect} />
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-6" 
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
