
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { 
  Calendar, MapPin, CreditCard, Camera, Upload, 
  AlertTriangle, CheckCircle, Clock, Users 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SiteManagerDashboard = () => {
  const { user } = useAuth();
  
  // Find projects assigned to this site manager
  const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
  const activeProject = assignedProjects.find(project => project.status === 'In Progress') || assignedProjects[0];

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

  const pendingPayments = activeProject.payments.filter(p => p.status === 'pending').length;
  const recentUpdates = activeProject.dailyUpdates.slice(0, 3);
  const lowStockMaterials = activeProject.materials.filter(m => m.quantity <= m.threshold);

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
                  <p className="text-sm text-gray-400">Pending Payments</p>
                  <p className="text-2xl font-bold text-white">{pendingPayments}</p>
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
                  <p className="text-sm text-gray-400">Low Stock Items</p>
                  <p className="text-2xl font-bold text-white">{lowStockMaterials.length}</p>
                </div>
                <div className="p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">{activeProject.progress}%</p>
                </div>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Project */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{activeProject.name}</h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activeProject.location}
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  {activeProject.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Budget</p>
                <p className="text-lg font-semibold text-white">₹{(activeProject.totalBudget / 100000).toFixed(1)}L</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{activeProject.progress}%</span>
              </div>
              <Progress value={activeProject.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Start Date</p>
                <p className="text-white">{new Date(activeProject.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Est. Completion</p>
                <p className="text-white">{new Date(activeProject.estimatedCompletion).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Updates */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Recent Updates</CardTitle>
              <Link to="/site-manager/daily-updates">
                <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Camera className="h-5 w-5 text-green-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">{update.category}</Badge>
                      <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{update.caption}</p>
                    <p className="text-xs text-gray-500">{update.images.length} photos</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Material Alerts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Material Alerts</CardTitle>
              <Link to="/site-manager/materials">
                <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowStockMaterials.length > 0 ? (
                lowStockMaterials.slice(0, 3).map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{material.name}</p>
                      <p className="text-sm text-gray-400">{material.quantity} {material.unit} remaining</p>
                    </div>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      Low Stock
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">All materials are well stocked</p>
              )}
            </CardContent>
          </Card>
        </div>

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
