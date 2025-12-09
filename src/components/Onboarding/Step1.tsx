import Input from '../Common/Input';

interface Step1Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const Step1 = ({ formData, onChange }: Step1Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <Input
        label="Name"
        value={formData.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Enter your name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Range
        </label>
        <select
          value={formData.age_range || ''}
          onChange={(e) => onChange('age_range', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
        >
          <option value="">Select age range</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55+">55+</option>
        </select>
      </div>
    </div>
  );
};

export default Step1;
