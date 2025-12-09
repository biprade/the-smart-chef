import Input from '../Common/Input';

interface Step4Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const Step4 = ({ formData, onChange }: Step4Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cooking Preferences</h2>
        <p className="text-gray-600">Tell us about your cooking style</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cooking Skill Level
        </label>
        <select
          value={formData.cooking_skill || ''}
          onChange={(e) => onChange('cooking_skill', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
        >
          <option value="">Select skill level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <Input
        label="Favorite Cuisines (comma separated)"
        value={formData.favorite_cuisines || ''}
        onChange={(e) => onChange('favorite_cuisines', e.target.value)}
        placeholder="e.g., Italian, Mexican, Asian"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergies or Intolerances
        </label>
        <textarea
          value={formData.allergies || ''}
          onChange={(e) => onChange('allergies', e.target.value)}
          placeholder="List any food allergies or intolerances"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
        />
      </div>
    </div>
  );
};

export default Step4;
