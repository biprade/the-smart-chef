import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../services/supabaseClient';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Card from '../Common/Card';
import Button from '../Common/Button';

interface DeliveryIntegration {
  integration_type: string;
  is_connected: boolean;
  last_synced: string | null;
  status_message: string | null;
}

interface ServiceCardProps {
  name: string;
  icon: string;
  description: string;
  integration: DeliveryIntegration | null;
  features: string[];
  onConnect: () => void;
}

const ServiceCard = ({ name, icon, description, integration, features, onConnect }: ServiceCardProps) => {
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

      {features.length > 0 && (
        <ul className="space-y-2 mb-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-600">
              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {isConnected && lastSynced && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Order:</span>
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

const FoodDeliveryIntegration = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<DeliveryIntegration[]>([]);
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

  const handleConnect = (name: string) => {
    showToast(`${name} integration coming soon! One-click ordering will be available in a future update.`, 'info');
  };

  const getIntegration = (type: string) => {
    return integrations.find(i => i.integration_type === type) || null;
  };

  const deliveryServices = [
    {
      name: 'Instacart',
      type: 'instacart',
      icon: '🛒',
      description: 'Get ingredients delivered from your favorite local stores in as fast as 1 hour.',
      features: [
        'One-click ingredient ordering',
        'Recipe-to-cart in seconds',
        'Same-day delivery available'
      ]
    },
    {
      name: 'Amazon Fresh',
      type: 'amazon_fresh',
      icon: '📦',
      description: 'Order fresh ingredients with free delivery for Prime members.',
      features: [
        'Auto-add ingredients to cart',
        'Subscribe & Save on staples',
        'Fast Prime delivery'
      ]
    },
    {
      name: 'Walmart Grocery',
      type: 'walmart',
      icon: '🏪',
      description: 'Shop for ingredients at everyday low prices with pickup or delivery.',
      features: [
        'Price matching guaranteed',
        'Free pickup available',
        'Large product selection'
      ]
    },
    {
      name: 'DoorDash',
      type: 'doordash',
      icon: '🚗',
      description: 'Get groceries and ingredients delivered quickly from local stores.',
      features: [
        'Fast local delivery',
        'Track your order live',
        'Multiple store options'
      ]
    },
    {
      name: 'Whole Foods',
      type: 'whole_foods',
      icon: '🥬',
      description: 'Order organic and high-quality ingredients delivered to your door.',
      features: [
        'Organic & specialty items',
        'Quality guaranteed',
        'Prime member benefits'
      ]
    },
    {
      name: 'Kroger',
      type: 'kroger',
      icon: '🛍️',
      description: 'Shop from a wide selection with flexible pickup and delivery options.',
      features: [
        'Digital coupons',
        'Flexible delivery times',
        'Loyalty rewards'
      ]
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-dark mb-4"></div>
              <p className="text-gray-600">Loading delivery services...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Delivery Integrations</h1>
          <p className="text-gray-600">
            Connect your favorite grocery delivery services to order recipe ingredients with just one click.
          </p>
        </div>

        <div className="bg-sage/10 border-l-4 border-sage-dark p-4 mb-8 animate-slideDown">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-sage-dark" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-sage-dark">Feature Preview</h3>
              <p className="mt-1 text-sm text-sage-dark">
                These integrations are coming soon! Once connected, you'll be able to add all recipe ingredients
                to your cart with a single click and have them delivered to your door.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {deliveryServices.map((service, index) => (
            <div key={service.type} className={`animate-slideUp stagger-${Math.min((index % 3) + 1, 4)}`}>
              <ServiceCard
                name={service.name}
                icon={service.icon}
                description={service.description}
                integration={getIntegration(service.type)}
                features={service.features}
                onConnect={() => handleConnect(service.name)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center text-sage-dark font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Find a Recipe</h3>
                  <p className="text-sm text-gray-600">
                    Browse and select recipes that match your mood and available ingredients.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center text-sage-dark font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Choose Your Service</h3>
                  <p className="text-sm text-gray-600">
                    Select your preferred delivery service and check availability in your area.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center text-sage-dark font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Order with One Click</h3>
                  <p className="text-sm text-gray-600">
                    All ingredients are automatically added to your cart. Review and checkout instantly.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center text-sage-dark font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Get Delivered</h3>
                  <p className="text-sm text-gray-600">
                    Sit back and relax while fresh ingredients arrive at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-2xl">⏱️</div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Save Time</h3>
                  <p className="text-sm text-gray-600">
                    Skip the grocery store trip and get everything delivered while you focus on cooking.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-2xl">💰</div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Better Prices</h3>
                  <p className="text-sm text-gray-600">
                    Compare prices across services and get the best deals on ingredients.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-2xl">✅</div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">No Missing Items</h3>
                  <p className="text-sm text-gray-600">
                    Ensure you have everything you need with automated ingredient lists.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-2xl">🌱</div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Fresh & Quality</h3>
                  <p className="text-sm text-gray-600">
                    Choose services that guarantee fresh, high-quality ingredients.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FoodDeliveryIntegration;
