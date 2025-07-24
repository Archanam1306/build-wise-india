import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';

interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'delayed' | 'pending';
  assignee: string;
  dependencies?: string[];
}

interface GanttChartVisualProps {
  tasks: GanttTask[];
  projectName: string;
  viewMode?: 'weekly' | 'monthly';
  onViewModeChange?: (mode: 'weekly' | 'monthly') => void;
}

const GanttChartVisual: React.FC<GanttChartVisualProps> = ({ 
  tasks, 
  projectName, 
  viewMode = 'monthly', 
  onViewModeChange 
}) => {
  // Calculate timeline parameters
  const timeline = useMemo(() => {
    if (tasks.length === 0) return { startDate: new Date(), endDate: new Date(), totalDays: 30 };
    
    const dates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return { startDate, endDate, totalDays };
  }, [tasks]);

  // Generate time periods for timeline
  const timePeriods = useMemo(() => {
    const periods = [];
    const { startDate, totalDays } = timeline;
    const periodLength = viewMode === 'weekly' ? 7 : 30;
    
    for (let i = 0; i < totalDays; i += periodLength) {
      const periodStart = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const periodEnd = new Date(periodStart.getTime() + (periodLength - 1) * 24 * 60 * 60 * 1000);
      periods.push({
        start: periodStart,
        end: periodEnd > timeline.endDate ? timeline.endDate : periodEnd,
        label: viewMode === 'weekly' 
          ? `W${Math.floor(i/7) + 1}`
          : periodStart.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return periods;
  }, [timeline, viewMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateTaskPosition = (task: GanttTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const { startDate, totalDays } = timeline;
    
    const startOffset = Math.max(0, (taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24);
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.max(2, (duration / totalDays) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  if (tasks.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Timeline Data</h3>
          <p className="text-gray-400">No tasks have been scheduled for this project yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{projectName} - Project Timeline</h2>
          <p className="text-gray-400">Interactive Gantt chart with task dependencies</p>
        </div>
        
        {onViewModeChange && (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant={viewMode === 'weekly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onViewModeChange('weekly')}
              className={viewMode === 'weekly' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Weekly View
            </Button>
            <Button 
              variant={viewMode === 'monthly' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => onViewModeChange('monthly')}
              className={viewMode === 'monthly' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Monthly View
            </Button>
          </div>
        )}
      </div>

      {/* Gantt Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Timeline Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Timeline Header */}
          <div className="border-b border-gray-800 p-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 text-sm font-medium text-gray-400">Task</div>
              <div className="col-span-8">
                <div className="flex">
                  {timePeriods.map((period, index) => (
                    <div 
                      key={index} 
                      className="flex-1 text-center text-xs text-gray-400 border-l border-gray-700 px-1"
                    >
                      {period.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="space-y-0">
            {tasks.map((task, taskIndex) => {
              const position = calculateTaskPosition(task);
              
              return (
                <div 
                  key={task.id} 
                  className={`grid grid-cols-12 gap-2 p-4 hover:bg-gray-800/50 transition-colors ${
                    taskIndex !== tasks.length - 1 ? 'border-b border-gray-800' : ''
                  }`}
                >
                  {/* Task Info */}
                  <div className="col-span-4 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getStatusColor(task.status)}/20 text-white`}>
                        {getStatusIcon(task.status)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{task.name}</div>
                        <div className="text-xs text-gray-400">{task.assignee}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs ${
                          task.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                          task.status === 'delayed' ? 'bg-red-500/20 text-red-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-400">{task.progress}%</span>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="col-span-8 relative">
                    <div className="h-8 relative bg-gray-800 rounded">
                      {/* Grid Lines */}
                      {timePeriods.map((_, index) => (
                        <div 
                          key={index}
                          className="absolute top-0 bottom-0 border-l border-gray-700"
                          style={{ left: `${(index / timePeriods.length) * 100}%` }}
                        />
                      ))}
                      
                      {/* Task Bar */}
                      <div
                        className={`absolute top-1 bottom-1 rounded ${getStatusColor(task.status)} flex items-center justify-between px-2`}
                        style={position}
                      >
                        <span className="text-xs text-white font-medium truncate">
                          {task.progress}%
                        </span>
                        {task.status === 'in-progress' && (
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      {/* Progress Overlay */}
                      {task.progress > 0 && task.status !== 'completed' && (
                        <div
                          className="absolute top-1 bottom-1 bg-green-500/30 rounded-l"
                          style={{
                            left: position.left,
                            width: `${(parseFloat(position.width.replace('%', '')) * task.progress) / 100}%`
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Task Dates */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{new Date(task.startDate).toLocaleDateString()}</span>
                      <span>{new Date(task.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['completed', 'in-progress', 'pending', 'delayed'].map(status => {
          const count = tasks.filter(t => t.status === status).length;
          const percentage = Math.round((count / tasks.length) * 100);
          
          return (
            <Card key={status} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 capitalize">{status.replace('-', ' ')}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-gray-500">{percentage}% of tasks</p>
                  </div>
                  <div className={`p-2 rounded-full ${getStatusColor(status)}/20`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChartVisual;