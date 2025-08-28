import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../fireconfig";
import { 
  Calendar, MapPin, CreditCard, Eye, CheckCircle, 
  Clock, AlertCircle, Camera, Palette, Phone 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const db = getFirestore(app);

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState<any[]>([]);
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

      setMyProjects(projectsData);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">Loading your projects...</div>
    );
  }

  if (!myProjects.length) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Customer Dashboard</h1>
          <p className="text-gray-400">No projects found for your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
        <p className="text-gray-400">Track your construction project progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myProjects.map((project) => {
          const pendingPayments = (project.payments || []).filter((p: any) => p.status === 'pending').length;
          const recentUpdates = (project.dailyUpdates || []).slice(0, 3);
          const completedTasks = (project.ganttTasks || []).filter((t: any) => t.status === 'completed').length;
          const totalTasks = (project.ganttTasks || []).length;

          return (
            <Card key={project.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-2xl">{project.name}</CardTitle>
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.location}
                    </div>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-lg px-3 py-1">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Overall Progress</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{project.progress}% Complete</span>
                        <span className="text-gray-400">{completedTasks}/{totalTasks} tasks</span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Budget Status</p>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-white">
                        ₹{(project.spentAmount / 100000).toFixed(1)}L / ₹{(project.totalBudget / 100000).toFixed(1)}L
                      </p>
                      <p className="text-xs text-gray-500">
                        {((project.spentAmount / project.totalBudget) * 100).toFixed(1)}% utilized
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Timeline</p>
                    <div className="space-y-1">
                      <p className="text-sm text-white">Started: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</p>
                      <p className="text-sm text-white">Est. Completion: {project.estimatedCompletion ? new Date(project.estimatedCompletion).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Pending Approvals</p>
                          <p className="text-2xl font-bold text-white">{pendingPayments}</p>
                        </div>
                        <div className="p-2 rounded-full bg-yellow-500/20">
                          <Clock className="h-4 w-4 text-yellow-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Recent Updates</p>
                          <p className="text-2xl font-bold text-white">{recentUpdates.length}</p>
                        </div>
                        <div className="p-2 rounded-full bg-orange-500/20">
                          <Camera className="h-4 w-4 text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Blueprints</p>
                          <p className="text-2xl font-bold text-white">{(project.blueprints || []).length}</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-500/20">
                          <Eye className="h-4 w-4 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Contacts</p>
                          <p className="text-2xl font-bold text-white">{(project.contacts || []).length}</p>
                        </div>
                        <div className="p-2 rounded-full bg-green-500/20">
                          <Phone className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboard;
