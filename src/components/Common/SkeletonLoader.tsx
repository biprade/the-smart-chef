interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'avatar' | 'button';
  className?: string;
}

const SkeletonLoader = ({ type = 'card', className = '' }: SkeletonLoaderProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const typeClasses = {
    card: 'h-64 w-full',
    text: 'h-4 w-full',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-32',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}></div>
  );
};

export const RecipeCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
    <div className="flex gap-2">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

export const DashboardCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

export default SkeletonLoader;
