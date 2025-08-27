import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../fireconfig";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { HardHat, Mail, Lock, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome!",
        description: "Login successful",
      });

      // Redirect based on role
      switch (role) {
        case 'contractor':
          navigate('/contractor');
          break;
        case 'site-manager':
          navigate('/site-manager');
          break;
        case 'customer':
          navigate('/customer');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or role mismatch",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setRole(demoRole);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-full">
              <HardHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">BuildTracker</h1>
          <p className="text-gray-400">Construction Management Platform</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-200">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Select your role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="contractor" className="text-white hover:bg-gray-700">
                      Contractor
                    </SelectItem>
                    <SelectItem value="site-manager" className="text-white hover:bg-gray-700">
                      Site Manager
                    </SelectItem>
                    <SelectItem value="customer" className="text-white hover:bg-gray-700">
                      Customer (Land Owner)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Login Buttons */}
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-400">Quick Demo Login:</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('contractor', 'contractor@buildtech.com')}
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  Demo Contractor
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('site-manager', 'siteman1@buildtech.com')}
                  className="text-green-400 border-green-400 hover:bg-green-400/10"
                >
                  Demo Site Manager
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('customer', 'customer1@gmail.com')}
                  className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                >
                  Demo Customer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-400">
          © 2024 BuildTracker. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
  