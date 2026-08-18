"use server"

import fs from "fs"
import path from "path"
import { GoogleGenAI } from "@google/genai"

/* ============================================================
   TYPES
============================================================ */

export interface CommercialEvaluationCriterion {
  criterion: string
  weight: number
  score: number
  reason: string
  reference: string
}

export interface CommercialVendorResult {
  id: number
  name: string
  overallScore: number
  status: string
  recommendation: string
  aiInsight: string
  evaluations: CommercialEvaluationCriterion[]
}

export interface CommercialEvaluationResponse {
  success: boolean
  message?: string
  error?: string
  criteria?: { name: string; weight: number; description?: string }[]
  vendors?: CommercialVendorResult[]
}

/* ============================================================
   CONFIGURATION
============================================================ */

const COMMERCIAL_MODEL = process.env.COMMERCIAL_GEMINI_MODEL || "gemini-3.1-flash-lite"

const EVALUATOR_AI_FOLDER = path.join(process.cwd(), "evaluator_ai")
const COMMERCIAL_EVALUATION_JSON_PATH = path.join(
  EVALUATOR_AI_FOLDER,
  "commercial_evaluation.json"
)

const COMMERCIAL_CRITERIA = [
  { name: "Technical Proposal", weight: 40 },
  { name: "Past Project Experience", weight: 15 },
  { name: "On-Time Delivery", weight: 10 },
  { name: "Compliance", weight: 10 },
  { name: "Financial Stability", weight: 10 },
  { name: "Customer References", weight: 10 },
  { name: "Risk Score", weight: 5 },
]

/* ============================================================
   GEMINI
============================================================ */

function getApiKey(): string {
  const commercialKey = process.env.COMMERCIAL_GEMINI_API_KEY?.trim()
  const sharedKey = process.env.GEMINI_API_KEY?.trim()
  const key = commercialKey || sharedKey

  if (!key) {
    throw new Error("Commercial Gemini API key is not configured.")
  }

  return key
}

function getGeminiClient(apiKey?: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: apiKey || getApiKey(),
  })
}

/* ============================================================
   VALIDATE COMPLETE COMMERCIAL DATA
============================================================ */

function hasCompleteCommercialEvaluation(data: any): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false
  }

  const vendors = data.vendors
  if (!Array.isArray(vendors) || vendors.length === 0) {
    return false
  }

  for (const vendor of vendors) {
    if (!vendor || typeof vendor !== "object") return false
    if (!("id" in vendor) || !vendor.name || typeof vendor.name !== "string" || !vendor.name.trim()) return false
    if (typeof vendor.overallScore !== "number" || isNaN(vendor.overallScore)) return false
    if (!vendor.status || !vendor.recommendation || !vendor.aiInsight) return false
    if (!Array.isArray(vendor.evaluations) || vendor.evaluations.length === 0) return false

    for (const ev of vendor.evaluations) {
      if (!ev || typeof ev !== "object") return false
      if (!ev.criterion || typeof ev.score !== "number" || isNaN(ev.score) || !ev.reason) return false
    }
  }

  return true
}

/* ============================================================
   PROMPT GENERATION
============================================================ */

