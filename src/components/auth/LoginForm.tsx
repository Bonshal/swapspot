import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use the login function from auth store
      await login(email, password);
      
      // Redirect to homepage on success
      navigate('/');
    } catch (err) {
      // Error handling is managed by the auth store
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Log in to your account</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Please enter your details.
        </p>
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>
        </div>
        
        <Button 
          type="submit" 
          fullWidth
          isLoading={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a 
              href="/signup" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
