import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserAIProfile } from '../../services/openaiService';
import Card from '../Common/Card';
import { DashboardCardSkeleton } from '../Common/SkeletonLoader';
import ErrorBanner from '../Common/ErrorBanner';

interface AIProfile {
  personality_profile: string;
  profile_strength: number;
  last_updated: string;
}

const ProfileSummary = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AIProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const data = await getUserAIProfile(user.id);
        if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <DashboardCardSkeleton />;
  }

  if (error) {
    return <ErrorBanner message={error} type="warning" />;
  }

  if (!profile) {
    return (
      <Card className="animate-fadeIn">
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Profile Not Ready
          </h3>
          <p className="text-gray-600 text-sm">
            Your personalized food profile is being generated. Check back soon!
          </p>
        </div>
      </Card>
    );
  }

  const getStrengthLabel = (strength: number) => {
    if (strength >= 8) return 'Excellent';
    if (strength >= 6) return 'Good';
    if (strength >= 4) return 'Fair';
    return 'Basic';
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 8) return 'text-green-600 bg-green-50';
    if (strength >= 6) return 'text-sage-dark bg-sage/10';
    if (strength >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatProfileText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const formattedElements: React.ReactElement[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        const content = trimmedLine.replace(/\*\*/g, '');
        formattedElements.push(
          <h3 key={index} className="font-semibold text-gray-900 mt-4 first:mt-0 mb-2">
            {content}
          </h3>
        );
      } else if (trimmedLine.match(/^[•\-\*]\s/)) {
        const content = trimmedLine.replace(/^[•\-\*]\s/, '');
        formattedElements.push(
          <li key={index} className="text-gray-700 ml-4 mb-1.5">
            {content}
          </li>
        );
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        const content = trimmedLine.replace(/^\d+\.\s/, '');
        formattedElements.push(
          <li key={index} className="text-gray-700 ml-4 mb-1.5 list-decimal">
            {content}
          </li>
        );
      } else if (trimmedLine.length > 0) {
        formattedElements.push(
          <p key={index} className="text-gray-700 mb-2">
            {trimmedLine}
          </p>
        );
      }
    });

    return formattedElements;
  };

  return (
    <Card className="animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Food Personality
        </h2>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${getStrengthColor(
            profile.profile_strength
          )}`}
        >
          {getStrengthLabel(profile.profile_strength)} Match
        </span>
      </div>
      <div className="text-gray-700 leading-relaxed">
        {formatProfileText(profile.personality_profile)}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Profile Strength</span>
          <span className="font-medium text-gray-900">{profile.profile_strength}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sage to-green-500 h-2 rounded-full transition-all duration-1000 ease-out animate-slideUp"
            style={{ width: `${(profile.profile_strength / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSummary;