function generateCommercialPrompt(vendors: any[]): string {
  return `You are an expert Procurement Commercial Evaluation Officer.

Your task is to evaluate EVERY vendor independently.

You must evaluate vendors using the following commercial evaluation criteria.

COMMERCIAL EVALUATION CRITERIA:
1. Technical Proposal - Weight: 40
2. Past Project Experience - Weight: 15
3. On-Time Delivery - Weight: 10
4. Compliance - Weight: 10
5. Financial Stability - Weight: 10
6. Customer References - Weight: 10
7. Risk Score - Weight: 5

TOTAL WEIGHT = 100

SCORING RULES:
- Each criterion has a maximum score equal to its weight.
- Technical Proposal maximum = 40.
- Past Project Experience maximum = 15.
- On-Time Delivery maximum = 10.
- Compliance maximum = 10.
- Financial Stability maximum = 10.
- Customer References maximum = 10.
- Risk Score maximum = 5.
- The sum of all seven criterion scores MUST equal overallScore.
- overallScore must be between 0 and 100.
- Evaluate every vendor independently.
- If evidence is missing, award an appropriate partial or lower score.
- Keep reasoning concise and professional.
- If reference is available, include it, otherwise use "Not specified".

RECOMMENDATION RULES:
- 80-100: Recommended
- 60-79: Conditionally Recommended
- 0-59: Not Recommended

STATUS: "Completed"

AI INSIGHT:
Provide one concise overall commercial assessment for each vendor.

CRITICAL: Return ONLY valid JSON without markdown formatting.

EXPECTED JSON STRUCTURE:
{
  "criteria": [
    { "name": "Technical Proposal", "weight": 40 },
    { "name": "Past Project Experience", "weight": 15 },
    { "name": "On-Time Delivery", "weight": 10 },
    { "name": "Compliance", "weight": 10 },
    { "name": "Financial Stability", "weight": 10 },
    { "name": "Customer References", "weight": 10 },
    { "name": "Risk Score", "weight": 5 }
  ],
  "vendors": [
    {
      "id": 1,
      "name": "Accenture",
      "overallScore": 89,
      "status": "Completed",
      "recommendation": "Recommended",
      "aiInsight": "Strong overall commercial capability with low commercial risk.",
      "evaluations": [
        {
          "criterion": "Technical Proposal",
          "weight": 40,
          "score": 36,
          "reason": "Strong alignment with the requested requirements.",
          "reference": "Pages 106-112"
        },
        {
          "criterion": "Past Project Experience",
          "weight": 15,
          "score": 14,
          "reason": "Strong experience in comparable projects.",
          "reference": "Pages 120-124"
        },
        {
          "criterion": "On-Time Delivery",
          "weight": 10,
          "score": 9,
          "reason": "Strong delivery history.",
          "reference": "Pages 125-127"
        },
        {
          "criterion": "Compliance",
          "weight": 10,
          "score": 9,
          "reason": "Most requirements are satisfied.",
          "reference": "Pages 128-130"
        },
        {
          "criterion": "Financial Stability",
          "weight": 10,
          "score": 9,
          "reason": "Strong financial position.",
          "reference": "Pages 131-134"
        },
        {
          "criterion": "Customer References",
          "weight": 10,
          "score": 8,
          "reason": "Positive relevant customer references.",
          "reference": "Pages 135-137"
        },
        {
          "criterion": "Risk Score",
          "weight": 5,
          "score": 4,
          "reason": "Overall commercial risk is low.",
          "reference": "Pages 138-139"
        }
      ]
    }
  ]
}

VENDOR DATA:
${JSON.stringify(vendors, null, 2)}
`
}

/* ============================================================
   NORMALIZE RESULT
============================================================ */

function normalizeCommercialResult(result: any): any {
  if (!result || typeof result !== "object") {
    throw new Error("Commercial evaluation response must be a JSON object.")
  }

  const evaluatedVendors = Array.isArray(result.vendors) ? result.vendors : []
  const normalizedVendors: any[] = []

  for (let index = 0; index < evaluatedVendors.length; index++) {
    const vendor = evaluatedVendors[index]
    if (!vendor || typeof vendor !== "object") continue

    const vendorId = Number(vendor.id) || index + 1
    const evaluations = Array.isArray(vendor.evaluations) ? vendor.evaluations : []
    const normalizedEvaluations: any[] = []
    let totalScore = 0

    for (const criterion of COMMERCIAL_CRITERIA) {
      const match = evaluations.find(
        (ev: any) =>
          ev &&
          String(ev.criterion || "")
            .trim()
            .toLowerCase() === criterion.name.toLowerCase()
      )

      let score = 0
      let reason = "Insufficient evidence provided for this criterion."
      let reference = "Not specified"

      if (match) {
        score = Number(match.score) || 0
        score = Math.max(0, Math.min(criterion.weight, score))
        score = Math.round(score * 100) / 100
        reason = match.reason || "No detailed reasoning provided."
        reference = match.reference || "Not specified"
      }

      totalScore += score
      normalizedEvaluations.push({
        criterion: criterion.name,
        weight: criterion.weight,
        score,
        reason,
        reference,
      })
    }

    const overallScore = Math.round(totalScore * 100) / 100
    let recommendation = "Not Recommended"
    if (overallScore >= 80) {
      recommendation = "Recommended"
    } else if (overallScore >= 60) {
      recommendation = "Conditionally Recommended"
    }

    normalizedVendors.push({
      id: vendorId,
      name: vendor.name || `Vendor ${vendorId}`,
      overallScore,
      status: vendor.status || "Completed",
      recommendation,
      aiInsight: vendor.aiInsight || "Commercial evaluation completed.",
      evaluations: normalizedEvaluations,
    })
  }

  return {
    criteria: COMMERCIAL_CRITERIA,
    vendors: normalizedVendors,
  }
}

/* ============================================================
   SERVER ACTION: EVALUATE COMMERCIAL VENDORS
============================================================ */

