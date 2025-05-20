import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useListingStore } from '../store/listingStore';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const ListingsPage: React.FC = () => {
  const { listings, filters, loading, fetchListings, updateFilters } = useListingStore();
  const [category, setCategory] = useState(filters.category || '');
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');
  const [location, setLocation] = useState(filters.location || '');
  const [conditions, setConditions] = useState<string[]>(filters.condition || []);
  const [sortBy, setSortBy] = useState(filters.sortBy || 'recent');
  
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  
  const handleApplyFilters = () => {
    updateFilters({
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: location || undefined,
      condition: conditions.length > 0 ? conditions : undefined,
      sortBy: sortBy as any
    });
    
    fetchListings();
  };
  
  const handleConditionChange = (condition: string) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter(c => c !== condition));
    } else {
      setConditions([...conditions, condition]);
    }
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value as any;
    setSortBy(newSortBy);
    updateFilters({ sortBy: newSortBy });
    fetchListings({ sortBy: newSortBy });
  };
  
  return (
    <Layout>
      <div className="container p-6 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Browse Listings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Category</h3>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="services">Services</option>
                  <option value="jobs">Jobs</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Price Range */}
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Price Range</h3>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2 p-2 border border-gray-300 rounded"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2 p-2 border border-gray-300 rounded"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Location</h3>
                <input 
                  type="text" 
                  placeholder="Enter city or postal code" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              {/* Condition */}
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Condition</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={conditions.includes('new')}
                      onChange={() => handleConditionChange('new')}
                    />
                    New
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={conditions.includes('like-new')}
                      onChange={() => handleConditionChange('like-new')}
                    />
                    Like New
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={conditions.includes('good')}
                      onChange={() => handleConditionChange('good')}
                    />
                    Good
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={conditions.includes('fair')}
                      onChange={() => handleConditionChange('fair')}
                    />
                    Fair
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={conditions.includes('poor')}
                      onChange={() => handleConditionChange('poor')}
                    />
                    Poor
                  </label>
                </div>
              </div>
              
              <button 
                className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Listings Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-600">
                  Showing {listings.length} result{listings.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex space-x-2 items-center">
                <label className="text-sm mr-2">Sort by:</label>
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link 
                    to={`/listings/${listing.id}`} 
                    key={listing.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        <span className="font-bold text-accent-500">{formatCurrency(listing.price)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{listing.category} • {listing.location.split(',')[0]}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 overflow-hidden">
                            <img 
                              src={listing.sellerAvatar} 
                              alt={listing.sellerName}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span className="text-xs">{listing.sellerName}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(listing.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Pagination - simplified for now */}
            {listings.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm">
                  <a href="#" className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    Previous
                  </a>
                  <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-primary-50 text-primary-600 font-medium">
                    1
                  </a>
                  <a href="#" className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    Next
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingsPage;
