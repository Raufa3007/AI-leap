-- Create RFP (Request for Proposal) table for storing RFP drafts and sent RFPs
CREATE TABLE IF NOT EXISTS public.rfp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pr_number TEXT UNIQUE NOT NULL,
  
  -- Basic Information
  title TEXT NOT NULL,
  rfp_id TEXT,
  linked_pr TEXT,
  department TEXT,
  category TEXT,
  mode_of_tenor TEXT,
  
  -- Timeline
  bid_closing_date TIMESTAMPTZ,
  expected_award_date DATE,
  
  -- Scope
  purpose TEXT,
  scope_of_work TEXT,
  terms_and_conditions TEXT,
  expected_submissions TEXT,
  
  -- Bill of Quantity
  bill_of_quantity JSONB DEFAULT '[]'::jsonb,
  
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
  CONSTRAINT rfp_pr_number_key UNIQUE (pr_number)
);

-- Create index on pr_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_rfp_pr_number ON public.rfp(pr_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_rfp_status ON public.rfp(status);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rfp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rfp_updated_at_trigger
  BEFORE UPDATE ON public.rfp
  FOR EACH ROW
  EXECUTE FUNCTION update_rfp_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.rfp ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.rfp
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE public.rfp IS 'Stores Request for Proposal (RFP) data with draft and completed states';
COMMENT ON COLUMN public.rfp.pr_number IS 'Purchase Requisition number - unique identifier';
COMMENT ON COLUMN public.rfp.status IS 'Status of RFP: inprogress (draft) or completed (sent)';
COMMENT ON COLUMN public.rfp.vendors IS 'JSON array of vendor objects';
COMMENT ON COLUMN public.rfp.bill_of_quantity IS 'JSON array of bill of quantity items';
COMMENT ON COLUMN public.rfp.attachments IS 'JSON array of attachment objects';
