
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Package, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';

// Mock data for materials
const mockMaterials = [
  {
    id: 'MAT-001',
    name: 'Portland Cement',
    quantity: 50,
    unit: 'bags',
    pricePerUnit: 8.50,
    totalCost: 425.00,
    vendor: 'BuildMart Supply',
    purchaseDate: '2024-01-15',
    category: 'Foundation',
    threshold: 10,
    status: 'In Stock'
  },
  {
    id: 'MAT-002',
    name: 'Steel Rebar #4',
    quantity: 100,
    unit: 'pieces',
    pricePerUnit: 12.75,
    totalCost: 1275.00,
    vendor: 'Steel Works Inc',
    purchaseDate: '2024-01-14',
    category: 'Foundation',
    threshold: 20,
    status: 'In Stock'
  },
  {
    id: 'MAT-003',
    name: '2x4 Lumber',
    quantity: 5,
    unit: 'pieces',
    pricePerUnit: 4.50,
    totalCost: 22.50,
    vendor: 'Timber Depot',
    purchaseDate: '2024-01-13',
    category: 'Framing',
    threshold: 15,
    status: 'Low Stock'
  },
  {
    id: 'MAT-004',
    name: 'Electrical Wire 12 AWG',
    quantity: 500,
    unit: 'feet',
    pricePerUnit: 0.85,
    totalCost: 425.00,
    vendor: 'ElectroSupply Co',
    purchaseDate: '2024-01-12',
    category: 'Electrical',
    threshold: 100,
    status: 'In Stock'
  },
  {
    id: 'MAT-005',
    name: 'PVC Pipe 4 inch',
    quantity: 25,
    unit: 'pieces',
    pricePerUnit: 15.25,
    totalCost: 381.25,
    vendor: 'PlumbPro Supply',
    purchaseDate: '2024-01-11',
    category: 'Plumbing',
    threshold: 10,
    status: 'In Stock'
  },
  {
    id: 'MAT-006',
    name: 'Ceramic Tiles',
    quantity: 2,
    unit: 'boxes',
    pricePerUnit: 45.00,
    totalCost: 90.00,
    vendor: 'Tile World',
    purchaseDate: '2024-01-10',
    category: 'Finishing',
    threshold: 5,
    status: 'Low Stock'
  },
  {
    id: 'MAT-007',
    name: 'Roofing Shingles',
    quantity: 0,
    unit: 'bundles',
    pricePerUnit: 35.00,
    totalCost: 0.00,
    vendor: 'RoofMaster Inc',
    purchaseDate: '2024-01-09',
    category: 'Roofing',
    threshold: 10,
    status: 'Out of Stock'
  }
];

const Materials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const categories = ['Foundation', 'Framing', 'Electrical', 'Plumbing', 'Roofing', 'Finishing'];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || material.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500';
      case 'Low Stock':
        return 'bg-yellow-500';
      case 'Out of Stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="h-4 w-4" />;
      case 'Low Stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Out of Stock':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Foundation': 'bg-orange-500',
      'Framing': 'bg-blue-500',
      'Electrical': 'bg-yellow-500',
      'Plumbing': 'bg-cyan-500',
      'Roofing': 'bg-red-500',
      'Finishing': 'bg-purple-500'
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

  const getStockLevel = (quantity: number, threshold: number) => {
    if (quantity === 0) return 0;
    return Math.min((quantity / threshold) * 100, 100);
  };

  const getMaterialStats = () => {
    const stats = {
      totalValue: mockMaterials.reduce((sum, mat) => sum + mat.totalCost, 0),
      totalItems: mockMaterials.length,
      inStock: mockMaterials.filter(mat => mat.status === 'In Stock').length,
      lowStock: mockMaterials.filter(mat => mat.status === 'Low Stock').length,
      outOfStock: mockMaterials.filter(mat => mat.status === 'Out of Stock').length
    };
    return stats;
  };

  const stats = getMaterialStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Materials Inventory</h1>
        <p className="text-gray-400">View project materials and inventory status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Stock</p>
                <p className="text-2xl font-bold text-green-500">{stats.inStock}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-500">{stats.outOfStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search materials..."
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
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{material.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{material.vendor}</p>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(material.status)} text-white`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(material.status)}
                    {material.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Category */}
              <Badge variant="outline" className={`${getCategoryColor(material.category)} text-white border-0`}>
                {material.category}
              </Badge>

              {/* Quantity and Stock Level */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Stock Level</span>
                  <span className="text-white">{material.quantity} {material.unit}</span>
                </div>
                <Progress value={getStockLevel(material.quantity, material.threshold)} className="h-2" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Threshold: {material.threshold}</span>
                  <span>{material.quantity > material.threshold ? 'Good' : 'Low'}</span>
                </div>
              </div>

              {/* Price Information */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Price per {material.unit}</span>
                  <span className="text-white font-medium">${material.pricePerUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Total Value</span>
                  <span className="text-white font-semibold">${material.totalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Purchase Date */}
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar className="h-3 w-3" />
                <span>Purchased: {formatDate(material.purchaseDate)}</span>
              </div>

              <Button 
                variant="outline" 
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => setSelectedMaterial(material)}
              >
                <Package className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Material Details Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl">{selectedMaterial.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={`${getStatusColor(selectedMaterial.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedMaterial.status)}
                        {selectedMaterial.status}
                      </div>
                    </Badge>
                    <Badge variant="outline" className={`${getCategoryColor(selectedMaterial.category)} text-white border-0`}>
                      {selectedMaterial.category}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedMaterial(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Stock Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Stock Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Quantity</span>
                    <span className="text-white">{selectedMaterial.quantity} {selectedMaterial.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Threshold Level</span>
                    <span className="text-white">{selectedMaterial.threshold} {selectedMaterial.unit}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Stock Level</span>
                      <span className="text-white">{getStockLevel(selectedMaterial.quantity, selectedMaterial.threshold).toFixed(0)}%</span>
                    </div>
                    <Progress value={getStockLevel(selectedMaterial.quantity, selectedMaterial.threshold)} className="h-3" />
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Pricing Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per {selectedMaterial.unit}</span>
                    <span className="text-white">${selectedMaterial.pricePerUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Cost</span>
                    <span className="text-white font-semibold">${selectedMaterial.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Vendor Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vendor</span>
                    <span className="text-white">{selectedMaterial.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Purchase Date</span>
                    <span className="text-white">{formatDate(selectedMaterial.purchaseDate)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Materials;
