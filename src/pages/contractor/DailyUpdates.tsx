
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockProjects } from '@/data/mockData';
import { Calendar, Camera, Eye, Filter, ZoomIn } from 'lucide-react';
import DailyUpdateDetailsModal from '@/components/modals/DailyUpdateDetailsModal';
import { DailyUpdate } from '@/types';

const DailyUpdates = () => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUpdate, setSelectedUpdate] = useState<(DailyUpdate & { projectName: string, projectId: string }) | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Get all daily updates from all projects
  const allUpdates = mockProjects.flatMap(project => 
    project.dailyUpdates.map(update => ({
      ...update,
      projectName: project.name,
      projectId: project.id
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredUpdates = allUpdates.filter(update => {
    const matchesProject = selectedProject === 'all' || update.projectId === selectedProject;
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
    return matchesProject && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Foundation': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Framing': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Plumbing': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Electrical': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Roofing': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Painting': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'General': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[category] || colors['General'];
  };

  const handleViewDetails = (update: typeof selectedUpdate) => {
    setSelectedUpdate(update);
    setIsDetailsModalOpen(true);
  };

  // Get related updates for the selected update
  const getRelatedUpdates = () => {
    if (!selectedUpdate) return [];
    
    return allUpdates
      .filter(update => update.projectId === selectedUpdate.projectId && update.id !== selectedUpdate.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Updates</h1>
          <p className="text-gray-400">View progress updates from all construction sites</p>
        </div>
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-blue-400" />
          <span className="text-sm text-gray-400">{filteredUpdates.length} updates</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-[250px] bg-gray-900 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by project" />
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Categories</SelectItem>
            <SelectItem value="Foundation" className="text-white">Foundation</SelectItem>
            <SelectItem value="Framing" className="text-white">Framing</SelectItem>
            <SelectItem value="Plumbing" className="text-white">Plumbing</SelectItem>
            <SelectItem value="Electrical" className="text-white">Electrical</SelectItem>
            <SelectItem value="Roofing" className="text-white">Roofing</SelectItem>
            <SelectItem value="Painting" className="text-white">Painting</SelectItem>
            <SelectItem value="General" className="text-white">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Updates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUpdates.map((update) => (
          <Card key={update.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-white text-lg">{update.projectName}</CardTitle>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(update.date).toLocaleDateString()}
                  </div>
                </div>
                <Badge className={getCategoryColor(update.category)}>
                  {update.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-2">
                {update.images.slice(0, 4).map((imageUrl, idx) => (
                  <Dialog key={idx}>
                    <DialogTrigger asChild>
                      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group relative">
                        <img 
                          src={imageUrl}
                          alt={`${update.category} update ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-gray-900 border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-white">{update.category} Progress Image</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <img 
                          src={imageUrl}
                          alt={`${update.category} update ${idx + 1} - Full view`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-gray-300 text-sm">{update.caption}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By: {update.uploadedBy}</span>
                  <span>{update.images.length} photos</span>
                </div>
              </div>

              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10"
                onClick={() => handleViewDetails(update)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-gray-400">No updates found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}

      {/* Daily Update Details Modal */}
      <DailyUpdateDetailsModal 
        update={selectedUpdate} 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        relatedUpdates={getRelatedUpdates()}
      />
    </div>
  );
};

export default DailyUpdates;
