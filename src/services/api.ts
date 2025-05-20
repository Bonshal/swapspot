import { User } from '../store/authStore';
import { Listing, ListingFilters } from '../types/listing';
import { Conversation, Message } from '../types/message';

// Base URL for the API
const API_BASE_URL = 'https://api.swapspot.com'; // Will be replaced with the actual API URL

/**
 * A utility function to handle API errors
 */
const handleApiError = (error: any): never => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Please check your internet connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error making request: ' + error.message);
  }
};

/**
 * A reusable fetch function that handles common API logic
 */
const apiFetch = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Set default headers for JSON API
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    // Add authentication token if available
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
    
    // Return the JSON response
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Authentication API endpoints
 */
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },
  
  getProfile: async (): Promise<User> => {
    return apiFetch('/auth/profile');
  },
  
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    return apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

/**
 * Listings API endpoints
 */
export const listingService = {
  getListings: async (filters?: ListingFilters): Promise<Listing[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.condition) queryParams.append('condition', filters.condition.join(','));
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      if (filters.sortBy) queryParams.append('sort', filters.sortBy);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiFetch(`/listings${queryString}`);
  },
  
  getListingById: async (id: string): Promise<Listing> => {
    return apiFetch(`/listings/${id}`);
  },
  
  createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
    return apiFetch('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
  },
  
  updateListing: async (id: string, listingData: Partial<Listing>): Promise<Listing> => {
    return apiFetch(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData)
    });
  },
  
  deleteListing: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch(`/listings/${id}`, {
      method: 'DELETE'
    });
  },
  
  getUserListings: async (): Promise<Listing[]> => {
    return apiFetch('/listings/user');
  }
};

/**
 * Messaging API endpoints
 */
export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    return apiFetch('/messages/conversations');
  },
  
  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    return apiFetch(`/messages/conversations/${conversationId}`);
  },
  
  sendMessage: async (receiverId: string, content: string, listingId?: string): Promise<Message> => {
    return apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content, listingId })
    });
  },
  
  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    return apiFetch(`/messages/${messageId}/read`, {
      method: 'PUT'
    });
  },
  
  startConversationAboutListing: async (
    sellerId: string, 
    listingId: string, 
    initialMessage: string
  ): Promise<{ conversationId: string; message: Message }> => {
    return apiFetch('/messages/start', {
      method: 'POST',
      body: JSON.stringify({ sellerId, listingId, message: initialMessage })
    });
  }
};
