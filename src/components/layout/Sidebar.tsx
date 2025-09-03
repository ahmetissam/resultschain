import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Users,
  Activity,
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: number;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuthStore();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['course_adviser', 'hod', 'dean', 'dvc_academic', 'vice_chancellor', 'admin'],
    },
    {
      id: 'submit',
      label: 'Submit Results',
      icon: <FileText className="w-5 h-5" />,
      roles: ['course_adviser'],
    },
    {
      id: 'pending',
      label: 'Pending Approval',
      icon: <CheckCircle className="w-5 h-5" />,
      roles: ['hod', 'dean', 'dvc_academic', 'vice_chancellor'],
    },
    {
      id: 'approved',
      label: 'Approved Results',
      icon: <CheckCircle className="w-5 h-5" />,
      roles: ['course_adviser', 'hod', 'dean', 'dvc_academic', 'vice_chancellor'],
    },
    {
      id: 'rejected',
      label: 'Rejected Results',
      icon: <XCircle className="w-5 h-5" />,
      roles: ['course_adviser', 'hod', 'dean', 'dvc_academic', 'vice_chancellor'],
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: <Activity className="w-5 h-5" />,
      roles: ['course_adviser', 'hod', 'dean', 'dvc_academic', 'vice_chancellor', 'admin'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      roles: ['course_adviser', 'hod', 'dean', 'dvc_academic', 'vice_chancellor', 'admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <motion.aside 
      className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-80px)] overflow-y-auto"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-4">
        <div className="space-y-2">
          {filteredMenuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                activeTab === item.id ? "rotate-90" : ""
              )} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Blockchain Status Indicator */}
      <motion.div 
        className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Blockchain Connected</span>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Network: Ethereum Testnet
        </div>
      </motion.div>
    </motion.aside>
  );
}