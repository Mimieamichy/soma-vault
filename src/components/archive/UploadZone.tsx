import { Upload, FileText, Image, File } from 'lucide-react';

export function UploadZone() {
  return (
    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-accent/10 rounded-full">
          <Upload className="h-8 w-8 text-accent" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Drop files here or click to upload
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop your study materials
      </p>
      
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>PDF</span>
        </div>
        <div className="flex items-center gap-1">
          <File className="h-4 w-4" />
          <span>DOCX</span>
        </div>
        <div className="flex items-center gap-1">
          <Image className="h-4 w-4" />
          <span>Images</span>
        </div>
      </div>
    </div>
  );
}
