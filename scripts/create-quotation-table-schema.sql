-- Create quotation table for storing quotation drafts and sent quotations
CREATE TABLE IF NOT EXISTS quotation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pr_number TEXT UNIQUE NOT NULL,
  
  -- Basic Information
  title TEXT NOT NULL,
  quotation_id TEXT,
  linked_rfp TEXT,
  department TEXT,
  category TEXT,
  mode_of_tenor TEXT,
  
  -- Timeline
  bid_closing_date TIMESTAMPTZ,
  expected_award_date DATE,
  
  -- Scope
  purpose TEXT,
  scope_of_work TEXT,
  
  -- Bill of Quantity
  bill_of_quantity JSONB DEFAULT '[]'::jsonb,
  
  -- Terms & Conditions
  terms_and_conditions TEXT,
  expected_submissions TEXT,
  
  -- Vendors
  vendors JSONB DEFAULT '[]'::jsonb,
  
  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'inprogress' CHECK (status IN ('inprogress', 'completed')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  
  -- Indexes for performance
  CONSTRAINT quotation_pr_number_key UNIQUE (pr_number)
);

-- Create index on pr_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_quotation_pr_number ON quotation(pr_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_quotation_status ON quotation(status);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotation_updated_at_trigger
  BEFORE UPDATE ON quotation
  FOR EACH ROW
  EXECUTE FUNCTION update_quotation_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE quotation ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON quotation
  FOR ALL
  USING (true)
  WITH CHECK (true);
