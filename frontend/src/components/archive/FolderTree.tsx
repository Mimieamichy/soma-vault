import { useState, useMemo, useEffect } from 'react';
import { Folder, ArrowLeft, FileText, Image as ImageIcon, Eye, Download, Info, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaterialItem } from '@/data/mockData';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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

export interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
  type?: 'school' | 'group' | 'level';
}

export interface APIMaterial {
  id: string;
  title: string;
  type: string;
  fileSize: number;
  uploadedAt: string;
  materialType?: string;
  [key: string]: any;
}

export interface APILevel {
  level: string;
  materials: APIMaterial[];
}

export interface APIGroup {
  group: string;
  levels: APILevel[];
}

export interface APISchool {
  school: string;
  groups: APIGroup[];
}

export const generateFolderId = (prefix: string, ...parts: (string | undefined)[]) => {
  return [prefix, ...parts]
    .filter((p): p is string => typeof p === 'string')
    .map(p => p.toLowerCase().replace(/\s+/g, '-'))
    .join('-');
};

const generateFolderStructure = (prefix: string, data: APISchool[]): FolderNode[] => {
  if (!Array.isArray(data)) return [];
  
  return data.map((schoolItem) => {
    const schoolName = schoolItem.school || 'Unknown School';
    const schoolId = generateFolderId(prefix, schoolName);
    
    return {
      id: schoolId,
      name: schoolName,
      type: 'school',
      children: (schoolItem.groups || []).map((groupItem) => {
        const groupName = groupItem.group || 'Unknown Group';
        const groupId = generateFolderId(prefix, schoolName, groupName);
        
        return {
          id: groupId,
          name: groupName,
          type: 'group',
          children: (groupItem.levels || []).map((levelItem) => {
            const levelName = levelItem.level || 'Unknown Level';
            const levelId = generateFolderId(prefix, schoolName, groupName, levelName);
            
            return {
              id: levelId,
              name: levelName,
              type: 'level',
              children: [],
            };
          }),
        };
      }),
    };
  });
};

interface FolderTreeProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
  type: 'materials' | 'pq';
  materials?: MaterialItem[];
  onMaterialClick?: (material: MaterialItem) => void;
  folderData?: APISchool[];
  setFolderData?: (data: APISchool[] | ((prev: APISchool[]) => APISchool[])) => void;
  searchTerm?: string;
  onCreateStudyPlan?: (material: MaterialItem) => void;
}

