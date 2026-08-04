"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import VendorDetailsOverview from "./vendor-details-overview"
import VendorDetailsRelationship from "./vendor-details-relationship"
import VendorDetailsInvoices from "./vendor-details-invoices"
import VendorDetailsDocuments from "./vendor-details-documents"

interface VendorDetailsPageProps {
  vendorId: string
  onBack: () => void
}

const vendorNames: Record<string, string> = {
  "76567": "Palm tree IT services",
  "76560": "YCP Group",
  "66789": "Accely",
  "66785": "Traderston",
  "66782": "Supreme Group",
  "66780": "Aviaan Group",
  "66779": "Futtiam Group",
  "66778": "Emirates Group",
}

export default function VendorDetailsPage({ vendorId, onBack }: VendorDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "relationship" | "invoices" | "documents">("overview")
  const vendorName = vendorNames[vendorId] || "Vendor"

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-green-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{vendorName}</h1>
        </div>

        <div className="flex gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("relationship")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "relationship"
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Relationship
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "invoices"
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "documents"
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "overview" && <VendorDetailsOverview vendorId={vendorId} />}
        {activeTab === "relationship" && <VendorDetailsRelationship vendorId={vendorId} />}
        {activeTab === "invoices" && <VendorDetailsInvoices vendorId={vendorId} />}
        {activeTab === "documents" && <VendorDetailsDocuments vendorId={vendorId} />}
      </div>
    </div>
  )
}
