import { useState } from 'react';
import { Plus, Grid, List, Library, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MaterialCard } from '@/components/archive/MaterialCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadModal } from '@/components/archive/UploadModal';

// Mock data for user uploads
const initialMyMaterials = [
  { id: '1', title: 'My Organic Chemistry Notes', type: 'pdf' as const, date: 'Jan 12, 2024', size: '2.4 MB' },
  { id: '2', title: 'Calculus Cheat Sheet', type: 'image' as const, date: 'Jan 11, 2024', size: '1.2 MB' },
];

const initialMyPQs = [
  { id: 'pq-1', title: 'CSC 101 Past Questions 2023', type: 'pdf' as const, date: 'Jan 10, 2024', size: '3.5 MB' },
  { id: 'pq-2', title: 'MTH 101 Exam Paper', type: 'pdf' as const, date: 'Jan 9, 2024', size: '1.8 MB' },
];

export default function MyLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [materials, setMaterials] = useState(initialMyMaterials);
  const [pqs, setPQs] = useState(initialMyPQs);
  const [activeTab, setActiveTab] = useState('materials');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [level, setLevel] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleLibrarySubmit = () => {
    if (!level || !courseName || !selectedFile) {
      toast.error('Please select level, enter course name, and choose a file.');
      return;
    }
    const ext = selectedFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
    const newItem = {
      id: `new-${Date.now()}`,
      title: courseName,
      type: ext as 'pdf' | 'docx',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
    };

    if (activeTab === 'materials') {
      setMaterials([newItem, ...materials]);
    } else {
      setPQs([newItem, ...pqs]);
    }
    toast.success(`Uploaded to ${activeTab === 'materials' ? 'My Materials' : 'My Past Questions'}`);
    setUploadOpen(false);
    setLevel('');
    setCourseName('');
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Library className="h-6 w-6 text-accent" />
            My Library
          </h2>
          <p className="text-muted-foreground">Manage your uploaded materials and past questions</p>
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
          
          <Button 
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
          <UploadModal
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            onSubmit={handleLibrarySubmit}
            level={level}
            setLevel={setLevel}
            courseName={courseName}
            setCourseName={setCourseName}
            onFileSelect={(files) => setSelectedFile(files[0] || null)}
          />
        </div>
      </div>

      <Tabs defaultValue="materials" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">My Materials</TabsTrigger>
          <TabsTrigger value="pq">My Past Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          {materials.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {materials.map((material) => (
                <MaterialCard key={material.id} {...material} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
              <Library className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No materials uploaded</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                You haven't uploaded any study materials yet. Click "Upload New" to get started.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pq" className="space-y-6">
          {pqs.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {pqs.map((material) => (
                <MaterialCard key={material.id} {...material} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
              <Library className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No past questions uploaded</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                You haven't uploaded any past questions yet. Click "Upload New" to get started.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
