import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const mockData = {
  materials: [
    {
      id: 'm-ful',
      name: 'Federal University of Lafia',
      children: [
        {
          id: 'm-ful-cs',
          name: 'Computer Science',
          children: [
            {
              id: 'm-ful-cs-100',
              name: '100 Level',
              children: [],
            },
          ],
        },
        {
          id: 'm-ful-slt',
          name: 'SLT',
          children: [],
        },
      ],
    },
    {
      id: 'm-unizik',
      name: 'Nnamdi Azikiwe University',
      children: [
        {
          id: 'm-unizik-music',
          name: 'Music',
          children: [
            {
              id: 'm-unizik-music-200',
              name: '200 Level',
              children: [],
            },
          ],
        },
        {
          id: 'm-unizik-ta',
          name: 'Theatre Arts',
          children: [],
        },
      ],
    },
  ],
  pq: [
    {
      id: 'pq-ful',
      name: 'Federal University of Lafia',
      children: [
        {
          id: 'pq-ful-cs',
          name: 'Computer Science',
          children: [
            {
              id: 'pq-ful-cs-100',
              name: '100 Level',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

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
  type: 'materials' | 'pq';
}

export function FolderTree({ onSelect, selectedId, type }: FolderTreeProps) {
  const folders = mockData[type];

  return (
    <div className="space-y-1">
      {folders.map((folder) => (
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
