import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Recipe } from '../../types/recipe';
import Button from '../Common/Button';

interface RecipeFeedbackProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: RecipeFeedbackData) => Promise<void>;
}

export interface RecipeFeedbackData {
  rating: number;
  likedAspects: string[];
  improvements: string;
}

const LIKED_ASPECTS_OPTIONS = [
  { id: 'taste', label: 'Great Taste' },
  { id: 'easy', label: 'Easy to Make' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'quick', label: 'Quick to Prepare' },
  { id: 'filling', label: 'Filling & Satisfying' },
  { id: 'ingredients', label: 'Good Ingredient Match' },
  { id: 'presentation', label: 'Looks Appealing' },
  { id: 'mood-match', label: 'Matched My Mood' },
];

const RecipeFeedback = ({ recipe, isOpen, onClose, onSubmit }: RecipeFeedbackProps) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [likedAspects, setLikedAspects] = useState<string[]>([]);
  const [improvements, setImprovements] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setRating(0);
      setHoveredRating(0);
      setLikedAspects([]);
      setImprovements('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAspectToggle = (aspectId: string) => {
    setLikedAspects(prev =>
      prev.includes(aspectId)
        ? prev.filter(id => id !== aspectId)
        : [...prev, aspectId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showToast('Please select a rating', 'info');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        rating,
        likedAspects,
        improvements: improvements.trim(),
      });
      onClose();
      showToast('Thank you for your feedback!', 'success');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      showToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Rate Your Experience</h2>
            <p className="text-blue-100">{recipe.title}</p>
          </div>

          <div className="px-8 py-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                How would you rate this recipe?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <svg
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-2xl font-bold text-gray-900">{rating}/5</span>
                )}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {rating === 1 && 'Not great'}
                  {rating === 2 && 'Could be better'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very good'}
                  {rating === 5 && 'Excellent!'}
                </p>
              )}
            </div>

            {rating > 0 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    What did you like about this recipe?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {LIKED_ASPECTS_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAspectToggle(option.id)}
                        className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                          likedAspects.includes(option.id)
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                            likedAspects.includes(option.id)
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {likedAspects.includes(option.id) && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="improvements"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    How could this recipe be improved?
                  </label>
                  <textarea
                    id="improvements"
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="Share your thoughts on how we could make this recipe better..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0 transition-colors resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional</p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={submitting || rating === 0}
                variant="primary"
                className="flex-1"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeFeedback;
