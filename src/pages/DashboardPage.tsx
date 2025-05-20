import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { useListingStore } from '../store/listingStore';
import { Plus, Edit, Trash, Eye, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';

interface DashboardTab {
  id: string;
  label: string;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { listings, fetchListings } = useListingStore();
  const [activeTab, setActiveTab] = useState<string>('listings');
  const navigate = useNavigate();
  
  // Tabs for the dashboard
  const tabs: DashboardTab[] = [
    { id: 'listings', label: 'My Listings' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'messages', label: 'Messages' },
    { id: 'settings', label: 'Account Settings' }
  ];
  
  useEffect(() => {
    // For a real app, we would filter listings by user ID
    fetchListings();
  }, [fetchListings]);
  
  // For demo purposes, let's filter some listings as if they belong to the current user
  const userListings = listings.filter((_, index) => index % 3 === 0);
  const favoritedListings = listings.filter((_, index) => index % 4 === 0);
  
  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    navigate('/login');
    return null;
  }
  
  return (
    <Layout>
      <div className="container p-6 mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="accent" 
              icon={<Plus size={16} />}
              onClick={() => navigate('/listings/create')}
            >
              Create New Listing
            </Button>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'listings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Listings</h2>
            
            {userListings.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <h3 className="font-medium text-lg text-gray-900">You don't have any listings yet</h3>
                <p className="text-gray-500 mt-2">Create your first listing to start selling items</p>
                <Button 
                  variant="primary" 
                  className="mt-4"
                  onClick={() => navigate('/listings/create')}
                >
                  Create Listing
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Listing</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Views</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userListings.map(listing => (
                      <tr key={listing.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 mr-3">
                              <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="truncate max-w-xs">
                              <div className="font-medium truncate">{listing.title}</div>
                              <div className="text-gray-500 text-sm">{listing.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatCurrency(listing.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatRelativeTime(listing.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {Math.floor(Math.random() * 100)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-primary-500">
                              <Eye size={18} />
                            </button>
                            <button className="text-gray-500 hover:text-amber-500">
                              <Edit size={18} />
                            </button>
                            <button className="text-gray-500 hover:text-red-500">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Favorite Listings</h2>
            
            {favoritedListings.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <h3 className="font-medium text-lg text-gray-900">No favorites yet</h3>
                <p className="text-gray-500 mt-2">Save listings you're interested in to view them later</p>
                <Button 
                  variant="primary" 
                  className="mt-4"
                  onClick={() => navigate('/listings')}
                >
                  Browse Listings
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedListings.map(listing => (
                  <Link
                    key={listing.id}
                    to={`/listings/${listing.id}`} 
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <button 
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-100"
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, this would remove from favorites
                        }}
                      >
                        <Heart size={16} className="text-red-500 fill-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        <span className="font-bold text-accent-500">{formatCurrency(listing.price)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{listing.category} • {listing.location.split(',')[0]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <h3 className="font-medium text-lg text-gray-900">Message Center</h3>
              <p className="text-gray-500 mt-2">Chat with buyers and sellers about listings</p>
              <p className="text-sm text-gray-400 mt-4">Coming soon in the next phase of development</p>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <Button variant="primary">Edit Profile</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Security</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value="************"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <Button variant="primary">Change Password</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
