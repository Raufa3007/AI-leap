"use server"

import { GoogleGenAI, Type } from "@google/genai"
import {
  BUDGET_CODE_OPTIONS,
  MATERIAL_GROUP_OPTIONS,
  UNIT_OF_MEASURE_OPTIONS,
  CHECKLIST_QUESTIONS,
} from "@/lib/pr-constants"
import { savePRDraft } from "./save-pr-draft"
import { extractTextFromPDF } from "@/lib/pdf-extractor"

export interface BillItemState {
  id: number
  materialGroup: string
  itemName: string
  deliveryDate: string
  quantity: string
  unitOfMeasure: string
  unitPrice: string
  description: string
}

export interface VendorState {
  id: number
  name: string
}

export interface ChecklistState {
  id: number
  question: string
  answer: boolean
}

export interface PRFormDataState {
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
}

export interface FullPRState {
  formData: PRFormDataState
  vendors: VendorState[]
  billItems: BillItemState[]
  checklist: ChecklistState[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  timestamp: string
}

export interface ProcessChatResponse {
  success: boolean
  message: string
  updatedState?: FullPRState
  isReadyForSubmit?: boolean
  capturedSummary?: string[]
  missingSummary?: string[]
  error?: string
}

export interface PDFExtractResponse {
  success: boolean
  message: string
  updatedState?: FullPRState
  extractedData?: any
  error?: string
}

const budgetValues = BUDGET_CODE_OPTIONS.map((o) => o.value)
const materialGroupValues = MATERIAL_GROUP_OPTIONS.map((o) => o.value)
const uomValues = UNIT_OF_MEASURE_OPTIONS.map((o) => o.value)

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    console.error("[ai-pr-assistant] GEMINI_API_KEY environment variable is missing")
    throw new Error("GEMINI_API_KEY is not configured")
  }
  return key
}

function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim()
  }
  return JSON.parse(cleaned)
}

function sanitizeOption<T extends string>(val: any, allowed: T[]): T | null {
  if (!val || typeof val !== "string") return null
  const trimmed = val.trim().toUpperCase()
  const match = allowed.find((a) => a.toUpperCase() === trimmed)
  return match || null
}

function validateAndSanitizeExtractedData(extracted: any) {
  if (!extracted || typeof extracted !== "object") return {}

  if (extracted.budget_code_cost_centre) {
    extracted.budget_code_cost_centre = sanitizeOption(
      extracted.budget_code_cost_centre,
      budgetValues,
    )
  }

  if (Array.isArray(extracted.bill_of_quantity)) {
    extracted.bill_of_quantity = extracted.bill_of_quantity.map((item: any) => {
      if (!item || typeof item !== "object") return item
      return {
        ...item,
        material_group: sanitizeOption(item.material_group, materialGroupValues),
        unit_of_measure: sanitizeOption(item.unit_of_measure, uomValues),
      }
    })
  }

  return extracted
}

