"use server"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

export async function fetchPRDetails(prId: string) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log("[v0] Fetching PR details for:", prId)

    // First try to find by ID (UUID format)
    let { data, error } = await supabase.from("purchase_requisition").select("*").eq("id", prId).maybeSingle()

    // If not found by ID, try by PR number
    if (!data && !error) {
      console.log("[v0] Not found by ID, trying PR number...")
      const result = await supabase.from("purchase_requisition").select("*").eq("pr_number", prId).maybeSingle()
      data = result.data
      error = result.error
    }

    if (error) {
      console.error("[v0] Error fetching PR details:", error)
      return null
    }

    if (!data) {
      console.log("[v0] No PR found with ID or PR number:", prId)
      return null
    }

    console.log("[v0] Fetched PR details successfully:", data.pr_number)

    return data
  } catch (error) {
    console.error("[v0] Exception fetching PR details:", error)
    return null
  }
}
