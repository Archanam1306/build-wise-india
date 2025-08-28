import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Camera, User, Clock, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../fireconfig";

const db = getFirestore(app);

// const mockDailyUpdates = [
//   {
//     id: 'DU-001',
//     date: '2024-01-20',
//     images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
//     caption: 'Foundation work completed successfully. Ready for next phase.',
//     category: 'Foundation',
//     uploadedBy: 'John Smith',
//     project: 'Modern Villa Construction',
//     timestamp: '2024-01-20T10:30:00Z'
//   },
//   {
//     id: 'DU-002',
//     date: '2024-01-19',
//     images: ['/placeholder.svg', '/placeholder.svg'],
//     caption: 'Electrical wiring installation in progress on second floor.',
//     category: 'Electrical',
//     uploadedBy: 'Mike Johnson',
//     project: 'Modern Villa Construction',
//     timestamp: '2024-01-19T14:15:00Z'
//   },
//   {
//     id: 'DU-003',
//     date: '2024-01-18',
//     images: ['/placeholder.svg'],
//     caption: 'Plumbing rough-in completed for all bathrooms.',
//     category: 'Plumbing',
//     uploadedBy: 'Sarah Davis',
//     project: 'Modern Villa Construction',
//     timestamp: '2024-01-18T16:45:00Z'
//   },
//   {
//     id: 'DU-004',
//     date: '2024-01-17',
//     images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
//     caption: 'Roofing installation progressing well. Weather conditions favorable.',
//     category: 'Roofing',
//     uploadedBy: 'Tom Wilson',
//     project: 'Modern Villa Construction',
//     timestamp: '2024-01-17T09:20:00Z'
//   }
// ];

const DailyUpdates: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [customerProjects, setCustomerProjects] = useState<any[]>([]);
  const [allUpdates, setAllUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Foundation', 'Framing', 'Roofing', 'Electrical', 'Plumbing', 'Painting', 'General'];

  useEffect(() => {
    const fetchProjectsAndUpdates = async () => {
      if (!user) return;
      setLoading(true);

      // Fetch projects where customer ID matches current user
      const projectsQ = query(
        collection(db, "projects"),
        where("customerId", "==", user.id)
      );
      const projectsSnapshot = await getDocs(projectsQ);
      const projects: any[] = [];
      projectsSnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });
      setCustomerProjects(projects);

      // Get project IDs for this customer
      const projectIds = projects.map(p => p.id);

      // Fetch daily updates for customer's projects
      if (projectIds.length > 0) {
        const updatesQ = query(collection(db, "dailyUpdates"));
        const updatesSnapshot = await getDocs(updatesQ);
        let updates: any[] = [];
        updatesSnapshot.forEach((doc) => {
          const data = doc.data() as { projectId?: string; [key: string]: any };
          const updateData = { id: doc.id, ...data };
          // Filter updates that belong to customer's projects
          if (updateData.projectId && projectIds.includes(updateData.projectId)) {
            updates.push(updateData);
          }
        });
        
        // Sort by date descending
        updates = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAllUpdates(updates);
      }

      setLoading(false);
    };
    fetchProjectsAndUpdates();
  }, [user]);

  const filteredUpdates = allUpdates.filter(update => {
    const matchesSearch = update.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Foundation': 'bg-orange-500',
      'Framing': 'bg-blue-500',
      'Roofing': 'bg-red-500',
      'Electrical': 'bg-yellow-500',
      'Plumbing': 'bg-cyan-500',
      'Painting': 'bg-purple-500',
      'General': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center text-gray-400">
        Loading your project updates...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Daily Updates</h1>
        <p className="text-gray-400">View daily progress updates from your construction projects</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Updates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpdates.map((update) => (
          <Card key={update.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white text-sm">{formatDate(update.date)}</span>
                </div>
                <Badge variant="secondary" className={`${getCategoryColor(update.category)} text-white`}>
                  {update.category}
                </Badge>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Project: {update.projectName}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Images Preview */}
              <div className="grid grid-cols-2 gap-2">
                {(update.images || []).slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-700 rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`Update ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop';
                      }}
                    />
                    {index === 3 && (update.images || []).length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">+{(update.images || []).length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Caption */}
              <p className="text-gray-300 text-sm line-clamp-3">{update.caption}</p>

              {/* Meta Information */}
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Site Manager: {update.siteManagerName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(update.date)}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => setSelectedUpdate(update)}
              >
                <Camera className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUpdates.length === 0 && !loading && (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium text-gray-400">No updates found</p>
          <p className="text-sm text-gray-500">
            {allUpdates.length === 0 ? 'No projects assigned to you yet' : 'Try adjusting your search or filters'}
          </p>
        </div>
      )}

      {/* Update Details Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl">Daily Update Details</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(selectedUpdate.date)}</span>
                    </div>
                    <Badge variant="secondary" className={`${getCategoryColor(selectedUpdate.category)} text-white`}>
                      {selectedUpdate.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Project: {selectedUpdate.projectName}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedUpdate(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Images Gallery */}
              <div>
                <h3 className="text-white font-medium mb-3">Progress Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(selectedUpdate.images || []).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-700 rounded-md overflow-hidden">
                      <img
                        src={image}
                        alt={`Progress ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-white font-medium mb-2">Description</h3>
                <p className="text-gray-300">{selectedUpdate.caption}</p>
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-1">Site Manager</h4>
                  <p className="text-gray-400">{selectedUpdate.siteManagerName}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Project</h4>
                  <p className="text-gray-400">{selectedUpdate.projectName}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Time</h4>
                  <p className="text-gray-400">{formatTime(selectedUpdate.date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DailyUpdates;
