"use server"

import fs from "fs"
import path from "path"
import { GoogleGenAI } from "@google/genai"

/* ============================================================
   TYPES
============================================================ */

export interface TechnicalEvaluationInput {
  humanEvaluationText?: string
  parameterTable?: Record<string, any>[]
  reEvaluate?: boolean
}

export interface TechnicalEvaluationResponse {
  success: boolean
  message?: string
  error?: string

  evaluation_table?: Record<string, any>[]

  technical_overall_insights?: {
    [vendor: string]: string
  }
}

interface ProposalText {
  name: string
  text: string
}

/* ============================================================
   CONFIGURATION
============================================================ */

const GEMINI_MODEL = process.env.TECHNICAL_GEMINI_MODEL || "gemini-3.6-flash"

const EVALUATOR_AI_FOLDER = path.join(
  process.cwd(),
  "evaluator_ai"
)

const UPLOAD_FOLDER = path.join(
  EVALUATOR_AI_FOLDER,
  "uploaded_files"
)

const RFP_FILE_NAME = "rfp_TNT_CR_IT_RFP.txt"

const PROPOSAL_FILE_NAMES = [
  "proposal_1_Accenture Proposal.txt",
  "proposal_2_Deloitte Proposal.txt",
  "proposal_3_KaarTech Proposal.txt",
]

const EVALUATION_DOC_PATHS = [
  path.join(
    EVALUATOR_AI_FOLDER,
    "evaluationDoc.txt"
  ),
  path.join(
    process.cwd(),
    "evaluationDoc.txt"
  ),
  path.join(
    process.cwd(),
    "public",
    "evaluationDoc.txt"
  ),
  path.join(
    process.cwd(),
    "data",
    "evaluationDoc.txt"
  ),
  path.join(
    UPLOAD_FOLDER,
    "evaluationDoc.txt"
  ),
]

const RUBRIC_FILE_PATH = path.join(
  EVALUATOR_AI_FOLDER,
  "generated_rubric.json"
)

const TECHNICAL_EVALUATION_JSON_PATH = path.join(
  EVALUATOR_AI_FOLDER,
  "technical_evaluation.json"
)

function hasCompleteTechnicalEvaluation(jsonData: any): boolean {
  if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
    return false
  }

  const evalTable = jsonData.evaluation_table
  if (!Array.isArray(evalTable) || evalTable.length < 2) {
    return false
  }

  let hasTotalScore = false
  for (const row of evalTable) {
    if (!row || typeof row !== "object") {
      return false
    }
    const mainCrit = String(row["Main Criterion"] || "").trim().toLowerCase()
    if (mainCrit.includes("total score")) {
      hasTotalScore = true
    }
  }

  if (!hasTotalScore) {
    return false
  }

  const insights = jsonData.technical_overall_insights
  if (!insights || typeof insights !== "object" || Array.isArray(insights) || Object.keys(insights).length === 0) {
    return false
  }

  for (const [vendor, insight] of Object.entries(insights)) {
    if (!vendor || typeof insight !== "string" || !insight.trim()) {
      return false
    }
  }

  return true
}



/* ============================================================
   GEMINI
============================================================ */

function getApiKey(): string {
  // Prefer dedicated technical key; fall back to shared GEMINI_API_KEY
  const technicalKey = process.env.TECHNICAL_GEMINI_API_KEY?.trim()
  const sharedKey = process.env.GEMINI_API_KEY?.trim()
  const key = technicalKey || sharedKey

  if (!key) {
    throw new Error(
      "Technical Gemini API key is not configured."
    )
  }

  return key
}

function getGeminiClient(apiKey?: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: apiKey || getApiKey(),
  })
}


/* ============================================================
   GEMINI JSON CLEANING
============================================================ */

function cleanGeminiJSON(
  text: string
): string {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
}

/* ============================================================
   GEMINI CALL
============================================================ */

