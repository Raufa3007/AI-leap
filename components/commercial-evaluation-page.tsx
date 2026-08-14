"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronLeft,
  LayoutGrid,
  X,
  Sparkles,
  Loader2,
} from "lucide-react"

import SignatureVerificationDialog from "./signature-verification-dialog"
import AssessmentDecisionDialog from "./assessment-decision-dialog"

// ============================================================
// TYPES
// ============================================================

type CommercialEvaluation = {
  criterion: string
  weight: number
  score: number
  reason: string
  reference: string
}

type CommercialVendor = {
  id: number
  name?: string
  overallScore: number
  status: string
  recommendation: string
  aiInsight: string
  evaluations: CommercialEvaluation[]
}

type VendorConfig = {
  name: string
  location: string
  avatar: string
  color: string
}

// ============================================================
// VENDOR CONFIGURATION
// ============================================================

const VENDOR_CONFIG: VendorConfig[] = [
  {
    name: "Accenture",
    location: "New York",
    avatar: "A",
    color: "#4A5568",
  },
  {
    name: "Deloitte",
    location: "London",
    avatar: "D",
    color: "#3B82F6",
  },
  {
    name: "Kaar Technologies",
    location: "Chennai",
    avatar: "K",
    color: "#FF6B6B",
  },
]

// ============================================================
// COMMERCIAL CRITERIA
// ============================================================

const COMMERCIAL_CRITERIA = [
  {
    name: "Technical Proposal",
    weight: 40,
    description:
      "Overall technical evaluation score carried forward from the technical assessment.",
  },
  {
    name: "Past Project Experience",
    weight: 15,
    description:
      "Relevant experience delivering similar projects and services.",
  },
  {
    name: "On-Time Delivery",
    weight: 10,
    description:
      "Vendor's demonstrated ability to deliver projects within agreed timelines.",
  },
  {
    name: "Compliance",
    weight: 10,
    description:
      "Compliance with the RFP requirements, contractual conditions and mandatory requirements.",
  },
  {
    name: "Financial Stability",
    weight: 10,
    description:
      "Financial strength and commercial stability of the vendor.",
  },
  {
    name: "Customer References",
    weight: 10,
    description:
      "Quality and relevance of customer references and previous client relationships.",
  },
  {
    name: "Risk Score",
    weight: 5,
    description:
      "Overall commercial and delivery risk associated with the vendor.",
  },
]

// ============================================================
// PROPS
// ============================================================

interface CommercialAssessmentPageProps {
  onBack: () => void
  onCommercialCompleted?: () => void
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CommercialAssessmentPage({
  onBack,
  onCommercialCompleted,
}: CommercialAssessmentPageProps) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [selectedVendor, setSelectedVendor] =
    useState<CommercialVendor | null>(null)

  const [selectedCriterion, setSelectedCriterion] =
    useState<CommercialEvaluation | null>(null)

  const [selectedCriterionVendor, setSelectedCriterionVendor] =
    useState<CommercialVendor | null>(null)

  const [acknowledged, setAcknowledged] =
    useState(false)

  const [activeSection, setActiveSection] =
    useState("rfp-details")

  const [collapsed, setCollapsed] =
    useState(false)

  const [showSignatureDialog, setShowSignatureDialog] =
    useState(false)

  const [showDecisionDialog, setShowDecisionDialog] =
    useState(false)

