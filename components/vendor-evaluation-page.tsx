"use client"

import { useState } from "react"
import { ChevronLeft, LayoutGrid, Download } from "lucide-react"

interface VendorEvaluationPageProps {
  onBack: () => void
  evaluationType?: "technical" | "commercial"
}

const vendors = [
  { id: 1, name: "Kaar Technologies", crNumber: "1010234567", status: "Preferred", statusColor: "green",  avatar: "KT", avatarBg: "#E57373", location: "Chennai",  address: "223 Al Kharj Rd, New Industrial Area, Riyadh 11472, Saudi Arabia" },
  { id: 2, name: "Accenture",         crNumber: "1010234568", status: "Strategic", statusColor: "blue",   avatar: "AC", avatarBg: "#4A5568", location: "New York", address: "1 Accenture Way, New York, NY 10036, USA" },
  { id: 3, name: "Deloitte",          crNumber: "1010234569", status: "New",       statusColor: "orange", avatar: "DL", avatarBg: "#3B82F6", location: "London",   address: "1 New Street Square, London EC4A 3HQ, UK" },
]

const documents = [
  { type: "Financial Offer",                    fileName: "Financial Offer",         size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Technical Offer",                    fileName: "Technical Offer",         size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Proof of SME affiliation",           fileName: "Affiliation",             size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Bank Guarantee",                     fileName: "Bank Guarantee",          size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Commercial Registration / Licences", fileName: "Commercial Registration", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Certificate of Zakat / Tax",         fileName: "Tax",                     size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "General Insurance Certificate",      fileName: "Insurance",               size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Chamber of Commerce Affiliation",    fileName: "Chamber Affiliation",     size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Saudization Certificate",            fileName: "Saudization",             size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
  { type: "Others",                             fileName: "Licences",                size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022" },
]

const statusBadge: Record<string, string> = {
  green:  "bg-green-100 text-green-700",
  blue:   "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-600",
}

export default function VendorEvaluationPage({ onBack }: VendorEvaluationPageProps) {
  const [selectedVendor, setSelectedVendor] = useState(vendors[0])
  const [activeTab, setActiveTab]           = useState<"overview" | "documents">("overview")
  const [collapsed, setCollapsed]           = useState(false)

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* ── Header ── */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-green-700">Vendor Evaluations</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm">
            <i className="ri-save-line" />
            Save As Draft
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm">
            <i className="ri-check-line" />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Sidebar — Vendor List ── */}
        <div
          className={`transition-all duration-300 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 ${
            collapsed ? "w-16" : "w-72"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              {!collapsed && <h2 className="text-sm font-semibold text-gray-900">Vendor List</h2>}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 hover:bg-gray-200 rounded transition"
                aria-label="Toggle collapse"
              >
                <LayoutGrid className="text-gray-600 w-5 h-5" />
              </button>
            </div>

            {!collapsed && (
              <div className="space-y-2">
                {vendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedVendor.id === vendor.id
                        ? "bg-green-50 border-green-600"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: vendor.avatarBg }}
                      >
                        {vendor.avatar}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.name}</p>
                    </div>
                    <div className="flex items-center justify-between pl-11">
                      <p className="text-xs text-gray-500">{vendor.crNumber}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusBadge[vendor.statusColor]}`}>
                        {vendor.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8 space-y-6">

            {/* Vendor header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: selectedVendor.avatarBg }}
                >
                  {selectedVendor.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-700">{selectedVendor.name}</h2>
                  <p className="text-sm text-gray-500">{selectedVendor.location}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded ${statusBadge[selectedVendor.statusColor]}`}>
                {selectedVendor.status}
              </span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                {(["overview", "documents"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 pt-1 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "text-green-700 border-b-2 border-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "overview" ? "Overview" : "Documents"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Overview Tab ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">

                {/* Vendor Info + Price side by side */}
                <div className="grid grid-cols-2 gap-6">

                  {/* Vendor Info */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-900 text-white px-4 py-3">
                      <p className="text-sm font-semibold">Vendor Information</p>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">CR Number</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedVendor.crNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900">{selectedVendor.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedVendor.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estimated & Quoted Price */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-900 text-white px-4 py-3">
                      <p className="text-sm font-semibold">Estimated &amp; Quoted Price</p>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Gauge */}
                      <div className="flex justify-center">
                        <div className="relative w-48 h-28">
                          <svg className="w-full h-full" viewBox="0 0 240 120" style={{ overflow: "visible" }}>
                            <path d="M 20 110 A 100 100 0 0 1 220 110" fill="none" stroke="#E5E7EB" strokeWidth="20" strokeLinecap="round" />
                            <path d="M 20 110 A 100 100 0 0 1 200 110" fill="none" stroke="#F59E0B" strokeWidth="20" strokeLinecap="round" />
                            <circle cx="200" cy="110" r="10" fill="#F59E0B" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center pt-6">
                            <p className="text-lg font-bold text-gray-900">90,000,000</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <div className="w-3 h-3 bg-orange-400 rounded-full mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Quoted Price (SAR)</p>
                            <p className="text-sm font-semibold text-gray-900">90,000,000</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-3 h-3 bg-gray-300 rounded-full mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Expected Price (SAR)</p>
                            <p className="text-sm font-semibold text-gray-900">100,000,000</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-900 text-white px-4 py-3">
                    <p className="text-sm font-semibold">Basic Details</p>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: "Bank Name",               value: "Saudi National Bank (SNB)" },
                        { label: "Account Number",          value: "123456789012" },
                        { label: "IBAN Number",             value: "SA1230000001234567890012" },
                        { label: "Tax Number",              value: "3001234567" },
                        { label: "Reconciliation Account",  value: "400001234" },
                        { label: "Initial Guarantee (SAR)", value: "10,000" },
                        { label: "Phone Number",            value: "+966 501234567" },
                        { label: "Email",                   value: "info@vendor.com" },
                        { label: "Price Preference (SAR)",  value: "100,000,000" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <p className="text-sm font-semibold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Documents Tab ── */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-green-700">
                    Supporting Certificates ({documents.length})
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    Download All
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-900">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white">Type of Document</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white">Attachment</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white">Uploaded By</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-white">Uploaded Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{doc.type}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                                <i className="ri-file-pdf-line text-white text-sm" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                                <p className="text-xs text-gray-500">{doc.size}</p>
                              </div>
                              <button className="ml-auto p-1.5 hover:bg-gray-100 rounded">
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{doc.uploadedBy}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
