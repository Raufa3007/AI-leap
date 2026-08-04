-- Create Purchase Requisition (PR) Table with comprehensive schema
CREATE TABLE IF NOT EXISTS public.pr (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- PR Details Section
  pr_number VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(255) NOT NULL,
  budget_code VARCHAR(100) NOT NULL,
  project_name_arabic VARCHAR(500) NOT NULL,
  requestor_name VARCHAR(255) NOT NULL,
  requestor_contact VARCHAR(255),
  requested_date TIMESTAMP DEFAULT NOW(),
  
  -- Scope of Work Section
  scope_of_work TEXT,
  
  -- Purpose & Justification Section
  purpose_justification TEXT,
  
  -- Business Impact Section
  business_impact TEXT,
  
  -- Vendors Section (Array of vendor objects)
  vendors JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "name": "Vendor Name",
  --     "email": "vendor@example.com",
  --     "phone": "+971XXXXXXXXX",
  --     "cr_number": "123456"
  --   }
  -- ]
  
  -- Procurement Checklist Section (Boolean values for each checklist item)
  checklist_item_1 BOOLEAN DEFAULT FALSE,
  -- Is this project included as per procurement planning?
  
  checklist_item_2 BOOLEAN DEFAULT FALSE,
  -- Were the specifications of the team work mentioned?
  
  checklist_item_3 BOOLEAN DEFAULT FALSE,
  -- Has the data of the person concerned with coordinating with suppliers been written down?
  
  checklist_item_4 BOOLEAN DEFAULT FALSE,
  -- Has the information of the person concerned with receiving samples been written down?
  
  checklist_item_5 BOOLEAN DEFAULT FALSE,
  -- Is the scope of work similar to existing contract scope?
  
  checklist_item_6 BOOLEAN DEFAULT FALSE,
  -- The names of companies summoned in limited tender with commercial registration numbers
  
  -- Bill of Quantity Section (Array of line items)
  bill_of_quantity JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "material_group": "Electronics",
  --     "item_name": "Item Name",
  --     "expected_delivery_date": "2025-12-31",
  --     "quantity": "100",
  --     "unit_of_measure": "Pieces",
  --     "estimated_unit_price": "50.00",
  --     "description": "Item description"
  --   }
  -- ]
  
  -- Technical Committee Members Section (Array of members)
  technical_committee_members JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "name": "Member Name",
  --     "email": "member@example.com",
  --     "role": "Lead"
  --   }
  -- ]
  
  -- Technical Requirements Section
  technical_requirements TEXT,
  
  -- Technical Evaluation Criteria Section (Array of criteria)
  technical_evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "criteria": "Criteria Name",
  --     "weightage": 25,
  --     "description": "Criteria description"
  --   }
  -- ]
  
  -- Vendor Evaluation Weightage Section (Array of weightage items)
  vendor_evaluation_weightage JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "criteria": "Price",
  --     "weightage": 40
  --   }
  -- ]
  
  -- Man Power Section (Array of man power requirements)
  man_power JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "designation": "Engineer",
  --     "quantity": 5,
  --     "duration_days": 30
  --   }
  -- ]
  
  -- Attachments Section (Array of file objects)
  attachments JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "file_name": "document.pdf",
  --     "file_url": "https://...",
  --     "file_size": 1024,
  --     "uploaded_at": "2025-01-01T00:00:00Z"
  --   }
  -- ]
  
  -- Status and Metadata
  status VARCHAR(50) DEFAULT 'draft',
  -- Possible values: 'draft', 'submitted', 'approved', 'rejected', 'in_progress', 'completed'
  
  approvers JSONB DEFAULT '[]'::jsonb,
  -- Structure: [
  --   {
  --     "id": 1,
  --     "name": "Approver Name",
  --     "email": "approver@example.com",
  --     "status": "pending",
  --     "approved_at": null
  --   }
  -- ]
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  
  -- Additional metadata
  created_by UUID,
  updated_by UUID,
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_pr_number ON public.pr(pr_number);
CREATE INDEX idx_department ON public.pr(department);
CREATE INDEX idx_status ON public.pr(status);
CREATE INDEX idx_created_at ON public.pr(created_at);
CREATE INDEX idx_requested_date ON public.pr(requested_date);
CREATE INDEX idx_requestor_name ON public.pr(requestor_name);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_pr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pr_updated_at_trigger
BEFORE UPDATE ON public.pr
FOR EACH ROW
EXECUTE FUNCTION update_pr_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.pr ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy: Allow all operations (as per your existing policy)
CREATE POLICY "pr_all_operations" ON public.pr
  AS PERMISSIVE
  FOR ALL
  USING (true)
  WITH CHECK (true);
