import { Listing } from '../types/listing';

// Mock listing data
export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max - 256GB - Graphite',
    description: 'Apple iPhone 13 Pro Max in Graphite color, 256GB storage. Purchased in October 2022 from Apple Store. In excellent condition, always used with a case and screen protector (both included). Battery health at 92%. No scratches or dents. Original box and accessories included.',
    price: 85000,
    location: 'Mumbai, Maharashtra',
    category: 'electronics',
    condition: 'like-new',
    images: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600?text=2',
      'https://via.placeholder.com/800x600?text=3',
      'https://via.placeholder.com/800x600?text=4',
      'https://via.placeholder.com/800x600?text=5',
      'https://via.placeholder.com/800x600?text=6',
    ],
    sellerId: 'user1',
    sellerName: 'Rahul Sharma',
    sellerAvatar: 'https://via.placeholder.com/60',
    sellerRating: 5.0,
    sellerVerified: true,
    sellerJoinedDate: 'Oct 2021',
    createdAt: '2025-05-17T10:30:00Z',
    updatedAt: '2025-05-17T10:30:00Z',
  },
  {
    id: '2',
    title: 'Sony PlayStation 5 - Digital Edition',
    description: 'Brand new, sealed Sony PS5 Digital Edition. Purchased but never opened. Comes with controller and all original packaging.',
    price: 42999,
    location: 'Delhi, Delhi',
    category: 'electronics',
    condition: 'new',
    images: [
      'https://via.placeholder.com/800x600?text=PS5',
      'https://via.placeholder.com/800x600?text=PS5+2',
    ],
    sellerId: 'user2',
    sellerName: 'Aarav Patel',
    sellerAvatar: 'https://via.placeholder.com/60?text=AP',
    sellerRating: 4.7,
    sellerVerified: true,
    sellerJoinedDate: 'Jan 2022',
    createdAt: '2025-05-18T14:20:00Z',
    updatedAt: '2025-05-18T14:20:00Z',
  },
  {
    id: '3',
    title: 'IKEA MALM Queen Bed Frame - White',
    description: 'IKEA MALM queen size bed frame in white. Used for 1 year in guest bedroom. Some minor scratches on the legs, otherwise in good condition. Mattress not included.',
    price: 12000,
    location: 'Bangalore, Karnataka',
    category: 'furniture',
    condition: 'good',
    images: [
      'https://via.placeholder.com/800x600?text=Bed',
      'https://via.placeholder.com/800x600?text=Bed+2',
      'https://via.placeholder.com/800x600?text=Bed+3',
    ],
    sellerId: 'user3',
    sellerName: 'Priya Mehta',
    sellerAvatar: 'https://via.placeholder.com/60?text=PM',
    sellerRating: 4.2,
    sellerVerified: false,
    sellerJoinedDate: 'Mar 2023',
    createdAt: '2025-05-15T09:45:00Z',
    updatedAt: '2025-05-15T09:45:00Z',
  },
  {
    id: '4',
    title: 'MacBook Pro M2 - 14 inch - 16GB RAM - 512GB SSD',
    description: 'MacBook Pro with Apple M2 chip, 14-inch screen, 16GB RAM, and 512GB SSD. Space Gray. Purchased 6 months ago, in excellent condition with barely any use. AppleCare+ until November 2025.',
    price: 145000,
    location: 'Pune, Maharashtra',
    category: 'electronics',
    condition: 'like-new',
    images: [
      'https://via.placeholder.com/800x600?text=MacBook',
      'https://via.placeholder.com/800x600?text=MacBook+2',
    ],
    sellerId: 'user4',
    sellerName: 'Arjun Desai',
    sellerAvatar: 'https://via.placeholder.com/60?text=AD',
    sellerRating: 4.9,
    sellerVerified: true,
    sellerJoinedDate: 'Apr 2022',
    createdAt: '2025-05-19T11:10:00Z',
    updatedAt: '2025-05-19T11:10:00Z',
  },
  {
    id: '5',
    title: 'Honda City 2022 - Petrol - 15,000 km',
    description: 'Honda City 2022 model, petrol variant with automatic transmission. Single owner, only 15,000 km driven. All service records available. Metallic gray color. No accidents or repairs.',
    price: 1100000,
    location: 'Chennai, Tamil Nadu',
    category: 'vehicles',
    condition: 'like-new',
    images: [
      'https://via.placeholder.com/800x600?text=Car',
      'https://via.placeholder.com/800x600?text=Car+2',
      'https://via.placeholder.com/800x600?text=Car+3',
      'https://via.placeholder.com/800x600?text=Car+4',
    ],
    sellerId: 'user5',
    sellerName: 'Vijay Kumar',
    sellerAvatar: 'https://via.placeholder.com/60?text=VK',
    sellerRating: 4.5,
    sellerVerified: true,
    sellerJoinedDate: 'Sept 2021',
    createdAt: '2025-05-16T16:30:00Z',
    updatedAt: '2025-05-16T16:30:00Z',
  },
  {
    id: '6',
    title: 'Designer Saree - Silk - Green - Never Worn',
    description: 'Handcrafted silk saree in emerald green with gold embroidery. Purchased for a wedding but never worn. Includes matching blouse piece.',
    price: 8500,
    location: 'Hyderabad, Telangana',
    category: 'clothing',
    condition: 'new',
    images: [
      'https://via.placeholder.com/800x600?text=Saree',
      'https://via.placeholder.com/800x600?text=Saree+2',
    ],
    sellerId: 'user6',
    sellerName: 'Ananya Reddy',
    sellerAvatar: 'https://via.placeholder.com/60?text=AR',
    sellerRating: 4.6,
    sellerVerified: false,
    sellerJoinedDate: 'Jul 2022',
    createdAt: '2025-05-18T08:15:00Z',
    updatedAt: '2025-05-18T08:15:00Z',
  },
  {
    id: '7',
    title: '2BHK Apartment for Rent - Fully Furnished',
    description: '2 bedroom, hall, kitchen apartment available for rent. Fully furnished with AC in both bedrooms. Located in a gated society with 24/7 security, swimming pool, and gym facilities. 5 minutes walk to metro station.',
    price: 35000,
    location: 'Gurgaon, Haryana',
    category: 'real-estate',
    condition: 'good',
    images: [
      'https://via.placeholder.com/800x600?text=Apartment',
      'https://via.placeholder.com/800x600?text=Apartment+2',
      'https://via.placeholder.com/800x600?text=Apartment+3',
    ],
    sellerId: 'user7',
    sellerName: 'Deepak Gupta',
    sellerAvatar: 'https://via.placeholder.com/60?text=DG',
    sellerRating: 4.4,
    sellerVerified: true,
    sellerJoinedDate: 'Feb 2022',
    createdAt: '2025-05-17T13:25:00Z',
    updatedAt: '2025-05-17T13:25:00Z',
  },
  {
    id: '8',
    title: 'Canon EOS R5 with 24-70mm f/2.8 lens',
    description: 'Canon EOS R5 mirrorless camera with RF 24-70mm f/2.8 L IS USM lens. Purchased 8 months ago, only used for 2 photoshoots. Includes original packaging, extra battery, 128GB memory card, and camera bag.',
    price: 320000,
    location: 'Kolkata, West Bengal',
    category: 'electronics',
    condition: 'like-new',
    images: [
      'https://via.placeholder.com/800x600?text=Camera',
      'https://via.placeholder.com/800x600?text=Camera+2',
    ],
    sellerId: 'user8',
    sellerName: 'Amit Ray',
    sellerAvatar: 'https://via.placeholder.com/60?text=AR',
    sellerRating: 4.8,
    sellerVerified: true,
    sellerJoinedDate: 'Dec 2021',
    createdAt: '2025-05-19T15:40:00Z',
    updatedAt: '2025-05-19T15:40:00Z',
  },
  {
    id: '9',
    title: 'Treadmill - Horizon T202 - Barely Used',
    description: 'Horizon T202 treadmill purchased during lockdown, used less than 20 times. Features include Bluetooth connectivity, built-in speakers, multiple workout programs, and foldable design for easy storage.',
    price: 45000,
    location: 'Ahmedabad, Gujarat',
    category: 'other',
    condition: 'like-new',
    images: [
      'https://via.placeholder.com/800x600?text=Treadmill',
    ],
    sellerId: 'user9',
    sellerName: 'Raj Patel',
    sellerAvatar: 'https://via.placeholder.com/60?text=RP',
    sellerRating: 4.3,
    sellerVerified: false,
    sellerJoinedDate: 'May 2022',
    createdAt: '2025-05-15T17:20:00Z',
    updatedAt: '2025-05-15T17:20:00Z',
  }
];

