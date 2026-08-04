"use server"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

export interface SupplierDetailData {
  id: string
  company_name: string
  business_type: string
  country_of_operation: string
  date_of_incorporation: string
  cr_number: string
  cr_issue_date: string
  company_address_line1: string
  company_address_line2: string
  company_city: string
  company_postal_code: string
  industries_served: string
  product_service_1_category: string
  product_service_1_description: string
  product_service_2_category: string
  product_service_2_description: string
  differentiators: string
  portfolio_files: any
  number_of_employees: string
  office_locations: string
  annual_turnover: string
  capacity_to_deliver: string
  existing_clients: string
  status: string
  [key: string]: any
}

export async function fetchSupplierByName(companyName: string): Promise<SupplierDetailData | null> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log("[v0] Fetching supplier by company name:", companyName)

    const { data, error } = await supabase.from("supplier").select("*").eq("company_name", companyName).single()

    if (error) {
      console.error("[v0] Error fetching supplier:", error)
      return null
    }

    console.log("[v0] Fetched supplier:", data?.company_name)

    return data as SupplierDetailData
  } catch (error) {
    console.error("[v0] Exception fetching supplier:", error)
    return null
  }
}
