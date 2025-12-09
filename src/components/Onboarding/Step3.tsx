interface Step3Props {
  data: {
    cuisinePreferences: string[];
    dislikedFoods: string[];
  };
  errors: {
    cuisinePreferences?: string;
  };
  onChange: (field: string, value: string[]) => void;
}

const Step3 = ({ data, errors, onChange }: Step3Props) => {
  const cuisines = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian',
    'Thai', 'French', 'Greek', 'Mediterranean', 'American',
    'Korean', 'Vietnamese', 'Middle Eastern', 'Spanish'
  ];

  const commonDislikes = [
    'Mushrooms', 'Olives', 'Onions', 'Tomatoes', 'Cilantro',
    'Seafood', 'Spicy Food', 'Blue Cheese', 'Organ Meats'
  ];

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = data.cuisinePreferences.includes(cuisine)
      ? data.cuisinePreferences.filter((c) => c !== cuisine)
      : [...data.cuisinePreferences, cuisine];
    onChange('cuisinePreferences', newCuisines);
  };

  const toggleDislike = (food: string) => {
    const newDislikes = data.dislikedFoods.includes(food)
      ? data.dislikedFoods.filter((f) => f !== food)
      : [...data.dislikedFoods, food];
    onChange('dislikedFoods', newDislikes);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Cuisine Preferences</h3>
        <p className="text-gray-600 mb-4">Select your favorite cuisines</p>
        <div className="flex flex-wrap gap-3">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                data.cuisinePreferences.includes(cuisine)
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
        {errors.cuisinePreferences && (
          <p className="mt-2 text-sm text-red-600">{errors.cuisinePreferences}</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Foods You Dislike</h3>
        <p className="text-gray-600 mb-4">Help us avoid ingredients you don't enjoy (optional)</p>
        <div className="flex flex-wrap gap-3">
          {commonDislikes.map((food) => (
            <button
              key={food}
              onClick={() => toggleDislike(food)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                data.dislikedFoods.includes(food)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-brand-black border-beige-dark hover:border-red-500'
              }`}
            >
              {food}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3;
