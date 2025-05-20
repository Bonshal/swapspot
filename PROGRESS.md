# SwapSpot - Online Marketplace Application

SwapSpot is a modern online marketplace that connects buyers and sellers, allowing users to list items for sale and browse available listings.

## Features Implemented

### Authentication
- User registration and login with form validation
- Authentication state management using Zustand
- Protected routes for authenticated users
- Token persistence via localStorage

### Listing Management
- Browse listings with filtering options
- View detailed listing information
- Create new listings with image upload
- User dashboard for managing listings

### UI/UX
- Responsive design using Tailwind CSS
- Consistent component styling across the application
- Toast notifications for user feedback
- Loading states and animations
- Error handling with user-friendly messages

### State Management
- Centralized auth store with Zustand
- Listings store for managing marketplace items
- Toast notification system

## Project Structure

```
src/
  |-- components/
  |   |-- auth/           # Authentication components
  |   |-- home/           # Homepage components
  |   |-- layout/         # Layout components (Header, Footer, etc.)
  |   |-- ui/             # Reusable UI components
  |
  |-- pages/              # Page components
  |   |-- HomePage.tsx
  |   |-- LoginPage.tsx
  |   |-- SignupPage.tsx
  |   |-- DashboardPage.tsx
  |   |-- ListingsPage.tsx
  |   |-- ListingDetailPage.tsx
  |   |-- CreateListingPage.tsx
  |
  |-- store/              # State management
  |   |-- authStore.ts
  |   |-- listingStore.ts
  |
  |-- types/              # TypeScript type definitions
  |   |-- index.ts
  |   |-- listing.ts
  |
  |-- utils/              # Utility functions
  |   |-- cn.ts
  |   |-- formatters.ts
  |   |-- errorHandling.ts
  |   |-- search.ts
  |
  |-- mockData/           # Mock data for development
  |   |-- listings.ts
```

## Technologies Used

- React.js with TypeScript
- React Router for navigation
- Zustand for state management
- React Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons

## Next Steps

- Integration with backend APIs
- User profile customization
- Messaging system between buyers and sellers
- Advanced search and filtering
- Categories and subcategories navigation
- Reviews and ratings system
- Payment integration
- Mobile app development