// Function to simulate fetching listings with optional filters
export const getListings = (filters?: Record<string, any>, limit: number = 20) => {
  let filteredListings = [...mockListings];
  
  if (filters) {
    if (filters.category) {
      filteredListings = filteredListings.filter(listing => listing.category === filters.category);
    }
    
    if (filters.minPrice) {
      filteredListings = filteredListings.filter(listing => listing.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.price <= filters.maxPrice);
    }
    
    if (filters.location) {
      filteredListings = filteredListings.filter(listing => 
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.condition && filters.condition.length > 0) {
      filteredListings = filteredListings.filter(listing => 
        filters.condition.includes(listing.condition)
      );
    }
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredListings = filteredListings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) || 
        listing.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort listings
    if (filters.sortBy) {
      switch(filters.sortBy) {
        case 'price-low':
          filteredListings.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredListings.sort((a, b) => b.price - a.price);
          break;
        case 'popularity':
          // For mock data, we'll just sort by seller rating as a proxy for popularity
          filteredListings.sort((a, b) => b.sellerRating - a.sellerRating);
          break;
        case 'recent':
        default:
          // Sort by creation date (most recent first)
          filteredListings.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }
  }
  
  return filteredListings.slice(0, limit);
};

// Function to get a single listing by ID
export const getListingById = (id: string): Listing | undefined => {
  return mockListings.find(listing => listing.id === id);
};

// Function to get similar listings (same category, different ID)
export const getSimilarListings = (listingId: string, limit: number = 3): Listing[] => {
  const listing = getListingById(listingId);
  if (!listing) return [];
  
  return mockListings
    .filter(item => item.category === listing.category && item.id !== listingId)
    .slice(0, limit);
};

// Function to simulate creating a new listing
export const createListing = (listingData: Partial<Listing>): Promise<Listing> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const newListing: Listing = {
        id: `${mockListings.length + 1}`,
        title: listingData.title || '',
        description: listingData.description || '',
        price: listingData.price || 0,
        location: listingData.location || '',
        category: listingData.category || 'other',
        condition: listingData.condition || 'good',
        images: listingData.images || [],
        sellerId: 'current-user', // In a real app, this would be the current user's ID
        sellerName: 'Current User', // This would be the current user's name
        sellerAvatar: 'https://via.placeholder.com/60?text=CU',
        sellerRating: 4.5,
        sellerVerified: true,
        sellerJoinedDate: 'May 2022',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, we would push to a database
      mockListings.push(newListing);
      
      resolve(newListing);
    }, 1000);
  });
};
