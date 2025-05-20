export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  condition: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerVerified: boolean;
  sellerJoinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  condition?: string[];
  searchTerm?: string;
  sortBy?: 'recent' | 'price-low' | 'price-high' | 'popularity';
}

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export type ListingCategory = 'electronics' | 'furniture' | 'clothing' | 'vehicles' | 'real-estate' | 'services' | 'jobs' | 'other';
