"use client"

import { useState, useEffect, useRef } from "react"
import InvoiceSnapshotDialog from "./invoice-snapshot-dialog"

// ============================================================
// TYPES
// ============================================================

interface ProcInvoiceAppPageProps {
  poId: string
  onBack: () => void
}

type MatchStatus = "PASS" | "WARNING" | "FAIL"

type ThreeWayCheck = {
  attribute: string
  po: string
  gr: string
  invoice: string
  status: MatchStatus
  reasoning: string
}

type CumulativeDetail = {
  itemCode: string
  description: string
  poQuantity: number
  previousInvoiceQuantity: number
  currentInvoiceQuantity: number
  cumulativeInvoiceQuantity: number
  remainingQuantity: number
  poAmount: number
  previousInvoiceAmount: number
  currentInvoiceAmount: number
  cumulativeInvoiceAmount: number
  remainingAmount: number
  status: MatchStatus
  reasoning: string
}

type ThreeWayResult = {
  confidenceScore: number
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk"
  overallResult: MatchStatus
  summary: string
  recommendation: {
    action: string
    reason: string
  }
  checks: ThreeWayCheck[]
  cumulativeDetails: CumulativeDetail[]
}

// ============================================================
// STATIC SOURCE DATA
//
// PO + GR + CURRENT INVOICE + PREVIOUS INVOICES
//
// Previous invoices are used by AI for cumulative validation.
// ============================================================

