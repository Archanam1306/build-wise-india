import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { Upload, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SiteManagerBlueprints = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');

  // Show all mock projects if user is not set or no projects assigned by id
  const assignedProjects = React.useMemo(() => {
    if (!user) return mockProjects;
    const byId = mockProjects.filter(project => project.siteManagerId === user?.id);
    const byEmail = mockProjects.filter(project => project.siteManagerId === user?.email);
    // Merge and deduplicate by project id
    const all = [...byId, ...byEmail].filter(
      (proj, idx, arr) => arr.findIndex(p => p.id === proj.id) === idx
    );
    return all.length > 0 ? all : mockProjects;
  }, [user]);

  // Get all blueprints from assigned projects
  const allBlueprints = assignedProjects.flatMap(project => 
    project.blueprints.map(blueprint => ({
      ...blueprint,
      projectName: project.name
    }))
  );

  // Filter blueprints based on search and filters
  const filteredBlueprints = allBlueprints.filter(blueprint => {
    const matchesSearch = blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || blueprint.type === typeFilter;
    const matchesProject = selectedProject === 'all' || blueprint.projectId === selectedProject;
    
    return matchesSearch && matchesType && matchesProject;
  });

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Blueprint upload functionality would be implemented here",
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'elevation': 'bg-blue-100 text-blue-800',
      'electrical': 'bg-yellow-100 text-yellow-800',
      'paint': 'bg-purple-100 text-purple-800',
      'structure': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (assignedProjects.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Project Blueprints</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Blueprints</h1>
          <p className="text-gray-400">View and manage blueprints for your assigned projects</p>
        </div>
        <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Blueprint
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-gray-200">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search blueprints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Projects</SelectItem>
                  {assignedProjects.map(project => (
                    <SelectItem key={project.id} value={project.id} className="text-white">
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="elevation" className="text-white">Elevation</SelectItem>
                  <SelectItem value="electrical" className="text-white">Electrical</SelectItem>
                  <SelectItem value="paint" className="text-white">Paint</SelectItem>
                  <SelectItem value="structure" className="text-white">Structure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Results</Label>
              <div className="flex items-center h-10 px-3 bg-gray-800 border border-gray-700 rounded-md">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-white">{filteredBlueprints.length} blueprints</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlueprints.map((blueprint) => (
          <Card key={blueprint.id} className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-white text-lg">{blueprint.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{blueprint.projectName}</p>
                </div>
                <Badge className={getTypeColor(blueprint.type)}>
                  {blueprint.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={blueprint.imageUrl} 
                  alt={blueprint.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                    const fallback = document.createElement('div');
                    fallback.className = 'text-gray-400 text-center';
                    fallback.innerHTML = '<svg class="h-12 w-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>Image not available';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
              <div className="text-sm text-gray-400">
                <p>Uploaded: {new Date(blueprint.uploadDate).toLocaleDateString()}</p>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => window.open(blueprint.imageUrl, '_blank')}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                View Full Size
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlueprints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No blueprints found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SiteManagerBlueprints;
