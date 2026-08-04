"use server"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

export interface PRInboxItem {
  id: string
  pr_number: string
  project_name_arabic?: string
  project_name?: string
  department?: string
  budget_code_cost_centre?: string
  scope_of_work?: string
  purpose_and_justification?: string
  bill_of_quantity?: any[]
  preferred_vendors?: any[]
  technical_requirements?: string
  attachments?: any[]
  pr_status: string
  created_at: string
  requestor_name?: string
}

export async function fetchPurchaseRequisitionsForInbox(): Promise<PRInboxItem[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log("[v0] Fetching purchase requisitions for inbox from Supabase...")

    const { data, error } = await supabase
      .from("purchase_requisition")
      .select("*")
      .eq("pr_status", "submitted")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching PRs for inbox:", error)
      return []
    }

    console.log("[v0] Fetched PRs for inbox:", data?.length || 0)

    return (data || []) as PRInboxItem[]
  } catch (error) {
    console.error("[v0] Exception fetching PRs for inbox:", error)
    return []
  }
}
