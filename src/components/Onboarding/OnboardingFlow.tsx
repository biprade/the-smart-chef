import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { generateUserProfile } from '../../services/openaiService';
import Button from '../Common/Button';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

interface OnboardingData {
  name: string;
  ageRange: string;
  gender: string;
  ethnicity: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  dislikedFoods: string[];
  healthGoals: {
    weightManagement: string;
    energyLevel: string;
    specificGoals: string[];
  };
}

interface Errors {
  name?: string;
  ageRange?: string;
  gender?: string;
  ethnicity?: string;
  cuisinePreferences?: string;
  general?: string;
}

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    ageRange: '',
    gender: '',
    ethnicity: '',
    dietaryRestrictions: [],
    cuisinePreferences: [],
    dislikedFoods: [],
    healthGoals: {
      weightManagement: '',
      energyLevel: '',
      specificGoals: []
    }
  });

  const totalSteps = 4;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.ageRange) {
        newErrors.ageRange = 'Please select your age range';
      }
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
      if (!formData.ethnicity) {
        newErrors.ethnicity = 'Please select your ethnicity';
      }
    }

    if (step === 3) {
      if (formData.cuisinePreferences.length === 0) {
        newErrors.cuisinePreferences = 'Please select at least one cuisine preference';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (!user) {
      setErrors({ general: 'User not authenticated' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          name: formData.name,
          age_range: formData.ageRange,
          gender: formData.gender,
          ethnicity: formData.ethnicity,
          cuisine_preferences: formData.cuisinePreferences,
          disliked_foods: formData.dislikedFoods,
          health_goals: formData.healthGoals,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        throw profileError;
      }

      if (formData.dietaryRestrictions.length > 0) {
        const { error: deleteError } = await supabase
          .from('dietary_restrictions')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          throw deleteError;
        }

        const restrictionsToInsert = formData.dietaryRestrictions.map(restriction => ({
          user_id: user.id,
          restriction_type: restriction
        }));

        const { error: restrictionsError } = await supabase
          .from('dietary_restrictions')
          .insert(restrictionsToInsert);

        if (restrictionsError) {
          throw restrictionsError;
        }
      }

      try {
        await generateUserProfile(user.id, {
          name: formData.name,
          age_range: formData.ageRange,
          gender: formData.gender,
          ethnicity: formData.ethnicity,
          cuisine_preferences: formData.cuisinePreferences,
          disliked_foods: formData.dislikedFoods,
          health_goals: formData.healthGoals
        });
      } catch (profileGenError) {
        console.error('Failed to generate AI profile:', profileGenError);
      }

      navigate('/dashboard');
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to save profile. Please try again.' });
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            data={{
              name: formData.name,
              ageRange: formData.ageRange,
              gender: formData.gender,
              ethnicity: formData.ethnicity
            }}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <Step2
            data={{ dietaryRestrictions: formData.dietaryRestrictions }}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <Step3
            data={{
              cuisinePreferences: formData.cuisinePreferences,
              dislikedFoods: formData.dislikedFoods
            }}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <Step4
            data={{ healthGoals: formData.healthGoals }}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-beige-light rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-sage">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-sage h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div className="mb-8">
            {renderStep()}
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Completing...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
