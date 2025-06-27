export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  phone?: string;
  joinedAt: string;
  verified: boolean;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  subCategories?: Category[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  seller: User;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  status: 'active' | 'pending' | 'sold' | 'archived';
  views: number;
  favorites: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  location?: string;
  distance?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'relevance';
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  listingId?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  listingId?: string;
}

export interface Review {
  id: string;
  reviewer: User;
  reviewee: User;
  rating: number;
  comment: string;
  listingId: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  buyer: User;
  seller: User;
  listing: Listing;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'message'
  | 'offer'
  | 'listing-view'
  | 'favorite'
  | 'transaction'
  | 'review';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  read: boolean;
  data: Record<string, unknown>; // Replaced any with proper type
  createdAt: string;
}