async function callGemini(
  ai: GoogleGenAI,
  prompt: string,
  temperature = 0,
  responseMimeType?: string
): Promise<string> {
  const callOptions = {
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      temperature,
      ...(responseMimeType ? { responseMimeType } : {}),
    },
  }

  try {
    const response = await ai.models.generateContent(callOptions)
    const text = response.text?.trim() || ""
    if (!text) {
      throw new Error("Gemini returned an empty response.")
    }
    return text
  } catch (error: any) {
    const errMsg = String(error?.message || error || "")

    // If dedicated technical key fails with auth error, retry with GEMINI_API_KEY
    if (
      (errMsg.includes("401") || errMsg.includes("UNAUTHENTICATED") || errMsg.includes("ACCESS_TOKEN_TYPE")) &&
      process.env.GEMINI_API_KEY?.trim()
    ) {
      const fallbackKey = process.env.GEMINI_API_KEY.trim()
      const fallbackModel = process.env.GEMINI_MODEL || "gemini-3.6-flash"
      console.warn("[ai-technical-evaluation] Technical key auth failed, retrying with GEMINI_API_KEY fallback.")
      try {
        const fallbackAi = getGeminiClient(fallbackKey)
        const fallbackResponse = await fallbackAi.models.generateContent({
          ...callOptions,
          model: fallbackModel,
        })
        const text = fallbackResponse.text?.trim() || ""
        if (!text) {
          throw new Error("Gemini returned an empty response.")
        }
        return text
      } catch (fallbackError: any) {
        console.error("[ai-technical-evaluation] Fallback also failed:", fallbackError?.message)
        throw new Error(
          `Gemini API call failed: ${fallbackError?.message || String(fallbackError)}`
        )
      }
    }

    console.error("\n========== GEMINI API ERROR ==========")
    console.error(error)
    console.error("======================================\n")

    throw new Error(
      `Gemini API call failed: ${error?.message || String(error)}`
    )
  }
}


/* ============================================================
   CLEAN TEXT
============================================================ */

function cleanText(
  text: string
): string {
  if (!text) {
    return ""
  }

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*\n+/g, "\n\n")
    .replace(/[ ]+\n/g, "\n")
    .replace(/[^\S\r\n]+/g, " ")
    .trim()
}

/* ============================================================
   READ TEXT FILE
============================================================ */

