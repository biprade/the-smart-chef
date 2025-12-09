/*
  # Seed sample recipes

  1. Data
    - Inserts 10 diverse sample recipes covering various cuisines, dietary preferences, and difficulty levels
    - Includes recipes for:
      - Quick meals (15-30 mins)
      - Vegetarian and vegan options
      - Different cuisines (Italian, Mexican, Asian, Mediterranean, American)
      - Various difficulty levels (easy, medium)
      - Complete nutrition information
      - Detailed ingredients and instructions

  2. Purpose
    - Provides initial recipe data for testing and demonstration
    - Ensures users can see recipe recommendations immediately
    - Covers common dietary restrictions and preferences
*/

INSERT INTO recipes (name, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, cuisine_type, dietary_tags, calories, protein, carbs, fat, source, image_url) VALUES

('Classic Margherita Pizza', 'Simple and delicious homemade pizza with fresh mozzarella and basil', 
'["1 pizza dough", "1 cup tomato sauce", "8 oz fresh mozzarella", "Fresh basil leaves", "2 tbsp olive oil", "Salt to taste"]'::jsonb,
'["Preheat oven to 475°F (245°C)", "Roll out pizza dough on floured surface", "Spread tomato sauce evenly", "Add torn mozzarella pieces", "Drizzle with olive oil and season with salt", "Bake for 12-15 minutes until crust is golden", "Top with fresh basil leaves before serving"]'::jsonb,
15, 15, 4, 'easy', 'Italian', '{"Vegetarian"}', 320, 14, 42, 10, 'system', 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg'),

('Veggie Buddha Bowl', 'Nutritious bowl packed with colorful vegetables, quinoa, and tahini dressing',
'["1 cup quinoa", "1 sweet potato", "1 cup chickpeas", "2 cups kale", "1 avocado", "1/4 cup tahini", "2 tbsp lemon juice", "1 tbsp olive oil"]'::jsonb,
'["Cook quinoa according to package instructions", "Roast cubed sweet potato at 400°F for 25 minutes", "Massage kale with olive oil", "Warm chickpeas in a pan", "Assemble bowl with quinoa base, add vegetables and chickpeas", "Mix tahini with lemon juice and water for dressing", "Drizzle dressing over bowl and top with sliced avocado"]'::jsonb,
15, 30, 2, 'easy', 'Mediterranean', '{"Vegetarian", "Vegan", "Gluten-Free"}', 480, 18, 62, 20, 'system', 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg'),

('Chicken Stir-Fry', 'Quick and flavorful Asian-inspired chicken and vegetable stir-fry',
'["1 lb chicken breast", "2 cups mixed vegetables", "3 tbsp soy sauce", "2 tbsp sesame oil", "2 cloves garlic", "1 inch ginger", "2 cups cooked rice"]'::jsonb,
'["Cut chicken into bite-sized pieces", "Heat sesame oil in wok or large pan", "Stir-fry chicken until cooked through, remove from pan", "Add vegetables, minced garlic, and ginger", "Cook vegetables until tender-crisp", "Return chicken to pan, add soy sauce", "Serve hot over rice"]'::jsonb,
10, 15, 4, 'easy', 'Chinese', '{"Dairy-Free"}', 420, 38, 45, 8, 'system', 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg'),

('Tacos with Black Beans', 'Delicious vegetarian tacos with seasoned black beans and fresh toppings',
'["8 corn tortillas", "2 cups black beans", "1 tsp cumin", "1 tsp chili powder", "1 avocado", "1 cup salsa", "1/2 cup cilantro", "Lime wedges"]'::jsonb,
'["Drain and rinse black beans", "Heat beans with cumin and chili powder", "Warm tortillas in dry pan", "Mash beans slightly while heating", "Assemble tacos with beans, diced avocado, and salsa", "Top with fresh cilantro", "Serve with lime wedges"]'::jsonb,
10, 10, 4, 'easy', 'Mexican', '{"Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"}', 280, 12, 46, 8, 'system', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg'),

('Salmon with Asparagus', 'Heart-healthy baked salmon with roasted asparagus and lemon',
'["4 salmon fillets", "1 lb asparagus", "3 tbsp olive oil", "2 lemons", "3 cloves garlic", "Salt and pepper", "Fresh dill"]'::jsonb,
'["Preheat oven to 400°F (200°C)", "Place salmon and trimmed asparagus on baking sheet", "Drizzle with olive oil, minced garlic, lemon juice", "Season with salt and pepper", "Bake for 15-18 minutes until salmon flakes easily", "Garnish with fresh dill and lemon slices"]'::jsonb,
10, 18, 4, 'easy', 'American', '{"Gluten-Free", "Dairy-Free", "Paleo", "Keto"}', 380, 42, 8, 22, 'system', 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg'),

('Thai Green Curry', 'Aromatic and creamy Thai curry with vegetables and tofu',
'["14 oz coconut milk", "3 tbsp green curry paste", "1 block firm tofu", "2 cups mixed vegetables", "1 cup bamboo shoots", "2 tbsp fish sauce", "1 tbsp sugar", "Thai basil", "Jasmine rice"]'::jsonb,
'["Cook jasmine rice according to package", "Cut tofu into cubes and pan-fry until golden", "Heat curry paste in pan until fragrant", "Add coconut milk and bring to simmer", "Add vegetables and bamboo shoots", "Season with fish sauce and sugar", "Add tofu and cook 5 minutes", "Garnish with Thai basil, serve over rice"]'::jsonb,
15, 20, 4, 'medium', 'Thai', '{"Gluten-Free", "Dairy-Free"}', 440, 16, 38, 26, 'system', 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg'),

('Greek Salad with Grilled Chicken', 'Fresh Mediterranean salad with grilled chicken and feta cheese',
'["2 chicken breasts", "4 cups romaine lettuce", "1 cup cherry tomatoes", "1 cucumber", "1/2 red onion", "1/2 cup feta cheese", "1/4 cup kalamata olives", "3 tbsp olive oil", "2 tbsp red wine vinegar", "1 tsp oregano"]'::jsonb,
'["Season chicken with salt, pepper, and oregano", "Grill chicken 6-7 minutes per side", "Chop lettuce, halve tomatoes, cube cucumber", "Slice red onion thinly", "Combine vegetables in large bowl", "Whisk olive oil, vinegar, and oregano for dressing", "Slice grilled chicken", "Top salad with chicken, feta, and olives", "Drizzle with dressing"]'::jsonb,
15, 15, 4, 'easy', 'Mediterranean', '{"Gluten-Free", "Low-Carb", "Keto"}', 340, 32, 12, 20, 'system', 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg'),

('Mushroom Risotto', 'Creamy Italian rice dish with mixed mushrooms and parmesan',
'["1.5 cups arborio rice", "4 cups vegetable broth", "2 cups mixed mushrooms", "1/2 cup white wine", "1/2 cup parmesan", "1 onion", "3 cloves garlic", "3 tbsp butter", "Fresh parsley"]'::jsonb,
'["Heat broth in separate pot and keep warm", "Sauté diced onion in butter until soft", "Add minced garlic and sliced mushrooms", "Add rice and stir to coat", "Pour in wine and stir until absorbed", "Add broth one ladle at a time, stirring constantly", "Continue until rice is creamy and al dente (20-25 mins)", "Stir in parmesan and remaining butter", "Garnish with parsley"]'::jsonb,
10, 35, 4, 'medium', 'Italian', '{"Vegetarian", "Gluten-Free"}', 420, 14, 58, 16, 'system', 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg'),

('Breakfast Smoothie Bowl', 'Energizing smoothie bowl with fresh fruits and granola',
'["2 frozen bananas", "1 cup frozen berries", "1/2 cup Greek yogurt", "1/4 cup almond milk", "1 tbsp honey", "1/4 cup granola", "Fresh berries for topping", "2 tbsp chia seeds", "Sliced banana"]'::jsonb,
'["Blend frozen bananas, berries, yogurt, and almond milk until smooth", "Pour into bowl", "Top with granola, fresh berries, banana slices", "Sprinkle with chia seeds", "Drizzle with honey", "Serve immediately"]'::jsonb,
5, 0, 2, 'easy', 'American', '{"Vegetarian"}', 320, 12, 58, 6, 'system', 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg'),

('Beef and Broccoli', 'Classic Chinese takeout favorite with tender beef and crisp broccoli',
'["1 lb beef sirloin", "3 cups broccoli florets", "1/4 cup soy sauce", "2 tbsp oyster sauce", "1 tbsp cornstarch", "2 cloves garlic", "1 tbsp ginger", "2 tbsp vegetable oil", "Cooked rice"]'::jsonb,
'["Slice beef thinly against the grain", "Mix soy sauce, oyster sauce, and cornstarch", "Marinate beef in half the sauce for 10 minutes", "Heat oil in wok, stir-fry beef until browned", "Remove beef, add broccoli to wok", "Stir-fry broccoli until tender-crisp", "Add garlic and ginger, cook 1 minute", "Return beef to wok with remaining sauce", "Toss everything together until heated through", "Serve over rice"]'::jsonb,
15, 15, 4, 'easy', 'Chinese', '{"Dairy-Free"}', 380, 35, 28, 14, 'system', 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg');