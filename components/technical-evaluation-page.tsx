
"use client"

import {
  useState,
  useEffect,
  useRef,
} from "react"

import {
  ChevronLeft,
  LayoutGrid,
  X,
  Sparkles,
  Loader2,
} from "lucide-react"

import SignatureVerificationDialog from "./signature-verification-dialog"
import AssessmentDecisionDialog from "./assessment-decision-dialog"

import {
  evaluateTechnicalProposals,
} from "@/app/actions/ai-technical-evaluation"

/* ============================================================
   TYPES
============================================================ */

type EvaluationRow = {
  [key: string]:
    | string
    | number
    | null
    | undefined
}

type VendorConfig = {
  name: string
  scoreKey: string
  proposalName: string
  aliases: string[]
  location: string
  avatar: string
  color: string
}

type TechnicalEvaluationResponse = {
  success?: boolean
  message?: string
  error?: string

  evaluation_table?: EvaluationRow[]

  technical_overall_insights?: {
    [vendor: string]: string
  }
}

/* ============================================================
   VENDOR CONFIGURATION

   IMPORTANT:
   The backend now reads actual PDF filenames.

   Example:

   Accenture Proposal.pdf
   Deloitte Proposal.pdf
   KaarTech Proposal.pdf

   The aliases make the frontend tolerant of filenames such as:

   1_Accenture Proposal.pdf
   Accenture Technical Proposal.pdf
   2_Deloitte Proposal.pdf
   3_KaarTech Proposal.pdf
============================================================ */

const VENDOR_SCORE_MAP: VendorConfig[] = [
  {
    name: "Accenture",
    proposalName:
      "Accenture Proposal.pdf",
    scoreKey:
      "Accenture Proposal.pdf Score",
    aliases: [
      "Accenture",
      "Accenture Proposal",
      "1_Accenture",
      "1_Accenture Proposal",
      "Technical Proposal Accenture",
    ],
    location: "New York",
    avatar: "A",
    color: "#4A5568",
  },

  {
    name: "Deloitte",
    proposalName:
      "Deloitte Proposal.pdf",
    scoreKey:
      "Deloitte Proposal.pdf Score",
    aliases: [
      "Deloitte",
      "Deloitte Proposal",
      "2_Deloitte",
      "2_Deloitte Proposal",
      "Technical Proposal Deloitte",
    ],
    location: "London",
    avatar: "D",
    color: "#3B82F6",
  },

  {
    name: "Kaar Technologies",
    proposalName:
      "KaarTech Proposal.pdf",
    scoreKey:
      "KaarTech Proposal.pdf Score",
    aliases: [
      "Kaar Technologies",
      "KaarTech",
      "Kaar",
      "KaarTech Proposal",
      "3_KaarTech",
      "3_KaarTech Proposal",
      "Technical Proposal KaarTech",
    ],
    location: "Chennai",
    avatar: "K",
    color: "#FF6B6B",
  },
]

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

function normalizeText(
  value: unknown
): string {
  return String(value ?? "")
    .replace(/\*/g, "")
    .trim()
    .toLowerCase()
}

function parseScore(
  raw:
    | string
    | number
    | null
    | undefined
): number | null {
  if (
    raw === null ||
    raw === undefined ||
    raw === ""
  ) {
    return null
  }

  const cleaned =
    String(raw)
      .replace(/\*/g, "")
      .replace(/%/g, "")
      .trim()

  const n =
    parseFloat(cleaned)

  return Number.isNaN(n)
    ? null
    : n
}

/* ============================================================
   FIND ACTUAL VENDOR SCORE KEY
============================================================ */

function findVendorScoreKey(
  row: EvaluationRow,
  vendor: VendorConfig
): string | null {
  const keys =
    Object.keys(row)

  /* ----------------------------------------------------------
     1. Exact expected key
  ---------------------------------------------------------- */

  if (
    Object.prototype.hasOwnProperty.call(
      row,
      vendor.scoreKey
    )
  ) {
    return vendor.scoreKey
  }

  /* ----------------------------------------------------------
     2. Normalized exact match
  ---------------------------------------------------------- */

  const normalizedExpected =
    normalizeText(
      vendor.scoreKey
    )

  const exactNormalized =
    keys.find(
      (key) =>
        normalizeText(key) ===
        normalizedExpected
    )

  if (exactNormalized) {
    return exactNormalized
  }

  /* ----------------------------------------------------------
     3. Score columns only
  ---------------------------------------------------------- */

  const scoreKeys =
    keys.filter(
      (key) =>
        normalizeText(
          key
        ).endsWith("score")
    )

  /* ----------------------------------------------------------
     4. Alias matching
  ---------------------------------------------------------- */

  for (
    const alias of
      vendor.aliases
  ) {
    const normalizedAlias =
      normalizeText(
        alias
      )

    const match =
      scoreKeys.find(
        (key) => {
          const normalizedKey =
            normalizeText(
              key
            )

          return (
            normalizedKey.includes(
              normalizedAlias
            ) &&
            normalizedKey.endsWith(
              "score"
            )
          )
        }
      )

    if (match) {
      return match
    }
  }

  /* ----------------------------------------------------------
     5. Vendor-name matching
  ---------------------------------------------------------- */

  const normalizedVendor =
    normalizeText(
      vendor.name
    )

  const vendorMatch =
    scoreKeys.find(
      (key) =>
        normalizeText(
          key
        ).includes(
          normalizedVendor
        )
    )

  if (vendorMatch) {
    return vendorMatch
  }

  return null
}

