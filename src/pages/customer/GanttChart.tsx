
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Pause, 
  Play,
  Filter,
  BarChart3
} from 'lucide-react';

// Mock data for gantt tasks
const mockTasks = [
  {
    id: 'T-001',
    name: 'Site Preparation',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    progress: 100,
    status: 'completed',
    assignee: 'John Smith',
    dependencies: [],
    comments: ['Site cleared and ready for construction'],
    category: 'Foundation'
  },
  {
    id: 'T-002',
    name: 'Foundation Excavation',
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    progress: 100,
    status: 'completed',
    assignee: 'Mike Johnson',
    dependencies: ['T-001'],
    comments: ['Excavation completed as per specifications'],
    category: 'Foundation'
  },
  {
    id: 'T-003',
    name: 'Foundation Pouring',
    startDate: '2024-01-20',
    endDate: '2024-02-10',
    progress: 85,
    status: 'in-progress',
    assignee: 'Sarah Davis',
    dependencies: ['T-002'],
    comments: ['Concrete pouring in progress', 'Weather delays encountered'],
    category: 'Foundation'
  },
  {
    id: 'T-004',
    name: 'Ground Floor Framing',
    startDate: '2024-02-05',
    endDate: '2024-02-25',
    progress: 45,
    status: 'in-progress',
    assignee: 'Tom Wilson',
    dependencies: ['T-003'],
    comments: ['Framing started on schedule'],
    category: 'Framing'
  },
  {
    id: 'T-005',
    name: 'Electrical Rough-in',
    startDate: '2024-02-20',
    endDate: '2024-03-15',
    progress: 0,
    status: 'pending',
    assignee: 'David Brown',
    dependencies: ['T-004'],
    comments: [],
    category: 'Electrical'
  },
  {
    id: 'T-006',
    name: 'Plumbing Rough-in',
    startDate: '2024-02-20',
    endDate: '2024-03-10',
    progress: 0,
    status: 'pending',
    assignee: 'Lisa Anderson',
    dependencies: ['T-004'],
    comments: [],
    category: 'Plumbing'
  },
  {
    id: 'T-007',
    name: 'Roof Installation',
    startDate: '2024-03-01',
    endDate: '2024-03-20',
    progress: 0,
    status: 'delayed',
    assignee: 'Robert Johnson',
    dependencies: ['T-004'],
    comments: ['Delayed due to material shortage'],
    category: 'Roofing'
  }
];

const GanttChart: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Foundation', 'Framing', 'Electrical', 'Plumbing', 'Roofing'];

  const filteredTasks = selectedCategory === 'all' 
    ? mockTasks 
    : mockTasks.filter(task => task.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Play className="h-4 w-4" />;
      case 'delayed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pending':
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Foundation': 'bg-orange-500',
      'Framing': 'bg-blue-500',
      'Electrical': 'bg-yellow-500',
      'Plumbing': 'bg-cyan-500',
      'Roofing': 'bg-red-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStats = () => {
    const stats = {
      total: mockTasks.length,
      completed: mockTasks.filter(t => t.status === 'completed').length,
      inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
      delayed: mockTasks.filter(t => t.status === 'delayed').length,
      pending: mockTasks.filter(t => t.status === 'pending').length
    };
    return stats;
  };

  const stats = getTaskStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Project Timeline</h1>
        <p className="text-gray-400">Track project progress and task dependencies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm">Total Tasks</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.delayed}</div>
              <div className="text-gray-400 text-sm">Delayed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{stats.pending}</div>
              <div className="text-gray-400 text-sm">Pending</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tasks Timeline */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{task.name}</h3>
                    <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        {task.status.replace('-', ' ')}
                      </div>
                    </Badge>
                    <Badge variant="outline" className={`${getCategoryColor(task.category)} text-white border-0`}>
                      {task.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{calculateDuration(task.startDate, task.endDate)} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  
                  {task.dependencies.length > 0 && (
                    <div className="text-sm text-gray-400">
                      <span>Dependencies: {task.dependencies.join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="lg:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    onClick={() => setSelectedTask(task)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl">{selectedTask.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={`${getStatusColor(selectedTask.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedTask.status)}
                        {selectedTask.status.replace('-', ' ')}
                      </div>
                    </Badge>
                    <Badge variant="outline" className={`${getCategoryColor(selectedTask.category)} text-white border-0`}>
                      {selectedTask.category}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-1">Start Date</h4>
                      <p className="text-gray-400">{formatDate(selectedTask.startDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">End Date</h4>
                      <p className="text-gray-400">{formatDate(selectedTask.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-1">Duration</h4>
                      <p className="text-gray-400">{calculateDuration(selectedTask.startDate, selectedTask.endDate)} days</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Assignee</h4>
                      <p className="text-gray-400">{selectedTask.assignee}</p>
                    </div>
                  </div>
                  
                  {selectedTask.dependencies.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-1">Dependencies</h4>
                      <p className="text-gray-400">{selectedTask.dependencies.join(', ')}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="progress" className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Current Progress</h4>
                    <div className="space-y-2">
                      <Progress value={selectedTask.progress} className="h-3" />
                      <p className="text-center text-white">{selectedTask.progress}% Complete</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-1">Status</h4>
                    <Badge variant="secondary" className={`${getStatusColor(selectedTask.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedTask.status)}
                        {selectedTask.status.replace('-', ' ')}
                      </div>
                    </Badge>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments" className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Activity Log</h4>
                    {selectedTask.comments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTask.comments.map((comment: string, index: number) => (
                          <div key={index} className="bg-gray-700 p-3 rounded-md">
                            <p className="text-gray-300">{comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No comments available</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GanttChart;
