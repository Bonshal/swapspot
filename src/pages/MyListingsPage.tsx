import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { Listing } from '../types/listing';
import { formatCurrency } from '../utils/formatters';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import { showToast } from '../components/ui/Toast';
import { listingService } from '../services/api';

const MyListingsPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchUserListings = async () => {
      setLoading(true);
      try {
        const listings = await listingService.getUserListings();
        setMyListings(listings);
      } catch (error) {
        console.error('Error fetching user listings:', error);
        showToast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserListings();
  }, [isAuthenticated, navigate]);

  const handleDeleteListing = async (listingId: string) => {
    setIsDeleting(true);
    
    try {
      await listingService.deleteListing(listingId);
      setMyListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
      showToast.success('Listing deleted successfully');
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Failed to delete listing');
      console.error('Error deleting listing:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="container p-6 mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button 
            variant="accent"
            icon={<Plus size={16} />}
            onClick={() => navigate('/listings/create')}
          >
            Create New Listing
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : myListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-neutral-200">
            <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No listings yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't created any listings yet. Click the button above to create your first listing.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => navigate('/listings/create')}
              >
                Create Your First Listing
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {myListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-neutral-200">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="ml-4">
                          <Link to={`/listings/${listing.id}`} className="text-sm font-medium text-neutral-900 hover:text-primary-500">
                            {listing.title}
                          </Link>
                          <div className="text-sm text-neutral-500">{listing.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{formatCurrency(listing.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={16} />}
                          onClick={() => navigate(`/listings/edit/${listing.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={16} className="text-error-500" />}
                          onClick={() => handleDeleteListing(listing.id)}
                          isLoading={isDeleting}
                          className="text-error-600 hover:text-error-700 hover:bg-error-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListingsPage;
