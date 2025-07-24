
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  FileImage, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  ZoomIn, 
  Filter 
} from 'lucide-react';

// Mock data for blueprints
const mockBlueprints = [
  {
    id: 'BP-001',
    type: 'structure',
    name: 'Ground Floor Structural Plan',
    imageUrl: '/placeholder.svg',
    uploadDate: '2024-01-15',
    uploadedBy: 'John Smith',
    project: 'Modern Villa Construction',
    version: '1.0',
    status: 'approved'
  },
  {
    id: 'BP-002',
    type: 'elevation',
    name: 'Front Elevation Design',
    imageUrl: '/placeholder.svg',
    uploadDate: '2024-01-14',
    uploadedBy: 'Sarah Johnson',
    project: 'Modern Villa Construction',
    version: '2.1',
    status: 'approved'
  },
  {
    id: 'BP-003',
    type: 'electrical',
    name: 'Electrical Layout - First Floor',
    imageUrl: '/placeholder.svg',
    uploadDate: '2024-01-13',
    uploadedBy: 'Mike Wilson',
    project: 'Modern Villa Construction',
    version: '1.2',
    status: 'approved'
  },
  {
    id: 'BP-004',
    type: 'paint',
    name: 'Interior Paint Scheme',
    imageUrl: '/placeholder.svg',
    uploadDate: '2024-01-12',
    uploadedBy: 'Emily Davis',
    project: 'Modern Villa Construction',
    version: '1.0',
    status: 'approved'
  },
  {
    id: 'BP-005',
    type: 'structure',
    name: 'Foundation Plan',
    imageUrl: '/placeholder.svg',
    uploadDate: '2024-01-10',
    uploadedBy: 'Tom Anderson',
    project: 'Modern Villa Construction',
    version: '1.1',
    status: 'approved'
  },
  {
    id: 'BP-006',
    type: 'elevation',
    name: 'Side Elevation Views',
    imageUrl: '/placeholder.svg',
    uploadDate: '2024-01-09',
    uploadedBy: 'Lisa Brown',
    project: 'Modern Villa Construction',
    version: '1.0',
    status: 'approved'
  }
];

const Blueprints: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBlueprint, setSelectedBlueprint] = useState<any>(null);

  const types = ['structure', 'elevation', 'electrical', 'paint'];

  const filteredBlueprints = mockBlueprints.filter(blueprint => {
    const matchesSearch = blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || blueprint.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'structure':
        return 'bg-blue-500';
      case 'elevation':
        return 'bg-green-500';
      case 'electrical':
        return 'bg-yellow-500';
      case 'paint':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    return <FileImage className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (blueprint: any) => {
    // In a real app, this would download the actual file
    console.log('Downloading blueprint:', blueprint.name);
  };

  const handleView = (blueprint: any) => {
    setSelectedBlueprint(blueprint);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Blueprints</h1>
        <p className="text-gray-400">View and download project blueprints and technical drawings</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlueprints.map((blueprint) => (
          <Card key={blueprint.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className={`${getTypeColor(blueprint.type)} text-white`}>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(blueprint.type)}
                    {blueprint.type}
                  </div>
                </Badge>
                <span className="text-xs text-gray-400">v{blueprint.version}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Blueprint Preview */}
              <div className="aspect-video bg-gray-700 rounded-md overflow-hidden relative group">
                <img
                  src={blueprint.imageUrl}
                  alt={blueprint.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    onClick={() => handleView(blueprint)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Blueprint Info */}
              <div>
                <h3 className="text-white font-medium mb-1">{blueprint.name}</h3>
                <p className="text-gray-400 text-sm">{blueprint.project}</p>
              </div>

              {/* Meta Information */}
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Uploaded by {blueprint.uploadedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Uploaded on {formatDate(blueprint.uploadDate)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => handleView(blueprint)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => handleDownload(blueprint)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blueprint Viewer Modal */}
      {selectedBlueprint && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white text-xl font-semibold">{selectedBlueprint.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className={`${getTypeColor(selectedBlueprint.type)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(selectedBlueprint.type)}
                        {selectedBlueprint.type}
                      </div>
                    </Badge>
                    <span className="text-gray-400 text-sm">Version {selectedBlueprint.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    onClick={() => handleDownload(selectedBlueprint)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedBlueprint(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-auto">
              <div className="bg-white rounded-lg p-4 mb-4">
                <img
                  src={selectedBlueprint.imageUrl}
                  alt={selectedBlueprint.name}
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="text-white font-medium mb-1">Uploaded By</h4>
                  <p className="text-gray-400">{selectedBlueprint.uploadedBy}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Upload Date</h4>
                  <p className="text-gray-400">{formatDate(selectedBlueprint.uploadDate)}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Project</h4>
                  <p className="text-gray-400">{selectedBlueprint.project}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blueprints;
