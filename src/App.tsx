import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { useAuthStore } from '@/store/authStore';

type AppState = 'landing' | 'auth' | 'dashboard' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    setCurrentPage('auth');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard');
  };

  // Remove handleNavigateToProfile, profile navigation now handled in DashboardPage

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };
  // Auto-redirect to dashboard only from landing or auth page
  if (isAuthenticated && (currentPage === 'landing' || currentPage === 'auth')) {
    setCurrentPage('dashboard');
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="resultschain-theme">
      <Router>
        <div className="min-h-screen">
          {currentPage === 'landing' && (
            <LandingPage onGetStarted={handleGetStarted} />
          )}
          
          {currentPage === 'auth' && (
            <AuthPage 
              onBack={handleBackToLanding}
              onSuccess={handleAuthSuccess}
            />
          )}
          
          {currentPage === 'dashboard' && isAuthenticated && (
            <DashboardPage 
              onNavigateToProfile={() => {}}
              onNavigateToSettings={() => {}}
              onLogout={handleLogout}
            />
          )}
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;