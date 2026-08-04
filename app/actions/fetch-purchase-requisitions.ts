"use server"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

interface PRData {
  projectName: string
  rfpNumber: string
  prNumber: string
  createdOn: string
  pendingWithUser: string
  status: "Draft" | "Completed" | "Submitted" | "Cancelled"
  sla: string
}

export async function fetchPurchaseRequisitions(): Promise<PRData[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log("[v0] Fetching purchase requisitions from Supabase...")

    const { data, error } = await supabase
      .from("purchase_requisition")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching PRs:", error)
      return []
    }

    console.log("[v0] Fetched PRs:", data?.length || 0)

    const transformedData: PRData[] = (data || []).map((pr: any) => {
      // Map database pr_status to display status
      let displayStatus: "Draft" | "Completed" | "Submitted" | "Cancelled" = "Submitted"
      if (pr.pr_status === "draft") {
        displayStatus = "Draft"
      } else if (pr.pr_status === "submitted") {
        displayStatus = "Submitted"
      } else if (pr.pr_status === "approved") {
        displayStatus = "Completed"
      }

      return {
        projectName: pr.project_name_arabic || pr.project_name || "N/A",
        rfpNumber: pr.pr_number || "N/A",
        prNumber: pr.pr_number || "–",
        createdOn: pr.created_at
          ? new Date(pr.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
          : "N/A",
        pendingWithUser: pr.requestor_name || "N/A",
        status: displayStatus,
        sla: "–",
      }
    })

    return transformedData
  } catch (error) {
    console.error("[v0] Exception fetching PRs:", error)
    return []
  }
}
