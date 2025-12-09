interface Step2Props {
  data: {
    dietaryRestrictions: string[];
  };
  onChange: (field: string, value: string[]) => void;
}

const Step2 = ({ data, onChange }: Step2Props) => {
  const commonRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Keto', 'Paleo', 'Pescatarian', 'Low-Carb',
    'Low-Fat', 'Low-Sodium', 'Nut-Free', 'Halal', 'Kosher'
  ];

  const toggleRestriction = (restriction: string) => {
    const newRestrictions = data.dietaryRestrictions.includes(restriction)
      ? data.dietaryRestrictions.filter((r) => r !== restriction)
      : [...data.dietaryRestrictions, restriction];
    onChange('dietaryRestrictions', newRestrictions);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Dietary Restrictions</h3>
        <p className="text-gray-600 mb-4">Select all that apply (optional)</p>
        <div className="flex flex-wrap gap-3">
          {commonRestrictions.map((restriction) => (
            <button
              key={restriction}
              onClick={() => toggleRestriction(restriction)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                data.dietaryRestrictions.includes(restriction)
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {restriction}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2;
