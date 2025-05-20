import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useListingStore } from '../store/listingStore';
import { formatCurrency } from '../utils/formatters';
import { Listing, ListingCategory, categorySubcategories } from '../types/listing';
import Button from '../components/ui/Button';
import { ArrowLeft, Filter, SortAsc, SortDesc } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const { listings, filters, loading, fetchListings, updateFilters } = useListingStore();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');
  const [location, setLocation] = useState(filters.location || '');
  const [conditions, setConditions] = useState<string[]>(filters.condition || []);
  const [subcategory, setSubcategory] = useState<string>(filters.subcategory || '');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'recent');
  
  // Get available subcategories for this category
  const availableSubcategories = categoryName && categoryName in categorySubcategories
    ? categorySubcategories[categoryName as ListingCategory]
    : [];
  
  // Format category name for display
  const formattedCategoryName = categoryName ? 
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ') : 
    'Category';

  useEffect(() => {
    if (categoryName) {
      updateFilters({
        ...filters,
        category: categoryName
      });
      
      fetchListings();
    }
  }, [categoryName, fetchListings, updateFilters, filters]);
  
  useEffect(() => {
    // Filter listings based on the category
    setFilteredListings(listings);
  }, [listings]);
  
  const handleApplyFilters = () => {
    updateFilters({
      category: categoryName,
      subcategory: subcategory || undefined,
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
    updateFilters({ 
      sortBy: newSortBy, 
      category: categoryName,
      subcategory: subcategory || undefined
    });
    fetchListings();
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header with back button and category name */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/listings')}
            className="mr-3 text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {formattedCategoryName} Listings
          </h1>
        </div>
        
        {/* Filters and Sort Controls - Mobile */}
        <div className="flex md:hidden justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFilters}
            icon={<Filter className="h-4 w-4 mr-1" />}
          >
            Filters
          </Button>
          
          <select 
            className="p-2 text-sm border border-neutral-300 rounded-lg"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="recent">Most Recent</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
        
        {/* Subcategory Selection (visible on both mobile and desktop) */}
        {availableSubcategories.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-md font-medium mb-3">Subcategories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSubcategory('');
                  updateFilters({
                    category: categoryName,
                    subcategory: undefined
                  });
                  fetchListings();
                }}
                className={`px-3 py-2 text-sm rounded-full border 
                  ${!subcategory ? 
                    'bg-primary-100 border-primary-300 text-primary-800' : 
                    'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
              >
                All
              </button>
              
              {availableSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => {
                    setSubcategory(subcat);
                    updateFilters({
                      category: categoryName,
                      subcategory: subcat
                    });
                    fetchListings();
                  }}
                  className={`px-3 py-2 text-sm rounded-full border 
                    ${subcategory === subcat ? 
                      'bg-primary-100 border-primary-300 text-primary-800' : 
                      'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Mobile Filters Panel (Collapsible) */}
        {showFilters && (
          <div className="md:hidden bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-3">Filters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-1/2 p-2 text-sm border border-neutral-300 rounded-lg"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-1/2 p-2 text-sm border border-neutral-300 rounded-lg"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input 
                type="text" 
                placeholder="City or Postal Code" 
                className="w-full p-2 text-sm border border-neutral-300 rounded-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Condition</label>
              <div className="space-y-1">
                {['new', 'like-new', 'good', 'fair', 'poor'].map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={conditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                    />
                    <span className="text-sm">
                      {condition === 'new' ? 'New' :
                       condition === 'like-new' ? 'Like New' :
                       condition === 'good' ? 'Good' :
                       condition === 'fair' ? 'Fair' : 'Poor'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth
              onClick={() => {
                handleApplyFilters();
                setShowFilters(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2 p-2 text-sm border border-neutral-300 rounded-lg"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2 p-2 text-sm border border-neutral-300 rounded-lg"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Location</label>
                <input 
                  type="text" 
                  placeholder="City or Postal Code" 
                  className="w-full p-2 text-sm border border-neutral-300 rounded-lg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Condition</label>
                <div className="space-y-2">
                  {['new', 'like-new', 'good', 'fair', 'poor'].map((condition) => (
                    <label key={condition} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={conditions.includes(condition)}
                        onChange={() => handleConditionChange(condition)}
                      />
                      {condition === 'new' ? 'New' :
                       condition === 'like-new' ? 'Like New' :
                       condition === 'good' ? 'Good' :
                       condition === 'fair' ? 'Fair' : 'Poor'}
                    </label>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="primary" 
                fullWidth
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
          
          {/* Listings Grid */}
          <div className="flex-grow">
            {/* Sort Controls - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-4">
              <div>
                <span className="text-neutral-600">
                  Showing {filteredListings.length} result{filteredListings.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sortOrder" className="text-sm">Sort by:</label>
                <select 
                  id="sortOrder"
                  className="p-2 text-sm border border-neutral-300 rounded-lg"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing) => (
                  <div 
                    key={listing.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  >
                    <div className="aspect-square bg-neutral-100 relative">
                      {listing.images && listing.images.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-lg line-clamp-1">{listing.title}</h3>
                        <span className="font-bold text-accent-600">{formatCurrency(listing.price)}</span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">{listing.location}</p>
                      {listing.subcategory && (
                        <p className="text-xs text-primary-600 mt-1">
                          {listing.subcategory}
                        </p>
                      )}
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-neutral-200 mr-2 overflow-hidden">
                            {listing.sellerAvatar ? (
                              <img 
                                src={listing.sellerAvatar} 
                                alt={listing.sellerName}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-bold">
                                {listing.sellerName?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-neutral-600">{listing.sellerName}</span>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {new Date(listing.createdAt).toLocaleDateString('en-US', { 
                            month: 'short',
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {filteredListings.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-primary-50 text-sm font-medium text-primary-600">
                    1
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    2
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    3
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    <span className="sr-only">Next</span>
                    &raquo;
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

export default CategoryPage;
