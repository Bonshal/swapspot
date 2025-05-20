import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const checkAuth = useAuthStore(state => state.checkAuth);
  
  // Check if we have a token in localStorage
  const hasToken = checkAuth();
  
  if (!isAuthenticated && !hasToken) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
