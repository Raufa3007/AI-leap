-- Create purchase_requisition table with draft functionality support
CREATE TABLE IF NOT EXISTS public.purchase_requisition (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pr_number character varying(50) NOT NULL,
  department character varying(255) NULL,
  budget_code_cost_centre character varying(100) NOT NULL,
  project_name_arabic character varying(500) NOT NULL,
  requestor_name character varying(255) NULL,
  requestor_contact_details character varying(255) NULL,
  requested_date timestamp without time zone NULL DEFAULT now(),
  scope_of_work text NULL,
  purpose_and_justification text NULL,
  business_impact_expected_outcome text NULL,
  preferred_vendors jsonb NOT NULL DEFAULT '[]'::jsonb,
  checklist_project_in_procurement_plan boolean NULL DEFAULT false,
  checklist_team_specifications_mentioned boolean NULL DEFAULT false,
  checklist_supplier_coordinator_details boolean NULL DEFAULT false,
  checklist_sample_receiver_details boolean NULL DEFAULT false,
  checklist_scope_similar_to_existing_contract boolean NULL DEFAULT false,
  checklist_limited_tender_companies_listed boolean NULL DEFAULT false,
  bill_of_quantity jsonb NOT NULL DEFAULT '[]'::jsonb,
  technical_committee_members jsonb NULL DEFAULT '[]'::jsonb,
  technical_requirements text NULL,
  technical_evaluation_criteria jsonb NULL DEFAULT '[]'::jsonb,
  vendor_evaluation_weightage jsonb NULL DEFAULT '[]'::jsonb,
  man_power_requirements jsonb NULL DEFAULT '[]'::jsonb,
  attachments jsonb NULL DEFAULT '[]'::jsonb,
  pr_status character varying(50) NULL DEFAULT 'draft'::character varying,
  assigned_approvers jsonb NULL DEFAULT '[]'::jsonb,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  submitted_at timestamp without time zone NULL,
  approved_at timestamp without time zone NULL,
  created_by uuid NULL,
  updated_by uuid NULL,
  CONSTRAINT purchase_requisition_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_requisition_pr_number_key UNIQUE (pr_number)
) TABLESPACE pg_default;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_pr_number ON public.purchase_requisition USING btree (pr_number) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_pr_status ON public.purchase_requisition USING btree (pr_status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_department ON public.purchase_requisition USING btree (department) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_created_at ON public.purchase_requisition USING btree (created_at) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_requested_date ON public.purchase_requisition USING btree (requested_date) TABLESPACE pg_default;

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_purchase_requisition_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the timestamp update function
DROP TRIGGER IF EXISTS purchase_requisition_timestamp_trigger ON public.purchase_requisition;
CREATE TRIGGER purchase_requisition_timestamp_trigger
  BEFORE UPDATE ON public.purchase_requisition
  FOR EACH ROW
  EXECUTE FUNCTION update_purchase_requisition_timestamp();

-- Add comments for documentation
COMMENT ON TABLE public.purchase_requisition IS 'Stores purchase requisition data with draft and submission support';
COMMENT ON COLUMN public.purchase_requisition.pr_status IS 'Status of the PR: draft, submitted, approved, rejected';
COMMENT ON COLUMN public.purchase_requisition.submitted_at IS 'Timestamp when PR was submitted (moved from draft to submitted)';
COMMENT ON COLUMN public.purchase_requisition.approved_at IS 'Timestamp when PR was approved';
