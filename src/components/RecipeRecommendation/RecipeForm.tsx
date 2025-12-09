import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../Dashboard/DashboardLayout';
import IngredientInput from './IngredientInput';
import MoodEnergySelector from './MoodEnergySelector';
import RecipeResults from './RecipeResults';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { Recipe } from '../../types/recipe';
import { getPersonalizedRecipes, getUserAIProfile } from '../../services/openaiService';
import { supabase } from '../../services/supabaseClient';

const RecipeForm = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>('');
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUserProfile();
    loadSavedRecipes();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const profile = await getUserAIProfile(user.id);
      // Profile is loaded for future use in recipe recommendations
      console.log('User profile loaded:', profile?.personality_profile ? 'Yes' : 'No');
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('recipe_data')
        .eq('user_id', user.id);

      if (error) throw error;

      const ids = new Set(
        data?.map((item: any) => item.recipe_data?.id).filter(Boolean) || []
      );
      setSavedRecipeIds(ids);
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    }
  };

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Nut-Free'
  ];

  const cuisineOptions = [
    'Any', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai',
    'Indian', 'Mediterranean', 'American', 'French', 'Korean'
  ];

  const timeOptions = [
    { value: '15', label: 'Under 15 mins' },
    { value: '30', label: 'Under 30 mins' },
    { value: '45', label: 'Under 45 mins' },
    { value: '60', label: 'Under 1 hour' },
    { value: '60+', label: '1+ hour' }
  ];

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setError('');

    try {
      const recipesData = await getPersonalizedRecipes({
        ingredients,
        dietaryRestrictions,
        cuisinePreferences: cuisine ? [cuisine] : [],
        moodLevel: mood,
        energyLevel: energy,
        cookingTime: parseInt(cookingTime) || 60,
        servings: 4
      });

      setRecipes(recipesData);

      if (recipesData.length === 0) {
        setError('No recipes found. Try adjusting your search criteria.');
      }
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError(err.message || 'Failed to generate recipes. Please try again.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: user.id,
          recipe_name: recipe.title || recipe.name,
          recipe_json: recipe,
          cooked_count: 0,
          saved_at: new Date().toISOString()
        });

      if (error) throw error;

      if (recipe.id) {
        setSavedRecipeIds((prev) => new Set([...prev, recipe.id!]));
      }
      showToast('Recipe saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      showToast('Failed to save recipe. Please try again.', 'error');
    }
  };

  const isFormValid = ingredients.length > 0 && mood && energy;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Recipe</h1>
          <p className="text-gray-600">
            Tell us what you have and how you're feeling, and we'll find the perfect recipe for you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="animate-slideUp">
                <IngredientInput
                  selectedIngredients={ingredients}
                  onIngredientsChange={setIngredients}
                />
              </Card>

              <Card className="animate-slideUp stagger-1">
                <MoodEnergySelector
                  mood={mood}
                  energy={energy}
                  onMoodChange={setMood}
                  onEnergyChange={setEnergy}
                />
              </Card>

              <Card className="animate-slideUp stagger-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Preferences
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Restrictions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleDietaryRestriction(option)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            dietaryRestrictions.includes(option)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Cuisine
                    </label>
                    <select
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                    >
                      <option value="">Select cuisine type...</option>
                      {cuisineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cooking Time
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setCookingTime(option.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            cookingTime === option.value
                              ? 'bg-sage text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Finding Recipes...
                  </span>
                ) : (
                  'Find Recipes'
                )}
              </Button>

              {!isFormValid && ingredients.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Add at least one ingredient to get started
                </p>
              )}
            </form>
          </div>

          <div>
            <RecipeResults
              recipes={recipes}
              isLoading={isLoading}
              hasSearched={hasSearched}
              error={error}
              onSaveRecipe={handleSaveRecipe}
              savedRecipeIds={savedRecipeIds}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecipeForm;
