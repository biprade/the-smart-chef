interface Step3Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const Step3 = ({ formData, onChange }: Step3Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Goals</h2>
        <p className="text-gray-600">What are your health objectives?</p>
      </div>

      <div className="space-y-3">
        {['Weight Loss', 'Muscle Gain', 'Heart Health', 'Diabetes Management', 'General Wellness'].map((goal) => (
          <label
            key={goal}
            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={(formData.health_goals || []).includes(goal)}
              onChange={(e) => {
                const current = formData.health_goals || [];
                if (e.target.checked) {
                  onChange('health_goals', [...current, goal]);
                } else {
                  onChange('health_goals', current.filter((g: string) => g !== goal));
                }
              }}
              className="mr-2"
            />
            <span className="text-sm">{goal}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Step3;
