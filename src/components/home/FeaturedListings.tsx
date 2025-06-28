import React,{ useEffect, useState} from 'react';
import {Listing} from '../../types/listing'
import { ArrowRight, Heart, MapPin, Eye } from 'lucide-react';
import { listingService } from '../../services/api';
import { Card, CardImage, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
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

// Alternative: Simple Spinner Component
// const LoadingSpinner: React.FC = () => (
//   <div className="flex justify-center items-center py-12">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//     <span className="ml-3 text-neutral-600">Loading featured listings...</span>
//   </div>
// );

const FeaturedListings: React.FC = () => {
  const [featuredListings , setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchFeaturedListings = async() =>{
      try{
        const listings = await listingService.getFeaturedListings();
        setFeaturedListings(listings)
      }catch(error){
        console.error('Error fetchig featured listings:', error)
      } finally{
        setLoading(false);
      }
    }

    fetchFeaturedListings()

  }, [])


  const handleCardClick= (listingId: string)=>{
    navigate(`/listings/${listingId}`)
  }

  const handleHeartClick = (e: React.MouseEvent, listingId: string)=>{
    e.stopPropagation();

    console.log('Added to favorites',listingId)
  }
  // if(loading){
  //   return <div>Loading featured listings...</div>
  // }

  if(loading){
    return (
      <section className="py-12 bg-white">
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Featured Listings</h2>
            <a href="/listings" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </a>
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Featured Listings</h2>
          <a href="/listings" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Card key={listing.id} className="group" onClick={()=>handleCardClick(listing.id)}>
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
                
                {listing.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="accent">Featured</Badge>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <Badge variant="primary" size="sm" className="bg-white/90 backdrop-blur-sm">
                    {listing.condition}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur-sm flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {listing.views}
                    </Badge>
                    
                    <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur-sm flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {listing.favorites}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardBody>
                <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
                  {listing.title}
                </h3>
                
                <p className="text-lg font-semibold text-accent-600 mb-2">
                  {formatPrice(listing.price)}
                </p>
                
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-1">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <span>{formatRelativeTime(listing.created_at)}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center">
                  <img 
                    src={listing.selleravatar} 
                    alt={listing.sellername}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-neutral-600">{listing.sellername}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;