import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Upload, Camera, Calendar, X } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, doc, addDoc, orderBy, limit } from "firebase/firestore";
import { app } from "../../fireconfig";

const db = getFirestore(app);

const SiteManagerDailyUpdates = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    caption: '',
    images: [] as string[],
    selectedProjectId: ''
  });
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assigned projects and recent updates from dailyUpdates collection
  useEffect(() => {
    const fetchProjectsAndUpdates = async () => {
      if (!user) return;
      setLoading(true);

      // Fetch assigned projects
      const q = query(collection(db, "projects"), where("siteManagerEmail", "==", user.email));
      const querySnapshot = await getDocs(q);
      const projectsData: any[] = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setAssignedProjects(projectsData);

      // Fetch recent updates from dailyUpdates collection for this site manager
      // Removed orderBy("date", "desc") to avoid index requirement
      const updatesQ = query(
        collection(db, "dailyUpdates"),
        where("siteManagerEmail", "==", user.email)
      );
      const updatesSnapshot = await getDocs(updatesQ);
      let updates: any[] = [];
      updatesSnapshot.forEach((doc) => {
        updates.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date descending in JS
      updates = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
      setRecentUpdates(updates);

      setLoading(false);
    };
    fetchProjectsAndUpdates();
  }, [user]);

  const selectedProject = assignedProjects.find(project => project.id === formData.selectedProjectId) || assignedProjects[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    setFormData(prev => ({
      ...prev,
      images: [] // clear images before upload to avoid duplicates
    }));
    
    const uploadedUrls: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        uploadedUrls.push(reader.result as string);
        if (uploadedUrls.length === files.length) {
          setFormData(prev => ({
            ...prev,
            images: uploadedUrls // set base64 strings
          }));
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check for empty values and ensure images is an array with at least one string URL
    if (
      !formData.selectedProjectId ||
      !formData.category ||
      !formData.caption.trim() ||
      !Array.isArray(formData.images) ||
      formData.images.length === 0 ||
      formData.images.some(img => typeof img !== 'string' || !img)
    ) {
      toast({
        title: "Error",
        description: "Please select a project, fill in all fields and upload at least one image",
        variant: "destructive",
      });
      return;
    }

    const project = assignedProjects.find(p => p.id === formData.selectedProjectId);
    if (!project) return;

    const newUpdate = {
      projectId: project.id,
      projectName: project.name,
      siteManagerName: user?.name || 'Site Manager',
      siteManagerEmail: user?.email || '',
      contractorId: project.contractorId || project.contractor_id || '',
      contractorName: project.contractorName || project.contractor_name || '',
      contractorEmail: project.contractorEmail || project.contractor_email || '',
      date: new Date().toISOString(),
      category: formData.category,
      caption: formData.caption.trim(),
      images: formData.images,
    };

    // Add to Firestore dailyUpdates collection
    await addDoc(collection(db, "dailyUpdates"), newUpdate);

    // Optimistically update UI
    setRecentUpdates(prev => [{ ...newUpdate, id: `du${Date.now()}` }, ...prev.slice(0, 9)]);
    setFormData({ category: '', caption: '', images: [], selectedProjectId: formData.selectedProjectId });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center text-gray-400">
        Loading your assigned projects...
      </div>
    );
  }

  if (assignedProjects.length === 0) {
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
        <p className="text-gray-400 mb-4">Share progress updates for your assigned projects</p>
        
        {/* All Projects Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {assignedProjects.map((project) => (
            <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold text-sm">{project.name}</h3>
                  <Badge className={
                    project.status === 'In Progress' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    project.status === 'Planning' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-red-500/20 text-red-300 border-red-500/30'
                  }>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-gray-400 text-xs mb-2">{project.location}</p>
                <div className="text-xs text-gray-500">
                  Progress: {project.progress || 0}%
                </div>
                <Button
                  size="sm"
                  variant={formData.selectedProjectId === project.id ? "default" : "outline"}
                  className={`w-full mt-2 ${formData.selectedProjectId === project.id ? 'bg-green-600 hover:bg-green-700' : 'border-green-400 text-green-400 hover:bg-green-400/10'}`}
                  onClick={() => setFormData({...formData, selectedProjectId: project.id})}
                >
                  {formData.selectedProjectId === project.id ? 'Selected' : 'Select for Update'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Project Details */}
        {selectedProject && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold text-lg mb-2">
              Uploading update for: <span className="text-green-400">{selectedProject.name}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-white">{selectedProject.location}</p>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <p className="text-white">{selectedProject.status}</p>
              </div>
              <div>
                <span className="text-gray-400">Progress:</span>
                <p className="text-white">{selectedProject.progress || 0}%</p>
              </div>
              <div>
                <span className="text-gray-400">Budget:</span>
                <p className="text-white">₹{(selectedProject.totalBudget / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </div>
        )}
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
                <Label htmlFor="project" className="text-gray-200">Select Project *</Label>
                <Select 
                  value={formData.selectedProjectId} 
                  onValueChange={(value) => setFormData({...formData, selectedProjectId: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {assignedProjects.map(project => (
                      <SelectItem key={project.id} value={project.id} className="text-white">
                        {project.name} - {project.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  <div className="text-xs text-gray-400 mb-1">
                    Project: <span className="font-semibold text-blue-300">{update.projectName}</span>
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
