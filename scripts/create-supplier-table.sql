-- Create supplier table with comprehensive schema for all registration details
CREATE TABLE IF NOT EXISTS supplier (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Step 1: Company Information
  company_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  country_of_operation VARCHAR(100),
  date_of_incorporation DATE,
  cr_number VARCHAR(100) UNIQUE,
  cr_issue_date DATE,
  
  -- Company Address
  company_address_line1 VARCHAR(255) NOT NULL,
  company_address_line2 VARCHAR(255),
  company_city VARCHAR(100) NOT NULL,
  company_postal_code VARCHAR(20) NOT NULL,
  
  -- Operational Address
  operational_address_line1 VARCHAR(255),
  operational_address_line2 VARCHAR(255),
  operational_city VARCHAR(100),
  operational_postal_code VARCHAR(20),
  same_as_company_address BOOLEAN DEFAULT FALSE,
  
  -- Step 2: Products & Services
  industries_served VARCHAR(255),
  product_service_1_category VARCHAR(100),
  product_service_1_description TEXT,
  product_service_2_category VARCHAR(100),
  product_service_2_description TEXT,
  differentiators TEXT,
  portfolio_files JSONB, -- Array of file objects {name, size, uploadedDate, preview}
  
  -- Step 3: Business Capability & Operations
  number_of_employees VARCHAR(50),
  office_locations VARCHAR(100),
  annual_turnover VARCHAR(100),
  capacity_to_deliver TEXT,
  existing_clients TEXT,
  
  -- Step 4: Primary Representative
  primary_rep_first_name VARCHAR(100) NOT NULL,
  primary_rep_last_name VARCHAR(100) NOT NULL,
  primary_rep_phone VARCHAR(20) NOT NULL,
  primary_rep_phone_code VARCHAR(10) DEFAULT '+966',
  primary_rep_email VARCHAR(255) NOT NULL UNIQUE,
  primary_rep_relationship VARCHAR(100),
  primary_rep_nationality VARCHAR(100),
  
  -- Step 4: Secondary Representative
  secondary_rep_first_name VARCHAR(100),
  secondary_rep_last_name VARCHAR(100),
  secondary_rep_phone VARCHAR(20),
  secondary_rep_phone_code VARCHAR(10) DEFAULT '+966',
  secondary_rep_email VARCHAR(255),
  secondary_rep_relationship VARCHAR(100),
  secondary_rep_nationality VARCHAR(100),
  
  -- Step 5: Documents
  business_registration_doc JSONB, -- {name, size, uploadedDate}
  director_id_proof_doc JSONB,
  quality_certifications_doc JSONB,
  industry_specific_certifications_doc JSONB,
  proof_of_past_work_doc JSONB,
  organizational_chart_doc JSONB,
  
  -- Step 6: Verification & Account
  password_hash VARCHAR(255),
  otp_verified BOOLEAN DEFAULT FALSE,
  
  -- Status & Timestamps
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, active
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for better query performance
  CONSTRAINT valid_email CHECK (primary_rep_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_supplier_cr_number ON supplier(cr_number);
CREATE INDEX idx_supplier_primary_rep_email ON supplier(primary_rep_email);
CREATE INDEX idx_supplier_status ON supplier(status);
CREATE INDEX idx_supplier_created_at ON supplier(created_at);
CREATE INDEX idx_supplier_company_name ON supplier(company_name);

-- Create updated_at trigger to automatically update timestamp
CREATE OR REPLACE FUNCTION update_supplier_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supplier_updated_at_trigger
BEFORE UPDATE ON supplier
FOR EACH ROW
EXECUTE FUNCTION update_supplier_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE supplier ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own supplier record
CREATE POLICY "Users can view their own supplier record"
  ON supplier
  FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

-- Policy: Users can update their own supplier record
CREATE POLICY "Users can update their own supplier record"
  ON supplier
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Policy: Admins can view all supplier records
CREATE POLICY "Admins can view all supplier records"
  ON supplier
  FOR SELECT
  USING (auth.role() = 'admin');
