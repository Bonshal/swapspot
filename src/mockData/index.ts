import { Category, Listing, User } from '../types';

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'smartphone',
    slug: 'electronics',
    subCategories: [
      { id: '1-1', name: 'Phones', icon: 'smartphone', slug: 'phones' },
      { id: '1-2', name: 'Computers', icon: 'laptop', slug: 'computers' },
      { id: '1-3', name: 'Cameras', icon: 'camera', slug: 'cameras' },
      { id: '1-4', name: 'TVs', icon: 'tv', slug: 'tvs' },
    ],
  },
  {
    id: '2',
    name: 'Vehicles',
    icon: 'car',
    slug: 'vehicles',
    subCategories: [
      { id: '2-1', name: 'Cars', icon: 'car', slug: 'cars' },
      { id: '2-2', name: 'Motorcycles', icon: 'bicycle', slug: 'motorcycles' },
      { id: '2-3', name: 'Bicycles', icon: 'bicycle', slug: 'bicycles' },
    ],
  },
  {
    id: '3',
    name: 'Property',
    icon: 'home',
    slug: 'property',
    subCategories: [
      { id: '3-1', name: 'Apartments', icon: 'building', slug: 'apartments' },
      { id: '3-2', name: 'Houses', icon: 'home', slug: 'houses' },
      { id: '3-3', name: 'Land', icon: 'map', slug: 'land' },
    ],
  },
  {
    id: '4',
    name: 'Furniture',
    icon: 'couch',
    slug: 'furniture',
  },
  {
    id: '5',
    name: 'Fashion',
    icon: 'shirt',
    slug: 'fashion',
    subCategories: [
      { id: '5-1', name: 'Men', icon: 'user', slug: 'men' },
      { id: '5-2', name: 'Women', icon: 'user', slug: 'women' },
      { id: '5-3', name: 'Kids', icon: 'baby', slug: 'kids' },
    ],
  },
  {
    id: '6',
    name: 'Books & Hobbies',
    icon: 'book-open',
    slug: 'books-hobbies',
  },
  {
    id: '7',
    name: 'Jobs',
    icon: 'briefcase',
    slug: 'jobs',
  },
  {
    id: '8',
    name: 'Services',
    icon: 'tool',
    slug: 'services',
  },
];

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'New York, NY',
    phone: '+1234567890',
    joinedAt: '2023-01-15T00:00:00Z',
    verified: true,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Los Angeles, CA',
    phone: '+1987654320',
    joinedAt: '2023-02-20T00:00:00Z',
    verified: true,
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Chicago, IL',
    phone: '+1122334455',
    joinedAt: '2023-03-10T00:00:00Z',
    verified: true,
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Houston, TX',
    phone: '+1555666777',
    joinedAt: '2023-04-05T00:00:00Z',
    verified: false,
    rating: 4.0,
  },
];

