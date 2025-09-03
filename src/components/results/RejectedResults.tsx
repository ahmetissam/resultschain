import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XCircle, User, Search, RotateCcw, MessageCircle } from 'lucide-react';
import { useResultsStore } from '@/store/resultsStore';
import { useAuthStore } from '@/store/authStore';
import { StudentResult } from '@/types';
import { format } from 'date-fns';

export function RejectedResults() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { getResultsForRole } = useResultsStore();
  const { user } = useAuthStore();

  const rejectedResults = getResultsForRole(user!.role, user!.id)
    .filter(result => result.status === 'rejected');

  const filteredResults = rejectedResults.filter(result => {
    const matchesSearch = 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.courseName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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

  const getRejectionDetails = (result: StudentResult) => {
    const rejectedStep = result.approvalChain.find(step => step.action === 'rejected');
    return {
      rejectedBy: rejectedStep ? getRoleDisplayName(rejectedStep.role) : 'Unknown',
      rejectedAt: rejectedStep?.timestamp,
      reason: rejectedStep?.comments || result.comments || 'No reason provided',
    };
  };

  const handleResubmit = (result: StudentResult) => {
    // In a real app, this would open a resubmission form
    console.log('Resubmit result:', result.id);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rejected Results</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Review rejected results and reasons for rejection ({filteredResults.length} results)
            </p>
          </div>
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
            <CardTitle className="text-lg">Search Rejected Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search by student name, ID, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
              <XCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No Results Found' : 'No Rejected Results'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {searchTerm 
                  ? "No rejected results match your search criteria."
                  : "Great! No results have been rejected yet."
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResults.map((result, index) => {
            const rejectionDetails = getRejectionDetails(result);
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-red-200 dark:border-red-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{result.studentName}</CardTitle>
                          <CardDescription>{result.studentId}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        Rejected
                      </Badge>
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
                        <p className="font-medium text-gray-600 dark:text-gray-300">Rejected By</p>
                        <p className="text-gray-900 dark:text-white text-xs">
                          {rejectionDetails.rejectedBy}
                        </p>
                      </div>
                    </div>

                    {/* Rejection Details */}
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="font-medium text-red-800 dark:text-red-200 text-sm">
                          Reason for Rejection
                        </p>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 italic">
                        "{rejectionDetails.reason}"
                      </p>
                      {rejectionDetails.rejectedAt && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Rejected on {format(new Date(rejectionDetails.rejectedAt), 'MMM dd, yyyy \'at\' h:mm a')}
                        </p>
                      )}
                    </div>

                    {/* Approval Chain Progress */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approval Progress:</p>
                      <div className="space-y-1">
                        {result.approvalChain.map((step, stepIndex) => (
                          <div key={step.id} className="flex items-center space-x-2 text-sm">
                            <div className={`w-4 h-4 rounded-full ${
                              step.action === 'approved' ? 'bg-green-500' : 
                              step.action === 'rejected' ? 'bg-red-500' : 
                              'bg-gray-300'
                            }`} />
                            <span className={`${
                              step.action === 'rejected' ? 'font-semibold text-red-600 dark:text-red-400' : ''
                            }`}>
                              {getRoleDisplayName(step.role)}
                              {step.action === 'approved' && ' ✓'}
                              {step.action === 'rejected' && ' ✗ (Rejected here)'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4">
                      {user?.role === 'course_adviser' && (
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleResubmit(result)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Resubmit
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => console.log('Contact reviewer for:', result.id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Reviewer
                      </Button>
                    </div>
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