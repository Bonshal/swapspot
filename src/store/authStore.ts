import { create } from 'zustand';
import { supabase } from '../config/supabase';
import type { Session } from '@supabase/supabase-js'; // Import Session type for proper typing

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
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImage?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  avatarFile?: File | null;
  joinedDate?: string;
}

// Define proper type for profile completion data to replace any type
interface ProfileCompletionData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
  [key: string]: unknown; // Allow additional properties
}

interface AuthState { 
  user: User | null;
  isAuthenticated: boolean;
  session: Session | null; // Replaced any with proper Supabase Session type
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  updateProfile: (profileData: UpdateProfileData) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  completeProfile: (profileData: ProfileCompletionData) => Promise<User>; // Using proper type instead of any
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  session: null,
  loading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.warn('Profile not found, creating basic user object');
        }

        const user: User = {
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || '',
          email: data.user.email || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          pincode: profile?.pincode || '',
          profileImage: profile?.profile_image || '',
          location: profile?.location || '',
          bio: profile?.bio || '',
          avatar: profile?.avatar || '',
          joinedDate: profile?.created_at || data.user.created_at,
        };

        set({
          user,
          session: data.session,
          isAuthenticated: true,
          loading: false
        });
      }
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            created_at: new Date().toISOString(),
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            location: '',
            bio: '',
            avatar: '',
            profile_image: ''
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        const user: User = {
          id: data.user.id,
          name,
          email,
          joinedDate: data.user.created_at,
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          location: '',
          bio: '',
          avatar: '',
          profileImage: ''
        };
        
        set({
          user,
          session: data.session,
          isAuthenticated: true,
          loading: false
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed. Please try again.',
        loading: false
      });
      throw error;
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      isAuthenticated: false
    });
  },
  
  checkAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Get user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const user: User = {
              id: session.user.id,
              name: profile?.name || session.user.user_metadata?.name || '',
              email: session.user.email || '',
              phone: profile?.phone || '',
              address: profile?.address || '',
              city: profile?.city || '',
              state: profile?.state || '',
              pincode: profile?.pincode || '',
              profileImage: profile?.profile_image || '',
              location: profile?.location || '',
              bio: profile?.bio || '',
              avatar: profile?.avatar || '',
              joinedDate: profile?.created_at || session.user.created_at,
            };

            set({
              user,
              session,
              isAuthenticated: true,
              loading: false
            });
          });
        return true;
      }
      return false;
    });
    return false;
  },
  
  updateProfile: async (profileData: UpdateProfileData) => {
    set({ loading: true, error: null });
    
    try {
      const { user: currentUser } = get();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let avatarUrl: string | undefined = currentUser.avatar || "";
      
      // If avatar is a File, upload it to Supabase Storage
      if (profileData.avatarFile ) {
        const file = profileData.avatarFile
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `avatar_${currentUser.id}_${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, file, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
          location: profileData.location,
          bio: profileData.bio,
          avatar: avatarUrl, // Store URL only
          profile_image: avatarUrl, // Keep both for compatibility
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedUser = { 
        ...currentUser, 
        ...profileData,
        avatar: avatarUrl,
        profileImage: avatarUrl
      };
      
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
  
  changePassword: async (newPassword: string) => {
    set({ loading: true, error: null });
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Password change failed. Please check your current password.',
        loading: false
      });
      throw error;
    }
  },

  completeProfile: async (profileData: ProfileCompletionData) => { // Using proper type instead of any
    set({ loading: true, error: null });
    
    try {
      const { user: currentUser } = get();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let profileImageUrl = '';
      
      // Handle profile image upload if provided
      if (profileData.profileImage instanceof File) {
        const fileExt = profileData.profileImage.name.split('.').pop() || 'jpg';
        const fileName = `profile_${currentUser.id}_${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, profileData.profileImage, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        profileImageUrl = publicUrl;
      }

      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
        ...(profileImageUrl && { 
          profile_image: profileImageUrl,
          avatar: profileImageUrl 
        }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedUser: User = {
        ...currentUser,
        name: profileData.name ?? currentUser.name,
        phone: profileData.phone ?? currentUser.phone,
        address: profileData.address ?? currentUser.address,
        city: profileData.city ?? currentUser.city,
        profileImage: profileImageUrl || currentUser.profileImage,
        avatar: profileImageUrl || currentUser.avatar
      };
      
      set({
        user: updatedUser,
        loading: false
      });

      return updatedUser;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Profile completion failed. Please try again.',
        loading: false
      });
      throw error;
    }
  }
}));

// Listen for auth changes
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      session: null,
      isAuthenticated: false
    });
  }
});
