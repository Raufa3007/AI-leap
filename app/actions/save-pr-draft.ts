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

function cleanPRData(data: any) {
  const cleaned: any = {}

  for (const [key, value] of Object.entries(data)) {
    // Convert empty strings to null for date/timestamp fields
    if ((key.includes("date") || key.includes("_at")) && (value === "" || value === null || value === undefined)) {
      cleaned[key] = null
    }
    // Keep non-empty values as is
    else if (value !== "" && value !== undefined) {
      cleaned[key] = value
    }
    // For empty strings in non-date fields, keep them as empty strings
    else if (value === "") {
      cleaned[key] = value
    }
  }

  return cleaned
}

export async function savePRDraft(data: PRFormData) {
  try {
    console.log("[v0] Saving PR draft for pr_number:", data.pr_number)

    // Check if PR already exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/purchase_requisition?pr_number=eq.${data.pr_number}&select=id,pr_status`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
        },
      },
    )

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text()
      console.error("[v0] Failed to check existing PR:", errorText)
      throw new Error("Failed to check existing PR")
    }

    const existingPR = await checkResponse.json()
    console.log("[v0] Existing PR check result:", existingPR)

    // If exists and status is submitted, don't allow updates
    if (existingPR.length > 0 && existingPR[0].pr_status === "submitted") {
      console.log("[v0] Cannot update submitted PR")
      return {
        success: false,
        error: "Cannot update a submitted PR",
      }
    }

    const prPayload = cleanPRData({
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
      pr_status: "draft",
    })

    console.log("[v0] PR payload:", prPayload)

    let response

    if (existingPR.length > 0) {
      // Update existing draft
      console.log("[v0] Updating existing draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/purchase_requisition?pr_number=eq.${data.pr_number}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Prefer: "return=representation",
        },
        body: JSON.stringify(prPayload),
      })
    } else {
      // Create new draft
      console.log("[v0] Creating new draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/purchase_requisition`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Prefer: "return=representation",
        },
        body: JSON.stringify(prPayload),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to save PR draft:", errorText)
      throw new Error(`Failed to save PR draft: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] PR draft saved successfully:", result)

    return {
      success: true,
      data: result,
      message: existingPR.length > 0 ? "Draft updated successfully" : "Draft saved successfully",
    }
  } catch (error) {
    console.error("[v0] Error saving PR draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    }
  }
}

export async function submitPR(pr_number: string) {
  try {
    console.log("[v0] Submitting PR for pr_number:", pr_number)

    // Update status to submitted and set submitted_at timestamp
    const response = await fetch(`${SUPABASE_URL}/rest/v1/purchase_requisition?pr_number=eq.${pr_number}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        pr_status: "submitted",
        submitted_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to submit PR:", errorText)
      throw new Error(`Failed to submit PR: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] PR submitted successfully:", result)

    return {
      success: true,
      data: result,
      message: "PR submitted successfully",
    }
  } catch (error) {
    console.error("[v0] Error submitting PR:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit PR",
    }
  }
}

export async function loadPRDraft(pr_number: string) {
  try {
    console.log("[v0] Loading PR draft for pr_number:", pr_number)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/purchase_requisition?pr_number=eq.${pr_number}`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to load PR draft:", errorText)
      throw new Error("Failed to load PR draft")
    }

    const result = await response.json()
    console.log("[v0] PR draft loaded:", result)

    if (result.length === 0) {
      console.log("[v0] No PR found")
      return {
        success: false,
        error: "No PR found",
      }
    }

    return {
      success: true,
      data: result[0],
    }
  } catch (error) {
    console.error("[v0] Error loading PR draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load draft",
    }
  }
}
