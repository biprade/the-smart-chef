import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      className={`bg-beige-light rounded-2xl shadow-sm border border-beige-dark p-8 hover:border-sage hover:shadow-lg transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
