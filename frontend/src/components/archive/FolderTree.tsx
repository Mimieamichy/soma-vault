import { useState, useMemo } from 'react';
import { Folder, ArrowLeft, FileText, Image as ImageIcon, Eye, Download, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaterialItem } from '@/data/mockData';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
  type?: 'school' | 'course' | 'level';
}

const SCHOOLS = ['Fulafia', 'Unizik', 'Unijos', 'Uniben', 'Esut', 'Uniport'];
const COURSES = [
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
  'Theatre Arts'
];
const LEVELS = ['100L', '200L', '300L', '400L', '500L'];

const generateFolderStructure = (prefix: string): FolderNode[] => {
  return SCHOOLS.map((school) => {
    const schoolId = `${prefix}-${school.toLowerCase().replace(/\s+/g, '-')}`;
    return {
      id: schoolId,
      name: school,
      type: 'school',
      children: COURSES.map((course) => {
        const courseId = `${schoolId}-${course.toLowerCase().replace(/\s+/g, '-')}`;
        return {
          id: courseId,
          name: course,
          type: 'course',
          children: LEVELS.map((level) => {
            const levelId = `${courseId}-${level.toLowerCase().replace(/\s+/g, '-')}`;
            return {
              id: levelId,
              name: level,
              type: 'level',
              children: [],
            };
          }),
        };
      }),
    };
  });
};

const DATA = {
  materials: generateFolderStructure('m'),
  pq: generateFolderStructure('pq'),
};

interface FolderTreeProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
  type: 'materials' | 'pq';
  materials?: MaterialItem[];
  onMaterialClick?: (material: MaterialItem) => void;
}

export function FolderTree({ onSelect, selectedId, type, materials = [], onMaterialClick }: FolderTreeProps) {
  // Navigation stack to track current path
  const [navPath, setNavPath] = useState<FolderNode[]>([]);
  const [propertiesMaterial, setPropertiesMaterial] = useState<MaterialItem | null>(null);

  const rootFolders = useMemo(() => DATA[type], [type]);

  const currentFolder = navPath.length > 0 ? navPath[navPath.length - 1] : null;

  const currentFolders = useMemo(() => {
    if (!currentFolder) return rootFolders;
    return currentFolder.children || [];
  }, [currentFolder, rootFolders]);

  const currentMaterials = useMemo(() => {
    if (currentFolder?.type === 'level') {
      return materials.filter(m => m.folderId === currentFolder.id);
    }
    return [];
  }, [currentFolder, materials]);

  const handleFolderClick = (folder: FolderNode) => {
    if (folder.children && folder.children.length > 0) {
      setNavPath([...navPath, folder]);
    } else if (folder.type === 'level') {
      // Navigate into the level to show files
      setNavPath([...navPath, folder]);
      onSelect(folder.id);
    }
  };

  const handleBack = () => {
    setNavPath((prev) => prev.slice(0, -1));
    // If we are backing out of a level, we might want to clear selection?
    // Maybe not necessary, Archive.tsx handles it.
  };

  const isFileView = currentFolder?.type === 'level';

  return (
    <div className="flex flex-col gap-4">
      {navPath.length > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      <div className="text-sm font-semibold text-muted-foreground mb-2">
        {navPath.map(f => f.name).join(' > ')}
      </div>

      {isFileView ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {currentMaterials.map((material) => (
            <ContextMenu key={material.id}>
              <ContextMenuTrigger asChild>
                <button
                  onClick={() => onMaterialClick?.(material)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all hover:scale-105 aspect-square justify-center text-center",
                    "bg-card border-border hover:bg-accent/5 hover:border-accent/50 shadow-sm group",
                    !onMaterialClick && "cursor-default hover:scale-100"
                  )}
                >
                  {material.type === 'image' ? (
                    <ImageIcon className="h-12 w-12 shrink-0 text-purple-500/80 group-hover:text-purple-600 transition-colors" />
                  ) : (
                    <FileText className={cn(
                      "h-12 w-12 shrink-0 transition-colors",
                      material.type === 'pdf' ? "text-red-500/80 group-hover:text-red-600" : "text-blue-500/80 group-hover:text-blue-600"
                    )} />
                  )}
                  <div className="flex flex-col overflow-hidden w-full">
                    <span className="text-sm font-medium truncate w-full" title={material.title}>
                      {material.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase mt-1">
                      {material.size} • {material.date}
                    </span>
                  </div>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={() => onMaterialClick?.(material)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </ContextMenuItem>
                <ContextMenuItem onClick={() => toast.success(`Downloading ${material.title}...`)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setPropertiesMaterial(material)}>
                  <Info className="w-4 h-4 mr-2" />
                  Properties
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
          {currentMaterials.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No materials found in this folder.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {currentFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all hover:scale-105 aspect-square justify-center text-center",
                selectedId === folder.id
                  ? "bg-accent/10 border-accent text-accent shadow-sm"
                  : "bg-card border-border hover:bg-accent/5 hover:border-accent/50 shadow-sm"
              )}
            >
              <Folder
                className={cn(
                  "h-12 w-12 shrink-0 transition-colors",
                  selectedId === folder.id ? "text-accent" : "text-muted-foreground group-hover:text-accent"
                )}
              />
              <div className="flex flex-col overflow-hidden w-full">
                <span className="text-sm font-medium truncate w-full">
                  {folder.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase mt-1">
                  {folder.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      {/* Properties Dialog */}
      <Dialog open={!!propertiesMaterial} onOpenChange={(open) => !open && setPropertiesMaterial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Properties</DialogTitle>
            <DialogDescription>Details about the selected file.</DialogDescription>
          </DialogHeader>
          {propertiesMaterial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Name:</span>
                <span className="col-span-3 truncate">{propertiesMaterial.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Type:</span>
                <span className="col-span-3 uppercase">{propertiesMaterial.type}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Size:</span>
                <span className="col-span-3">{propertiesMaterial.size}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Date:</span>
                <span className="col-span-3">{propertiesMaterial.date}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-right">Folder:</span>
                <span className="col-span-3 truncate">{propertiesMaterial.folderId || 'N/A'}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
