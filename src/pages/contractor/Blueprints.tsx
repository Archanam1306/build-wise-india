
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockProjects } from '@/data/mockData';
import { FileImage, Download, ZoomIn, RotateCw, Maximize, Upload } from 'lucide-react';
import BlueprintUploadModal from '@/components/modals/BlueprintUploadModal';
import { Blueprint } from '@/types';
import { toast } from '@/hooks/use-toast';

const Blueprints = () => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [activeTab, setActiveTab] = useState('elevation');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [blueprints, setBlueprints] = useState<Blueprint[]>(() => {
    // Flatten all blueprints from all projects
    return mockProjects.flatMap(project => 
      project.blueprints.map(blueprint => ({
        ...blueprint,
        projectId: project.id
      }))
    );
  });

  const blueprintCategories = [
    { id: 'elevation', name: 'Elevations', count: blueprints.filter(bp => bp.type === 'elevation').length },
    { id: 'structure', name: 'Structural Plans', count: blueprints.filter(bp => bp.type === 'structure').length },
    { id: 'electrical', name: 'Electrical Layout', count: blueprints.filter(bp => bp.type === 'electrical').length },
    { id: 'paint', name: 'Paint Plans', count: blueprints.filter(bp => bp.type === 'paint').length }
  ];

  // Filter blueprints based on selected project
  const filteredBlueprints = selectedProject === 'all' 
    ? blueprints 
    : blueprints.filter(bp => bp.projectId === selectedProject);

  const handleUploadBlueprint = (blueprint: Blueprint) => {
    setBlueprints(prev => [...prev, blueprint]);
    
    // Update category counts
    const categoryIndex = blueprintCategories.findIndex(cat => cat.id === blueprint.type);
    if (categoryIndex !== -1) {
      blueprintCategories[categoryIndex].count += 1;
    }
  };

  const getProjectNameById = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const handleDownloadBlueprint = (blueprint: Blueprint) => {
    toast({
      title: "Download Started",
      description: `${blueprint.name} is being downloaded`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Blueprint Viewer</h1>
          <p className="text-gray-400">Access all construction plans and technical drawings</p>
        </div>
        <div className="flex items-center space-x-2">
          <FileImage className="h-5 w-5 text-blue-400" />
          <span className="text-sm text-gray-400">{filteredBlueprints.length} blueprints</span>
        </div>
      </div>

      {/* Project Filter */}
      <div className="flex justify-between items-center">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[300px] bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Projects</SelectItem>
            {mockProjects.map(project => (
              <SelectItem key={project.id} value={project.id} className="text-white">
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Blueprint
        </Button>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {blueprintCategories.map(category => (
          <Card key={category.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <FileImage className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="font-semibold text-white">{category.name}</p>
              <p className="text-2xl font-bold text-blue-400">{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blueprint Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="elevation" className="text-white data-[state=active]:bg-blue-600">Elevations</TabsTrigger>
          <TabsTrigger value="structure" className="text-white data-[state=active]:bg-blue-600">Structural</TabsTrigger>
          <TabsTrigger value="electrical" className="text-white data-[state=active]:bg-blue-600">Electrical</TabsTrigger>
          <TabsTrigger value="paint" className="text-white data-[state=active]:bg-blue-600">Paint</TabsTrigger>
        </TabsList>

        {blueprintCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlueprints
                .filter(bp => bp.type === category.id)
                .map(blueprint => (
                <Card key={blueprint.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">{blueprint.name}</CardTitle>
                        <p className="text-gray-400 text-sm">{getProjectNameById(blueprint.projectId)}</p>
                      </div>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        v{Math.floor(Math.random() * 3) + 1}.{Math.floor(Math.random() * 9) + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Blueprint Preview */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group">
                          {blueprint.imageUrl ? (
                            <img 
                              src={blueprint.imageUrl} 
                              alt={blueprint.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=800&h=600&fit=crop';
                              }}
                            />
                          ) : (
                            <FileImage className="h-16 w-16 text-gray-600" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <ZoomIn className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
                        <DialogHeader>
                          <DialogTitle className="text-white">{blueprint.name}</DialogTitle>
                        </DialogHeader>
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                          <img 
                            src={blueprint.imageUrl} 
                            alt={blueprint.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=800&h=600&fit=crop';
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <div>Uploaded: {new Date(blueprint.uploadDate).toLocaleDateString()}</div>
                          <div>{getProjectNameById(blueprint.projectId)}</div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="text-xs text-gray-500">
                      Updated: {new Date(blueprint.uploadDate).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400/10">
                        <ZoomIn className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-gray-600 text-gray-400 hover:bg-gray-700"
                        onClick={() => handleDownloadBlueprint(blueprint)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredBlueprints.filter(bp => bp.type === category.id).length === 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="text-center py-12">
                  <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg font-medium text-gray-400">No blueprints available</p>
                  <p className="text-sm text-gray-500">Upload blueprints by clicking the Upload button above</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Blueprint Upload Modal */}
      <BlueprintUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadBlueprint}
        projectId={selectedProject !== 'all' ? selectedProject : ''}
        initialType={activeTab}
      />
    </div>
  );
};

export default Blueprints;
