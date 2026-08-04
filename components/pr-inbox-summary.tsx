"use client"

import { useState } from "react"
import type { PRInboxItem } from "@/types/pr-inbox"
import {
  RiFileList3Line,
  RiInboxArchiveLine,
  RiFileListLine,
  RiFileList2Line,
  RiArrowRightLine,
  RiCloseLine,
  RiSendPlaneFill,
} from "react-icons/ri"
import PRApprovalDecisionDialog from "./pr-approval-decision-dialog"

interface PRInboxSummaryProps {
  pr: PRInboxItem
  onViewDetails: () => void
  onViewInboxRFI?: (rfiId: string) => void
  onViewInboxRFP?: (rfpId: string) => void
  onViewInboxQuotation?: (quotationId: string) => void
  onDecide?: () => void
  onHistory?: () => void
  onRFPPublished?: () => void
}

export default function PRInboxSummary({
  pr,
  onViewDetails,
  onViewInboxRFI,
  onViewInboxRFP,
  onViewInboxQuotation,
  onDecide,
  onHistory,
  onRFPPublished,
}: PRInboxSummaryProps) {
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [selectedPublishOption, setSelectedPublishOption] = useState<string>("")
  const [commentText, setCommentText] = useState("")
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)

  const suppliers = ["Kaar Technologies Private Limited", "Aviation tech Private Limited", "Global tech"]

  const calculatePricingTotals = () => {
    if (!pr?.bill_of_quantity || pr.bill_of_quantity.length === 0) {
      return { totalWithoutVAT: 0, totalVAT: 0, totalWithVAT: 0 }
    }

    const totalWithoutVAT = pr.bill_of_quantity.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.estimated_unit_price || 0)
      const quantity = Number.parseFloat(item.quantity || 0)
      return sum + price * quantity
    }, 0)

    const totalVAT = totalWithoutVAT * 0.15
    const totalWithVAT = totalWithoutVAT + totalVAT

    return { totalWithoutVAT, totalVAT, totalWithVAT }
  }

  const { totalWithoutVAT, totalVAT, totalWithVAT } = calculatePricingTotals()

  const budgetPercentage = 75

  const handleDecideClick = () => {
    setShowDecisionDialog(true)
  }

  const handleCommentsClick = () => {
    setShowCommentsModal(true)
  }

  const handlePublishRFP = () => {
    if (selectedPublishOption) {
      console.log("[v0] Publishing RFP with option:", selectedPublishOption)
      console.log("[v0] Selected suppliers:", selectedSuppliers)
      onRFPPublished?.()
      setShowDecisionDialog(false)
      setSelectedPublishOption("")
      setSelectedSuppliers([])
    }
  }

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[v0] Sending comment:", commentText)
      setCommentText("")
    }
  }

  const toggleSupplier = (supplier: string) => {
    setSelectedSuppliers((prev) => (prev.includes(supplier) ? prev.filter((s) => s !== supplier) : [...prev, supplier]))
  }

  const handleDecisionComplete = () => {
    console.log("[v0] Decision completed")
    setShowDecisionDialog(false)
    // Trigger RFP published callback to move to next task
    if (onRFPPublished) {
      onRFPPublished()
    }
  }

  const handleDecisionCancel = () => {
    setShowDecisionDialog(false)
  }

  return (
    <div className="p-8" style={{ backgroundColor: "#F7F8FA" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
            {pr.pr_number}
          </h2>
        </div>
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
          Approve and Publish RFP - {pr.pr_number}
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
              {pr.requestor_name || "N/A"}
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
              {pr.expected_delivery_date ? new Date(pr.expected_delivery_date).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Created on
            </p>
            <p className="text-sm font-medium" style={{ color: "#000525" }}>
              {pr.created_at ? new Date(pr.created_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
          App tray
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div
            onClick={onViewDetails}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <RiFileList3Line className="text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                PR App
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <RiArrowRightLine className="text-base" style={{ color: "#5F6C81" }} />
              </button>
            </div>
          </div>

          <div
            onClick={() => onViewInboxRFI?.(pr.pr_number)}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <RiInboxArchiveLine className="text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                RFI App
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <RiArrowRightLine className="text-base" style={{ color: "#5F6C81" }} />
              </button>
            </div>
          </div>

          <div
            onClick={() => onViewInboxRFP?.(pr.pr_number)}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <RiFileListLine className="text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                RFP App
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <RiArrowRightLine className="text-base" style={{ color: "#5F6C81" }} />
              </button>
            </div>
          </div>

          <div
            onClick={() => onViewInboxQuotation?.(pr.pr_number)}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <RiFileList2Line className="text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                Quotation App
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <RiArrowRightLine className="text-base" style={{ color: "#5F6C81" }} />
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
            Leadership Development Training Program- {pr.pr_number}
          </h5>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Department
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                {pr.department || "IT & Services"}
              </p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Cost Centre
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                {pr.budget_code_cost_centre || "ITRFP108657"}
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
                1Year 6 Months
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
          Budget
        </h4>
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Remaining Budget
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  SAR 15,000,000
                </p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  RFP Amount (Current)
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  SAR {totalWithVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Remaining Budget after approval
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  SAR 10,000,000
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                Other requests (Pending approval)
              </p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                SAR 9,000,000
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E5E5" strokeWidth="15" strokeLinecap="round" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#F1AA33"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset={314 * (1 - budgetPercentage / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold" style={{ color: "#45546E" }}>
                  {budgetPercentage}% Left
                </span>
              </div>
            </div>
          </div>
        </div>
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
                  {pr.requestor_name || "Johnny cage"}
                </p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Requestor's Manager
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
                  {pr.created_at ? new Date(pr.created_at).toLocaleDateString() : "12 Jan 2025"}
                </p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                  Expected Delivery Date
                </p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                  {pr.expected_delivery_date ? new Date(pr.expected_delivery_date).toLocaleDateString() : "12 Jun 2026"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pr.scope_of_work && (
        <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
            Scope Of Work
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
            {pr.scope_of_work}
          </p>
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
                  All comments added for this PR will be shown here
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

      <PRApprovalDecisionDialog
        isOpen={showDecisionDialog}
        onComplete={handleDecisionComplete}
        onCancel={handleDecisionCancel}
      />

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
