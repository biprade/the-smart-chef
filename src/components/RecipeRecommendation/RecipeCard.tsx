import { useState } from 'react';
import { Recipe } from '../../types/recipe';
import Card from '../Common/Card';
import RecipeDetail from './RecipeDetail';
import Button from '../Common/Button';

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (recipe: Recipe) => void;
  isSaved?: boolean;
}

const RecipeCard = ({ recipe, onSave, isSaved = false }: RecipeCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave(recipe);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideUp">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{recipe.title}</h3>
            <p className="text-gray-600 text-sm">{recipe.description}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || isSaved}
            className={`ml-4 p-2 rounded-lg transition-all ${
              isSaved
                ? 'bg-green-100 text-green-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={isSaved ? 'Saved' : 'Save recipe'}
          >
            {saving ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isSaved ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sage/20 text-sage-dark">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {recipe.totalTime} min
          </span>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sage/20 text-sage-dark">
            {recipe.cuisine}
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {recipe.ingredientMatch}% Match
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {recipe.servings} servings
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Nutrition (per serving)</h4>
          <div className="grid grid-cols-5 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.calories}</div>
              <div className="text-xs text-gray-500">Calories</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.protein}g</div>
              <div className="text-xs text-gray-500">Protein</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.carbs}g</div>
              <div className="text-xs text-gray-500">Carbs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.fat}g</div>
              <div className="text-xs text-gray-500">Fat</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{recipe.nutrition.fiber}g</div>
              <div className="text-xs text-gray-500">Fiber</div>
            </div>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Button
          onClick={() => setShowModal(true)}
          variant="secondary"
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Full Recipe
        </Button>
      </div>

      <RecipeDetail
        recipe={recipe}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={onSave}
        isSaved={isSaved}
      />
    </Card>
  );
};

export default RecipeCard;
