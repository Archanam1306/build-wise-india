
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { Upload, Camera, Calendar, X } from 'lucide-react';

const SiteManagerDailyUpdates = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    caption: '',
    images: [] as string[]
  });
  const [recentUpdates, setRecentUpdates] = useState(() => {
    const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
    return assignedProjects.flatMap(project => 
      project.dailyUpdates.map(update => ({
        ...update,
        projectName: project.name
      }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  });

  const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
  const activeProject = assignedProjects.find(project => project.status === 'In Progress') || assignedProjects[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.caption || formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload at least one image",
        variant: "destructive",
      });
      return;
    }

    const newUpdate = {
      id: `du${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: formData.category as any,
      caption: formData.caption,
      images: formData.images,
      uploadedBy: user?.name || 'Site Manager',
      projectName: activeProject?.name || 'Project'
    };

    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
    setFormData({ category: '', caption: '', images: [] });
    
    toast({
      title: "Success!",
      description: "Daily update uploaded successfully",
    });
  };

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

  if (!activeProject) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Upload Daily Updates</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Daily Updates</h1>
        <p className="text-gray-400">Share progress updates for {activeProject.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              New Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-200">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
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

              <div className="space-y-2">
                <Label htmlFor="caption" className="text-gray-200">Progress Description</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  placeholder="Describe the progress made today..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images" className="text-gray-200">Upload Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Update
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                <Camera className="h-5 w-5 text-green-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(update.category)}>
                      {update.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{update.caption}</p>
                  <p className="text-xs text-gray-500">{update.images.length} photos</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteManagerDailyUpdates;