export async function extractPRDetailsFromPDF(
  fileBase64: string,
  currentState: FullPRState,
): Promise<PDFExtractResponse> {
  try {
    if (!fileBase64 || typeof fileBase64 !== "string") {
      return {
        success: false,
        message: "Please upload a PDF file.",
        error: "Missing PDF file data",
      }
    }

    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "").trim()
    if (!cleanBase64) {
      return {
        success: false,
        message: "Please upload a PDF file.",
        error: "Empty base64 payload",
      }
    }

    const buffer = Buffer.from(cleanBase64, "base64")
    if (!buffer || buffer.length === 0) {
      return {
        success: false,
        message: "Please upload a PDF file.",
        error: "Invalid Buffer conversion",
      }
    }

    // 1. Server-side PDF extraction
    let extractedText = ""
    try {
      extractedText = await extractTextFromPDF(buffer)
    } catch (parseErr: any) {
      console.error("[ai-pr-assistant] PDF extraction error:", parseErr)
      const msg = parseErr?.message || ""
      if (msg.includes("No readable text")) {
        return {
          success: false,
          message: "No readable text could be extracted from this PDF.",
          error: msg,
        }
      }
      return {
        success: false,
        message: "Unable to read this PDF. Please try another document.",
        error: msg,
      }
    }

    if (
      !extractedText ||
      extractedText.trim() === "" ||
      extractedText.trim() === "No readable text could be extracted from this PDF."
    ) {
      return {
        success: false,
        message: "No readable text could be extracted from this PDF.",
        error: "Empty or unreadable PDF text",
      }
    }

    // 2. Call Gemini 2.5 Flash with extracted text
    const apiKey = getApiKey()
    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = `You are a specialized Procurement Purchase Requisition (PR) PDF Data Extraction AI Assistant.
Your task is to extract structured procurement information from text extracted from a PDF document (RFP, Scope of Work, Quotation, Proposal, Purchase Order, etc.).

STRICT EXTRACTION RULES:
1. Extract ONLY information explicitly available in the PDF text provided. Do NOT invent, assume, or infer unsupported information.
2. If a field (scope_of_work, purpose_and_justification, business_impact_expected_outcome) is not explicitly stated in the PDF text, return null for that field. Do NOT generate placeholder or generic text.
3. For Purpose & Justification: Return null if the document does not provide explicit purpose or justification. Do not generate a generic justification.
4. For Business Impact / Expected Outcome: Return null if expected benefits/impact/outcomes are unavailable in the PDF.
5. Dates MUST be formatted strictly as YYYY-MM-DD (e.g. 2026-08-25). If no delivery date is given in the PDF, return null. Never invent dates.
6. Prices: Extract the explicit estimated unit price as a numeric string without currency symbols (e.g. "75000" for ₹75,000, $75,000, SAR 75,000). If unavailable, return null. Do NOT calculate unit price from total price unless explicitly provided.
7. For Bill of Quantity (BOQ):
   - Inspect ALL sections of the document including tables, item lists, pricing sections, scope sections, technical specifications, quantity schedules, commercial sections, and delivery requirements.
   - Every distinct product, material, service, or line item MUST be extracted into a separate object in bill_of_quantity.
   - material_group: MUST be ONE of the allowed material group codes listed below, or null if ambiguous.
   - item_name: Explicate title/name of product or service.
   - delivery_date: Date formatted as YYYY-MM-DD or null.
   - quantity: Quantity as string (numeric only, e.g. "10") or null.
   - unit_of_measure: MUST be ONE of the allowed UOM codes listed below, or null if ambiguous.
   - unit_price: Unit price as numeric string or null.
   - description: Relevant description of item. If not explicitly found in PDF, write a concise, relevant description based on the item name and context.
8. For Procurement Checklist:
   - Carefully check the 6 checklist questions below against the PDF document content.
   - Return answer: true ONLY when the PDF text clearly and explicitly supports that checklist item.
   - A partial or weak match must remain false. Do not guess.

ALLOWED MATERIAL GROUPS (material_group must ONLY be one of these exact codes or null):
${MATERIAL_GROUP_OPTIONS.map((m) => `- "${m.value}": ${m.label}`).join("\n")}

ALLOWED UNITS OF MEASURE (unit_of_measure must ONLY be one of these exact codes or null):
${UNIT_OF_MEASURE_OPTIONS.map((u) => `- "${u.value}": ${u.label}`).join("\n")}

CHECKLIST QUESTIONS (id 1-6):
${CHECKLIST_QUESTIONS.map((c) => `- Question ID ${c.id}: ${c.question}`).join("\n")}

Return ONLY a JSON object adhering strictly to this schema:
{
  "scope_of_work": string | null,
  "purpose_and_justification": string | null,
  "business_impact_expected_outcome": string | null,
  "checklist_updates": [
    {
      "question_id": number,
      "answer": boolean
    }
  ],
  "bill_of_quantity": [
    {
      "material_group": string | null,
      "item_name": string | null,
      "delivery_date": string | null,
      "quantity": string | null,
      "unit_of_measure": string | null,
      "unit_price": string | null,
      "description": string | null
    }
  ]
}`

    const userContent = `EXTRACTED PDF DOCUMENT TEXT:\n\n${extractedText}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n" + userContent }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    })

    const rawText = response.text || "{}"
    let extractedDataRaw: any
    try {
      extractedDataRaw = cleanAndParseJSON(rawText)
    } catch (jsonErr: any) {
      console.error("[ai-pr-assistant] Invalid JSON returned by Gemini:", rawText, jsonErr)
      return {
        success: false,
        message: "Unable to extract procurement information from the document. Please try again.",
        error: "Invalid JSON response from Gemini",
      }
    }

    const extracted = validateAndSanitizeExtractedData(extractedDataRaw)

    // 3. Merge into PR state (preserving existing user-entered values)
    const newState: FullPRState = JSON.parse(JSON.stringify(currentState))

    if (extracted.scope_of_work && typeof extracted.scope_of_work === "string" && extracted.scope_of_work.trim()) {
      newState.formData.scope_of_work = extracted.scope_of_work.trim()
    }

    if (
      extracted.purpose_and_justification &&
      typeof extracted.purpose_and_justification === "string" &&
      extracted.purpose_and_justification.trim()
    ) {
      newState.formData.purpose_and_justification = extracted.purpose_and_justification.trim()
    }

    if (
      extracted.business_impact_expected_outcome &&
      typeof extracted.business_impact_expected_outcome === "string" &&
      extracted.business_impact_expected_outcome.trim()
    ) {
      newState.formData.business_impact_expected_outcome = extracted.business_impact_expected_outcome.trim()
    }

    // Merge Procurement Checklist (false -> true ONLY, never true -> false)
    if (Array.isArray(extracted.checklist_updates)) {
      extracted.checklist_updates.forEach((up: { question_id: number; answer: boolean }) => {
        if (up && typeof up.question_id === "number" && up.answer === true) {
          const item = newState.checklist.find((c) => c.id === up.question_id)
          if (item) {
            item.answer = true
          }
        }
      })
    }

    // Merge Bill of Quantity (BOQ)
    if (Array.isArray(extracted.bill_of_quantity) && extracted.bill_of_quantity.length > 0) {
      const isInitialSingleEmpty =
        newState.billItems.length === 1 &&
        !newState.billItems[0].itemName &&
        !newState.billItems[0].quantity &&
        !newState.billItems[0].unitPrice

      let itemsTarget = isInitialSingleEmpty ? [] : [...newState.billItems]

      extracted.bill_of_quantity.forEach((exItem: any) => {
        if (!exItem) return

        let existingMatch = itemsTarget.find(
          (b) =>
            b.itemName &&
            exItem.item_name &&
            (b.itemName.toLowerCase().includes(exItem.item_name.toLowerCase()) ||
              exItem.item_name.toLowerCase().includes(b.itemName.toLowerCase())),
        )

        if (existingMatch) {
          if (exItem.material_group && !existingMatch.materialGroup) existingMatch.materialGroup = exItem.material_group
          if (exItem.delivery_date && !existingMatch.deliveryDate) existingMatch.deliveryDate = exItem.delivery_date
          if (exItem.quantity && !existingMatch.quantity) existingMatch.quantity = String(exItem.quantity)
          if (exItem.unit_of_measure && !existingMatch.unitOfMeasure) existingMatch.unitOfMeasure = exItem.unit_of_measure
          if (exItem.unit_price && !existingMatch.unitPrice) {
            const cleanedPrice = String(exItem.unit_price).replace(/[^0-9.]/g, "")
            existingMatch.unitPrice = cleanedPrice || String(exItem.unit_price)
          }
          if (exItem.description && !existingMatch.description) existingMatch.description = exItem.description
          if (exItem.item_name && !existingMatch.itemName) existingMatch.itemName = exItem.item_name
        } else {
          const nextId = itemsTarget.length > 0 ? Math.max(...itemsTarget.map((b) => b.id)) + 1 : 1
          const cleanedPrice = exItem.unit_price ? String(exItem.unit_price).replace(/[^0-9.]/g, "") : ""
          itemsTarget.push({
            id: nextId,
            materialGroup: exItem.material_group || "",
            itemName: exItem.item_name || "",
            deliveryDate: exItem.delivery_date || "",
            quantity: exItem.quantity ? String(exItem.quantity) : "",
            unitOfMeasure: exItem.unit_of_measure || "",
            unitPrice: cleanedPrice || (exItem.unit_price ? String(exItem.unit_price) : ""),
            description: exItem.description || "",
          })
        }
      })

      newState.billItems = itemsTarget
    }

    // Auto-save draft if PR Number exists
    if (newState.formData.pr_number) {
      try {
        await savePRDraft({
          ...newState.formData,
          preferred_vendors: newState.vendors.map((v) => ({ name: v.name })),
          bill_of_quantity: newState.billItems.map((item) => ({
            material_group: item.materialGroup,
            item_name: item.itemName,
            delivery_date: item.deliveryDate,
            quantity: item.quantity,
            unit_of_measure: item.unitOfMeasure,
            unit_price: item.unitPrice,
            description: item.description,
          })),
          checklist_project_in_procurement_plan: newState.checklist[0]?.answer || false,
          checklist_team_specifications_mentioned: newState.checklist[1]?.answer || false,
          checklist_supplier_coordinator_details: newState.checklist[2]?.answer || false,
          checklist_sample_receiver_details: newState.checklist[3]?.answer || false,
          checklist_scope_similar_to_existing_contract: newState.checklist[4]?.answer || false,
          checklist_limited_tender_companies_listed: newState.checklist[5]?.answer || false,
        })
      } catch (err) {
        console.error("[ai-pr-assistant] Auto-save draft error after PDF extract:", err)
      }
    }

    return {
      success: true,
      message: "PDF processed successfully. PR fields have been auto-filled from the document.",
      updatedState: newState,
      extractedData: extracted,
    }
  } catch (error: any) {
    console.error("[ai-pr-assistant] Error processing PDF:", error)
    return {
      success: false,
      message: "Unable to extract procurement information from the document. Please try again.",
      error: error?.message || "Unknown error",
    }
  }
}

export async function extractAndProcessPRChat(
  userMessage: string,
  history: ChatMessage[],
  currentState: FullPRState,
): Promise<ProcessChatResponse> {
  try {
    const apiKey = getApiKey()
    const ai = new GoogleGenAI({ apiKey })

    const currentDateStr = new Date().toISOString().split("T")[0] // e.g. 2026-08-11

    const systemPrompt = `You are a specialized PR (Purchase Requisition) Creation AI Assistant.
Your task is to extract purchase requisition field values from natural language user input and update the PR draft state.

CURRENT CONTEXT & ALLOWED VALUES:
- Today's date is: ${currentDateStr}
- PR Number: "${currentState.formData.pr_number}" (generated client-side, DO NOT generate or change pr_number)

ALLOWED BUDGET CODES (budget_code_cost_centre must ONLY be one of these exact codes or null):
${BUDGET_CODE_OPTIONS.map((b) => `- "${b.value}": ${b.label}`).join("\n")}

ALLOWED MATERIAL GROUPS (material_group must ONLY be one of these exact codes or null):
${MATERIAL_GROUP_OPTIONS.map((m) => `- "${m.value}": ${m.label}`).join("\n")}

ALLOWED UNITS OF MEASURE (unit_of_measure must ONLY be one of these exact codes or null):
${UNIT_OF_MEASURE_OPTIONS.map((u) => `- "${u.value}": ${u.label}`).join("\n")}

CHECKLIST QUESTIONS (id 1-6):
${CHECKLIST_QUESTIONS.map((c) => `- Question ID ${c.id}: ${c.question}`).join("\n")}

CURRENT DRAFT STATE:
${JSON.stringify(currentState, null, 2)}

STRICT EXTRACTION RULES:
1. Extract ONLY information explicitly stated or unambiguously implied by the user message or conversation context.
2. If a field is not mentioned or unknown, return null for that field. Never invent prices, quantities, dates, names, or codes.
3. Dates MUST be formatted as ISO YYYY-MM-DD (e.g. 2026-08-11).
4. Map free text items to the best matching allowed code ONLY when unambiguous (e.g., "business laptops" -> MG003, "IT department" -> department: "IT", "budget code BC003" -> BC003). If uncertain, return null.
5. Create distinct objects in bill_of_quantity for distinct products/services mentioned.
6. Check if user is answering checklist questions (ids 1-6) and include updates in checklist_updates array if applicable.
7. Return valid JSON adhering strictly to the schema provided below.

Respond with a JSON object matching this schema:
{
  "department": string | null,
  "budget_code_cost_centre": string | null,
  "project_name_arabic": string | null,
  "requestor_name": string | null,
  "requestor_contact_details": string | null,
  "requested_date": string | null,
  "scope_of_work": string | null,
  "purpose_and_justification": string | null,
  "business_impact_expected_outcome": string | null,
  "preferred_vendors": [ { "name": string } ] | null,
  "bill_of_quantity": [
    {
      "material_group": string | null,
      "item_name": string | null,
      "delivery_date": string | null,
      "quantity": string | null,
      "unit_of_measure": string | null,
      "unit_price": string | null,
      "description": string | null
    }
  ] | null,
  "checklist_updates": [
    {
      "question_id": number,
      "answer": boolean
    }
  ] | null
}`

    const recentHistoryText = history
      .slice(-6)
      .map((h) => `${h.role.toUpperCase()}: ${h.text}`)
      .join("\n")

    const userPromptContent = `CONVERSATION HISTORY:\n${recentHistoryText}\n\nUSER MESSAGE:\n${userMessage}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPromptContent }] },
      ],
      config: {
        responseMimeType: "application/json",
      },
    })

    const rawText = response.text || "{}"
    const extractedDataRaw = cleanAndParseJSON(rawText)
    const extracted = validateAndSanitizeExtractedData(extractedDataRaw)

    // Merge into newState
    const newState: FullPRState = JSON.parse(JSON.stringify(currentState))

    if (extracted.department) newState.formData.department = extracted.department
    if (extracted.budget_code_cost_centre) newState.formData.budget_code_cost_centre = extracted.budget_code_cost_centre
    if (extracted.project_name_arabic) newState.formData.project_name_arabic = extracted.project_name_arabic
    if (extracted.requestor_name) newState.formData.requestor_name = extracted.requestor_name
    if (extracted.requestor_contact_details) newState.formData.requestor_contact_details = extracted.requestor_contact_details
    if (extracted.requested_date) newState.formData.requested_date = extracted.requested_date
    if (extracted.scope_of_work) newState.formData.scope_of_work = extracted.scope_of_work
    if (extracted.purpose_and_justification) newState.formData.purpose_and_justification = extracted.purpose_and_justification
    if (extracted.business_impact_expected_outcome) newState.formData.business_impact_expected_outcome = extracted.business_impact_expected_outcome

    // Merge Vendors
    if (Array.isArray(extracted.preferred_vendors) && extracted.preferred_vendors.length > 0) {
      extracted.preferred_vendors.forEach((v: { name: string }) => {
        if (v && v.name && v.name.trim()) {
          const nameTrimmed = v.name.trim()
          const exists = newState.vendors.some(
            (existing) => existing.name.toLowerCase() === nameTrimmed.toLowerCase(),
          )
          if (!exists) {
            const nextId =
              newState.vendors.length > 0
                ? Math.max(...newState.vendors.map((item) => item.id)) + 1
                : 1
            newState.vendors.push({ id: nextId, name: nameTrimmed })
          }
        }
      })
    }

    // Merge BOQ Items
    if (Array.isArray(extracted.bill_of_quantity) && extracted.bill_of_quantity.length > 0) {
      const isInitialSingleEmpty =
        newState.billItems.length === 1 &&
        !newState.billItems[0].itemName &&
        !newState.billItems[0].quantity &&
        !newState.billItems[0].unitPrice

      let itemsTarget = isInitialSingleEmpty ? [] : [...newState.billItems]

      extracted.bill_of_quantity.forEach((exItem: any) => {
        if (!exItem) return

        let existingMatch = itemsTarget.find(
          (b) =>
            b.itemName &&
            exItem.item_name &&
            (b.itemName.toLowerCase().includes(exItem.item_name.toLowerCase()) ||
              exItem.item_name.toLowerCase().includes(b.itemName.toLowerCase())),
        )

        if (existingMatch) {
          if (exItem.material_group) existingMatch.materialGroup = exItem.material_group
          if (exItem.delivery_date) existingMatch.deliveryDate = exItem.delivery_date
          if (exItem.quantity) existingMatch.quantity = String(exItem.quantity)
          if (exItem.unit_of_measure) existingMatch.unitOfMeasure = exItem.unit_of_measure
          if (exItem.unit_price) existingMatch.unitPrice = String(exItem.unit_price)
          if (exItem.description) existingMatch.description = exItem.description
          if (exItem.item_name) existingMatch.itemName = exItem.item_name
        } else {
          const nextId =
            itemsTarget.length > 0 ? Math.max(...itemsTarget.map((b) => b.id)) + 1 : 1
          itemsTarget.push({
            id: nextId,
            materialGroup: exItem.material_group || "",
            itemName: exItem.item_name || "",
            deliveryDate: exItem.delivery_date || "",
            quantity: exItem.quantity ? String(exItem.quantity) : "",
            unitOfMeasure: exItem.unit_of_measure || "",
            unitPrice: exItem.unit_price ? String(exItem.unit_price) : "",
            description: exItem.description || "",
          })
        }
      })

      newState.billItems = itemsTarget
    }

    // Merge Checklist
    if (Array.isArray(extracted.checklist_updates)) {
      extracted.checklist_updates.forEach((up: { question_id: number; answer: boolean }) => {
        const target = newState.checklist.find((c) => c.id === up.question_id)
        if (target && typeof up.answer === "boolean") {
          target.answer = up.answer
        }
      })
    }

    // Determine missing mandatory fields (matching handleSubmitPR validation)
    const missingMandatory: string[] = []
    if (!newState.formData.department.trim()) missingMandatory.push("Department")
    if (!newState.formData.requestor_name.trim()) missingMandatory.push("Requestor Name")
    if (!newState.formData.requested_date.trim()) missingMandatory.push("Requested Date")
    if (newState.vendors.length === 0) missingMandatory.push("At least one Preferred Vendor")

    const isReadyForSubmit = missingMandatory.length === 0

    // Build Captured and Missing summaries for conversational response
    const capturedList: string[] = []
    if (newState.formData.department) capturedList.push(`Department: ${newState.formData.department}`)
    if (newState.formData.budget_code_cost_centre) {
      const bOpt = BUDGET_CODE_OPTIONS.find((b) => b.value === newState.formData.budget_code_cost_centre)
      capturedList.push(`Budget Code: ${bOpt ? bOpt.label : newState.formData.budget_code_cost_centre}`)
    }
    if (newState.formData.requestor_name) capturedList.push(`Requestor: ${newState.formData.requestor_name}`)
    if (newState.formData.requested_date) capturedList.push(`Requested Date: ${newState.formData.requested_date}`)
    if (newState.vendors.length > 0) {
      capturedList.push(`Vendors: ${newState.vendors.map((v) => v.name).join(", ")}`)
    }
    if (newState.billItems.length > 0 && newState.billItems.some((i) => i.itemName)) {
      const itemsStr = newState.billItems
        .filter((i) => i.itemName)
        .map((i) => `${i.itemName}${i.quantity ? ` × ${i.quantity}` : ""}`)
        .join(", ")
      capturedList.push(`BOQ Items: ${itemsStr}`)
    }

    // Build Missing items list
    const missingList: string[] = [...missingMandatory]

    if (!newState.formData.requestor_contact_details.trim()) {
      missingList.push("Requestor Contact Details")
    }

    newState.billItems.forEach((bItem) => {
      if (!bItem.itemName) return
      const missingDetails: string[] = []
      if (!bItem.materialGroup) missingDetails.push("Material Group")
      if (!bItem.deliveryDate) missingDetails.push("Delivery Date")
      if (!bItem.unitOfMeasure) missingDetails.push("UOM")
      if (!bItem.unitPrice) missingDetails.push("Unit Price")
      if (!bItem.description) missingDetails.push("Description")
      if (missingDetails.length > 0) {
        missingList.push(`For "${bItem.itemName}": ${missingDetails.join(", ")}`)
      }
    })

    // Construct AI natural language response
    let aiResponseMessage = ""
    if (capturedList.length > 0) {
      aiResponseMessage += `Got it — I've updated your PR.\n\nCaptured:\n`
      capturedList.forEach((item) => {
        aiResponseMessage += `• ${item}\n`
      })
    } else {
      aiResponseMessage += `I didn't capture any new PR details from your message. `
    }

    if (!isReadyForSubmit) {
      aiResponseMessage += `\nStill need:\n`
      missingList.forEach((m) => {
        aiResponseMessage += `• ${m}\n`
      })
      aiResponseMessage += `\nPlease provide these details to complete your PR requisition.`
    } else {
      aiResponseMessage += `\n🎉 All mandatory fields are satisfied! Review the summary and click **Confirm & Submit** when you are ready to submit.`
    }

    // Auto-save draft via existing savePRDraft action
    if (newState.formData.pr_number) {
      try {
        await savePRDraft({
          ...newState.formData,
          preferred_vendors: newState.vendors.map((v) => ({ name: v.name })),
          bill_of_quantity: newState.billItems.map((item) => ({
            material_group: item.materialGroup,
            item_name: item.itemName,
            delivery_date: item.deliveryDate,
            quantity: item.quantity,
            unit_of_measure: item.unitOfMeasure,
            unit_price: item.unitPrice,
            description: item.description,
          })),
          checklist_project_in_procurement_plan: newState.checklist[0]?.answer || false,
          checklist_team_specifications_mentioned: newState.checklist[1]?.answer || false,
          checklist_supplier_coordinator_details: newState.checklist[2]?.answer || false,
          checklist_sample_receiver_details: newState.checklist[3]?.answer || false,
          checklist_scope_similar_to_existing_contract: newState.checklist[4]?.answer || false,
          checklist_limited_tender_companies_listed: newState.checklist[5]?.answer || false,
        })
      } catch (err) {
        console.error("[ai-pr-assistant] Auto-save draft error:", err)
      }
    }

    return {
      success: true,
      message: aiResponseMessage.trim(),
      updatedState: newState,
      isReadyForSubmit,
      capturedSummary: capturedList,
      missingSummary: missingList,
    }
  } catch (error: any) {
    console.error("[ai-pr-assistant] Error processing PR chat:", error)
    return {
      success: false,
      message: "Sorry, I couldn't process that — please try again.",
      error: error?.message || "Unknown error",
    }
  }
}
