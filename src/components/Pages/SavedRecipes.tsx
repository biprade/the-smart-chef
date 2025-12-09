import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../services/supabaseClient';
import type { Recipe } from '../../types/recipe';
import Card from '../Common/Card';
import Button from '../Common/Button';
import DashboardLayout from '../Dashboard/DashboardLayout';
import RecipeDetail from '../RecipeRecommendation/RecipeDetail';
import { RecipeCardSkeleton } from '../Common/SkeletonLoader';
import LoadingSpinner from '../Common/LoadingSpinner';

interface SavedRecipe {
  id: string;
  recipe_name: string;
  recipe_json: Recipe;
  user_rating: number | null;
  saved_at: string;
  cooked_count: number;
}

type FilterType = 'all' | 'quick' | 'vegan' | 'high-protein';

const SavedRecipes = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  useEffect(() => {
    applyFilter(activeFilter);
  }, [savedRecipes, activeFilter]);

  const fetchSavedRecipes = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      setSavedRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching saved recipes:', error);
      showToast('Failed to load saved recipes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filter: FilterType) => {
    setActiveFilter(filter);

    if (filter === 'all') {
      setFilteredRecipes(savedRecipes);
      return;
    }

    const filtered = savedRecipes.filter(saved => {
      const recipe = saved.recipe_json;

      switch (filter) {
        case 'quick':
          return (recipe.totalTime || recipe.prepTime + recipe.cookTime) <= 30;
        case 'vegan':
          return recipe.tags?.some(tag =>
            tag.toLowerCase().includes('vegan') ||
            tag.toLowerCase().includes('plant-based')
          ) || recipe.title.toLowerCase().includes('vegan');
        case 'high-protein':
          return (recipe.nutrition?.protein || 0) >= 25;
        default:
          return true;
      }
    });

    setFilteredRecipes(filtered);
  };

  const handleCookNow = async (recipeId: string) => {
    setActionLoading(recipeId);
    try {
      const recipe = savedRecipes.find(r => r.id === recipeId);
      if (!recipe) return;

      const { error } = await supabase
        .from('saved_recipes')
        .update({ cooked_count: recipe.cooked_count + 1 })
        .eq('id', recipeId);

      if (error) throw error;

      setSavedRecipes(prev =>
        prev.map(r =>
          r.id === recipeId ? { ...r, cooked_count: r.cooked_count + 1 } : r
        )
      );

      showToast('Recipe marked as cooked!', 'success');
    } catch (error: any) {
      console.error('Error updating cooked count:', error);
      showToast('Failed to update recipe', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (recipeId: string) => {
    if (!confirm('Are you sure you want to remove this recipe?')) return;

    setActionLoading(recipeId);
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
      showToast('Recipe removed successfully', 'success');
    } catch (error: any) {
      console.error('Error removing recipe:', error);
      showToast('Failed to remove recipe', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filterButtons = [
    { id: 'all' as FilterType, label: 'All Recipes', icon: '📚' },
    { id: 'quick' as FilterType, label: 'Quick (<30 min)', icon: '⚡' },
    { id: 'vegan' as FilterType, label: 'Vegan', icon: '🌱' },
    { id: 'high-protein' as FilterType, label: 'High-Protein', icon: '💪' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-900">Saved Recipes</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Recipes</h1>
          <p className="text-gray-600">
            <span className="inline-flex items-center px-3 py-1 bg-sage/20 text-sage-dark rounded-full text-sm font-medium">
              {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </p>
        </div>

        <div className="mb-8 animate-slideUp">
          <div className="flex flex-wrap gap-3">
            {filterButtons.map(filter => (
              <button
                key={filter.id}
                onClick={() => applyFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-sage-dark text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-sage'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <Card className="text-center py-12 animate-fadeIn">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeFilter === 'all' ? 'No saved recipes yet' : 'No recipes match this filter'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilter === 'all'
                ? 'Start saving recipes from your recommendations to build your collection'
                : 'Try a different filter to see more recipes'}
            </p>
            {activeFilter !== 'all' && (
              <Button onClick={() => applyFilter('all')} variant="primary">
                View All Recipes
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((saved, index) => (
              <Card key={saved.id} className={`flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideUp stagger-${Math.min((index % 3) + 1, 4)}`}>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                      {saved.recipe_json.title}
                    </h3>
                    {saved.user_rating && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">{saved.user_rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {saved.recipe_json.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Time</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {(saved.recipe_json.totalTime || saved.recipe_json.prepTime + saved.recipe_json.cookTime)}m
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Calories</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {saved.recipe_json.nutrition?.calories || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Cooked</div>
                      <div className="text-sm font-semibold text-sage-dark">
                        {saved.cooked_count}x
                      </div>
                    </div>
                  </div>

                  {saved.recipe_json.tags && saved.recipe_json.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {saved.recipe_json.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {saved.recipe_json.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 text-gray-500">
                          +{saved.recipe_json.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    Saved {new Date(saved.saved_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => setSelectedRecipe(saved.recipe_json)}
                    variant="secondary"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleCookNow(saved.id)}
                    disabled={actionLoading === saved.id}
                    variant="primary"
                    className="flex-1"
                  >
                    {actionLoading === saved.id ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      'Cook Now'
                    )}
                  </Button>
                  <button
                    onClick={() => handleRemove(saved.id)}
                    disabled={actionLoading === saved.id}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove recipe"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isSaved={true}
        />
      )}
    </DashboardLayout>
  );
};

export default SavedRecipes;
