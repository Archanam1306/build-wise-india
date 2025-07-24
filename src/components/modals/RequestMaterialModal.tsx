
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface RequestMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: number;
    name: string;
    unit: string;
  } | null;
  onRequest: (materialId: number, quantity: number, reason: string) => void;
}

const RequestMaterialModal: React.FC<RequestMaterialModalProps> = ({ isOpen, onClose, material, onRequest }) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!material) return;
    
    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the request",
        variant: "destructive",
      });
      return;
    }

    onRequest(material.id, quantity, reason);
    toast({
      title: "Success!",
      description: `Material request submitted for ${material.name}`,
    });
    setQuantity(0);
    setReason('');
    onClose();
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Request Material - {material.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-gray-200">Quantity Needed</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                min="1"
                placeholder="Enter quantity"
              />
              <span className="text-gray-400">{material.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-200">Reason for Request</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Explain why this material is needed..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestMaterialModal;
