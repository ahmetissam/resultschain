import { motion } from 'framer-motion';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { ApprovalChart } from './ApprovalChart';
import { QuickActions } from './QuickActions';
import { useAuthStore } from '@/store/authStore';
import { useResultsStore } from '@/store/resultsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuthStore();
  const { getDashboardStats, getResultsForRole } = useResultsStore();
  
  const stats = getDashboardStats(user!.role, user!.id);
  const recentResults = getResultsForRole(user!.role, user!.id).slice(0, 5);

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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRoleBadgeColor(user!.role)}>
                {getRoleDisplayName(user!.role)}
              </Badge>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-300">{user?.department}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <QuickActions role={user!.role} />
        </motion.div>

        {/* Approval Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <ApprovalChart stats={stats} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <RecentActivity results={recentResults} />
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Insights</span>
              </CardTitle>
              <CardDescription>
                Key metrics and trends for your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Average Processing Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Per approval stage</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2.3 days</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Approval Rate</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">This semester</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">94.2%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Pending Reviews</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Awaiting your action</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.pendingApproval}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}