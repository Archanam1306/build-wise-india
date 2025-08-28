import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Filter, Calendar, IndianRupee } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../../fireconfig";

const db = getFirestore(app);

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [contractorProjects, setContractorProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentsAndProjects = async () => {
      if (!user) return;
      setLoading(true);

      // Fetch projects where contractor email matches current user
      const projectsQ = query(
        collection(db, "projects"),
        where("contractorEmail", "==", user.email)
      );
      const projectsSnapshot = await getDocs(projectsQ);
      const projects: any[] = [];
      projectsSnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });
      setContractorProjects(projects);

      // Get project IDs for this contractor
      const projectIds = projects.map(p => p.id);

      // Fetch payment requests for contractor's projects
      if (projectIds.length > 0) {
        const paymentsQ = query(collection(db, "payments"));
        const paymentsSnapshot = await getDocs(paymentsQ);
        let paymentsData: any[] = [];
        paymentsSnapshot.forEach((doc) => {
          const paymentData = { id: doc.id, ...doc.data() } as { id: string; projectId: string; [key: string]: any };
          // Filter payments that belong to contractor's projects
          if (projectIds.includes(paymentData.projectId)) {
            paymentsData.push(paymentData);
          }
        });
        
        // Sort by date descending
        paymentsData = paymentsData.sort((a, b) => new Date(b.raisedDate).getTime() - new Date(a.raisedDate).getTime());
        setPayments(paymentsData);
      }

      setLoading(false);
    };
    fetchPaymentsAndProjects();
  }, [user]);

  const handlePaymentAction = async (paymentId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // Update payment status in Firestore
      await updateDoc(doc(db, "payments", paymentId), {
        status: newStatus,
        approvedDate: action === 'approve' ? new Date().toISOString() : undefined,
        approvedBy: user?.name || 'Contractor'
      });

      // Update local state
      setPayments(prevPayments => 
        prevPayments.map(payment => {
          if (payment.id === paymentId) {
            const payment_amount = payment.amount || 0;
            toast({
              title: `Payment ${action}d`,
              description: `Payment of ₹${payment_amount.toLocaleString()} has been ${action}d successfully.`,
            });
            return {
              ...payment,
              status: newStatus,
              approvedDate: action === 'approve' ? new Date().toISOString() : undefined,
              approvedBy: user?.name || 'Contractor'
            };
          }
          return payment;
        })
      );
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    return matchesStatus && matchesType;
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

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center text-gray-400">
        Loading payment requests...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Payment Requests</h1>
          <p className="text-gray-400">Review payment requests from site managers</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Amount</p>
          <p className="text-2xl font-bold text-white">₹{(totalAmount / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'approved', 'rejected', 'paid'].map(status => {
          const count = filteredPayments.filter(p => p.status === status).length;
          const amount = filteredPayments.filter(p => p.status === status).reduce((sum, p) => sum + p.amount, 0);
          
          return (
            <Card key={status} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-gray-500">₹{(amount / 100000).toFixed(1)}L</p>
                  </div>
                  <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            <SelectItem value="pending" className="text-white">Pending</SelectItem>
            <SelectItem value="approved" className="text-white">Approved</SelectItem>
            <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
            <SelectItem value="paid" className="text-white">Paid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            <SelectItem value="labour" className="text-white">Labour</SelectItem>
            <SelectItem value="materials" className="text-white">Materials</SelectItem>
            <SelectItem value="machinery" className="text-white">Machinery</SelectItem>
            <SelectItem value="advance" className="text-white">Advance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">{payment.projectName}</h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    <Badge variant="secondary" className={getTypeColor(payment.type)}>
                      {payment.type}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300">{payment.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Raised: {new Date(payment.raisedDate).toLocaleDateString()}
                    </div>
                    <div>Site Manager: {payment.siteManagerName}</div>
                    {payment.approvedDate && (
                      <div>Approved: {new Date(payment.approvedDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="flex items-center text-2xl font-bold text-white">
                    <IndianRupee className="h-5 w-5" />
                    {(payment.amount || 0).toLocaleString()}
                  </div>
                  {payment.status === 'pending' && (
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handlePaymentAction(payment.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePaymentAction(payment.id, 'reject')}
                        className="border-red-400 text-red-400 hover:bg-red-400/10"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-gray-400">No payments found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Payments;
