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
    "ingredients": ["2 cups flour", "1 tablespoon olive oil", "3 large eggs"],
    "instructions": ["step 1", "step 2"],
    "prepTime": 10,
    "cookTime": 20,
    "servings": ${preferences.servings},
    "difficulty": "Easy",
    "cuisineType": "Italian",
    "dietaryInfo": ["Vegetarian"],
    "tags": ["quick", "healthy"],
    "nutrition": {
      "calories": 350,
      "protein": 15,
      "carbs": 45,
      "fat": 12,
      "fiber": 5
    }
  }]`);

  parts.push(`\nIMPORTANT: Include specific quantities in all ingredients (e.g., "2 cups", "1 tablespoon", "3 large") adjusted for exactly ${preferences.servings} ${preferences.servings === 1 ? "person" : "people"}.`);
  parts.push('All ingredient measurements must be precise and appropriate for the servings count.');
  parts.push('Make recipes creative, practical, and tailored to the user\'s mood and energy level.');

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

export const updateUserProfileFromFeedback = async (
  userId: string,
  feedback: {
    rating: number;
    liked_aspects: string[];
    feedback_text: string;
    recipe?: any;
    mood?: string;
  }
) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OpenAI API key not configured, skipping profile update');
    return null;
  }

  try {
    const { data: currentProfile } = await supabase
      .from('ai_user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: recentHistory } = await supabase
      .from('user_recipe_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const prompt = buildProfileUpdatePrompt(
      feedback,
      currentProfile,
      recentHistory || [],
      userProfile
    );

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
            content: 'You are a food psychology expert analyzing user preferences to create personalized taste profiles. Respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const profileUpdate = parseProfileUpdate(content);

    const { data: updatedProfile, error } = await supabase
      .from('ai_user_profiles')
      .upsert({
        user_id: userId,
        personality_profile: profileUpdate.personality_profile,
        dietary_summary: profileUpdate.dietary_summary,
        mood_preferences: profileUpdate.mood_preferences,
        energy_patterns: profileUpdate.energy_patterns,
        profile_strength: Math.min((currentProfile?.profile_strength || 0) + 1, 100),
        version: (currentProfile?.version || 0) + 1,
        last_updated: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile from feedback:', error);
    return null;
  }
};

function buildProfileUpdatePrompt(
  feedback: any,
  currentProfile: any,
  recentHistory: any[],
  userProfile: any
): string {
  const parts = ['Analyze this recipe feedback and update the user\'s food personality profile:'];

  parts.push(`\n## Current Feedback:`);
  parts.push(`Rating: ${feedback.rating}/5`);
  parts.push(`Liked aspects: ${feedback.liked_aspects.join(', ')}`);
  if (feedback.feedback_text) {
    parts.push(`User comments: ${feedback.feedback_text}`);
  }
  if (feedback.recipe) {
    parts.push(`Recipe: ${feedback.recipe.name}`);
    parts.push(`Cuisine: ${feedback.recipe.cuisineType || feedback.recipe.cuisine}`);
    parts.push(`Difficulty: ${feedback.recipe.difficulty}`);
  }
  if (feedback.mood) {
    parts.push(`User mood when rating: ${feedback.mood}`);
  }

  if (currentProfile) {
    parts.push(`\n## Current Profile:`);
    if (currentProfile.personality_profile) {
      parts.push(`Personality: ${currentProfile.personality_profile}`);
    }
    if (currentProfile.dietary_summary) {
      parts.push(`Dietary: ${currentProfile.dietary_summary}`);
    }
    if (currentProfile.mood_preferences) {
      parts.push(`Mood patterns: ${currentProfile.mood_preferences}`);
    }
    parts.push(`Profile strength: ${currentProfile.profile_strength || 1}/100`);
  }

  if (recentHistory.length > 0) {
    parts.push(`\n## Recent Recipe History (last ${recentHistory.length} ratings):`);
    const avgRating = recentHistory.reduce((sum, h) => sum + (h.rating || 0), 0) / recentHistory.length;
    parts.push(`Average rating: ${avgRating.toFixed(1)}/5`);

    const topLikedAspects = recentHistory
      .flatMap(h => h.liked_aspects || [])
      .reduce((acc: any, aspect: string) => {
        acc[aspect] = (acc[aspect] || 0) + 1;
        return acc;
      }, {});

    if (Object.keys(topLikedAspects).length > 0) {
      const sortedAspects = Object.entries(topLikedAspects)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 5)
        .map(([aspect]) => aspect);
      parts.push(`Most valued aspects: ${sortedAspects.join(', ')}`);
    }
  }

  if (userProfile) {
    parts.push(`\n## User Background:`);
    if (userProfile.cuisine_preferences?.length > 0) {
      parts.push(`Preferred cuisines: ${userProfile.cuisine_preferences.join(', ')}`);
    }
    if (userProfile.disliked_foods?.length > 0) {
      parts.push(`Disliked foods: ${userProfile.disliked_foods.join(', ')}`);
    }
  }

  parts.push(`\n## Instructions:`);
  parts.push(`Based on this feedback, update the user's food personality profile.`);
  parts.push(`Consider what the rating and feedback reveal about their:`);
  parts.push(`- Taste preferences and flavor profiles they enjoy`);
  parts.push(`- Cooking complexity they're comfortable with`);
  parts.push(`- How mood affects their food choices`);
  parts.push(`- Dietary patterns and nutrition preferences`);
  parts.push(`- Time/energy considerations for meal prep`);

  parts.push(`\nRespond with JSON in this format:`);
  parts.push(`{
    "personality_profile": "2-3 sentences describing their cooking style and taste preferences",
    "dietary_summary": "1-2 sentences about their dietary preferences and restrictions",
    "mood_preferences": "1-2 sentences about how their mood affects food choices",
    "energy_patterns": "1-2 sentences about their cooking energy and time preferences"
  }`);

  parts.push(`\nMake updates incremental and evidence-based. If this is early feedback, keep insights general.`);
  parts.push(`With more history, make the profile more specific and personalized.`);

  return parts.join('\n');
}

function parseProfileUpdate(content: string): any {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      personality_profile: parsed.personality_profile || '',
      dietary_summary: parsed.dietary_summary || '',
      mood_preferences: parsed.mood_preferences || '',
      energy_patterns: parsed.energy_patterns || '',
    };
  } catch (error) {
    console.error('Error parsing profile update:', error);
    return {
      personality_profile: '',
      dietary_summary: '',
      mood_preferences: '',
      energy_patterns: '',
    };
  }
}
