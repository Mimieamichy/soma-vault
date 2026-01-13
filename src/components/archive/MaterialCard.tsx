import { FileText, Download, Eye, FolderInput, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MaterialCardProps {
  title: string;
  type: 'pdf' | 'docx' | 'image';
  date: string;
  size: string;
}

const typeIcons = {
  pdf: '📄',
  docx: '📝',
  image: '🖼️',
};

const typeColors = {
  pdf: 'bg-red-100 text-red-700',
  docx: 'bg-blue-100 text-blue-700',
  image: 'bg-purple-100 text-purple-700',
};

export function MaterialCard({ title, type, date, size }: MaterialCardProps) {
  return (
    <div className="group bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-soft transition-all duration-200 animate-scale-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${typeColors[type]}`}>
          <span className="text-xl">{typeIcons[type]}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderInput className="h-4 w-4 mr-2" /> Move
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <h4 className="font-medium text-foreground truncate mb-1">{title}</h4>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{date}</span>
        <span>•</span>
        <span>{size}</span>
      </div>
    </div>
  );
}
