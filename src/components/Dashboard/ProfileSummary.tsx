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
            Your taste profile is being generated. Check back soon!
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

  const extractKeyPoints = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const points: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^[•\-\*]\s/) && points.length < 4) {
        points.push(trimmed.replace(/^[•\-\*]\s/, ''));
      }
    });

    return points.length > 0 ? points : [text.split('\n')[0]];
  };

  return (
    <Card className="animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Taste Profile
        </h2>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${getStrengthColor(
            profile.profile_strength
          )}`}
        >
          {getStrengthLabel(profile.profile_strength)} Match
        </span>
      </div>
      <div className="space-y-2">
        {extractKeyPoints(profile.personality_profile).map((point, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-gray-700 text-sm">{point}</p>
          </div>
        ))}
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
