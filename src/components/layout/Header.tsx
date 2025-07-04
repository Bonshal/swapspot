import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Bell, MessageSquare, User, Plus, Heart, LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useSearchListings } from '../../utils/search';
import { useMessageStore } from '../../store/messageStore';
import supabase from '../../config/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile]= useState<{
    avatar?: string,
    profile_image?:string,
    name?:string
    
  } | null>(null)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { unreadCount, getUnreadCount } = useMessageStore();
  const navigate = useNavigate();
  const { handleSearch } = useSearchListings();
  
  // useParams - kept for potential future use, referenced to suppress warnings
  void useParams;
  
  useEffect(() => {
    const fetchUserProfile = async()=>{
      if(isAuthenticated && user)
      {
        try{
          const { data,error}= await supabase
          .from('profiles')
          .select('avatar,profile_image,name')
          .eq('id',user.id)
          .single();

          if(data && !error)
          {
            setUserProfile(data);
          }
        }catch(error)
        {
          console.error('Error fetching user Profile', error)
        }
      }else{
        setUserProfile(null);
      }
    }

    fetchUserProfile();
  }, [isAuthenticated,user])


useEffect(()=>{
    if (isAuthenticated) {
      // Initial fetch of unread count
      getUnreadCount();
      
      // Set up polling for new messages every 30 seconds
      const interval = setInterval(() => {
        getUnreadCount();
      }, 30000);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, getUnreadCount]);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleNavigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };
  

  //Get user avatar with fallback
  const getUserAvatar=() =>{
    if(userProfile?.avatar) return userProfile.avatar;
    if(userProfile?.profile_image) return userProfile.profile_image

    return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";
  }

  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center"
              onClick={handleNavigate('/')}
            >
              <span className="text-2xl font-bold text-primary-500">SwapSpot</span>
            </a>
          </div>
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-8">
            <form className="relative w-full max-w-2xl" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search products, brands and categories"
                className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <Search className="h-5 w-5 text-neutral-400" />
              </button>
            </form>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                  onClick={handleNavigate('/messages')}
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                  onClick={handleNavigate('/notifications')}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                </Button>
                
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleNavigate('/favorites')}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="accent"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={handleNavigate('/listings/create')}
                >
                  Sell Now
                </Button>
                
                <div className="relative ml-2">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={getUserAvatar()}
                      alt="User"
                      className="h-8 w-8 rounded-full object-cover"
                      onError={((e)=>{
                        //fallback if image fails to load
                        e.currentTarget.src = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
                      })}
                    />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-dropdown py-1 animate-fade-in z-50">
                      <a 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={handleNavigate('/dashboard')}
                      >
                        Dashboard
                      </a>
                      <a 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={handleNavigate('/profile')}
                      >
                        Profile
                      </a>
                      <a 
                        href="/my-listings" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={handleNavigate('/my-listings')}
                      >
                        My Listings
                      </a>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-neutral-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleNavigate('/login')}
                >
                  Log In
                </Button>
                <Button onClick={handleNavigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search - Only visible on mobile */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute left-3 top-2.5">
            <Search className="h-5 w-5 text-neutral-400" />
          </button>
        </form>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4 animate-slide-down">
          <div className="pt-2 pb-4 space-y-1 border-t border-neutral-200">
            {isAuthenticated ? (
              <>
                <a 
                  href="/dashboard" 
                  className="block px-3 py-2 text-base font-medium text-neutral-900 hover:bg-neutral-50 rounded-lg"
                  onClick={handleNavigate('/dashboard')}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-neutral-500" />
                    Dashboard
                  </div>
                </a>
                <a 
                  href="/messages" 
                  className="block px-3 py-2 text-base font-medium text-neutral-900 hover:bg-neutral-50 rounded-lg"
                  onClick={handleNavigate('/messages')}
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-3 text-neutral-500" />
                    Messages
                    <span className="ml-auto bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </div>
                </a>
                <a 
                  href="/notifications" 
                  className="block px-3 py-2 text-base font-medium text-neutral-900 hover:bg-neutral-50 rounded-lg"
                  onClick={handleNavigate('/notifications')}
                >
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-neutral-500" />
                    Notifications
                    <span className="ml-auto bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                  </div>
                </a>
                <a 
                  href="/favorites" 
                  className="block px-3 py-2 text-base font-medium text-neutral-900 hover:bg-neutral-50 rounded-lg"
                  onClick={handleNavigate('/favorites')}
                >
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-3 text-neutral-500" />
                    Favorites
                  </div>
                </a>
                <a 
                  href="/listings/create" 
                  className="block px-3 py-2 mt-4 text-base font-medium bg-accent-500 text-white rounded-lg text-center"
                  onClick={handleNavigate('/listings/create')}
                >
                  Sell Now
                </a>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 mt-2 text-base font-medium text-error-600 hover:bg-neutral-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a 
                  href="/login" 
                  className="block px-3 py-2 text-base font-medium text-neutral-900 hover:bg-neutral-50 rounded-lg"
                  onClick={handleNavigate('/login')}
                >
                  Log In
                </a>
                <a 
                  href="/signup" 
                  className="block px-3 py-2 mt-2 text-base font-medium bg-primary-500 text-white rounded-lg text-center"
                  onClick={handleNavigate('/signup')}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;