
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import GanttChart from '@/components/GanttChart';

const SiteManagerGanttChart = () => {
  const { user } = useAuth();

  const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
  const activeProject = assignedProjects.find(project => project.status === 'In Progress') || assignedProjects[0];

  // Mock Gantt tasks for the project
  const mockTasks = [
    {
      id: '1',
      name: 'Foundation Work',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      progress: 100,
      status: 'completed' as const,
      assignee: 'Foundation Team'
    },
    {
      id: '2',
      name: 'Structural Framework',
      startDate: '2024-01-16',
      endDate: '2024-02-15',
      progress: 75,
      status: 'in-progress' as const,
      assignee: 'Steel Team'
    },
    {
      id: '3',
      name: 'Electrical Installation',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      progress: 45,
      status: 'in-progress' as const,
      assignee: 'Electrical Team'
    },
    {
      id: '4',
      name: 'Plumbing Installation',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      progress: 20,
      status: 'pending' as const,
      assignee: 'Plumbing Team'
    },
    {
      id: '5',
      name: 'Roofing',
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      progress: 0,
      status: 'pending' as const,
      assignee: 'Roofing Team'
    },
    {
      id: '6',
      name: 'Interior Finishing',
      startDate: '2024-04-01',
      endDate: '2024-05-15',
      progress: 0,
      status: 'pending' as const,
      assignee: 'Interior Team'
    }
  ];

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Progress Chart</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <GanttChart tasks={mockTasks} projectName={activeProject.name} />
    </div>
  );
};

export default SiteManagerGanttChart;
