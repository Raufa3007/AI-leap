"use server"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

export interface SupplierData {
  id: string
  company_name: string
  business_type: string
  country_of_operation: string
  date_of_incorporation: string
  cr_number: string
  cr_issue_date: string
  company_address: string
  industries_served: string
  primary_product_service_category: string
  brief_description: string
  number_of_employees: string
  office_locations: string
  annual_turnover: string
  created_at: string
  [key: string]: any
}

export async function fetchSuppliers(): Promise<SupplierData[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log("[v0] Fetching suppliers from Supabase...")

    const { data, error } = await supabase.from("supplier").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching suppliers:", error)
      return []
    }

    console.log("[v0] Fetched suppliers:", data?.length || 0)

    return (data || []) as SupplierData[]
  } catch (error) {
    console.error("[v0] Exception fetching suppliers:", error)
    return []
  }
}
