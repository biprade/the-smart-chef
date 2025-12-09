import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface IngredientInputProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

const mockIngredients = [
  'Chicken', 'Beef', 'Pork', 'Salmon', 'Shrimp', 'Tofu',
  'Rice', 'Pasta', 'Quinoa', 'Noodles',
  'Tomatoes', 'Onions', 'Garlic', 'Bell Peppers', 'Mushrooms', 'Spinach',
  'Broccoli', 'Carrots', 'Potatoes', 'Sweet Potatoes',
  'Eggs', 'Cheese', 'Milk', 'Butter', 'Cream',
  'Olive Oil', 'Soy Sauce', 'Lemon', 'Lime', 'Ginger',
  'Basil', 'Cilantro', 'Parsley', 'Oregano', 'Thyme'
];

const IngredientInput = ({ selectedIngredients, onIngredientsChange }: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setActiveSuggestionIndex(-1);

    if (value.trim()) {
      const filtered = mockIngredients.filter(
        (ingredient) =>
          ingredient.toLowerCase().includes(value.toLowerCase()) &&
          !selectedIngredients.includes(ingredient)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !selectedIngredients.includes(ingredient)) {
      onIngredientsChange([...selectedIngredients, ingredient]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(selectedIngredients.filter((item) => item !== ingredient));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        addIngredient(suggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addIngredient(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedIngredients.length > 0) {
      removeIngredient(selectedIngredients[selectedIngredients.length - 1]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        What ingredients do you have?
      </label>

      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-sage focus-within:border-sage transition-all min-h-[56px]">
          {selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sage/20 text-sage-dark hover:bg-sage/30 transition-colors"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(ingredient)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-sage/40 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            placeholder={selectedIngredients.length === 0 ? 'Type an ingredient...' : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addIngredient(suggestion)}
                className={`w-full text-left px-4 py-2 hover:bg-sage/10 transition-colors ${
                  index === activeSuggestionIndex ? 'bg-sage/10' : ''
                }`}
              >
                <span className="text-gray-900">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Press Enter to add, Backspace to remove the last ingredient
      </p>
    </div>
  );
};

export default IngredientInput;
