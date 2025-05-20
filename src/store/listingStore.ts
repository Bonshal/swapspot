import { create } from 'zustand';
import { Listing, ListingFilters } from '../types/listing';
import { getListings, getListingById, createListing } from '../mockData/listings';

interface ListingStore {
  listings: Listing[];
  currentListing: Listing | null;
  filters: ListingFilters;
  loading: boolean;
  error: string | null;

  // Actions
  fetchListings: (filters?: ListingFilters) => Promise<void>;
  fetchListingById: (id: string) => Promise<void>;
  addListing: (listingData: Partial<Listing>) => Promise<void>;
  updateFilters: (newFilters: Partial<ListingFilters>) => void;
  clearFilters: () => void;
}

export const useListingStore = create<ListingStore>((set, get) => ({
  listings: [],
  currentListing: null,
  filters: {
    sortBy: 'recent'
  },
  loading: false,
  error: null,

  fetchListings: async (filters) => {
    set({ loading: true, error: null });
    try {
      // Use current filters merged with any new filters
      const currentFilters = filters ? { ...get().filters, ...filters } : get().filters;
      const fetchedListings = getListings(currentFilters);
      set({ 
        listings: fetchedListings, 
        loading: false,
        filters: currentFilters
      });
    } catch (error) {
      console.error('Error fetching listings:', error);
      set({ 
        error: 'Failed to fetch listings. Please try again.', 
        loading: false 
      });
    }
  },

  fetchListingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const listing = getListingById(id);
      if (listing) {
        set({ currentListing: listing, loading: false });
      } else {
        set({ 
          error: 'Listing not found.', 
          loading: false,
          currentListing: null
        });
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      set({ 
        error: 'Failed to fetch listing details. Please try again.', 
        loading: false 
      });
    }
  },

  addListing: async (listingData) => {
    set({ loading: true, error: null });
    try {
      const newListing = await createListing(listingData);
      set(state => ({ 
        listings: [newListing, ...state.listings],
        loading: false
      }));
    } catch (error) {
      console.error('Error creating listing:', error);
      set({ 
        error: 'Failed to create listing. Please try again.', 
        loading: false 
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...newFilters
      }
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        sortBy: 'recent'
      }
    });
  }
}));
