import { Download, Eye, MoreVertical, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MaterialCardProps {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'image';
  date: string;
  size: string;
  onPreview?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export function MaterialCard({ title, type, date, size, onPreview, onDownload, onDelete }: MaterialCardProps) {
  return (
    <div className="group relative">
      <div className="flex flex-col items-center gap-3 p-4 rounded-xl border transition-all hover:scale-105 aspect-square justify-center text-center bg-card border-border hover:bg-accent/5 hover:border-accent/50 shadow-sm">
        {type === 'image' ? (
          <ImageIcon className="h-12 w-12 shrink-0 text-purple-500/80 group-hover:text-purple-600 transition-colors" />
        ) : (
          <FileText
            className={
              type === 'pdf'
                ? 'h-12 w-12 shrink-0 text-red-500/80 group-hover:text-red-600 transition-colors'
                : 'h-12 w-12 shrink-0 text-blue-500/80 group-hover:text-blue-600 transition-colors'
            }
          />
        )}
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-sm font-medium truncate w-full" title={title}>
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase mt-1">
            {size} • {date}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" /> Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
