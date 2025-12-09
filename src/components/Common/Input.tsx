import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`w-full px-4 py-3 rounded-lg border border-beige-dark bg-white text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;
