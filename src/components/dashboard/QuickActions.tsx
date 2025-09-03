import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { FileText, CheckCircle, Users, Settings, Activity, XCircle } from 'lucide-react';

interface QuickActionsProps {
  role: UserRole;
}

export function QuickActions({ role }: QuickActionsProps) {
  const getActionsForRole = (userRole: UserRole) => {
    const baseActions = [
      {
        title: 'View Audit Logs',
        description: 'Check system activity',
        icon: Activity,
        action: () => console.log('View Audit Logs'),
        color: 'bg-blue-500 hover:bg-blue-600',
      },
      {
        title: 'Settings',
        description: 'Manage preferences',
        icon: Settings,
        action: () => console.log('Open Settings'),
        color: 'bg-gray-500 hover:bg-gray-600',
      },
    ];

    switch (userRole) {
      case 'course_adviser':
        return [
          {
            title: 'Submit New Result',
            description: 'Add student results',
            icon: FileText,
            action: () => console.log('Submit Result'),
            color: 'bg-green-500 hover:bg-green-600',
          },
          {
            title: 'View My Submissions',
            description: 'Track submitted results',
            icon: CheckCircle,
            action: () => console.log('View Submissions'),
            color: 'bg-blue-500 hover:bg-blue-600',
          },
          ...baseActions,
        ];

      case 'hod':
      case 'dean':
      case 'dvc_academic':
      case 'vice_chancellor':
        return [
          {
            title: 'Pending Approvals',
            description: 'Review awaiting results',
            icon: CheckCircle,
            action: () => console.log('View Pending'),
            color: 'bg-orange-500 hover:bg-orange-600',
          },
          {
            title: 'Approved Results',
            description: 'View approved items',
            icon: CheckCircle,
            action: () => console.log('View Approved'),
            color: 'bg-green-500 hover:bg-green-600',
          },
          {
            title: 'Rejected Results',
            description: 'Review rejected items',
            icon: XCircle,
            action: () => console.log('View Rejected'),
            color: 'bg-red-500 hover:bg-red-600',
          },
          ...baseActions,
        ];

      case 'admin':
        return [
          {
            title: 'User Management',
            description: 'Manage system users',
            icon: Users,
            action: () => console.log('Manage Users'),
            color: 'bg-purple-500 hover:bg-purple-600',
          },
          {
            title: 'System Overview',
            description: 'Monitor all activities',
            icon: Activity,
            action: () => console.log('System Overview'),
            color: 'bg-indigo-500 hover:bg-indigo-600',
          },
          ...baseActions,
        ];

      default:
        return baseActions;
    }
  };

  const actions = getActionsForRole(role);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Frequently used actions for your role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                onClick={action.action}
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:shadow-md transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${action.color} mr-3 flex-shrink-0`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {action.description}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}