
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: number;
    name: string;
    quantity: number;
    unit: string;
  } | null;
  onUpdate: (id: number, newQuantity: number) => void;
}

const UpdateStockModal: React.FC<UpdateStockModalProps> = ({ isOpen, onClose, material, onUpdate }) => {
  const [quantity, setQuantity] = useState(material?.quantity || 0);

  const handleSubmit = () => {
    if (!material) return;
    
    if (quantity < 0) {
      toast({
        title: "Error",
        description: "Quantity cannot be negative",
        variant: "destructive",
      });
      return;
    }

    onUpdate(material.id, quantity);
    toast({
      title: "Success!",
      description: `Stock updated for ${material.name}`,
    });
    onClose();
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Update Stock - {material.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-gray-200">Current Stock</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                min="0"
              />
              <span className="text-gray-400">{material.unit}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Update Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStockModal;
