"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, LayoutGrid, X } from "lucide-react"
import SignatureVerificationDialog from "./signature-verification-dialog"
import TechnicalEvaluationTable from "./technical-evaluation-table"
import FinancialEvaluationTable from "./financial-evaluation-table"
import AssessmentDecisionDialog from "./assessment-decision-dialog"

type EvaluationRow = { [key: string]: string }

const VENDOR_SCORE_MAP: { name: string; scoreKey: string; location: string; avatar: string; color: string }[] = [
  { name: "Accenture",         scoreKey: "1_Accenture Proposal.txt Score", location: "New York",  avatar: "A", color: "#4A5568" },
  { name: "Deloitte",          scoreKey: "2_Deloitte Proposal.txt Score",  location: "London",   avatar: "D", color: "#3B82F6" },
  { name: "Kaar Technologies", scoreKey: "3_KaarTech Proposal.txt Score",  location: "Chennai",  avatar: "K", color: "#FF6B6B" },
]

function parseScore(raw: string | undefined): number | null {
  if (!raw) return null
  const n = parseInt(raw.replace(/\*/g, "").trim(), 10)
  return isNaN(n) ? null : n
}

interface TechnicalEvaluationPageProps {
  onBack: () => void
  onNavigateToVendorEvaluation: () => void
  onCommercialCompleted?: () => void
}

