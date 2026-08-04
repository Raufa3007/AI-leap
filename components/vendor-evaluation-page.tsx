"use client"

import { useState } from "react"
import { ChevronLeft, Search, Download, ChevronDown, ChevronUp } from "lucide-react"

interface VendorEvaluationPageProps {
  onBack: () => void
  evaluationType?: "technical" | "commercial"
}

const vendors = [
  { id: 1, name: "Kaar Technologies", crNumber: "1010234567", status: "Preferred", statusColor: "green" },
  { id: 2, name: "Tech Solutions Limited", crNumber: "1010234568", status: "Highest", statusColor: "red" },
  { id: 3, name: "Global IT Services", crNumber: "1010234569", status: "New", statusColor: "blue" },
  // { id: 4, name: "Cyber Link Technologies", crNumber: "1010234570", status: "Exceeded Budget", statusColor: "red" },
  // { id: 5, name: "Next Gen IT Solutions", crNumber: "1010234611", status: "Within Budget", statusColor: "green" },
  // { id: 6, name: "Innovatech Private Limited", crNumber: "1010234612", status: "Disqualified", statusColor: "red" },
  // {
  //   id: 7,
  //   name: "Aviaion Technologies Private Limited",
  //   crNumber: "1010234613",
  //   status: "Within Budget",
  //   statusColor: "green",
  // },
]

const technicalCriteria = [
  {
    requirement: "Experience in similar projects or industries",
    justification:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    applicable: true,
  },
  {
    requirement: "Availability of advanced tools, machinery, or technology",
    justification:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    applicable: true,
  },
  {
    requirement: "In-house design and engineering expertise",
    justification:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    applicable: false,
  },
]

const commercialCriteria = [
  {
    requirement: "Price competitiveness and value for money",
    justification:
      "The vendor's quoted price of SAR 90,000,000 is competitive compared to market rates and provides excellent value considering the scope of deliverables and quality standards.",
    applicable: true,
  },
  {
    requirement: "Payment terms and conditions",
    justification:
      "Flexible payment terms with milestone-based payments. 30% advance, 40% on delivery, and 30% after acceptance. Payment terms align with our procurement policies and cash flow requirements.",
    applicable: true,
  },
  {
    requirement: "Financial stability and creditworthiness",
    justification:
      "Vendor demonstrates strong financial stability with audited financial statements showing consistent profitability over the past 3 years. Credit rating is excellent with no outstanding liabilities.",
    applicable: true,
  },
  // {
  //   requirement: "Cost breakdown transparency",
  //   justification:
  //     "Detailed cost breakdown provided including materials, labor, overhead, and profit margins. All costs are clearly itemized and justified with supporting documentation.",
  //   applicable: true,
  // },
  // {
  //   requirement: "Currency and exchange rate considerations",
  //   justification:
  //     "All pricing is in SAR with no currency fluctuation risks. Vendor has agreed to fixed pricing for the contract duration with no escalation clauses.",
  //   applicable: true,
  // },
]

const vendorProposals: { [key: number]: { fileName: string; file: string } } = {
  1: { fileName: "KaarTech Proposal.txt", file: "/Tp-documents/KaarTech Proposal.txt" },
  2: { fileName: "Accenture Proposal.txt", file: "/Tp-documents/Accenture Proposal.txt" },
  3: { fileName: "Deloitte Proposal.txt", file: "/Tp-documents/Deloitte Proposal.txt" },
}

