
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/types';
import { mockUsers } from '@/data/mockData';
import { 
  Building, MapPin, Calendar, User, Briefcase, 
  Clock, CreditCard, Box, FileImage, ListChecks 
} from 'lucide-react';

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

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

  // Get site manager
  const siteManager = mockUsers.find(user => user.id === project.siteManagerId);
  
  // Get customer
  const customer = mockUsers.find(user => user.id === project.customerId);

  // Count blueprints by category
  const blueprintCounts = {
    elevation: project.blueprints.filter(bp => bp.type === 'elevation').length,
    electrical: project.blueprints.filter(bp => bp.type === 'electrical').length,
    paint: project.blueprints.filter(bp => bp.type === 'paint').length,
    structure: project.blueprints.filter(bp => bp.type === 'structure').length,
    total: project.blueprints.length
  };

  // Calculate pending tasks
  const pendingTasks = project.ganttTasks.filter(task => 
    task.status === 'pending' || task.status === 'in-progress'
  ).length;

  // Calculate material usage summary
  const totalMaterials = project.materials.length;
  const lowStockMaterials = project.materials.filter(m => m.quantity <= m.threshold).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Project Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-400" />
                {project.name}
              </h2>
              <div className="flex items-center text-gray-400 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {project.location}
              </div>
              <div className="text-sm text-gray-500 mt-1">Project ID: {project.id}</div>
            </div>
            <Badge className={`${getStatusColor(project.status)} text-sm px-3 py-1`}>
              {project.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Timeline */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    Project Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Start Date</p>
                      <p className="text-white">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Est. Completion</p>
                      <p className="text-white">{new Date(project.estimatedCompletion).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white">{new Date(project.lastUpdate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 flex-1" />
                        <span className="text-white">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    Project Team
                  </h3>
                  <div className="space-y-3">
                    {siteManager && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white">{siteManager.name}</p>
                          <p className="text-xs text-gray-400">Site Manager</p>
                        </div>
                        <div className="text-xs text-gray-400">{siteManager.email}</div>
                      </div>
                    )}
                    {customer && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white">{customer.name}</p>
                          <p className="text-xs text-gray-400">Customer</p>
                        </div>
                        <div className="text-xs text-gray-400">{customer.email}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Finance */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
                    Financial Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Total Budget</p>
                      <p className="text-white font-medium">{formatCurrency(project.totalBudget)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount Spent</p>
                      <p className="text-white font-medium">{formatCurrency(project.spentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Remaining</p>
                      <p className="text-white font-medium">{formatCurrency(project.totalBudget - project.spentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Spend %</p>
                      <p className="text-white font-medium">
                        {Math.round((project.spentAmount / project.totalBudget) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Project Description */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-400" />
                    Description
                  </h3>
                  <p className="text-gray-300 text-sm">{project.description || "No description provided."}</p>
                </CardContent>
              </Card>

              {/* Materials */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <Box className="h-4 w-4 mr-2 text-blue-400" />
                    Materials Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Total Materials</p>
                      <p className="text-white">{totalMaterials} items</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Low Stock</p>
                      <p className="text-white">{lowStockMaterials} items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blueprints */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <FileImage className="h-4 w-4 mr-2 text-blue-400" />
                    Blueprints
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Elevation Plans</p>
                      <p className="text-white">{blueprintCounts.elevation} files</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Electrical Plans</p>
                      <p className="text-white">{blueprintCounts.electrical} files</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Structural Plans</p>
                      <p className="text-white">{blueprintCounts.structure} files</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Paint Plans</p>
                      <p className="text-white">{blueprintCounts.paint} files</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white flex items-center">
                    <ListChecks className="h-4 w-4 mr-2 text-blue-400" />
                    Tasks Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Total Tasks</p>
                      <p className="text-white">{project.ganttTasks.length} tasks</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pending Tasks</p>
                      <p className="text-white">{pendingTasks} tasks</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Completed Tasks</p>
                      <p className="text-white">{project.ganttTasks.length - pendingTasks} tasks</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Completion Rate</p>
                      <p className="text-white">
                        {Math.round(((project.ganttTasks.length - pendingTasks) / project.ganttTasks.length) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
