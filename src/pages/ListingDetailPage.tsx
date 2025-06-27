import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { MessageSquare, Heart, Flag, Shield, Calendar, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
// import { getSimilarListings } from '../mockData/listings';
import { listingService } from '../services/api';
import ContactSellerModal from '../components/ui/ContactSellerModal';
import { showToast } from '../components/ui/Toast';
import { Listing } from '../types/listing';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentListing, loading, error, fetchListingById } = useListingStore();
  const { user } = useAuthStore();
  const [similarListings, setSimilarListings] = useState<Listing[]>([])
  const [similarLoading, setSimilarLoading] = useState(false);
  
  const [contactSellerOpen, setContactSellerOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchListingById(id);
    }
  }, [id, fetchListingById]);
  
  useEffect(() => {
    const fetchSimilarListings = async() =>{
    if (currentListing && currentListing.id) {
      setSimilarLoading(true)
      try{
        const similar = await listingService.getSimilarListings(
          currentListing.id,
          currentListing.category,
          4
        );
        setSimilarListings(similar);
      }catch(error){
        console.error('Error fetching similar listings:', error);
        setSimilarListings([])
      }finally{
        setSimilarLoading(false)
      }
    }
  };
    fetchSimilarListings();

 }, [currentListing]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error || !currentListing) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Listing Not Found</h2>
            <p>{error || "We couldn't find the listing you're looking for."}</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/listings')}
              className="mt-4"
            >
              Browse Listings
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleContactSeller = () => {
    if (!user) {
      showToast.error('Please log in to contact the seller.');
      return;
    }
    setContactSellerOpen(true);
  };
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Main image */}
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src={currentListing.images[0]} 
                  alt={currentListing.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Thumbnail images */}
              <div className="p-2 grid grid-cols-6 gap-2">
                {currentListing.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square rounded overflow-hidden ${index === 0 ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <img 
                      src={image} 
                      alt={`${currentListing.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-2">{currentListing.title}</h1>
              <div className="flex items-center text-gray-500 mb-4">
                <span className="mr-4">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {formatRelativeTime(currentListing.created_at)}
                </span>
                <span>
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  {currentListing.location}
                </span>
              </div>
              
              <div className="text-3xl font-bold text-accent-500 mb-6">
                {formatCurrency(currentListing.price)}
              </div>
              
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 mb-6">
                {currentListing.description}
              </p>
              
              <h2 className="text-xl font-semibold mb-3">Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="text-gray-700">
                  <span className="text-gray-500 block text-sm">Condition</span>
                  {currentListing.condition === 'new' ? 'New' :
                   currentListing.condition === 'like-new' ? 'Like New' :
                   currentListing.condition === 'good' ? 'Good' :
                   currentListing.condition === 'fair' ? 'Fair' : 'Poor'}
                </div>
                <div className="text-gray-700">
                  <span className="text-gray-500 block text-sm">Category</span>
                  {currentListing.category.charAt(0).toUpperCase() + currentListing.category.slice(1)}
                  {currentListing.subcategory && (
                    <span className="text-xs text-gray-500 block mt-1">
                      {currentListing.subcategory}
                    </span>
                  )}
                </div>
                <div className="text-gray-700">
                  <span className="text-gray-500 block text-sm">Posted</span>
                  {new Date(currentListing.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" icon={<Flag className="w-4 h-4 mr-2" />}>
                  Report Listing
                </Button>
                <Button variant="outline" icon={<Heart className="w-4 h-4 mr-2" />}>
                  Save to Favorites
                </Button>
                <Button variant="outline" icon={<Shield className="w-4 h-4 mr-2" />}>
                  Safety Tips
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right column - Seller & Actions */}
          <div className="lg:col-span-1">
            {/* Seller card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <img 
                    src={currentListing.selleravatar} 
                    alt={`${currentListing.sellername} profile`} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{currentListing.sellername}</h2>
                  <p className="text-gray-500 text-sm">Member since {currentListing.sellerjoinedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm mb-4">
  {currentListing.sellerverified && (
    <div className="flex items-center mr-3">
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center">
        <Shield className="w-3 h-3 mr-1" />
        Verified
      </span>
    </div>
  )}
  <div className="flex items-center">
    {currentListing.sellerrating && (
      <>
        <span className="text-amber-400">
          {'★'.repeat(Math.floor(currentListing.sellerrating))}
          {currentListing.sellerrating % 1 > 0 ? '⯫' : ''}
          {'☆'.repeat(5 - Math.ceil(currentListing.sellerrating))}
        </span>
        <span className="ml-1">{currentListing.sellerrating.toFixed(1)} (42 reviews)</span>
      </>
    )}
    {!currentListing.sellerrating && (
      <span className="text-gray-400 text-sm">No ratings yet</span>
    )}
  </div>
</div>
              
              <Button 
                fullWidth 
                icon={<MessageSquare className="w-4 h-4 mr-2" />}
                onClick={handleContactSeller}
              >
                Message Seller
              </Button>
            </div>
            
            {/* Safety tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-800 flex items-center mb-2">
                <Shield className="w-4 h-4 mr-2" />
                Safety Tips
              </h3>
              <ul className="text-sm text-amber-700 space-y-2">
                <li>• Meet in a public, well-lit place</li>
                <li>• Don't pay or transfer money in advance</li>
                <li>• Inspect the item before purchasing</li>
                <li>• Use our secure payment system if possible</li>
              </ul>
            </div>
            
            {/* Similar listings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Similar Listings</h3>
              <div className="space-y-4">
                {similarLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : (
                  <>
                    {similarListings.map((listing) => (
                      <div key={listing.id} className="flex">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden mr-3">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <Link to={`/listings/${listing.id}`} className="font-medium text-sm line-clamp-2 hover:text-primary-500">
                            {listing.title}
                          </Link>
                          <p className="text-accent-500 font-bold text-sm mt-1">{formatCurrency(listing.price)}</p>
                          <p className="text-gray-500 text-xs mt-1">{listing.location.split(',')[0]}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      fullWidth
                      onClick={() => navigate('/listings', { state: { category: currentListing.category } })}
                    >
                      View More
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Seller Modal */}
      <ContactSellerModal 
        isOpen={contactSellerOpen} 
        onClose={() => setContactSellerOpen(false)} 
        sellerName={currentListing.sellername}
        sellerId={currentListing.user_id}
        listingId={currentListing.id}
        listingTitle={currentListing.title}
      />
    </Layout>
  );
};

export default ListingDetailPage;
