import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProjects } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { IndianRupee, User, Calendar, FileText, CheckSquare } from 'lucide-react';

const PaymentConfirm = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Find the payment and project from the mock data
    for (const project of mockProjects) {
      const foundPayment = project.payments.find(p => p.id === paymentId);
      if (foundPayment) {
        setPayment(foundPayment);
        setProject(project);
        break;
      }
    }
  }, [paymentId]);

  const handleProcessPayment = () => {
    setIsLoading(true);
    
    // Simulate Razorpay integration
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Payment of ₹${payment.amount.toLocaleString()} has been processed successfully`,
      });
      
      // In a real app, this would update the payment status in the database
      setIsLoading(false);
      navigate('/contractor/payments');
    }, 1500);
  };

  if (!payment || !project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Payment Confirmation</h1>
          <p className="text-gray-400">Payment not found</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => navigate('/contractor/payments')}
          >
            Go Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payment Confirmation</h1>
        <p className="text-gray-400">Confirm and process payment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Details */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <span className="text-gray-400">Amount</span>
              <div className="flex items-center text-xl font-bold text-white">
                <IndianRupee className="h-4 w-4 mr-1" />
                {payment.amount.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <span className="text-gray-400">Payment ID</span>
              <span className="text-white">{payment.id}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <span className="text-gray-400">Requested By</span>
              <div className="flex items-center text-white">
                <User className="h-4 w-4 mr-2" />
                {payment.raisedBy}
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <span className="text-gray-400">Request Date</span>
              <div className="flex items-center text-white">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(payment.raisedDate).toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <span className="text-gray-400">Type</span>
              <span className="capitalize text-white">{payment.type}</span>
            </div>

            <div className="flex justify-between items-center pb-4">
              <span className="text-gray-400">Project</span>
              <span className="text-white">{project.name}</span>
            </div>

            <div className="mt-4">
              <span className="text-gray-400">Description</span>
              <p className="mt-2 p-3 bg-gray-800 rounded-lg text-white">{payment.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Razorpay Integration Panel */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Razorpay Payment Gateway</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-white">Invoice #{payment.id.substring(3)}</span>
                </div>
                <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="bg-gray-700/50 p-3 rounded-lg mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">₹{payment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-300">Tax (0%)</span>
                  <span className="text-white">₹0</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-600">
                  <span className="text-gray-300 font-bold">Total</span>
                  <span className="text-white font-bold">₹{payment.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
                <div className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-300 font-medium">Ready for Payment</p>
                    <p className="text-gray-400 text-sm mt-1">
                      This payment will be processed securely through Razorpay.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleProcessPayment} 
                className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Process Payment with Razorpay'}
              </Button>
              
              <p className="text-center text-gray-500 text-xs">
                By clicking this button, you agree to the terms and conditions of Razorpay.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/contractor/payments')} className="border-gray-700 text-gray-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentConfirm;