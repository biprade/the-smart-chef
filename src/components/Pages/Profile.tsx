import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../services/supabaseClient';
import { generateUserProfile, getUserAIProfile } from '../../services/openaiService';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { Recipe } from '../../types/recipe';
import RecipeDetail from '../RecipeRecommendation/RecipeDetail';

interface UserProfile {
  name: string;
  age_range: string;
  cuisine_preferences: string[];
  disliked_foods: string[];
  health_goals: {
    weightManagement?: string;
    energyLevel?: string;
    specificGoals?: string[];
  };
}

interface AIProfile {
  personality_profile: string;
  profile_strength: number;
  version: number;
  last_updated: string;
}

interface RecipeHistory {
  id: string;
  recipe_name: string;
  recipe_json: Recipe;
  rating: number | null;
  feedback_text: string | null;
  liked_aspects: string[] | null;
  created_at: string;
}

interface DietaryRestriction {
  id: string;
  restriction_type: string;
  severity: number;
}

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [aiProfile, setAiProfile] = useState<AIProfile | null>(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [recipeHistory, setRecipeHistory] = useState<RecipeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [newCuisine, setNewCuisine] = useState('');
  const [newDislikedFood, setNewDislikedFood] = useState('');

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [profileRes, aiProfileRes, restrictionsRes, historyRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        getUserAIProfile(user.id),
        supabase.from('dietary_restrictions').select('*').eq('user_id', user.id),
        supabase
          .from('user_recipe_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (profileRes.error) throw profileRes.error;
      if (restrictionsRes.error) throw restrictionsRes.error;
      if (historyRes.error) throw historyRes.error;

      const userProfile: UserProfile = {
        name: profileRes.data?.name || '',
        age_range: profileRes.data?.age_range || '',
        cuisine_preferences: profileRes.data?.cuisine_preferences || [],
        disliked_foods: profileRes.data?.disliked_foods || [],
        health_goals: profileRes.data?.health_goals || {}
      };

      setProfile(userProfile);
      setEditedProfile(userProfile);
      setAiProfile(aiProfileRes as AIProfile);
      setDietaryRestrictions(restrictionsRes.data || []);
      setRecipeHistory(historyRes.data || []);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateProfile = async () => {
    if (!user) return;

    setRegenerating(true);
    try {
      const newProfile = await generateUserProfile(user.id);
      setAiProfile({
        personality_profile: newProfile,
        profile_strength: 1,
        version: (aiProfile?.version || 0) + 1,
        last_updated: new Date().toISOString()
      });
      showToast('Profile regenerated successfully!', 'success');
    } catch (error: any) {
      console.error('Error regenerating profile:', error);
      showToast('Failed to regenerate profile', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editedProfile) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          cuisine_preferences: editedProfile.cuisine_preferences,
          disliked_foods: editedProfile.disliked_foods,
          health_goals: editedProfile.health_goals,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setEditMode(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      showToast('Failed to save profile', 'error');
    }
  };

  const handleAddCuisine = () => {
    if (!editedProfile || !newCuisine.trim()) return;
    if (editedProfile.cuisine_preferences.includes(newCuisine.trim())) {
      showToast('This cuisine is already in your preferences', 'info');
      return;
    }
    setEditedProfile({
      ...editedProfile,
      cuisine_preferences: [...editedProfile.cuisine_preferences, newCuisine.trim()]
    });
    setNewCuisine('');
  };

  const handleRemoveCuisine = (cuisine: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      cuisine_preferences: editedProfile.cuisine_preferences.filter(c => c !== cuisine)
    });
  };

  const handleAddDislikedFood = () => {
    if (!editedProfile || !newDislikedFood.trim()) return;
    if (editedProfile.disliked_foods.includes(newDislikedFood.trim())) {
      showToast('This food is already in your disliked list', 'info');
      return;
    }
    setEditedProfile({
      ...editedProfile,
      disliked_foods: [...editedProfile.disliked_foods, newDislikedFood.trim()]
    });
    setNewDislikedFood('');
  };

  const handleRemoveDislikedFood = (food: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      disliked_foods: editedProfile.disliked_foods.filter(f => f !== food)
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-dark mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Not Found</h3>
            <p className="text-gray-600 mb-6">Complete the onboarding to create your profile.</p>
            <Button onClick={() => window.location.href = '/onboarding'} variant="primary">
              Start Onboarding
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your preferences and view your recipe journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">AI-Generated Profile</h2>
                <Button
                  onClick={handleRegenerateProfile}
                  disabled={regenerating}
                  variant="secondary"
                  className="text-sm"
                >
                  {regenerating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Regenerating...
                    </span>
                  ) : (
                    'Regenerate Profile'
                  )}
                </Button>
              </div>

              {aiProfile ? (
                <div>
                  <div className="bg-sage/10 border-l-4 border-sage-dark p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {aiProfile.personality_profile}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>Version {aiProfile.version}</span>
                      <span>Profile Strength: {aiProfile.profile_strength}/10</span>
                    </div>
                    <span>
                      Updated {new Date(aiProfile.last_updated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No AI profile generated yet</p>
                  <Button onClick={handleRegenerateProfile} variant="primary">
                    Generate Profile
                  </Button>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)} variant="secondary" className="text-sm">
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditedProfile(profile);
                        setEditMode(false);
                      }}
                      variant="secondary"
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} variant="primary" className="text-sm">
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Preferences
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editMode ? editedProfile : profile)?.cuisine_preferences.map((cuisine, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sage/20 text-sage-dark"
                      >
                        {cuisine}
                        {editMode && (
                          <button
                            onClick={() => handleRemoveCuisine(cuisine)}
                            className="ml-2 text-sage-dark hover:text-sage-dark"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {editMode && (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newCuisine}
                        onChange={(e) => setNewCuisine(e.target.value)}
                        placeholder="Add cuisine (e.g., Italian, Thai)"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCuisine()}
                      />
                      <Button onClick={handleAddCuisine} variant="secondary" className="whitespace-nowrap">
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foods to Avoid
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editMode ? editedProfile : profile)?.disliked_foods.map((food, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {food}
                        {editMode && (
                          <button
                            onClick={() => handleRemoveDislikedFood(food)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {editMode && (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newDislikedFood}
                        onChange={(e) => setNewDislikedFood(e.target.value)}
                        placeholder="Add food to avoid"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddDislikedFood()}
                      />
                      <Button onClick={handleAddDislikedFood} variant="secondary" className="whitespace-nowrap">
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Goals
                  </label>
                  {editMode ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight Management</label>
                        <select
                          value={editedProfile?.health_goals.weightManagement || ''}
                          onChange={(e) =>
                            setEditedProfile(prev => prev ? {
                              ...prev,
                              health_goals: { ...prev.health_goals, weightManagement: e.target.value }
                            } : null)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
                        >
                          <option value="">Select goal</option>
                          <option value="lose">Lose weight</option>
                          <option value="maintain">Maintain weight</option>
                          <option value="gain">Gain weight</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Energy Level Goal</label>
                        <select
                          value={editedProfile?.health_goals.energyLevel || ''}
                          onChange={(e) =>
                            setEditedProfile(prev => prev ? {
                              ...prev,
                              health_goals: { ...prev.health_goals, energyLevel: e.target.value }
                            } : null)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
                        >
                          <option value="">Select goal</option>
                          <option value="boost">Boost energy</option>
                          <option value="stable">Stable energy</option>
                          <option value="relax">Relaxation</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm text-gray-700">
                      {profile.health_goals.weightManagement && (
                        <p>Weight: {profile.health_goals.weightManagement}</p>
                      )}
                      {profile.health_goals.energyLevel && (
                        <p>Energy: {profile.health_goals.energyLevel}</p>
                      )}
                      {!profile.health_goals.weightManagement && !profile.health_goals.energyLevel && (
                        <p className="text-gray-500 italic">No health goals set</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe History</h2>
              {recipeHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-3">📝</div>
                  <p className="text-gray-600">No recipe history yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start trying recipes to build your history
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recipeHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedRecipe(item.recipe_json)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.recipe_name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          {item.rating && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {item.rating}/5
                            </div>
                          )}
                          {item.liked_aspects && item.liked_aspects.length > 0 && (
                            <span className="text-green-600">
                              Liked: {item.liked_aspects.join(', ')}
                            </span>
                          )}
                        </div>
                        {item.feedback_text && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {item.feedback_text}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-4">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recipes Tried</span>
                  <span className="text-lg font-semibold text-gray-900">{recipeHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cuisines</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {profile.cuisine_preferences.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Version</span>
                  <span className="text-lg font-semibold text-gray-900">{aiProfile?.version || 0}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h2>
              {dietaryRestrictions.length === 0 ? (
                <p className="text-sm text-gray-500">No dietary restrictions</p>
              ) : (
                <div className="space-y-2">
                  {dietaryRestrictions.map((restriction) => (
                    <div
                      key={restriction.id}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {restriction.restriction_type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                        Level {restriction.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isSaved={false}
        />
      )}
    </DashboardLayout>
  );
};

export default Profile;