/* ============================================================
   GET VENDOR EVALUATION
============================================================ */

function getVendorEvaluation(
  row: EvaluationRow,
  vendor: VendorConfig
) {
  const scoreKey =
    findVendorScoreKey(
      row,
      vendor
    )

  if (!scoreKey) {
    return {
      score: null,
      reason: "",
      reference: "",
    }
  }

  const reasonKey =
    scoreKey.replace(
      /\s*Score$/i,
      " Reason"
    )

  const referenceKey =
    scoreKey.replace(
      /\s*Score$/i,
      " Reference"
    )

  return {
    score:
      parseScore(
        row[scoreKey]
      ),

    reason:
      String(
        row[reasonKey] ??
          ""
      ).trim(),

    reference:
      String(
        row[referenceKey] ??
          ""
      ).trim(),
  }
}

/* ============================================================
   NORMALIZE INSIGHTS
============================================================ */

function normalizeInsightMap(
  insights:
    | {
        [key: string]: string
      }
    | undefined
): {
  [key: string]: string
} {
  if (!insights) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(
      insights
    ).map(
      ([key, value]) => [
        normalizeText(key),
        String(
          value ?? ""
        ).trim(),
      ]
    )
  )
}

/* ============================================================
   GET INSIGHT FOR VENDOR
============================================================ */

function getInsightForVendor(
  insights: {
    [vendor: string]: string
  },
  vendor: VendorConfig
): string {
  const normalizedVendorName =
    normalizeText(
      vendor.name
    )

  /* ----------------------------------------------------------
     1. Direct vendor name
  ---------------------------------------------------------- */

  if (
    insights[
      normalizedVendorName
    ]
  ) {
    return insights[
      normalizedVendorName
    ]
  }

  /* ----------------------------------------------------------
     2. Proposal filename
  ---------------------------------------------------------- */

  const normalizedProposalName =
    normalizeText(
      vendor.proposalName
    )

  if (
    insights[
      normalizedProposalName
    ]
  ) {
    return insights[
      normalizedProposalName
    ]
  }

  /* ----------------------------------------------------------
     3. Alias matching
  ---------------------------------------------------------- */

  for (
    const alias of
      vendor.aliases
  ) {
    const normalizedAlias =
      normalizeText(
        alias
      )

    const match =
      Object.entries(
        insights
      ).find(
        ([key]) =>
          key.includes(
            normalizedAlias
          ) ||
          normalizedAlias.includes(
            key
          )
      )

    if (
      match?.[1]
    ) {
      return match[1]
    }
  }

  return ""
}

/* ============================================================
   FIND TOTAL SCORE ROW
============================================================ */

function findTotalScoreRow(
  rows: EvaluationRow[]
): EvaluationRow | undefined {
  return rows.find(
    (row) => {
      const criterion =
        normalizeText(
          row[
            "Main Criterion"
          ]
        )

      return (
        criterion ===
          "total score" ||
        criterion ===
          "total" ||
        criterion.includes(
          "total score"
        )
      )
    }
  )
}

/* ============================================================
   PROPS
============================================================ */

