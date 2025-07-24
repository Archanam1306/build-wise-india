
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProjects } from '@/data/mockData';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import UpdateStockModal from '@/components/modals/UpdateStockModal';
import OrderMaterialModal from '@/components/modals/OrderMaterialModal';
import AddMaterialModal from '@/components/modals/AddMaterialModal';

const Materials = () => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const mockMaterials = [
    { id: 1, name: 'Cement (50kg bags)', project: 'Sunrise Villas', quantity: 120, unit: 'bags', threshold: 20, cost: 350, lastUpdated: '2024-01-07', status: 'good' },
    { id: 2, name: 'Steel Rods (12mm)', project: 'Sunrise Villas', quantity: 8, unit: 'tons', threshold: 15, cost: 55000, lastUpdated: '2024-01-06', status: 'low' },
    { id: 3, name: 'Bricks (Red Clay)', project: 'Skyline Estate', quantity: 5000, unit: 'pieces', threshold: 1000, cost: 8, lastUpdated: '2024-01-06', status: 'good' },
    { id: 4, name: 'Sand (River Sand)', project: 'Skyline Estate', quantity: 25, unit: 'loads', threshold: 5, cost: 1200, lastUpdated: '2024-01-05', status: 'good' },
    { id: 5, name: 'Paint (Exterior)', project: 'Palm Court', quantity: 2, unit: 'liters', threshold: 10, cost: 850, lastUpdated: '2024-01-07', status: 'critical' },
    { id: 6, name: 'Tiles (Ceramic)', project: 'Palm Court', quantity: 45, unit: 'sq.ft', threshold: 20, cost: 65, lastUpdated: '2024-01-04', status: 'good' },
    { id: 7, name: 'Electrical Wire', project: 'Lakeview Residency', quantity: 500, unit: 'meters', threshold: 100, cost: 12, lastUpdated: '2023-12-30', status: 'good' },
    { id: 8, name: 'PVC Pipes', project: 'Greenfield Towers', quantity: 45, unit: 'pieces', threshold: 25, cost: 125, lastUpdated: '2023-12-15', status: 'good' }
  ];

  const [materials, setMaterials] = useState(mockMaterials);

  const filteredMaterials = materials.filter(material => {
    const matchesProject = selectedProject === 'all' || material.project === selectedProject;
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const handleUpdateStock = (id: number, newQuantity: number) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => {
        if (material.id === id) {
          const newStatus = 
            newQuantity <= material.threshold / 2 ? 'critical' :
            newQuantity <= material.threshold ? 'low' : 'good';
          
          return {
            ...material,
            quantity: newQuantity,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return material;
      })
    );
    setUpdateModalOpen(false);
  };

  const handleOrderMaterial = (materialId: number, quantity: number, vendor: string, expectedDelivery: string) => {
    toast({
      title: "Order Placed",
      description: `Order for ${quantity} units placed with ${vendor}. Expected delivery: ${expectedDelivery}`,
    });
    setOrderModalOpen(false);
  };

  const handleAddMaterial = (newMaterial: any) => {
    setMaterials(prevMaterials => [...prevMaterials, newMaterial]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (material: any) => {
    if (material.quantity <= material.threshold / 2) {
      return <AlertTriangle className="h-4 w-4 text-red-400" />;
    } else if (material.quantity <= material.threshold) {
      return <TrendingDown className="h-4 w-4 text-yellow-400" />;
    }
    return <TrendingUp className="h-4 w-4 text-green-400" />;
  };

  const statusCounts = {
    good: filteredMaterials.filter(m => m.status === 'good').length,
    low: filteredMaterials.filter(m => m.status === 'low').length,
    critical: filteredMaterials.filter(m => m.status === 'critical').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Materials Management</h1>
          <p className="text-gray-400">Track inventory and stock levels across all projects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-white">{filteredMaterials.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Good Stock</p>
                <p className="text-2xl font-bold text-green-400">{statusCounts.good}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-400">{statusCounts.low}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{statusCounts.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-[250px] bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Projects</SelectItem>
            {mockProjects.map(project => (
              <SelectItem key={project.id} value={project.name} className="text-white">
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{material.name}</h3>
                  <p className="text-sm text-gray-400">{material.project}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(material)}
                  <Badge className={getStatusColor(material.status)}>
                    {material.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Current Stock</p>
                  <p className="text-lg font-bold text-white">{material.quantity} {material.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Threshold</p>
                  <p className="text-lg font-bold text-orange-400">{material.threshold} {material.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Unit Cost: ₹{material.cost}</span>
                <span className="text-gray-400">Updated: {material.lastUpdated}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400/10"
                  onClick={() => {
                    setSelectedMaterial(material);
                    setUpdateModalOpen(true);
                  }}
                >
                  Update Stock
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-green-400 text-green-400 hover:bg-green-400/10"
                  onClick={() => {
                    setSelectedMaterial(material);
                    setOrderModalOpen(true);
                  }}
                >
                  Order More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-gray-400">No materials found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or add new materials</p>
          </CardContent>
        </Card>
      )}

      {/* Update Stock Modal */}
      <UpdateStockModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        material={selectedMaterial}
        onUpdate={handleUpdateStock}
      />

      {/* Order Material Modal */}
      <OrderMaterialModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        material={selectedMaterial}
        onOrder={handleOrderMaterial}
      />

      {/* Add Material Modal */}
      <AddMaterialModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddMaterial}
      />
    </div>
  );
};

export default Materials;
