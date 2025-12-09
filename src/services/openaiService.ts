import { supabase } from './supabaseClient';
import { Recipe, RecipePreferences } from '../types/recipe';

export const getUserAIProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_profiles')
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

export const getPersonalizedRecipes = async (preferences: RecipePreferences): Promise<Recipe[]> => {
  // TODO: Use preferences to filter recipes
  console.log('Fetching recipes with preferences:', preferences);

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const updateUserProfileFromFeedback = async (userId: string, feedback: any) => {
  const { data, error } = await supabase
    .from('ai_profiles')
    .upsert({
      user_id: userId,
      ...feedback,
      updated_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
