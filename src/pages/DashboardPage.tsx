import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SubmitResults } from '@/components/results/SubmitResults';
import { PendingApproval } from '@/components/results/PendingApproval';
import { ApprovedResults } from '@/components/results/ApprovedResults';
import { RejectedResults } from '@/components/results/RejectedResults';
import { AuditLogs } from '@/components/audit/AuditLogs';
import { UserManagement } from '@/components/admin/UserManagement';
import { Settings } from '@/components/settings/Settings';
import { useAuthStore } from '@/store/authStore';

interface DashboardPageProps {
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function DashboardPage({ onNavigateToProfile, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuthStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'submit':
        return <SubmitResults />;
      case 'pending':
        return <PendingApproval />;
      case 'approved':
        return <ApprovedResults />;
      case 'rejected':
        return <RejectedResults />;
      case 'audit':
        return <AuditLogs />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNavigateToProfile={onNavigateToProfile} onLogout={onLogout} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}