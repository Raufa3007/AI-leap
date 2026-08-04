-- Committee Assignments Table
-- Single table to store all committee app data
-- Copy and paste this entire script into Supabase SQL Editor

CREATE TABLE IF NOT EXISTS committee_assignments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- RFP Reference Information
  rfp_id TEXT NOT NULL,
  pr_reference TEXT NOT NULL,
  bid_closing_date TIMESTAMP WITH TIME ZONE,
  technical_bids_count INTEGER DEFAULT 0,
  commercial_bids_count INTEGER DEFAULT 0,
  bid_type TEXT,
  
  -- Committee Members (stored as JSON arrays)
  technical_committee JSONB DEFAULT '[]'::jsonb,
  -- Example structure: [{"id": "1", "name": "John Doe", "role": "Chairman", "initials": "JD", "evaluationsDone": 5}]
  
  commercial_committee JSONB DEFAULT '[]'::jsonb,
  -- Example structure: [{"id": "1", "name": "Jane Smith", "role": "Member", "initials": "JS", "evaluationsDone": 3}]
  
  -- Evaluation Criteria (stored as JSON arrays)
  technical_criteria JSONB DEFAULT '[]'::jsonb,
  -- Example structure: [{"question": "Technical expertise", "score": 85}]
  
  commercial_criteria JSONB DEFAULT '[]'::jsonb,
  -- Example structure: [{"question": "Price competitiveness", "score": 90}]
  
  -- Decision and Notes
  decision TEXT,
  notes TEXT,
  
  -- Status for view/edit mode (default: edit)
  status TEXT DEFAULT 'edit' CHECK (status IN ('edit', 'view')),
  
  -- Metadata
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_committee_rfp_id ON committee_assignments(rfp_id);
CREATE INDEX IF NOT EXISTS idx_committee_status ON committee_assignments(status);
CREATE INDEX IF NOT EXISTS idx_committee_created_at ON committee_assignments(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_committee_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_committee_timestamp
  BEFORE UPDATE ON committee_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_committee_updated_at();

-- Add comment to table
COMMENT ON TABLE committee_assignments IS 'Stores all committee app data including members, evaluation criteria, and decisions';
COMMENT ON COLUMN committee_assignments.status IS 'Controls view/edit mode: edit (default) or view';
COMMENT ON COLUMN committee_assignments.technical_committee IS 'Array of technical committee members with their details';
COMMENT ON COLUMN committee_assignments.commercial_committee IS 'Array of commercial committee members with their details';
COMMENT ON COLUMN committee_assignments.technical_criteria IS 'Array of technical evaluation criteria and scores';
COMMENT ON COLUMN committee_assignments.commercial_criteria IS 'Array of commercial evaluation criteria and scores';
