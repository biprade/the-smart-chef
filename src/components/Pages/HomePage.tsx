import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Common/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-beige-light">
      <nav className="sticky top-0 z-50 bg-white border-b border-beige">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo-brand.jpg" alt="The Smart Chef" className="h-14 w-auto" />
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate('/dashboard')} variant="primary">
                  Dashboard
                </Button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 text-brand-black font-medium hover:text-sage transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2.5 bg-sage text-white font-semibold rounded-lg hover:bg-sage-dark transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="bg-beige-light pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white border border-beige-dark px-4 py-2 rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-sage rounded-full"></span>
                <span className="text-brand-black">AI-Powered Recipe Recommendations</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-brand-black mb-8 leading-tight">
                Personalized Recipes Based on
                <span className="block text-sage mt-2">Your Health, Favorite Ingredients & Lifestyle</span>
              </h1>

              <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed">
                Smart recipe recommendations tailored to your ingredients, mood, dietary needs, and lifestyle.
                Your AI-powered cooking companion that learns and adapts to you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-8 py-4 bg-sage text-white text-lg font-semibold rounded-lg hover:bg-sage-dark transition-all shadow-lg"
                >
                  Start Cooking Smarter
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-brand-black text-lg font-semibold rounded-lg border-2 border-beige-dark hover:border-sage transition-all"
                >
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🥘', title: 'Smart Matching', desc: 'AI analyzes your ingredients and suggests perfect recipes' },
                { icon: '😊', title: 'Mood-Based', desc: 'Recipes that match your current mood and energy level' },
                { icon: '📊', title: 'Personalized', desc: 'Learns your preferences and dietary restrictions' }
              ].map((item, idx) => (
                <div key={idx} className="bg-beige-light rounded-2xl p-8 border border-beige-dark hover:border-sage transition-all hover:shadow-lg">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-brand-black mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-beige-light py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-brand-black mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Four simple steps to discover your perfect meal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Tell Us About You',
                  description: 'Share your dietary preferences, restrictions, and favorite cuisines',
                  icon: '👤'
                },
                {
                  step: '2',
                  title: 'Add Your Ingredients',
                  description: 'Enter what you have in your kitchen right now',
                  icon: '🥬'
                },
                {
                  step: '3',
                  title: 'Set Your Mood',
                  description: 'Let us know how you feel and how much energy you have',
                  icon: '🎯'
                },
                {
                  step: '4',
                  title: 'Get Recommendations',
                  description: 'Receive personalized recipes perfectly matched to you',
                  icon: '✨'
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sage text-white text-2xl font-bold rounded-xl mb-6">
                    {item.step}
                  </div>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-brand-black mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-beige-light py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-brand-black mb-6">
                Why Choose The Smart Chef?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                More than just a recipe app
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Reduce Food Waste',
                  description: 'Use what you already have instead of buying more',
                  icon: '♻️'
                },
                {
                  title: 'Save Time',
                  description: 'No more endless scrolling through recipe sites',
                  icon: '⏱️'
                },
                {
                  title: 'Eat Healthier',
                  description: 'Nutrition info and health goals built-in',
                  icon: '💪'
                },
                {
                  title: 'Learn & Grow',
                  description: 'Discover new cuisines and cooking techniques',
                  icon: '📚'
                },
                {
                  title: 'Dietary Friendly',
                  description: 'Respects all dietary restrictions and preferences',
                  icon: '🌱'
                },
                {
                  title: 'Always Learning',
                  description: 'Gets better the more you use it',
                  icon: '🧠'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-beige-light rounded-2xl p-8 border border-beige-dark hover:border-sage transition-all hover:shadow-lg">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-brand-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-sage py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Cooking?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of home cooks discovering their perfect recipes every day
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-white text-sage text-lg font-bold rounded-lg hover:bg-beige-light transition-all shadow-xl"
            >
              Get Started Free
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-brand-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <img src="/logo-brand.jpg" alt="The Smart Chef" className="h-20 w-auto mb-4" />
              </div>
              <p className="text-gray-400 leading-relaxed text-base max-w-md">
                Your AI-powered cooking companion that helps you discover perfect recipes
                based on your health, your favorite ingredients, and your lifestyle.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 The Smart Chef. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
