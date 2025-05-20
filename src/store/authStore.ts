import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // This will be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: '123',
        name: 'Test User',
        email
      };
      
      const token = 'mock_jwt_token';
      
      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', token);
      
      set({
        user: mockUser,
        token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Login failed. Please check your credentials.',
        loading: false
      });
      throw error;
    }
  },
  
  signup: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // This will be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const mockUser = {
        id: '123',
        name,
        email
      };
      
      const token = 'mock_jwt_token';
      
      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', token);
      
      set({
        user: mockUser,
        token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Signup failed. Please try again.',
        loading: false
      });
      throw error;
    }
  },
  
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // In a real app, we would validate the token here
      // For now, just update the state if a token exists
      set({
        token,
        isAuthenticated: true
      });
      return true;
    }
    
    return false;
  }
}));
