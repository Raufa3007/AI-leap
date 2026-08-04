"use client"

import { useState } from "react"
import { RiCloseLine, RiSendPlaneFill, RiCheckboxCircleLine, RiArrowLeftLine } from "react-icons/ri"
import RfpDecisionDialog from "./rfp-decision-dialog"
import TechnicalDecisionDialog from "./technical-decision-dialog"
import CommercialDecisionDialog from "./commercial-decision-dialog"

interface CommitteeAssignmentPageProps {
  onBack: () => void
  onNavigateToTechnicalEvaluation?: () => void
  assessmentType?: "technical" | "commercial"
  onNavigateToCommercialEvaluation?: () => void
  onHistory?: () => void
  onCommitteeCompleted?: () => void
  onTechnicalCompleted?: () => void
  onCommercialCompleted?: () => void
}

export default function CommitteeAssignmentPage({
  onBack,
  onNavigateToTechnicalEvaluation,
  assessmentType = "technical",
  onNavigateToCommercialEvaluation,
  onHistory,
  onCommitteeCompleted,
  onTechnicalCompleted,
  onCommercialCompleted,
}: CommitteeAssignmentPageProps) {
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const title =
    assessmentType === "commercial"
      ? "Conduct Commercial assessment for RFP #343"
      : "Conduct Technical assessment for RFP #343"

  const appName = assessmentType === "commercial" ? "Commercial evaluation app" : "Technical evaluation app"

  const handleEvaluationClick = () => {
    if (assessmentType === "commercial") {
      onNavigateToCommercialEvaluation?.()
    } else {
      onNavigateToTechnicalEvaluation?.()
    }
  }

  const handleCommentsClick = () => {
    setShowCommentsModal(true)
  }

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[v0] Sending comment:", commentText)
      setCommentText("")
    }
  }

  const handleDecideClick = () => {
    setShowDecisionDialog(true)
  }

  const handleCompleteDecision = () => {
    console.log("[v0] Committee assignment decision completed")
    setShowDecisionDialog(false)
    setShowSuccessMessage(true)

    if (assessmentType === "commercial" && onCommercialCompleted) {
      console.log("[v0] Triggering onCommercialCompleted callback for commercial assessment")
      onCommercialCompleted()
    } else if (assessmentType === "technical" && onTechnicalCompleted) {
      console.log("[v0] Triggering onTechnicalCompleted callback for technical assessment")
      onTechnicalCompleted()
    } else if (!assessmentType && onCommitteeCompleted) {
      console.log("[v0] Triggering onCommitteeCompleted callback for committee assignment")
      onCommitteeCompleted()
    } else if (onCommitteeCompleted) {
      console.log("[v0] Triggering onCommitteeCompleted callback as fallback")
      onCommitteeCompleted()
    }

    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen p-8 overflow-y-auto" style={{ backgroundColor: "#F7F8FA" }}>
      {showSuccessMessage && (
        <div
          className="fixed top-4 left-4 z-50 bg-white rounded-md shadow-lg flex items-center gap-3 pr-4"
          style={{ borderLeft: "4px solid #1B733D" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <RiCheckboxCircleLine className="text-2xl" style={{ color: "#1B733D" }} />
            <span className="font-normal text-base" style={{ color: "#000525" }}>
              RFP approved successfully
            </span>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <RiCloseLine className="text-xl text-gray-600" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Go back">
          <RiArrowLeftLine className="text-xl" style={{ color: "#1B733D" }} />
        </button>
        <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
          RFP#4542
        </h2>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <button onClick={handleCommentsClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="ri-message-2-line text-xl text-gray-600" />
          </button>
          <button onClick={onHistory} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="ri-history-line text-xl text-gray-600" />
          </button>
          <button
            onClick={handleDecideClick}
            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#1B733D" }}
          >
            Decide
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: "#000525" }}>
          {title}
        </h3>
        <span
          className="inline-block px-3 py-1 rounded text-sm font-medium"
          style={{ backgroundColor: "#FFF3E0", color: "#F57C00" }}
        >
          In progress
        </span>

        <div className="grid grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Owner
            </p>
            <p className="text-sm font-medium" style={{ color: "#000525" }}>
              Aslam Arfiz
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Process
            </p>
            <p className="text-sm font-medium" style={{ color: "#000525" }}>
              RFP
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Due date
            </p>
            <p className="text-sm font-medium" style={{ color: "#000525" }}>
              24 Oct 2025
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Created on
            </p>
            <p className="text-sm font-medium" style={{ color: "#000525" }}>
              17 Oct 2025
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
          App tray
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {/* PR App Card */}
          <div
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <i className="ri-draft-line text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                PR app
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
              </button>
            </div>
          </div>

          {/* RFP App Card */}
          <div
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <i className="ri-file-list-line text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                RFP app
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
              </button>
            </div>
          </div>

          {/* Evaluation App Card */}
          <div
            onClick={handleEvaluationClick}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <i className="ri-folder-chart-line text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                {appName}
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
          Additional details
        </h4>
        <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <h5 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
            Leadership Development Training Program- 10000000107
          </h5>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Department
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                IT & Services
              </p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Cost Centre
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                ITRFP108657
              </p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Purchase Group
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                Service
              </p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Contract Duration
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                1 Year 6 Months
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
          Scope Of Work
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
         Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over  in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
              Requestor details
            </h4>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Requested By
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  Johnny cage
                </p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Requestor's Manger
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  Rebecca ferguson
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
              Dates
            </h4>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Created Date
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  12 Jan 2025
                </p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Expected Delivery Date
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  12 Jun 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>
          Goods requested
        </h4>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>
              1,015,000
            </p>
            <p className="text-sm" style={{ color: "#5F6C81" }}>
              Total estimated cost
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>
              101,500
            </p>
            <p className="text-sm" style={{ color: "#5F6C81" }}>
              Tax Amount
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>
              1,116,500
            </p>
            <p className="text-sm" style={{ color: "#5F6C81" }}>
              PR Estimated Price (With Tax)
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead style={{ backgroundColor: "#1B733D" }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Item description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Units of measure</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Unit price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Total price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  Dell Latitude Laptop
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  10
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  Pcs
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  100,000
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  1,000,000
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  Docking Station
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  10
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  Pcs
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  1,000
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  10,000
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  Wireless Mouse
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  10
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  Pcs
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  500
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  5,000
                </td>
              </tr>
              <tr style={{ backgroundColor: "#F7F8FA" }}>
                <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#000525" }} colSpan={4}>
                  Total cost
                </td>
                <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#000525" }}>
                  1,015,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>
          Vendor overview
        </h4>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F7F8FA" }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: "#45546E" }}>
                  Invited vendors
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: "#45546E" }}>
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: "#45546E" }}>
                  CR number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: "#45546E" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: "#45546E" }}>
                  Proposed value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#FF6B6B" }}
                    >
                      O
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#000525" }}>
                        O Vendor
                      </p>
                      <p className="text-xs" style={{ color: "#5F6C81" }}>
                        London
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <i key={star} className="ri-star-fill text-orange-400 text-sm" />
                    ))}
                    <span className="text-sm font-medium ml-2" style={{ color: "#000525" }}>
                      4
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  CR123456789
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Submitted
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#000525" }}>
                  21,456
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#4A5568" }}
                    >
                      V
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#000525" }}>
                        Voo Supplier
                      </p>
                      <p className="text-xs" style={{ color: "#5F6C81" }}>
                        New York
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="ri-star-fill text-orange-400 text-sm" />
                    ))}
                    <span className="text-sm font-medium ml-2" style={{ color: "#000525" }}>
                      5
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  CR0987654321
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Not submitted
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#000525" }}>
                  35,789
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#3B82F6" }}
                    >
                      H
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#000525" }}>
                        H Distributor
                      </p>
                      <p className="text-xs" style={{ color: "#5F6C81" }}>
                        Tokyo
                      </p>
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded mt-1">
                        New
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm" style={{ color: "#5F6C81" }}>
                    No ratings available
                  </p>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  CR1122334455
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Submitted
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#000525" }}>
                  58,541
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#8B5CF6" }}
                    >
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#000525" }}>
                        AV Retailer
                      </p>
                      <p className="text-xs" style={{ color: "#5F6C81" }}>
                        Toronto
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <i key={star} className="ri-star-fill text-orange-400 text-sm" />
                    ))}
                    <span className="text-sm font-medium ml-2" style={{ color: "#000525" }}>
                      4
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                  CR9988776655
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Submitted
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#000525" }}>
                  45,300
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showDecisionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {assessmentType === "commercial" ? (
            <CommercialDecisionDialog
              onComplete={handleCompleteDecision}
              onCancel={() => setShowDecisionDialog(false)}
            />
          ) : assessmentType === "technical" ? (
            <TechnicalDecisionDialog
              onComplete={handleCompleteDecision}
              onCancel={() => setShowDecisionDialog(false)}
            />
          ) : (
            <RfpDecisionDialog onComplete={handleCompleteDecision} onCancel={() => setShowDecisionDialog(false)} />
          )}
        </div>
      )}

      {showCommentsModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowCommentsModal(false)} />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl"
            style={{
              animation: "slideInRight 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold" style={{ color: "#000525" }}>
                  Comments
                </h3>
                <p className="text-sm mt-1" style={{ color: "#5F6C81" }}>
                  All comments added for this RFP will be shown here
                </p>
              </div>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RiCloseLine className="text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex flex-col items-end">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="flex-1">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-xs" style={{ color: "#5F6C81" }}>
                          Yesterday, 4:30 PM
                        </span>
                        <span className="text-xs font-medium" style={{ color: "#000525" }}>
                          Arbel Zaidel (Procurement manager)
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm" style={{ color: "#000525" }}>
                          Can you define timeline for each deliverables ?
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
                    >
                      AZ
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Mark Siegelman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: "#000525" }}>
                        Mark Siegelman (Requestor)
                      </span>
                      <span className="text-xs" style={{ color: "#5F6C81" }}>
                        Today, 10:00 AM
                      </span>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: "#E8F5E9" }}>
                      <p className="text-sm" style={{ color: "#000525" }}>
                        Sure Arbel, Will add & resubmit the proposal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="write your comments here ..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  style={{ color: "#000525" }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendComment()
                    }
                  }}
                />
                <button
                  onClick={handleSendComment}
                  className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors flex items-center gap-2"
                  style={{ backgroundColor: "#1B733D" }}
                >
                  <RiSendPlaneFill className="text-lg" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