function readTextFile(
  filePath: string
): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File not found: ${filePath}`
    )
  }

  const text =
    fs.readFileSync(
      filePath,
      "utf-8"
    )

  return cleanText(text)
}

/* ============================================================
   READ evaluationDoc.txt
============================================================ */

function readHumanEvaluationDocument(): string {
  console.log(
    "\n========== READING evaluationDoc.txt =========="
  )

  let foundPath = ""

  for (
    const filePath of
      EVALUATION_DOC_PATHS
  ) {
    if (fs.existsSync(filePath)) {
      foundPath = filePath
      break
    }
  }

  if (!foundPath) {
    console.warn(
      "evaluationDoc.txt was not found."
    )

    console.warn(
      "Technical evaluation will continue without the internal evaluation calibration document."
    )

    return ""
  }

  console.log(
    "Path:",
    foundPath
  )

  const text =
    readTextFile(foundPath)

  if (!text.trim()) {
    console.warn(
      "evaluationDoc.txt is empty."
    )

    return ""
  }

  console.log(
    "evaluationDoc.txt loaded successfully."
  )

  return text
}

/* ============================================================
   FIND RFP FILE
============================================================ */

function findRfpFile(): string {
  console.log(
    "\n========== SEARCHING FOR RFP =========="
  )

  const rfpPath =
    path.join(
      UPLOAD_FOLDER,
      RFP_FILE_NAME
    )

  console.log(
    "Expected RFP path:",
    rfpPath
  )

  if (!fs.existsSync(rfpPath)) {
    throw new Error(
      `RFP file not found: ${rfpPath}`
    )
  }

  console.log(
    "RFP found:",
    rfpPath
  )

  return rfpPath
}

/* ============================================================
   FIND TECHNICAL PROPOSAL FILES
============================================================ */

function findTechnicalProposalFiles(): string[] {
  console.log(
    "\n========== SEARCHING FOR TECHNICAL PROPOSALS =========="
  )

  const proposalPaths: string[] = []

  for (
    const fileName of
      PROPOSAL_FILE_NAMES
  ) {
    const filePath =
      path.join(
        UPLOAD_FOLDER,
        fileName
      )

    console.log(
      "Checking proposal:",
      filePath
    )

    if (!fs.existsSync(filePath)) {
      console.warn(
        `Proposal file not found: ${filePath}`
      )

      continue
    }

    proposalPaths.push(filePath)

    console.log(
      "Proposal found:",
      filePath
    )
  }

  if (!proposalPaths.length) {
    throw new Error(
      `No technical proposal files were found inside ${UPLOAD_FOLDER}`
    )
  }

  console.log(
    "\nTechnical proposal files found:"
  )

  console.log(
    proposalPaths
  )

  return proposalPaths
}

/* ============================================================
   READ TECHNICAL PROPOSALS
============================================================ */

async function readTechnicalProposals(
  proposalPaths: string[]
): Promise<ProposalText[]> {
  const proposalTexts: ProposalText[] =
    []

  console.log(
    "\n========== READING TECHNICAL PROPOSALS =========="
  )

  for (
    const proposalPath of
      proposalPaths
  ) {
    const proposalName =
      path.basename(
        proposalPath
      )

    console.log(
      `Reading proposal: ${proposalName}`
    )

    try {
      const text =
        readTextFile(
          proposalPath
        )

      if (!text) {
        console.warn(
          `Proposal ${proposalName} contains no readable text.`
        )

        continue
      }

      proposalTexts.push({
        name:
          proposalName,

        text:
          text,
      })

      console.log(
        `Successfully read ${text.length} characters from ${proposalName}`
      )
    } catch (error) {
      console.error(
        `Failed to read proposal ${proposalName}:`,
        error
      )
    }
  }

  console.log(
    "\n========== PROPOSALS =========="
  )

  console.log(
    proposalTexts.map(
      (proposal) => ({
        name:
          proposal.name,

        characters:
          proposal.text.length,
      })
    )
  )

  console.log(
    "================================\n"
  )

  return proposalTexts
}

/* ============================================================
   MARKDOWN TABLE PARSER
============================================================ */

function parseMarkdownTableToJson(
  markdown: string
): Record<string, any>[] {
  try {
    const tableLines =
      markdown
        .split("\n")
        .map((line) =>
          line.trim()
        )
        .filter(
          (line) =>
            line.includes("|")
        )

    if (!tableLines.length) {
      console.error(
        "No markdown table lines found."
      )

      return []
    }

    const normalizedLines =
      tableLines.map((line) => {
        let value =
          line.trim()

        if (
          value.startsWith("|")
        ) {
          value =
            value.substring(1)
        }

        if (
          value.endsWith("|")
        ) {
          value =
            value.substring(
              0,
              value.length - 1
            )
        }

        return value
      })

    const headers =
      normalizedLines[0]
        .split("|")
        .map(
          (header) =>
            header.trim()
        )

    const rows: Record<
      string,
      any
    >[] = []

    for (
      let i = 1;
      i < normalizedLines.length;
      i++
    ) {
      const line =
        normalizedLines[i]

      const cells =
        line
          .split("|")
          .map(
            (cell) =>
              cell.trim()
          )

      if (
        cells.length > 0 &&
        cells.every(
          (cell) =>
            /^:?-+:?$/.test(
              cell
            )
        )
      ) {
        continue
      }

      const row: Record<
        string,
        any
      > = {}

      headers.forEach(
        (
          header,
          index
        ) => {
          row[header] =
            cells[index] ?? ""
        }
      )

      rows.push(row)
    }

    return rows
  } catch (error) {
    console.error(
      "Markdown table parsing error:",
      error
    )

    return []
  }
}

/* ============================================================
   CLEAN EVALUATION ROWS
============================================================ */

function cleanEvaluationRows(
  rows: Record<string, any>[]
): Record<string, any>[] {
  return rows.filter(
    (row) => {
      const values =
        Object.values(row)

      if (
        values.every(
          (value) =>
            String(
              value ?? ""
            ).trim() === ""
        )
      ) {
        return false
      }

      if (
        values.length > 0 &&
        values.every(
          (value) =>
            /^-+$/.test(
              String(
                value
              ).trim()
            )
        )
      ) {
        return false
      }

      const keys =
        Object.keys(row)

      if (
        keys.length > 0 &&
        keys.every(
          (key) =>
            String(
              row[key]
            ).trim() ===
            key.trim()
        )
      ) {
        return false
      }

      return true
    }
  )
}

/* ============================================================
   EXTRACT RFP RUBRIC FROM GEMINI
============================================================ */

async function extractTableFromGemini(
  ai: GoogleGenAI,
  text: string
): Promise<string> {
  const prompt = `
