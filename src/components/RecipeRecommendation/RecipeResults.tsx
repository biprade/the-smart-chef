import { Recipe } from '../../types/recipe';
import Card from '../Common/Card';
import RecipeCard from './RecipeCard';
import { RecipeCardSkeleton } from '../Common/SkeletonLoader';
import ErrorBanner from '../Common/ErrorBanner';

interface RecipeResultsProps {
  recipes?: Recipe[];
  isLoading?: boolean;
  hasSearched?: boolean;
  error?: string;
  onSaveRecipe?: (recipe: Recipe) => void;
  savedRecipeIds?: Set<string>;
}

const RecipeResults = ({
  recipes = [],
  isLoading = false,
  hasSearched = false,
  error,
  onSaveRecipe,
  savedRecipeIds = new Set()
}: RecipeResultsProps) => {
  if (error) {
    return (
      <div className="sticky top-8 animate-fadeIn">
        <ErrorBanner message={error} type="error" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center space-x-3">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-sage-dark border-t-transparent"></div>
          <h2 className="text-2xl font-bold text-gray-900">Finding Perfect Recipes...</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="sticky top-8 animate-fadeIn">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-sage/20 to-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-sage-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Find Your Recipe?
            </h3>
            <p className="text-gray-600 max-w-md">
              Fill in your ingredients, mood, and energy level on the left, then click "Find Recipes" to get personalized recommendations!
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Personalized</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Instant</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="sticky top-8 animate-fadeIn">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Recipes Found
            </h3>
            <p className="text-gray-600 max-w-md">
              We couldn't find any recipes matching your criteria. Try adjusting your ingredients or preferences.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Personalized Recipes
        </h2>
        <span className="text-sm font-medium px-3 py-1 bg-sage/20 text-sage-dark rounded-full">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </span>
      </div>

      <div className="space-y-6">
        {recipes.map((recipe, index) => (
          <div key={recipe.id} className={`stagger-${Math.min(index + 1, 4)}`}>
            <RecipeCard
              recipe={recipe}
              onSave={onSaveRecipe}
              isSaved={savedRecipeIds.has(recipe.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeResults;
