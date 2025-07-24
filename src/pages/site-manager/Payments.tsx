
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Plus, IndianRupee, Calendar } from 'lucide-react';

const SiteManagerPayments = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: ''
  });
  const [paymentRequests, setPaymentRequests] = useState(() => {
    const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
    return assignedProjects.flatMap(project => 
      project.payments.map(payment => ({
        ...payment,
        projectName: project.name
      }))
    ).sort((a, b) => new Date(b.raisedDate).getTime() - new Date(a.raisedDate).getTime());
  });

  const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
  const activeProject = assignedProjects.find(project => project.status === 'In Progress') || assignedProjects[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.amount || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newPayment = {
      id: `pay${Date.now()}`,
      amount: parseInt(formData.amount),
      type: formData.type as any,
      status: 'pending' as any,
      description: formData.description,
      raisedDate: new Date().toISOString().split('T')[0],
      raisedBy: user?.name || 'Site Manager',
      projectId: activeProject?.id || '',
      projectName: activeProject?.name || 'Project'
    };

    setPaymentRequests(prev => [newPayment, ...prev]);
    setFormData({ type: '', amount: '', description: '' });
    
    toast({
      title: "Success!",
      description: `Payment request for ${formatCurrency(parseInt(formData.amount))} has been raised`,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'approved': 'bg-green-500/20 text-green-300 border-green-500/30',
      'rejected': 'bg-red-500/20 text-red-300 border-red-500/30',
      'paid': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };
    return colors[status] || colors['pending'];
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'labour': 'bg-orange-100 text-orange-800',
      'materials': 'bg-purple-100 text-purple-800',
      'machinery': 'bg-blue-100 text-blue-800',
      'advance': 'bg-green-100 text-green-800'
    };
    return colors[type] || colors['labour'];
  };

  if (!activeProject) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Raise Payment Request</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Raise Payment Request</h1>
        <p className="text-gray-400">Request payments for {activeProject.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              New Payment Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-200">Payment Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="labour" className="text-white">Labour</SelectItem>
                    <SelectItem value="materials" className="text-white">Materials</SelectItem>
                    <SelectItem value="machinery" className="text-white">Machinery</SelectItem>
                    <SelectItem value="advance" className="text-white">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-200">Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-200">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this payment is for..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Raise Payment Request
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentRequests.slice(0, 5).map((payment) => (
              <div key={payment.id} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    <Badge variant="secondary" className={getTypeColor(payment.type)}>
                      {payment.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-lg font-bold text-white">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{payment.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(payment.raisedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteManagerPayments;
