/*
  # Remove recipes table

  1. Changes
    - Drop the recipes table as recipes will be generated dynamically by AI
    - Recipes are not stored in the database
    - Only user-saved/bookmarked recipes are stored in saved_recipes table

  2. Rationale
    - The app uses AI to generate personalized recipes on-demand
    - Static recipe storage is not needed for the core functionality
*/

DROP TABLE IF EXISTS recipes CASCADE;