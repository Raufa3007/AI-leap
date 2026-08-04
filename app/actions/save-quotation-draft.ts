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
  id: string
  name: string
}

interface QuotationData {
  pr_number: string
  title: string
  quotation_id?: string
  linked_rfp?: string
  department?: string
  category: string
  mode_of_tenor: string
  bid_closing_date: string
  expected_award_date: string
  purpose: string
  scope_of_work: string
  bill_of_quantity: BillOfQuantityItem[]
  terms_and_conditions: string
  expected_submissions: string
  vendors: Vendor[]
  attachments?: any[]
}

export async function saveQuotationDraft(data: QuotationData) {
  try {
    console.log("[v0] Saving Quotation draft for pr_number:", data.pr_number)

    // Check if Quotation already exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/quotation?pr_number=eq.${data.pr_number}&select=id,status`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    )

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text()
      console.error("[v0] Failed to check existing Quotation:", errorText)
      throw new Error("Failed to check existing Quotation")
    }

    const existingQuotation = await checkResponse.json()
    console.log("[v0] Existing Quotation check result:", existingQuotation)

    // If exists and status is completed, don't allow updates
    if (existingQuotation.length > 0 && existingQuotation[0].status === "completed") {
      console.log("[v0] Cannot update completed Quotation")
      return {
        success: false,
        error: "Cannot update a completed Quotation",
      }
    }

    const quotationPayload = {
      pr_number: data.pr_number,
      title: data.title,
      quotation_id: data.quotation_id,
      linked_rfp: data.linked_rfp,
      department: data.department,
      category: data.category,
      mode_of_tenor: data.mode_of_tenor,
      bid_closing_date: data.bid_closing_date || null,
      expected_award_date: data.expected_award_date || null,
      purpose: data.purpose,
      scope_of_work: data.scope_of_work,
      bill_of_quantity: data.bill_of_quantity,
      terms_and_conditions: data.terms_and_conditions,
      expected_submissions: data.expected_submissions,
      vendors: data.vendors,
      attachments: data.attachments || [],
      status: "inprogress",
    }

    console.log("[v0] Quotation payload:", quotationPayload)

    let response

    if (existingQuotation.length > 0) {
      // Update existing draft
      console.log("[v0] Updating existing draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/quotation?pr_number=eq.${data.pr_number}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(quotationPayload),
      })
    } else {
      // Create new draft
      console.log("[v0] Creating new draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/quotation`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(quotationPayload),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to save Quotation draft:", errorText)
      throw new Error(`Failed to save Quotation draft: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] Quotation draft saved successfully:", result)

    return {
      success: true,
      data: result,
      message: existingQuotation.length > 0 ? "Draft updated successfully" : "Draft saved successfully",
    }
  } catch (error) {
    console.error("[v0] Error saving Quotation draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    }
  }
}

export async function sendQuotation(pr_number: string) {
  try {
    console.log("[v0] Sending Quotation for pr_number:", pr_number)

    // Update status to completed and set sent_at timestamp
    const response = await fetch(`${SUPABASE_URL}/rest/v1/quotation?pr_number=eq.${pr_number}`, {
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
      console.error("[v0] Failed to send Quotation:", errorText)
      throw new Error(`Failed to send Quotation: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] Quotation sent successfully:", result)

    return {
      success: true,
      data: result,
      message: "Quotation sent successfully",
    }
  } catch (error) {
    console.error("[v0] Error sending Quotation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send Quotation",
    }
  }
}

export async function loadQuotationDraft(pr_number: string) {
  try {
    console.log("[v0] Loading Quotation draft for pr_number:", pr_number)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/quotation?pr_number=eq.${pr_number}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to load Quotation draft:", errorText)
      throw new Error("Failed to load Quotation draft")
    }

    const result = await response.json()
    console.log("[v0] Quotation draft loaded:", result)

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
    console.error("[v0] Error loading Quotation draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load draft",
    }
  }
}
