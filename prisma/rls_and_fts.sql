-- ==============================================================================
-- Vintage Travel Journal: Supabase RLS Policies & Full-Text Search Migration
-- ==============================================================================

-- 1. Full-Text Search on Entry (title and bodyText)
-- Add generated tsvector column with English dictionary weighting
ALTER TABLE "Entry" 
ADD COLUMN IF NOT EXISTS "fts" tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("bodyText", '')), 'B')
) STORED;

-- Create GIN index for rapid full-text searching
CREATE INDEX IF NOT EXISTS "entry_fts_idx" ON "Entry" USING GIN ("fts");

-- 2. Enable Row Level Security (RLS) on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trip" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Entry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EntryTag" ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: "User" Table
-- Users can only view and update their own user profile
DROP POLICY IF EXISTS "Users can read own profile" ON "User";
CREATE POLICY "Users can read own profile" ON "User"
  FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own profile" ON "User";
CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON "User";
CREATE POLICY "Users can insert own profile" ON "User"
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- 4. RLS Policies: "Trip" Table
-- A user can select, insert, update and delete only rows where userId = auth.uid()
DROP POLICY IF EXISTS "Users can manage own trips" ON "Trip";
CREATE POLICY "Users can manage own trips" ON "Trip"
  FOR ALL USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- 5. RLS Policies: "Entry" Table
-- A user can select, insert, update and delete only rows where userId = auth.uid()
DROP POLICY IF EXISTS "Users can manage own entries" ON "Entry";
CREATE POLICY "Users can manage own entries" ON "Entry"
  FOR ALL USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- 6. RLS Policies: "Media" Table
-- A user can select, insert, update and delete only rows where userId = auth.uid()
DROP POLICY IF EXISTS "Users can manage own media" ON "Media";
CREATE POLICY "Users can manage own media" ON "Media"
  FOR ALL USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- 7. RLS Policies: "Tag" Table
-- A user can select, insert, update and delete only rows where userId = auth.uid()
DROP POLICY IF EXISTS "Users can manage own tags" ON "Tag";
CREATE POLICY "Users can manage own tags" ON "Tag"
  FOR ALL USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- 8. RLS Policies: "EntryTag" Table
-- Managed if the associated entry belongs to the user
DROP POLICY IF EXISTS "Users can manage own entry tags" ON "EntryTag";
CREATE POLICY "Users can manage own entry tags" ON "EntryTag"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Entry"
      WHERE "Entry".id = "EntryTag"."entryId"
      AND "Entry"."userId" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Entry"
      WHERE "Entry".id = "EntryTag"."entryId"
      AND "Entry"."userId" = auth.uid()::text
    )
  );

-- 9. Automatic Profile Creation Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, "displayName", theme, "storageUsedBytes", "storageQuotaBytes", "createdAt")
  VALUES (
    new.id::text,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'sepia',
    0,
    1073741824,
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
