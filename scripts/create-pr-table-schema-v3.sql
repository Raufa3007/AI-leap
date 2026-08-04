-- Purchase Requisition (PR) Table Schema
-- Comprehensive schema for storing all PR details with meaningful column names

CREATE TABLE IF NOT EXISTS public.purchase_requisition (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- PR Details Section
  pr_number VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(255),
  budget_code_cost_centre VARCHAR(100) NOT NULL,
  project_name_arabic VARCHAR(500) NOT NULL,
  requestor_name VARCHAR(255),
  requestor_contact_details VARCHAR(255),
  requested_date TIMESTAMP DEFAULT NOW(),
  
  -- Scope of Work Section
  scope_of_work TEXT,
  
  -- Purpose & Justification Section
  purpose_and_justification TEXT,
  
  -- Business Impact Section
  business_impact_expected_outcome TEXT,
  
  -- Vendors Section (Array of vendor objects)
  preferred_vendors JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Structure: [{ vendor_name: string, vendor_email: string, vendor_phone: string, vendor_cr_number: string }, ...]
  
  -- Procurement Checklist Section (Meaningful boolean columns)
  checklist_project_in_procurement_plan BOOLEAN DEFAULT FALSE,
  checklist_team_specifications_mentioned BOOLEAN DEFAULT FALSE,
  checklist_supplier_coordinator_details BOOLEAN DEFAULT FALSE,
  checklist_sample_receiver_details BOOLEAN DEFAULT FALSE,
  checklist_scope_similar_to_existing_contract BOOLEAN DEFAULT FALSE,
  checklist_limited_tender_companies_listed BOOLEAN DEFAULT FALSE,
  
  -- Bill of Quantity Section (Array of line items)
  bill_of_quantity JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Structure: [{ material_group: string, item_name: string, expected_delivery_date: date, quantity: number, unit_of_measure: string, estimated_unit_price: number, item_description: string }, ...]
  
  -- Technical Committee Members Section
  technical_committee_members JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ member_name: string, member_email: string, member_phone: string, member_role: string }, ...]
  
  -- Technical Requirements Section
  technical_requirements TEXT,
  
  -- Technical Evaluation Criteria Section
  technical_evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ criteria_name: string, weightage: number }, ...]
  
  -- Vendor Evaluation Weightage Section
  vendor_evaluation_weightage JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ vendor_name: string, score: number, evaluation_date: date }, ...]
  
  -- Man Power Section
  man_power_requirements JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ resource_type: string, quantity: number, skill_level: string }, ...]
  
  -- Attachments Section
  attachments JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ file_name: string, file_url: string, file_size: number, upload_date: date }, ...]
  
  -- Status & Approval Workflow
  pr_status VARCHAR(50) DEFAULT 'draft',
  -- Values: 'draft', 'submitted', 'under_review', 'approved', 'rejected', 'in_procurement'
  
  assigned_approvers JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ approver_name: string, approver_email: string, approval_status: string, approval_date: date }, ...]
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  
  -- Metadata
  created_by UUID,
  updated_by UUID
);

-- Create indexes with IF NOT EXISTS to avoid duplicate index errors
CREATE INDEX IF NOT EXISTS idx_pr_number ON public.purchase_requisition(pr_number);
CREATE INDEX IF NOT EXISTS idx_pr_status ON public.purchase_requisition(pr_status);
CREATE INDEX IF NOT EXISTS idx_department ON public.purchase_requisition(department);
CREATE INDEX IF NOT EXISTS idx_created_at ON public.purchase_requisition(created_at);
CREATE INDEX IF NOT EXISTS idx_requested_date ON public.purchase_requisition(requested_date);

-- Enable Row Level Security
ALTER TABLE public.purchase_requisition ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy with IF NOT EXISTS to avoid duplicate policy errors
DROP POLICY IF EXISTS purchase_requisition_policy ON public.purchase_requisition;
CREATE POLICY purchase_requisition_policy ON public.purchase_requisition
  AS PERMISSIVE
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS purchase_requisition_timestamp_trigger ON public.purchase_requisition;
CREATE OR REPLACE FUNCTION update_purchase_requisition_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_requisition_timestamp_trigger
BEFORE UPDATE ON public.purchase_requisition
FOR EACH ROW
EXECUTE FUNCTION update_purchase_requisition_timestamp();
