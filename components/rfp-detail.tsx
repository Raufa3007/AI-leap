"use client"

import BudgetCard from "./budget-card"
import RequestorCard from "./requestor-card"

interface RfpDetailProps {
  rfpId?: string
  title?: string
  department?: string
  costCentre?: string
  purchaseGroup?: string
  contractDuration?: string
}

export default function RfpDetail({
  rfpId = "RFP_10000000107",
  title = "Leadership Development Training Program",
  department = "IT & Services",
  costCentre = "ITRFP108657",
  purchaseGroup = "Service",
  contractDuration = "1Year 6 Months",
}: RfpDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {title} - {rfpId}
        </h2>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Department</p>
          <p className="text-sm font-semibold text-gray-900">{department}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Cost Centre</p>
          <p className="text-sm font-semibold text-gray-900">{costCentre}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Purchase Group</p>
          <p className="text-sm font-semibold text-gray-900">{purchaseGroup}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Contract Duration</p>
          <p className="text-sm font-semibold text-gray-900">{contractDuration}</p>
        </div>
      </div>

      {/* Budget Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Budget</h3>
        <div className="grid grid-cols-4 gap-4">
          <BudgetCard title="Remaining Budget" amount="SAR 15,000,000" />
          <BudgetCard title="RFP Amount (Current)" amount="SAR 5,000,000" />
          <BudgetCard title="Other requests (Pending approval)" amount="SAR 9,000,000" />
          <BudgetCard title="Remaining Budget after approval" amount="SAR 10,000,000" isChart percentage={75} />
        </div>
      </div>

      {/* Requestor & Dates */}
      <div className="grid grid-cols-2 gap-6">
        <RequestorCard requestedBy="Johnny cage" requestorManager="Rebecca ferguson" />
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Dates</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Created Date</p>
              <p className="text-sm font-semibold text-gray-900">12 Jan 2025</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Expected Delivery Date</p>
              <p className="text-sm font-semibold text-gray-900">12 Jun 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scope of Work */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Scope Of Work</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Streamline procurement workflows, manage vendor relationships, track purchases, and control budgets.
        </p>
      </div>

      {/* Estimations */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Estimations</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">RFP Estimated Price (Without VAT)</p>
            <p className="text-sm font-semibold text-gray-900">SAR 100,000,000</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">VAT Amount</p>
            <p className="text-sm font-semibold text-gray-900">SAR 15,000,000</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">RFP Estimated Price (With VAT)</p>
            <p className="text-sm font-semibold text-gray-900">SAR 85,000,000</p>
          </div>
        </div>
      </div>

      {/* Technical Committee */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Technical Committee Members</h3>
        <div>
          <p className="text-xs text-gray-600 mb-1">Manager</p>
          <p className="text-sm font-semibold text-gray-900">Not Assigned</p>
        </div>
      </div>
    </div>
  )
}
