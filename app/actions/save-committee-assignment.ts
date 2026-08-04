"use server"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTM4NjIsImV4cCI6MjA3NjU2OTg2Mn0.dy12fRXWz7JFpR5XT2bRIMDQWl8cR6WPEpCpHIBbKSA"

interface CommitteeAssignmentData {
  rfp_id: string
  pr_reference: string
  bid_closing_date: string
  technical_bids_count: number
  commercial_bids_count: number
  bid_type: string
  technical_committee: Array<{
    id: string
    name: string
    role: string
    initials: string
    evaluationsDone: number
  }>
  commercial_committee: Array<{
    id: string
    name: string
    role: string
    initials: string
    evaluationsDone: number
  }>
  technical_criteria: Array<{
    id: string
    question: string
    score: number
  }>
  commercial_criteria: Array<{
    id: string
    question: string
    score: number
  }>
  decision?: string | null
  status: "edit" | "view"
}

function parseFormattedDate(dateStr: string): string | null {
  try {
    // Format: "29th Oct 2025, 5:00 PM"
    // Remove ordinal suffixes (st, nd, rd, th)
    const cleanedDate = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1")

    // Parse the date
    const date = new Date(cleanedDate)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("[v0] Invalid date format:", dateStr)
      return null
    }

    // Return ISO string
    return date.toISOString()
  } catch (error) {
    console.error("[v0] Error parsing date:", error)
    return null
  }
}

export async function saveCommitteeAssignment(data: CommitteeAssignmentData) {
  try {
    console.log("[v0] Saving committee assignment with status:", data.status)

    const isoDate = parseFormattedDate(data.bid_closing_date)
    if (!isoDate) {
      return {
        success: false,
        error: "Invalid date format for bid closing date",
      }
    }

    const dataToSave = {
      ...data,
      bid_closing_date: isoDate,
    }

    // Check if record already exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/committee_assignments?rfp_id=eq.${data.rfp_id}&select=id,status`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    )

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json()
      console.error("[v0] Error checking existing record:", errorData)
      return {
        success: false,
        error: "Failed to check existing record",
      }
    }

    const existingRecords = await checkResponse.json()
    console.log("[v0] Existing records:", existingRecords)

    // If record exists and status is 'view', don't allow updates
    if (existingRecords.length > 0 && existingRecords[0].status === "view") {
      return {
        success: false,
        error: "Cannot update a submitted committee assignment",
      }
    }

    let response

    // Update existing record or insert new one
    if (existingRecords.length > 0) {
      console.log("[v0] Updating existing committee assignment")
      response = await fetch(`${SUPABASE_URL}/rest/v1/committee_assignments?rfp_id=eq.${data.rfp_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          ...dataToSave,
          updated_at: new Date().toISOString(),
        }),
      })
    } else {
      console.log("[v0] Inserting new committee assignment")
      response = await fetch(`${SUPABASE_URL}/rest/v1/committee_assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          ...dataToSave,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      })
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Supabase save error:", errorData)
      return {
        success: false,
        error: errorData.message || "Failed to save committee assignment",
      }
    }

    const savedData = await response.json()
    console.log("[v0] Committee assignment saved successfully:", savedData)

    return {
      success: true,
      data: savedData,
      message:
        data.status === "edit" ? "Committee assignment saved as draft" : "Committee assignment submitted successfully",
    }
  } catch (error) {
    console.error("[v0] Error saving committee assignment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function fetchCommitteeAssignment(rfpId: string) {
  try {
    console.log("[v0] Fetching committee assignment for RFP:", rfpId)

    const response = await fetch(`${SUPABASE_URL}/rest/v1/committee_assignments?rfp_id=eq.${rfpId}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Error fetching committee assignment:", errorData)
      return {
        success: false,
        error: "Failed to fetch committee assignment",
      }
    }

    const data = await response.json()
    console.log("[v0] Fetched committee assignment:", data)

    if (data.length === 0) {
      return {
        success: true,
        data: null,
      }
    }

    return {
      success: true,
      data: data[0],
    }
  } catch (error) {
    console.error("[v0] Error fetching committee assignment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
