import React from 'react';
import { ArrowRight, Heart, MapPin, Eye } from 'lucide-react';
import { getFeaturedListings } from '../../mockData';
import { Card, CardImage, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';

const FeaturedListings: React.FC = () => {
  const featuredListings = getFeaturedListings();
  
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
            <Card key={listing.id} className="group">
              <div className="relative">
                <CardImage
                  src={listing.images[0]}
                  alt={listing.title}
                  aspectRatio="square"
                />
                
                <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity">
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
                    <span className="truncate">{listing.location.city}</span>
                  </div>
                  <span>{formatRelativeTime(listing.createdAt)}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center">
                  <img 
                    src={listing.seller.avatar} 
                    alt={listing.seller.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-neutral-600">{listing.seller.name}</span>
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