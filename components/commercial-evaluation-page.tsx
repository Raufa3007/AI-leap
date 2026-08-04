"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, LayoutGrid } from "lucide-react"
import SignatureVerificationDialog from "./signature-verification-dialog"
import TechnicalEvaluationTable from "./technical-evaluation-table"
import FinancialEvaluationTable from "./financial-evaluation-table"

interface CommercialEvaluationPageProps {
  onBack: () => void
  onNavigateToVendorEvaluation: () => void
}

export default function CommercialEvaluationPage({
  onBack,
  onNavigateToVendorEvaluation,
}: CommercialEvaluationPageProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const [activeSection, setActiveSection] = useState("rfp-details")
  const [collapsed, setCollapsed] = useState(false)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)

  const rfpDetailsRef = useRef<HTMLDivElement>(null)
  const acknowledgmentRef = useRef<HTMLDivElement>(null)
  const vendorsRef = useRef<HTMLDivElement>(null)

  // Scroll-based highlight
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

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          {/* </CHANGE> */}
          <h1 className="text-2xl font-semibold text-green-700">Commercial Evaluation</h1>
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
        {/* Sidebar */}
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

            {/* Sidebar Navigation */}
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

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-green-700">Leadership Development Training Program</h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded">
                Evaluation Inprogress
              </span>
            </div>

            {/* RFP Details */}
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

            {/* Acknowledgment */}
            <div ref={acknowledgmentRef} className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">Acknowledgment</h3>
              <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  By confirming below, I acknowledge that I am an authorized member of the Commercial Evaluation
                  Committee for RFP-1003 and that I am present for the official opening of the Commercial Proposals.
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

            {/* Vendors */}
            <div ref={vendorsRef} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-green-700">Vendor list</h3>
                {acknowledged && (
                  <button
                    onClick={onNavigateToVendorEvaluation}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Evaluate vendors
                  </button>
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
                      <div className="col-span-3">Vendors (3)</div>
                      <div className="col-span-3">Evaluation status</div>
                      <div className="col-span-3">Total score (Out of 100)</div>
                      <div className="col-span-3">AI Insight</div>
                    </div>
                    {[
                      {
                        name: "O Vendor",
                        location: "London",
                        avatar: "O",
                        color: "#FF6B6B",
                        aiInsight: "✨ Price competitiveness",
                      },
                      {
                        name: "Voo Supplier",
                        location: "New York",
                        avatar: "V",
                        color: "#4A5568",
                        aiInsight: "✨ Payment terms favorable",
                      },
                      {
                        name: "H Distributor",
                        location: "Tokyo",
                        avatar: "H",
                        color: "#3B82F6",
                        aiInsight: "✨ Financial stability strong",
                      },
                    ].map((vendor, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-4 border-t border-gray-200 items-center">
                        <div className="col-span-3 flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: vendor.color }}
                          >
                            {vendor.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                            <p className="text-xs text-gray-500">{vendor.location}</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                            Pending
                          </span>
                        </div>
                        <div className="col-span-3">
                          <p className="text-sm text-gray-900">--</p>
                        </div>
                        <div className="col-span-3">
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-xs text-blue-900 font-medium">{vendor.aiInsight}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                 
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SignatureVerificationDialog
        isOpen={showSignatureDialog}
        onClose={() => setShowSignatureDialog(false)}
        onAcknowledge={handleSignatureAcknowledge}
      />
    </div>
  )
}
