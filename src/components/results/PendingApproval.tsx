import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react'; // FileText
import { useToast } from '@/hooks/use-toast';
import { useResultsStore } from '@/store/resultsStore';
import { useAuthStore } from '@/store/authStore';
import { StudentResult } from '@/types';
import { format } from 'date-fns';

export function PendingApproval() {
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const { toast } = useToast();
  const { getResultsForRole, approveResult, rejectResult } = useResultsStore();
  const { user } = useAuthStore();

  const pendingResults = getResultsForRole(user!.role, user!.id)
    .filter(result => result.currentApprover === user!.id && result.status !== 'rejected');

  const handleAction = async (result: StudentResult, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    setActionType(action);

    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (action === 'approve') {
        approveResult(result.id, user!.id, user!.name, user!.role, comments);
        toast({
          title: "Result Approved",
          description: `Successfully approved ${result.studentName}'s result for ${result.courseCode}`,
        });
      } else {
        if (!comments.trim()) {
          throw new Error('Comments are required for rejection');
        }
        rejectResult(result.id, user!.id, user!.name, user!.role, comments);
        toast({
          title: "Result Rejected",
          description: `Rejected ${result.studentName}'s result for ${result.courseCode}`,
          variant: "destructive",
        });
      }

      setSelectedResult(null);
      setComments('');
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  // const getNextApprover = (result: StudentResult) => {
  //   const nextStep = result.approvalChain.find(step => step.action === 'pending');
  //   return nextStep ? nextStep.role.replace('_', ' ').toUpperCase() : 'Final Approval';
  // };

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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Pending Approval
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Review and approve results awaiting your decision as{" "}
              {getRoleDisplayName(user!.role)}
            </p>
          </div>
        </div>
      </motion.div>

      {pendingResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Pending Approvals
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                There are currently no results awaiting your approval.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {result.studentName}
                        </CardTitle>
                        <CardDescription>{result.studentId}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-300">
                        Course
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {result.courseCode} - {result.courseName}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-300">
                        Score & Grade
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {result.score} ({result.grade})
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-300">
                        Semester
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {result.semester}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-300">
                        Submitted
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(result.submittedAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  {result.comments && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Comments:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white italic">
                        "{result.comments}"
                      </p>
                    </div>
                  )}

                  {/* Approval Chain */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Approval Chain:
                    </p>
                    <div className="space-y-1">
                      {result.approvalChain.map(
                        (
                          step // stepIndex
                        ) => (
                          <div
                            key={step.id}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <div
                              className={`w-4 h-4 rounded-full ${
                                step.action === "approved"
                                  ? "bg-green-500"
                                  : step.action === "rejected"
                                  ? "bg-red-500"
                                  : step.userId === user!.id
                                  ? "bg-orange-500 animate-pulse"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span
                              className={`${
                                step.userId === user!.id
                                  ? "font-semibold text-orange-600 dark:text-orange-400"
                                  : ""
                              }`}
                            >
                              {getRoleDisplayName(step.role)}
                              {step.action === "approved" && " ✓"}
                              {step.action === "rejected" && " ✗"}
                              {step.userId === user!.id &&
                                step.action === "pending" &&
                                " (Your Turn)"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedResult(result)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Result</DialogTitle>
                          <DialogDescription>
                            You are about to approve{" "}
                            {selectedResult?.studentName}'s result for{" "}
                            {selectedResult?.courseCode}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="approveComments">
                              Comments (Optional)
                            </Label>
                            <Textarea
                              id="approveComments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              placeholder="Add any comments about this approval..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedResult(null);
                              setComments("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              selectedResult &&
                              handleAction(selectedResult, "approve")
                            }
                            disabled={isProcessing}
                          >
                            {isProcessing && actionType === "approve" ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => setSelectedResult(result)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Result</DialogTitle>
                          <DialogDescription>
                            You are about to reject{" "}
                            {selectedResult?.studentName}'s result for{" "}
                            {selectedResult?.courseCode}. Please provide a
                            reason for rejection.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="rejectComments">
                              Reason for Rejection *
                            </Label>
                            <Textarea
                              id="rejectComments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              placeholder="Please provide a detailed reason for rejection..."
                              rows={3}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedResult(null);
                              setComments("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              selectedResult &&
                              handleAction(selectedResult, "reject")
                            }
                            disabled={isProcessing || !comments.trim()}
                          >
                            {isProcessing && actionType === "reject" ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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