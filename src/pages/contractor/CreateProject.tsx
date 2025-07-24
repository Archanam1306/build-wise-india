import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, ArrowLeft, User } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    status: 'Planning',
    totalBudget: '',
    estimatedCompletion: '',
    siteManagerName: '',
    siteManagerEmail: '',
    customerId: ''
  });

  // Get available customers (those without assigned projects)
  const availableCustomers = mockUsers.filter(user => 
    user.role === 'customer' && 
    (!user.assignedProjects || user.assignedProjects.length === 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.totalBudget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.siteManagerName && !formData.siteManagerEmail) {
      toast({
        title: "Error",
        description: "Please provide site manager email",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    if (formData.siteManagerEmail && !/^\S+@\S+\.\S+$/.test(formData.siteManagerEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address for the site manager",
        variant: "destructive",
      });
      return;
    }

    // Simulate project creation
    let assignedSiteManager;
    
    // Check if we need to create a new site manager or use existing one
    if (formData.siteManagerName && formData.siteManagerEmail) {
      const existingSiteManager = mockUsers.find(u => 
        u.role === 'site-manager' && u.email === formData.siteManagerEmail
      );
      
      if (existingSiteManager) {
        assignedSiteManager = existingSiteManager;
      } else {
        // This would create a new site manager in a real app
        assignedSiteManager = {
          id: `sm${Date.now()}`,
          name: formData.siteManagerName,
          email: formData.siteManagerEmail,
          role: 'site-manager' as const,
          phone: "N/A"
        };
      }
    } else {
      // If no site manager details provided, assign a random one
      const siteManagers = mockUsers.filter(u => u.role === 'site-manager');
      assignedSiteManager = siteManagers[Math.floor(Math.random() * siteManagers.length)];
    }

    // Get assigned customer if one was selected
    let assignedCustomer;
    if (formData.customerId) {
      assignedCustomer = mockUsers.find(u => u.id === formData.customerId);
    }

    toast({
      title: "Project Created!",
      description: `${formData.name} has been created and assigned to ${assignedSiteManager.name}${assignedCustomer ? ` and customer ${assignedCustomer.name}` : ''}`,
    });

    // Navigate back to projects
    navigate('/contractor/projects');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/contractor/projects')}
          className="border-gray-700 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Project</h1>
          <p className="text-gray-400">Add a new construction project to your portfolio</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Sunrise Villas"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-200">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Whitefield, Bangalore"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-200">Initial Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Planning" className="text-white">Planning</SelectItem>
                    <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                    <SelectItem value="On Hold" className="text-white">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-gray-200">Total Budget (₹) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({...formData, totalBudget: e.target.value})}
                  placeholder="e.g., 4500000"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion" className="text-gray-200">Estimated Completion</Label>
                <Input
                  id="completion"
                  type="date"
                  value={formData.estimatedCompletion}
                  onChange={(e) => setFormData({...formData, estimatedCompletion: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer" className="text-gray-200">Assign Customer</Label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData({...formData, customerId: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="none" className="text-white">None</SelectItem>
                    {availableCustomers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id} className="text-white">
                        {customer.name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-800 pt-6 mt-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Site Manager Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteManagerName" className="text-gray-200">Site Manager Name</Label>
                  <Input
                    id="siteManagerName"
                    value={formData.siteManagerName}
                    onChange={(e) => setFormData({...formData, siteManagerName: e.target.value})}
                    placeholder="Enter name"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteManagerEmail" className="text-gray-200">Site Manager Email</Label>
                  <Input
                    id="siteManagerEmail"
                    type="email"
                    value={formData.siteManagerEmail}
                    onChange={(e) => setFormData({...formData, siteManagerEmail: e.target.value})}
                    placeholder="email@example.com"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                * If left empty, a random site manager will be assigned
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the project..."
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Project
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/contractor/projects')}
                className="border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProject;
