-- Database Migration: Restructure Roles
-- Goal: 
-- 1. Remove 'super_admin' role.
-- 2. Migrate existing 'super_admin' to 'admin'.
-- 3. Migrate existing 'admin' to 'user'.
-- 4. 'user' roles remain as 'user' (they will effectively be business owners now, or just users).
-- 
-- Note: We first need to drop the check constraint to allow temporary updates if needed, 
-- but actually 'admin' and 'user' are valid in the old constraint too.
-- The issue is 'super_admin' is being removed.

-- 1. Drop the existing check constraint on profiles.role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Update existing data
-- First, migrate admins to users (downgrade/shift)
-- We need to do this carefully. 
-- OLD Admin (Business Owner) -> NEW User (Business Owner)
UPDATE public.profiles 
SET role = 'user' 
WHERE role = 'admin';

-- Second, migrate super_admins to admins (the new platform admins)
-- OLD Super Admin (Platform) -> NEW Admin (Platform)
UPDATE public.profiles 
SET role = 'admin' 
WHERE role = 'super_admin';

-- 3. Add new check constraint with only 'user' and 'admin'
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin'));

-- 4. Update comment
COMMENT ON COLUMN public.profiles.role IS 'User role: user (Business Owner), admin (Platform Admin)';
