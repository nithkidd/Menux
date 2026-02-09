-- Create food_types table
CREATE TABLE IF NOT EXISTS food_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT, -- Optional icon
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for items and food types
CREATE TABLE IF NOT EXISTS item_food_types (
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  food_type_id UUID NOT NULL REFERENCES food_types(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (item_id, food_type_id)
);

-- Enable RLS
ALTER TABLE food_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_food_types ENABLE ROW LEVEL SECURITY;

-- Policies for food_types

-- View: Public can view food types of active businesses (for menu display)
CREATE POLICY "Public can view food types of active businesses"
  ON food_types FOR SELECT
  USING (business_id IN (SELECT id FROM businesses WHERE is_active = true));

-- View: Owners can view their own food types
CREATE POLICY "Owners can view their own food types"
  ON food_types FOR SELECT
  USING (business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  ));

-- Manage: Owners can insert/update/delete their own food types
CREATE POLICY "Owners can manage their own food types"
  ON food_types FOR ALL
  USING (business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  ));


-- Policies for item_food_types

-- View: Public can view item tags
CREATE POLICY "Public can view item tags"
  ON item_food_types FOR SELECT
  USING (
    item_id IN (
      SELECT id FROM items WHERE is_available = true
    )
  );

-- Manage: Owners can manage item tags (via item ownership)
CREATE POLICY "Owners can manage item tags"
  ON item_food_types FOR ALL
  USING (
    item_id IN (
      SELECT i.id FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN businesses b ON c.business_id = b.id
      WHERE b.owner_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- Create indexes for performance
CREATE INDEX idx_food_types_business ON food_types(business_id);
CREATE INDEX idx_item_food_types_item ON item_food_types(item_id);
CREATE INDEX idx_item_food_types_type ON item_food_types(food_type_id);
