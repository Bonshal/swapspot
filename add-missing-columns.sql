-- Add missing columns to listings table
-- Run this in your Supabase SQL editor

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS sellerName TEXT,
ADD COLUMN IF NOT EXISTS sellerAvatar TEXT,
ADD COLUMN IF NOT EXISTS sellerRating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sellerVerified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sellerJoinedDate TIMESTAMPTZ;
