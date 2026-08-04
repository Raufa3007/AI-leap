-- Enable RLS on supplier table
ALTER TABLE supplier ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own supplier record" ON supplier;
DROP POLICY IF EXISTS "Users can view their own supplier record" ON supplier;
DROP POLICY IF EXISTS "Users can update their own supplier record" ON supplier;
DROP POLICY IF EXISTS "Admins can view all supplier records" ON supplier;
DROP POLICY IF EXISTS "Admins can update supplier records" ON supplier;

-- Policy: Anyone can insert a new supplier record (for registration)
CREATE POLICY "Users can insert their own supplier record"
  ON supplier
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own supplier record
CREATE POLICY "Users can view their own supplier record"
  ON supplier
  FOR SELECT
  USING (
    auth.uid()::text = id::text 
    OR primary_rep_email = auth.jwt() ->> 'email'
    OR auth.role() = 'authenticated'
  );

-- Policy: Users can update their own supplier record
CREATE POLICY "Users can update their own supplier record"
  ON supplier
  FOR UPDATE
  USING (
    auth.uid()::text = id::text 
    OR primary_rep_email = auth.jwt() ->> 'email'
  )
  WITH CHECK (
    auth.uid()::text = id::text 
    OR primary_rep_email = auth.jwt() ->> 'email'
  );

-- Policy: Admins can view all supplier records
CREATE POLICY "Admins can view all supplier records"
  ON supplier
  FOR SELECT
  USING (auth.role() = 'admin');

-- Policy: Admins can update supplier records
CREATE POLICY "Admins can update supplier records"
  ON supplier
  FOR UPDATE
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');
