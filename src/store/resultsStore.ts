import { create } from 'zustand';
import { StudentResult, ApprovalStep, UserRole, AuditLog, DashboardStats } from '../types';

interface ResultsState {
  results: StudentResult[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  submitResult: (result: Omit<StudentResult, 'id' | 'submittedAt' | 'status' | 'approvalChain'>) => void;
  approveResult: (resultId: string, userId: string, userName: string, role: UserRole, comments?: string) => void;
  rejectResult: (resultId: string, userId: string, userName: string, role: UserRole, comments: string) => void;
  getResultsForRole: (role: UserRole, userId?: string) => StudentResult[];
  getDashboardStats: (role: UserRole, userId?: string) => DashboardStats;
  getAuditLogs: () => AuditLog[];
}

// Mock data generator
const generateMockResults = (): StudentResult[] => {
  const mockResults: StudentResult[] = [
    {
      id: '1',
      studentId: 'CS2021001',
      studentName: 'John Smith',
      courseCode: 'CS301',
      courseName: 'Data Structures and Algorithms',
      score: 85,
      grade: 'A',
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      submittedBy: '1',
      submittedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      approvalChain: [
        {
          id: '1',
          role: 'course_adviser',
          userId: '1',
          userName: 'Dr. Sarah Johnson',
          action: 'approved',
          timestamp: '2024-01-15T10:30:00Z',
          transactionHash: '0xabc123...',
        },
        {
          id: '2',
          role: 'hod',
          userId: '2',
          userName: 'Prof. Michael Chen',
          action: 'pending',
        },
      ],
      currentApprover: '2',
    },
    {
      id: '2',
      studentId: 'CS2021002',
      studentName: 'Emily Davis',
      courseCode: 'CS302',
      courseName: 'Database Management Systems',
      score: 92,
      grade: 'A+',
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      submittedBy: '1',
      submittedAt: '2024-01-14T14:20:00Z',
      status: 'approved',
      approvalChain: [
        {
          id: '3',
          role: 'course_adviser',
          userId: '1',
          userName: 'Dr. Sarah Johnson',
          action: 'approved',
          timestamp: '2024-01-14T14:20:00Z',
          transactionHash: '0xdef456...',
        },
        {
          id: '4',
          role: 'hod',
          userId: '2',
          userName: 'Prof. Michael Chen',
          action: 'approved',
          timestamp: '2024-01-15T09:15:00Z',
          transactionHash: '0xghi789...',
        },
        {
          id: '5',
          role: 'dean',
          userId: '3',
          userName: 'Prof. Elizabeth Thompson',
          action: 'pending',
        },
      ],
      currentApprover: '3',
    },
  ];

  return mockResults;
};

const generateMockAuditLogs = (): AuditLog[] => {
  return [
    {
      id: '1',
      action: 'Result Submitted',
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      role: 'course_adviser',
      resultId: '1',
      timestamp: '2024-01-15T10:30:00Z',
      transactionHash: '0xabc123def456ghi789...',
      details: 'Submitted result for CS301 - John Smith (85/A)',
    },
    {
      id: '2',
      action: 'Result Approved by HOD',
      userId: '2',
      userName: 'Prof. Michael Chen',
      role: 'hod',
      resultId: '2',
      timestamp: '2024-01-15T09:15:00Z',
      transactionHash: '0xghi789jkl012mno345...',
      details: 'Approved result for CS302 - Emily Davis (92/A+)',
    },
  ];
};

export const useResultsStore = create<ResultsState>((set, get) => ({
  results: generateMockResults(),
  auditLogs: generateMockAuditLogs(),
  isLoading: false,

  submitResult: (resultData) => {
    const newResult: StudentResult = {
      ...resultData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      approvalChain: [
        {
          id: Date.now().toString(),
          role: 'course_adviser',
          userId: resultData.submittedBy,
          userName: 'Current User',
          action: 'approved',
          timestamp: new Date().toISOString(),
          transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'hod',
          userId: '2',
          userName: 'Prof. Michael Chen',
          action: 'pending',
        },
      ],
      currentApprover: '2',
    };

    set(state => ({
      results: [newResult, ...state.results],
      auditLogs: [
        {
          id: Date.now().toString(),
          action: 'Result Submitted',
          userId: resultData.submittedBy,
          userName: 'Current User',
          role: 'course_adviser',
          resultId: newResult.id,
          timestamp: new Date().toISOString(),
          transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
          details: `Submitted result for ${resultData.courseCode} - ${resultData.studentName} (${resultData.score}/${resultData.grade})`,
        },
        ...state.auditLogs,
      ],
    }));
  },

  approveResult: (resultId, userId, userName, role, comments) => {
    set(state => {
      const updatedResults = state.results.map(result => {
        if (result.id === resultId) {
          const updatedChain = result.approvalChain.map(step => {
            if (step.role === role && step.action === 'pending') {
              return {
                ...step,
                action: 'approved' as const,
                timestamp: new Date().toISOString(),
                comments,
                transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
              };
            }
            return step;
          });

          // Determine next approver and status
          const nextStep = updatedChain.find(step => step.action === 'pending');
          const isCompletelyApproved = !nextStep;
          
          return {
            ...result,
            approvalChain: updatedChain,
            currentApprover: nextStep?.userId,
            status: isCompletelyApproved ? 'final_approved' : 'approved',
            comments,
          };
        }
        return result;
      });

      return {
        results: updatedResults,
        auditLogs: [
          {
            id: Date.now().toString(),
            action: `Result Approved by ${role.toUpperCase().replace('_', ' ')}`,
            userId,
            userName,
            role,
            resultId,
            timestamp: new Date().toISOString(),
            transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
            details: `Approved result with comments: ${comments || 'No comments'}`,
          },
          ...state.auditLogs,
        ],
      };
    });
  },

  rejectResult: (resultId, userId, userName, role, comments) => {
    set(state => {
      const updatedResults = state.results.map(result => {
        if (result.id === resultId) {
          const updatedChain = result.approvalChain.map(step => {
            if (step.role === role && step.action === 'pending') {
              return {
                ...step,
                action: 'rejected' as const,
                timestamp: new Date().toISOString(),
                comments,
                transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
              };
            }
            return step;
          });

          return {
            ...result,
            approvalChain: updatedChain,
            status: 'rejected',
            comments,
          };
        }
        return result;
      });

      return {
        results: updatedResults,
        auditLogs: [
          {
            id: Date.now().toString(),
            action: `Result Rejected by ${role.toUpperCase().replace('_', ' ')}`,
            userId,
            userName,
            role,
            resultId,
            timestamp: new Date().toISOString(),
            transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
            details: `Rejected result with comments: ${comments}`,
          },
          ...state.auditLogs,
        ],
      };
    });
  },

  getResultsForRole: (role, userId) => {
    const { results } = get();
    
    switch (role) {
      case 'course_adviser':
        return results.filter(r => r.submittedBy === userId);
      case 'hod':
      case 'dean':
      case 'dvc_academic':
      case 'vice_chancellor':
        return results.filter(r => r.currentApprover === userId || 
          r.approvalChain.some(step => step.userId === userId));
      default:
        return results;
    }
  },

  getDashboardStats: (role, userId) => {
    const results = get().getResultsForRole(role, userId);
    
    return {
      totalResults: results.length,
      pendingApproval: results.filter(r => r.status === 'pending' && r.currentApprover === userId).length,
      approved: results.filter(r => r.status === 'approved').length,
      rejected: results.filter(r => r.status === 'rejected').length,
      finalApproved: results.filter(r => r.status === 'final_approved').length,
    };
  },

  getAuditLogs: () => get().auditLogs,
}));