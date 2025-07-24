import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { mockProjects } from '@/data/mockData';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (material: any) => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [materialName, setMaterialName] = useState('');
  const [project, setProject] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [threshold, setThreshold] = useState('');
  const [cost, setCost] = useState('');

  const units = ['bags', 'tons', 'pieces', 'loads', 'liters', 'sq.ft', 'meters', 'kg'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!materialName || !project || !quantity || !unit || !threshold || !cost) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newMaterial = {
      id: Date.now(),
      name: materialName,
      project: project,
      quantity: parseInt(quantity),
      unit: unit,
      threshold: parseInt(threshold),
      cost: parseFloat(cost),
      lastUpdated: new Date().toISOString().split('T')[0],
      status: parseInt(quantity) <= parseInt(threshold) / 2 ? 'critical' :
              parseInt(quantity) <= parseInt(threshold) ? 'low' : 'good'
    };

    onAdd(newMaterial);
    
    toast({
      title: "Material Added",
      description: `${materialName} has been added to inventory`,
    });

    // Reset form
    setMaterialName('');
    setProject('');
    setQuantity('');
    setUnit('');
    setThreshold('');
    setCost('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Material</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="materialName" className="text-gray-200">Material Name</Label>
            <Input
              id="materialName"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="e.g., Cement (50kg bags)"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project" className="text-gray-200">Project</Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {mockProjects.map(proj => (
                  <SelectItem key={proj.id} value={proj.name} className="text-white">
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-gray-200">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-gray-200">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {units.map(u => (
                    <SelectItem key={u} value={u} className="text-white">
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-gray-200">Threshold Level</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="20"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="text-gray-200">Unit Cost (₹)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="350.00"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Material
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialModal;