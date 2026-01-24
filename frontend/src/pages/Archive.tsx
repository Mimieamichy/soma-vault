import { useState } from 'react';
import { ArrowLeft, Upload, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FolderTree } from '@/components/archive/FolderTree';

import { PQHub } from '@/components/archive/PQHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadModal } from '@/components/archive/UploadModal';
import { mockArchiveMaterials, mockArchivePQs } from '@/data/mockData';

export default function Archive() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const [selectedPQ, setSelectedPQ] = useState<string | null>(null);
  const [materials, setMaterials] = useState(mockArchiveMaterials);
  const [pqMaterials, setPqMaterials] = useState(mockArchivePQs);
  const [materialsLevel, setMaterialsLevel] = useState('');
  const [materialsDepartment, setMaterialsDepartment] = useState('');
  const [materialsCourseName, setMaterialsCourseName] = useState('');
  const [materialsFile, setMaterialsFile] = useState<File | null>(null);
  const [pqLevel, setPqLevel] = useState('');
  const [pqDepartment, setPqDepartment] = useState('');
  const [pqCourseName, setPqCourseName] = useState('');
  const [pqFile, setPqFile] = useState<File | null>(null);
  const [materialsUploadOpen, setMaterialsUploadOpen] = useState(false);
  const [pqUploadOpen, setPqUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPQs = pqMaterials.filter(pq => 
    pq.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMaterialsSubmit = () => {
    if (!materialsLevel || !materialsDepartment || !materialsCourseName || !materialsFile) {
      toast.error('Please select level, department, enter course name, and choose a file.');
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
    setMaterialsDepartment('');
    setMaterialsCourseName('');
    setMaterialsFile(null);
    setMaterialsUploadOpen(false);
  };

  const handlePQSubmit = () => {
    if (!pqLevel || !pqDepartment || !pqCourseName || !pqFile) {
      toast.error('Please select level, department, enter course name, and choose a file.');
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
    setPqDepartment('');
    setPqCourseName('');
    setPqFile(null);
    setPqUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="pq">Past Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <div className="flex flex-col gap-4">
             <div className="flex justify-end items-center gap-2">
                {/* Mobile Search */}
                <div className="md:hidden relative w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-muted/50 border-0"
                  />
                </div>

                <Button 
                  className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setMaterialsUploadOpen(true)}
                >
                  Upload
                </Button>
             </div>
            <Button
              className="md:hidden fixed bottom-24 right-6 z-50 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setMaterialsUploadOpen(true)}
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
              department={materialsDepartment}
              setDepartment={setMaterialsDepartment}
              courseName={materialsCourseName}
              setCourseName={setMaterialsCourseName}
              onFileSelect={(files) => setMaterialsFile(files[0] || null)}
            />
          </div>

          <div className="grid gap-6">
            {/* Folder Tree */}
            <div className="col-span-full bg-card rounded-xl p-6 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Folders</h3>
              <FolderTree 
                selectedId={selectedFolder} 
                onSelect={setSelectedFolder}
                type="materials"
                materials={filteredMaterials}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pq">
          {!selectedPQ ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                 <div className="flex justify-end items-center gap-2">
                    {/* Mobile Search */}
                    <div className="md:hidden relative w-full">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search past questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-muted/50 border-0"
                      />
                    </div>

                    <Button 
                      className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => setPqUploadOpen(true)}
                    >
                      Upload
                    </Button>
                 </div>
                <Button
                  className="md:hidden fixed bottom-24 right-6 z-50 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setPqUploadOpen(true)}
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
                  department={pqDepartment}
                  setDepartment={setPqDepartment}
                  courseName={pqCourseName}
                  setCourseName={setPqCourseName}
                  onFileSelect={(files) => setPqFile(files[0] || null)}
                />
              </div>

              <div className="grid gap-6">
                <div className="col-span-full bg-card rounded-xl p-6 border border-border shadow-card">
                  <h3 className="font-semibold text-foreground mb-4">Folders</h3>
                  <FolderTree 
                    selectedId={selectedFolder} 
                    onSelect={(id) => {
                      setSelectedFolder(id);
                      setSelectedPQ(null);
                    }}
                    type="pq"
                    materials={filteredPQs}
                    onMaterialClick={(m) => setSelectedPQ(m.id)}
                  />
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
    </div>
  );
}