  const [selectedDecision, setSelectedDecision] =
    useState("")

  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false)

  const [isReviewing, setIsReviewing] =
    useState(false)

  const [reviewError, setReviewError] =
    useState("")

  const [vendors, setVendors] =
    useState<CommercialVendor[]>([])

  const [showEvalModal, setShowEvalModal] =
    useState(false)

  // ==========================================================
  // REFS
  // ==========================================================

  const rfpDetailsRef =
    useRef<HTMLDivElement | null>(null)

  const acknowledgmentRef =
    useRef<HTMLDivElement | null>(null)

  const vendorsRef =
    useRef<HTMLDivElement | null>(null)

  // ==========================================================
  // LOAD PREVIOUS COMMERCIAL RESULT
  // ==========================================================

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "commercialEvaluation"
        )

      if (saved) {
        const parsed =
          JSON.parse(saved)

        if (
          parsed &&
          Array.isArray(parsed.vendors)
        ) {
          const normalizedSavedVendors: CommercialVendor[] =
            parsed.vendors.map(
              (
                vendor: any,
                index: number
              ) => ({
                id:
                  Number(vendor.id) ||
                  index + 1,

                name:
                  vendor.name || "",

                overallScore:
                  Number(
                    vendor.overallScore
                  ) || 0,

                status:
                  vendor.status ||
                  "Completed",

                recommendation:
                  vendor.recommendation ||
                  "Not Recommended",

                aiInsight:
                  vendor.aiInsight ||
                  "No AI insight provided.",

                evaluations:
                  Array.isArray(
                    vendor.evaluations
                  )
                    ? vendor.evaluations.map(
                        (
                          evaluation: any
                        ) => ({
                          criterion:
                            evaluation.criterion ||
                            "",

                          weight:
                            Number(
                              evaluation.weight
                            ) || 0,

                          score:
                            Number(
                              evaluation.score
                            ) || 0,

                          reason:
                            evaluation.reason ||
                            "No reasoning provided.",

                          reference:
                            evaluation.reference ||
                            "Not specified",
                        })
                      )
                    : [],
              })
            )

          setVendors(
            normalizedSavedVendors
          )
        }
      }
    } catch (error) {
      console.error(
        "Unable to load commercial evaluation:",
        error
      )
    }
  }, [])

  // ==========================================================
  // SCROLL HANDLER
  // ==========================================================

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.scrollY + 200

      if (
        vendorsRef.current &&
        scrollPosition >=
          vendorsRef.current.offsetTop
      ) {
        setActiveSection(
          "vendors"
        )
      } else if (
        acknowledgmentRef.current &&
        scrollPosition >=
          acknowledgmentRef.current.offsetTop
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

  // ==========================================================
  // SCROLL TO SECTION
  // ==========================================================

  const scrollToSection = (
    sectionId: string
  ) => {
    const refs = {
      "rfp-details": rfpDetailsRef,
      acknowledgment:
        acknowledgmentRef,
      vendors: vendorsRef,
    }

    const ref =
      refs[
        sectionId as keyof typeof refs
      ]

    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // ==========================================================
  // ACKNOWLEDGEMENT
  // ==========================================================

  const handleAcknowledgeClick =
    () => {
      setShowSignatureDialog(true)
    }

  const handleSignatureAcknowledge =
    () => {
      setAcknowledged(true)
      setShowSignatureDialog(false)
    }

  // ==========================================================
  // FIND VENDOR CONFIG
  // ==========================================================

  const getVendorConfig = (
    vendorName: string
  ): VendorConfig => {
    return (
      VENDOR_CONFIG.find(
        (v) =>
          v.name.toLowerCase() ===
          vendorName.toLowerCase()
      ) || {
        name: vendorName,
        location: "",
        avatar:
          vendorName
            .charAt(0)
            .toUpperCase(),
        color: "#4A5568",
      }
    )
  }

  // ==========================================================
  // FIND VENDOR NAME FROM ID
  // ==========================================================

  const getVendorNameById = (
    vendorId: number
  ) => {
    const config =
      VENDOR_CONFIG.find(
        (_, index) =>
          index + 1 ===
          vendorId
      )

    return (
      config?.name ||
      `Vendor ${vendorId}`
    )
  }

  // ==========================================================
  // NORMALIZE CRITERION NAME
  // ==========================================================

  const normalizeCriterionName = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(
        "technical proposal score",
        "technical proposal"
      )
  }

  // ==========================================================
  // GET EVALUATION FOR A CRITERION
  // ==========================================================

  const getVendorEvaluation = (
    vendor: CommercialVendor,
    criterionName: string
  ): CommercialEvaluation | undefined => {
    if (
      !Array.isArray(
        vendor.evaluations
      )
    ) {
      return undefined
    }

    return vendor.evaluations.find(
      (evaluation) =>
        normalizeCriterionName(
          evaluation.criterion
        ) ===
        normalizeCriterionName(
          criterionName
        )
    )
  }

  // ==========================================================
  // SCORE COLOR
  // ==========================================================

  const getScoreClass = (
    score: number,
    maximum: number
  ) => {
    if (maximum <= 0) {
      return "bg-gray-100 text-gray-700"
    }

    const percentage =
      (score / maximum) * 100

    if (percentage >= 80) {
      return "bg-green-100 text-green-700"
    }

    if (percentage >= 60) {
      return "bg-yellow-100 text-yellow-700"
    }

    return "bg-red-100 text-red-700"
  }

  // ==========================================================
  // RECOMMENDATION CLASS
  // ==========================================================

  const getRecommendationClass = (
    recommendation: string
  ) => {
    const value =
      recommendation
        ?.toLowerCase() || ""

    if (
      value.includes(
        "recommended"
      ) &&
      !value.includes("not") &&
      !value.includes(
        "conditionally"
      )
    ) {
      return "bg-green-100 text-green-700"
    }

    if (
      value.includes(
        "conditionally"
      )
    ) {
      return "bg-yellow-100 text-yellow-700"
    }

    if (
      value.includes("not")
    ) {
      return "bg-red-100 text-red-700"
    }

    return "bg-yellow-100 text-yellow-700"
  }

  // ==========================================================
  // OPEN CRITERION-SPECIFIC POPUP
  // ==========================================================

  const openCriterionEvaluation = (
    vendor: CommercialVendor,
    criterion: CommercialEvaluation
  ) => {
    setSelectedVendor(null)

    setSelectedCriterionVendor(
      vendor
    )

    setSelectedCriterion(
      criterion
    )
  }

  // ==========================================================
  // CLOSE CRITERION POPUP
  // ==========================================================

  const closeCriterionEvaluation =
    () => {
      setSelectedCriterion(null)
      setSelectedCriterionVendor(
        null
      )
    }

  // ==========================================================
  // OPEN OVERALL VENDOR POPUP
  // ==========================================================

  const openOverallEvaluation = (
    vendor: CommercialVendor
  ) => {
    setSelectedCriterion(null)
    setSelectedCriterionVendor(
      null
    )
    setSelectedVendor(vendor)
  }

  // ==========================================================
  // AI COMMERCIAL EVALUATION
  // ==========================================================

  const handleReview = async () => {
    setIsReviewing(true)
    setReviewError("")

    try {
      const requestVendors =
        VENDOR_CONFIG.map(
          (vendor, index) => ({
            id: index + 1,
            name: vendor.name,
            location:
              vendor.location,
          })
        )

      const res = await fetch(
        "http://127.0.0.1:5000/evaluate-commercial",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            vendors:
              requestVendors,
          }),
        }
      )

      if (!res.ok) {
        const errorText =
          await res.text()

        console.error(
          "Commercial API error:",
          errorText
        )

        throw new Error(
          "Commercial evaluation request failed"
        )
      }

      const data =
        await res.json()

      console.log(
        "COMMERCIAL AI RESPONSE:",
        data
      )

      if (
        !data ||
        !Array.isArray(
          data.vendors
        ) ||
        data.vendors.length === 0
      ) {
        setReviewError(
          "Commercial evaluation has not been completed yet."
        )

        return
      }

      const normalizedVendors: CommercialVendor[] =
        data.vendors.map(
          (
            vendor: any,
            index: number
          ) => ({
            id:
              Number(vendor.id) ||
              index + 1,

            name:
              vendor.name ||
              getVendorNameById(
                Number(
                  vendor.id
                ) ||
                  index + 1
              ),

            overallScore:
              Number(
                vendor.overallScore
              ) || 0,

            status:
              vendor.status ||
              "Completed",

            recommendation:
              vendor.recommendation ||
              "Not Recommended",

            aiInsight:
              vendor.aiInsight ||
              "No AI insight provided.",

            evaluations:
              Array.isArray(
                vendor.evaluations
              )
                ? vendor.evaluations.map(
                    (
                      evaluation: any
                    ) => ({
                      criterion:
                        evaluation.criterion ||
                        "",

                      weight:
                        Number(
                          evaluation.weight
                        ) || 0,

                      score:
                        Number(
                          evaluation.score
                        ) || 0,

                      reason:
                        evaluation.reason ||
                        "No reasoning provided.",

                      reference:
                        evaluation.reference ||
                        "Not specified",
                    })
                  )
                : [],
          })
        )

      setVendors(
        normalizedVendors
      )

      localStorage.setItem(
        "commercialEvaluation",
        JSON.stringify({
          vendors:
            normalizedVendors,
        })
      )

      setShowEvalModal(true)
    } catch (error) {
      console.error(
        "Commercial evaluation error:",
        error
      )

      setReviewError(
        "Unable to load commercial evaluation results."
      )
    } finally {
      setIsReviewing(false)
    }
  }

  // ==========================================================
  // DECISION
  // ==========================================================

  const handleDecideClick = () => {
    setShowDecisionDialog(true)
  }

  const handleCompleteDecision =
    () => {
      setShowDecisionDialog(false)

      setShowSuccessMessage(true)

      if (
        selectedDecision ===
          "completed" &&
        onCommercialCompleted
      ) {
        console.log(
          "Commercial evaluation completed"
        )

        onCommercialCompleted()
      }

      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }

  // ==========================================================
  // GET SORTED VENDORS
  // ==========================================================

  const sortedVendors = [
    ...vendors,
  ].sort(
    (a, b) =>
      b.overallScore -
      a.overallScore
  )

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-white">

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
              Evaluating Vendor Commercial Proposals...
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
                color: "#1B733D",
              }}
            />

            <span
              className="font-normal text-base"
              style={{
                color: "#000525",
              }}
            >
              Commercial evaluation completed successfully
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
            Conduct Commercial Assessment
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

      <div className="flex min-h-[calc(100vh-73px)]">

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
                    key={item.id}
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

            {/* PAGE TITLE */}

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-semibold text-green-700">
                Leadership Development Training Program
              </h2>

              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded">
                Evaluation Inprogress
              </span>

            </div>

            {/* RFP DETAILS */}

            <div
              ref={rfpDetailsRef}
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
                    Eng. Ahmed Saleh (CEC Member)
                  </p>
                </div>

              </div>

            </div>

            {/* ACKNOWLEDGMENT */}

            <div
              ref={acknowledgmentRef}
              className="space-y-4"
            >

              <h3 className="text-xl font-semibold text-green-700">
                Acknowledgment
              </h3>

              <div className="border border-gray-200 rounded-lg p-6 space-y-4">

                <p className="text-sm text-gray-700 leading-relaxed">
                  By confirming below, I acknowledge that I am an authorized member of the Commercial Evaluation Committee for RFP-1003 and that I am present for the official evaluation of the Commercial Proposals.
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

            {/* VENDORS */}

            <div
              ref={vendorsRef}
              className="space-y-4"
            >

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-semibold text-green-700">
                  Vendor list
                </h3>

                {acknowledged && (

                  <div className="flex items-center gap-3">

                    {reviewError && (
                      <span className="text-xs text-red-500">
                        {reviewError}
                      </span>
                    )}

                    {vendors.length > 0 && (

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
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />

                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Sparkles
                            size={16}
                          />

                          {vendors.length >
                          0
                            ? "Re-evaluate with AI"
                            : "Evaluate with AI"}
                        </>
                      )}

                    </button>

                  </div>

                )}

              </div>

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

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                    <div className="grid grid-cols-12 gap-4 bg-[rgb(27,115,61)] p-4 text-sm font-medium text-white">

                      <div className="col-span-3">
                        Vendors ({VENDOR_CONFIG.length})
                      </div>

                      <div className="col-span-3">
                        Evaluation status
                      </div>

                      <div className="col-span-3">
                        Total score (Out of 100)
                      </div>

                      <div className="col-span-3">
                        Recommendation
                      </div>

                    </div>

                    {VENDOR_CONFIG.map(
                      (config) => {

                        const result =
                          vendors.find(
                            (vendor) =>
                              vendor.name
                                ?.toLowerCase() ===
                              config.name.toLowerCase()
                          )

                        return (

                          <div
                            key={
                              config.name
                            }
                            className="grid grid-cols-12 gap-4 p-4 border-t border-gray-200 items-center"
                          >

                            <div className="col-span-3 flex items-center gap-3">

                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                style={{
                                  backgroundColor:
                                    config.color,
                                }}
                              >
                                {
                                  config.avatar
                                }
                              </div>

                              <div>

                                <p className="text-sm font-medium text-gray-900">
                                  {
                                    config.name
                                  }
                                </p>

                                <p className="text-xs text-gray-500">
                                  {
                                    config.location
                                  }
                                </p>

                              </div>

                            </div>

                            <div className="col-span-3">

                              <span
                                className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                                  result
                                    ? result.status
                                        ?.toLowerCase()
                                        .includes(
                                          "complete"
                                        )
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {
                                  result?.status ||
                                  "Pending"
                                }
                              </span>

                            </div>

                            <div className="col-span-3">

                              {result ? (

                                <button
                                  // onClick={() =>
                                  //   openOverallEvaluation(
                                  //     result
                                  //   )
                                  // }
                                  className="px-4 py-2 rounded-lg font-bold text-sm text-gray-900 "
                                >
                                  {
                                    result.overallScore
                                  }
                                  /100
                                </button>

                              ) : (

                                <span className="text-gray-400">
                                  --
                                </span>

                              )}

                            </div>

                            <div className="col-span-3">

                              {result ? (

                                <span
                                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRecommendationClass(
                                    result.recommendation
                                  )}`}
                                >
                                  {
                                    result.recommendation
                                  }
                                </span>

                              ) : (

                                <span className="text-gray-400">
                                  --
                                </span>

                              )}

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
    AI COMMERCIAL EVALUATION RESULTS MODAL
======================================================== */}

{showEvalModal && (
  <div className="fixed inset-0 z-50 bg-black/50 p-4">

    {/* POPUP */}
    <div
      className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto flex flex-col"
      style={{
        width: "92vw",
        maxWidth: "1400px",
        height: "88vh",
      }}
    >

      {/* ==================================================
          HEADER - FIXED
      ================================================== */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0 bg-white z-50">

        <div>
          <h2 className="text-xl font-semibold text-green-700">
            AI Commercial Evaluation
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Vendor proposals evaluated against the RFP commercial evaluation criteria
          </p>
        </div>

        <button
          onClick={() => setShowEvalModal(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          
        </button>

      </div>


      {/* ==================================================
          SINGLE SCROLL CONTAINER
          EVERYTHING INSIDE THIS SCROLLS
      ================================================== */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">

        {/* ==================================================
            VENDOR SUMMARY CARDS
            STICKY WHILE SCROLLING
        ================================================== */}
        <div
          className="
            sticky
            top-0
            z-40
            bg-white
            px-6
            py-6
          "
        >

          <div className="w-full grid grid-cols-3 gap-4">

            {sortedVendors.map((vendor, index) => {

              const actualConfig =
                getVendorConfig(
                  vendor.name ||
                    getVendorNameById(vendor.id)
                );

              return (
                <div
                  key={vendor.id}
                  className="
                    min-w-0
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    p-3
                    bg-white
                    flex
                    items-center
                    justify-between
                    shadow-sm
                  "
                >

                  {/* Vendor information */}
                  <div className="flex items-center gap-2 min-w-0">

                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      style={{
                        backgroundColor:
                          actualConfig.color,
                      }}
                    >
                      {actualConfig.avatar}
                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {actualConfig.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Commercial Proposal
                      </p>

                    </div>

                  </div>


                  {/* Score */}
                  <div className="text-right flex-shrink-0 ml-2">

                    {index === 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium block mb-1">
                        Highest
                      </span>
                    )}

                    <p className="text-2xl font-bold text-gray-900">

                      {vendor.overallScore}

                      

                    </p>

                  </div>

                </div>
              );

            })}

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}
        <div className="px-6 pb-6 pt-2">

          <div className="w-full border border-gray-200 rounded-xl overflow-visible">

            <table className="w-full table-fixed border-collapse">

              {/* ==================================================
                  STICKY TABLE HEADER
              ================================================== */}
              <thead>

                <tr className="bg-[#1B733D] text-white">

                  <th
                    className="
                      px-4
                      py-4
                      text-left
                      w-[34%]
                      bg-[#1B733D]
                      sticky
                      top-[118px]
                      z-30
                    "
                  >
                    Evaluation Criteria
                  </th>

                  <th
                    className="
                      px-4
                      py-4
                      text-center
                      w-[8%]
                      border-r-2
                      border-white/30
                      bg-[#1B733D]
                      sticky
                      top-[118px]
                      z-30
                    "
                  >
                    Weight
                  </th>

                  {sortedVendors.map((vendor) => {

                    const config =
                      getVendorConfig(
                        vendor.name ||
                          getVendorNameById(vendor.id)
                      );

                    return (
                      <th
                        key={vendor.id}
                        className="
                          px-4
                          py-4
                          text-center
                          bg-[#1B733D]
                          sticky
                          top-[118px]
                          z-30
                        "
                        style={{
                          width: `${
                            58 /
                            Math.max(
                              sortedVendors.length,
                              1
                            )
                          }%`,
                        }}
                      >
                        {config.name}
                      </th>
                    );

                  })}

                </tr>

              </thead>


              {/* ==================================================
                  TABLE BODY
              ================================================== */}
              <tbody>

                {COMMERCIAL_CRITERIA.map((criterion) => (

                  <tr
                    key={criterion.name}
                    className="
                      border-t
                      border-gray-200
                      hover:bg-gray-50
                      transition-colors
                    "
                  >

                    {/* Criterion */}
                    <td className="px-4 py-4 align-top">

                      <div className="font-semibold text-gray-900">
                        {criterion.name}
                      </div>

                      <div className="mt-1 text-sm text-gray-500 leading-5">
                        {criterion.description}
                      </div>

                    </td>


                    {/* Weight */}
                    <td
                      className="
                        px-4
                        py-4
                        text-center
                        align-top
                        border-r-2
                        border-gray-300
                      "
                    >

                      <span className="inline-flex items-center justify-center text-gray-700 rounded-full px-3 py-1 text-sm font-semibold">
                        {criterion.weight}
                      </span>

                    </td>


                    {/* Vendor scores */}
                    {sortedVendors.map((vendor) => {

                      const evaluation =
                        getVendorEvaluation(
                          vendor,
                          criterion.name
                        );

                      const score =
                        evaluation?.score ?? null;

                      const maximum =
                        evaluation?.weight ??
                        criterion.weight;

                      return (

                        <td
                          key={vendor.id}
                          className="px-4 py-4 text-center align-top"
                        >

                          {score !== null ? (

                            <button
                              onClick={() => {

                                if (evaluation) {

                                  openCriterionEvaluation(
                                    vendor,
                                    evaluation
                                  );

                                }

                              }}
                              title="Click for more detail"
                              className="
                                inline-flex
                                items-center
                                justify-center
                                min-w-[75px]
                                px-3
                                py-2
                                rounded-lg
                                font-bold
                                text-sm
                                text-gray-900
                                transition
                                hover:scale-105
                                cursor-pointer
                              "
                            >

                              {score}/{maximum}

                            </button>

                          ) : (

                            <span className="text-gray-400">
                              --
                            </span>

                          )}

                        </td>

                      );

                    })}

                  </tr>

                ))}


                {/* ==================================================
                    AI INSIGHTS
                ================================================== */}
                <tr className="border-t border-gray-200 bg-blue-50/40">

                  <td className="px-4 py-3 align-top">

                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      AI Insights
                    </p>

                  </td>

                  <td className="px-4 py-3 border-r-2 border-gray-300" />

                  {sortedVendors.map((vendor) => (

                    <td
                      key={vendor.id}
                      className="px-4 py-3 align-top"
                    >

                      <p className="text-xs text-gray-600 leading-5">
                        {vendor.aiInsight || "--"}
                      </p>

                    </td>

                  ))}

                </tr>

              </tbody>


              {/* ==================================================
                  TOTAL SCORE
              ================================================== */}
              <tfoot>

                <tr className="bg-gray-50 border-t-2 border-gray-300">

                  <td className="px-4 py-5 font-bold text-gray-900">
                    TOTAL SCORE
                  </td>

                  <td className="px-4 py-5 text-center font-bold border-r-2 border-gray-300">
                    100
                  </td>

                  {sortedVendors.map((vendor) => (

                    <td
                      key={vendor.id}
                      className="px-4 py-5 text-center"
                    >

                      <button
                        className="
                          inline-flex
                          items-center
                          justify-center
                          px-4
                          py-2
                          rounded-lg
                          font-bold
                          text-lg
                          text-gray-900
                        "
                      >
                        {vendor.overallScore}/100
                      </button>

                    </td>

                  ))}

                </tr>

              </tfoot>

            </table>

          </div>

        </div>

      </div>


      {/* ==================================================
          FOOTER - FIXED
      ================================================== */}
      <div
        className="
          flex
          justify-between
          items-center
          px-6
          py-4
          border-t
          border-gray-200
          flex-shrink-0
          bg-white
          z-50
        "
      >

        <p className="text-xs text-gray-500">
          Click any criterion score to view its AI reasoning and proposal reference.
        </p>

        <button
          onClick={() => setShowEvalModal(false)}
          className="
            px-5
            py-2
            bg-green-600
            text-white
            rounded-lg
            hover:bg-green-700
            text-sm
            font-medium
          "
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}
      {/* ========================================================
          CRITERION-SPECIFIC AI EVALUATION POPUP
      ======================================================== */}

      {selectedCriterion &&
        selectedCriterionVendor && (

          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 flex-shrink-0">

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                    AI EVALUATION
                  </p>

                  <h2 className="text-2xl font-semibold text-gray-900 mt-2">
                    {
                      getVendorConfig(
                        selectedCriterionVendor.name ||
                          getVendorNameById(
                            selectedCriterionVendor.id
                          )
                      ).name
                    }
                  </h2>

                </div>

                <button
                  onClick={
                    closeCriterionEvaluation
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>

              </div>

              <div className="p-8 space-y-8 overflow-y-auto">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-base text-gray-500">
                      Evaluation Score
                    </p>

                    <p className="text-5xl font-bold text-green-700 mt-1">

                      {
                        selectedCriterion.score
                      }

                      <span className="text-2xl text-gray-400">
                        /
                        {
                          selectedCriterion.weight
                        }
                      </span>

                    </p>

                  </div>

                  <div className="bg-green-50 rounded-2xl px-8 py-5 min-w-[180px]">

                    <p className="text-sm text-green-600 font-semibold text-center uppercase">
                      CRITERIA WEIGHT
                    </p>

                    <p className="text-2xl font-bold text-green-700 text-center mt-1">
                      {
                        selectedCriterion.weight
                      }
                    </p>

                  </div>

                </div>

                <div>

                  <p className="text-base uppercase tracking-wide text-gray-400 font-semibold">
                    EVALUATION CRITERIA
                  </p>

                  <p className="text-lg text-gray-800 mt-3 leading-7">
                    {
                      selectedCriterion.criterion
                    }
                  </p>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    {
                      COMMERCIAL_CRITERIA.find(
                        (criterion) =>
                          normalizeCriterionName(
                            criterion.name
                          ) ===
                          normalizeCriterionName(
                            selectedCriterion.criterion
                          )
                      )?.description
                    }
                  </p>

                </div>

                <div>

                  <p className="text-base uppercase tracking-wide text-gray-400 font-semibold">
                    AI REASONING
                  </p>

                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-2xl p-5">

                    <p className="text-base text-gray-700 leading-7">
                      {
                        selectedCriterion.reason ||
                        "No reasoning provided."
                      }
                    </p>

                  </div>

                </div>

                <div>

                  <p className="text-base uppercase tracking-wide text-gray-400 font-semibold">
                    PROPOSAL REFERENCE
                  </p>

                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-4">

                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">

                      <span className="text-lg">
                        📄
                      </span>

                    </div>

                    <span className="text-base font-medium text-blue-600">
                      {
                        selectedCriterion.reference ||
                        "Not specified"
                      }
                    </span>

                  </div>

                </div>

              </div>

              <div className="flex justify-end px-8 py-5 border-t border-gray-200 flex-shrink-0">

                <button
                  onClick={
                    closeCriterionEvaluation
                  }
                  className="px-7 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-base font-medium transition-colors"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      {/* ========================================================
          OVERALL VENDOR AI EVALUATION POPUP
      ======================================================== */}

      {selectedVendor && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 flex-shrink-0">

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  AI EVALUATION
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {
                    getVendorConfig(
                      selectedVendor.name ||
                        getVendorNameById(
                          selectedVendor.id
                        )
                    ).name
                  }
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedVendor(
                    null
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close AI reasoning"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

            </div>

            <div className="p-8 space-y-6 overflow-y-auto">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Evaluation Score
                  </p>

                  <p className="text-4xl font-bold text-green-700 mt-1">

                    {
                      selectedVendor.overallScore
                    }

                    <span className="text-lg text-gray-400">
                      /100
                    </span>

                  </p>

                </div>

                <div className="bg-green-50 rounded-xl px-6 py-3">

                  <p className="text-xs text-green-600 font-semibold text-center">
                    EVALUATION STATUS
                  </p>

                  <p className="text-xl font-bold text-green-700 text-center">
                    {
                      selectedVendor.status
                    }
                  </p>

                </div>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Overall AI Insight
                </p>

                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <p className="text-sm text-gray-700 leading-6">
                    {
                      selectedVendor.aiInsight ||
                      "No AI reasoning provided."
                    }
                  </p>

                </div>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Recommendation
                </p>

                <div
                  className={`mt-2 rounded-xl px-4 py-3 border ${
                    getRecommendationClass(
                      selectedVendor.recommendation
                    ) ===
                    "bg-green-100 text-green-700"
                      ? "bg-green-50 border-green-100"
                      : getRecommendationClass(
                          selectedVendor.recommendation
                        ) ===
                        "bg-red-100 text-red-700"
                      ? "bg-red-50 border-red-100"
                      : "bg-yellow-50 border-yellow-100"
                  }`}
                >

                  <p
                    className={`text-sm font-semibold ${
                      getRecommendationClass(
                        selectedVendor.recommendation
                      ).includes(
                        "green"
                      )
                        ? "text-green-700"
                        : getRecommendationClass(
                            selectedVendor.recommendation
                          ).includes(
                            "red"
                          )
                        ? "text-red-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {
                      selectedVendor.recommendation
                    }
                  </p>

                </div>

              </div>

            </div>

            <div className="flex justify-end px-8 py-4 border-t border-gray-200 flex-shrink-0">

              <button
                onClick={() =>
                  setSelectedVendor(
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