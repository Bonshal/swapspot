import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  
  const signup = useAuthStore(state => state.signup);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // Use local error state for password mismatch
      useAuthStore.setState({ error: 'Passwords do not match' });
      return;
    }
    
    if (!termsAccepted) {
      useAuthStore.setState({ error: 'You must accept the terms of service' });
      return;
    }

    try {
      // Use the signup function from auth store
      await signup(name, email, password);
      
      // Redirect to homepage
      navigate('/');
    } catch (err) {
      // Error handling is managed by the auth store
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-2 text-gray-600">
          Join our marketplace and start buying or selling today!
        </p>
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
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
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="block ml-2 text-sm text-gray-700">
            I agree to the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </label>
        </div>
        
        <Button 
          type="submit" 
          fullWidth
          isLoading={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
