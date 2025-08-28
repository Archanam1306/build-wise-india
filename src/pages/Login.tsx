import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../fireconfig";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { HardHat, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth(app);
  const db = getFirestore(app);
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting login process...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase auth successful');
      
      // Fetch user role from Firestore using email
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("User record not found in database.");
      }
      
      const userData = querySnapshot.docs[0].data();
      const userDoc = querySnapshot.docs[0];
      let role = userData.role;
      role = typeof role === "string" ? role.toLowerCase().trim() : "";
      
      console.log('User role found:', role);

      // Set user in AuthContext
      const userInfo = {
        id: userDoc.id,
        email: userCredential.user.email || "",
        role,
        name: userData.name || "",
        phone: userData.phone || "",
      };
      
      console.log('Setting user in context:', userInfo);
      
      // Set user in context first
      setUser(userInfo);

      toast({
        title: "Welcome!",
        description: "Login successful",
      });

      // Navigate using React Router instead of window.location
      setTimeout(() => {
        switch (role) {
          case 'contractor':
            navigate('/contractor', { replace: true });
            break;
          case 'site-manager':
            navigate('/site-manager', { replace: true });
            break;
          case 'customer':
            navigate('/customer', { replace: true });
            break;
          default:
            console.error('Unknown role:', role);
            toast({
              title: "Error",
              description: "Invalid user role. Please contact support.",
              variant: "destructive",
            });
            navigate('/', { replace: true });
        }
      }, 200);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
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
                  onClick={() => handleDemoLogin('contractor@buildtech.com')}
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  Demo Contractor
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('siteman1@buildtech.com')}
                  className="text-green-400 border-green-400 hover:bg-green-400/10"
                >
                  Demo Site Manager
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('customer1@gmail.com')}
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
  