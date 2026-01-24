import { useRef, useState } from 'react';
import { Upload, FileText, File, FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface UploadZoneProps {
  onFileSelect?: (files: File[]) => void;
  multiple?: boolean;
}

const isAllowedFile = (file: File) => {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  const byExt = name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx');
  const byMime =
    type === 'application/pdf' ||
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return byExt || byMime;
};

export function UploadZone({ onFileSelect, multiple = true }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const processFiles = (list: FileList) => {
    const files = Array.from(list);
    const acceptedAll = files.filter(isAllowedFile);
    const accepted = multiple ? acceptedAll : acceptedAll.slice(0, 1);
    const rejectedCount = files.length - accepted.length;

    if (accepted.length === 0) {
      toast.error('Only PDF and Word (.doc, .docx) files are allowed');
      return;
    }

    if (rejectedCount > 0) {
      toast.warning(`${rejectedCount} file(s) were rejected. Only PDF and Word allowed.`);
    }

    setSelectedFileNames(accepted.map(f => f.name));
    onFileSelect?.(accepted);
    if (!onFileSelect) {
      toast.success(`Selected ${accepted.length} file(s)`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer bg-card ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple={multiple}
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
      />
      
      {selectedFileNames.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-4">
           <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Selected:</p>
          {selectedFileNames.map((name, i) => (
            <p key={i} className="text-sm text-muted-foreground">{name}</p>
          ))}
          <p className="text-xs text-accent mt-2 font-medium">Click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2">
          <div className="h-12 w-12 bg-accent/10 dark:bg-accent/20 rounded-full flex items-center justify-center mb-4">
            <FileUp className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            <span className="hidden sm:inline">Drag and drop your files here or </span>
            <span className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent sm:no-underline sm:text-accent">
              <span className="sm:hidden">Select files</span>
              <span className="hidden sm:inline">click to browse</span>
            </span>
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PDF</span>
            <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground uppercase tracking-wider">DOCX</span>
          </div>
          
          <p className="text-xs text-muted-foreground">Max file size: 25MB</p>
        </div>
      )}
    </div>
  );
}
