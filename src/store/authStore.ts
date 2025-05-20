import { create } from 'zustand';
import { authService } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImage?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  joinedDate?: string;
  isAadhaarVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  // Existing functions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // New Aadhaar verification functions
  verifyAadhaar: (aadhaarNumber: string) => Promise<void>;
  verifyOtp: (aadhaarNumber: string, otp: string) => Promise<void>;
  completeProfile: (profileData: any) => Promise<void>;
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
      const response = await authService.login(email, password);
      
      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', response.token);
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed. Please check your credentials.',
        loading: false
      });
      throw error;
    }
  },
  
  signup: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await authService.signup(name, email, password);
      
      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', response.token);
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed. Please try again.',
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
      // Set initial authenticated state based on token presence
      set({
        token,
        isAuthenticated: true,
        loading: true
      });
      
      // Then fetch the actual user profile in the background
      authService.getProfile()
        .then(user => {
          set({
            user,
            loading: false
          });
        })
        .catch(() => {
          // If profile fetch fails, token might be invalid
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
          });
        });
      
      return true;
    }
    
    return false;
  },
  
  updateProfile: async (profileData: Partial<User>) => {
    set({ loading: true, error: null });
    
    try {
      const updatedUser = await authService.updateProfile(profileData);
      
      set({
        user: updatedUser,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Profile update failed. Please try again.',
        loading: false
      });
      throw error;
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ loading: true, error: null });
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Password change failed. Please check your current password.',
        loading: false
      });
      throw error;
    }
  },
  
  verifyAadhaar: async (aadhaarNumber: string) => {
    set({ loading: true, error: null });
    
    try {
      await authService.verifyAadhaar(aadhaarNumber);
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Aadhaar verification failed. Please try again.',
        loading: false
      });
      throw error;
    }
  },
  
  verifyOtp: async (aadhaarNumber: string, otp: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await authService.verifyOtp(aadhaarNumber, otp);
      
      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', response.token);
      
      set({
        user: { ...response.user, isAadhaarVerified: true },
        token: response.token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'OTP verification failed. Please try again.',
        loading: false
      });
      throw error;
    }
  },
  
  completeProfile: async (profileData: any) => {
    set({ loading: true, error: null });
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
      
      const updatedUser = await authService.completeProfile(formData);
      
      set({
        user: updatedUser,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Profile completion failed. Please try again.',
        loading: false
      });
      throw error;
    }
  }
}));