export function FolderTree({ 
  onSelect, 
  selectedId, 
  type, 
  materials: externalMaterials = [], 
  onMaterialClick, 
  folderData: initialFolderData = [],
  setFolderData: parentSetFolderData,
  searchTerm,
  onCreateStudyPlan,
}: FolderTreeProps) {
  // Navigation stack to track current path
  const [navPath, setNavPath] = useState<FolderNode[]>([]);
  const [propertiesMaterial, setPropertiesMaterial] = useState<MaterialItem | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);
  const [internalFolderData, setInternalFolderData] = useState<APISchool[]>(initialFolderData);
  const [localMaterials, setLocalMaterials] = useState<MaterialItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync initialFolderData to internal state
  useEffect(() => {
    setInternalFolderData(initialFolderData);
  }, [initialFolderData]);

  // Use either parent setter or local setter
  const updateFolderData = (dataOrFn: APISchool[] | ((prev: APISchool[]) => APISchool[])) => {
    if (parentSetFolderData) {
      parentSetFolderData(dataOrFn);
    } else {
      setInternalFolderData(dataOrFn);
    }
  };

  const folderData = internalFolderData;
  const setFolderData = updateFolderData;

  const rootFolders = useMemo(() => {
    return generateFolderStructure(type === 'materials' ? 'm' : 'pq', folderData);
  }, [type, folderData]);

  const currentFolder = navPath.length > 0 ? navPath[navPath.length - 1] : null;

  const currentFolders = useMemo(() => {
    if (!currentFolder) return rootFolders;
    return currentFolder.children || [];
  }, [currentFolder, rootFolders]);

  const currentMaterials = useMemo(() => {
    if (searchTerm?.trim()) {
      return externalMaterials;
    }
    
    if (currentFolder?.type === 'level') {
      const allMaterials = [...externalMaterials, ...localMaterials];
      const targetType = type === 'materials' ? 'notes' : 'pq';
      const uniqueMaterials = allMaterials.filter((m, index, self) => 
        index === self.findIndex((t) => t.id === m.id) && 
        m.folderId === currentFolder.id &&
        m.materialType === targetType
      );
      return uniqueMaterials;
    }
    return [];
  }, [currentFolder, externalMaterials, localMaterials, type, searchTerm]);

  const handleFolderClick = async (folder: FolderNode) => {
    // If it's a school and has no children, fetch its groups
    if (folder.type === 'school' && (!folder.children || folder.children.length === 0)) {
      try {
        setIsLoading(true);
        const materialTypeParam = type === 'materials' ? 'notes' : 'pq';
        const response = await api.get(`/material/groups?school=${encodeURIComponent(folder.name)}&materialType=${materialTypeParam}`);
        const data = response.data.data || response.data;
        
        if (Array.isArray(data)) {
          // Map the simple group list to APIGroup format
          const groups: APIGroup[] = data.map((group: any) => ({
            group: typeof group === 'string' ? group : (group.group || 'Unknown Group'),
            levels: []
          }));
          
          // Update the specific school in our folderData
          setFolderData(prev => prev.map(s => {
            if (s.school === folder.name) {
              return { ...s, groups };
            }
            return s;
          }));

          // After updating folderData, we need to find the updated folder in the structure to navigate into it
          const updatedFolders = generateFolderStructure(type === 'materials' ? 'm' : 'pq', [{ school: folder.name, groups }]);
          if (updatedFolders.length > 0) {
            setNavPath([...navPath, updatedFolders[0]]);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        toast.error('Failed to load groups');
      } finally {
        setIsLoading(false);
      }
    }

    // If it's a group and has no children, fetch its levels
    if (folder.type === 'group' && (!folder.children || folder.children.length === 0)) {
      const schoolFolder = navPath.find(f => f.type === 'school');
      if (schoolFolder) {
        try {
          setIsLoading(true);
          const materialTypeParam = type === 'materials' ? 'notes' : 'pq';
          const response = await api.get(`/material/levels?school=${encodeURIComponent(schoolFolder.name)}&group=${encodeURIComponent(folder.name)}&materialType=${materialTypeParam}`);
          const data = response.data.data || response.data;
          
          if (Array.isArray(data)) {
            // Map the simple level list to APILevel format
            const levels: APILevel[] = data.map((level: any) => ({
              level: typeof level === 'string' ? level : (level.level || 'Unknown Level'),
              materials: []
            }));
            
            // Update the specific group in our folderData
            setFolderData(prev => prev.map(s => {
              if (s.school === schoolFolder.name) {
                return {
                  ...s,
                  groups: s.groups.map(g => {
                    if (g.group === folder.name) {
                      return { ...g, levels };
                    }
                    return g;
                  })
                };
              }
              return s;
            }));

            // After updating folderData, we need to find the updated group folder to navigate into it
            const updatedFolders = generateFolderStructure(type === 'materials' ? 'm' : 'pq', [{ 
              school: schoolFolder.name, 
              groups: [{ group: folder.name, levels }] 
            }]);
            
            if (updatedFolders.length > 0 && updatedFolders[0].children && updatedFolders[0].children.length > 0) {
              setNavPath([...navPath, updatedFolders[0].children[0]]);
              return;
            }
          }
        } catch (error) {
          console.error('Failed to fetch levels:', error);
          toast.error('Failed to load levels');
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (folder.children && folder.children.length > 0) {
      setNavPath([...navPath, folder]);
    } else if (folder.type === 'level') {
      const schoolFolder = navPath.find(f => f.type === 'school');
      const groupFolder = navPath.find(f => f.type === 'group');
      
      if (schoolFolder && groupFolder) {
        try {
          setIsLoading(true);
          const materialTypeParam = type === 'materials' ? 'notes' : 'pq';
          const response = await api.get(`/material/materialTypes?school=${encodeURIComponent(schoolFolder.name)}&group=${encodeURIComponent(groupFolder.name)}&level=${encodeURIComponent(folder.name)}&materialType=${materialTypeParam}`);
          console.log(`Materials API Response (${type}):`, response.data);
          const data = response.data.data || response.data;
          
          if (Array.isArray(data)) {
            const newMaterials: MaterialItem[] = data.map((m: any) => ({
              id: m.id,
              folderId: folder.id,
              title: m.title,
              type: (m.type?.toLowerCase() || 'pdf') as 'pdf' | 'docx' | 'image',
              date: m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
              size: m.fileSize ? `${(m.fileSize / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
              fileUrl: m.fileUrl,
              content: m.content,
              materialType: m.materialType?.toLowerCase() === 'pq' ? 'pq' : 'notes'
            }));
            
            setLocalMaterials(prev => {
              const otherMaterials = prev.filter(pm => pm.folderId !== folder.id);
              return [...otherMaterials, ...newMaterials];
            });
          }
        } catch (error) {
          console.error('Failed to fetch materials:', error);
          toast.error('Failed to load materials');
        } finally {
          setIsLoading(false);
        }
      }

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

  const handleDownload = (material: MaterialItem) => {
    if (material.fileUrl) {
        const link = document.createElement('a');
        
        const normalizedUrl = material.fileUrl.replace(/\\/g, '/');
        let fullUrl = '';
        
        // Check if it starts with http/https
        if (normalizedUrl.startsWith('http')) {
             fullUrl = normalizedUrl;
        } else {
             const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';
             const cleanPath = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
             fullUrl = `${baseUrl}${cleanPath}`;
        }
        
        console.log('Downloading from:', fullUrl);
        link.href = fullUrl;
        
        // Ensure the filename has the correct extension from the URL
        const extension = normalizedUrl.split('.').pop();
        const fileName = material.title.toLowerCase().endsWith(`.${extension?.toLowerCase()}`) 
          ? material.title 
          : `${material.title}.${extension}`;
        
        link.download = fileName;
        link.target = '_blank'; // Opens in new tab as fallback if download fails
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading ${material.title}...`);
    } else {
        toast.error("Download URL not available");
    }
  };

  const isFileView = currentFolder?.type === 'level' || !!searchTerm?.trim();

  return (
    <div className="flex flex-col gap-4">
      {navPath.length > 0 && !searchTerm?.trim() && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {!searchTerm?.trim() && (
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          {navPath.map((f, index) => (
            <span key={f.id || index}>
              {index > 0 && ' > '}
              {f.name}
            </span>
          ))}
        </div>
      )}

      {isFileView ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {currentMaterials.map((material, idx) => (
            <ContextMenu key={material.id || `mat-${idx}`}>
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
                <ContextMenuItem onClick={() => setPreviewMaterial(material)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleDownload(material)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setPropertiesMaterial(material)}>
                  <Info className="w-4 h-4 mr-2" />
                  Properties
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onCreateStudyPlan?.(material)}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Study Plan
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
      ) : isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
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
              <div className="flex flex-col w-full px-1">
                <span className="text-sm font-medium w-full text-center break-words line-clamp-2 leading-tight">
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

      {/* Preview Dialog */}
      <Dialog open={!!previewMaterial} onOpenChange={(open) => !open && setPreviewMaterial(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewMaterial?.title}</DialogTitle>
            <DialogDescription>File Preview</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 border rounded-md bg-muted/50 mt-4">
            {previewMaterial?.content ? (
              <div className="whitespace-pre-wrap font-mono text-sm">
                {previewMaterial.content}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Info className="h-8 w-8 mb-2 opacity-50" />
                <p>No preview content available.</p>
                {previewMaterial?.fileUrl && (
                  <button 
                    onClick={() => previewMaterial && handleDownload(previewMaterial)}
                    className="mt-4 text-primary hover:underline"
                  >
                    Download to view file
                  </button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
