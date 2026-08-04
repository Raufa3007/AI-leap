"use server"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTM4NjIsImV4cCI6MjA3NjU2OTg2Mn0.dy12fRXWz7JFpR5XT2bRIMDQWl8cR6WPEpCpHIBbKSA"

interface BillOfQuantityItem {
  material_group: string
  item_name: string
  quantity: number
  units_of_measure: string
  estimated_unit_price: string
  expected_delivery_date: string
}

interface Vendor {
  id: number
  name: string
}

interface RFPData {
  pr_number: string
  title: string
  rfp_id?: string
  linked_pr?: string
  department?: string
  category: string
  mode_of_tenor: string
  bid_closing_date: string
  expected_award_date: string
  purpose: string
  scope_of_work: string
  terms_and_conditions: string
  expected_submissions: string
  bill_of_quantity: BillOfQuantityItem[]
  vendors: Vendor[]
  attachments?: any[]
}

export async function saveRFPDraft(data: RFPData) {
  try {
    console.log("[v0] Saving RFP draft for pr_number:", data.pr_number)

    // Check if RFP already exists
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/rfp?pr_number=eq.${data.pr_number}&select=id,status`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text()
      console.error("[v0] Failed to check existing RFP:", errorText)
      throw new Error("Failed to check existing RFP")
    }

    const existingRFP = await checkResponse.json()
    console.log("[v0] Existing RFP check result:", existingRFP)

    // If exists and status is completed, don't allow updates
    if (existingRFP.length > 0 && existingRFP[0].status === "completed") {
      console.log("[v0] Cannot update completed RFP")
      return {
        success: false,
        error: "Cannot update a completed RFP",
      }
    }

    const rfpPayload = {
      pr_number: data.pr_number,
      title: data.title,
      rfp_id: data.rfp_id,
      linked_pr: data.linked_pr,
      department: data.department,
      category: data.category,
      mode_of_tenor: data.mode_of_tenor,
      bid_closing_date: data.bid_closing_date || null,
      expected_award_date: data.expected_award_date || null,
      purpose: data.purpose,
      scope_of_work: data.scope_of_work,
      terms_and_conditions: data.terms_and_conditions,
      expected_submissions: data.expected_submissions,
      bill_of_quantity: data.bill_of_quantity,
      vendors: data.vendors,
      attachments: data.attachments || [],
      status: "inprogress",
    }

    console.log("[v0] RFP payload:", rfpPayload)

    let response

    if (existingRFP.length > 0) {
      // Update existing draft
      console.log("[v0] Updating existing draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/rfp?pr_number=eq.${data.pr_number}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(rfpPayload),
      })
    } else {
      // Create new draft
      console.log("[v0] Creating new draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/rfp`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(rfpPayload),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to save RFP draft:", errorText)
      throw new Error(`Failed to save RFP draft: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] RFP draft saved successfully:", result)

    return {
      success: true,
      data: result,
      message: existingRFP.length > 0 ? "Draft updated successfully" : "Draft saved successfully",
    }
  } catch (error) {
    console.error("[v0] Error saving RFP draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    }
  }
}

export async function sendRFP(pr_number: string) {
  try {
    console.log("[v0] Sending RFP for pr_number:", pr_number)

    // Update status to completed and set sent_at timestamp
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rfp?pr_number=eq.${pr_number}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "completed",
        sent_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to send RFP:", errorText)
      throw new Error(`Failed to send RFP: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] RFP sent successfully:", result)

    return {
      success: true,
      data: result,
      message: "RFP sent successfully",
    }
  } catch (error) {
    console.error("[v0] Error sending RFP:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send RFP",
    }
  }
}

export async function loadRFPDraft(pr_number: string) {
  try {
    console.log("[v0] Loading RFP draft for pr_number:", pr_number)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rfp?pr_number=eq.${pr_number}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to load RFP draft:", errorText)
      throw new Error("Failed to load RFP draft")
    }

    const result = await response.json()
    console.log("[v0] RFP draft loaded:", result)

    if (result.length === 0) {
      console.log("[v0] No draft found")
      return {
        success: false,
        error: "No draft found",
      }
    }

    return {
      success: true,
      data: result[0],
    }
  } catch (error) {
    console.error("[v0] Error loading RFP draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load draft",
    }
  }
}
