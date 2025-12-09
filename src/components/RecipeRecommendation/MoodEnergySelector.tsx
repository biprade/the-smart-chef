interface MoodEnergySelectorProps {
  mood: string;
  energy: string;
  onMoodChange: (mood: string) => void;
  onEnergyChange: (energy: string) => void;
}

const moods = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'stressed', emoji: '😤', label: 'Stressed' },
  { value: 'adventurous', emoji: '🤩', label: 'Adventurous' },
  { value: 'comfort', emoji: '🥰', label: 'Comfort' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' }
];

const energyLevels = [
  { value: 'low', icon: '🔋', label: 'Low Energy', description: 'Quick & easy' },
  { value: 'medium', icon: '⚡', label: 'Medium', description: 'Moderate effort' },
  { value: 'high', icon: '🚀', label: 'High Energy', description: 'Ready to cook!' }
];

const MoodEnergySelector = ({
  mood,
  energy,
  onMoodChange,
  onEnergyChange
}: MoodEnergySelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How are you feeling?
        </label>
        <div className="grid grid-cols-5 gap-3">
          {moods.map((moodOption) => (
            <button
              key={moodOption.value}
              type="button"
              onClick={() => onMoodChange(moodOption.value)}
              className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                mood === moodOption.value
                  ? 'border-sage bg-sage/10 shadow-md scale-105'
                  : 'border-gray-200 hover:border-sage hover:bg-gray-50'
              }`}
            >
              <span className="text-3xl mb-1">{moodOption.emoji}</span>
              <span className="text-xs font-medium text-gray-700">{moodOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Energy level for cooking?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {energyLevels.map((energyOption) => (
            <button
              key={energyOption.value}
              type="button"
              onClick={() => onEnergyChange(energyOption.value)}
              className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                energy === energyOption.value
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl mr-3">{energyOption.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{energyOption.label}</div>
                <div className="text-xs text-gray-500">{energyOption.description}</div>
              </div>
              {energy === energyOption.value && (
                <svg
                  className="w-5 h-5 text-green-500 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodEnergySelector;
