import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-sage text-white hover:bg-sage-dark focus:ring-sage disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-beige text-brand-black hover:bg-beige-dark focus:ring-beige disabled:bg-gray-200 disabled:cursor-not-allowed',
    outline: 'bg-transparent border-2 border-sage text-sage hover:bg-sage hover:text-white focus:ring-sage disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
