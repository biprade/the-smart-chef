import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import UserGreeting from './UserGreeting';
import ProfileSummary from './ProfileSummary';
import FeaturedRecipes from './FeaturedRecipes';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="animate-fadeIn">
          <UserGreeting />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-slideUp">
            <ProfileSummary />
          </div>

          <div className="space-y-6 animate-slideUp stagger-1">
            <div className="bg-beige-light rounded-lg shadow-sm border border-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/recipes')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-sage hover:bg-sage/10 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center group-hover:bg-sage/30 transition-colors">
                      <svg className="w-5 h-5 text-sage-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Find Recipes</p>
                      <p className="text-xs text-gray-500">Browse by preference</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Meal Planner</p>
                      <p className="text-xs text-gray-500">Plan your week</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-sage hover:bg-sage/10 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center group-hover:bg-sage/30 transition-colors">
                      <svg className="w-5 h-5 text-sage-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Favorites</p>
                      <p className="text-xs text-gray-500">Saved recipes</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sage to-sage-dark rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Daily Tip</h3>
              <p className="text-sm text-beige-light">
                Meal prep on Sundays can save you hours during the week and help you stick to your health goals!
              </p>
            </div>
          </div>
        </div>

        <div className="animate-slideUp stagger-2">
          <FeaturedRecipes />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
