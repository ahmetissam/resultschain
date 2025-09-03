import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Shield, 
  Wallet, 
  ArrowLeft, 
  Save, 
  Edit3, 
  Key,
  Bell,
  Globe,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useResultsStore } from '@/store/resultsStore';
import { format } from 'date-fns';

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfilePage({ onBack, onLogout }: ProfilePageProps) {
  const { user, logout } = useAuthStore();
  const { getDashboardStats } = useResultsStore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    bio: 'Dedicated academic professional committed to excellence in education and transparent result management.',
    phone: '+1 (555) 123-4567',
    office: 'Room 204, Academic Building',
    expertise: 'Computer Science, Data Structures, Algorithms',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    autoApproval: false,
  });

  const stats = user ? getDashboardStats(user.role, user.id) : null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'course_adviser': 'Course Adviser',
      'hod': 'Head of Department',
      'dean': 'Dean',
      'dvc_academic': 'Deputy Vice Chancellor (Academic)',
      'vice_chancellor': 'Vice Chancellor',
      'admin': 'Administrator',
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'course_adviser': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'hod': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'dean': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      'dvc_academic': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      'vice_chancellor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'admin': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleConnectWallet = async () => {
    toast({
      title: "Wallet Connection",
      description: "MetaMask wallet connection will be available in production.",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <motion.header 
        className="backdrop-blur-sm bg-white/95 dark:bg-gray-950/95 border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResultsChain
              </span>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full p-0 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </motion.div>

                <div className="flex-1 mt-4 md:mt-0 md:pb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {user.name}
                      </h1>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleDisplayName(user.role)}
                        </Badge>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 dark:text-gray-300">{user.department}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Manage your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="office">Office Location</Label>
                    <Input
                      id="office"
                      value={profileData.office}
                      onChange={(e) => setProfileData(prev => ({ ...prev, office: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Areas of Expertise</Label>
                    <Input
                      id="expertise"
                      value={profileData.expertise}
                      onChange={(e) => setProfileData(prev => ({ ...prev, expertise: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    rows={3}
                  />
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security & Authentication</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security and blockchain wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wallet Connection */}
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Blockchain Wallet
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.walletAddress ? (
                          <span className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Connected: {user.walletAddress.substring(0, 10)}...{user.walletAddress.substring(-8)}</span>
                          </span>
                        ) : (
                          'Not connected - Connect for blockchain transactions'
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleConnectWallet}
                    variant={user.walletAddress ? "outline" : "default"}
                    className={!user.walletAddress ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {user.walletAddress ? 'Reconnect' : 'Connect Wallet'}
                  </Button>
                </div>

                {/* Security Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Receive security alerts and login notifications
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Configure how you receive updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive browser notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Weekly Reports</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get weekly summaries of your activity and pending items
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>

                {(user.role === 'hod' || user.role === 'dean' || user.role === 'dvc_academic' || user.role === 'vice_chancellor') && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto-Approval Alerts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Get notified when results are ready for your approval
                        </p>
                      </div>
                      <Switch 
                        checked={preferences.autoApproval}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoApproval: checked }))}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Stats & Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Account Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Account Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalResults}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Results</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.approved + (stats.finalApproved || 0)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Approved</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {stats.pendingApproval}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.rejected}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Account Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Email Verified</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">2FA Enabled</span>
                  <span className="text-sm text-gray-500">Not configured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last Login</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {format(new Date(), 'MMM dd, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Blockchain Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Network</span>
                  <Badge variant="outline">Ethereum Testnet</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Transactions</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.floor(Math.random() * 50) + 10}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Gas Used</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(Math.random() * 0.5 + 0.1).toFixed(3)} ETH
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Etherscan
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Language & Region
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}