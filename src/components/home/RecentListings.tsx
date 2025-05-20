import React from 'react';
import { getRecentListings } from '../../mockData';
import { Card, CardImage, CardBody } from '../ui/Card';
import { MapPin, Heart } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';

const RecentListings: React.FC = () => {
  const recentListings = getRecentListings().slice(0, 8); // Get only the first 8 items
  
  return (
    <section className="py-12 bg-white">
      <div className="container-custom mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
          Recently Added
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentListings.map((listing) => (
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
                    <span className="truncate">{listing.location.city}</span>
                  </div>
                  <span>{formatRelativeTime(listing.createdAt)}</span>
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