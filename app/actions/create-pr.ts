"use server"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

interface PRFormData {
  pr_number: string
  department: string
  budget_code_cost_centre: string
  project_name_arabic: string
  requestor_name: string
  requestor_contact_details: string
  requested_date: string
  scope_of_work: string
  purpose_and_justification: string
  business_impact_expected_outcome: string
  preferred_vendors: Array<{ name: string; email?: string; phone?: string; cr_number?: string }>
  bill_of_quantity: Array<{
    material_group: string
    item_name: string
    delivery_date: string
    quantity: string
    unit_of_measure: string
    unit_price: string
    description: string
  }>
  checklist_project_in_procurement_plan: boolean
  checklist_team_specifications_mentioned: boolean
  checklist_supplier_coordinator_details: boolean
  checklist_sample_receiver_details: boolean
  checklist_scope_similar_to_existing_contract: boolean
  checklist_limited_tender_companies_listed: boolean
}

export async function createPR(data: PRFormData) {
  try {
    console.log("[v0] Creating PR with data:", data)

    // Validate required fields
    if (!data.pr_number) {
      return { success: false, error: "PR Number is required" }
    }
    if (!data.department) {
      return { success: false, error: "Department is required" }
    }
    if (!data.requestor_name) {
      return { success: false, error: "Requestor name is required" }
    }
    if (!data.requested_date) {
      return { success: false, error: "Requested date is required" }
    }
    if (data.preferred_vendors.length === 0) {
      return { success: false, error: "At least one vendor is required" }
    }

    // Check for duplicate PR number
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/purchase_requisition?pr_number=eq.${data.pr_number}&select=id`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
        },
      },
    )

    if (!checkResponse.ok) {
      console.log("[v0] Error checking duplicate PR:", checkResponse.status)
    } else {
      const existingPRs = await checkResponse.json()
      if (existingPRs.length > 0) {
        return { success: false, error: "PR Number already exists" }
      }
    }

    // Insert PR data
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/purchase_requisition`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        pr_number: data.pr_number,
        department: data.department,
        budget_code_cost_centre: data.budget_code_cost_centre,
        project_name_arabic: data.project_name_arabic,
        requestor_name: data.requestor_name,
        requestor_contact_details: data.requestor_contact_details,
        requested_date: data.requested_date,
        scope_of_work: data.scope_of_work,
        purpose_and_justification: data.purpose_and_justification,
        business_impact_expected_outcome: data.business_impact_expected_outcome,
        preferred_vendors: data.preferred_vendors,
        bill_of_quantity: data.bill_of_quantity,
        checklist_project_in_procurement_plan: data.checklist_project_in_procurement_plan,
        checklist_team_specifications_mentioned: data.checklist_team_specifications_mentioned,
        checklist_supplier_coordinator_details: data.checklist_supplier_coordinator_details,
        checklist_sample_receiver_details: data.checklist_sample_receiver_details,
        checklist_scope_similar_to_existing_contract: data.checklist_scope_similar_to_existing_contract,
        checklist_limited_tender_companies_listed: data.checklist_limited_tender_companies_listed,
      }),
    })

    if (!insertResponse.ok) {
      const errorData = await insertResponse.json()
      console.log("[v0] Supabase insert error:", errorData)
      return { success: false, error: errorData.message || "Failed to create PR" }
    }

    const result = await insertResponse.json()
    console.log("[v0] PR created successfully:", result)

    return {
      success: true,
      message: "PR created successfully",
      data: result[0],
    }
  } catch (error) {
    console.log("[v0] Error creating PR:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while creating PR",
    }
  }
}
