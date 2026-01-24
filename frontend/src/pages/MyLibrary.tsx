import { useState } from 'react';
import { Grid, List, Library, Upload, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MaterialCard } from '@/components/archive/MaterialCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadModal } from '@/components/archive/UploadModal';
import { mockLibraryMaterials, mockLibraryPQs } from '@/data/mockData';

export default function MyLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [materials, setMaterials] = useState(mockLibraryMaterials);
  const [pqs, setPQs] = useState(mockLibraryPQs);
  const [activeTab, setActiveTab] = useState('materials');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [level, setLevel] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPQs = pqs.filter(pq => 
    pq.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <Button 
          className="hidden md:flex gap-2 bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
          onClick={() => setUploadOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Upload New
        </Button>
        <Button
          className="md:hidden fixed bottom-24 right-6 z-50 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => setUploadOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
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

      {/* Mobile Navigation Row - Removed */}

      {/* Mobile Search Bar */}
      <div className="md:hidden relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search library..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-muted/50 border-0"
        />
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
          {filteredPQs.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredPQs.map((material: any) => (
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
