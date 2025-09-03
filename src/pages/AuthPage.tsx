import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Lock, Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('course_adviser');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  const { login, connectWallet, isLoading } = useAuthStore();
  const { toast } = useToast();

  const roleOptions = [
    { value: 'course_adviser', label: 'Course Adviser', description: 'Submit and manage student results' },
    { value: 'hod', label: 'Head of Department', description: 'Review and approve departmental results' },
    { value: 'dean', label: 'Dean', description: 'Faculty-level result approval' },
    { value: 'dvc_academic', label: 'Deputy Vice Chancellor (Academic)', description: 'Academic oversight and approval' },
    { value: 'vice_chancellor', label: 'Vice Chancellor', description: 'Final institutional approval' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(email, password, role);
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back! Logged in as ${role.replace('_', ' ').toUpperCase()}`,
        });
        onSuccess();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or role mismatch. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Mock registration
      toast({
        title: "Registration Successful",
        description: "Account created successfully. Please login to continue.",
      });
      setIsLogin(true);
    }
  };

  const handleWalletConnect = async () => {
    setIsConnectingWallet(true);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = await connectWallet();
    if (success) {
      toast({
        title: "Wallet Connected",
        description: "MetaMask wallet connected successfully for blockchain transactions.",
      });
    } else {
      toast({
        title: "Wallet Connection Failed",
        description: "Please ensure MetaMask is installed and try again.",
        variant: "destructive",
      });
    }
    
    setIsConnectingWallet(false);
  };

  // Demo credentials for each role
  const demoCredentials = [
    { role: 'course_adviser', email: 'adviser@university.edu', name: 'Dr. Sarah Johnson' },
    { role: 'hod', email: 'hod@university.edu', name: 'Prof. Michael Chen' },
    { role: 'dean', email: 'dean@university.edu', name: 'Prof. Elizabeth Thompson' },
    { role: 'dvc_academic', email: 'dvc@university.edu', name: 'Prof. Robert Williams' },
    { role: 'vice_chancellor', email: 'vc@university.edu', name: 'Prof. Amanda Davis' },
  ];

  const fillDemoCredentials = (demoRole: UserRole) => {
    const demo = demoCredentials.find(d => d.role === demoRole);
    if (demo) {
      setEmail(demo.email);
      setPassword('demo123');
      setRole(demoRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute top-6 left-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResultsChain
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin 
              ? 'Sign in to your account to access the results management system'
              : 'Join the secure blockchain-based results management platform'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Demo Credentials</span>
                </CardTitle>
                <CardDescription>
                  Use these demo accounts to explore different role functionalities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoCredentials.map((demo) => (
                  <div 
                    key={demo.role}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => fillDemoCredentials(demo.role as UserRole)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{demo.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{demo.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {roleOptions.find(r => r.value === demo.role)?.label}
                    </Badge>
                  </div>
                ))}
                <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                  Password for all demo accounts: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">demo123</code>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Connection */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Blockchain Wallet</span>
                </CardTitle>
                <CardDescription>
                  Connect your MetaMask wallet for blockchain transactions (Demo Mode)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleWalletConnect}
                  disabled={isConnectingWallet}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isConnectingWallet ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting Wallet...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask (Demo)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Login/Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>{isLogin ? 'Login' : 'Register'}</span>
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Enter your credentials to access your dashboard'
                    : 'Create a new account to get started'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@university.edu"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-gray-500">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm"
                    >
                      {isLogin 
                        ? "Don't have an account? Register here"
                        : "Already have an account? Login here"
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}