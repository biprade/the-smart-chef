import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-beige sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate(user ? '/dashboard' : '/')}
          >
            <img src="/logo-brand.jpg" alt="The Smart Chef Logo" className="h-14 w-auto" />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-brand-black hover:text-sage transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 text-brand-black hover:text-sage transition-colors"
                >
                  Profile
                </button>
                <Button onClick={handleSignOut} variant="outline" size="small">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 text-brand-black font-medium hover:text-sage transition-colors"
                >
                  Sign In
                </button>
                <Button onClick={() => navigate('/register')} variant="primary">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
