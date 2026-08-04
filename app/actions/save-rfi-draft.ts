"use server"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTM4NjIsImV4cCI6MjA3NjU2OTg2Mn0.dy12fRXWz7JFpR5XT2bRIMDQWl8cR6WPEpCpHIBbKSA"

interface Vendor {
  id: string
  name: string
  crNumber?: string
  companyType?: string
  primaryContact?: string
  email?: string
  contactNumber?: string
}

interface RFIData {
  pr_number: string
  title: string
  description: string
  scope_of_work: string
  expected_deliverables: string
  response_deadline: string
  priority: string
  vendors: Vendor[]
  attachments?: any[]
}

export async function saveRFIDraft(data: RFIData) {
  try {
    console.log("[v0] Saving RFI draft for pr_number:", data.pr_number)

    // Check if RFI already exists
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/rfi?pr_number=eq.${data.pr_number}&select=id,status`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text()
      console.error("[v0] Failed to check existing RFI:", errorText)
      throw new Error("Failed to check existing RFI")
    }

    const existingRFI = await checkResponse.json()
    console.log("[v0] Existing RFI check result:", existingRFI)

    // If exists and status is completed, don't allow updates
    if (existingRFI.length > 0 && existingRFI[0].status === "completed") {
      console.log("[v0] Cannot update completed RFI")
      return {
        success: false,
        error: "Cannot update a completed RFI",
      }
    }

    const rfiPayload = {
      pr_number: data.pr_number,
      title: data.title,
      description: data.description,
      scope_of_work: data.scope_of_work,
      expected_deliverables: data.expected_deliverables,
      response_deadline: data.response_deadline,
      priority: data.priority,
      vendors: data.vendors,
      attachments: data.attachments || [],
      status: "inprogress",
    }

    console.log("[v0] RFI payload:", rfiPayload)

    let response

    if (existingRFI.length > 0) {
      // Update existing draft
      console.log("[v0] Updating existing draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/rfi?pr_number=eq.${data.pr_number}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(rfiPayload),
      })
    } else {
      // Create new draft
      console.log("[v0] Creating new draft")
      response = await fetch(`${SUPABASE_URL}/rest/v1/rfi`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(rfiPayload),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to save RFI draft:", errorText)
      throw new Error(`Failed to save RFI draft: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] RFI draft saved successfully:", result)

    return {
      success: true,
      data: result,
      message: existingRFI.length > 0 ? "Draft updated successfully" : "Draft saved successfully",
    }
  } catch (error) {
    console.error("[v0] Error saving RFI draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    }
  }
}

export async function sendRFI(pr_number: string) {
  try {
    console.log("[v0] Sending RFI for pr_number:", pr_number)

    // Update status to completed and set sent_at timestamp
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rfi?pr_number=eq.${pr_number}`, {
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
      console.error("[v0] Failed to send RFI:", errorText)
      throw new Error(`Failed to send RFI: ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] RFI sent successfully:", result)

    return {
      success: true,
      data: result,
      message: "RFI sent successfully",
    }
  } catch (error) {
    console.error("[v0] Error sending RFI:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send RFI",
    }
  }
}

export async function loadRFIDraft(pr_number: string) {
  try {
    console.log("[v0] Loading RFI draft for pr_number:", pr_number)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rfi?pr_number=eq.${pr_number}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to load RFI draft:", errorText)
      throw new Error("Failed to load RFI draft")
    }

    const result = await response.json()
    console.log("[v0] RFI draft loaded:", result)

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
    console.error("[v0] Error loading RFI draft:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load draft",
    }
  }
}
