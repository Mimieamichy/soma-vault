import { useState, useEffect } from 'react';
import { Grid, List, Library, Search, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MaterialCard } from '@/components/archive/MaterialCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialItem } from '@/data/mockData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function MyLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [pqs, setPQs] = useState<MaterialItem[]>([]);
  const [activeTab, setActiveTab] = useState('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaterialItem | null>(null);

  useEffect(() => {
    const fetchMyLibrary = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/material/user');
        const data = response.data.data || response.data;
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          const mappedItems: MaterialItem[] = data.map((m: any) => ({
            id: m.id,
            title: m.title,
            type: (m.type?.toLowerCase() || 'pdf') as 'pdf' | 'docx' | 'image',
            date: m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            size: m.fileSize ? `${(m.fileSize / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
            fileUrl: m.fileUrl,
            content: m.content,
            materialType: m.materialType?.toLowerCase() === 'pq' ? 'pq' : 'notes'
          }));

          setMaterials(mappedItems.filter(m => m.materialType === 'notes'));
          setPQs(mappedItems.filter(m => m.materialType === 'pq'));
        }
      } catch (error) {
        console.error('Failed to fetch library materials:', error);
        toast.error('Failed to load your library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyLibrary();
  }, []);


  const filteredMaterials = materials.filter(m =>  
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPQs = pqs.filter(pq => 
    pq.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreview = (item: MaterialItem) => {
    setPreviewMaterial(item);
  };

  const handleDownload = (item: MaterialItem) => {
    if (item.fileUrl) {
      const link = document.createElement('a');

      const normalizedUrl = item.fileUrl.replace(/\\/g, '/');
      let fullUrl = '';

      if (normalizedUrl.startsWith('http')) {
        fullUrl = normalizedUrl;
      } else {
        const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';
        const cleanPath = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        fullUrl = `${baseUrl}${cleanPath}`;
      }

      console.log('Downloading from:', fullUrl);
      link.href = fullUrl;

      const extension = normalizedUrl.split('.').pop();
      const fileName = item.title.toLowerCase().endsWith(`.${extension?.toLowerCase()}`)
        ? item.title
        : `${item.title}.${extension}`;

      link.download = fileName;
      link.target = '_blank';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${item.title}...`);
    } else {
      toast.error('Download URL not available');
    }
  };

  const handleDelete = async (item: MaterialItem) => {
    try {
      await api.delete(`/material/${item.id}`);
      setMaterials(prev => prev.filter(m => m.id !== item.id));
      setPQs(prev => prev.filter(m => m.id !== item.id));
      toast.success('Material deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete material:', error);
      const message = error?.response?.data?.error || 'Failed to delete material';
      toast.error(message);
    }
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
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredMaterials.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-3 md:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  {...material}
                  onPreview={() => handlePreview(material)}
                  onDownload={() => handleDownload(material)}
                  onDelete={() => setDeleteTarget(material)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
              <Library className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No materials found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                You haven't saved or uploaded any study materials yet.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pq" className="space-y-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredPQs.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-3 md:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredPQs.map((material: any) => (
                <MaterialCard
                  key={material.id}
                  {...material}
                  onPreview={() => handlePreview(material)}
                  onDownload={() => handleDownload(material)}
                  onDelete={() => setDeleteTarget(material)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
              <Library className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No past questions found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                You haven't saved or uploaded any past questions yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

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

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete file</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteTarget) return;
                await handleDelete(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
