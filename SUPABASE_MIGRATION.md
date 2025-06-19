# Supabase Migration Guide

This guide will help you complete the migration from Firebase to Supabase for your SwapSpot application.

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the Supabase dashboard

## Setup Steps

### 1. Environment Variables

Update your `.env` file with your Supabase credentials:

```env
# Supabase configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all necessary tables, policies, and functions

### 3. Install Dependencies

The dependencies have been updated. Run:

```bash
npm install
```

### 4. Storage Setup

In your Supabase dashboard:

1. Go to Storage
2. The buckets `profile-images` and `listing-images` should be created automatically by the SQL script
3. If not, create them manually and make them public

## What's Changed

### ✅ Completed
- Updated package.json to use `@supabase/supabase-js` instead of Firebase
- Updated environment variables from Firebase to Supabase
- Updated authentication store to use Supabase Auth
- Updated API services to use Supabase database and storage
- Updated message store and listing store
- Fixed migration utility to work with Supabase
- Removed Firebase configuration
- Created comprehensive database schema

### Database Schema
The following tables are created:
- `profiles` - User profile information
- `listings` - Product listings
- `conversations` - Chat conversations between users
- `messages` - Individual messages in conversations

### Authentication
- Uses Supabase Auth with email/password
- Automatic profile creation on signup
- Row Level Security (RLS) enabled for data protection

### Storage
- Profile images stored in `profile-images` bucket
- Listing images stored in `listing-images` bucket
- Public access for viewing, authenticated access for uploads

## Next Steps

1. Update your `.env` file with actual Supabase credentials
2. Run the SQL schema in your Supabase dashboard
3. Test the application to ensure everything works
4. Update any components that might be directly using Firebase (if any)

## Testing

Start your development server:

```bash
npm run dev
```

Test the following functionality:
- User signup/login
- Profile creation and updates
- Listing creation
- Image uploads
- Messaging system

## Migration Notes

- User authentication flow remains the same from a UI perspective
- All data operations now use Supabase instead of Firebase
- Image uploads now use Supabase Storage instead of Firebase Storage
- Real-time features can be added using Supabase Realtime if needed

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure all SQL policies are correctly applied
4. Check that storage buckets are properly configured
