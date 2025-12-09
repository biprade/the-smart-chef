import { Link } from 'react-router-dom';
import Button from '../Common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-beige-light">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-sage mb-4">404</h1>
        <h2 className="text-3xl font-bold text-brand-black mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
