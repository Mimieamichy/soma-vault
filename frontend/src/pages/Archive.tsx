import { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderTree } from '@/components/archive/FolderTree';
import { MaterialCard } from '@/components/archive/MaterialCard';
import { UploadZone } from '@/components/archive/UploadZone';
import { PQHub } from '@/components/archive/PQHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadModal } from '@/components/archive/UploadModal';

const mockMaterials = [
  { id: '1', folderId: 'm-ful-cs-100', title: 'Introduction to Computer Science', type: 'pdf' as const, date: 'Jan 10, 2024', size: '2.4 MB' },
  { id: '2', folderId: 'm-unizik-music-200', title: 'Music Elements', type: 'pdf' as const, date: 'Jan 8, 2024', size: '1.2 MB' },
  { id: '3', folderId: 'm-ful-cs-100', title: 'Calculus Formulas', type: 'pdf' as const, date: 'Jan 5, 2024', size: '856 KB' },
];

const mockPQMaterials = [
  { id: 'pq-1', folderId: 'pq-ful-cs-100', title: 'Introduction to Computer Science (PQ)', type: 'pdf' as const, date: 'Jan 10, 2024', size: '2.4 MB' },
];

export default function Archive() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPQ, setSelectedPQ] = useState<string | null>(null);
  const [materials, setMaterials] = useState(mockMaterials);
  const [pqMaterials, setPqMaterials] = useState(mockPQMaterials);
  const [materialsLevel, setMaterialsLevel] = useState('');
  const [materialsCourseName, setMaterialsCourseName] = useState('');
  const [materialsFile, setMaterialsFile] = useState<File | null>(null);
  const [pqLevel, setPqLevel] = useState('');
  const [pqCourseName, setPqCourseName] = useState('');
  const [pqFile, setPqFile] = useState<File | null>(null);
  const [materialsUploadOpen, setMaterialsUploadOpen] = useState(false);
  const [pqUploadOpen, setPqUploadOpen] = useState(false);

  const handleMaterialsSubmit = () => {
    if (!materialsLevel || !materialsCourseName || !materialsFile) {
      toast.error('Please select level, enter course name, and choose a file.');
      return;
    }
    const ext = materialsFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
    const newMaterial = {
      id: `new-${Date.now()}`,
      folderId: selectedFolder || 'root',
      title: materialsCourseName,
      type: ext as 'pdf' | 'docx',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: `${(materialsFile.size / (1024 * 1024)).toFixed(1)} MB`,
    };
    setMaterials([newMaterial, ...materials]);
    toast.success('Material uploaded successfully');
    setMaterialsLevel('');
    setMaterialsCourseName('');
    setMaterialsFile(null);
    setMaterialsUploadOpen(false);
  };

  const handlePQSubmit = () => {
    if (!pqLevel || !pqCourseName || !pqFile) {
      toast.error('Please select level, enter course name, and choose a file.');
      return;
    }
    const ext = pqFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
    const newPQ = {
      id: `new-${Date.now()}`,
      folderId: selectedFolder || 'root',
      title: pqCourseName,
      type: ext as 'pdf' | 'docx',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: `${(pqFile.size / (1024 * 1024)).toFixed(1)} MB`,
    };
    setPqMaterials([newPQ, ...pqMaterials]);
    toast.success('Past question uploaded successfully');
    setPqLevel('');
    setPqCourseName('');
    setPqFile(null);
    setPqUploadOpen(false);
  };

  const filteredMaterials = selectedFolder 
    ? materials.filter(m => m.folderId === selectedFolder)
    : materials;

  const filteredPQMaterials = selectedFolder
    ? pqMaterials.filter(m => m.folderId === selectedFolder)
    : pqMaterials;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Archive</h2>
          <p className="text-muted-foreground">Access Materials from Universities in Nigeria</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-muted' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="pq">Past Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Folder Tree */}
            <div className="lg:col-span-1 bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Folders</h3>
              <FolderTree 
                selectedId={selectedFolder} 
                onSelect={setSelectedFolder}
                type="materials"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-end">
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setMaterialsUploadOpen(true)}
                >
                  Upload
                </Button>
                <UploadModal
                  open={materialsUploadOpen}
                  onOpenChange={setMaterialsUploadOpen}
                  onSubmit={handleMaterialsSubmit}
                  level={materialsLevel}
                  setLevel={setMaterialsLevel}
                  courseName={materialsCourseName}
                  setCourseName={setMaterialsCourseName}
                  onFileSelect={(files) => setMaterialsFile(files[0] || null)}
                />
              </div>

              {/* Materials Grid */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  {selectedFolder ? 'Folder Contents' : 'All Materials'}
                </h3>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredMaterials.map((material) => (
                    <MaterialCard key={material.id} {...material} />
                  ))}
                  {filteredMaterials.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                      No materials found in this folder.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pq">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Folders</h3>
              <FolderTree 
                selectedId={selectedFolder} 
                onSelect={(id) => {
                  setSelectedFolder(id);
                  setSelectedPQ(null); // Reset PQ selection when changing folders
                }}
                type="pq"
              />
            </div>
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {!selectedPQ ? (
                <div>
                   <div className="flex justify-end mb-6">
                     <Button 
                       className="bg-accent hover:bg-accent/90 text-accent-foreground"
                       onClick={() => setPqUploadOpen(true)}
                     >
                       Upload
                     </Button>
                     <UploadModal
                       open={pqUploadOpen}
                       onOpenChange={setPqUploadOpen}
                       onSubmit={handlePQSubmit}
                       level={pqLevel}
                       setLevel={setPqLevel}
                       courseName={pqCourseName}
                       setCourseName={setPqCourseName}
                       onFileSelect={(files) => setPqFile(files[0] || null)}
                     />
                   </div>

                  <h3 className="font-semibold text-foreground mb-4">
                    {selectedFolder ? 'Select a Past Question' : 'All Past Questions'}
                  </h3>
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredPQMaterials.map((material) => (
                      <div 
                        key={material.id} 
                        onClick={() => setSelectedPQ(material.id)}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <MaterialCard {...material} />
                      </div>
                    ))}
                    {filteredPQMaterials.length === 0 && (
                      <div className="col-span-full text-center py-10 text-muted-foreground">
                        No past questions found in this folder.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedPQ(null)}
                    className="mb-4"
                  >
                    ← Back to List
                  </Button>
                  <PQHub materialName={pqMaterials.find(m => m.id === selectedPQ)?.title} />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