From the following RFP text, extract the
'Evaluation Parameters' table located under section 51.

Present the data in markdown table format with these columns:

- Main Criterion (with English in brackets)
- Weight 
- Sub-Criterion (with English in brackets)
- Sub-Weight 
- Expectation

The English translation of both the main criterion
and sub-criterion should appear inside brackets next
to the Arabic text.

For each sub-criterion, generate a multi-level
evaluation rubric using:

- Excellent (Full Marks)
- Good (Partial Marks)
- Insufficient (Low/No Marks)

TEXT TO ANALYZE:

${text}
`

  return callGemini(
    ai,
    prompt,
    0
  )
}

/* ============================================================
   EXTRACT TABLES FROM GEMINI RESPONSE
============================================================ */

function extractTablesFromResponse(
  responseContent: string
): string[] {
  if (!responseContent) {
    return []
  }

  const lines =
    responseContent.split(
      "\n"
    )

  const tables: string[] = []

  let currentTable: string[] =
    []

  for (
    const line of lines
  ) {
    if (
      line.includes("|")
    ) {
      currentTable.push(
        line
      )
    } else {
      if (
        currentTable.length >= 2
      ) {
        tables.push(
          currentTable.join(
            "\n"
          )
        )
      }

      currentTable = []
    }
  }

  if (
    currentTable.length >= 2
  ) {
    tables.push(
      currentTable.join(
        "\n"
      )
    )
  }

  return tables
}

/* ============================================================
   NORMALIZE PARAMETER TABLE
============================================================ */

function normalizeParameterTable(
  markdownTable: string
): Record<string, any>[] {
  const parsed =
    parseMarkdownTableToJson(
      markdownTable
    )

  if (!parsed.length) {
    return []
  }

  return parsed.map(
    (row) => {
      const keys =
        Object.keys(row)

      return {
        main_criteria:
          row[keys[0]] ?? "",

        main_weight:
          row[keys[1]] ?? "",

        sub_criteria:
          row[keys[2]] ?? "",

        sub_weight:
          row[keys[3]] ?? "",

        expectation:
          row[keys[4]] ?? "",
      }
    }
  )
}

/* ============================================================
   LOAD / GENERATE RUBRIC
============================================================ */

async function loadOrGenerateRubric(
  ai: GoogleGenAI,
  rfpText: string
): Promise<Record<string, any>[]> {
  if (
    fs.existsSync(
      RUBRIC_FILE_PATH
    )
  ) {
    console.log(
      "Found existing rubric."
    )

    try {
      const existing =
        JSON.parse(
          readTextFile(
            RUBRIC_FILE_PATH
          )
        )

      if (
        Array.isArray(
          existing
        ) &&
        existing.length
      ) {
        return existing
      }
    } catch (error) {
      console.error(
        "Could not load existing rubric:",
        error
      )
    }
  }

  console.log(
    "Generating new rubric..."
  )

  const geminiResponse =
    await extractTableFromGemini(
      ai,
      rfpText
    )

  if (!geminiResponse) {
    throw new Error(
      "AI failed to extract table from RFP text."
    )
  }

  const tables =
    extractTablesFromResponse(
      geminiResponse
    )

  if (!tables.length) {
    throw new Error(
      "Could not parse criteria table from AI response."
    )
  }

  const parameterTable =
    normalizeParameterTable(
      tables[0]
    )

  if (!parameterTable.length) {
    throw new Error(
      "Generated evaluation rubric is empty."
    )
  }

  fs.writeFileSync(
    RUBRIC_FILE_PATH,
    JSON.stringify(
      parameterTable,
      null,
      2
    ),
    "utf-8"
  )

  console.log(
    `New rubric saved to ${RUBRIC_FILE_PATH}`
  )

  return parameterTable
}

/* ============================================================
   TECHNICAL EVALUATION PROMPT
============================================================ */

function generateEvaluationPrompt(
  parameterTable: Record<string, any>[],
  proposalTexts: ProposalText[],
  rfpText: string,
  humanEvaluationText: string
): string {
  const proposalNames =
    proposalTexts.map(
      (proposal) =>
        proposal.name
    )

  const prompt: string[] =
    []

  prompt.push(`
