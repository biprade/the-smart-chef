import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Common/Button';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/recipes', label: 'Find Recipes', icon: '🔍' },
    { path: '/saved', label: 'Saved', icon: '⭐' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const integrationItems = [
    { path: '/integrations/health', label: 'Health Apps', icon: '💪' },
    { path: '/integrations/delivery', label: 'Delivery', icon: '🚚' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                <img src="/logo-brand.jpg" alt="The Smart Chef" className="h-12 w-auto" />
              </div>
              <div className="hidden md:flex space-x-1">
                {navItems.map(item => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-sage/10 text-sage-dark'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  Integrations ▾
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {integrationItems.map(item => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Update Profile
              </button>
              <Button onClick={handleSignOut} variant="secondary" className="px-4 py-1.5 text-sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
