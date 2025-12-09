import { useAuth } from '../../contexts/AuthContext';

const UserGreeting = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userEmail = user?.email || 'there';
  const userName = userEmail.split('@')[0];

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-brand-black mb-2">
        {getGreeting()}, {userName}!
      </h1>
      <p className="text-gray-600">
        Ready to cook something delicious today?
      </p>
    </div>
  );
};

export default UserGreeting;