You are an expert RFP technical evaluator with 20 years
of experience in government IT procurement.

Your task is to evaluate the submitted proposals against
the supplied RFP criteria.

Your evaluation must be evidence-based, professional,
and objective.
`)

  if (
    humanEvaluationText.trim()
  ) {
    prompt.push(`
### Expert Judgment Calibration

Study the provided internal evaluation document and
use its reasoning patterns to calibrate your assessment.

Do not mention this document in your final response.

--- START INTERNAL TRAINING DOCUMENT ---

${humanEvaluationText}

--- END INTERNAL TRAINING DOCUMENT ---
`)
  } else {
    prompt.push(`
### Expert Judgment Calibration

No internal evaluation calibration document was supplied.

Use professional government IT procurement evaluation
judgment and apply the supplied rubric objectively.
`)
  }

  if (rfpText) {
    prompt.push(`
### RFP Evaluation Criteria Source

${rfpText}
`)
  }

  prompt.push(`
### Evaluation Criteria Rubric

The following table contains the evaluation criteria:
`)

  prompt.push(
    JSON.stringify(
      parameterTable,
      null,
      2
    )
  )

  prompt.push(`
### Proposals to Evaluate
(${proposalNames.length} total):

${proposalNames.join(
    ", "
  )}
`)

  prompt.push(`
### Proposal Contents:
`)

  for (
    const proposal of
      proposalTexts
  ) {
    prompt.push(`
## Proposal: ${proposal.name}

${proposal.text}
`)
  }

  prompt.push(`
### EXPERT EVALUATION INSTRUCTIONS

- Evaluate every proposal independently.
- Apply the supplied rubric.
- Assess actual evidence, not just keywords.
- Consider technical feasibility.
- Award nuanced partial scores.
- Do not exceed the specified sub-weight.
- Include a concise reason.
- Include a page reference when available.
- If no page reference exists, use "Not specified".
- Do not give points merely because a proposal mentions a keyword.
- Do not assume capabilities that are not supported by proposal evidence.
- Scores must be evidence-based.

### IMPORTANT FILE FORMAT RULE

The proposals are plain text files, not PDFs.

Therefore:
- Do not invent PDF page numbers.
- If the proposal text contains explicit page/section references, use them.
- Otherwise use "Not specified" as the reference.
`)

  prompt.push(`
### OUTPUT FORMAT

Return ONLY a single markdown table.

| Main Criterion | Sub-Criterion | Main Weight | Sub Weight | ${proposalNames
    .map(
      (name) =>
        `${name} Score | ${name} Reason | ${name} Reference`
    )
    .join(
      " | "
    )} |

|---|---|---|---|${proposalNames
    .map(
      () =>
        "---|---|---"
    )
    .join("|")} |

The final row must be:

| Total Score | | 100 | | ... |

The total score must contain the sum of the scores for
each proposal.

All content must be in clear professional English.

Do not include Arabic text in the final table.