const THREE_WAY_SOURCE_DATA = {
  purchaseOrder: {
    poNumber: "PO100245",
    prReference: "542345",
    supplier: "Kaar Technologies",
    awardedDate: "12-Jun-25",

    items: [
      {
        itemCode: "LAP-001",
        description: "Laptop",
        quantity: 100,
        unitPrice: 50000,
        amount: 5000000,
      },
      {
        itemCode: "MON-001",
        description: "Monitor",
        quantity: 100,
        unitPrice: 15000,
        amount: 1500000,
      },
    ],

    totalValue: 6500000,
  },

  // ==========================================================
  // GOODS RECEIPT
  // ==========================================================

  goodsReceipt: {
    grNumber: "GR100501",
    receiptDate: "14-Jun-25",

    items: [
      {
        itemCode: "LAP-001",
        description: "Laptop",
        quantity: 30,
      },
      {
        itemCode: "MON-001",
        description: "Monitor",
        quantity: 30,
      },
    ],
  },

  // ==========================================================
  // CURRENT INVOICE
  // ==========================================================

  invoice: {
    invoiceNumber: "INV5001",
    invoiceDate: "15-Jun-25",
    supplier: "Kaar Technologies",
    currency: "SAR",

    items: [
      {
        itemCode: "LAP-001",
        description: "Laptop",
        quantity: 30,
        unitPrice: 50000,
        amount: 1500000,
      },
      {
        itemCode: "MON-001",
        description: "Monitor",
        quantity: 30,
        unitPrice: 15000,
        amount: 450000,
      },
    ],

    totalAmount: 1950000,
  },

  // ==========================================================
  // PREVIOUS INVOICES
  //
  // IMPORTANT:
  // These are actual previous invoice records.
  //
  // They are sent to AI and used for:
  //
  // Previous Invoice Quantity
  // +
  // Current Invoice Quantity
  // =
  // Cumulative Invoice Quantity
  //
  // AND
  //
  // Previous Invoice Amount
  // +
  // Current Invoice Amount
  // =
  // Cumulative Invoice Amount
  // ==========================================================

  previousInvoices: [
    {
      invoiceNumber: "1070000137",
      invoiceDate: "14-Jun-2025",
      supplier: "Kaar Technologies",
      currency: "SAR",

      items: [
        {
          itemCode: "LAP-001",
          description: "Laptop",
          quantity: 40,
          unitPrice: 50000,
          amount: 2000000,
        },
        {
          itemCode: "MON-001",
          description: "Monitor",
          quantity: 40,
          unitPrice: 15000,
          amount: 600000,
        },
      ],

      totalAmount: 2600000,
    },

    {
      invoiceNumber: "0005600068",
      invoiceDate: "03-Aug-2025",
      supplier: "Kaar Technologies",
      currency: "SAR",

      items: [
        {
          itemCode: "LAP-001",
          description: "Laptop",
          quantity: 20,
          unitPrice: 50000,
          amount: 1000000,
        },
        {
          itemCode: "MON-001",
          description: "Monitor",
          quantity: 20,
          unitPrice: 15000,
          amount: 300000,
        },
      ],

      totalAmount: 1300000,
    },
  ],
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ProcInvoiceAppPage({
  poId,
  onBack,
}: ProcInvoiceAppPageProps) {
  // ==========================================================
  // PAGE STATE
  // ==========================================================

  const [activeSection, setActiveSection] =
    useState("po-details")

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false)

  const [showInvoiceDialog, setShowInvoiceDialog] =
    useState(false)

  // ==========================================================
  // AI 3-WAY MATCH STATE
  // ==========================================================

  const [isValidating, setIsValidating] =
    useState(false)

  const [threeWayResult, setThreeWayResult] =
    useState<ThreeWayResult | null>(null)

  const [validationError, setValidationError] =
    useState("")

  const [expandedAttribute, setExpandedAttribute] =
    useState<string | null>(null)

  // ==========================================================
  // REFS
  // ==========================================================

  const contentRef =
    useRef<HTMLDivElement>(null)

  const sectionRefs =
    useRef<Record<string, HTMLElement>>({})

  // ==========================================================
  // SECTIONS
  // ==========================================================

  const sections = [
    {
      id: "po-details",
      label: "PO details",
      icon: "ri-file-text-line",
    },
    {
      id: "invoice-details",
      label: "Invoice details",
      icon: "ri-file-list-3-line",
    },
    {
      id: "3-way-validation",
      label: "3 way validation",
      icon: "ri-checkbox-multiple-line",
    },
    {
      id: "previous-invoices",
      label: "Previous Invoices",
      icon: "ri-history-line",
    },
    {
      id: "other-ses",
      label: "Other SES in PO",
      icon: "ri-folder-line",
    },
  ]

  // ==========================================================
  // SCROLL HANDLER
  // ==========================================================

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const scrollPosition =
        contentRef.current.scrollTop + 100

      for (
        let i = sections.length - 1;
        i >= 0;
        i--
      ) {
        const section =
          sectionRefs.current[
            sections[i].id
          ]

        if (
          section &&
          section.offsetTop <= scrollPosition
        ) {
          setActiveSection(
            sections[i].id
          )

          break
        }
      }
    }

    const content =
      contentRef.current

    if (content) {
      content.addEventListener(
        "scroll",
        handleScroll
      )

      return () =>
        content.removeEventListener(
          "scroll",
          handleScroll
        )
    }
  }, [])

  // ==========================================================
  // SCROLL TO SECTION
  // ==========================================================

  const scrollToSection = (
    sectionId: string
  ) => {
    const section =
      sectionRefs.current[
        sectionId
      ]

    if (
      section &&
      contentRef.current
    ) {
      const offsetTop =
        section.offsetTop - 20

      contentRef.current.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  // ==========================================================
  // TOGGLE SIDEBAR
  // ==========================================================

  const toggleSidebar = () => {
    setIsSidebarCollapsed(
      !isSidebarCollapsed
    )
  }

  // ==========================================================
  // SCORE / STATUS HELPERS
  // ==========================================================

  const getStatusClass = (
    status: MatchStatus
  ) => {
    switch (status) {
      case "PASS":
        return {
          badge:
            "bg-green-100 text-green-700",
          icon:
            "bg-green-500",
          iconText: "✓",
          text:
            "text-green-700",
        }

      case "WARNING":
        return {
          badge:
            "bg-orange-100 text-orange-700",
          icon:
            "bg-orange-500",
          iconText: "!",
          text:
            "text-orange-700",
        }

      case "FAIL":
        return {
          badge:
            "bg-red-100 text-red-700",
          icon:
            "bg-red-500",
          iconText: "×",
          text:
            "text-red-700",
        }

      default:
        return {
          badge:
            "bg-gray-100 text-gray-700",
          icon:
            "bg-gray-500",
          iconText: "?",
          text:
            "text-gray-700",
        }
    }
  }

  // ==========================================================
  // RUN AI 3-WAY MATCH
  // ==========================================================

  const runThreeWayMatch = async () => {
    setIsValidating(true)
    setValidationError("")
    setThreeWayResult(null)
    setExpandedAttribute(null)

    try {
      // ======================================================
      // GEMINI API KEY
      // ======================================================

      // ======================================================
      // AI PROMPT
      // ======================================================

      const prompt = `
You are an expert Procure-to-Pay (P2P),
Accounts Payable, and Three-Way Match AI Assistant.

Your task is to perform a CORE THREE-WAY MATCH between:

1. Purchase Order (PO)
2. Goods Receipt (GR)
3. Current Supplier Invoice

You must ALSO use the supplied previous invoices
for cumulative invoice validation.

IMPORTANT:

The core three-way match relationship is:

PO ↔ GR ↔ Current Invoice

Previous invoices are additional transaction history
used specifically for cumulative quantity and cumulative
amount validation against the PO.

Do NOT use Certificate of Completion (CoC).

Use ONLY the data provided below.

Do NOT invent values.

Do NOT assume missing information.

Do NOT use external information.

Return ONLY valid JSON.

==========================================================
PURCHASE ORDER
==========================================================

${JSON.stringify(
  THREE_WAY_SOURCE_DATA.purchaseOrder,
  null,
  2
)}

==========================================================
GOODS RECEIPT
==========================================================

${JSON.stringify(
  THREE_WAY_SOURCE_DATA.goodsReceipt,
  null,
  2
)}

==========================================================
CURRENT INVOICE
==========================================================

${JSON.stringify(
  THREE_WAY_SOURCE_DATA.invoice,
  null,
  2
)}

==========================================================
PREVIOUS INVOICES
==========================================================

These are actual previous invoices for the same PO.

Use ALL previous invoices when calculating cumulative
invoice quantity and cumulative invoice amount.

${JSON.stringify(
  THREE_WAY_SOURCE_DATA.previousInvoices,
  null,
  2
)}

==========================================================
CHECK 1 — PO ITEM ↔ CURRENT INVOICE ITEM
==========================================================

For every current invoice line item:

Verify that the invoice item exists in the PO.

Use itemCode as the primary identifier.

PASS:
Every current invoice item exists in the PO.

FAIL:
A current invoice item does not exist in the PO.

Do not consider description matching sufficient when
itemCode is available.

==========================================================
CHECK 2 — PO UNIT PRICE ↔ CURRENT INVOICE UNIT PRICE
==========================================================

For every current invoice line item:

Compare:

PO unit price
vs
Current invoice unit price

PASS:
Invoice unit price equals PO unit price.

WARNING:
There is a difference that may require business review.

FAIL:
Invoice unit price is higher than PO unit price and there
is no evidence of an approved tolerance.

Do NOT invent a tolerance.

If no tolerance is supplied, exact equality is PASS.

==========================================================
CHECK 3 — GR QUANTITY ↔ CURRENT INVOICE QUANTITY
==========================================================

For every current invoice line item:

Compare:

GR received quantity
vs
Current invoice quantity

PASS:
Current invoice quantity equals GR quantity.

WARNING:
Current invoice quantity is lower than GR quantity.

FAIL:
Current invoice quantity is greater than GR quantity.

The supplier should not invoice more quantity than has
been received in the current GR.

==========================================================
CHECK 4 — CUMULATIVE INVOICE QUANTITY ↔ PO QUANTITY
==========================================================

This is VERY IMPORTANT.

Use ALL previous invoices supplied above.

For each PO item:

1. Find the same itemCode in every previous invoice.
2. Add the quantities from all previous invoices.
3. Add the current invoice quantity.
4. Calculate cumulative invoice quantity.
5. Compare cumulative invoice quantity against PO quantity.
6. Calculate remaining PO quantity.

Formula:

Previous Invoice Quantity from ALL previous invoices
+
Current Invoice Quantity
=
Cumulative Invoice Quantity

Then:

PO Quantity
-
Cumulative Invoice Quantity
=
Remaining PO Quantity

PASS:
Cumulative invoice quantity <= PO quantity.

WARNING:
Cumulative invoice quantity is close to PO quantity but
does not exceed it.

FAIL:
Cumulative invoice quantity > PO quantity.

IMPORTANT:
Do NOT ignore previous invoices.

IMPORTANT:
Do NOT use only the current invoice.

==========================================================
CHECK 5 — CUMULATIVE INVOICE AMOUNT ↔ PO AMOUNT
==========================================================

This is also VERY IMPORTANT.

For each PO item:

1. Find the same itemCode in every previous invoice.
2. Add the amounts from ALL previous invoices.
3. Add the current invoice amount.
4. Calculate cumulative invoice amount.
5. Compare cumulative invoice amount against PO amount.
6. Calculate remaining PO amount.

Formula:

Previous Invoice Amount from ALL previous invoices
+
Current Invoice Amount
=
Cumulative Invoice Amount

Then:

PO Amount
-
Cumulative Invoice Amount
=
Remaining PO Amount

PASS:
Cumulative invoice amount <= PO amount.

WARNING:
Cumulative invoice amount is close to PO amount but
does not exceed it.

FAIL:
Cumulative invoice amount > PO amount.

IMPORTANT:
This must be checked independently from quantity.

The cumulative validation must include BOTH:

1. Quantity
2. Amount

==========================================================
CHECK 6 — CURRENT INVOICE AMOUNT CALCULATION
==========================================================

For every current invoice line:

Invoice Quantity × Invoice Unit Price
=
Expected Invoice Line Amount

Then:

Sum of all expected line amounts
=
Expected Invoice Total

Compare the calculated total against supplied
current invoice totalAmount.

PASS:
Calculated invoice total equals supplied invoice total.

WARNING:
There is a minor difference.

FAIL:
The invoice total materially differs from the calculated
line-item total.

==========================================================
IMPORTANT THREE-WAY MATCH SCOPE
==========================================================

Core checks:

1. Item
2. Unit Price
3. Current GR Quantity vs Current Invoice Quantity
4. Cumulative Invoice Quantity vs PO Quantity
5. Cumulative Invoice Amount vs PO Amount
6. Current Invoice Amount Calculation

Do NOT introduce:

- Payment terms
- Completion date
- Milestone
- CoC
- Tax
- Description semantic matching

as core three-way-match checks.

==========================================================
CUMULATIVE CALCULATION EXAMPLE
==========================================================

If:

PO Quantity = 100

Previous Invoice 1 Quantity = 40
Previous Invoice 2 Quantity = 20
Current Invoice Quantity = 30

Then:

Cumulative Invoice Quantity =
40 + 20 + 30 = 90

Remaining Quantity =
100 - 90 = 10

If:

PO Amount = 5,000,000

Previous Invoice 1 Amount = 2,000,000
Previous Invoice 2 Amount = 1,000,000
Current Invoice Amount = 1,500,000

Then:

Cumulative Invoice Amount =
2,000,000 + 1,000,000 + 1,500,000
= 4,500,000

Remaining Amount =
5,000,000 - 4,500,000
= 500,000

Use the ACTUAL supplied data when producing the result.

==========================================================
OVERALL RESULT
==========================================================

If all checks PASS:

overallResult = "PASS"

If there is at least one WARNING and no FAIL:

overallResult = "WARNING"

If there is at least one FAIL:

overallResult = "FAIL"

==========================================================
CONFIDENCE SCORE
==========================================================

Return a realistic confidence score from 0 to 100.

IMPORTANT:
Do NOT automatically return 100 when all checks pass.

The confidence score represents the AI's confidence in the
validation conclusion based on the quality, completeness,
and consistency of the supplied PO, GR, current invoice,
and previous invoice data.

Use the following guidance:

90–96:
Very strong agreement. All required data is available and
the core checks pass with exact or near-exact matches.

85–89:
Strong agreement, but there are limitations such as limited
historical transaction data or a small amount of uncertainty.

70–84:
Generally consistent, but one or more warnings require review.

55–69:
Meaningful uncertainty or multiple warnings exist.

20–54:
Significant discrepancy or failed validation exists.

0–19:
The supplied data is insufficient or highly inconsistent.

IMPORTANT RULES:

1. Do NOT return 100 unless there is an exceptional reason
   and the supplied data is completely comprehensive.

2. For a normal successful three-way match with complete
   current PO, GR and invoice data, prefer a score between
   90 and 96.

3. If previous invoice data is available and included in the
   cumulative validation, consider it when calculating the
   confidence score.

4. If previous invoice history is incomplete, do not give an
   extremely high confidence score.

5. The confidence score must reflect uncertainty in the
   available data, not simply the number of PASS results.

6. A PASS result does not automatically mean 100% confidence.

7. Never invent missing transaction history.

8. The score must be an integer between 0 and 100.

==========================================================
RISK LEVEL
==========================================================

Choose exactly:

"Low Risk"
"Medium Risk"
"High Risk"

Suggested logic:

PASS = Low Risk
WARNING = Medium Risk
FAIL = High Risk

==========================================================
RECOMMENDATION
==========================================================

Use one of:

"Proceed with Invoice Processing"

"Route for Finance Approval"

"Request Vendor Clarification"

"Reject Invoice"

Recommendation logic:

PASS:
Proceed with Invoice Processing

WARNING:
Route for Finance Approval
or
Request Vendor Clarification

FAIL:
Reject Invoice

==========================================================
OUTPUT FORMAT
==========================================================

Return exactly this JSON structure:

{
  "confidenceScore": 95,
  "riskLevel": "Low Risk",
  "overallResult": "PASS",
  "summary": "The PO, GR, current invoice and previous invoice history were reviewed. Current quantities match the GR, unit prices match the PO, and cumulative quantity and amount remain within PO limits.",
  "recommendation": {
    "action": "Proceed with Invoice Processing",
    "reason": "All core three-way match checks passed."
  },
  "checks": [
    {
      "attribute": "PO Item Validation",
      "po": "Laptop, Monitor",
      "gr": "Laptop, Monitor",
      "invoice": "Laptop, Monitor",
      "status": "PASS",
      "reasoning": "All current invoice items exist in the PO."
    },
    {
      "attribute": "Unit Price Validation",
      "po": "Laptop: 50000; Monitor: 15000",
      "gr": "-",
      "invoice": "Laptop: 50000; Monitor: 15000",
      "status": "PASS",
      "reasoning": "Current invoice unit prices match the corresponding PO unit prices."
    },
    {
      "attribute": "GR vs Invoice Quantity",
      "po": "Laptop: 100; Monitor: 100",
      "gr": "Laptop: 30; Monitor: 30",
      "invoice": "Laptop: 30; Monitor: 30",
      "status": "PASS",
      "reasoning": "Current invoice quantities match the quantities received in the current GR."
    },
    {
      "attribute": "Cumulative Quantity vs PO",
      "po": "Laptop: 100; Monitor: 100",
      "gr": "Cumulative GR: Laptop 30; Monitor 30",
      "invoice": "Previous Invoice Qty + Current Invoice Qty",
      "status": "PASS",
      "reasoning": "Cumulative invoice quantities remain within PO quantities after including all previous invoices."
    },
    {
      "attribute": "Cumulative Amount vs PO",
      "po": "Laptop: 5000000; Monitor: 1500000",
      "gr": "-",
      "invoice": "Previous Invoice Amount + Current Invoice Amount",
      "status": "PASS",
      "reasoning": "Cumulative invoice amounts remain within the corresponding PO amounts after including all previous invoices."
    },
    {
      "attribute": "Invoice Amount Calculation",
      "po": "Laptop: 50000 × 30; Monitor: 15000 × 30",
      "gr": "-",
      "invoice": "Expected total: 1950000; Invoice total: 1950000",
      "status": "PASS",
      "reasoning": "The calculated current invoice total matches the supplied invoice total."
    }
  ],
  "cumulativeDetails": [
    {
      "itemCode": "LAP-001",
      "description": "Laptop",
      "poQuantity": 100,
      "previousInvoiceQuantity": 60,
      "currentInvoiceQuantity": 30,
      "cumulativeInvoiceQuantity": 90,
      "remainingQuantity": 10,
      "poAmount": 5000000,
      "previousInvoiceAmount": 3000000,
      "currentInvoiceAmount": 1500000,
      "cumulativeInvoiceAmount": 4500000,
      "remainingAmount": 500000,
      "status": "PASS",
      "reasoning": "Previous invoices contain 60 laptops and the current invoice adds 30, resulting in 90 cumulative invoiced laptops against the PO quantity of 100. The cumulative amount is 4,500,000 SAR against the PO amount of 5,000,000 SAR, leaving 500,000 SAR."
    },
    {
      "itemCode": "MON-001",
      "description": "Monitor",
      "poQuantity": 100,
      "previousInvoiceQuantity": 60,
      "currentInvoiceQuantity": 30,
      "cumulativeInvoiceQuantity": 90,
      "remainingQuantity": 10,
      "poAmount": 1500000,
      "previousInvoiceAmount": 900000,
      "currentInvoiceAmount": 450000,
      "cumulativeInvoiceAmount": 1350000,
      "remainingAmount": 150000,
      "status": "PASS",
      "reasoning": "Previous invoices contain 60 monitors and the current invoice adds 30, resulting in 90 cumulative invoiced monitors against the PO quantity of 100. The cumulative amount is 1,350,000 SAR against the PO amount of 1,500,000 SAR, leaving 150,000 SAR."
    }
  ]
}

Do not return markdown.
Do not return explanations outside the JSON.
`

      // ======================================================
      // GEMINI API
      // ======================================================

      const response = await fetch("/api/gemini", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: prompt,

          config: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
      })

      // ======================================================
      // API ERROR
      // ======================================================

      if (!response.ok) {
        const errorText =
          await response.text()

        console.error(
          "Gemini API error:",
          errorText
        )

        throw new Error(
          `AI 3-way match request failed (${response.status}).`
        )
      }

      const data =
        await response.json()

      console.log(
        "AI 3-WAY MATCH RESPONSE:",
        data
      )

      // ======================================================
      // EXTRACT RESPONSE
      // ======================================================

      const rawText =
        data?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text


      if (!rawText) {
        throw new Error(
          "AI returned an empty response."
        )
      }

      // ======================================================
      // PARSE JSON
      // ======================================================

      let parsedResult: any

      try {
        parsedResult =
          JSON.parse(rawText)
      } catch (parseError) {
        console.error(
          "Unable to parse AI JSON:",
          rawText
        )

        throw new Error(
          "AI returned an invalid JSON response."
        )
      }

      // ======================================================
      // NORMALIZE CHECKS
      // ======================================================

      const normalizedChecks =
        Array.isArray(
          parsedResult.checks
        )
          ? parsedResult.checks.map(
              (check: any) => ({
                attribute:
                  check.attribute ||
                  "Unknown",

                po:
                  String(
                    check.po ?? "-"
                  ),

                gr:
                  String(
                    check.gr ?? "-"
                  ),

                invoice:
                  String(
                    check.invoice ?? "-"
                  ),

                status:
                  check.status ===
                    "PASS" ||
                  check.status ===
                    "WARNING" ||
                  check.status ===
                    "FAIL"
                    ? check.status
                    : "WARNING",

                reasoning:
                  check.reasoning ||
                  "No AI reasoning provided.",
              })
            )
          : []

      // ======================================================
      // NORMALIZE CUMULATIVE DETAILS
      // ======================================================

      const normalizedCumulativeDetails =
        Array.isArray(
          parsedResult.cumulativeDetails
        )
          ? parsedResult.cumulativeDetails.map(
              (item: any) => ({
                itemCode:
                  String(
                    item.itemCode ?? "-"
                  ),

                description:
                  String(
                    item.description ?? "-"
                  ),

                poQuantity:
                  Number(
                    item.poQuantity
                  ) || 0,

                previousInvoiceQuantity:
                  Number(
                    item.previousInvoiceQuantity
                  ) || 0,

                currentInvoiceQuantity:
                  Number(
                    item.currentInvoiceQuantity
                  ) || 0,

                cumulativeInvoiceQuantity:
                  Number(
                    item.cumulativeInvoiceQuantity
                  ) || 0,

                remainingQuantity:
                  Number(
                    item.remainingQuantity
                  ) || 0,

                poAmount:
                  Number(
                    item.poAmount
                  ) || 0,

                previousInvoiceAmount:
                  Number(
                    item.previousInvoiceAmount
                  ) || 0,

                currentInvoiceAmount:
                  Number(
                    item.currentInvoiceAmount
                  ) || 0,

                cumulativeInvoiceAmount:
                  Number(
                    item.cumulativeInvoiceAmount
                  ) || 0,

                remainingAmount:
                  Number(
                    item.remainingAmount
                  ) || 0,

                status:
                  item.status ===
                    "PASS" ||
                  item.status ===
                    "WARNING" ||
                  item.status ===
                    "FAIL"
                    ? item.status
                    : "WARNING",

                reasoning:
                  item.reasoning ||
                  "No AI cumulative reasoning provided.",
              })
            )
          : []

      // ======================================================
      // NORMALIZE RESULT
      // ======================================================

      const normalizedResult: ThreeWayResult =
        {
          confidenceScore:
            Math.min(
              100,
              Math.max(
                0,
                Number(
                  parsedResult.confidenceScore
                ) || 0
              )
            ),

          riskLevel:
            parsedResult.riskLevel ===
              "Low Risk" ||
            parsedResult.riskLevel ===
              "Medium Risk" ||
            parsedResult.riskLevel ===
              "High Risk"
              ? parsedResult.riskLevel
              : "Medium Risk",

          overallResult:
            parsedResult.overallResult ===
              "PASS" ||
            parsedResult.overallResult ===
              "WARNING" ||
            parsedResult.overallResult ===
              "FAIL"
              ? parsedResult.overallResult
              : "WARNING",

          summary:
            parsedResult.summary ||
            "No AI summary provided.",

          recommendation:
            {
              action:
                parsedResult
                  ?.recommendation
                  ?.action ||
                "Route for Finance Approval",

              reason:
                parsedResult
                  ?.recommendation
                  ?.reason ||
                "Manual review is recommended.",
            },

          checks:
            normalizedChecks,

          cumulativeDetails:
            normalizedCumulativeDetails,
        }

      console.log(
        "NORMALIZED 3-WAY RESULT:",
        normalizedResult
      )

      setThreeWayResult(
        normalizedResult
      )

      // ======================================================
      // AUTO EXPAND FIRST ISSUE
      // ======================================================

      const firstIssue =
        normalizedChecks.find(
          (check:any) =>
            check.status !==
            "PASS"
        )

      if (firstIssue) {
        setExpandedAttribute(
          firstIssue.attribute
        )
      }
    } catch (error) {
      console.error(
        "3-way match AI error:",
        error
      )

      setValidationError(
        error instanceof Error
          ? error.message
          : "Unable to complete AI 3-way match."
      )
    } finally {
      setIsValidating(false)
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">

        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <i className="ri-arrow-left-line text-lg"></i>
          </button>

          <h1 className="text-2xl font-semibold text-[#1B733D]">
            Invoice app
          </h1>

        </div>

        <div className="flex items-center gap-3">

          <button
            className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <i className="ri-message-2-line text-base"></i>
            Comments
          </button>

          <button
            className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 shadow-sm"
          >
            <i className="ri-save-line text-base"></i>
            Save
          </button>

        </div>

      </div>

      {/* ====================================================
          MAIN LAYOUT
      ==================================================== */}

      <div className="flex-1 flex overflow-hidden">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <div
          className={`bg-white rounded-lg flex-shrink-0 h-full overflow-hidden flex flex-col ml-4 mt-4 transition-all duration-300 ${
            isSidebarCollapsed
              ? "w-16"
              : "w-[281px]"
          }`}
        >

          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">

            {!isSidebarCollapsed && (
              <h3 className="text-sm font-normal text-[#45546E]">
                Sections
              </h3>
            )}

            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <i
                className={`ri-menu-${
                  isSidebarCollapsed
                    ? "unfold"
                    : "fold"
                }-line text-lg text-gray-600`}
              />
            </button>

          </div>

          <div className="flex-1 overflow-y-auto py-4">

            {sections.map(
              (section) => (

                <button
                  key={
                    section.id
                  }
                  onClick={() =>
                    scrollToSection(
                      section.id
                    )
                  }
                  className={`w-full px-6 py-3 text-left text-sm flex items-center gap-3 transition-colors relative hover:bg-gray-50 ${
                    activeSection ===
                    section.id
                      ? "text-[#1B733D] font-medium bg-gray-50"
                      : "text-[#45546E] font-normal"
                  } ${
                    isSidebarCollapsed
                      ? "justify-center"
                      : ""
                  }`}
                >

                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                      activeSection ===
                      section.id
                        ? "bg-[#1B733D]"
                        : "bg-transparent"
                    }`}
                  />

                  <i
                    className={`${section.icon} text-lg`}
                  />

                  {!isSidebarCollapsed && (
                    <span>
                      {
                        section.label
                      }
                    </span>
                  )}

                </button>

              )
            )}

          </div>

        </div>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="flex-1 flex flex-col h-full overflow-hidden ml-4 mt-4">

          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >

            <div className="space-y-4 pb-6">

              {/* =================================================
                  PO DETAILS
              ================================================= */}

              <div
                ref={(el) => {
                  if (el)
                    sectionRefs.current[
                      "po-details"
                    ] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >

                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">
                  PO details
                </h2>

                <div className="grid grid-cols-3 gap-6">

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      PO Reference Number
                    </p>

                    <p className="text-sm font-medium text-[#1B733D]">
                      {
                        THREE_WAY_SOURCE_DATA
                          .purchaseOrder
                          .poNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      PR Reference
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .purchaseOrder
                          .prReference
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Supplier
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .purchaseOrder
                          .supplier
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Awarded date
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .purchaseOrder
                          .awardedDate
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      PO Total Value
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {THREE_WAY_SOURCE_DATA.purchaseOrder.totalValue.toLocaleString()} SAR
                    </p>
                  </div>

                </div>

                <div className="mt-6">

                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    PO Line Items
                  </p>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">

                    <table className="w-full">

                      <thead className="bg-gray-50">

                        <tr>

                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                            Item
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            PO Quantity
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Unit Price
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            PO Amount
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {THREE_WAY_SOURCE_DATA.purchaseOrder.items.map(
                          (item) => (

                            <tr
                              key={
                                item.itemCode
                              }
                              className="border-t border-gray-200"
                            >

                              <td className="px-4 py-3">

                                <p className="text-sm font-medium text-gray-900">
                                  {
                                    item.description
                                  }
                                </p>

                                <p className="text-xs text-gray-500">
                                  {
                                    item.itemCode
                                  }
                                </p>

                              </td>

                              <td className="px-4 py-3 text-right text-sm text-gray-700">
                                {
                                  item.quantity
                                }
                              </td>

                              <td className="px-4 py-3 text-right text-sm text-gray-700">
                                {item.unitPrice.toLocaleString()} SAR
                              </td>

                              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                {item.amount.toLocaleString()} SAR
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

              {/* =================================================
                  INVOICE DETAILS
              ================================================= */}

              <div
                ref={(el) => {
                  if (el)
                    sectionRefs.current[
                      "invoice-details"
                    ] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >

                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">
                  Invoice details
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-6">

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Invoice number
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .invoice
                          .invoiceNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Invoice date
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .invoice
                          .invoiceDate
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Supplier
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .invoice
                          .supplier
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Currency
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {
                        THREE_WAY_SOURCE_DATA
                          .invoice
                          .currency
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Invoice Total
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {THREE_WAY_SOURCE_DATA.invoice.totalAmount.toLocaleString()} SAR
                    </p>
                  </div>

                </div>

                <div className="mb-6">

                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Invoice Line Items
                  </p>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">

                    <table className="w-full">

                      <thead className="bg-gray-50">

                        <tr>

                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                            Item
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Quantity
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Unit Price
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Amount
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {THREE_WAY_SOURCE_DATA.invoice.items.map(
                          (item) => (

                            <tr
                              key={
                                item.itemCode
                              }
                              className="border-t border-gray-200"
                            >

                              <td className="px-4 py-3">

                                <p className="text-sm font-medium text-gray-900">
                                  {
                                    item.description
                                  }
                                </p>

                                <p className="text-xs text-gray-500">
                                  {
                                    item.itemCode
                                  }
                                </p>

                              </td>

                              <td className="px-4 py-3 text-right text-sm text-gray-700">
                                {
                                  item.quantity
                                }
                              </td>

                              <td className="px-4 py-3 text-right text-sm text-gray-700">
                                {item.unitPrice.toLocaleString()} SAR
                              </td>

                              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                {item.amount.toLocaleString()} SAR
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                <div className="mb-6">

                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Attachments
                  </p>

                  <div className="mb-4">

                    <div className="flex items-center justify-between mb-2">

                      <h3 className="text-sm font-medium text-gray-900">
                        Invoice (1)
                      </h3>

                      <div className="flex items-center gap-2">

                        <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md">

                          <i className="ri-download-line" />

                          Download All

                        </button>

                        <button className="p-1 hover:bg-gray-100 rounded">

                          <i className="ri-arrow-up-s-line text-gray-600" />

                        </button>

                      </div>

                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                      <div className="flex items-center justify-between px-4 py-3 bg-[#1B733D]">

                        <span className="text-sm font-medium text-white">
                          Attachment
                        </span>

                        <span className="text-sm font-medium text-white">
                          Uploaded date
                        </span>

                      </div>

                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          setShowInvoiceDialog(
                            true
                          )
                        }
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">

                            <i className="ri-file-pdf-line text-red-600 text-xl" />

                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-900">
                              Invoice 1
                            </p>

                            <p className="text-xs text-gray-500">
                              6.5kb
                            </p>

                          </div>

                          <button
                            className="ml-2 p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >

                            <i className="ri-download-line text-gray-600" />

                          </button>

                        </div>

                        <span className="text-sm text-gray-600">
                          02-Aug-2022
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  AI 3-WAY MATCH VALIDATION
              ================================================= */}

              <div
                ref={(el) => {
                  if (el)
                    sectionRefs.current[
                      "3-way-validation"
                    ] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >

                <div className="flex items-start justify-between gap-6 mb-6">

                  <div>

                    <div className="flex items-center gap-3">

                      <h2 className="text-lg font-semibold text-[#1B733D]">
                        3 Way Match Validation
                      </h2>

                      {threeWayResult && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            getStatusClass(
                              threeWayResult.overallResult
                            ).badge
                          }`}
                        >
                          {
                            threeWayResult.overallResult
                          }
                        </span>
                      )}

                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      AI-powered core validation of PO, Goods Receipt, current Invoice and previous invoice history
                    </p>

                  </div>

                  <button
                    onClick={
                      runThreeWayMatch
                    }
                    disabled={
                      isValidating
                    }
                    className="px-5 py-2.5 bg-[#1B733D] text-white rounded-lg text-sm font-semibold hover:bg-[#155a30] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                  >

                    {isValidating ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" />
                        Running AI Match...
                      </>
                    ) : (
                      <>
                        <i className="ri-sparkling-2-line" />
                        {threeWayResult
                          ? "Re-run AI 3-Way Match"
                          : "Run AI 3-Way Match"}
                      </>
                    )}

                  </button>

                </div>

                {/* MATCH FLOW */}

                <div className="mb-6 grid grid-cols-3 gap-4">

                  <div className="border border-gray-200 rounded-xl p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">

                        <i className="ri-file-text-line text-[#1B733D] text-lg" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">
                          Source 1
                        </p>

                        <p className="text-sm font-bold text-gray-900">
                          Purchase Order
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">

                        <i className="ri-inbox-line text-blue-600 text-lg" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">
                          Source 2
                        </p>

                        <p className="text-sm font-bold text-gray-900">
                          Goods Receipt
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">

                        <i className="ri-file-list-3-line text-orange-600 text-lg" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">
                          Source 3
                        </p>

                        <p className="text-sm font-bold text-gray-900">
                          Invoice
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ERROR */}

                {validationError && (

                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                    <div className="flex items-start gap-3">

                      <i className="ri-error-warning-line text-red-600 text-lg" />

                      <div>

                        <p className="text-sm font-semibold text-red-700">
                          AI validation failed
                        </p>

                        <p className="text-sm text-red-600 mt-1">
                          {
                            validationError
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* EMPTY STATE */}

                {!threeWayResult &&
                  !isValidating &&
                  !validationError && (

                    <div className="border border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center">

                      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">

                        <i className="ri-sparkling-2-line text-2xl text-[#1B733D]" />

                      </div>

                      <h3 className="text-base font-semibold text-gray-900">
                        AI 3-Way Match is ready
                      </h3>

                      <p className="text-sm text-gray-500 max-w-lg mt-2">
                        Click "Run AI 3-Way Match" to compare PO, Goods Receipt, current Invoice and previous invoices.
                      </p>

                    </div>

                  )}

                {/* LOADING */}

                {isValidating && (

                  <div className="border border-gray-200 rounded-xl p-10">

                    <div className="flex flex-col items-center justify-center">

                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">

                        <i className="ri-sparkling-2-line text-2xl text-[#1B733D] animate-pulse" />

                      </div>

                      <p className="mt-4 text-sm font-semibold text-gray-900">
                        AI is comparing PO, GR, current Invoice and previous invoices...
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Checking item, unit price, received quantity, cumulative quantity and cumulative amount.
                      </p>

                      <div className="flex items-center gap-1.5 mt-4">

                        <span className="w-2 h-2 bg-[#1B733D] rounded-full animate-bounce" />

                        <span className="w-2 h-2 bg-[#1B733D] rounded-full animate-bounce [animation-delay:150ms]" />

                        <span className="w-2 h-2 bg-[#1B733D] rounded-full animate-bounce [animation-delay:300ms]" />

                      </div>

                    </div>

                  </div>

                )}

                {/* RESULT */}

                {threeWayResult && !isValidating && (

                  <div className="space-y-5">

                    {/* SUMMARY METRICS */}

                    <div className="grid grid-cols-3 gap-4">

                      <div className="border border-gray-200 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Confidence Score
                        </p>

                        <p className="text-3xl font-bold text-[#1B733D] mt-1">
                          {
                            threeWayResult.confidenceScore
                          }
                          %
                        </p>

                      </div>

                      <div className="border border-gray-200 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Risk Level
                        </p>

                        <span
                          className={`inline-flex mt-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                            threeWayResult.riskLevel ===
                            "Low Risk"
                              ? "bg-green-100 text-green-700"
                              : threeWayResult.riskLevel ===
                                "Medium Risk"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            threeWayResult.riskLevel
                          }
                        </span>

                      </div>

                      <div className="border border-gray-200 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Overall Match Result
                        </p>

                        <div className="flex items-center gap-2 mt-2">

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              getStatusClass(
                                threeWayResult.overallResult
                              ).icon
                            }`}
                          >
                            {
                              getStatusClass(
                                threeWayResult.overallResult
                              ).iconText
                            }
                          </div>

                          <span
                            className={`text-lg font-bold ${
                              getStatusClass(
                                threeWayResult.overallResult
                              ).text
                            }`}
                          >
                            {
                              threeWayResult.overallResult
                            }
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* VALIDATION TABLE */}

                    <div className="border border-gray-200 rounded-xl overflow-hidden">

                      <div className="overflow-x-auto">

                        <table className="w-full">

                          <thead>

                            <tr className="bg-[#1B733D] text-white">

                              <th className="px-4 py-3 text-left text-xs font-semibold min-w-[190px]">
                                Validation
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold min-w-[210px]">
                                PO
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold min-w-[210px]">
                                GR
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold min-w-[210px]">
                                Invoice
                              </th>

                              <th className="px-4 py-3 text-center text-xs font-semibold min-w-[130px]">
                                Status
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold min-w-[320px]">
                                AI Reasoning
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {threeWayResult.checks.map(
                              (check) => {

                                const isExpanded =
                                  expandedAttribute ===
                                  check.attribute

                                const statusStyle =
                                  getStatusClass(
                                    check.status
                                  )

                                return (

                                  <tr
                                    key={
                                      check.attribute
                                    }
                                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                                  >

                                    <td className="px-4 py-4 align-top">

                                      <div className="flex items-center gap-3">

                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">

                                          <i
                                            className={
                                              check.attribute
                                                .toLowerCase()
                                                .includes(
                                                  "item"
                                                )
                                                ? "ri-price-tag-3-line text-[#1B733D]"
                                                : check.attribute
                                                    .toLowerCase()
                                                    .includes(
                                                      "price"
                                                    )
                                                ? "ri-money-dollar-circle-line text-[#1B733D]"
                                                : check.attribute
                                                    .toLowerCase()
                                                    .includes(
                                                      "quantity"
                                                    )
                                                ? "ri-stack-line text-[#1B733D]"
                                                : check.attribute
                                                    .toLowerCase()
                                                    .includes(
                                                      "amount"
                                                    )
                                                ? "ri-money-dollar-circle-line text-[#1B733D]"
                                                : "ri-calculator-line text-[#1B733D]"
                                            }
                                          />

                                        </div>

                                        <span className="text-sm font-semibold text-gray-900">
                                          {
                                            check.attribute
                                          }
                                        </span>

                                      </div>

                                    </td>

                                    <td className="px-4 py-4 align-top">

                                      <span className="text-sm text-gray-700 whitespace-pre-line">
                                        {
                                          check.po
                                        }
                                      </span>

                                    </td>

                                    <td className="px-4 py-4 align-top">

                                      <span className="text-sm text-gray-700 whitespace-pre-line">
                                        {
                                          check.gr
                                        }
                                      </span>

                                    </td>

                                    <td className="px-4 py-4 align-top">

                                      <span className="text-sm text-gray-700 whitespace-pre-line">
                                        {
                                          check.invoice
                                        }
                                      </span>

                                    </td>

                                    <td className="px-4 py-4 align-top">

                                      <div className="flex justify-center">

                                        <span
                                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${statusStyle.badge}`}
                                        >

                                          <span
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${statusStyle.icon}`}
                                          >
                                            {
                                              statusStyle.iconText
                                            }
                                          </span>

                                          {
                                            check.status
                                          }

                                        </span>

                                      </div>

                                    </td>

                                    <td className="px-4 py-4 align-top">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedAttribute(
                                            isExpanded
                                              ? null
                                              : check.attribute
                                          )
                                        }
                                        className="w-full text-left"
                                      >

                                        <div className="flex items-start justify-between gap-3">

                                          <p className="text-sm text-gray-600 leading-5">
                                            {
                                              check.reasoning
                                            }
                                          </p>

                                          <i
                                            className={`ri-arrow-down-s-line text-gray-500 flex-shrink-0 transition-transform ${
                                              isExpanded
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                          />

                                        </div>

                                      </button>

                                      {isExpanded && (

                                        <div
                                          className={`mt-3 rounded-lg p-3 border ${
                                            check.status ===
                                            "PASS"
                                              ? "bg-green-50 border-green-100"
                                              : check.status ===
                                                "WARNING"
                                              ? "bg-orange-50 border-orange-100"
                                              : "bg-red-50 border-red-100"
                                          }`}
                                        >

                                          <p className="text-xs uppercase tracking-wide font-bold text-gray-500 mb-1">
                                            AI Reasoning
                                          </p>

                                          <p className="text-sm text-gray-700 leading-6">
                                            {
                                              check.reasoning
                                            }
                                          </p>

                                        </div>

                                      )}

                                    </td>

                                  </tr>

                                )
                              }
                            )}

                          </tbody>

                        </table>

                      </div>

                    </div>

                    {/* =================================================
                        AI CUMULATIVE QUANTITY + AMOUNT
                    ================================================= */}

                    <div className="border border-gray-200 rounded-xl p-5">

                      <div className="flex items-center justify-between mb-4">

                        <div>

                          <h3 className="text-sm font-bold text-gray-900">
                            Cumulative PO Quantity & Amount
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            AI has included all previous invoices and the current invoice when evaluating cumulative PO consumption.
                          </p>

                        </div>

                        <i className="ri-bar-chart-horizontal-line text-[#1B733D] text-xl" />

                      </div>

                      {threeWayResult.cumulativeDetails.length === 0 ? (

                        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">

                          <p className="text-sm text-gray-500">
                            AI did not return cumulative details.
                          </p>

                        </div>

                      ) : (

                        <div className="overflow-x-auto">

                          <table className="w-full min-w-[1500px]">

                            <thead>

                              <tr className="bg-gray-50">

                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                  Item
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  PO Qty
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Previous Invoice Qty
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Current Invoice Qty
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Cumulative Qty
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Remaining Qty
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  PO Amount
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Previous Invoice Amount
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Current Invoice Amount
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Cumulative Amount
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                                  Remaining Amount
                                </th>

                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                                  Status
                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {threeWayResult.cumulativeDetails.map(
                                (item) => {

                                  const statusStyle =
                                    getStatusClass(
                                      item.status
                                    )

                                  return (

                                    <tr
                                      key={
                                        item.itemCode
                                      }
                                      className="border-t border-gray-200"
                                    >

                                      <td className="px-4 py-3">

                                        <p className="text-sm font-medium text-gray-900">
                                          {
                                            item.description
                                          }
                                        </p>

                                        <p className="text-xs text-gray-500">
                                          {
                                            item.itemCode
                                          }
                                        </p>

                                      </td>

                                      <td className="px-4 py-3 text-right text-sm">
                                        {
                                          item.poQuantity
                                        }
                                      </td>

                                      <td className="px-4 py-3 text-right text-sm">
                                        {
                                          item.previousInvoiceQuantity
                                        }
                                      </td>

                                      <td className="px-4 py-3 text-right text-sm font-medium">
                                        {
                                          item.currentInvoiceQuantity
                                        }
                                      </td>

                                      <td className="px-4 py-3 text-right">

                                        <span
                                          className={`text-sm font-bold ${
                                            item.cumulativeInvoiceQuantity >
                                            item.poQuantity
                                              ? "text-red-600"
                                              : "text-[#1B733D]"
                                          }`}
                                        >
                                          {
                                            item.cumulativeInvoiceQuantity
                                          }
                                        </span>

                                      </td>

                                      <td className="px-4 py-3 text-right">

                                        <span
                                          className={`text-sm font-semibold ${
                                            item.remainingQuantity <
                                            0
                                              ? "text-red-600"
                                              : "text-gray-700"
                                          }`}
                                        >
                                          {
                                            item.remainingQuantity
                                          }
                                        </span>

                                      </td>

                                      <td className="px-4 py-3 text-right text-sm">
                                        {item.poAmount.toLocaleString()} SAR
                                      </td>

                                      <td className="px-4 py-3 text-right text-sm">
                                        {item.previousInvoiceAmount.toLocaleString()} SAR
                                      </td>

                                      <td className="px-4 py-3 text-right text-sm font-medium">
                                        {item.currentInvoiceAmount.toLocaleString()} SAR
                                      </td>

                                      <td className="px-4 py-3 text-right">

                                        <span
                                          className={`text-sm font-bold ${
                                            item.cumulativeInvoiceAmount >
                                            item.poAmount
                                              ? "text-red-600"
                                              : "text-[#1B733D]"
                                          }`}
                                        >
                                          {item.cumulativeInvoiceAmount.toLocaleString()} SAR
                                        </span>

                                      </td>

                                      <td className="px-4 py-3 text-right">

                                        <span
                                          className={`text-sm font-semibold ${
                                            item.remainingAmount <
                                            0
                                              ? "text-red-600"
                                              : "text-gray-700"
                                          }`}
                                        >
                                          {item.remainingAmount.toLocaleString()} SAR
                                        </span>

                                      </td>

                                      <td className="px-4 py-3">

                                        <div className="flex justify-center">

                                          <span
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${statusStyle.badge}`}
                                          >

                                            <span
                                              className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${statusStyle.icon}`}
                                            >
                                              {
                                                statusStyle.iconText
                                              }
                                            </span>

                                            {
                                              item.status
                                            }

                                          </span>

                                        </div>

                                      </td>

                                    </tr>

                                  )
                                }
                              )}

                            </tbody>

                          </table>

                        </div>

                      )}

                    </div>

                    {/* =================================================
                        CUMULATIVE AI REASONING
                    ================================================= */}

                    {threeWayResult.cumulativeDetails.length > 0 && (

                      <div className="border border-green-200 bg-green-50 rounded-xl p-5">

                        <div className="flex items-center gap-2 mb-4">

                          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">

                            <i className="ri-sparkling-2-line text-[#1B733D]" />

                          </div>

                          <div>

                            <p className="text-sm font-bold text-[#1B733D]">
                              AI Cumulative Reasoning
                            </p>

                            <p className="text-xs text-gray-500">
                              Previous invoices + current invoice
                            </p>

                          </div>

                        </div>

                        <div className="space-y-3">

                          {threeWayResult.cumulativeDetails.map(
                            (item) => (

                              <div
                                key={`reasoning-${item.itemCode}`}
                                className="bg-white border border-green-100 rounded-lg p-4"
                              >

                                <div className="flex items-center justify-between gap-4 mb-2">

                                  <div>

                                    <p className="text-sm font-semibold text-gray-900">
                                      {
                                        item.description
                                      }
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      {
                                        item.itemCode
                                      }
                                    </p>

                                  </div>

                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                      getStatusClass(
                                        item.status
                                      ).badge
                                    }`}
                                  >
                                    {
                                      item.status
                                    }
                                  </span>

                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">

                                  <div className="rounded-lg bg-gray-50 p-3">

                                    <p className="text-xs text-gray-500">
                                      Quantity
                                    </p>

                                    <p className="text-sm font-semibold text-gray-800 mt-1">

                                      {item.previousInvoiceQuantity}

                                      {" + "}

                                      {item.currentInvoiceQuantity}

                                      {" = "}

                                      {item.cumulativeInvoiceQuantity}

                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">

                                      PO: {item.poQuantity}

                                      {" | "}

                                      Remaining: {item.remainingQuantity}

                                    </p>

                                  </div>

                                  <div className="rounded-lg bg-gray-50 p-3">

                                    <p className="text-xs text-gray-500">
                                      Amount
                                    </p>

                                    <p className="text-sm font-semibold text-gray-800 mt-1">

                                      {item.previousInvoiceAmount.toLocaleString()}

                                      {" + "}

                                      {item.currentInvoiceAmount.toLocaleString()}

                                      {" = "}

                                      {item.cumulativeInvoiceAmount.toLocaleString()} SAR

                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">

                                      PO: {item.poAmount.toLocaleString()} SAR

                                      {" | "}

                                      Remaining: {item.remainingAmount.toLocaleString()} SAR

                                    </p>

                                  </div>

                                </div>

                                <p className="text-sm text-gray-700 leading-6">
                                  {
                                    item.reasoning
                                  }
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* =================================================
                        AI SUMMARY + RECOMMENDATION
                    ================================================= */}

                    <div className="border border-green-200 bg-gradient-to-r from-green-50 to-white rounded-xl p-5">

                      <div className="grid grid-cols-2 gap-6">

                        <div>

                          <div className="flex items-center gap-2 mb-3">

                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">

                              <i className="ri-sparkling-2-line text-[#1B733D]" />

                            </div>

                            <p className="text-sm font-bold text-[#1B733D]">
                              AI Summary
                            </p>

                          </div>

                          <p className="text-sm text-gray-700 leading-6">
                            {
                              threeWayResult.summary
                            }
                          </p>

                        </div>

                        <div className="border-l border-gray-200 pl-6">

                          <div className="flex items-center gap-2 mb-3">

                            <i className="ri-lightbulb-line text-lg text-gray-700" />

                            <p className="text-sm font-bold text-gray-900">
                              AI Recommendation
                            </p>

                          </div>

                          <span className="inline-flex px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-sm font-semibold text-orange-700">

                            {
                              threeWayResult
                                .recommendation
                                .action
                            }

                          </span>

                          <p className="text-sm text-gray-600 mt-3 leading-5">

                            {
                              threeWayResult
                                .recommendation
                                .reason
                            }

                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">

                      <i className="ri-information-line" />

                      <span>
                        AI validation is based only on the supplied PO, Goods Receipt, current Invoice and previous invoice data. Please verify critical discrepancies manually.
                      </span>

                    </div>

                    <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">

                      <div className="flex items-center gap-5">

                        <span className="text-xs font-semibold text-gray-600">
                          Status Legend
                        </span>

                        <span className="flex items-center gap-2 text-xs text-green-700">

                          <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>

                          PASS - Match

                        </span>

                        <span className="flex items-center gap-2 text-xs text-orange-700">

                          <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                            !
                          </span>

                          WARNING - Review

                        </span>

                        <span className="flex items-center gap-2 text-xs text-red-700">

                          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                            ×
                          </span>

                          FAIL - Major discrepancy

                        </span>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              {/* =================================================
                  PREVIOUS INVOICE

                  IMPORTANT:
                  EXISTING SECTION KEPT UNCHANGED.
              ================================================= */}

              <div
                ref={(el) => {
                  if (el)
                    sectionRefs.current[
                      "previous-invoices"
                    ] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >

                <div className="flex items-center justify-between mb-4">

                  <h2 className="text-lg font-semibold text-[#1B733D]">
                    Previous Invoice
                  </h2>

                  <button className="p-1 hover:bg-gray-100 rounded">

                    <i className="ri-bar-chart-line text-gray-600" />

                  </button>

                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                  <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">

                    <span className="text-xs font-medium text-gray-700">
                      Invoice reference
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Submitted on
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Approved on
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Status
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Attachment
                    </span>

                    <span />

                  </div>

                  <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-200 items-center">

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">

                        <i className="ri-file-text-line text-orange-600" />

                      </div>

                      <span className="text-sm text-gray-900">
                        1070000137
                      </span>

                    </div>

                    <div>

                      <p className="text-sm text-gray-900">
                        Dhul Hijjah 18, 1446
                      </p>

                      <p className="text-xs text-gray-500">
                        14 Jun 2025
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-900">
                        Moharram 30, 1447
                      </p>

                      <p className="text-xs text-gray-500">
                        14 Jul 2025
                      </p>

                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">

                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />

                      Paid

                    </span>

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">

                        <i className="ri-file-pdf-line text-red-600" />

                      </div>

                      <div>

                        <p className="text-xs font-medium text-gray-900">
                          Invoice
                        </p>

                        <p className="text-xs text-gray-500">
                          6.5kb
                        </p>

                      </div>

                    </div>

                    <button className="p-1 hover:bg-gray-100 rounded">

                      <i className="ri-download-line text-gray-600" />

                    </button>

                  </div>

                  <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">

                        <i className="ri-file-text-line text-orange-600" />

                      </div>

                      <span className="text-sm text-gray-900">
                        0005600068
                      </span>

                    </div>

                    <div>

                      <p className="text-sm text-gray-900">
                        Rabbi al-Awal 5, 1447
                      </p>

                      <p className="text-xs text-gray-500">
                        03 Aug 2025
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-900">
                        Rabi Al-Akhar 6, 1447
                      </p>

                      <p className="text-xs text-gray-500">
                        28 Sep 2025
                      </p>

                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">

                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />

                      Paid

                    </span>

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">

                        <i className="ri-file-pdf-line text-red-600" />

                      </div>

                      <div>

                        <p className="text-xs font-medium text-gray-900">
                          Invoice
                        </p>

                        <p className="text-xs text-gray-500">
                          6.5kb
                        </p>

                      </div>

                    </div>

                    <button className="p-1 hover:bg-gray-100 rounded">

                      <i className="ri-download-line text-gray-600" />

                    </button>

                  </div>

                </div>

              </div>

              {/* =================================================
                  OTHER SES
              ================================================= */}

              <div
                ref={(el) => {
                  if (el)
                    sectionRefs.current[
                      "other-ses"
                    ] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >

                <div className="flex items-center justify-between mb-4">

                  <h2 className="text-lg font-semibold text-[#1B733D]">
                    Others SES in PO
                  </h2>

                  <div className="flex items-center gap-2">

                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: "60%",
                        }}
                      />

                    </div>

                    <span className="text-sm text-gray-600">
                      60 %
                    </span>

                  </div>

                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">

                    <span className="text-xs font-medium text-gray-700">
                      Milestone
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Description
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Status
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Approved on
                    </span>

                    <span className="text-xs font-medium text-gray-700">
                      Action
                    </span>

                  </div>

                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 items-center">

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">

                        <i className="ri-file-list-line text-gray-600" />

                      </div>

                      <span className="text-sm text-gray-900">
                        1070000137
                      </span>

                    </div>

                    <span className="text-sm text-gray-900">
                      IT Infrastructure Setup
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">

                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />

                      Paid

                    </span>

                    <span className="text-sm text-gray-600">
                      30 Jun 2026
                    </span>

                    <button className="text-sm text-[#1B733D] hover:underline">
                      View certificate
                    </button>

                  </div>

                  <div className="grid grid-cols-5 gap-4 px-4 py-3 items-center">

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">

                        <i className="ri-file-list-line text-gray-600" />

                      </div>

                      <span className="text-sm text-gray-900">
                        0005600068
                      </span>

                    </div>

                    <span className="text-sm text-gray-900">
                      Laptop
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">

                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />

                      Paid

                    </span>

                    <span className="text-sm text-gray-600">
                      30 Sep 2026
                    </span>

                    <button className="text-sm text-[#1B733D] hover:underline">
                      View certificate
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          INVOICE SNAPSHOT DIALOG
      ====================================================== */}

      <InvoiceSnapshotDialog
        isOpen={
          showInvoiceDialog
        }
        onClose={() =>
          setShowInvoiceDialog(
            false
          )
        }
      />

    </div>
  )
}