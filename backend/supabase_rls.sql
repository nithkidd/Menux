    -- Enable RLS on tables (safe to run multiple times)
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE items ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view own business" ON businesses;
    DROP POLICY IF EXISTS "Users can update own business" ON businesses;
    DROP POLICY IF EXISTS "Public read access for categories" ON categories;
    DROP POLICY IF EXISTS "Public read access for items" ON items;

    -- Re-create Policies

    -- Profiles: Users can only see/edit their own profile
    CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = auth_user_id);

    CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = auth_user_id);

    -- Businesses: Users can view/edit businesses they run
    -- WARNING: Ensure 'owner_id' or similar column exists on 'businesses'. 
    -- If not, you might need to check a join or rely on backend for writes.
    -- For now, we assume standard pattern:
    CREATE POLICY "Users can view own business"
    ON businesses FOR SELECT
    USING (auth.uid() = owner_id);

    CREATE POLICY "Users can update own business"
    ON businesses FOR UPDATE
    USING (auth.uid() = owner_id);

    -- Categories & Items: Public Read
    CREATE POLICY "Public read access for categories"
    ON categories FOR SELECT
    USING (true);

    CREATE POLICY "Public read access for items"
    ON items FOR SELECT
    USING (true);