Do not include explanations before or after the table.
`)

  return prompt.join(
    "\n"
  )
}

/* ============================================================
   TECHNICAL OVERALL AI INSIGHTS
============================================================ */

async function generateTechnicalOverallInsights(
  ai: GoogleGenAI,
  evaluationTable: Record<string, any>[],
  proposalNames: string[]
): Promise<Record<string, string>> {
  console.log(
    "\n=== AI INSIGHT DEBUG START ==="
  )

  console.log(
    "[1] Vendors:",
    proposalNames
  )

  console.log(
    "[1] Evaluation table exists:",
    Boolean(
      evaluationTable.length
    )
  )

  if (
    !evaluationTable.length ||
    !proposalNames.length
  ) {
    return {}
  }

  const prompt = `
You are a senior government IT procurement technical evaluation expert.

The technical evaluation below contains criterion/sub-criterion scores,
reasoning, and references for multiple vendor proposals.

Your task is to produce ONE concise overall AI insight for EACH vendor.

The insight must:
- Be highly concise: maximum 2 sentences.
- Highlight the most important technical strengths and weaknesses.
- Use specific, high-value technical keywords from the evaluation.
- Mention the most significant evidence or gap only when relevant.
- Focus on what matters for the procurement decision.
- Avoid repeating individual criterion scores or the total score.
- Avoid generic statements.
- Do not invent or assume information.
- Do not use bullet points.

Return ONLY valid JSON in exactly this structure:

{
  "vendors": [
    {
      "name": "Vendor Name",
      "aiInsight": "Concise, evidence-based technical assessment."
    }
  ]
}

IMPORTANT:
- Return exactly ONE insight for every vendor.
- Use the vendor names EXACTLY as provided.
- Keep each insight between 20-40 words.
- Focus on the 1-2 most decision-relevant technical findings.

VENDOR NAMES:

${JSON.stringify(
    proposalNames,
    null,
    2
  )}

TECHNICAL EVALUATION DATA:

${JSON.stringify(
    evaluationTable,
    null,
    2
  )}
