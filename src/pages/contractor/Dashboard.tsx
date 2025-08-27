import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Building, Users, CreditCard, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../fireconfig";
import { useAuth } from '@/contexts/AuthContext';

const db = getFirestore(app);

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      const q = query(collection(db, "projects"), where("contractorId", "==", user.id));
      const querySnapshot = await getDocs(q);
      const projectsData: any[] = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsData);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.totalBudget) || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (Number(p.spentAmount) || 0), 0);

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

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Contractor Dashboard</h1>
            <p className="text-gray-400">Overview of all construction projects</p>
          </div>
          <Link to="/contractor/create-project">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Projects</CardTitle>
              <Building className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalProjects}</div>
              <p className="text-xs text-gray-400">Active portfolio</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeProjects}</div>
              <p className="text-xs text-gray-400">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedProjects}</div>
              <p className="text-xs text-gray-400">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Budget</CardTitle>
              <CreditCard className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalBudget)}</div>
              <p className="text-xs text-gray-400">{formatCurrency(totalSpent)} spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">All Projects</h2>
            <Link to="/contractor/projects">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                View All Projects
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading projects...</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{project.location}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Project Image */}
                  <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
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
                      <span className="text-white">{project.progress ? project.progress : 0}%</span>
                    </div>
                    <Progress 
                      value={project.progress ? project.progress : 0} 
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Budget</p>
                      <p className="text-white font-medium">{formatCurrency(Number(project.totalBudget) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Spent</p>
                      <p className="text-white font-medium">{formatCurrency(Number(project.spentAmount) || 0)}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last updated: {project.lastUpdate ? new Date(project.lastUpdate).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
