"use client"
 
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, LayoutGrid, Loader2, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react"
import SignatureVerificationDialog from "./signature-verification-dialog"
 
interface CommercialEvaluationPageProps {
  onBack: () => void
}
 
export default function CommercialEvaluationPage({
  onBack
}: CommercialEvaluationPageProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const [activeSection, setActiveSection] = useState("rfp-details")
  const [collapsed, setCollapsed] = useState(false)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null)
 
  const rfpDetailsRef = useRef<HTMLDivElement>(null)
  const acknowledgmentRef = useRef<HTMLDivElement>(null)
  const vendorsRef = useRef<HTMLDivElement>(null)
 
  const [vendors, setVendors] = useState([
    {
      id: 1, name: "O Vendor", location: "London", avatar: "O", color: "#FF6B6B",
      status: "Pending", decision: "Pending", score: "--", aiInsight: "Not evaluated",
      metrics: { technicalProposal: 36, pastExperience: 14, deliveryPerformance: 9, complianceDocuments: 10, financialStability: 8, customerReferences: 9, riskScore: 4 },
      companyProfile: "O Vendor has 15 years of experience delivering enterprise procurement and digital transformation solutions.",
      pastProjects: "Successfully completed 24 government and private sector projects with a 96% on-time delivery rate.",
      licenses: "ISO 9001, ISO 27001 Certified"
    },
    {
      id: 2, name: "Voo Supplier", location: "New York", avatar: "V", color: "#4A5568",
      status: "Pending", decision: "Pending", score: "--", aiInsight: "Not evaluated",
      metrics: { technicalProposal: 38, pastExperience: 15, deliveryPerformance: 8, complianceDocuments: 10, financialStability: 9, customerReferences: 8, riskScore: 5 },
      companyProfile: "Leading supplier with expertise in AI and cloud modernization projects.",
      pastProjects: "Completed over 35 enterprise implementations across banking and healthcare sectors.",
      licenses: "ISO 9001, ISO 20000"
    },
    {
      id: 3, name: "H Distributor", location: "Tokyo", avatar: "H", color: "#3B82F6",
      status: "Pending", decision: "Pending", score: "--", aiInsight: "Not evaluated",
      metrics: { technicalProposal: 31, pastExperience: 11, deliveryPerformance: 7, complianceDocuments: 9, financialStability: 10, customerReferences: 8, riskScore: 4 },
      companyProfile: "Regional distributor specializing in logistics and supply chain services.",
      pastProjects: "Completed 18 large-scale logistics implementations for manufacturing companies.",
      licenses: "ISO 9001"
    }
  ])
 
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      if (vendorsRef.current && scrollPosition >= vendorsRef.current.offsetTop) setActiveSection("vendors")
      else if (acknowledgmentRef.current && scrollPosition >= acknowledgmentRef.current.offsetTop) setActiveSection("acknowledgment")
      else setActiveSection("rfp-details")
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
 
  const scrollToSection = (sectionId: string) => {
    const refs = { "rfp-details": rfpDetailsRef, acknowledgment: acknowledgmentRef, vendors: vendorsRef }
    refs[sectionId as keyof typeof refs]?.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
 
  const handleSignatureAcknowledge = () => {
    setAcknowledged(true)
    setShowSignatureDialog(false)
  }
 
  const handleEvaluateVendors = async () => {
    setEvaluating(true)
    try {
      const response = await fetch("http://127.0.0.1:5000/evaluate-commercial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendors }),
      })
      if (!response.ok) throw new Error("Commercial evaluation failed")
      const data = await response.json()
      setVendors((prev) =>
        prev
          .map((vendor) => {
            const aiVendor = data.vendors.find((v: any) => v.id === vendor.id)
            if (!aiVendor) return vendor
            return { ...vendor, status: aiVendor.status, score: aiVendor.overallScore, aiInsight: aiVendor.aiInsight }
          })
          .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setEvaluating(false)
    }
  }
 
  const handleDecision = (vendorId: number, decision: "Approved" | "Rejected") => {
    setVendors((prev) =>
      prev.map((vendor) => vendor.id === vendorId ? { ...vendor, decision, status: decision } : vendor)
    )
  }
 
  return (
    <div className="w-full h-screen flex flex-col bg-white">
 
      {/* Popup Loader Modal */}
      {evaluating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl px-16 py-12 gap-4">
            <Loader2 size={48} className="animate-spin text-green-700" />
            <p className="text-lg font-semibold text-gray-900">Evaluating vendors...</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
 
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-green-700">Commercial Evaluation</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <i className="ri-save-line" /> Save As Draft
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <i className="ri-check-line" /> Save
          </button>
        </div>
      </div>
 
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`transition-all duration-300 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 ${collapsed ? "w-16" : "w-64"}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              {!collapsed && <h2 className="text-sm font-semibold text-gray-900">Sections</h2>}
              <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-200 rounded transition">
                <LayoutGrid className="text-gray-600 w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {[
                { id: "rfp-details", label: "RFP details" },
                { id: "acknowledgment", label: "Acknowledgment" },
                { id: "vendors", label: "Vendors" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-all duration-200 ${
                    activeSection === item.id ? "bg-green-100 text-green-700 border-l-4 border-green-600" : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>
 
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-green-700">Leadership Development Training Program</h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded">Evaluation Inprogress</span>
            </div>
 
            {/* RFP Details */}
            <div ref={rfpDetailsRef} className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div><p className="text-xs text-gray-500 mb-2">RFP ID</p><p className="text-sm font-semibold text-blue-600">RFP2131424</p></div>
                <div><p className="text-xs text-gray-500 mb-2">PR Reference</p><p className="text-sm font-semibold text-blue-600">PR524252</p></div>
                <div><p className="text-xs text-gray-500 mb-2">Bid closing date/time</p><p className="text-sm font-medium text-gray-900">29th Oct 2025, 5:00 PM</p></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><p className="text-xs text-gray-500 mb-2">Deadline</p><p className="text-sm text-gray-900">24-Oct-2025 6:00 PM</p></div>
                <div><p className="text-xs text-gray-500 mb-2">Evaluator</p><p className="text-sm text-gray-900">Eng. Ahmed Saleh (TEC Member)</p></div>
              </div>
            </div>
 
            {/* Acknowledgment */}
            <div ref={acknowledgmentRef} className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">Acknowledgment</h3>
              <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  By confirming below, I acknowledge that I am an authorized member of the Commercial Evaluation Committee for RFP-1003 and that I am present for the official opening of the Commercial Proposals.
                </p>
                <p className="text-sm text-gray-700">You will receive a confirmation code on your registered mobile number.</p>
                {!acknowledged ? (
                  <button onClick={() => setShowSignatureDialog(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    I acknowledge
                  </button>
                ) : (
                  <button disabled className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 cursor-not-allowed">
                    <i className="ri-check-line" /> You have acknowledged
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
                    onClick={handleEvaluateVendors}
                    disabled={evaluating}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    Evaluate with AI
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
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 bg-green-700 text-white p-4 font-medium text-sm">
                    <div className="col-span-3">Vendor</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-2">AI Insight</div>
                    <div className="col-span-3 text-right">Decision</div>
                  </div>
 
                  {vendors.map((vendor, index) => (
                    <div key={index} className="border-b border-gray-100 bg-white">
                      {/* Main row */}
                      <div className="grid grid-cols-12 gap-4 p-4 text-sm text-gray-700 items-center">
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: vendor.color }}>
                            {vendor.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                            <p className="text-xs text-gray-500">{vendor.location}</p>
                          </div>
                        </div>
 
                        <div className="col-span-2">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                            vendor.status === "Approved" ? "bg-green-100 text-green-700"
                            : vendor.status === "Rejected" ? "bg-red-100 text-red-700"
                            : vendor.status === "Completed" ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-600"
                          }`}>
                            {vendor.status}
                          </span>
                        </div>
 
                        <div className="col-span-2">
                          <p className="text-sm font-semibold text-gray-900">{vendor.score}</p>
                        </div>
 
                        <div className="col-span-2">
                          {vendor.aiInsight !== "Not evaluated" && (
                            <button
                              onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                              className="flex items-center gap-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-lg px-3 py-1.5 hover:bg-green-50 transition"
                            >
                              View Insight
                              {expandedInsight === index ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          )}
                        </div>
 
                        <div className="col-span-3 flex justify-end gap-2">
                          <button
                            onClick={() => handleDecision(vendor.id, "Approved")}
                            disabled={vendor.status !== "Completed"}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                              vendor.status === "Approved" ? "bg-green-600 text-white cursor-not-allowed"
                              : vendor.status !== "Completed" ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                              : "border border-green-600 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(vendor.id, "Rejected")}
                            disabled={vendor.status !== "Completed"}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                              vendor.status === "Rejected" ? "bg-red-600 text-white cursor-not-allowed"
                              : vendor.status !== "Completed" ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                              : "border border-red-500 text-red-500 hover:bg-red-50"
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
 
                      {/* Expandable AI Insight */}
                      {expandedInsight === index && (
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">AI Insight</p>
                          <p className="text-sm leading-6 text-gray-700">{vendor.aiInsight}</p>
                        </div>
                      )}
                    </div>
                  ))}
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
 