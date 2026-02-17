import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

import { FolderTree, generateFolderId, APISchool, APIGroup, APILevel, APIMaterial } from '@/components/archive/FolderTree';

import { PQHub } from '@/components/archive/PQHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadModal, UploadType } from '@/components/archive/UploadModal';
import { mockArchiveMaterials, mockArchivePQs, MaterialItem } from '@/data/mockData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StudyPlanForm } from '@/components/planner/StudyPlanForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Archive() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const [selectedPQ, setSelectedPQ] = useState<string | null>(null);
  const [materials, setMaterials] = useState(mockArchiveMaterials);
  const [pqMaterials, setPqMaterials] = useState(mockArchivePQs);
  const [materialsLevel, setMaterialsLevel] = useState('');
  const [materialsGroup, setMaterialsGroup] = useState('');
  const [materialsCourseName, setMaterialsCourseName] = useState('');
  const [materialsFile, setMaterialsFile] = useState<File | null>(null);
  const [pqLevel, setPqLevel] = useState('');
  const [pqGroup, setPqGroup] = useState('');
  const [pqCourseName, setPqCourseName] = useState('');
  const [pqFile, setPqFile] = useState<File | null>(null);
  const [materialsUploadOpen, setMaterialsUploadOpen] = useState(false);
  const [pqUploadOpen, setPqUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [notesFolderData, setNotesFolderData] = useState<APISchool[]>([]);
  const [pqFolderData, setPqFolderData] = useState<APISchool[]>([]);
  const [searchNotes, setSearchNotes] = useState<MaterialItem[]>([]);
  const [searchPQs, setSearchPQs] = useState<MaterialItem[]>([]);
  const [planMaterial, setPlanMaterial] = useState<MaterialItem | null>(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);

  // Add debounce for search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchNotes([]);
      setSearchPQs([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await api.get(`/material/search?q=${searchTerm}`);
        const data = response.data.data || response.data;
        
        if (Array.isArray(data)) {
          const mappedResults: MaterialItem[] = data.map((m: any) => ({
            id: m.id,
            title: m.title,
            type: (m.type?.toLowerCase() || 'pdf') as 'pdf' | 'docx' | 'image',
            date: m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            size: m.fileSize ? `${(m.fileSize / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
            fileUrl: m.fileUrl,
            content: m.content,
            materialType: m.materialType?.toLowerCase() === 'pq' ? 'pq' : 'notes'
          }));

          setSearchNotes(mappedResults.filter(m => m.materialType === 'notes'));
          setSearchPQs(mappedResults.filter(m => m.materialType === 'pq'));
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/material/schools');
        console.log('Folder API Response:', response.data);
        const data = response.data.data || response.data;
        
        if (Array.isArray(data)) {
          const mappedData: APISchool[] = data.map(item => {
            if (typeof item === 'string') {
              return { school: item, groups: [] };
            }
            return {
              school: item.school || 'Unknown School',
              groups: item.groups || []
            };
          });

          setNotesFolderData(mappedData);
          setPqFolderData(JSON.parse(JSON.stringify(mappedData))); // Deep copy for PQ
          
          const newMaterials: MaterialItem[] = [];
          const newPQs: MaterialItem[] = [];

          mappedData.forEach((school: APISchool) => {
            if (school.groups) {
              school.groups.forEach((group: APIGroup) => {
                if (group.levels) {
                  group.levels.forEach((level: APILevel) => {
                    if (level.materials) {
                      level.materials.forEach((m: APIMaterial) => {
                        const isPQ = m.materialType?.toLowerCase() === 'pq'; 
                        const prefix = isPQ ? 'pq' : 'm';
                        const folderId = generateFolderId(prefix, school.school, group.group, level.level);
                        
                        const item: MaterialItem = {
                             id: m.id,
                             folderId: folderId,
                             title: m.title,
                             type: (m.type?.toLowerCase() || 'pdf') as 'pdf' | 'docx' | 'image',
                             date: m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
                             size: m.fileSize ? `${(m.fileSize / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
                             fileUrl: m.fileUrl,
                             content: m.content,
                             materialType: isPQ ? 'pq' : 'notes'
                        };
                        
                        if (isPQ) {
                            newPQs.push(item);
                        } else {
                            newMaterials.push(item);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
          
          if (newMaterials.length > 0) setMaterials(newMaterials);
          if (newPQs.length > 0) setPqMaterials(newPQs);
        }
      } catch (error) {
        console.error('Failed to fetch folders:', error);
        toast.error('Failed to load folders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolderData();
  }, []);

  const filteredMaterials = searchTerm.trim() 
    ? searchNotes 
    : materials.filter(m => m.materialType === 'notes');

  const filteredPQs = searchTerm.trim() 
    ? searchPQs 
    : pqMaterials.filter(pq => pq.materialType === 'pq');

  const handleCreatePlanFromArchive = async (data: { 
    group: string;
    title: string; 
    level: string;
    studyFrequency: string; 
    duration: string;
    startDate: Date;
    materialType: 'notes' | 'pq';
    files: File[];
  }) => {
    if (!planMaterial) return;
    setIsCreatingPlan(true);
    try {
      const payload = {
        title: data.title,
        studyFrequency: data.studyFrequency,
        duration: parseInt(data.duration),
        startDate: data.startDate.toISOString(),
      };
      const res = await api.post(`/studyplan/${planMaterial.id}`, payload);
      console.log('Created study plan from archive:', res.data);
      toast.success('Study plan created successfully');
      setPlanMaterial(null);
    } catch (error) {
      console.error('Failed to create study plan from archive:', error);
      toast.error('Failed to create study plan');
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleMaterialsSubmit = async () => {
    if (!materialsLevel || !materialsGroup || !materialsCourseName || !materialsFile) {
      toast.error('Please select level, group, enter course name, and choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', materialsCourseName);
    formData.append('level', materialsLevel);
    formData.append('group', materialsGroup);
    formData.append('materialType', uploadType);
    formData.append('file', materialsFile);

    setIsUploading(true);
    try {
      const response = await api.post('/material/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const ext = materialsFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
      const newItem = {
        id: response.data.data?.id || `new-${Date.now()}`,
        folderId: selectedFolder || 'root',
        title: materialsCourseName,
        type: ext as 'pdf' | 'docx',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: `${(materialsFile.size / (1024 * 1024)).toFixed(1)} MB`,
        category: uploadType
      };
      
      if (uploadType === 'pq') {
        setPqMaterials([newItem, ...pqMaterials]);
        toast.success('Past question uploaded successfully');
      } else {
        setMaterials([newItem, ...materials]);
        toast.success('Material uploaded successfully');
      }

      setMaterialsLevel('');
      setMaterialsGroup('');
      setMaterialsCourseName('');
      setMaterialsFile(null);
      setMaterialsUploadOpen(false);
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePQSubmit = async () => {
    if (!pqLevel || !pqGroup || !pqCourseName || !pqFile) {
      toast.error('Please select level, group, enter course name, and choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', pqCourseName);
    formData.append('level', pqLevel);
    formData.append('group', pqGroup);
    formData.append('materialType', uploadType);
    formData.append('file', pqFile);

    setIsUploading(true);
    try {
      const response = await api.post('/material/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const ext = pqFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
      const newItem = {
        id: response.data.data?.id || `new-${Date.now()}`,
        folderId: selectedFolder || 'root',
        title: pqCourseName,
        type: ext as 'pdf' | 'docx',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: `${(pqFile.size / (1024 * 1024)).toFixed(1)} MB`,
        category: uploadType
      };

      if (uploadType === 'notes') {
        setMaterials([newItem, ...materials]);
        toast.success('Material uploaded successfully');
      } else {
        setPqMaterials([newItem, ...pqMaterials]);
        toast.success('Past question uploaded successfully');
      }

      setPqLevel('');
      setPqGroup('');
      setPqCourseName('');
      setPqFile(null);
      setPqUploadOpen(false);
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">Notes</TabsTrigger>
          <TabsTrigger value="pq">Past Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <div className="flex flex-col gap-4">
             <div className="flex justify-end items-center gap-2">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <LoadingSpinner size={16} className="min-h-0" />
                    </div>
                  )}
                </div>

                <Button 
                  className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => {
                    setMaterialsUploadOpen(true);
                    setUploadType('notes');
                  }}
                >
                  Upload
                </Button>
             </div>
            <Button
              className="md:hidden fixed bottom-24 right-6 z-50 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => {
                setMaterialsUploadOpen(true);
                setUploadType('notes');
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <UploadModal
              open={materialsUploadOpen}
              onOpenChange={setMaterialsUploadOpen}
              onSubmit={handleMaterialsSubmit}
              level={materialsLevel}
              setLevel={setMaterialsLevel}
              group={materialsGroup}
              setGroup={setMaterialsGroup}
              courseName={materialsCourseName}
              setCourseName={setMaterialsCourseName}
              materialType={uploadType}
              setMaterialType={setUploadType}
              onFileSelect={(files) => setMaterialsFile(files[0] || null)}
              isLoading={isUploading}
            />
          </div>

          <div className="grid gap-6">
            {/* Folder Tree */}
            <div className="col-span-full bg-card rounded-xl p-6 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Folders</h3>
              {isLoading ? (
                <LoadingSpinner className="min-h-[300px]" />
              ) : (
                <FolderTree 
                  selectedId={selectedFolder} 
                  onSelect={setSelectedFolder}
                  type="materials"
                  materials={filteredMaterials}
                  folderData={notesFolderData}
                  setFolderData={setNotesFolderData}
                  searchTerm={searchTerm}
                  onCreateStudyPlan={(material) => setPlanMaterial(material)}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pq">
          {!selectedPQ ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                 <div className="flex justify-end items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search past questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <LoadingSpinner size={16} className="min-h-0" />
                        </div>
                      )}
                    </div>

                    <Button 
                      className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => {
                        setPqUploadOpen(true);
                        setUploadType('pq');
                      }}
                    >
                      Upload
                    </Button>
                 </div>
                <Button
                  className="md:hidden fixed bottom-24 right-6 z-50 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => {
                    setPqUploadOpen(true);
                    setUploadType('pq');
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <UploadModal
                  open={pqUploadOpen}
                  onOpenChange={setPqUploadOpen}
                  onSubmit={handlePQSubmit}
                  level={pqLevel}
                  setLevel={setPqLevel}
                  group={pqGroup}
                  setGroup={setPqGroup}
                  courseName={pqCourseName}
                  setCourseName={setPqCourseName}
                  materialType={uploadType}
                  setMaterialType={setUploadType}
                  onFileSelect={(files) => setPqFile(files[0] || null)}
                  isLoading={isUploading}
                />
              </div>

              <div className="grid gap-6">
                <div className="col-span-full bg-card rounded-xl p-6 border border-border shadow-card">
                  <h3 className="font-semibold text-foreground mb-4">Folders</h3>
                  {isLoading ? (
                    <LoadingSpinner className="min-h-[300px]" />
                  ) : (
                <FolderTree 
                  selectedId={selectedFolder} 
                  onSelect={(id) => {
                    setSelectedFolder(id);
                    setSelectedPQ(null);
                  }}
                  type="pq"
                  materials={filteredPQs}
                  onMaterialClick={(m) => setSelectedPQ(m.id)}
                  folderData={pqFolderData}
                  setFolderData={setPqFolderData}
                  searchTerm={searchTerm}
                  onCreateStudyPlan={(material) => setPlanMaterial(material)}
                />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <Button variant="ghost" onClick={() => setSelectedPQ(null)}>
                   <ArrowLeft className="h-4 w-4 mr-2" />
                   Back to Past Questions
                 </Button>
               </div>
               {/* PDF Viewer */}
               <div className="bg-card rounded-xl p-6 border border-border">
                 <PQHub materialName={pqMaterials.find(m => m.id === selectedPQ)?.title} />
               </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!planMaterial} onOpenChange={(open) => !open && setPlanMaterial(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Study Plan</DialogTitle>
            <DialogDescription>
              Set how often and when you want to study this material.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <StudyPlanForm 
              onSubmit={handleCreatePlanFromArchive} 
              isLoading={isCreatingPlan} 
              mode="fromMaterial"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
