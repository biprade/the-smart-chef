import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../services/supabaseClient';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Card from '../Common/Card';
import Button from '../Common/Button';

interface HealthIntegration {
  integration_type: string;
  is_connected: boolean;
  last_synced: string | null;
  status_message: string | null;
}

interface IntegrationCardProps {
  name: string;
  icon: string;
  description: string;
  integration: HealthIntegration | null;
  onConnect: () => void;
}

const IntegrationCard = ({ name, icon, description, integration, onConnect }: IntegrationCardProps) => {
  const isConnected = integration?.is_connected || false;
  const lastSynced = integration?.last_synced;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            {isConnected ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Not Connected
              </span>
            )}
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-sage/20 text-sage-dark">
          Coming Soon
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {isConnected && lastSynced && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Synced:</span>
            <span className="font-medium text-gray-900">
              {new Date(lastSynced).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
          {integration?.status_message && (
            <p className="text-xs text-gray-500 mt-2">{integration.status_message}</p>
          )}
        </div>
      )}

      <Button
        onClick={onConnect}
        variant={isConnected ? 'secondary' : 'primary'}
        className="w-full"
        disabled
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </Card>
  );
};

const HealthIntegration = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<HealthIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_integrations_status')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setIntegrations(data || []);
    } catch (error: any) {
      console.error('Error loading integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (type: string) => {
    showToast(`${type} integration coming soon! OAuth authentication will be implemented in a future update.`, 'info');
  };

  const getIntegration = (type: string) => {
    return integrations.find(i => i.integration_type === type) || null;
  };

  const healthApps = [
    {
      name: 'Apple Health',
      type: 'apple_health',
      icon: '🍎',
      description: 'Sync your activity, heart rate, sleep, and nutrition data from Apple Health.'
    },
    {
      name: 'Google Fit',
      type: 'google_fit',
      icon: '🏃',
      description: 'Connect your Google Fit data including steps, workouts, and health metrics.'
    },
    {
      name: 'Fitbit',
      type: 'fitbit',
      icon: '⌚',
      description: 'Import activity levels, sleep patterns, and heart rate data from your Fitbit device.'
    },
    {
      name: 'MyFitnessPal',
      type: 'myfitnesspal',
      icon: '📊',
      description: 'Sync your calorie intake, macro tracking, and food diary from MyFitnessPal.'
    },
    {
      name: 'Strava',
      type: 'strava',
      icon: '🚴',
      description: 'Connect your Strava account to sync workout data and activity levels.'
    },
    {
      name: 'Whoop',
      type: 'whoop',
      icon: '💪',
      description: 'Import recovery, strain, and sleep data from your Whoop device.'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-dark mb-4"></div>
              <p className="text-gray-600">Loading integrations...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Integrations</h1>
          <p className="text-gray-600">
            Connect your health apps to help us understand your lifestyle and personalize your recipe feed.
          </p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-sage/5 to-green-50 border-sage/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Connect Health Apps?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">⚡</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Personalized Energy Recommendations</h3>
                <p className="text-sm text-gray-600">
                  We'll learn when you're most active and suggest recipes that fuel you at the right times, making your feed smarter every day.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">🎯</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Smart Food Guidance</h3>
                <p className="text-sm text-gray-600">
                  Based on your health metrics, we'll recommend what to eat to fuel your goals and what to avoid for optimal wellness.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">📈</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Adaptive Feed</h3>
                <p className="text-sm text-gray-600">
                  Your recipe feed evolves with you, learning your patterns and adapting to your changing health and fitness journey.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">🔒</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Privacy First</h3>
                <p className="text-sm text-gray-600">
                  Your health data is encrypted and only used to improve your recipe recommendations.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 animate-slideDown">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Feature Preview</h3>
              <p className="mt-1 text-sm text-blue-700">
                These integrations are coming soon! Once connected, we'll analyze your health data to learn your patterns,
                understand your food personality, and continuously refine your personalized recipe recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthApps.map((app, index) => (
            <div key={app.type} className={`animate-slideUp stagger-${Math.min((index % 3) + 1, 4)}`}>
              <IntegrationCard
                name={app.name}
                icon={app.icon}
                description={app.description}
                integration={getIntegration(app.type)}
                onConnect={() => handleConnect(app.name)}
              />
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default HealthIntegration;