`

  try {
    const raw =
      await callGemini(
        ai,
        prompt,
        0,
        "application/json"
      )

    console.log(
      "\n========== TECHNICAL INSIGHT RAW =========="
    )

    console.log(raw)

    const cleaned =
      cleanGeminiJSON(raw)

    const result =
      JSON.parse(cleaned)

    const insights: Record<
      string,
      string
    > = {}

    for (
      const item of
        result?.vendors ?? []
    ) {
      if (
        !item ||
        typeof item !==
          "object"
      ) {
        continue
      }

      const name =
        String(
          item.name ?? ""
        ).trim()

      const insight =
        String(
          item.aiInsight ??
            ""
        ).trim()

      if (
        name &&
        insight
      ) {
        insights[name] =
          insight
      }
    }

    const normalized: Record<
      string,
      string
    > = {}

    for (
      const vendorName of
        proposalNames
    ) {
      const matchedKey =
        Object.keys(
          insights
        ).find(
          (key) =>
            key.toLowerCase() ===
            vendorName.toLowerCase()
        )

      normalized[
        vendorName
      ] =
        matchedKey
          ? insights[
              matchedKey
            ]
          : "Overall technical insight was not provided."
    }

    return normalized
  } catch (error) {
    console.error(
      "Technical overall insight error:",
      error
    )

    return Object.fromEntries(
      proposalNames.map(
        (name) => [
          name,
          "Overall technical insight could not be generated.",
        ]
      )
    )
  }
}

/* ============================================================
   MAIN TECHNICAL EVALUATION
============================================================ */

export async function evaluateTechnicalProposals(
  data: TechnicalEvaluationInput = {}
): Promise<TechnicalEvaluationResponse> {
  try {
    console.log(
      "\n=================================================="
    )

    console.log(
      "STARTING TECHNICAL EVALUATION"
    )

    console.log(
      "==================================================\n"
    )

    /* --------------------------------------------------------
       GEMINI CLIENT
    -------------------------------------------------------- */

    const ai =
      getGeminiClient()

    /* --------------------------------------------------------
       STEP 1
       HUMAN EVALUATION DOCUMENT
    -------------------------------------------------------- */

    let humanEvaluationText =
      data.humanEvaluationText?.trim() ||
      ""

    if (
      !humanEvaluationText
    ) {
      humanEvaluationText =
        readHumanEvaluationDocument()
    }

    console.log(
      "Human evaluation document characters:",
      humanEvaluationText.length
    )

    /* --------------------------------------------------------
       STEP 2
       FIND RFP
    -------------------------------------------------------- */

    const rfpPath =
      findRfpFile()

    console.log(
      "\n========== READING RFP =========="
    )

    /*
     * RFP is a .txt file, so read it directly.
     */

    const rfpText =
      readTextFile(
        rfpPath
      )

    if (!rfpText) {
      return {
        success: false,
        message:
          "Unable to read RFP text.",
      }
    }

    console.log(
      "RFP text extracted:",
      rfpText.length,
      "characters"
    )

    /* --------------------------------------------------------
       STEP 3
       LOAD / GENERATE RUBRIC
    -------------------------------------------------------- */

    const parameterTable =
      data.parameterTable?.length
        ? data.parameterTable
        : await loadOrGenerateRubric(
            ai,
            rfpText
          )

    if (
      !parameterTable.length
    ) {
      return {
        success: false,
        message:
          "Generated evaluation rubric is empty.",
      }
    }

    console.log(
      "Rubric rows:",
      parameterTable.length
    )

    /* --------------------------------------------------------
       STEP 4
       FIND TECHNICAL PROPOSAL FILES
    -------------------------------------------------------- */

    const proposalPaths =
      findTechnicalProposalFiles()

    if (
      !proposalPaths.length
    ) {
      return {
        success: false,
        message:
          "No technical proposal files were found.",
      }
    }

    /* --------------------------------------------------------
       STEP 5
       READ TECHNICAL PROPOSALS
    -------------------------------------------------------- */

    const proposalTexts =
      await readTechnicalProposals(
        proposalPaths
      )

    if (
      !proposalTexts.length
    ) {
      return {
        success: false,
        message:
          "No readable technical proposal files were found.",
      }
    }

    const readableProposals =
      proposalTexts.filter(
        (proposal) =>
          proposal.text
            .trim()
            .length > 0
      )

    if (
      !readableProposals.length
    ) {
      return {
        success: false,
        message:
          "Technical proposal files were provided, but no readable proposal content could be extracted.",
      }
    }

    /* --------------------------------------------------------
       STEP 5.5
       CHECK EXISTING JSON SOURCE OF TRUTH
    -------------------------------------------------------- */

    const opName = data.reEvaluate ? "Re-evaluate with AI" : "Evaluate with AI"

    if (fs.existsSync(TECHNICAL_EVALUATION_JSON_PATH)) {
      try {
        const rawJson = fs.readFileSync(TECHNICAL_EVALUATION_JSON_PATH, "utf-8")
        const existingData = JSON.parse(rawJson)
        if (hasCompleteTechnicalEvaluation(existingData)) {
          console.log(`\n[TECHNICAL] ${opName}`)
          console.log("[TECHNICAL] Complete evaluation found in JSON")
          console.log("[TECHNICAL] Using existing JSON")
          console.log("[TECHNICAL] Gemini call: NO\n")

          // Preserve ~30s return timing behavior
          console.log("[TECHNICAL] Waiting ~28 seconds to preserve response-time behavior...")
          await new Promise((resolve) => setTimeout(resolve, 28000))

          return {
            success: true,
            evaluation_table: existingData.evaluation_table,
            technical_overall_insights: existingData.technical_overall_insights,
          }
        } else {
          console.log(`\n[TECHNICAL] ${opName}`)
          console.log("[TECHNICAL] Evaluation missing/incomplete")
          console.log("[TECHNICAL] Gemini call: YES")
          console.log(`[TECHNICAL] Model: ${GEMINI_MODEL}\n`)
        }
      } catch (e: any) {
        console.warn("[TECHNICAL] Error reading technical_evaluation.json:", e?.message)
        console.log(`\n[TECHNICAL] ${opName}`)
        console.log("[TECHNICAL] Evaluation missing/incomplete")
        console.log("[TECHNICAL] Gemini call: YES")
        console.log(`[TECHNICAL] Model: ${GEMINI_MODEL}\n`)
      }
    } else {
      console.log(`\n[TECHNICAL] ${opName}`)
      console.log("[TECHNICAL] Evaluation missing/incomplete")
      console.log("[TECHNICAL] Gemini call: YES")
      console.log(`[TECHNICAL] Model: ${GEMINI_MODEL}\n`)
    }

    /* --------------------------------------------------------
       STEP 6
       GENERATE TECHNICAL EVALUATION PROMPT
    -------------------------------------------------------- */


    const evaluationPrompt =
      generateEvaluationPrompt(
        parameterTable,
        readableProposals,
        rfpText,
        humanEvaluationText
      )

    console.log(
      "\n========== TECHNICAL PROMPT ==========\n"
    )

    console.log(
      evaluationPrompt
    )

    console.log(
      "\n======================================\n"
    )

    /* --------------------------------------------------------
       STEP 7
       GEMINI TECHNICAL EVALUATION
    -------------------------------------------------------- */

    const rawText =
      await callGemini(
        ai,
        evaluationPrompt,
        0
      )

    console.log(
      "\n========== RAW TECHNICAL GEMINI OUTPUT ==========\n"
    )

    console.log(
      rawText
    )

    console.log(
      "\n==================================================\n"
    )

    if (
      !rawText.trim()
    ) {
      return {
        success: false,
        message:
          "Gemini returned an empty technical evaluation.",
      }
    }

    /* --------------------------------------------------------
       STEP 8
       PARSE MARKDOWN TABLE
    -------------------------------------------------------- */

    const parsedTable =
      parseMarkdownTableToJson(
        rawText
      )

    const evaluationTable =
      cleanEvaluationRows(
        parsedTable
      )

    console.log(
      "\n========== PARSED TECHNICAL RESULT ==========\n"
    )

    console.log(
      JSON.stringify(
        evaluationTable,
        null,
        2
      )
    )

    console.log(
      "\n==============================================\n"
    )

    if (
      !evaluationTable.length
    ) {
      return {
        success: false,
        message:
          "Parsing the AI technical evaluation response failed.",
      }
    }

    /* --------------------------------------------------------
       STEP 9
       GENERATE OVERALL INSIGHTS
    -------------------------------------------------------- */

    const proposalNames =
      readableProposals.map(
        (proposal) =>
          proposal.name
      )

    console.log(
      "\n========== GENERATING TECHNICAL OVERALL INSIGHTS =========="
    )

    const technicalOverallInsights =
      await generateTechnicalOverallInsights(
        ai,
        evaluationTable,
        proposalNames
      )

    console.log(
      JSON.stringify(
        technicalOverallInsights,
        null,
        2
      )
    )

    console.log(
      "============================================================\n"
    )

    /* --------------------------------------------------------
       STEP 10
       UPDATE JSON & RETURN RESPONSE
    -------------------------------------------------------- */

    try {
      const payloadToSave = {
        evaluation_table: evaluationTable,
        technical_overall_insights: technicalOverallInsights,
      }
      fs.writeFileSync(TECHNICAL_EVALUATION_JSON_PATH, JSON.stringify(payloadToSave, null, 2), "utf-8")
      console.log(`[TECHNICAL] Updated existing JSON: ${TECHNICAL_EVALUATION_JSON_PATH}`)
    } catch (e: any) {
      console.warn(`[TECHNICAL] Warning: Failed to write to ${TECHNICAL_EVALUATION_JSON_PATH}:`, e?.message)
    }

    return {
      success: true,

      evaluation_table:
        evaluationTable,


      technical_overall_insights:
        technicalOverallInsights,
    }
  } catch (error: any) {
    console.error(
      "\n========== TECHNICAL EVALUATION ERROR =========="
    )

    console.error(
      error
    )

    console.error(
      "===============================================\n"
    )

    return {
      success: false,

      message:
        error?.message ||
        "Unable to perform the technical evaluation.",
    }
  }
}