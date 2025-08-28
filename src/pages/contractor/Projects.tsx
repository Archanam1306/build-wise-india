import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../fireconfig";
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectDetailsModal from '@/components/modals/ProjectDetailsModal';
import { Project } from '@/types';

const db = getFirestore(app);

const ContractorProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch only projects belonging to this contractor
        const q = query(
          collection(db, "projects"), 
          where("contractorEmail", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        const projectsData: any[] = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        setProjects(projectsData as Project[]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
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
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Projects</h1>
          <p className="text-gray-400">Manage your construction projects</p>
        </div>
        <Link to="/contractor/create-project">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
            <SelectItem value="Completed" className="text-white">Completed</SelectItem>
            <SelectItem value="On Hold" className="text-white">On Hold</SelectItem>
            <SelectItem value="Planning" className="text-white">Planning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Projects ({filteredProjects.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading projects...</div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-white text-xl">{project.name}</CardTitle>
                    <div className="flex items-center text-gray-400 text-sm">
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
                <p className="text-gray-300 text-sm">{project.description}</p>
                
                {/* Assigned Site Manager */}
                {project.siteManagerId && (
                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <User className="h-4 w-4" />
                    Site Manager ID: {project.siteManagerId}
                  </div>
                )}

                {/* Assigned Customer */}
                {project.customerId && project.customerId !== "none" && (
                  <div className="flex items-center gap-2 text-green-300 text-sm">
                    <User className="h-4 w-4" />
                    Customer ID: {project.customerId}
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white">{project.progress ? project.progress : 0}%</span>
                  </div>
                  <Progress value={project.progress ? project.progress : 0} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Total Budget</p>
                      <p className="text-white font-medium">₹{project.totalBudget ? (Number(project.totalBudget) / 100000).toFixed(1) : "0"}L</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount Spent</p>
                      <p className="text-white font-medium">₹{project.spentAmount ? (Number(project.spentAmount) / 100000).toFixed(1) : "0"}L</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Start Date</p>
                      <p className="text-white font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Est. Completion</p>
                      <p className="text-white font-medium">{project.estimatedCompletion ? new Date(project.estimatedCompletion).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Updated: {project.lastUpdate ? new Date(project.lastUpdate).toLocaleDateString() : "-"}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                      onClick={() => handleViewDetails(project)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-12">
              <div className="text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No projects found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal 
        project={selectedProject} 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
      />
    </div>
  );
};

export default ContractorProjects;
