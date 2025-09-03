import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  connectWallet: () => Promise<boolean>;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'adviser@university.edu',
    name: 'Dr. Sarah Johnson',
    role: 'course_adviser',
    department: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'hod@university.edu',
    name: 'Prof. Michael Chen',
    role: 'hod',
    department: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'dean@university.edu',
    name: 'Prof. Elizabeth Thompson',
    role: 'dean',
    department: 'Faculty of Engineering',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'dvc@university.edu',
    name: 'Prof. Robert Williams',
    role: 'dvc_academic',
    department: 'Academic Affairs',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    email: 'vc@university.edu',
    name: 'Prof. Amanda Davis',
    role: 'vice_chancellor',
    department: 'Executive Office',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string, role: UserRole) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email && u.role === role);
        
        if (user) {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      connectWallet: async () => {
        // Mock wallet connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              walletAddress: '0x742d35Cc6634C0532925a3b8D1a4F6D6bE87859e'
            }
          });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);