export default function TechnicalEvaluationPage({
  onBack,
  onNavigateToVendorEvaluation,
  onCommercialCompleted,
}: TechnicalEvaluationPageProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const [activeSection, setActiveSection] = useState("rfp-details")
  const [collapsed, setCollapsed] = useState(false)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [selectedDecision, setSelectedDecision] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [vendorDecisions, setVendorDecisions] = useState<{ [key: number]: "approved" | "rejected" | "pending" }>(
    { 0: "pending", 1: "pending", 2: "pending" }
  )
  const [vendorScores, setVendorScores] = useState<{ [name: string]: number | null }>({})
  const [evalRows, setEvalRows] = useState<EvaluationRow[]>([])
  const [evalHeaders, setEvalHeaders] = useState<string[]>([])
  const [showEvalModal, setShowEvalModal] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewError, setReviewError] = useState("")

  const rfpDetailsRef = useRef<HTMLDivElement>(null)
  const acknowledgmentRef = useRef<HTMLDivElement>(null)
  const vendorsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      if (vendorsRef.current && scrollPosition >= vendorsRef.current.offsetTop) {
        setActiveSection("vendors")
      } else if (acknowledgmentRef.current && scrollPosition >= acknowledgmentRef.current.offsetTop) {
        setActiveSection("acknowledgment")
      } else {
        setActiveSection("rfp-details")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const refs = {
      "rfp-details": rfpDetailsRef,
      acknowledgment: acknowledgmentRef,
      vendors: vendorsRef,
    }
    const ref = refs[sectionId as keyof typeof refs]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleAcknowledgeClick = () => {
    setShowSignatureDialog(true)
  }

  const handleSignatureAcknowledge = () => {
    setAcknowledged(true)
    setShowSignatureDialog(false)
  }

  const handleReview = async () => {
    setIsReviewing(true)
    setReviewError("")
    try {
      const res = await fetch("http://127.0.0.1:5000/evaluate", { method: "POST" })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const rows: EvaluationRow[] = data?.evaluation_table ?? []
      if (!rows.length) {
        setReviewError("Evaluation has not been completed yet.")
        setIsReviewing(false)
        return
      }
      const totalRow = rows.find(
        (r) => r["Main Criterion"]?.replace(/\*/g, "").trim().toLowerCase() === "total score"
      )
      const scores: { [name: string]: number | null } = {}
      VENDOR_SCORE_MAP.forEach(({ name, scoreKey }) => {
        scores[name] = parseScore(totalRow?.[scoreKey])
      })
      setVendorScores(scores)
      setEvalRows(rows)
      setEvalHeaders(Object.keys(rows[0]))
      setShowEvalModal(true)
    } catch {
      setReviewError("Unable to load evaluation results.")
    } finally {
      setIsReviewing(false)
    }
  }

  const handleDecideClick = () => {
    setShowDecisionDialog(true)
  }

  const handleCompleteDecision = () => {
    setShowDecisionDialog(false)
    setShowSuccessMessage(true)

    if (selectedDecision === "completed" && onCommercialCompleted) {
      console.log("[v0] Technical evaluation completed, triggering commercial evaluation visibility")
      onCommercialCompleted()
    }

    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {showSuccessMessage && (
        <div
          className="fixed top-4 left-4 z-50 bg-white rounded-md shadow-lg flex items-center gap-3 pr-4"
          style={{ borderLeft: "4px solid #1B733D" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <i className="ri-checkbox-circle-line text-2xl" style={{ color: "#1B733D" }} />
            <span className="font-normal text-base" style={{ color: "#000525" }}>
              Technical evaluation completed successfully
            </span>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <i className="ri-close-line text-xl text-gray-600" />
          </button>
        </div>
      )}

      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-green-700">Conduct Technical assessment</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <i className="ri-save-line" />
            Save As Draft
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <i className="ri-check-line" />
            Save
          </button>
          
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`transition-all duration-300 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              {!collapsed && <h2 className="text-sm font-semibold text-gray-900">Sections</h2>}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 hover:bg-gray-200 rounded transition"
                aria-label="Toggle collapse"
              >
                <LayoutGrid className="text-gray-600 w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {[
                { id: "rfp-details", label: "RFP details" },
                { id: "acknowledgment", label: "Acknowledgment" },
                { id: "vendors", label: "Vendors" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative w-full text-left px-3 py-2 rounded text-sm flex items-center transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {!collapsed && <span className="transition-all duration-200">{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-green-700">Leadership Development Training Program</h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded">
                Evaluation Inprogress
              </span>
            </div>

            <div ref={rfpDetailsRef} className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">RFP ID</p>
                  <p className="text-sm font-semibold text-blue-600">RFP2131424</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">PR Reference</p>
                  <p className="text-sm font-semibold text-blue-600">PR524252</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Bid closing date/time</p>
                  <p className="text-sm font-medium text-gray-900">29th Oct 2025, 5:00 PM</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Deadline</p>
                  <p className="text-sm text-gray-900">24-Oct-2025 6:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Evaluator</p>
                  <p className="text-sm text-gray-900">Eng. Ahmed Saleh (TEC Member)</p>
                </div>
              </div>
            </div>

            <div ref={acknowledgmentRef} className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">Acknowledgment</h3>
              <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  By confirming below, I acknowledge that I am an authorized member of the Technical Evaluation
                  Committee for RFP-1003 and that I am present for the official opening of the Technical Proposals.
                </p>
                <p className="text-sm text-gray-700">
                  You will receive a confirmation code on your registered mobile number.
                </p>
                {!acknowledged ? (
                  <button
                    onClick={handleAcknowledgeClick}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    I acknowledge
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 cursor-not-allowed"
                  >
                    <i className="ri-check-line" />
                    You have acknowledged
                  </button>
                )}
              </div>
            </div>

            <div ref={vendorsRef} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-green-700">Vendor list</h3>
                {acknowledged && (
                  <div className="flex items-center gap-3">
                    {reviewError && (
                      <span className="text-xs text-red-500">{reviewError}</span>
                    )}
                    <button
                      onClick={handleReview}
                      disabled={isReviewing}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isReviewing ? (
                        <><span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" /> Evaluating...</>
                      ) : "Evaluate with AI"}
                    </button>
                    {/* <button
                      onClick={onNavigateToVendorEvaluation}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Evaluate vendors
                    </button> */}
                  </div>
                )}
              </div>

              {!acknowledged ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <img src="/locked-documents-illustration.jpg" alt="Locked" className="w-64 h-48 opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <i className="ri-lock-fill text-3xl text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-700">Vendors list & submissions are locked</p>
                  <p className="text-sm text-gray-500">Kindly acknowledge to proceed</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 bg-blue-900 text-white p-4 font-medium text-sm">
                      <div className="col-span-3">Vendors ({VENDOR_SCORE_MAP.length})</div>
                      <div className="col-span-3">Evaluation status</div>
                      <div className="col-span-3">Total score (Out of 100)</div>
                      <div className="col-span-3">Decision</div>
                    </div>
                    {VENDOR_SCORE_MAP.map((vendor, index) => {
                      const decision = vendorDecisions[index]
                      const score = vendorScores[vendor.name]
                      return (
                        <div key={index} className="grid grid-cols-12 gap-4 p-4 border-t border-gray-200 items-center">
                          <div className="col-span-3 flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: vendor.color }} onClick={onNavigateToVendorEvaluation}
                            >
                              {vendor.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900" onClick={onNavigateToVendorEvaluation}>{vendor.name}</p>
                              <p className="text-xs text-gray-500" onClick={onNavigateToVendorEvaluation}>{vendor.location}</p>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                                decision === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : decision === "rejected"
                                  ? "bg-red-100 text-red-600"
                                  : score !== null && score !== undefined
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-600"
                              }`}
                            >
                              {decision === "approved" ? "Approved" : decision === "rejected" ? "Rejected" : score !== null && score !== undefined ? "Completed" : "Pending"}
                            </span>
                          </div>
                          <div className="col-span-3">
                            <p className="text-sm font-semibold text-gray-900">
                              {score !== null && score !== undefined ? score : "--"}
                            </p>
                          </div>
                          <div className="col-span-3 flex items-center gap-2">
                            <button
                              onClick={() => setVendorDecisions((prev) => ({ ...prev, [index]: "approved" }))}
                              disabled={decision !== "pending"}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                decision === "approved"
                                  ? "bg-green-600 text-white cursor-not-allowed"
                                  : decision !== "pending"
                                  ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                                  : "border border-green-600 text-green-600 hover:bg-green-50"
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setVendorDecisions((prev) => ({ ...prev, [index]: "rejected" }))}
                              disabled={decision !== "pending"}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                decision === "rejected"
                                  ? "bg-red-600 text-white cursor-not-allowed"
                                  : decision !== "pending"
                                  ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                                  : "border border-red-500 text-red-500 hover:bg-red-50"
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                 
                </div>
              )}
            </div>
          </div>
        </div>

        {showDecisionDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <AssessmentDecisionDialog
              onComplete={handleCompleteDecision}
              onCancel={() => setShowDecisionDialog(false)}
              onDecisionChange={setSelectedDecision}
            />
          </div>
        )}

        <SignatureVerificationDialog
          isOpen={showSignatureDialog}
          onClose={() => setShowSignatureDialog(false)}
          onAcknowledge={handleSignatureAcknowledge}
        />
      </div>

      {/* AI Evaluation Results Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: "90vw", maxHeight: "85vh" }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-green-700">AI Evaluation Results</h2>
              <button
                onClick={() => setShowEvalModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body — scrollable table */}
            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" style={{ minWidth: "1100px" }}>
                  <thead>
                    <tr>
                      {evalHeaders.map((h) => (
                        <th
                          key={h}
                          className="bg-gray-50 text-left px-3 py-2 font-semibold text-gray-700 border border-gray-200 whitespace-nowrap"
                          style={{ minWidth: "140px" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {evalRows.map((row, i) => {
                      const isTotal =
                        row["Main Criterion"]?.replace(/\*/g, "").trim().toLowerCase() === "total score"
                      return (
                        <tr
                          key={i}
                          className={isTotal ? "bg-green-700 text-white font-semibold" : "border-b border-gray-100 hover:bg-gray-50"}
                        >
                          {evalHeaders.map((h) => (
                            <td key={h} className="px-3 py-2 border border-gray-200 align-middle">
                              {row[h] === "N/A" ? "" : row[h]}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowEvalModal(false)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
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
