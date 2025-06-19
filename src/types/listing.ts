export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  subcategory?: string;
  condition: string;
  images: string[];
  user_id: string;
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
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  condition?: string[];
  searchTerm?: string;
  sortBy?: 'recent' | 'price-low' | 'price-high' | 'popularity';
}

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export type ListingCategory = 'electronics' | 'furniture' | 'clothing' | 'vehicles' | 'real-estate' | 'services' | 'jobs' | 'other';

// Let's define subcategories for each main category
export const categorySubcategories: Record<ListingCategory, string[]> = {
  'electronics': [
    'Smartphones',
    'Laptops & Computers',
    'Audio & Headphones',
    'Cameras & Photography',
    'TVs & Monitors',
    'Gaming & Consoles',
    'Wearable Tech',
    'Other Electronics'
  ],
  'furniture': [
    'Sofas & Seating',
    'Beds & Mattresses',
    'Tables & Desks',
    'Storage & Shelving',
    'Dining Furniture',
    'Outdoor Furniture',
    'Office Furniture',
    'Other Furniture'
  ],
  'clothing': [
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Kids Clothing',
    'Footwear',
    'Accessories',
    'Jewelry & Watches',
    'Bags & Luggage',
    'Other Clothing'
  ],
  'vehicles': [
    'Cars',
    'Motorcycles',
    'Bicycles',
    'Auto Parts',
    'Scooters & E-bikes',
    'Commercial Vehicles',
    'Boats & Watercraft',
    'Other Vehicles'
  ],
  'real-estate': [
    'Apartments',
    'Houses',
    'Land & Plots',
    'Commercial Property',
    'PG & Roommates',
    'Vacation Rentals',
    'Parking & Garage',
    'Other Real Estate'
  ],
  'services': [
    'Home Services',
    'Professional Services',
    'Education & Classes',
    'Health & Wellness',
    'Events & Entertainment',
    'Travel & Experiences',
    'Repair & Maintenance',
    'Other Services'
  ],
  'jobs': [
    'Full-time Jobs',
    'Part-time Jobs',
    'Remote Work',
    'Freelance',
    'Internships',
    'Volunteering',
    'Skill Exchange',
    'Other Jobs'
  ],
  'other': [
    'Books & Hobbies',
    'Sports & Fitness',
    'Musical Instruments',
    'Art & Collectibles',
    'Pets & Pet Products',
    'Home Appliances',
    'Toys & Games',
    'Miscellaneous'
  ]
};
