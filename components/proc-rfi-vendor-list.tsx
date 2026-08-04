"use client"

import { useState } from "react"
import { Search, ArrowLeft, MessageSquare } from "lucide-react"
import { RiFilePdfLine, RiDownloadLine } from "react-icons/ri"

interface ProcRFIVendorListProps {
  rfiId: string
  onBack: () => void
  type?: "rfi" | "quotation" // Added type prop to differentiate between RFI and Quotation
}

const mockVendors = [
  {
    id: "1",
    vendor_name: "Kaar Technologies",
    vendor_id: "1010234567",
    cr_number: "7890902344",
    overall_rating: 3,
    company_type: "service provider",
    primary_contact: "Ameed Ansari",
    email: "Ameedansari@kaartech.com",
    contact_number: "3984791741",
    status: "submitted",
  },
  {
    id: "2",
    vendor_name: "Tech Solutions Limited",
    vendor_id: "1010234567",
    cr_number: "7890902345",
    overall_rating: 4,
    company_type: "service provider",
    primary_contact: "John Smith",
    email: "john@techsolutions.com",
    contact_number: "3984791742",
    status: "open",
  },
  {
    id: "3",
    vendor_name: "Global IT Services",
    vendor_id: "1010234567",
    cr_number: "7890902346",
    overall_rating: 3,
    company_type: "service provider",
    primary_contact: "Sarah Johnson",
    email: "sarah@globalit.com",
    contact_number: "3984791743",
    status: "submitted",
  },
  {
    id: "4",
    vendor_name: "Cyber Link Technologies",
    vendor_id: "1010234567",
    cr_number: "7890902347",
    overall_rating: 4,
    company_type: "service provider",
    primary_contact: "Mike Chen",
    email: "mike@cyberlink.com",
    contact_number: "3984791744",
    status: "open",
  },
  {
    id: "5",
    vendor_name: "Next Gen IT Solutions",
    vendor_id: "1010234567",
    cr_number: "7890902348",
    overall_rating: 5,
    company_type: "service provider",
    primary_contact: "Emily Davis",
    email: "emily@nextgen.com",
    contact_number: "3984791745",
    status: "submitted",
  },
]

export default function ProcRFIVendorList({ rfiId, onBack, type = "rfi" }: ProcRFIVendorListProps) {
  const [selectedVendor, setSelectedVendor] = useState(mockVendors[0])
  const [activeTab, setActiveTab] = useState<"overview" | "documents">("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVendors = mockVendors.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-orange-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const title = type === "quotation" ? "Request for Quotation for" : "Request for information for"

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Vendor List */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <ArrowLeft size={20} style={{ color: "#1B733D" }} />
            </button>
            <h2 className="text-base font-medium text-gray-900">{title} PR_121314</h2>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Vendor List ({filteredVendors.length})</h3>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Vendor Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedVendor?.id === vendor.id ? "bg-green-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                  style={{ backgroundColor: "#C2185B" }}
                >
                  {vendor.vendor_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{vendor.vendor_name}</h4>
                    <i className="ri-external-link-line text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{vendor.vendor_id}</p>
                  <p className="text-xs text-gray-400">12 Oct 2025</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-8 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "documents"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Documents
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "overview" && selectedVendor && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ color: "#1B733D" }}>
                {selectedVendor.vendor_name}
              </h2>

              <div className="grid grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-2">CR number</p>
                  <p className="text-sm font-medium text-gray-900">{selectedVendor.cr_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Overall rating</p>
                  {renderStars(selectedVendor.overall_rating)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Type of company</p>
                  <p className="text-sm font-medium" style={{ color: "#1B733D" }}>
                    {selectedVendor.company_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Primary contact person</p>
                  <p className="text-sm font-medium text-gray-900">{selectedVendor.primary_contact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedVendor.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Contact number</p>
                  <p className="text-sm font-medium text-gray-900">{selectedVendor.contact_number}</p>
                </div>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">Business capabilities</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                  over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                  Success will be measured through participant feedback, leadership assessments, and observable
                  improvements in team performance, ultimately driving stronger leadership effectiveness and
                  organizational growth.
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">Product/ Service details</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                  over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                  Success will be measured through participant feedback, leadership assessments, and observable
                  improvements in team performance, ultimately driving stronger leadership effectiveness and
                  organizational growth.
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">Commercial information</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                  over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                  Success will be measured through participant feedback, leadership assessments, and observable
                  improvements in team performance, ultimately driving stronger leadership effectiveness and
                  organizational growth.
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">Mobility/ Supply chain information</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                  over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                  Success will be measured through participant feedback, leadership assessments, and observable
                  improvements in team performance, ultimately driving stronger leadership effectiveness and
                  organizational growth.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">References & experience</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                  over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                  Success will be measured through participant feedback, leadership assessments, and observable
                  improvements in team performance, ultimately driving stronger leadership effectiveness and
                  organizational growth.
                </p>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Document name ↑</span>
                  <span className="text-sm font-medium text-gray-700">Attachments</span>
                </div>
              </div>

              {[
                { name: "Scope of work", size: "6.5kb" },
                { name: "Technical feasibility", size: "15.2kb" },
                { name: "Service feasibility", size: "9.8kb" },
                { name: "Business overview", size: "2.3mb" },
                { name: "Benchmarking products", size: "50.1kb" },
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-900">{doc.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                        <RiFilePdfLine className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <RiDownloadLine className="text-gray-600 text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
