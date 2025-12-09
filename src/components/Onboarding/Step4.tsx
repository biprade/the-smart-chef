interface Step4Props {
  data: {
    healthGoals: {
      weightManagement: string;
      energyLevel: string;
      specificGoals: string[];
    };
  };
  onChange: (field: string, value: any) => void;
}

const Step4 = ({ data, onChange }: Step4Props) => {
  const weightOptions = ['Lose Weight', 'Maintain Weight', 'Gain Weight', 'Not a priority'];
  const energyOptions = ['Low', 'Moderate', 'High', 'Very High'];
  const specificGoals = [
    { value: 'heart-health', label: 'Heart Health', icon: '❤️' },
    { value: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'diabetes-management', label: 'Diabetes Management', icon: '🩺' },
    { value: 'better-sleep', label: 'Better Sleep', icon: '😴' },
    { value: 'digestive-health', label: 'Digestive Health', icon: '🥗' },
    { value: 'general-wellness', label: 'General Wellness', icon: '✨' }
  ];

  const toggleSpecificGoal = (goal: string) => {
    const currentGoals = data.healthGoals.specificGoals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];
    onChange('healthGoals', {
      ...data.healthGoals,
      specificGoals: newGoals
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Weight Management</h3>
        <p className="text-gray-600 mb-4">What's your goal?</p>
        <div className="grid grid-cols-2 gap-3">
          {weightOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChange('healthGoals', {
                ...data.healthGoals,
                weightManagement: option
              })}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                data.healthGoals.weightManagement === option
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Energy Level Goal</h3>
        <p className="text-gray-600 mb-4">How energetic do you want to feel?</p>
        <div className="grid grid-cols-2 gap-3">
          {energyOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChange('healthGoals', {
                ...data.healthGoals,
                energyLevel: option
              })}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                data.healthGoals.energyLevel === option
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-brand-black mb-4">Specific Health Goals</h3>
        <p className="text-gray-600 mb-4">Select all that apply (optional)</p>
        <div className="grid grid-cols-2 gap-4">
          {specificGoals.map((goal) => (
            <button
              key={goal.value}
              onClick={() => toggleSpecificGoal(goal.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.healthGoals.specificGoals.includes(goal.value)
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-brand-black border-beige-dark hover:border-sage'
              }`}
            >
              <div className="text-2xl mb-2">{goal.icon}</div>
              <div className="font-bold">{goal.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4;
