-- SwapSpot Database Schema for Supabase (Step by Step)
-- Run these commands one by one in your Supabase SQL editor

-- STEP 1: Create custom types
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'inactive');
CREATE TYPE conversation_status AS ENUM ('active', 'archived');

-- STEP 2: Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  profile_image TEXT,
  location TEXT,
  bio TEXT,
  avatar TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  isAadhaarVerified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Create listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sellerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sellerName TEXT NOT NULL,
  sellerAvatar TEXT,
  sellerRating DECIMAL(2,1) DEFAULT 0,
  sellerVerified BOOLEAN DEFAULT FALSE,
  sellerJoinedDate TIMESTAMPTZ,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  condition TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  negotiable BOOLEAN DEFAULT TRUE,
  status listing_status DEFAULT 'active',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 4: Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participants UUID[] NOT NULL,
  listingId UUID REFERENCES listings(id) ON DELETE SET NULL,
  listingTitle TEXT,
  lastMessage JSONB,
  status conversation_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 5: Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversationId UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  senderId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiverId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  listingId UUID REFERENCES listings(id) ON DELETE SET NULL,
  listingTitle TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 6: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- STEP 8: Create RLS Policies for listings
CREATE POLICY "Anyone can view active listings" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create listings" ON listings FOR INSERT WITH CHECK (auth.uid() = sellerId);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = sellerId);
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = sellerId);

-- STEP 9: Create RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON conversations FOR SELECT USING (auth.uid() = ANY(participants));
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = ANY(participants));
CREATE POLICY "Users can update conversations they participate in" ON conversations FOR UPDATE USING (auth.uid() = ANY(participants));

-- STEP 10: Create RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (auth.uid() = senderId OR auth.uid() = receiverId);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = senderId);
CREATE POLICY "Users can update messages they sent" ON messages FOR UPDATE USING (auth.uid() = senderId);

-- STEP 11: Create indexes
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_seller ON listings(sellerId);
CREATE INDEX idx_listings_created_at ON listings(created_at);
CREATE INDEX idx_messages_conversation ON messages(conversationId);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_conversations_participants ON conversations USING GIN(participants);

-- STEP 12: Create function for auto profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 13: Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- STEP 14: Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 15: Create updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- MANUAL STEPS (Do these in Supabase Dashboard):
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket named 'profile-images' (make it public)
-- 3. Create bucket named 'listing-images' (make it public)
-- 4. Set up storage policies if needed (see main schema file for examples)
