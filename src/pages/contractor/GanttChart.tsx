import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/data/mockData';
import { BarChart3, Calendar, Clock, AlertTriangle } from 'lucide-react';
import GanttChartVisual from '@/components/GanttChartVisual';
import { toast } from '@/hooks/use-toast';

const ContractorGanttChart = () => {
  const [selectedProject, setSelectedProject] = useState('p1');
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('monthly');

  const selectedProjectData = mockProjects.find(p => p.id === selectedProject);

  // Fetch tasks dynamically based on the selected project
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call like:
    // GET /gantt-data?project_id=${selectedProject}&view_mode=${viewMode}
    
    // For now, simulate different tasks for different projects and view modes
    const mockTasks = [
      { 
        id: '1', 
        name: 'Site Preparation', 
        startDate: '2023-10-01', 
        endDate: '2023-10-15', 
        progress: 100, 
        status: 'completed', 
        dependencies: [],
        assignee: 'Ramesh Sharma'
      },
      { 
        id: '2', 
        name: 'Foundation Work', 
        startDate: '2023-10-16', 
        endDate: '2023-11-30', 
        progress: 100, 
        status: 'completed', 
        dependencies: ['1'],
        assignee: 'Suresh Kumar'
      },
      { 
        id: '3', 
        name: selectedProject === 'p1' ? 'Ground Floor Construction' : 'Basement Construction', 
        startDate: '2023-12-01', 
        endDate: '2024-02-15', 
        progress: selectedProject === 'p1' ? 85 : 65, 
        status: 'in-progress', 
        dependencies: ['2'],
        assignee: 'Manjunath R'
      },
      { 
        id: '4', 
        name: selectedProject === 'p1' ? 'First Floor Construction' : 'Ground Floor Construction', 
        startDate: '2024-02-16', 
        endDate: '2024-04-30', 
        progress: selectedProject === 'p1' ? 30 : 0, 
        status: selectedProject === 'p1' ? 'in-progress' : 'pending', 
        dependencies: ['3'],
        assignee: 'Vikram Singh'
      },
      { 
        id: '5', 
        name: 'Electrical Wiring', 
        startDate: '2024-04-01', 
        endDate: '2024-04-20', 
        progress: selectedProject === 'p1' ? 10 : 0, 
        status: selectedProject === 'p1' ? 'delayed' : 'pending', 
        dependencies: ['4'],
        assignee: 'Priya Desai'
      }
    ];

    // Filter tasks for weekly view to show fewer tasks
    if (viewMode === 'weekly') {
      setTasks(mockTasks.filter(task => 
        task.status === 'in-progress' || 
        task.status === 'delayed' || 
        (task.status === 'pending' && new Date(task.startDate) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
      ));
      toast({
        title: "Weekly View",
        description: "Showing tasks for the next two weeks",
      });
    } else {
      setTasks(mockTasks);
    }
  }, [selectedProject, viewMode]);

  if (!selectedProjectData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Project Timeline</h1>
          <p className="text-gray-400">No project selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Timeline</h1>
          <p className="text-gray-400">Track progress and milestones</p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full md:w-[250px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {mockProjects.map(project => (
                <SelectItem key={project.id} value={project.id} className="text-white">
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Summary */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">{selectedProjectData.name} Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-lg font-medium text-white">{new Date(selectedProjectData.startDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Estimated Completion</p>
              <p className="text-lg font-medium text-white">{new Date(selectedProjectData.estimatedCompletion).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Budget</p>
              <p className="text-lg font-medium text-white">₹{selectedProjectData.totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['completed', 'in-progress', 'pending', 'delayed'].map(status => {
          const count = tasks.filter(t => t.status === status).length;
          
          return (
            <Card key={status} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 capitalize">{status.replace('-', ' ')}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                    status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {status === 'completed' ? <BarChart3 className="h-4 w-4" /> :
                     status === 'in-progress' ? <Clock className="h-4 w-4" /> :
                     status === 'pending' ? <Calendar className="h-4 w-4" /> :
                     <AlertTriangle className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gantt Chart Component */}
      {tasks.length > 0 ? (
        <GanttChartVisual 
          tasks={tasks} 
          projectName={selectedProjectData.name} 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
            <p className="text-gray-400">No tasks have been added for this project yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractorGanttChart;