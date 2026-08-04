-- Updated RLS policies to allow anonymous users to insert supplier records
-- Enable RLS on supplier table
ALTER TABLE supplier ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to insert new supplier records (for registration)
CREATE POLICY "Allow anonymous insert for registration"
  ON supplier
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow users to view their own supplier record
CREATE POLICY "Allow users to view own supplier record"
  ON supplier
  FOR SELECT
  USING (auth.email() = primary_rep_email OR auth.email() = secondary_rep_email);

-- Policy 3: Allow users to update their own supplier record
CREATE POLICY "Allow users to update own supplier record"
  ON supplier
  FOR UPDATE
  USING (auth.email() = primary_rep_email OR auth.email() = secondary_rep_email)
  WITH CHECK (auth.email() = primary_rep_email OR auth.email() = secondary_rep_email);

-- Policy 4: Allow admins to view all supplier records (if you have an admin role)
CREATE POLICY "Allow admins to view all suppliers"
  ON supplier
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy 5: Allow admins to update all supplier records
CREATE POLICY "Allow admins to update all suppliers"
  ON supplier
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
