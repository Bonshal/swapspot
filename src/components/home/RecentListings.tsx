import React,{useState,useEffect} from 'react';
import { Listing } from '../../types/listing';
import { listingService } from '../../services/api';
import { Card, CardImage, CardBody } from '../ui/Card';
import { MapPin, Heart } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <Card key={index} className="animate-pulse">
        <div className="relative">
          <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
        </div>
        <CardBody>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center">
            <div className="h-6 w-6 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </CardBody>
      </Card>
    ))}
  </div>
);

const RecentListings: React.FC = () => {

  const [recentListings, setRecentListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchRecentListings = async() =>{
      try{
        const listings = await listingService.getRecentListings();
        setRecentListings(listings)
      }catch(error){
        console.error('Error fetching recent listings:', error)
      }
      finally{
        setLoading(false)
      }
    }
  
  fetchRecentListings()
  },[])
  
  const handleCardClick = (listingId: string)=>{
  navigate(`/listings/${listingId}`)
}

  const handleHeartClick= (e: React.MouseEvent, listingId: string)=>{
    e.stopPropagation();
    console.log('added to favorites', listingId)
  }

  if(loading){
    return (
      <section className="py-12 bg-white">
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Recent Listings</h2>
            
          </div>
          
          {/* Choose one of these loading components: */}
          <LoadingSkeleton /> {/* Skeleton cards that look like real content */}
          {/* <LoadingSpinner /> */} {/* Simple spinner - uncomment to use this instead */}
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-12 bg-white">
      <div className="container-custom mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
          Recently Added
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentListings.map((listing) => (
            <Card key={listing.id} className="group" onClick={()=>{handleCardClick(listing.id)}}>
              <div className="relative">
                <CardImage
                  src={listing.images[0]}
                  alt={listing.title}
                  aspectRatio="square"
                />
                
                <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                onClick={(e)=>handleHeartClick(e,listing.id)}>
                  <Heart className="h-5 w-5 text-neutral-500 hover:text-accent-500" />
                </button>
              </div>
              
              <CardBody>
                <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
                  {listing.title}
                </h3>
                
                <p className="text-lg font-semibold text-accent-600 mb-2">
                  {formatPrice(listing.price)}
                </p>
                
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <span>{formatRelativeTime(listing.created_at)}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="/listings" 
            className="btn btn-outline inline-block"
          >
            View All Listings
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentListings;