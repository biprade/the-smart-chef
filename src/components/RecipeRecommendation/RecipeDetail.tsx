import { useState, useEffect } from 'react';
import { Recipe } from '../../types/recipe';
import Button from '../Common/Button';
import RecipeFeedback, { RecipeFeedbackData } from './RecipeFeedback';
import { supabase } from '../../services/supabaseClient';
import { updateUserProfileFromFeedback } from '../../services/openaiService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface RecipeDetailProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (recipe: Recipe) => void;
  isSaved?: boolean;
  currentMood?: string;
}

const RecipeDetail = ({ recipe, isOpen, onClose, onSave, isSaved = false, currentMood = 'neutral' }: RecipeDetailProps) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [servings, setServings] = useState(recipe.servings);
  const [saving, setSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setServings(recipe.servings);
  }, [recipe]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const servingRatio = servings / recipe.servings;

  const scaledNutrition = {
    calories: Math.round((recipe.nutrition?.calories || 0) * servingRatio),
    protein: Math.round((recipe.nutrition?.protein || 0) * servingRatio),
    carbs: Math.round((recipe.nutrition?.carbs || 0) * servingRatio),
    fat: Math.round((recipe.nutrition?.fat || 0) * servingRatio),
    fiber: Math.round((recipe.nutrition?.fiber || 0) * servingRatio)
  };

  const scaleIngredient = (ingredient: string): string => {
    const fractionMap: Record<string, number> = {
      '1/4': 0.25, '1/3': 0.33, '1/2': 0.5, '2/3': 0.67, '3/4': 0.75,
      '1/8': 0.125, '3/8': 0.375, '5/8': 0.625, '7/8': 0.875
    };

    const numberPattern = /^(\d+(?:\/\d+)?|\d*\.\d+)\s+/;
    const match = ingredient.match(numberPattern);

    if (match) {
      let originalAmount = match[1];
      let numericValue: number;

      if (originalAmount.includes('/')) {
        if (fractionMap[originalAmount]) {
          numericValue = fractionMap[originalAmount];
        } else {
          const [numerator, denominator] = originalAmount.split('/').map(Number);
          numericValue = numerator / denominator;
        }
      } else {
        numericValue = parseFloat(originalAmount);
      }

      const scaledValue = numericValue * servingRatio;
      let displayValue: string;

      if (scaledValue < 0.2) {
        displayValue = 'pinch';
      } else if (scaledValue >= 1) {
        const whole = Math.floor(scaledValue);
        const fraction = scaledValue - whole;

        if (fraction < 0.1) {
          displayValue = whole.toString();
        } else if (fraction >= 0.9) {
          displayValue = (whole + 1).toString();
        } else {
          const fractionStr = Object.entries(fractionMap)
            .find(([_, val]) => Math.abs(val - fraction) < 0.05)?.[0];
          displayValue = fractionStr ? `${whole > 0 ? whole + ' ' : ''}${fractionStr}` : scaledValue.toFixed(1);
        }
      } else {
        const fractionStr = Object.entries(fractionMap)
          .find(([_, val]) => Math.abs(val - scaledValue) < 0.05)?.[0];
        displayValue = fractionStr || scaledValue.toFixed(1);
      }

      return ingredient.replace(numberPattern, displayValue + ' ');
    }

    return ingredient;
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave(recipe);
        showToast('Recipe saved successfully!', 'success');
      } catch (error: any) {
        console.error('Error saving recipe:', error);
        showToast('Failed to save recipe. Please try again.', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleFeedbackSubmit = async (feedback: RecipeFeedbackData) => {
    if (!user) {
      throw new Error('User must be logged in to submit feedback');
    }

    const { data: aiProfile } = await supabase
      .from('ai_user_profiles')
      .select('version')
      .eq('user_id', user.id)
      .maybeSingle();

    const { error } = await supabase
      .from('user_recipe_history')
      .insert({
        user_id: user.id,
        recipe_name: recipe.title || recipe.name,
        recipe_json: recipe,
        rating: feedback.rating,
        liked_aspects: feedback.likedAspects,
        feedback_text: feedback.improvements,
        mood_at_rating: currentMood,
        ai_profile_version_used: aiProfile?.version || 1
      });

    if (error) {
      throw new Error(`Failed to save feedback: ${error.message}`);
    }

    try {
      await updateUserProfileFromFeedback(user.id, {
        rating: feedback.rating,
        liked_aspects: feedback.likedAspects,
        feedback_text: feedback.improvements
      });
    } catch (error) {
      console.error('Failed to update profile from feedback:', error);
    }
  };

  const funFacts = [
    `This ${recipe.cuisine || recipe.cuisineType || 'delicious'} dish combines flavors that complement your current mood perfectly!`,
    `The ingredients in this recipe work together to provide sustained energy throughout your day.`,
    `Fun fact: The combination of these ingredients creates a balanced nutritional profile.`,
    `This recipe's difficulty level matches your current energy, making it perfect for today!`,
    `The prep and cook time are optimized to fit your schedule while maximizing flavor.`
  ];

  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative h-64 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium opacity-80">Recipe Image Placeholder</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title || recipe.name}</h2>
                <p className="text-gray-600 text-lg">{recipe.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {recipe.difficulty}
              </span>

              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-sage/20 text-sage-dark">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Prep: {recipe.prepTime} min
              </span>

              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Cook: {recipe.cookTime} min
              </span>

              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-sage/20 text-sage-dark">
                {recipe.cuisine || recipe.cuisineType}
              </span>

              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {recipe.ingredientMatch}% Match
              </span>
            </div>

            <div className="bg-sage/10 border-l-4 border-sage-light p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-sage-light" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-sage-dark font-medium">Chef's Tip</p>
                  <p className="text-sm text-sage-dark mt-1">{randomFact}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Servings</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        disabled={servings <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-2xl font-bold text-gray-900 w-8 text-center">{servings}</span>
                      <button
                        onClick={() => setServings(Math.min(8, servings + 1))}
                        disabled={servings >= 8}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Nutrition (per serving)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Calories</span>
                        <span className="text-sm font-semibold text-gray-900">{scaledNutrition.calories}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Protein</span>
                        <span className="text-sm font-semibold text-gray-900">{scaledNutrition.protein}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carbs</span>
                        <span className="text-sm font-semibold text-gray-900">{scaledNutrition.carbs}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fat</span>
                        <span className="text-sm font-semibold text-gray-900">{scaledNutrition.fat}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fiber</span>
                        <span className="text-sm font-semibold text-gray-900">{scaledNutrition.fiber}g</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-sage-dark mr-2 mt-0.5">•</span>
                        <span className="flex-1">{scaleIngredient(ingredient)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-sage-dark text-white font-semibold text-sm mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={saving || isSaved}
                variant={isSaved ? 'secondary' : 'primary'}
                className="flex-1"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : isSaved ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Saved
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Save Recipe
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setShowFeedback(true)}
                variant="secondary"
                className="flex-1"
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rate This Recipe
              </Button>
              <Button onClick={onClose} variant="secondary">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      <RecipeFeedback
        recipe={recipe}
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default RecipeDetail;
