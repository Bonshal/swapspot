import { useListingStore } from '../store/listingStore';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for handling search functionality
 */
export const useSearchListings = () => {
  const { updateFilters, fetchListings } = useListingStore();
  const navigate = useNavigate();

  /**
   * Handle search submission
   * @param searchTerm String to search for
   */
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    updateFilters({ searchTerm });
    navigate('/listings');
    fetchListings();
  };

  return { handleSearch };
};
