import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../fireconfig";
import { 
  Calendar, MapPin, CreditCard, Camera, Upload, 
  AlertTriangle, CheckCircle, Clock, Users 
} from 'lucide-react';

const db = getFirestore(app);

const SiteManagerDashboard = () => {
  const { user } = useAuth();
  const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      // Fetch projects where siteManagerEmail matches logged-in user's email
      const q = query(collection(db, "projects"), where("siteManagerEmail", "==", user.email));
      const querySnapshot = await getDocs(q);
      const projectsData: any[] = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setAssignedProjects(projectsData);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  const activeProject = assignedProjects.find(project => project.status === 'In Progress') || assignedProjects[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center text-gray-400">
        Loading your assigned projects...
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Site Manager Dashboard</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  const pendingPayments = (activeProject.payments || []).filter((p: any) => p.status === 'pending').length;
  const recentUpdates = (activeProject.dailyUpdates || []).slice(0, 3);
  const lowStockMaterials = (activeProject.materials || []).filter((m: any) => m.quantity <= m.threshold);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Site Manager Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Assigned Projects</p>
                  <p className="text-2xl font-bold text-white">{assignedProjects.length}</p>
                </div>
                <div className="p-2 rounded-full bg-green-500/20">
                  <Users className="h-4 w-4 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-white">{assignedProjects.filter(p => p.status === 'In Progress').length}</p>
                </div>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Planning</p>
                  <p className="text-2xl font-bold text-white">{assignedProjects.filter(p => p.status === 'Planning').length}</p>
                </div>
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <Clock className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">On Hold</p>
                  <p className="text-2xl font-bold text-white">{assignedProjects.filter(p => p.status === 'On Hold').length}</p>
                </div>
                <div className="p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Assigned Projects */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Assigned Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedProjects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.location}
                    </div>
                    <Badge className={
                      project.status === 'In Progress' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      project.status === 'Planning' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Budget</p>
                    <p className="text-lg font-semibold text-white">₹{(project.totalBudget / 100000).toFixed(1)}L</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-400">Start Date</p>
                    <p className="text-white">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Est. Completion</p>
                    <p className="text-white">{project.estimatedCompletion ? new Date(project.estimatedCompletion).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-300 mb-3">{project.description}</p>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Contractor: {project.contractorName || 'Unknown'}
                  </div>
                  <div className="flex gap-2">
                    <Link to="/site-manager/daily-updates">
                      <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10">
                        <Upload className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    </Link>
                    <Link to="/site-manager/payments">
                      <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Payment
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/site-manager/daily-updates">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Update
                </Button>
              </Link>
              <Link to="/site-manager/payments">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Raise Payment
                </Button>
              </Link>
              <Link to="/site-manager/materials">
                <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400/10">
                  View Materials
                </Button>
              </Link>
              <Link to="/site-manager/gantt">
                <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400/10">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteManagerDashboard;
       