import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Search, Settings, Shield, Mail } from 'lucide-react'; // Calendar
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'course_adviser' as UserRole,
    department: '',
  });

  const { toast } = useToast();

  // Mock users data
  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'adviser@university.edu',
      name: 'Dr. Sarah Johnson',
      role: 'course_adviser',
      department: 'Computer Science',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      walletAddress: '0x742d35Cc6634C0532925a3b8D1a4F6D6bE87859e',
    },
    {
      id: '2',
      email: 'hod@university.edu',
      name: 'Prof. Michael Chen',
      role: 'hod',
      department: 'Computer Science',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      walletAddress: '0x8ba1f109551bD432803012645Hac136c3c2b5123',
    },
    {
      id: '3',
      email: 'dean@university.edu',
      name: 'Prof. Elizabeth Thompson',
      role: 'dean',
      department: 'Faculty of Engineering',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      email: 'dvc@university.edu',
      name: 'Prof. Robert Williams',
      role: 'dvc_academic',
      department: 'Academic Affairs',
      isActive: false,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '5',
      email: 'vc@university.edu',
      name: 'Prof. Amanda Davis',
      role: 'vice_chancellor',
      department: 'Executive Office',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      walletAddress: '0x456789abcdef012345678901234567890123456789',
    },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleDisplayName = (role: UserRole) => {
    const roleMap: Record<UserRole, string> = {
      'course_adviser': 'Course Adviser',
      'hod': 'Head of Department',
      'dean': 'Dean',
      'dvc_academic': 'Deputy Vice Chancellor (Academic)',
      'vice_chancellor': 'Vice Chancellor',
      'admin': 'Administrator',
    };
    return roleMap[role];
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colorMap: Record<UserRole, string> = {
      'course_adviser': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'hod': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'dean': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      'dvc_academic': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      'vice_chancellor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'admin': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colorMap[role];
  };

  const handleAddUser = async () => {
    setIsAddingUser(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "User Added Successfully",
        description: `${newUser.name} has been added as ${getRoleDisplayName(newUser.role)}`,
      });
      
      setNewUser({
        name: '',
        email: '',
        role: 'course_adviser',
        department: '',
      });
      
    } catch (error) {
      toast({
        title: "Failed to Add User",
        description: "An error occurred while adding the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    toast({
      title: "User Status Updated",
      description: `User status has been successfully updated. ${userId}`,
    });
  };

  const resetUserPassword = (userId: string) => {
    toast({
      title: "Password Reset",
      description: `Password reset email has been sent to the user. ${userId}`,
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage system users and their roles ({filteredUsers.length} users)
              </p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for the results management system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="john.smith@university.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course_adviser">Course Adviser</SelectItem>
                      <SelectItem value="hod">Head of Department</SelectItem>
                      <SelectItem value="dean">Dean</SelectItem>
                      <SelectItem value="dvc_academic">Deputy Vice Chancellor (Academic)</SelectItem>
                      <SelectItem value="vice_chancellor">Vice Chancellor</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="Computer Science"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddUser}
                  disabled={isAddingUser || !newUser.name || !newUser.email}
                  className="w-full"
                >
                  {isAddingUser ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Department:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{user.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Created:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Wallet:</span>
                    <span className="font-mono text-xs text-gray-900 dark:text-white">
                      {user.walletAddress ? (
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-green-500" />
                          <span>{user.walletAddress.substring(0, 10)}...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400">Not connected</span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    size="sm"
                    variant={user.isActive ? 'destructive' : 'default'}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resetUserPassword(user.id)}
                  >
                    Reset Password
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}