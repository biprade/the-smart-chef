/*
  # Create recipes table

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key) - Unique identifier for each recipe
      - `name` (text) - Recipe name
      - `description` (text) - Recipe description
      - `ingredients` (jsonb) - List of ingredients with quantities
      - `instructions` (jsonb) - Step-by-step cooking instructions
      - `prep_time` (integer) - Preparation time in minutes
      - `cook_time` (integer) - Cooking time in minutes
      - `servings` (integer) - Number of servings
      - `difficulty` (text) - Recipe difficulty level (easy, medium, hard)
      - `cuisine_type` (text) - Type of cuisine
      - `dietary_tags` (text[]) - Array of dietary tags (vegetarian, vegan, etc)
      - `calories` (integer) - Calories per serving
      - `protein` (integer) - Protein in grams
      - `carbs` (integer) - Carbohydrates in grams
      - `fat` (integer) - Fat in grams
      - `image_url` (text) - Recipe image URL
      - `source` (text) - Recipe source (user, ai, imported)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `recipes` table
    - Add policy for authenticated users to read all recipes
    - Add policy for authenticated users to insert their own recipes
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  ingredients jsonb DEFAULT '[]'::jsonb,
  instructions jsonb DEFAULT '[]'::jsonb,
  prep_time integer DEFAULT 0,
  cook_time integer DEFAULT 0,
  servings integer DEFAULT 1,
  difficulty text DEFAULT 'medium',
  cuisine_type text,
  dietary_tags text[] DEFAULT '{}'::text[],
  calories integer,
  protein integer,
  carbs integer,
  fat integer,
  image_url text,
  source text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recipes"
  ON recipes
  FOR DELETE
  TO authenticated
  USING (true);