export interface Recipe {
  id?: string;
  name: string;
  title?: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  totalTime?: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisineType: string;
  cuisine?: string;
  dietaryInfo: string[];
  tags: string[];
  nutrition?: NutritionInfo;
  image?: string;
  saved?: boolean;
  ingredientMatch?: number;
  created_at?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface RecipePreferences {
  ingredients: string[];
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  moodLevel: string;
  energyLevel: string;
  cookingTime: number;
  servings: number;
}
