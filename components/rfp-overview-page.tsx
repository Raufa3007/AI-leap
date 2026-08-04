"use client"

import { useState } from "react"
import RfpDecisionDialog from "./rfp-decision-dialog"

interface RfpOverviewPageProps {
  onBack?: () => void
  onNavigateToCommittee?: () => void
  onCommitteeCompleted?: () => void
}

const Index = ({ onNavigateToCommittee, onCommitteeCompleted }: RfpOverviewPageProps) => {
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleCommentsClick = () => {
    setShowCommentsModal(true)
  }

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[Comment] Sending comment:", commentText)
      setCommentText("")
    }
  }

  const handleDecideClick = () => {
    setShowDecisionDialog(true)
  }

  const handleCompleteDecision = () => {
    console.log("[v0] Committee assignment decision completed in RFPOverviewPage")
    setShowDecisionDialog(false)
    setShowSuccessMessage(true)

    // Notify parent component that committee assignment is completed
    if (onCommitteeCompleted) {
      console.log("[v0] Triggering onCommitteeCompleted callback from RFPOverviewPage")
      onCommitteeCompleted()
    }

    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const handleCancelDecision = () => {
    setShowDecisionDialog(false)
  }

  const handleCommitteeAppClick = () => {
    onNavigateToCommittee?.()
  }

  return (
    <div className="min-h-screen p-8 overflow-y-auto" style={{ backgroundColor: "#F7F8FA" }}>
      {showSuccessMessage && (
        <div
          className="fixed top-4 left-4 z-50 bg-white rounded-md shadow-lg flex items-center gap-3 pr-4"
          style={{ borderLeft: "4px solid #1B733D" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <svg className="w-6 h-6" style={{ color: "#1B733D" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-normal text-base" style={{ color: "#000525" }}>
              RFP approved successfully
            </span>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
            RFP#4542
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCommentsClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
          Assign committee members & evaluation criteria for RFP #4542
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
              Aslan Arfiz
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
          <div
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: "#1B733D" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                PR app
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: "#1B733D" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                RFP app
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            onClick={handleCommitteeAppClick}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: "#1B733D" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                Committee app
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-bold mb-1" style={{ color: "#000525" }}>
              1,015,000
            </p>
            <p className="text-xs" style={{ color: "#5F6C81" }}>
              Total estimated cost
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-bold mb-1" style={{ color: "#000525" }}>
              101,500
            </p>
            <p className="text-xs" style={{ color: "#5F6C81" }}>
              Tax Amount
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-bold mb-1" style={{ color: "#000525" }}>
              1,116,500
            </p>
            <p className="text-xs" style={{ color: "#5F6C81" }}>
              PR Estimated Price (With Tax)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#1B733D" }}>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">Item description</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">Units of measure</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">Unit price</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">Total price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  Dell Latitude Laptop
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  10
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  Pcs
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  100,000
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  1,000,000
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  Docking Station
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  10
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  Pcs
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  1,000
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  10,000
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  Wireless Mouse
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  10
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  Pcs
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  500
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                  5,000
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#000525" }} colSpan={4}>
                  Total cost
                </td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#000525" }}>
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#F7F8FA" }}>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#455468" }}>
                  Invited vendors
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#455468" }}>
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#455468" }}>
                  CR number
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#455468" }}>
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#455468" }}>
                  Proposed value ↓
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                {
                  name: "O Vendor",
                  location: "London",
                  rating: 4,
                  cr: "CR1234567890",
                  status: "Submitted",
                  value: "21,456",
                  color: "#FF6B6B",
                },
                {
                  name: "Voo Supplier",
                  location: "New York",
                  rating: 5,
                  cr: "CR0987654321",
                  status: "Not submitted",
                  value: "35,789",
                  color: "#4A5568",
                },
                {
                  name: "H Distributor",
                  location: "Tokyo",
                  rating: 3,
                  cr: "CR1122334455",
                  status: "Submitted",
                  value: "58,541",
                  color: "#3B82F6",
                },
                {
                  name: "V Manufacturer",
                  location: "Berlin",
                  rating: 0,
                  cr: "CR5566778899",
                  status: "Submitted",
                  value: "72,650",
                  color: "#8B5CF6",
                  isNew: true,
                },
                {
                  name: "AV Retailer",
                  location: "Toronto",
                  rating: 4,
                  cr: "CR9988776655",
                  status: "Submitted",
                  value: "45,300",
                  color: "#10B981",
                },
              ].map((vendor, idx) => (
                <tr key={idx} className="border-b border-gray-200 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                        style={{ backgroundColor: vendor.color }}
                      >
                        {vendor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#000525" }}>
                          {vendor.name}
                        </p>
                        <p className="text-xs" style={{ color: "#5F6C81" }}>
                          {vendor.location}
                        </p>
                        {vendor.isNew && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1"
                            style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
                          >
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {vendor.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < vendor.rating ? "text-orange-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm ml-1" style={{ color: "#000525" }}>
                          {vendor.rating}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "#5F6C81" }}>
                        No ratings available
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                    {vendor.cr}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        vendor.status === "Submitted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#000525" }}>
                    {vendor.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Updated Decision Dialog */}
      {showDecisionDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <RfpDecisionDialog onComplete={handleCompleteDecision} onCancel={handleCancelDecision} />
        </div>
      )}

      {/* Comments Modal */}
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
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: "#E8F5E9", color: "#1B733D" }}
                  >
                    MS
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

export default Index
