"use client"

import { useState } from "react"
import RatingFeedbackDecisionDialog from "./rating-feedback-decision-dialog"

interface ProcRatingFeedbackPageProps {
  rfpId: string
  onBack: () => void
  onViewRatingApp: () => void
  onRatingProvided?: () => void
}

export default function ProcRatingFeedbackPage({
  rfpId,
  onBack,
  onViewRatingApp,
  onRatingProvided,
}: ProcRatingFeedbackPageProps) {
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)

  const handleDecide = () => {
    setShowDecisionDialog(true)
  }

  const handleDecisionComplete = (decision: string) => {
    console.log("[v0] Rating decision:", decision)
    onRatingProvided?.()
  }

  return (
    <div className="min-h-screen p-8 overflow-y-auto" style={{ backgroundColor: "#F7F8FA" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
            Provide Rating & feedback for RFP {rfpId}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={onBack}>
            <i className="ri-arrow-left-line text-xl text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="ri-message-2-line text-xl text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="ri-history-line text-xl text-gray-600" />
          </button>
          <button
            onClick={handleDecide}
            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#1B733D" }}
          >
            Decide
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: "#000525" }}>
          Provide Rating & feedback for RFP {rfpId}
        </h3>

        {/* Details Grid */}
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Owner
            </p>
            <p className="text-sm font-medium" style={{ color: "#000525" }}>
              Assan Adfa
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

      {/* App Tray */}
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
              <i className="ri-file-list-3-line text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                PR App
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <i className="ri-arrow-right-line text-base" />
              </button>
            </div>
          </div>

          {/* Rating App Card */}
          <div
            onClick={onViewRatingApp}
            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
            >
              <i className="ri-star-line text-2xl" style={{ color: "#1B733D" }} />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                Rating app
              </p>
              <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                View More <i className="ri-arrow-right-line text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
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

      {/* Scope of Work */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
          Scope Of Work
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
         Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over  in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.
        </p>
      </div>

      {/* Requestor details and Dates */}
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

      {/* Goods requested */}
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

      {/* Vendor overview */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>
          Vendor overview
        </h4>

        {/* First row: Vendor info and Budget chart side by side */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left side: Vendor info */}
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4"
              style={{ backgroundColor: "#C25B7C" }}
            >
              KT
            </div>
            <h5 className="text-xl font-semibold mb-2" style={{ color: "#1B733D" }}>
              Kaar Technologies Private Limited
            </h5>
            <span
              className="inline-block px-4 py-1 rounded text-sm font-medium"
              style={{ backgroundColor: "#E0F2F1", color: "#00897B" }}
            >
              Within Budget
            </span>
          </div>

          {/* Right side: Budget chart */}
          <div>
            <h5 className="text-lg font-semibold mb-4" style={{ color: "#1B733D" }}>
              Budget utilization overview
            </h5>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E0E0E0" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FFA726"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="25.12"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-semibold" style={{ color: "#000525" }}>
                    90,000,00
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFA726" }} />
                <div>
                  <p className="text-xs" style={{ color: "#5F6C81" }}>
                    Utilized Price (SAR)
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                    90,000,000
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E0E0E0" }} />
                <div>
                  <p className="text-xs" style={{ color: "#5F6C81" }}>
                    Total price (SAR)
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                    100,000,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Bank Name
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              Saudi National Bank (SNB)
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Account Number
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              123456789012
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              IBAN Number
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              SA1230000001234567890012
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Tax Number
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              3001234567
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Reconciliation Account
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              4000001234
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Initial Guarantee (SAR)
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              10,000
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Phone Number
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              +966 501234567
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Email
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              kaartech@kaatech.com
            </p>
          </div>
          <div>
            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
              Price Preference (SAR)
            </p>
            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
              100,000,000
            </p>
          </div>
        </div>
      </div>

      {/* Recent Invoice snapshot */}
      <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Recent Invoice snapshot</h4>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Download
          </button>
        </div>

        <div className="space-y-6">
          {/* Invoice details */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Invoice number</p>
              <p className="text-base font-medium text-gray-900">019401849713</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date issued</p>
              <p className="text-base font-medium text-gray-900">23 Oct 2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Due date</p>
              <p className="text-base font-medium text-gray-900">22 Nov 2025</p>
            </div>
          </div>

          {/* Billed to / From */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Billed to:</p>
              <p className="text-sm text-gray-700">KaapSarc</p>
              <p className="text-sm text-gray-700">123 Market Street</p>
              <p className="text-sm text-gray-700">San Francisco, CA 94105</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">From:</p>
              <p className="text-sm text-gray-700">Kaar Technologies</p>
              <p className="text-sm text-gray-700">Shyamala Towers, 8th Floor</p>
              <p className="text-sm text-gray-700">Chennai, Tamilnadu, 600015</p>
            </div>
          </div>

          {/* Invoice items table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price (SAR)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total price (SAR)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">Website Redesign (UI/UX)</td>
                  <td className="px-4 py-3 text-sm text-gray-900">1</td>
                  <td className="px-4 py-3 text-sm text-gray-900">5,000</td>
                  <td className="px-4 py-3 text-sm text-gray-900">5,000</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">Monthly Maintenance – October</td>
                  <td className="px-4 py-3 text-sm text-gray-900">1</td>
                  <td className="px-4 py-3 text-sm text-gray-900">1,000</td>
                  <td className="px-4 py-3 text-sm text-gray-900">1,000</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">Hosting Fee</td>
                  <td className="px-4 py-3 text-sm text-gray-900">1</td>
                  <td className="px-4 py-3 text-sm text-gray-900">500</td>
                  <td className="px-4 py-3 text-sm text-gray-900">500</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">6,500</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment details */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3">
            <div className="flex">
              <p className="text-sm text-gray-500 w-40">Payment method</p>
              <p className="text-sm font-medium text-gray-900">Bank transfer</p>
            </div>
            <div className="flex">
              <p className="text-sm text-gray-500 w-40">Bank</p>
              <p className="text-sm font-medium text-gray-900">Axis bank</p>
            </div>
            <div className="flex">
              <p className="text-sm text-gray-500 w-40">Account number</p>
              <p className="text-sm font-medium text-gray-900">AX123000000123456567</p>
            </div>
            <div className="flex">
              <p className="text-sm text-gray-500 w-40">Swift code</p>
              <p className="text-sm font-medium text-gray-900">AXIX3552</p>
            </div>
          </div>

          {/* Thank you message */}
          <div className="text-center pt-4">
            <p className="text-base font-medium text-gray-900">Thank you for your business!</p>
          </div>
        </div>
      </div>

      {/* RatingFeedbackDecisionDialog */}
      <RatingFeedbackDecisionDialog
        isOpen={showDecisionDialog}
        onClose={() => setShowDecisionDialog(false)}
        onComplete={handleDecisionComplete}
      />
    </div>
  )
}
