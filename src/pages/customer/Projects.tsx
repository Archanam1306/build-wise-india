import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../fireconfig";
import { Calendar, MapPin, Search, Filter, Eye, IndianRupee } from 'lucide-react';

const db = getFirestore(app);

const CustomerProjects = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerProjects, setCustomerProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      // Try to fetch projects where customerId matches user.id
      let q = query(collection(db, "projects"), where("customerId", "==", user.id));
      let querySnapshot = await getDocs(q);
      let projectsData: any[] = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });

      // If no projects found, try matching by customerEmail as fallback
      if (projectsData.length === 0 && user.email) {
        q = query(collection(db, "projects"), where("customerEmail", "==", user.email));
        querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
      }

      setCustomerProjects(projectsData);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  // Filter projects based on search and filters
  const filteredProjects = customerProjects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'On Hold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Planning':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProjectImage = (projectName: string) => {
    const imageMap: Record<string, string> = {
      'Sunrise Villas': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&h=300&fit=crop',
      'Lakeview Residency': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop',
      'Greenfield Towers': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop',
      'Skyline Estate': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&h=300&fit=crop',
      'Palm Court': 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=500&h=300&fit=crop',
      'Ocean Breeze Homes': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop'
    };
    return imageMap[projectName] || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop';
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">Loading your projects...</div>
    );
  }

  if (customerProjects.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">My Projects</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">My Projects</h1>
        <p className="text-gray-400">Track the progress of your construction projects</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-gray-200">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="Planning" className="text-white">Planning</SelectItem>
                  <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                  <SelectItem value="On Hold" className="text-white">On Hold</SelectItem>
                  <SelectItem value="Completed" className="text-white">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Results</Label>
              <div className="flex items-center h-10 px-3 bg-gray-800 border border-gray-700 rounded-md">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-white">{filteredProjects.length} projects</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const completedTasks = (project.ganttTasks || []).filter((t: any) => t.status === 'completed').length;
          const totalTasks = (project.ganttTasks || []).length;
          return (
            <Card key={project.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.location}
                    </div>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Image */}
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={getProjectImage(project.name)}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop';
                    }}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-3 bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Budget</p>
                    <p className="text-white font-medium flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {formatCurrency(project.totalBudget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Spent</p>
                    <p className="text-white font-medium flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {formatCurrency(project.spentAmount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Start Date</p>
                    <p className="text-white">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Est. Completion</p>
                    <p className="text-white">{project.estimatedCompletion ? new Date(project.estimatedCompletion).toLocaleDateString() : "-"}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last updated: {project.lastUpdate ? new Date(project.lastUpdate).toLocaleDateString() : "-"}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Eye className="h-4 w-4 mr-2" />
                  View Project Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerProjects;
