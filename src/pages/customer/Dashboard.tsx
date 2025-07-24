
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { 
  Calendar, MapPin, CreditCard, Eye, CheckCircle, 
  Clock, AlertCircle, Camera, Palette, Phone 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  
  // Find projects assigned to this customer
  const myProjects = mockProjects.filter(project => project.customerId === user?.id);
  const activeProject = myProjects.find(project => project.status === 'In Progress') || myProjects[0];

  if (!activeProject) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Customer Dashboard</h1>
          <p className="text-gray-400">No projects found for your account.</p>
        </div>
      </div>
    );
  }

  const pendingPayments = activeProject.payments.filter(p => p.status === 'pending').length;
  const recentUpdates = activeProject.dailyUpdates.slice(0, 3);
  const completedTasks = activeProject.ganttTasks.filter(t => t.status === 'completed').length;
  const totalTasks = activeProject.ganttTasks.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
        <p className="text-gray-400">Track your construction project progress</p>
      </div>

      {/* Project Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white text-2xl">{activeProject.name}</CardTitle>
              <div className="flex items-center text-gray-400 text-sm mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {activeProject.location}
              </div>
            </div>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-lg px-3 py-1">
              {activeProject.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Overall Progress</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{activeProject.progress}% Complete</span>
                  <span className="text-gray-400">{completedTasks}/{totalTasks} tasks</span>
                </div>
                <Progress value={activeProject.progress} className="h-3" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Budget Status</p>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">₹{(activeProject.spentAmount / 100000).toFixed(1)}L / ₹{(activeProject.totalBudget / 100000).toFixed(1)}L</p>
                <p className="text-xs text-gray-500">{((activeProject.spentAmount / activeProject.totalBudget) * 100).toFixed(1)}% utilized</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Timeline</p>
              <div className="space-y-1">
                <p className="text-sm text-white">Started: {new Date(activeProject.startDate).toLocaleDateString()}</p>
                <p className="text-sm text-white">Est. Completion: {new Date(activeProject.estimatedCompletion).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <p className="text-2xl font-bold text-white">{activeProject.blueprints.length}</p>
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
                <p className="text-2xl font-bold text-white">{activeProject.contacts.length}</p>
              </div>
              <div className="p-2 rounded-full bg-green-500/20">
                <Phone className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Latest Progress Updates</CardTitle>
            <Link to="/customer/daily-updates">
              <Button size="sm" variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400/10">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                <Camera className="h-5 w-5 text-orange-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{update.category}</Badge>
                    <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{update.caption}</p>
                  <p className="text-xs text-gray-500">{update.images.length} photos • By {update.uploadedBy}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Approvals */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Payment Approvals</CardTitle>
            <Link to="/customer/payments">
              <Button size="sm" variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400/10">
                Review All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProject.payments.filter(p => p.status === 'pending').slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{payment.description}</p>
                  <p className="text-xs text-gray-500">{payment.type} • {new Date(payment.raisedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-400/10">Reject</Button>
                </div>
              </div>
            ))}
            {pendingPayments === 0 && (
              <p className="text-gray-400 text-center py-4">No pending payment approvals</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/customer/daily-updates">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Eye className="h-4 w-4 mr-2" />
                View Updates
              </Button>
            </Link>
            <Link to="/customer/payments">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Payments
              </Button>
            </Link>
            <Link to="/customer/blueprints">
              <Button variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400/10">
                View Blueprints
              </Button>
            </Link>
            <Link to="/customer/paint-picker">
              <Button variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400/10">
                <Palette className="h-4 w-4 mr-2" />
                Paint Designs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