interface TechnicalEvaluationPageProps {
  onBack: () => void
  onNavigateToVendorEvaluation: () => void
  onCommercialCompleted?: () => void
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function TechnicalEvaluationPage({
  onBack,
  onNavigateToVendorEvaluation,
  onCommercialCompleted,
}: TechnicalEvaluationPageProps) {
  /* ==========================================================
     STATE
  ========================================================== */

  const [
    acknowledged,
    setAcknowledged,
  ] = useState(false)

  const [
    activeSection,
    setActiveSection,
  ] =
    useState(
      "rfp-details"
    )

  const [
    collapsed,
    setCollapsed,
  ] = useState(false)

  const [
    showSignatureDialog,
    setShowSignatureDialog,
  ] = useState(false)

  const [
    showDecisionDialog,
    setShowDecisionDialog,
  ] = useState(false)

  const [
    selectedDecision,
    setSelectedDecision,
  ] = useState("")

  const [
    showSuccessMessage,
    setShowSuccessMessage,
  ] = useState(false)

  const [
    vendorDecisions,
    setVendorDecisions,
  ] = useState<{
    [name: string]:
      | "approved"
      | "rejected"
      | "pending"
  }>(
    Object.fromEntries(
      VENDOR_SCORE_MAP.map(
        (vendor) => [
          vendor.name,
          "pending",
        ]
      )
    )
  )

  const [
    vendorScores,
    setVendorScores,
  ] = useState<{
    [name: string]:
      | number
      | null
  }>(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return {}
    }

    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "evalVendorScores"
          ) || "null"
        ) ?? {}
      )
    } catch {
      return {}
    }
  })

  const [
    evalRows,
    setEvalRows,
  ] = useState<
    EvaluationRow[]
  >(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return []
    }

    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "evalRows"
          ) || "null"
        ) ?? []
      )
    } catch {
      return []
    }
  })

  const [
    overallInsights,
    setOverallInsights,
  ] = useState<{
    [vendor: string]: string
  }>(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return {}
    }

    try {
      return normalizeInsightMap(
        JSON.parse(
          localStorage.getItem(
            "overallInsights"
          ) || "null"
        ) ?? {}
      )
    } catch {
      return {}
    }
  })

  const [
    showEvalModal,
    setShowEvalModal,
  ] = useState(false)

  const [
    isReviewing,
    setIsReviewing,
  ] = useState(false)

  const [
    reviewError,
    setReviewError,
  ] = useState("")

  const [
    selectedEvaluation,
    setSelectedEvaluation,
  ] = useState<{
    vendor: string
    score: number | null
    reason: string
    reference: string
    subCriterion: string
    weight: string
  } | null>(null)

  /* ==========================================================
     REFS
  ========================================================== */

  const rfpDetailsRef =
    useRef<HTMLDivElement>(
      null
    )

  const acknowledgmentRef =
    useRef<HTMLDivElement>(
      null
    )

  const vendorsRef =
    useRef<HTMLDivElement>(
      null
    )

  /* ==========================================================
     SCROLL HANDLER
  ========================================================== */

  useEffect(() => {
    const handleScroll =
      () => {
        const scrollPosition =
          window.scrollY + 200

        if (
          vendorsRef.current &&
          scrollPosition >=
            vendorsRef.current
              .offsetTop
        ) {
          setActiveSection(
            "vendors"
          )
        } else if (
          acknowledgmentRef.current &&
          scrollPosition >=
            acknowledgmentRef.current
              .offsetTop
        ) {
          setActiveSection(
            "acknowledgment"
          )
        } else {
          setActiveSection(
            "rfp-details"
          )
        }
      }

    window.addEventListener(
      "scroll",
      handleScroll
    )

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      )
  }, [])

  /* ==========================================================
     SCROLL TO SECTION
  ========================================================== */

  const scrollToSection = (
    sectionId: string
  ) => {
    const refs = {
      "rfp-details":
        rfpDetailsRef,
      acknowledgment:
        acknowledgmentRef,
      vendors:
        vendorsRef,
    }

    const ref =
      refs[
        sectionId as keyof typeof refs
      ]

    if (ref?.current) {
      ref.current.scrollIntoView(
        {
          behavior:
            "smooth",
          block: "start",
        }
      )
    }
  }

  /* ==========================================================
     ACKNOWLEDGEMENT
  ========================================================== */

  const handleAcknowledgeClick =
    () => {
      setShowSignatureDialog(
        true
      )
    }

  const handleSignatureAcknowledge =
    () => {
      setAcknowledged(true)
      setShowSignatureDialog(
        false
      )
    }

  /* ==========================================================
     AI TECHNICAL EVALUATION
  ========================================================== */

  const handleReview =
    async () => {
      if (isReviewing) {
        return
      }

      setIsReviewing(true)
      setReviewError("")

      try {
        /* ----------------------------------------------------
           IMPORTANT:

           The server action now finds the RFP and proposal
           PDFs itself.

           DO NOT send:

           rfpFile
           proposalFiles

           anymore.
        ---------------------------------------------------- */

        const response =
          (await evaluateTechnicalProposals({
            reEvaluate: evalRows.length > 0,
          })) as TechnicalEvaluationResponse

        /* ----------------------------------------------------
           SERVER ACTION ERROR
        ---------------------------------------------------- */

        if (
          response?.success ===
          false
        ) {
          setReviewError(
            response.message ||
              response.error ||
              "Unable to load evaluation results."
          )

          return
        }

        /* ----------------------------------------------------
           EVALUATION TABLE
        ---------------------------------------------------- */

        const rows: EvaluationRow[] =
          Array.isArray(
            response?.evaluation_table
          )
            ? response.evaluation_table
            : []

        /* ----------------------------------------------------
           AI INSIGHTS
        ---------------------------------------------------- */

        const insights: {
          [name: string]: string
        } =
          response?.technical_overall_insights ??
          {}

        /* ----------------------------------------------------
           VALIDATE RESULT
        ---------------------------------------------------- */

        if (!rows.length) {
          setReviewError(
            response?.message ||
              "Evaluation has not been completed yet."
          )

          return
        }

        /* ----------------------------------------------------
           TOTAL SCORE ROW
        ---------------------------------------------------- */

        const totalRow =
          findTotalScoreRow(
            rows
          )

        /* ----------------------------------------------------
           EXTRACT VENDOR SCORES
        ---------------------------------------------------- */

        const scores: {
          [name: string]:
            | number
            | null
        } = {}

        VENDOR_SCORE_MAP.forEach(
          (vendor) => {
            const scoreKey =
              findVendorScoreKey(
                totalRow ?? {},
                vendor
              )

            scores[
              vendor.name
            ] =
              scoreKey
                ? parseScore(
                    totalRow?.[
                      scoreKey
                    ]
                  )
                : null
          }
        )

        /* ----------------------------------------------------
           SAVE STATE
        ---------------------------------------------------- */

        setVendorScores(
          scores
        )

        setOverallInsights(
          normalizeInsightMap(
            insights
          )
        )

        setEvalRows(rows)

        /* ----------------------------------------------------
           SAVE LOCAL STORAGE
        ---------------------------------------------------- */

        localStorage.setItem(
          "evalVendorScores",
          JSON.stringify(
            scores
          )
        )

        localStorage.setItem(
          "overallInsights",
          JSON.stringify(
            insights
          )
        )

        localStorage.setItem(
          "evalRows",
          JSON.stringify(
            rows
          )
        )

        /* ----------------------------------------------------
           SHOW RESULTS
        ---------------------------------------------------- */

        setShowEvalModal(
          true
        )
      } catch (error) {
        console.error(
          "Technical evaluation error:",
          error
        )

        setReviewError(
          error instanceof Error
            ? error.message
            : "Unable to load evaluation results."
        )
      } finally {
        setIsReviewing(false)
      }
    }

  /* ==========================================================
     DECISION
  ========================================================== */

  const handleDecideClick =
    () => {
      setShowDecisionDialog(
        true
      )
    }

  const handleCompleteDecision =
    () => {
      setShowDecisionDialog(
        false
      )

      setShowSuccessMessage(
        true
      )

      if (
        selectedDecision ===
          "completed" &&
        onCommercialCompleted
      ) {
        onCommercialCompleted()
      }

      setTimeout(() => {
        setShowSuccessMessage(
          false
        )
      }, 3000)
    }

  /* ==========================================================
     SORT VENDORS
  ========================================================== */

  const sortedVendors =
    [
      ...VENDOR_SCORE_MAP,
    ].sort(
      (a, b) => {
        const scoreA =
          vendorScores[
            a.name
          ] ?? -1

        const scoreB =
          vendorScores[
            b.name
          ] ?? -1

        return (
          scoreB -
          scoreA
        )
      }
    )

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full h-screen flex flex-col bg-white">

      {/* ======================================================
          AI LOADER
      ====================================================== */}

      {isReviewing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl px-16 py-12 gap-4">

            <Loader2
              size={48}
              className="animate-spin text-green-700"
            />

            <p className="text-lg font-semibold text-gray-900">
              Evaluating Vendor Technical Proposals...
            </p>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:300ms]" />
            </div>

          </div>
        </div>
      )}

      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {showSuccessMessage && (
        <div
          className="fixed top-4 left-4 z-50 bg-white rounded-md shadow-lg flex items-center gap-3 pr-4"
          style={{
            borderLeft:
              "4px solid #1B733D",
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3">

            <i
              className="ri-checkbox-circle-line text-2xl"
              style={{
                color:
                  "#1B733D",
              }}
            />

            <span
              className="font-normal text-base"
              style={{
                color:
                  "#000525",
              }}
            >
              Technical evaluation completed successfully
            </span>

          </div>

          <button
            onClick={() =>
              setShowSuccessMessage(
                false
              )
            }
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <i className="ri-close-line text-xl text-gray-600" />
          </button>
        </div>
      )}

      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">

        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-green-700">
            Conduct Technical assessment
          </h1>

        </div>

        <div className="flex items-center gap-3">

          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <i className="ri-save-line" />
            Save As Draft
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <i className="ri-check-line" />
            Save
          </button>

        </div>

      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex-1 flex overflow-hidden">

        {/* ====================================================
            LEFT SIDEBAR
        ==================================================== */}

        <div
          className={`transition-all duration-300 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 ${
            collapsed
              ? "w-16"
              : "w-64"
          }`}
        >

          <div className="p-4">

            <div className="flex items-center justify-between mb-4">

              {!collapsed && (
                <h2 className="text-sm font-semibold text-gray-900">
                  Sections
                </h2>
              )}

              <button
                onClick={() =>
                  setCollapsed(
                    !collapsed
                  )
                }
                className="p-1 hover:bg-gray-200 rounded transition"
                aria-label="Toggle collapse"
              >
                <LayoutGrid className="text-gray-600 w-5 h-5" />
              </button>

            </div>

            <nav className="space-y-1">

              {[
                {
                  id: "rfp-details",
                  label: "RFP details",
                },
                {
                  id: "acknowledgment",
                  label: "Acknowledgment",
                },
                {
                  id: "vendors",
                  label: "Vendors",
                },
              ].map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    onClick={() =>
                      scrollToSection(
                        item.id
                      )
                    }
                    className={`group relative w-full text-left px-3 py-2 rounded text-sm flex items-center transition-all duration-200 ${
                      activeSection ===
                      item.id
                        ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {!collapsed && (
                      <span>
                        {
                          item.label
                        }
                      </span>
                    )}
                  </button>
                )
              )}

            </nav>

          </div>

        </div>

        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <div className="flex-1 overflow-y-auto">

          <div className="max-w-6xl mx-auto p-8 space-y-8">

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-semibold text-green-700">
                Leadership Development Training Program
              </h2>

              {/* <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded">
                Evaluation Inprogress
              </span> */}

            </div>

            {/* =================================================
                RFP DETAILS
            ================================================= */}

            <div
              ref={
                rfpDetailsRef
              }
              className="space-y-6"
            >

              <div className="grid grid-cols-3 gap-6">

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    RFP ID
                  </p>

                  <p className="text-sm font-semibold text-blue-600">
                    RFP2131424
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    PR Reference
                  </p>

                  <p className="text-sm font-semibold text-blue-600">
                    PR524252
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Bid closing date/time
                  </p>

                  <p className="text-sm font-medium text-gray-900">
                    29th Oct 2025, 5:00 PM
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Deadline
                  </p>

                  <p className="text-sm text-gray-900">
                    24-Oct-2025 6:00 PM
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Evaluator
                  </p>

                  <p className="text-sm text-gray-900">
                    Eng. Ahmed Saleh (TEC Member)
                  </p>
                </div>

              </div>

            </div>

            {/* =================================================
                ACKNOWLEDGMENT
            ================================================= */}

            <div
              ref={
                acknowledgmentRef
              }
              className="space-y-4"
            >

              <h3 className="text-xl font-semibold text-green-700">
                Acknowledgment
              </h3>

              <div className="border border-gray-200 rounded-lg p-6 space-y-4">

                <p className="text-sm text-gray-700 leading-relaxed">
                  By confirming below, I acknowledge that I am an authorized member of the Technical Evaluation Committee for RFP-1003 and that I am present for the official opening of the Technical Proposals.
                </p>

                <p className="text-sm text-gray-700">
                  You will receive a confirmation code on your registered mobile number.
                </p>

                {!acknowledged ? (
                  <button
                    onClick={
                      handleAcknowledgeClick
                    }
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    I acknowledge
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 cursor-not-allowed"
                  >
                    <i className="ri-check-line" />
                    You have acknowledged
                  </button>
                )}

              </div>

            </div>

            {/* =================================================
                VENDORS
            ================================================= */}

            <div
              ref={
                vendorsRef
              }
              className="space-y-4"
            >

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-semibold text-green-700">
                  Vendor list
                </h3>

                {acknowledged && (
                  <div className="flex items-center gap-3">

                    {reviewError && (
                      <span className="text-xs text-red-500 max-w-xs">
                        {
                          reviewError
                        }
                      </span>
                    )}

                    {evalRows.length >
                      0 && (
                      <button
                        onClick={() =>
                          setShowEvalModal(
                            true
                          )
                        }
                        className="px-6 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 flex items-center gap-2"
                      >
                        View Results
                      </button>
                    )}

                    <button
                      onClick={
                        handleReview
                      }
                      disabled={
                        isReviewing
                      }
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isReviewing ? (
                        <>
                          <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          {evalRows.length >
                          0
                            ? "Re-evaluate with AI"
                            : "Evaluate with AI"}
                        </>
                      )}
                    </button>

                  </div>
                )}

              </div>

              {/* =================================================
                  LOCKED VIEW
              ================================================= */}

              {!acknowledged ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">

                  <div className="relative">

                    <img
                      src="/locked-documents-illustration.jpg"
                      alt="Locked"
                      className="w-64 h-48 opacity-50"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">

                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">

                        <i className="ri-lock-fill text-3xl text-white" />

                      </div>

                    </div>

                  </div>

                  <p className="text-lg font-medium text-gray-700">
                    Vendors list & submissions are locked
                  </p>

                  <p className="text-sm text-gray-500">
                    Kindly acknowledge to proceed
                  </p>

                </div>
              ) : (
                <div className="space-y-8">

                  {/* =================================================
                      VENDOR TABLE
                  ================================================= */}

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                    <div className="grid grid-cols-12 gap-4 bg-[rgb(27,115,61)] p-4 text-sm font-medium text-white">

                      <div className="col-span-3">
                        Vendors (
                        {
                          VENDOR_SCORE_MAP.length
                        }
                        )
                      </div>

                      <div className="col-span-3">
                        Evaluation status
                      </div>

                      <div className="col-span-3">
                        Total score (Out of 100)
                      </div>

                      <div className="col-span-3">
                        Decision
                      </div>

                    </div>

                    {sortedVendors.map(
                      (vendor) => {
                        const decision =
                          vendorDecisions[
                            vendor.name
                          ]

                        const score =
                          vendorScores[
                            vendor.name
                          ]

                        return (
                          <div
                            key={
                              vendor.name
                            }
                            className="grid grid-cols-12 gap-4 p-4 border-t border-gray-200 items-center"
                          >

                            <div className="col-span-3 flex items-center gap-3">

                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
                                style={{
                                  backgroundColor:
                                    vendor.color,
                                }}
                                onClick={
                                  onNavigateToVendorEvaluation
                                }
                              >
                                {
                                  vendor.avatar
                                }
                              </div>

                              <div>

                                <p
                                  className="text-sm font-medium text-gray-900 cursor-pointer"
                                  onClick={
                                    onNavigateToVendorEvaluation
                                  }
                                >
                                  {
                                    vendor.name
                                  }
                                </p>

                                <p
                                  className="text-xs text-gray-500 cursor-pointer"
                                  onClick={
                                    onNavigateToVendorEvaluation
                                  }
                                >
                                  {
                                    vendor.location
                                  }
                                </p>

                              </div>

                            </div>

                            <div className="col-span-3">

                              <span
                                className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                                  decision ===
                                  "approved"
                                    ? "bg-green-100 text-green-700"
                                    : decision ===
                                      "rejected"
                                    ? "bg-red-100 text-red-600"
                                    : score !==
                                        null &&
                                      score !==
                                        undefined
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {decision ===
                                "approved"
                                  ? "Approved"
                                  : decision ===
                                    "rejected"
                                  ? "Rejected"
                                  : score !==
                                      null &&
                                    score !==
                                      undefined
                                  ? "Completed"
                                  : "Pending"}
                              </span>

                            </div>

                            <div className="col-span-3">

                              <p className="text-sm font-semibold text-gray-900">
                                {score !==
                                  null &&
                                score !==
                                  undefined
                                  ? score
                                  : "--"}
                              </p>

                            </div>

                            <div className="col-span-3 flex items-center gap-2">

                              <button
                                onClick={() =>
                                  setVendorDecisions(
                                    (
                                      prev
                                    ) => ({
                                      ...prev,
                                      [vendor.name]:
                                        "approved",
                                    })
                                  )
                                }
                                disabled={
                                  decision !==
                                    "pending" ||
                                  score ===
                                    null ||
                                  score ===
                                    undefined
                                }
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                  decision ===
                                  "approved"
                                    ? "bg-green-600 text-white cursor-not-allowed"
                                    : score ===
                                        null ||
                                      score ===
                                        undefined
                                    ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                                    : decision !==
                                      "pending"
                                    ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "border border-green-600 text-green-600 hover:bg-green-50"
                                }`}
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  setVendorDecisions(
                                    (
                                      prev
                                    ) => ({
                                      ...prev,
                                      [vendor.name]:
                                        "rejected",
                                    })
                                  )
                                }
                                disabled={
                                  decision !==
                                    "pending" ||
                                  score ===
                                    null ||
                                  score ===
                                    undefined
                                }
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                  decision ===
                                  "rejected"
                                    ? "bg-red-600 text-white cursor-not-allowed"
                                    : score ===
                                        null ||
                                      score ===
                                        undefined
                                    ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                                    : decision !==
                                      "pending"
                                    ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "border border-red-500 text-red-500 hover:bg-red-50"
                                }`}
                              >
                                Reject
                              </button>

                            </div>

                          </div>
                        )
                      }
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* ======================================================
            DECISION DIALOG
        ====================================================== */}

        {showDecisionDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <AssessmentDecisionDialog
              onComplete={
                handleCompleteDecision
              }
              onCancel={() =>
                setShowDecisionDialog(
                  false
                )
              }
              onDecisionChange={
                setSelectedDecision
              }
            />

          </div>
        )}

        {/* ======================================================
            SIGNATURE DIALOG
        ====================================================== */}

        <SignatureVerificationDialog
          isOpen={
            showSignatureDialog
          }
          onClose={() =>
            setShowSignatureDialog(
              false
            )
          }
          onAcknowledge={
            handleSignatureAcknowledge
          }
        />

      </div>

      {/* ========================================================
          AI EVALUATION RESULTS MODAL
      ======================================================== */}

      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div
            className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              width: "92vw",
              maxWidth:
                "1400px",
              maxHeight:
                "88vh",
            }}
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0 bg-white">

              <div>

                <h2 className="text-xl font-semibold text-green-700">
                  AI Technical Evaluation
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Vendor proposals evaluated against the RFP evaluation criteria
                </p>

              </div>

              <button
                onClick={() =>
                  setShowEvalModal(
                    false
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

            </div>

            {/* =================================================
                MODAL CONTENT
            ================================================= */}

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto px-6">

              {/* =================================================
                  VENDOR SCORE CARDS
              ================================================= */}

              <div className="sticky top-0 z-30 bg-white pt-6 pb-4">

                <div className="grid grid-cols-3 gap-4">

                  {sortedVendors.map(
                    (
                      vendor,
                      index
                    ) => {
                      const score =
                        vendorScores[
                          vendor.name
                        ]

                      return (
                        <div
                          key={
                            vendor.name
                          }
                          className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between shadow-sm"
                        >

                          <div className="flex items-center gap-2">

                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                              style={{
                                backgroundColor:
                                  vendor.color,
                              }}
                            >
                              {
                                vendor.avatar
                              }
                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {
                                  vendor.name
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                Technical Proposal
                              </p>

                            </div>

                          </div>

                          <div className="text-right flex-shrink-0">

                            {index ===
                              0 &&
                              score !==
                                null &&
                              score !==
                                undefined && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium block mb-1">
                                  Highest
                                </span>
                              )}

                            <p className="text-2xl font-bold text-gray-900">

                              {
                                score ??
                                "--"
                              }

                              <span className="text-xs font-normal text-gray-400">
                                /100
                              </span>

                            </p>

                          </div>

                        </div>
                      )
                    }
                  )}

                </div>

              </div>

              {/* =================================================
                  EVALUATION TABLE
              ================================================= */}

              <div className="border border-gray-200 rounded-xl overflow-visible mb-6">

                <table className="w-full border-collapse">

                  <thead className="sticky top-[112px] z-20">

                    <tr className="bg-[#1B733D] text-white shadow-sm">

                      <th className="px-4 py-4 text-left min-w-[420px]">
                        Evaluation Criteria
                      </th>

                      <th className="px-4 py-4 text-center w-[100px] border-r-2 border-gray-300">
                        Weight
                      </th>

                      {VENDOR_SCORE_MAP.map(
                        (
                          vendor
                        ) => (
                          <th
                            key={
                              vendor.name
                            }
                            className="px-4 py-4 text-center min-w-[170px]"
                          >
                            {
                              vendor.name
                            }
                          </th>
                        )
                      )}

                    </tr>

                  </thead>

                  <tbody>

                    {evalRows
                      .filter(
                        (row) =>
                          normalizeText(
                            row[
                              "Main Criterion"
                            ]
                          ) !==
                          "total score"
                      )
                      .map(
                        (
                          row,
                          index
                        ) => {

                          const mainCriterion =
                            String(
                              row[
                                "Main Criterion"
                              ] ??
                                ""
                            )
                              .replace(
                                /\*/g,
                                ""
                              )
                              .trim()

                          const subCriterion =
                            String(
                              row[
                                "Sub-Criterion"
                              ] ??
                                ""
                            )
                              .replace(
                                /\*/g,
                                ""
                              )
                              .trim()

                          const weight =
                            String(
                              row[
                                "Sub Weight"
                              ] ??
                                row[
                                  "Sub Weight "
                                ] ??
                                row[
                                  "Sub-Weight"
                                ] ??
                                row[
                                  "Sub-Weight "
                                ] ??
                                ""
                            ).trim()

                          return (
                            <tr
                              key={
                                index
                              }
                              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                            >

                              <td className="px-4 py-4 align-top">

                                <div className="font-semibold text-gray-900">
                                  {
                                    mainCriterion
                                  }
                                </div>

                                {subCriterion && (
                                  <div className="mt-1 text-sm text-gray-500 leading-5">
                                    {
                                      subCriterion
                                    }
                                  </div>
                                )}

                              </td>

                              <td className="px-4 py-4 text-center align-top border-r-2 border-gray-300">

                                <span className="inline-flex items-center justify-center text-gray-700 rounded-full px-3 py-1 text-sm font-semibold">
                                  {
                                    weight ||
                                    "--"
                                  }
                                </span>

                              </td>

                              {VENDOR_SCORE_MAP.map(
                                (
                                  vendor
                                ) => {

                                  const evaluation =
                                    getVendorEvaluation(
                                      row,
                                      vendor
                                    )

                                  const score =
                                    evaluation.score

                                  return (
                                    <td
                                      key={
                                        vendor.name
                                      }
                                      className="px-4 py-4 text-center align-top"
                                    >

                                      {score !==
                                      null ? (
                                        <button
                                          onClick={() =>
                                            setSelectedEvaluation(
                                              {
                                                vendor:
                                                  vendor.name,
                                                score:
                                                  score,
                                                reason:
                                                  evaluation.reason,
                                                reference:
                                                  evaluation.reference,
                                                subCriterion:
                                                  subCriterion,
                                                weight:
                                                  weight,
                                              }
                                            )
                                          }
                                          title="Click for more detail"
                                          className="inline-flex items-center justify-center min-w-[65px] px-3 py-2 rounded-lg font-bold text-sm text-gray-800 transition hover:scale-105 cursor-pointer"
                                        >
                                          {
                                            score
                                          }
                                          /
                                          {
                                            weight ||
                                            "?"
                                          }
                                        </button>
                                      ) : (
                                        <span className="text-gray-400">
                                          --
                                        </span>
                                      )}

                                    </td>
                                  )
                                }
                              )}

                            </tr>
                          )
                        }
                      )}

                    {/* =================================================
                        AI INSIGHTS
                    ================================================= */}

                    <tr className="border-t border-gray-200 bg-blue-50/40">

                      <td className="px-4 py-3 align-top">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          AI Insights
                        </p>

                      </td>

                      <td className="px-4 py-3 border-r-2 border-gray-300" />

                      {VENDOR_SCORE_MAP.map(
                        (
                          vendor
                        ) => {

                          const insight =
                            getInsightForVendor(
                              overallInsights,
                              vendor
                            )

                          return (
                            <td
                              key={
                                vendor.name
                              }
                              className="px-4 py-3 align-top"
                            >

                              <p className="text-xs text-gray-600 leading-5">
                                {
                                  insight ||
                                  "--"
                                }
                              </p>

                            </td>
                          )
                        }
                      )}

                    </tr>

                  </tbody>

                  {/* =================================================
                      TOTAL
                  ================================================= */}

                  <tfoot>

                    <tr className="bg-gray-50 border-t-2 border-gray-300">

                      <td className="px-4 py-5 font-bold text-gray-900">
                        TOTAL SCORE
                      </td>

                      <td className="px-4 py-5 text-center font-bold border-r-2 border-gray-300">
                        100
                      </td>

                      {VENDOR_SCORE_MAP.map(
                        (
                          vendor
                        ) => {

                          const score =
                            vendorScores[
                              vendor.name
                            ]

                          return (
                            <td
                              key={
                                vendor.name
                              }
                              className="px-4 py-5 text-center"
                            >

                              <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold text-lg text-gray-900">

                                {
                                  score ??
                                  "--"
                                }

                                /100

                              </span>

                            </td>
                          )
                        }
                      )}

                    </tr>

                  </tfoot>

                </table>

              </div>

            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white">

              <p className="text-xs text-gray-500">
                Click any vendor score to view AI reasoning and proposal reference.
              </p>

              <button
                onClick={() =>
                  setShowEvalModal(
                    false
                  )
                }
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          AI REASONING POPUP
      ======================================================== */}

      {selectedEvaluation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">

            {/* =================================================
                POPUP HEADER
            ================================================= */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  AI Evaluation
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {
                    selectedEvaluation.vendor
                  }
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedEvaluation(
                    null
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close AI reasoning"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

            </div>

            {/* =================================================
                POPUP CONTENT
            ================================================= */}

            <div className="p-6 space-y-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Evaluation Score
                  </p>

                  <p className="text-4xl font-bold text-green-700 mt-1">

                    {
                      selectedEvaluation.score
                    }

                    <span className="text-lg text-gray-400">
                      /
                      {
                        selectedEvaluation.weight
                      }
                    </span>

                  </p>

                </div>

                <div className="bg-green-50 rounded-xl px-4 py-3">

                  <p className="text-xs text-green-600 font-semibold text-center">
                    CRITERIA WEIGHT
                  </p>

                  <p className="text-xl font-bold text-green-700 text-center">
                    {
                      selectedEvaluation.weight
                    }
                  </p>

                </div>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Evaluation Criteria
                </p>

                <p className="mt-2 text-sm text-gray-800 leading-6">
                  {
                    selectedEvaluation.subCriterion ||
                    "No sub-criterion provided."
                  }
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  AI Reasoning
                </p>

                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <p className="text-sm text-gray-700 leading-6">
                    {
                      selectedEvaluation.reason ||
                      "No reasoning provided."
                    }
                  </p>

                </div>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Proposal Reference
                </p>

                <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">

                  <span className="text-lg">
                    📄
                  </span>

                  <p className="text-sm font-medium text-blue-700">
                    {
                      selectedEvaluation.reference ||
                      "No page reference provided."
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                POPUP FOOTER
            ================================================= */}

            <div className="flex justify-end px-6 py-4 border-t border-gray-200">

              <button
                onClick={() =>
                  setSelectedEvaluation(
                    null
                  )
                }
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

