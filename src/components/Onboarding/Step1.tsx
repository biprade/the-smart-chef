import Input from '../Common/Input';

interface Step1Props {
  data: {
    name: string;
    ageRange: string;
    gender: string;
    ethnicity: string;
  };
  errors: {
    name?: string;
    ageRange?: string;
    gender?: string;
    ethnicity?: string;
  };
  onChange: (field: string, value: string) => void;
}

const Step1 = ({ data, errors, onChange }: Step1Props) => {
  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const ethnicities = ['Asian', 'Black', 'Hispanic', 'White', 'Mixed', 'Other', 'Prefer not to say'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Tell Us About Yourself</h3>
        <p className="text-gray-600 mb-4">Help us personalize your experience</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-black mb-2">
          Name
        </label>
        <Input
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter your name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-black mb-2">
          Age Range
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ageRanges.map((range) => (
            <button
              key={range}
              onClick={() => onChange('ageRange', range)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                data.ageRange === range
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        {errors.ageRange && (
          <p className="mt-2 text-sm text-red-600">{errors.ageRange}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-black mb-2">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-3">
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => onChange('gender', gender)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                data.gender === gender
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
        {errors.gender && (
          <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-black mb-2">
          Ethnicity
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ethnicities.map((ethnicity) => (
            <button
              key={ethnicity}
              onClick={() => onChange('ethnicity', ethnicity)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                data.ethnicity === ethnicity
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {ethnicity}
            </button>
          ))}
        </div>
        {errors.ethnicity && (
          <p className="mt-2 text-sm text-red-600">{errors.ethnicity}</p>
        )}
      </div>
    </div>
  );
};

export default Step1;
