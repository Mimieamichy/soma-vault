import { useState } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FolderTree } from '@/components/archive/FolderTree';
import { MaterialCard } from '@/components/archive/MaterialCard';
import { UploadZone } from '@/components/archive/UploadZone';
import { PQHub } from '@/components/archive/PQHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockMaterials = [
  { id: '1', title: 'Organic Chemistry Notes', type: 'pdf' as const, date: 'Jan 10, 2024', size: '2.4 MB' },
  { id: '2', title: 'Physics Lab Report', type: 'docx' as const, date: 'Jan 8, 2024', size: '1.2 MB' },
  { id: '3', title: 'Calculus Formulas', type: 'pdf' as const, date: 'Jan 5, 2024', size: '856 KB' },
  { id: '4', title: 'Data Structures Diagram', type: 'image' as const, date: 'Jan 3, 2024', size: '1.8 MB' },
  { id: '5', title: 'Linear Algebra Summary', type: 'pdf' as const, date: 'Dec 28, 2023', size: '3.1 MB' },
  { id: '6', title: 'Algorithm Pseudocode', type: 'docx' as const, date: 'Dec 25, 2023', size: '542 KB' },
];

export default function Archive() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Archive</h2>
          <p className="text-muted-foreground">Organize and access your study materials</p>
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
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="pqhub">PQ Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Folder Tree */}
            <div className="lg:col-span-1 bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Folders</h3>
              <FolderTree 
                selectedId={selectedFolder} 
                onSelect={setSelectedFolder} 
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Upload Zone */}
              <UploadZone />

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
                  {mockMaterials.map((material) => (
                    <MaterialCard key={material.id} {...material} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pqhub">
          <div className="max-w-3xl mx-auto">
            <PQHub />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
