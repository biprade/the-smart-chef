import type { ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

const Header = ({ children, className = '' }: HeaderProps) => {
  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </header>
  );
};

export default Header;
