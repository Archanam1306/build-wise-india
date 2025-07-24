import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OrderMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: number;
    name: string;
    unit: string;
    vendor?: string;
  } | null;
  onOrder: (materialId: number, quantity: number, vendor: string, expectedDelivery: string) => void;
}

const OrderMaterialModal: React.FC<OrderMaterialModalProps> = ({ 
  isOpen, 
  onClose, 
  material, 
  onOrder 
}) => {
  const [quantity, setQuantity] = useState(0);
  const [vendor, setVendor] = useState(material?.vendor || '');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [orderSlip, setOrderSlip] = useState<File | null>(null);

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

    if (!vendor.trim()) {
      toast({
        title: "Error",
        description: "Please provide a vendor name",
        variant: "destructive",
      });
      return;
    }

    if (!expectedDelivery) {
      toast({
        title: "Error",
        description: "Please select an expected delivery date",
        variant: "destructive",
      });
      return;
    }

    onOrder(material.id, quantity, vendor, expectedDelivery);
    toast({
      title: "Success!",
      description: `Order placed for ${material.name}`,
    });
    
    // Reset form
    setQuantity(0);
    setVendor(material?.vendor || '');
    setExpectedDelivery('');
    setOrderSlip(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOrderSlip(e.target.files[0]);
    }
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Order More - {material.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material-name" className="text-gray-200">Material Name</Label>
            <Input
              id="material-name"
              value={material.name}
              className="bg-gray-800 border-gray-700 text-white"
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-gray-200">Quantity to Order</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
                min="1"
                placeholder="Enter quantity"
              />
              <span className="text-gray-400">{material.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor" className="text-gray-200">Vendor Name</Label>
            <Input
              id="vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter vendor name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-delivery" className="text-gray-200">Expected Delivery Date</Label>
            <div className="relative">
              <Input
                id="expected-delivery"
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                min={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order-slip" className="text-gray-200">Upload Order Slip (Optional)</Label>
            <Input
              id="order-slip"
              type="file"
              onChange={handleFileChange}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {orderSlip && (
              <p className="text-xs text-green-400 mt-1">
                File selected: {orderSlip.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderMaterialModal;