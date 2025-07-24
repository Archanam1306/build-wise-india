
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { IndianRupee, Search, Filter, Calendar, User } from 'lucide-react';

const CustomerPayments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Get projects assigned to this customer
  const customerProjects = mockProjects.filter(project => project.customerId === user?.id);

  // Get all payments from customer's projects
  const allPayments = customerProjects.flatMap(project => 
    project.payments.map(payment => ({
      ...payment,
      projectName: project.name
    }))
  ).sort((a, b) => new Date(b.raisedDate).getTime() - new Date(a.raisedDate).getTime());

  // Filter payments based on search and filters
  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    const matchesProject = projectFilter === 'all' || payment.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesProject;
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalPending = filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalApproved = filteredPayments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  if (customerProjects.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Payment Requests</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Payment Requests</h1>
        <p className="text-gray-400">Track payment requests for your projects</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-300 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(totalPending)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-yellow-500/20">
                <IndianRupee className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-300 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(totalApproved)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-500/20">
                <IndianRupee className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Paid</p>
                <p className="text-2xl font-bold text-blue-300 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-500/20">
                <IndianRupee className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-gray-200">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Project</Label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Projects</SelectItem>
                  {customerProjects.map(project => (
                    <SelectItem key={project.id} value={project.id} className="text-white">
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="pending" className="text-white">Pending</SelectItem>
                  <SelectItem value="approved" className="text-white">Approved</SelectItem>
                  <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
                  <SelectItem value="paid" className="text-white">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="labour" className="text-white">Labour</SelectItem>
                  <SelectItem value="materials" className="text-white">Materials</SelectItem>
                  <SelectItem value="machinery" className="text-white">Machinery</SelectItem>
                  <SelectItem value="advance" className="text-white">Advance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Results</Label>
              <div className="flex items-center h-10 px-3 bg-gray-800 border border-gray-700 rounded-md">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-white">{filteredPayments.length} payments</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                  <Badge variant="secondary" className={getTypeColor(payment.type)}>
                    {payment.type}
                  </Badge>
                  <span className="text-sm text-gray-400">{payment.projectName}</span>
                </div>
                <div className="flex items-center text-xl font-bold text-white">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(payment.amount)}
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">{payment.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Raised: {new Date(payment.raisedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  By: {payment.raisedBy}
                </div>
                {payment.approvedDate && (
                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Approved: {new Date(payment.approvedDate).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center text-gray-400">
                  Status: <span className={`ml-1 capitalize ${payment.status === 'approved' ? 'text-green-400' : payment.status === 'paid' ? 'text-blue-400' : payment.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No payment requests found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerPayments;
