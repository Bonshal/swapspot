import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { Camera, Edit, Save, User, Mail, Phone, MapPin, Calendar, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../utils/errorHandling';
import { showToast } from '../components/ui/Toast';
import supabase from '../config/supabase';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile, changePassword, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  
  // State for user profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    joinedDate: user?.joinedDate || 'May 2022' // Fallback
  });
  
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Update form when user data changes
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        joinedDate: user.joinedDate || 'May 2022'
      });
      
      if (user.avatar) {
        setAvatar(user.avatar);
      }
    }
  }, [isAuthenticated, navigate, user]);
  
  // Handle file upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Avatar file selected')
    if (file) {
      // Store the file for upload
      setAvatarFile(file);
      
      // Create preview
      // const reader = new FileReader();
      // reader.onload = () => {
      //   if (typeof reader.result === 'string') {
      //     setAvatar(reader.result);
      //   }
      // };
      // reader.readAsDataURL(file);

          const previewUrl = URL.createObjectURL(file);
        setAvatar(previewUrl);
        console.log('🖼️ Preview URL created:', previewUrl);


    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form to current user data when entering edit mode
      setProfileData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
        joinedDate: user?.joinedDate || 'May 2022'
      });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Form submission started')

    try {
      // Validation

      if (!profileData.name.trim()) {
        throw new Error('Name is required');
      }

      // const updateData = {
      //   name: profileData.name,
      //   phone: profileData.phone,
      //   location: profileData.location,
      //   bio: profileData.bio,
      //   avatar: avatarUrl || ""
      // }
      
      // Update profile using the auth store method

      console.log('Validation passed, calling updateProfile...')
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        avatarFile: avatarFile // Pass File if available, otherwise URL
      });
      console.log('updated profile successfully')
      setIsEditing(false);
      showToast.success('Profile updated successfully!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Security section - password change
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleSecurityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation
      if (!securityData.currentPassword) {
        throw new Error('Current password is required');
      }
      if (!securityData.newPassword) {
        throw new Error('New password is required');
      }
      if (securityData.newPassword !== securityData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (securityData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Change password using the auth store method
      await changePassword( securityData.newPassword);
      
      // Reset form
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showToast.success('Password updated successfully!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

//  const testStorageAccess = async () => {
//   try {
//     console.log('🧪 Testing storage access...');
    
//     // Test 1: Check current authentication state
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
//     console.log('🔐 Current user:', {
//       authenticated: !!user,
//       userId: user?.id,
//       email: user?.email,
//       error: userError
//     });
    
//     // Test 2: Check session
//     const { data: { session }, error: sessionError } = await supabase.auth.getSession();
//     console.log('📋 Session:', {
//       hasSession: !!session,
//       accessToken: session?.access_token ? 'Present' : 'Missing',
//       error: sessionError
//     });
    
//     // Test 3: List buckets
//     const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
//     console.log('📦 Buckets result:', {
//       buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
//       error: bucketsError
//     });
    
//     // Test 4: Try to access profile-images bucket specifically
//     const { data: files, error: listError } = await supabase.storage
//       .from('profile-images')
//       .list('', { limit: 1 });
//     console.log('📁 Profile-images bucket test:', {
//       success: !listError,
//       fileCount: files?.length || 0,
//       error: listError
//     });
    
//     // Test 5: Test upload with a tiny file
//     const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
//     const testFileName = `test-${Date.now()}.txt`;
    
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('profile-images')
//       .upload(testFileName, testFile);
      
//     console.log('🧪 Test upload result:', {
//       success: !uploadError,
//       uploadData,
//       error: uploadError
//     });
    
//     // Clean up test file if upload succeeded
//     if (!uploadError) {
//       await supabase.storage
//         .from('profile-images')
//         .remove([testFileName]);
//       console.log('🗑️ Test file cleaned up');
//     }
    
//   } catch (error) {
//     console.error('🧪 Storage test failed:', error);
//   }
// };
  
  return (
    <Layout>
      <div className="container p-6 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-40 bg-gradient-to-r from-primary-500 to-primary-700">
            <div className="absolute -bottom-16 left-8 bg-white p-2 rounded-full border-4 border-white shadow-sm">
              <div className="relative">
                <img 
                  src={avatar} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-accent-500 text-white p-2 rounded-full cursor-pointer shadow-sm hover:bg-accent-600 transition-colors">
                  <Camera size={18} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Button 
                variant={isEditing ? "success" : "primary"}
                size="sm"
                icon={isEditing ? <Save size={16} /> : <Edit size={16} />}
                onClick={handleEditToggle}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <User size={16} className="mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail size={16} className="mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should typically not be editable for security reasons
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone size={16} className="mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us a bit about yourself"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                
                <div className="flex items-center text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  Member since {profileData.joinedDate}
                </div>
                
                {isEditing && (
                  <div className="col-span-2 flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-3"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={loading || authLoading}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </form>
            
            {/* Security Section */}
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lock size={20} className="mr-2" />
                Security
              </h2>
              
              <form onSubmit={handlePasswordChange} className="mt-6">
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={securityData.currentPassword}
                      onChange={handleSecurityInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      isLoading={loading || authLoading}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
