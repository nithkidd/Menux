-- Migration: Add is_published to businesses and update policies
-- Run this in Supabase SQL Editor

-- 1. Add is_published column
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- 2. Backfill existing businesses to be published (so we don't break existing ones)
UPDATE businesses SET is_published = true;

-- 3. Update RLS policies to check is_published for public access

-- Drop existing public policies
DROP POLICY IF EXISTS "Public can view active businesses" ON businesses;
DROP POLICY IF EXISTS "Public can view categories of active businesses" ON categories;
DROP POLICY IF EXISTS "Public can view available items of active businesses" ON items;

-- Re-create policies with is_published check

CREATE POLICY "Public can view active businesses"
  ON businesses FOR SELECT
  USING (is_active = true AND is_published = true);

CREATE POLICY "Public can view categories of active businesses"
  ON categories FOR SELECT
  USING (business_id IN (
    SELECT id FROM businesses 
    WHERE is_active = true AND is_published = true
  ));

CREATE POLICY "Public can view available items of active businesses"
  ON items FOR SELECT
  USING (
    is_available = true AND
    category_id IN (
      SELECT c.id FROM categories c
      JOIN businesses b ON c.business_id = b.id
      WHERE b.is_active = true AND b.is_published = true
    )
  );
