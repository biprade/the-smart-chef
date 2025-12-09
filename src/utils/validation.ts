export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export interface PasswordStrength {
  score: number;
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  let color = 'bg-red-600';

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) {
    label = 'Weak';
    color = 'bg-red-600';
  } else if (score <= 2) {
    label = 'Fair';
    color = 'bg-yellow-600';
  } else if (score <= 4) {
    label = 'Good';
    color = 'bg-sage-dark';
  } else {
    label = 'Strong';
    color = 'bg-green-600';
  }

  return { score: Math.min(score, 5), label, color };
};