const documents = [
  { type: "Financial Offer", fileName: "Financial Offer", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Technical Offer", fileName: "Technical Offer", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: "__vendor_proposal__" },
  { type: "Proof of the establishments affiliation with the local small and medium enterprises category, if applicable", fileName: "Affiliation", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Bank Guarantee", fileName: "Bank Guarantee", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Commercial registration or Statutory licences", fileName: "Commercial Registration", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Certificate of payment of zakat or tax or both", fileName: "Tax", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Certificate of general organization for insurance", fileName: "Insurance", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Certificate of affiliation with chamber of commerce", fileName: "Chamber Affiliation", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Certificate of achieving the required percentage for Saudization for jobs", fileName: "Saudization", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
  { type: "Others", fileName: "Licences", size: "6.5kb", uploadedBy: "Mohammed Zubair", date: "02-Aug-2022", file: null },
]

export default function VendorEvaluationPage({ onBack, evaluationType = "technical" }: VendorEvaluationPageProps) {
  const [selectedVendor, setSelectedVendor] = useState(vendors[0])
  const [activeTab, setActiveTab] = useState("overview")
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null)
  const [criteriaExpanded, setCriteriaExpanded] = useState(true)
  const [evaluationExpanded, setEvaluationExpanded] = useState(true)
  const [scores, setScores] = useState<{ [key: string]: number }>({})
  const [comments, setComments] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [criteriaApplicable, setCriteriaApplicable] = useState<{ [key: string]: boolean }>({
    0: false,
    1: false,
    2: false,
  })
  const [criteriaJustifications, setCriteriaJustifications] = useState<{ [key: string]: string }>({})
  const [markAllApplicable, setMarkAllApplicable] = useState(false)

  const currentCriteria = evaluationType === "commercial" ? commercialCriteria : technicalCriteria

  const handleMarkAllApplicable = (checked: boolean) => {
    setMarkAllApplicable(checked)
    const newApplicable: { [key: string]: boolean } = {}
    technicalCriteria.forEach((_, index) => {
      newApplicable[index] = checked
    })
    setCriteriaApplicable(newApplicable)
  }

  const handleScoreChange = (criteriaIndex: number, score: number) => {
    setScores({ ...scores, [criteriaIndex]: score })
  }

  const calculateTotalScore = () => {
    const applicableCriteria =
      evaluationType === "technical"
        ? technicalCriteria.filter((_, index) => criteriaApplicable[index])
        : currentCriteria.filter((c) => c.applicable)

    const totalPossible = applicableCriteria.length * 10
    const totalScored = Object.values(scores).reduce((sum, score) => sum + score, 0)
    return { totalScored, totalPossible }
  }

  const filteredVendors = vendors.filter((vendor) => vendor.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleReject = () => {
    console.log("Vendor rejected:", selectedVendor.name)
  }

  const evaluationTabLabel = evaluationType === "commercial" ? "Commercial Evaluation" : "Technical Evaluation"

  const getStatusBadgeClass = (statusColor: string) => {
    switch (statusColor) {
      case "green":
        return "bg-teal-100 text-teal-700"
      case "blue":
        return "bg-blue-100 text-blue-700"
      case "red":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center gap-3 bg-white">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded" aria-label="Go back">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-green-700">Vendor Evaluations</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Vendor List */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Vendor List</h2>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Vendor Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Vendor List */}
            <div className="space-y-2">
              {filteredVendors.map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedVendor.id === vendor.id
                      ? "bg-green-50 border-green-600"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                    <i className="ri-arrow-right-s-line text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{vendor.crNumber}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        vendor.statusColor === "green"
                          ? "bg-green-100 text-green-700"
                          : vendor.statusColor === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex gap-6 border-b border-gray-200 px-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 pt-4 text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                {/* Technical Evaluation tab — commented out; commercial evaluation tab preserved via evaluationType prop
                <button
                  onClick={() => setActiveTab("technical")}
                  className={`pb-3 pt-4 text-sm font-medium transition-colors ${
                    activeTab === "technical"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {evaluationTabLabel}
                </button>
                */}
                {evaluationType === "commercial" && (
                  <button
                    onClick={() => setActiveTab("technical")}
                    className={`pb-3 pt-4 text-sm font-medium transition-colors ${
                      activeTab === "technical"
                        ? "text-green-700 border-b-2 border-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {evaluationTabLabel}
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`pb-3 pt-4 text-sm font-medium transition-colors ${
                    activeTab === "documents"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Documents
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Vendor Info and Price Cards */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Vendor Info Card */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex flex-col items-center text-center mb-6">
                          <div className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                            KT
                          </div>
                          <h2 className="text-xl font-semibold text-green-700 mb-2">
                            Kaar Technologies Private Limited
                          </h2>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded ${getStatusBadgeClass(selectedVendor.statusColor)}`}
                          >
                            {selectedVendor.status}
                          </span>
                        </div>

                        <div className="space-y-4 text-left">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">CR number</p>
                            <p className="text-sm font-semibold text-gray-900">7890902344</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Address</p>
                            <p className="text-sm font-medium text-gray-900">
                              223 Al Kharj Rd, New Industrial Area, Industrial Area #3, Riyadh 11472, Saudi Arabia
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price Card */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-6">
                          <h3 className="text-base font-semibold text-green-700">Estimated & Quoted Price</h3>
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-green-700">4</span>
                          </div>
                        </div>

                        <div className="flex justify-center mb-6">
                          <div className="relative w-64 h-36">
                            <svg className="w-full h-full" viewBox="0 0 240 120" style={{ overflow: "visible" }}>
                              {/* Background arc - full semicircle */}
                              <path
                                d="M 20 110 A 100 100 0 0 1 220 110"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="20"
                                strokeLinecap="round"
                              />
                              {/* Progress arc - 90% of semicircle */}
                              <path
                                d="M 20 110 A 100 100 0 0 1 200 110"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth="20"
                                strokeLinecap="round"
                              />
                              {/* Dot at the end of progress */}
                              <circle cx="200" cy="110" r="10" fill="#F59E0B" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center pt-4">
                              <p className="text-3xl font-bold text-gray-900">90,000,00</p>
                            </div>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <div className="w-4 h-4 bg-orange-400 rounded-full mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Quoted Price (SAR)</p>
                              <p className="text-sm font-semibold text-gray-900">90,000,000</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded-full mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Expected price (SAR)</p>
                              <p className="text-sm font-semibold text-gray-900">100,000,000</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-base font-semibold text-green-700 mb-4">Basic Details</h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                          <p className="text-sm font-semibold text-gray-900">Saudi National Bank (SNB)</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Account Number</p>
                          <p className="text-sm font-semibold text-gray-900">123456789012</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">IBAN Number</p>
                          <p className="text-sm font-semibold text-gray-900">SA1230000001234567890012</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tax Number</p>
                          <p className="text-sm font-semibold text-gray-900">3001234567</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Reconciliation Account</p>
                          <p className="text-sm font-semibold text-gray-900">400001234</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Initial Guarantee (SAR)</p>
                          <p className="text-sm font-semibold text-gray-900">10,000</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                          <p className="text-sm font-semibold text-gray-900">+966 501234567</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-semibold text-gray-900">kaartech@kaatech.com</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price Preference (SAR)</p>
                          <p className="text-sm font-semibold text-gray-900">100,000,000</p>
                        </div>
                      </div>
                    </div>

                    {/* Evaluation Score */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-base font-semibold text-green-700 mb-4">Evaluation Score</h3>
                      <div className="grid grid-cols-3 gap-6">
                        {evaluationType === "technical" ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Technical Score (%)</p>
                                <p className="text-sm font-semibold text-gray-900">0/60</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{ width: "0%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Financial Score (%)</p>
                                <p className="text-sm font-semibold text-gray-900">0/40</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{ width: "0%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Total Score (%)</p>
                                <p className="text-sm font-semibold text-gray-900">0/100</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{ width: "0%" }} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Technical Score (%)</p>
                                <p className="text-sm font-semibold text-gray-900">50/60</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{ width: "83%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Financial Score (%)</p>
                                <p className="text-sm font-semibold text-gray-900">35/40</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{ width: "87.5%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-700">Total Score (%)</p>
                                <p className="text-sm font-semibold text-gray-900">85/100</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-400 h-2 rounded-full" style={{ width: "85%" }} />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* SME */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-base font-semibold text-green-700 mb-4">SME</h3>
                      <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <img src="/images/sparkle-icon.png" alt="SME" className="w-8 h-8 object-contain" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              This vendor falls under Non Small & Medium Enterprises
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              The quoted price increased by 10% to support small and medium enterprises.
                            </p>
                          </div>
                        </div>
                        <span className="px-4 py-2 bg-white border-2 border-green-600 text-green-700 text-sm font-semibold rounded-full flex-shrink-0">
                          Non SME
                        </span>
                      </div>
                    </div>

                    {/* Technical Result */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-base font-semibold text-green-700 mb-4">Technical Result</h3>
                      <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <img src="/images/sparkle-icon.png" alt="Passed" className="w-8 h-8 object-contain" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Vendor Passed Technically</p>
                        </div>
                        <span className="px-4 py-2 bg-white border-2 border-green-600 text-green-700 text-sm font-semibold rounded-full flex-shrink-0">
                          Passed
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical/Commercial Evaluation Tab */}
                {activeTab === "technical" && (
                  <div className="space-y-6">
                    {/* Info Banner */}
                    <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <i className="ri-information-line text-teal-600 text-xl flex-shrink-0" />
                      <p className="text-sm text-teal-900">
                        {evaluationType === "commercial"
                          ? "Commercial evaluation of the vendor will be conducted only if all requirements are applicable."
                          : "Technical evaluation of the vendor will be conducted only if all requirements are applicable."}
                      </p>
                    </div>

                    {evaluationType === "technical" ? (
                      <>
                        {/* Technical Evaluation Criteria Section */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setCriteriaExpanded(!criteriaExpanded)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-base font-semibold text-green-700">Technical evaluation criteria</h3>
                            {criteriaExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>

                          {criteriaExpanded && (
                            <div className="border-t border-gray-200">
                              <div className="p-6 space-y-6">
                                {/* Header with Mark All toggle */}
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                  <span className="text-sm font-medium text-gray-700">Requirement</span>
                                  <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={markAllApplicable}
                                        onChange={(e) => handleMarkAllApplicable(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                      />
                                      <span className="text-sm text-gray-600">Mark All As Applicable</span>
                                    </label>
                                    <span className="text-sm font-medium text-gray-700">Applicable / Not</span>
                                  </div>
                                </div>

                                {/* Criteria Items */}
                                {technicalCriteria.map((criteria, index) => (
                                  <div key={index} className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <p className="text-sm font-medium text-gray-900 flex-1">{criteria.requirement}</p>
                                      <label className="flex items-center gap-2 cursor-pointer ml-4">
                                        <span className="text-sm text-gray-600">
                                          {criteriaApplicable[index] ? "Yes" : "No"}
                                        </span>
                                        <div className="relative">
                                          <input
                                            type="checkbox"
                                            checked={criteriaApplicable[index] || false}
                                            onChange={(e) => {
                                              setCriteriaApplicable({
                                                ...criteriaApplicable,
                                                [index]: e.target.checked,
                                              })
                                            }}
                                            className="sr-only peer"
                                          />
                                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </div>
                                      </label>
                                    </div>

                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Justification
                                      </label>
                                      <textarea
                                        value={criteriaJustifications[index] || ""}
                                        onChange={(e) =>
                                          setCriteriaJustifications({
                                            ...criteriaJustifications,
                                            [index]: e.target.value,
                                          })
                                        }
                                        placeholder="Type here..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Technical Evaluation Scoring Section */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setEvaluationExpanded(!evaluationExpanded)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-base font-semibold text-green-700">Technical evaluation</h3>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-gray-700">
                                Score: {calculateTotalScore().totalScored}/{calculateTotalScore().totalPossible}
                              </span>
                              {evaluationExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                          </button>

                          {evaluationExpanded && (
                            <div className="border-t border-gray-200 p-6">
                              <div className="space-y-6">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                  <span className="text-sm font-medium text-gray-700">Criteria</span>
                                  <span className="text-sm font-medium text-gray-700">
                                    Score: {calculateTotalScore().totalScored}/{calculateTotalScore().totalPossible}
                                  </span>
                                </div>

                                {technicalCriteria.map((criteria, index) => (
                                  <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900">{criteria.requirement}</p>
                                    <div className="flex items-center gap-2">
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                        <button
                                          key={score}
                                          onClick={() => handleScoreChange(index, score)}
                                          className={`w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center ${
                                            scores[index] === score
                                              ? "border-green-600 bg-green-600 text-white"
                                              : "border-gray-300 bg-white text-gray-600 hover:border-green-400"
                                          }`}
                                          aria-label={`Score ${score}`}
                                        >
                                          <span className="text-xs font-medium">{score === 10 ? "" : ""}</span>
                                        </button>
                                      ))}
                                      <span className="ml-2 text-sm font-semibold text-gray-900">
                                        {scores[index] || 0}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                                <textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Type here"
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Commercial Evaluation - Original Design */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setCriteriaExpanded(!criteriaExpanded)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold text-green-700">Commercial evaluation criteria</h3>
                              {!currentCriteria.every((c) => c.applicable) && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                                  Not Applicable
                                </span>
                              )}
                            </div>
                            {criteriaExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>

                          {criteriaExpanded && (
                            <div className="border-t border-gray-200">
                              <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                                      Requirement
                                    </th>
                                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-700">
                                      Applicable / Not
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentCriteria.map((criteria, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                      <td className="py-4 px-6">
                                        <p className="text-sm font-medium text-gray-900 mb-2">{criteria.requirement}</p>
                                        <div className="mt-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Justification</p>
                                          <p className="text-xs text-gray-600 leading-relaxed">
                                            {criteria.justification}
                                          </p>
                                        </div>
                                      </td>
                                      <td className="py-4 px-6 text-right">
                                        <span
                                          className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                                            criteria.applicable
                                              ? "bg-green-100 text-green-700"
                                              : "bg-red-100 text-red-600"
                                          }`}
                                        >
                                          {criteria.applicable ? "Applicable" : "Not Applicable"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setEvaluationExpanded(!evaluationExpanded)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold text-green-700">Commercial evaluation</h3>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-gray-700">
                                Score: {calculateTotalScore().totalScored}/{calculateTotalScore().totalPossible}
                              </span>
                              {evaluationExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                          </button>

                          {evaluationExpanded && (
                            <div className="border-t border-gray-200 p-6">
                              <div className="space-y-6">
                                <p className="text-sm font-medium text-gray-700">Criteria</p>
                                {currentCriteria
                                  .filter((c) => c.applicable)
                                  .map((criteria, index) => (
                                    <div key={index} className="space-y-3">
                                      <p className="text-sm font-medium text-gray-900">{criteria.requirement}</p>
                                      <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                          <button
                                            key={score}
                                            onClick={() => handleScoreChange(index, score)}
                                            className={`w-8 h-8 rounded-full border-2 transition-colors text-xs font-medium ${
                                              scores[index] === score
                                                ? "border-green-600 bg-green-600 text-white"
                                                : "border-gray-300 bg-white text-gray-600 hover:border-green-400"
                                            }`}
                                            aria-label={`Score ${score}`}
                                          />
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-gray-900">
                                          {scores[index] || 0}/10
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>

                              <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                                <textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Type here"
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-green-700">Supporting Certificates (10)</h3>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Download All
                      </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-green-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-white">Type of Document</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-white">Attachment</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-white">Uploaded By</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-white">Uploaded Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map((doc, index) => {
                            const proposal = vendorProposals[selectedVendor.id]
                            const resolvedFile = doc.file === "__vendor_proposal__" ? proposal?.file ?? null : doc.file
                            const resolvedFileName = doc.file === "__vendor_proposal__" ? proposal?.fileName ?? doc.fileName : doc.fileName
                            return (
                              <tr key={index} className="border-b border-gray-200">
                                <td className="py-4 px-4 text-sm text-gray-900">{doc.type}</td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => resolvedFile && setPreviewFile({ url: resolvedFile, name: resolvedFileName })}
                                      className={`w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0 ${
                                        resolvedFile ? "hover:bg-red-700 cursor-pointer" : "opacity-60 cursor-default"
                                      }`}
                                    >
                                      <i className="ri-file-pdf-line text-white text-lg" />
                                    </button>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{resolvedFileName}</p>
                                      <p className="text-xs text-gray-500">{doc.size}</p>
                                    </div>
                                    {resolvedFile ? (
                                      <a
                                        href={resolvedFile}
                                        download={resolvedFileName}
                                        className="ml-auto p-2 hover:bg-gray-100 rounded transition-colors"
                                      >
                                        <Download className="w-4 h-4 text-gray-600" />
                                      </a>
                                    ) : (
                                      <button className="ml-auto p-2 hover:bg-gray-100 rounded transition-colors">
                                        <Download className="w-4 h-4 text-gray-600" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">{doc.uploadedBy}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{doc.date}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl flex flex-col" style={{ width: "60vw", height: "85vh" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <i className="ri-file-pdf-line text-red-600 text-xl" />
                <span className="text-sm font-medium text-gray-900">{previewFile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.url}
                  download={previewFile.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-600" />
                </button>
              </div>
            </div>
            <iframe
              src={previewFile.url}
              className="flex-1 w-full rounded-b-lg"
              title={previewFile.name}
            />
          </div>
        </div>
      )}
    </div>
  )
}