// Mock Listings
export const listings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro - Excellent Condition',
    description: 'Selling my iPhone 13 Pro in excellent condition. Comes with original box, charger, and a case. Battery health at 92%. No scratches or dents.',
    price: 699,
    images: [
      'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4071887/pexels-photo-4071887.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[0].subCategories![0],
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
    condition: 'like-new',
    seller: users[0],
    createdAt: '2023-06-10T10:30:00Z',
    updatedAt: '2023-06-10T10:30:00Z',
    featured: true,
    status: 'active',
    views: 156,
    favorites: 23,
  },
  {
    id: '2',
    title: '2019 Honda Civic - Low Mileage',
    description: '2019 Honda Civic EX with only 25,000 miles. Clean title, no accidents, well maintained. Recent oil change and new tires. Selling because I\'m moving overseas.',
    price: 18900,
    images: [
      'https://images.pexels.com/photos/1011769/pexels-photo-1011769.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[1].subCategories![0],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
    condition: 'good',
    seller: users[1],
    createdAt: '2023-06-08T14:45:00Z',
    updatedAt: '2023-06-09T09:15:00Z',
    featured: true,
    status: 'active',
    views: 210,
    favorites: 42,
  },
  {
    id: '3',
    title: 'Modern Sofa - Like New',
    description: 'Beautiful modern sofa in gray, purchased 3 months ago. Very comfortable with minimalist design. Perfect for apartment or small living room. Smoke-free home.',
    price: 450,
    images: [
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[3],
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      coordinates: {
        lat: 41.8781,
        lng: -87.6298,
      },
    },
    condition: 'like-new',
    seller: users[2],
    createdAt: '2023-06-05T16:20:00Z',
    updatedAt: '2023-06-05T16:20:00Z',
    status: 'active',
    views: 95,
    favorites: 12,
  },
  {
    id: '4',
    title: 'MacBook Pro 16" 2021 M1 Pro',
    description: 'MacBook Pro 16" 2021 with M1 Pro chip, 16GB RAM, 512GB SSD. Still under AppleCare+ warranty. Very powerful machine in perfect condition. Includes original charger and box.',
    price: 1799,
    images: [
      'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[0].subCategories![1],
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194,
      },
    },
    condition: 'like-new',
    seller: users[3],
    createdAt: '2023-06-09T11:05:00Z',
    updatedAt: '2023-06-09T11:05:00Z',
    featured: true,
    status: 'active',
    views: 173,
    favorites: 36,
  },
  {
    id: '5',
    title: 'Specialized Road Bike - Great Condition',
    description: 'Specialized Allez road bike, size 56cm. Great condition, regularly maintained. Carbon fork, aluminum frame. Perfect for beginners or intermediate cyclists.',
    price: 650,
    images: [
      'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/5465657/pexels-photo-5465657.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[1].subCategories![2],
    location: {
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      coordinates: {
        lat: 45.5152,
        lng: -122.6784,
      },
    },
    condition: 'good',
    seller: users[0],
    createdAt: '2023-06-07T13:25:00Z',
    updatedAt: '2023-06-07T13:25:00Z',
    status: 'active',
    views: 82,
    favorites: 15,
  },
  {
    id: '6',
    title: 'Canon EOS R5 - Professional Camera Kit',
    description: 'Canon EOS R5 with 24-70mm f/2.8 lens. Includes 3 batteries, dual charger, 128GB memory card, and camera bag. Used professionally for 6 months, in excellent condition.',
    price: 3600,
    images: [
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[0].subCategories![2],
    location: {
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      coordinates: {
        lat: 42.3601,
        lng: -71.0589,
      },
    },
    condition: 'like-new',
    seller: users[1],
    createdAt: '2023-06-04T09:50:00Z',
    updatedAt: '2023-06-04T09:50:00Z',
    status: 'active',
    views: 128,
    favorites: 31,
  },
  {
    id: '7',
    title: '2 Bedroom Apartment for Rent - Downtown',
    description: 'Beautiful 2 bedroom, 1 bathroom apartment in downtown area. Newly renovated with modern appliances, hardwood floors, and in-unit laundry. Building has gym and rooftop lounge. Available from August 1st.',
    price: 2200,
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[2].subCategories![0],
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      coordinates: {
        lat: 47.6062,
        lng: -122.3321,
      },
    },
    condition: 'good',
    seller: users[2],
    createdAt: '2023-06-08T15:10:00Z',
    updatedAt: '2023-06-08T15:10:00Z',
    featured: true,
    status: 'active',
    views: 245,
    favorites: 52,
  },
  {
    id: '8',
    title: 'Designer Winter Coat - Size M',
    description: 'Luxury designer winter coat, size medium. Purchased last season and worn only a few times. Perfect condition, very warm and stylish. Dark navy color goes with everything.',
    price: 350,
    images: [
      'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6975575/pexels-photo-6975575.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    category: categories[4].subCategories![1],
    location: {
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      coordinates: {
        lat: 39.7392,
        lng: -104.9903,
      },
    },
    condition: 'like-new',
    seller: users[3],
    createdAt: '2023-06-06T10:35:00Z',
    updatedAt: '2023-06-06T10:35:00Z',
    status: 'active',
    views: 67,
    favorites: 19,
  },
];

// Get Featured Listings
export const getFeaturedListings = (): Listing[] => {
  return listings.filter(listing => listing.featured);
};

// Get Recent Listings
export const getRecentListings = (): Listing[] => {
  return [...listings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get Popular Categories
export const getPopularCategories = (): Category[] => {
  return categories.slice(0, 6);
};

// Search Listings
export const searchListings = (query: string): Listing[] => {
  const lowercaseQuery = query.toLowerCase();
  return listings.filter(listing => 
    listing.title.toLowerCase().includes(lowercaseQuery) || 
    listing.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Get User Listings
export const getUserListings = (userId: string): Listing[] => {
  return listings.filter(listing => listing.seller.id === userId);
};