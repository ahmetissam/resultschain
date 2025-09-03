import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ApprovalChartProps {
  stats: DashboardStats;
}

export function ApprovalChart({ stats }: ApprovalChartProps) {
  const pieData = [
    { name: 'Approved', value: stats.approved + (stats.finalApproved || 0), color: '#10b981' },
    { name: 'Pending', value: stats.pendingApproval, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Jan', approved: 45, pending: 12, rejected: 3 },
    { name: 'Feb', approved: 52, pending: 8, rejected: 5 },
    { name: 'Mar', approved: 48, pending: 15, rejected: 2 },
    { name: 'Apr', approved: 61, pending: 6, rejected: 4 },
    { name: 'May', approved: 55, pending: 10, rejected: 1 },
    { name: 'Jun', approved: stats.approved + (stats.finalApproved || 0), pending: stats.pendingApproval, rejected: stats.rejected },
  ];

  // const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Approval Analytics</span>
        </CardTitle>
        <CardDescription>
          Visual breakdown of result approval statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const name = (props as any).name ?? '';
                    const percent = typeof (props as any).percent === 'number' ? (props as any).percent : 0;
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" stackId="a" fill="#10b981" />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="rejected" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {((stats.approved + (stats.finalApproved || 0)) / stats.totalResults * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalResults}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Results</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pendingApproval}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Pending Review</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}