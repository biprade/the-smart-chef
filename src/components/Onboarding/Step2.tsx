interface Step2Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const Step2 = ({ formData, onChange }: Step2Props) => {
  const dietaryPreferences = [
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Halal',
    'Kosher'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dietary Preferences</h2>
        <p className="text-gray-600">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dietaryPreferences.map((pref) => (
          <label
            key={pref}
            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={(formData.dietary_preferences || []).includes(pref)}
              onChange={(e) => {
                const current = formData.dietary_preferences || [];
                if (e.target.checked) {
                  onChange('dietary_preferences', [...current, pref]);
                } else {
                  onChange('dietary_preferences', current.filter((p: string) => p !== pref));
                }
              }}
              className="mr-2"
            />
            <span className="text-sm">{pref}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Step2;
