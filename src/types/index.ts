export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  walletAddress?: string;
  isActive: boolean;
  createdAt: string;
}

export type UserRole = 'course_adviser' | 'hod' | 'dean' | 'dvc_academic' | 'vice_chancellor' | 'admin';

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  score: number;
  grade: string;
  semester: string;
  academicYear: string;
  submittedBy: string;
  submittedAt: string;
  status: ResultStatus;
  approvalChain: ApprovalStep[];
  currentApprover?: string;
  comments?: string;
  transactionHash?: string;
}

export type ResultStatus = 'pending' | 'approved' | 'rejected' | 'final_approved';

export interface ApprovalStep {
  id: string;
  role: UserRole;
  userId: string;
  userName: string;
  action: 'approved' | 'rejected' | 'pending';
  comments?: string;
  timestamp?: string;
  transactionHash?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  role: UserRole;
  resultId?: string;
  timestamp: string;
  transactionHash: string;
  details: string;
}

export interface DashboardStats {
  totalResults: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  finalApproved?: number;
}