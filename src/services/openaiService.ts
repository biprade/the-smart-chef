import { supabase } from './supabaseClient';
import { Recipe, RecipePreferences } from '../types/recipe';

export const getUserAIProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const generateUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPersonalizedRecipes = async (
  preferences: RecipePreferences,
  userId?: string
): Promise<Recipe[]> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  let userProfile = null;
  let aiProfile = null;

  if (userId) {
    try {
      userProfile = await getUserProfile(userId);
      aiProfile = await getUserAIProfile(userId);
    } catch (error) {
      console.warn('Could not load user profile:', error);
    }
  }

  const prompt = buildRecipePrompt(preferences, userProfile, aiProfile);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and nutritionist who creates personalized recipe recommendations. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const recipes = parseRecipesFromAI(content);
    return recipes;
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    throw new Error(error.message || 'Failed to generate recipes');
  }
};

function buildRecipePrompt(
  preferences: RecipePreferences,
  userProfile: any,
  aiProfile: any
): string {
  const parts = ['Generate 3-5 personalized recipe recommendations based on the following:'];

  parts.push(`\nAvailable ingredients: ${preferences.ingredients.join(', ')}`);
  parts.push(`Mood: ${preferences.moodLevel}`);
  parts.push(`Energy level: ${preferences.energyLevel}`);

  if (preferences.dietaryRestrictions.length > 0) {
    parts.push(`Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}`);
  }

  if (preferences.cuisinePreferences.length > 0 && preferences.cuisinePreferences[0] !== 'Any') {
    parts.push(`Preferred cuisine: ${preferences.cuisinePreferences.join(', ')}`);
  }

  parts.push(`Maximum cooking time: ${preferences.cookingTime} minutes`);
  parts.push(`Servings: ${preferences.servings}`);

  if (userProfile) {
    if (userProfile.cuisine_preferences?.length > 0) {
      parts.push(`\nUser's favorite cuisines: ${userProfile.cuisine_preferences.join(', ')}`);
    }
    if (userProfile.disliked_foods?.length > 0) {
      parts.push(`Foods to avoid: ${userProfile.disliked_foods.join(', ')}`);
    }
    if (userProfile.health_goals) {
      parts.push(`Health goals: ${JSON.stringify(userProfile.health_goals)}`);
    }
  }

  if (aiProfile) {
    if (aiProfile.personality_profile) {
      parts.push(`\nUser personality: ${aiProfile.personality_profile}`);
    }
    if (aiProfile.dietary_summary) {
      parts.push(`Dietary preferences: ${aiProfile.dietary_summary}`);
    }
    if (aiProfile.mood_preferences) {
      parts.push(`Mood preferences: ${aiProfile.mood_preferences}`);
    }
  }

  parts.push('\nRespond with a JSON array of recipes with the following structure:');
  parts.push(`[{
    "id": "unique-id",
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "prepTime": 10,
    "cookTime": 20,
    "servings": 4,
    "difficulty": "Easy",
    "cuisineType": "Italian",
    "dietaryInfo": ["Vegetarian"],
    "tags": ["quick", "healthy"],
    "nutrition": {
      "calories": 350,
      "protein": 15,
      "carbs": 45,
      "fat": 12
    }
  }]`);

  parts.push('\nMake recipes creative, practical, and tailored to the user\'s mood and energy level.');

  return parts.join('\n');
}

function parseRecipesFromAI(content: string): Recipe[] {
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const recipes = JSON.parse(jsonMatch[0]);

    return recipes.map((recipe: any) => ({
      id: recipe.id || crypto.randomUUID(),
      name: recipe.name || recipe.title || 'Untitled Recipe',
      title: recipe.name || recipe.title,
      description: recipe.description || '',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      prepTime: recipe.prepTime || recipe.prep_time || 0,
      cookTime: recipe.cookTime || recipe.cook_time || 0,
      totalTime: (recipe.prepTime || recipe.prep_time || 0) + (recipe.cookTime || recipe.cook_time || 0),
      servings: recipe.servings || 4,
      difficulty: recipe.difficulty || 'Medium',
      cuisineType: recipe.cuisineType || recipe.cuisine_type || recipe.cuisine || 'International',
      cuisine: recipe.cuisineType || recipe.cuisine_type || recipe.cuisine,
      dietaryInfo: Array.isArray(recipe.dietaryInfo) ? recipe.dietaryInfo :
                   Array.isArray(recipe.dietary_tags) ? recipe.dietary_tags : [],
      tags: Array.isArray(recipe.tags) ? recipe.tags : [],
      nutrition: recipe.nutrition || undefined,
      image: recipe.image || recipe.image_url,
    }));
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse recipe data from AI');
  }
}

export const updateUserProfileFromFeedback = async (userId: string, feedback: any) => {
  const { data, error } = await supabase
    .from('ai_user_profiles')
    .upsert({
      user_id: userId,
      ...feedback,
      last_updated: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
