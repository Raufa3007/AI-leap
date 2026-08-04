-- Create RFI (Request for Information) table
CREATE TABLE IF NOT EXISTS public.rfi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pr_number VARCHAR(50) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  scope_of_work TEXT,
  expected_deliverables TEXT,
  response_deadline DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  vendors JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'inprogress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  sent_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT rfi_status_check CHECK (status IN ('inprogress', 'completed')),
  CONSTRAINT rfi_priority_check CHECK (priority IN ('low', 'medium', 'high'))
);

-- Create index on pr_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_rfi_pr_number ON public.rfi(pr_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_rfi_status ON public.rfi(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rfi_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rfi_updated_at
  BEFORE UPDATE ON public.rfi
  FOR EACH ROW
  EXECUTE FUNCTION update_rfi_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.rfi ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.rfi
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE public.rfi IS 'Stores Request for Information (RFI) data with draft and completed states';
COMMENT ON COLUMN public.rfi.pr_number IS 'Purchase Requisition number - unique identifier';
COMMENT ON COLUMN public.rfi.status IS 'Status of RFI: inprogress (draft) or completed (sent)';
COMMENT ON COLUMN public.rfi.vendors IS 'JSON array of vendor objects';
COMMENT ON COLUMN public.rfi.attachments IS 'JSON array of attachment objects';
