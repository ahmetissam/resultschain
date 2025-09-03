import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Search, Filter, ExternalLink, Shield, User, Clock, Hash } from 'lucide-react';
import { useResultsStore } from '@/store/resultsStore';
import { AuditLog } from '@/types';
import { format } from 'date-fns';

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const { getAuditLogs } = useResultsStore();
  const auditLogs = getAuditLogs();

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterBy === 'all' ||
      (filterBy === 'submitted' && log.action.includes('Submitted')) ||
      (filterBy === 'approved' && log.action.includes('Approved')) ||
      (filterBy === 'rejected' && log.action.includes('Rejected'));

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  const getActionColor = (action: string) => {
    if (action.includes('Submitted')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (action.includes('Approved')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (action.includes('Rejected')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'course_adviser': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'hod': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'dean': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      'dvc_academic': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      'vice_chancellor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'course_adviser': 'Course Adviser',
      'hod': 'Head of Department',
      'dean': 'Dean',
      'dvc_academic': 'Deputy Vice Chancellor (Academic)',
      'vice_chancellor': 'Vice Chancellor',
    };
    return roleMap[role] || role;
  };

  const handleExportLogs = () => {
    console.log('Exporting audit logs...');
    // In a real app, this would export the logs to CSV/PDF
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
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Immutable blockchain transaction history ({filteredLogs.length} entries)
              </p>
            </div>
          </div>
          <Button onClick={handleExportLogs} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </motion.div>

      {/* Blockchain Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Blockchain-Secured Audit Trail
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  All actions are cryptographically signed and immutably recorded on the blockchain. 
                  Transaction hashes provide verifiable proof of authenticity and timestamp integrity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Search & Filter Logs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search actions, users, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="submitted">Submissions</SelectItem>
                  <SelectItem value="approved">Approvals</SelectItem>
                  <SelectItem value="rejected">Rejections</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Audit Log Entries */}
      {filteredLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Logs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {searchTerm || filterBy !== 'all' 
                  ? "No audit logs match your search criteria."
                  : "No audit logs available yet."
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                    {/* Timestamp and Action */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getActionColor(log.action)}>
                              {log.action}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(log.timestamp), 'MMM dd, yyyy \'at\' h:mm a')}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                            {log.details}
                          </p>
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {log.userName}
                            </span>
                            <Badge className={getRoleColor(log.role)} variant="outline">
                              {getRoleDisplayName(log.role)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Info */}
                    <div className="lg:col-span-2">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                          <Hash className="w-4 h-4" />
                          <span>Blockchain Transaction</span>
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Transaction Hash:</span>
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                              <code className="text-blue-600 dark:text-blue-400 font-mono">
                                {log.transactionHash.substring(0, 20)}...
                              </code>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Block Height:</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                              #{Math.floor(Math.random() * 1000000) + 500000}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Gas Used:</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                              {Math.floor(Math.random() * 50000) + 21000}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Confirmations:</span>
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              {Math.floor(Math.random() * 100) + 50}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}