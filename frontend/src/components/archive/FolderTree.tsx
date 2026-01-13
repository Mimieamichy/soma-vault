import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const mockFolders: FolderNode[] = [
  {
    id: '1',
    name: 'Science',
    children: [
      {
        id: '1-1',
        name: 'Chemistry',
        children: [
          { id: '1-1-1', name: 'Organic Chemistry' },
          { id: '1-1-2', name: 'Inorganic Chemistry' },
        ],
      },
      {
        id: '1-2',
        name: 'Physics',
        children: [
          { id: '1-2-1', name: 'Mechanics' },
          { id: '1-2-2', name: 'Thermodynamics' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Mathematics',
    children: [
      { id: '2-1', name: 'Calculus' },
      { id: '2-2', name: 'Linear Algebra' },
      { id: '2-3', name: 'Statistics' },
    ],
  },
  {
    id: '3',
    name: 'Computer Science',
    children: [
      { id: '3-1', name: 'Data Structures' },
      { id: '3-2', name: 'Algorithms' },
    ],
  },
];

interface FolderItemProps {
  folder: FolderNode;
  level: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function FolderItem({ folder, level, selectedId, onSelect }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedId === folder.id;

  return (
    <div>
      <button
        onClick={() => {
          onSelect(folder.id);
          if (hasChildren) setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-colors text-left",
          isSelected 
            ? "bg-accent/10 text-accent" 
            : "hover:bg-muted text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}
        {isOpen ? (
          <FolderOpen className="h-4 w-4 flex-shrink-0 text-accent" />
        ) : (
          <Folder className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="text-sm font-medium truncate">{folder.name}</span>
      </button>
      
      {hasChildren && isOpen && (
        <div className="animate-fade-in">
          {folder.children!.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function FolderTree({ onSelect, selectedId }: FolderTreeProps) {
  return (
    <div className="space-y-1">
      {mockFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
