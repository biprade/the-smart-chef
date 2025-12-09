import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/Auth';
import LoadingSpinner from './components/Common/LoadingSpinner';

const HomePage = lazy(() => import('./components/Pages/HomePage'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const OnboardingFlow = lazy(() => import('./components/Onboarding/OnboardingFlow'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const RecipeForm = lazy(() => import('./components/RecipeRecommendation/RecipeForm'));
const SavedRecipes = lazy(() => import('./components/Pages/SavedRecipes'));
const Profile = lazy(() => import('./components/Pages/Profile'));
const HealthIntegration = lazy(() => import('./components/Pages/HealthIntegration'));
const FoodDeliveryIntegration = lazy(() => import('./components/Pages/FoodDeliveryIntegration'));
const NotFoundPage = lazy(() => import('./components/Pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingFallback />}>
          <div className="app-layout">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingFlow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <RecipeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/integrations/health"
              element={
                <ProtectedRoute>
                  <HealthIntegration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/integrations/delivery"
              element={
                <ProtectedRoute>
                  <FoodDeliveryIntegration />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
