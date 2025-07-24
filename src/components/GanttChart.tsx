
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'delayed' | 'pending';
  assignee: string;
}

interface GanttChartProps {
  tasks: GanttTask[];
  projectName: string;
  viewMode?: 'weekly' | 'monthly';
  onViewModeChange?: (mode: 'weekly' | 'monthly') => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, projectName, viewMode = 'monthly', onViewModeChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'delayed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'delayed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'pending': return <Calendar className="h-4 w-4 text-yellow-400" />;
      default: return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{projectName} - Progress Timeline</h2>
          <p className="text-gray-400">Track milestones and task completion</p>
        </div>
        
        {onViewModeChange && (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant={viewMode === 'weekly' ? 'default' : 'outline'} 
              className={viewMode === 'weekly' ? 'bg-blue-600' : 'border-gray-700 text-gray-300'}
              onClick={() => onViewModeChange('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={viewMode === 'monthly' ? 'default' : 'outline'} 
              className={viewMode === 'monthly' ? 'bg-blue-600' : 'border-gray-700 text-gray-300'}
              onClick={() => onViewModeChange('monthly')}
            >
              Monthly
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{task.name}</h3>
                  <p className="text-sm text-gray-400">Assigned to: {task.assignee}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Start Date</p>
                  <p className="text-sm text-white">{new Date(task.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">End Date</p>
                  <p className="text-sm text-white">{new Date(task.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
