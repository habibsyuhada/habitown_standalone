import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">You are logged in!</h1>
            <p className="py-6">
              You can now access your habits across devices and keep track of your progress.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-5xl font-bold">HabiTown</h1>
          <p className="py-6">
            Track your habits and build consistent routines. Create local habits 
            or sign in to sync across all your devices.
          </p>
        </div>
        
        {showLogin ? (
          <LoginForm onToggleForm={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
} 
 