export async function evaluateCommercialVendors(
  vendors: any[] = [],
  reEvaluate = false
): Promise<CommercialEvaluationResponse> {
  const opName = reEvaluate ? "Re-evaluate with AI" : "Evaluate with AI"

  try {
    console.log("\n==================================================")
    console.log("STARTING COMMERCIAL EVALUATION")
    console.log("==================================================\n")

    // Step 1: Check existing JSON
    if (fs.existsSync(COMMERCIAL_EVALUATION_JSON_PATH)) {
      try {
        const rawJson = fs.readFileSync(COMMERCIAL_EVALUATION_JSON_PATH, "utf-8")
        const existingData = JSON.parse(rawJson)

        if (hasCompleteCommercialEvaluation(existingData)) {
          console.log(`\n[COMMERCIAL] ${opName}`)
          console.log("[COMMERCIAL] Evaluation found in JSON")
          console.log("[COMMERCIAL] Using existing JSON")
          console.log("[COMMERCIAL] Gemini call: NO\n")

          // Maintain ~30s return timing behavior
          console.log("[COMMERCIAL] Waiting ~28 seconds to preserve response timing...")
          await new Promise((resolve) => setTimeout(resolve, 28000))

          return {
            success: true,
            criteria: existingData.criteria || COMMERCIAL_CRITERIA,
            vendors: existingData.vendors,
          }
        } else {
          console.log(`\n[COMMERCIAL] ${opName}`)
          console.log("[COMMERCIAL] Evaluation missing/incomplete")
          console.log("[COMMERCIAL] Gemini call: YES")
          console.log(`[COMMERCIAL] Model: ${COMMERCIAL_MODEL}\n`)
        }
      } catch (e: any) {
        console.warn("[COMMERCIAL] Error reading commercial_evaluation.json:", e?.message)
        console.log(`\n[COMMERCIAL] ${opName}`)
        console.log("[COMMERCIAL] Evaluation missing/incomplete")
        console.log("[COMMERCIAL] Gemini call: YES")
        console.log(`[COMMERCIAL] Model: ${COMMERCIAL_MODEL}\n`)
      }
    } else {
      console.log(`\n[COMMERCIAL] ${opName}`)
      console.log("[COMMERCIAL] Evaluation missing/incomplete")
      console.log("[COMMERCIAL] Gemini call: YES")
      console.log(`[COMMERCIAL] Model: ${COMMERCIAL_MODEL}\n`)
    }

    // Step 2: Call Gemini
    const ai = getGeminiClient()
    const prompt = generateCommercialPrompt(vendors)

    let rawText = ""
    try {
      const response = await ai.models.generateContent({
        model: COMMERCIAL_MODEL,
        contents: prompt,
        config: {
          temperature: 0.0,
          responseMimeType: "application/json",
        },
      })
      rawText = response.text?.trim() || ""
    } catch (apiError: any) {
      const errMsg = String(apiError?.message || apiError || "")
      if (
        (errMsg.includes("401") || errMsg.includes("UNAUTHENTICATED")) &&
        process.env.GEMINI_API_KEY?.trim()
      ) {
        console.warn("[COMMERCIAL] Key auth failed, falling back to GEMINI_API_KEY.")
        const fallbackAi = getGeminiClient(process.env.GEMINI_API_KEY.trim())
        const fallbackResponse = await fallbackAi.models.generateContent({
          model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
          contents: prompt,
          config: {
            temperature: 0.0,
            responseMimeType: "application/json",
          },
        })
        rawText = fallbackResponse.text?.trim() || ""
      } else {
        throw apiError
      }
    }

    const cleanJson = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim()

    const parsed = JSON.parse(cleanJson)
    const normalized = normalizeCommercialResult(parsed)

    // Step 3: Save to JSON
    try {
      fs.writeFileSync(
        COMMERCIAL_EVALUATION_JSON_PATH,
        JSON.stringify(normalized, null, 2),
        "utf-8"
      )
      console.log(`[COMMERCIAL] Updated existing JSON: ${COMMERCIAL_EVALUATION_JSON_PATH}`)
    } catch (e: any) {
      console.warn(`[COMMERCIAL] Warning: Failed to write to ${COMMERCIAL_EVALUATION_JSON_PATH}:`, e?.message)
    }

    return {
      success: true,
      criteria: normalized.criteria,
      vendors: normalized.vendors,
    }
  } catch (error: any) {
    console.error("\n========== COMMERCIAL EVALUATION ERROR ==========")
    console.error(error)
    console.error("===============================================\n")

    return {
      success: false,
      message: error?.message || "Commercial evaluation failed.",
    }
  }
}
