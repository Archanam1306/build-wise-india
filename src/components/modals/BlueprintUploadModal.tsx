
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProjects } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { FileImage, Upload, X } from 'lucide-react';

interface BlueprintUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
  projectId?: string;
  initialType?: string;
}

const BlueprintUploadModal: React.FC<BlueprintUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  projectId = '', 
  initialType = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    projectId: projectId,
    category: initialType,
    file: null as File | null,
    previewUrl: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        file,
        previewUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFormData({
      ...formData,
      file: null,
      previewUrl: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.projectId || !formData.category || !formData.file) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload a file",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would upload the file to a storage service here
    // For our mock app, we'll just pretend it worked
    
    const blueprint = {
      id: `bp${Date.now()}`,
      name: formData.name,
      type: formData.category as 'elevation' | 'electrical' | 'paint' | 'structure',
      imageUrl: formData.previewUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
      uploadDate: new Date().toISOString().split('T')[0],
      projectId: formData.projectId
    };

    onUpload(blueprint);
    
    toast({
      title: "Blueprint Uploaded",
      description: `${formData.name} has been added to the project`,
    });

    // Reset form
    setFormData({
      name: '',
      projectId: '',
      category: '',
      file: null,
      previewUrl: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Upload Blueprint</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project" className="text-gray-200">Project</Label>
            <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id} className="text-white">
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-200">Blueprint Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Front Elevation Plan"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-200">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="elevation" className="text-white">Elevation</SelectItem>
                <SelectItem value="structure" className="text-white">Structural</SelectItem>
                <SelectItem value="electrical" className="text-white">Electrical</SelectItem>
                <SelectItem value="paint" className="text-white">Paint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-gray-200">Blueprint File</Label>
            {!formData.previewUrl ? (
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                   onClick={() => document.getElementById('file')?.click()}>
                <FileImage className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-400 mb-2">Click to browse or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={formData.previewUrl} 
                    alt="Blueprint preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="destructive" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-700 hover:bg-gray-800">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Blueprint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlueprintUploadModal;
