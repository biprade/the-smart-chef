import { useState, useEffect } from 'react';
import Card from '../Common/Card';
import RecipeDetail from '../RecipeRecommendation/RecipeDetail';
import { Recipe as FullRecipe } from '../../types/recipe';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { getUserProfile } from '../../services/openaiService';

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cuisine: string;
  difficulty: string;
  imageUrl: string;
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A vibrant bowl packed with fresh vegetables, quinoa, and a tangy lemon dressing.',
    prepTime: '25 mins',
    cuisine: 'Mediterranean',
    difficulty: 'Easy',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Thai Coconut Curry',
    description: 'Creamy coconut curry with aromatic spices and fresh vegetables.',
    prepTime: '35 mins',
    cuisine: 'Thai',
    difficulty: 'Medium',
    imageUrl: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Grilled Salmon with Asparagus',
    description: 'Perfectly grilled salmon fillet with roasted asparagus and lemon butter.',
    prepTime: '20 mins',
    cuisine: 'American',
    difficulty: 'Easy',
    imageUrl: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    title: 'Mexican Street Tacos',
    description: 'Authentic street-style tacos with fresh cilantro, onions, and lime.',
    prepTime: '30 mins',
    cuisine: 'Mexican',
    difficulty: 'Easy',
    imageUrl: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const FeaturedRecipes = () => {
  const { user } = useAuth();
  const [selectedRecipe, setSelectedRecipe] = useState<FullRecipe | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [userProfile, setUserProfile] = useState<any>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(mockRecipes);

  useEffect(() => {
    if (user) {
      loadSavedRecipes();
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);

      if (profile?.dietary_restrictions && profile.dietary_restrictions.length > 0) {
        const filtered = mockRecipes.filter(recipe => {
          const recipeLower = recipe.title.toLowerCase() + ' ' + recipe.description.toLowerCase();
          return !profile.dietary_restrictions.some((restriction: string) =>
            recipeLower.includes(restriction.toLowerCase())
          );
        });
        setFilteredRecipes(filtered);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadSavedRecipes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_recipes')
      .select('recipe_json')
      .eq('user_id', user.id);

    if (!error && data) {
      const ids = new Set(data.map((item: any) => item.recipe_json?.id).filter(Boolean));
      setSavedRecipeIds(ids);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const convertToFullRecipe = (recipe: Recipe): FullRecipe => {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      prepTime: parseInt(recipe.prepTime),
      cookTime: 10,
      totalTime: parseInt(recipe.prepTime) + 10,
      servings: 4,
      difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard',
      cuisine: recipe.cuisine,
      ingredientMatch: 0,
      ingredients: [
        'Fresh seasonal ingredients',
        'Quality olive oil',
        'Fresh herbs and spices',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Prepare all ingredients by washing and chopping as needed.',
        'Follow the cooking method appropriate for the recipe.',
        'Season and taste as you go.',
        'Plate beautifully and enjoy!'
      ],
      nutrition: {
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 12,
        fiber: 8
      },
      tags: [recipe.cuisine, recipe.difficulty]
    };
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(convertToFullRecipe(recipe));
  };

  const handleSaveRecipe = async (recipe: FullRecipe) => {
    if (!user) {
      throw new Error('You must be logged in to save recipes');
    }

    const { error } = await supabase
      .from('saved_recipes')
      .insert({
        user_id: user.id,
        recipe_name: recipe.title,
        recipe_json: recipe,
        cooked_count: 0,
        saved_at: new Date().toISOString()
      });

    if (error) {
      throw new Error('Failed to save recipe');
    }

    setSavedRecipeIds(prev => new Set(prev).add(recipe.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
          <p className="text-gray-600 mt-1">Discover delicious meals tailored for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="group cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleRecipeClick(recipe)}
          >
            <div className="relative overflow-hidden rounded-lg mb-4 h-48">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                    recipe.difficulty
                  )}`}
                >
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-sage-dark transition-colors">
              {recipe.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{recipe.prepTime}</span>
              </div>
              <span className="text-sage-dark font-medium">{recipe.cuisine}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        {userProfile?.dietary_restrictions && userProfile.dietary_restrictions.length > 0 ? (
          <p className="text-gray-500 text-sm">
            Showing recipes that match your dietary preferences (avoiding: {userProfile.dietary_restrictions.join(', ')})
          </p>
        ) : (
          <p className="text-gray-500 text-sm">
            Personalized recommendations based on your profile!
          </p>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onSave={handleSaveRecipe}
          isSaved={savedRecipeIds.has(selectedRecipe.id)}
        />
      )}
    </div>
  );
};

export default FeaturedRecipes;
