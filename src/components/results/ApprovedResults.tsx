import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Search, Filter, Download, ExternalLink } from 'lucide-react';
import { useResultsStore } from '@/store/resultsStore';
import { useAuthStore } from '@/store/authStore';
import { StudentResult } from '@/types';
import { format } from 'date-fns';

export function ApprovedResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'approved' | 'final_approved'>('all');
  
  const { getResultsForRole } = useResultsStore();
  const { user } = useAuthStore();

  const allResults = getResultsForRole(user!.role, user!.id)
    .filter(result => result.status === 'approved' || result.status === 'final_approved');

  const filteredResults = allResults.filter(result => {
    const matchesSearch = 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.courseName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterBy === 'all' || 
      (filterBy === 'approved' && result.status === 'approved') ||
      (filterBy === 'final_approved' && result.status === 'final_approved');

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'final_approved') {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          Final Approved
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
        Approved
      </Badge>
    );
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

  const getApprovalProgress = (result: StudentResult) => {
    const approved = result.approvalChain.filter(step => step.action === 'approved').length;
    const total = result.approvalChain.length;
    return { approved, total };
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
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Approved Results</h1>
              <p className="text-gray-600 dark:text-gray-300">
                View all approved academic results ({filteredResults.length} results)
              </p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by student name, ID, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterBy === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterBy('all')}
                  size="sm"
                >
                  All ({allResults.length})
                </Button>
                <Button
                  variant={filterBy === 'approved' ? 'default' : 'outline'}
                  onClick={() => setFilterBy('approved')}
                  size="sm"
                >
                  Approved ({allResults.filter(r => r.status === 'approved').length})
                </Button>
                <Button
                  variant={filterBy === 'final_approved' ? 'default' : 'outline'}
                  onClick={() => setFilterBy('final_approved')}
                  size="sm"
                >
                  Final ({allResults.filter(r => r.status === 'final_approved').length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Grid */}
      {filteredResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {searchTerm || filterBy !== 'all' 
                  ? "No results match your search criteria."
                  : "No approved results available yet."
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResults.map((result, index) => {
            const progress = getApprovalProgress(result);
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{result.studentName}</CardTitle>
                          <CardDescription>{result.studentId}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-300">Course</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {result.courseCode}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.courseName}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-300">Score & Grade</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {result.score} ({result.grade})
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-300">Semester</p>
                        <p className="text-gray-900 dark:text-white">{result.semester}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-300">Approved</p>
                        <p className="text-gray-900 dark:text-white">
                          {result.approvalChain
                            .filter(step => step.action === 'approved')
                            .pop()?.timestamp && 
                            format(new Date(result.approvalChain
                              .filter(step => step.action === 'approved')
                              .pop()!.timestamp!), 'MMM dd, yyyy')
                          }
                        </p>
                      </div>
                    </div>

                    {/* Approval Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Approval Progress</span>
                        <span className="text-gray-500">{progress.approved}/{progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(progress.approved / progress.total) * 100}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {result.approvalChain.map((step, stepIndex) => (
                          <span
                            key={step.id}
                            className={`px-2 py-1 rounded ${
                              step.action === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {getRoleDisplayName(step.role)}
                            {step.action === 'approved' && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {result.comments && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-900 dark:text-white italic">
                          "{result.comments}"
                        </p>
                      </div>
                    )}

                    {/* Blockchain Transaction */}
                    {result.transactionHash && (
                      <div className="flex items-center justify-between text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-300">Blockchain Record:</span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Transaction
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}