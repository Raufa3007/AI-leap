"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Info, Download, FileText, Upload, Edit2, Trash2, Plus, MessageSquare, X, Send } from "lucide-react"
import { saveRFPDraft, sendRFP, loadRFPDraft } from "@/app/actions/save-rfp-draft"
import { useToast } from "@/hooks/use-toast"

interface ProcRFPCreateFormProps {
  rfpId: string
  onBack: () => void
  onSuccess: () => void
}

export default function ProcInboxPREditRFP({ rfpId, onBack, onSuccess }: ProcRFPCreateFormProps) {
  const [activeSection, setActiveSection] = useState("RFP Details")
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})
  const { toast } = useToast()

  const [isSent, setIsSent] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    rfpTitle: "Leadership training program",
    rfpId: "34534",
    linkedPR: "32425",
    department: "Kaasparc Admin",
    category: "",
    modeOfTenor: "",
    bidClosingDate: "",
    expectedAwardDate: "",
    purpose:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    scopeOfWork:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    termsAndConditions:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    expectedSubmissions:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
  })

  const sections = [
    { id: "RFP Details", label: "RFP Details", icon: "ri-file-text-line" },
    { id: "Scope Of Work", label: "Scope Of Work", icon: "ri-layout-grid-line" },
    { id: "Procurement Details", label: "Procurement Details", icon: "ri-shopping-bag-line" },
    { id: "Procurement Checklist", label: "Procurement Checklist", icon: "ri-checkbox-multiple-line" },
    { id: "Bill of Quantity", label: "Bill of Quantity", icon: "ri-table-2" },
    { id: "Technical Committee Members", label: "Technical Committee Members", icon: "ri-team-line" },
    { id: "Technical Requirements", label: "Technical Requirements", icon: "ri-list-check-2" },
    { id: "Technical Evaluation Criteria", label: "Technical Evaluation Criteria", icon: "ri-star-line" },
    { id: "Vendor Evaluation Weightage", label: "Vendor Evaluation Weightage", icon: "ri-scales-3-line" },
    { id: "Man Power", label: "Man Power", icon: "ri-user-line" },
    { id: "Attachments", label: "Attachments", icon: "ri-attachment-line" },
  ]

  const billOfQuantityItems = [
    {
      materialGroup: "Electronics",
      itemName: "Laptop",
      quantity: 10,
      uom: "Count",
      price: "1,000,000",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Mouse",
      quantity: 10,
      uom: "Count",
      price: "1,000",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Hard disk",
      quantity: 2,
      uom: "Count",
      price: "10,000",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Extension box",
      quantity: 1,
      uom: "Count",
      price: "500",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Laptop",
      quantity: 10,
      uom: "Count",
      price: "1,020,000",
      deliveryDate: "12/12/26",
    },
  ]

  const [vendors, setVendors] = useState([
    { id: 1, name: "Kaar Technologies Private Limited" },
    { id: 2, name: "Aviation tech Private Limited" },
    { id: 3, name: "Global tech" },
  ])

  const vendorsWithStatus = [
    { id: 1, name: "Kaar Technologies Private Limited", status: "Submitted", statusColor: "green", commentCount: 10 },
    { id: 2, name: "Wipro Limited", status: "Open", statusColor: "blue", commentCount: 1 },
    { id: 3, name: "TCS Private Limited", status: "Submitted", statusColor: "green", commentCount: 0 },
  ]

  const documentChecklist = [
    { type: "Financial Offer", fileName: "Financial Offer", size: "6.5kb" },
    { type: "Technical Offer", fileName: "Technical Offer", size: "6.5kb" },
    {
      type: "Proof of the establishments affiliation with the local small and medium enterprises category, if applicable",
      fileName: "Affiliation",
      size: "6.5kb",
    },
    { type: "Bank Guarantee", fileName: "Bank Guarantee", size: "6.5kb" },
    { type: "Commercial registration or Statutory licences", fileName: "Commercial Registration", size: "6.5kb" },
    { type: "Certificate of payment of zakat or tax or both", fileName: "Tax", size: "6.5kb" },
    { type: "Certificate of general organization for insurance", fileName: "Insurance", size: "6.5kb" },
    { type: "Certificate of affiliation with chamber of commerce", fileName: "Chamber Affiliation", size: "6.5kb" },
    {
      type: "Certificate of achieving the required percentage for Saudization for jobs",
      fileName: "Saudization",
      size: "6.5kb",
    },
    { type: "Others", fileName: "Licences", size: "6.5kb" },
  ]

  const comments = [
    {
      id: 1,
      author: "Mohamad Algasair",
      timestamp: "Yesterday, 2:10 pm",
      message: "Great Work, from RFP requestor. I recommend technical team to evaluate it better",
      isOwn: false,
      avatar: "/placeholder.svg?height=34&width=34",
    },
    {
      id: 2,
      author: "Khalood Alquidly",
      timestamp: "Today, 11:10 am",
      message: "Thanks for your Comments, I have reviewed it.",
      isOwn: true,
      avatar: "/placeholder.svg?height=34&width=34",
    },
  ]

  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: 1, name: "Submission guidelines", size: "4 Kb" },
    { id: 2, name: "Submission guidelines", size: "6 Kb" },
  ])

  useEffect(() => {
    const loadDraft = async () => {
      console.log("[v0] Loading RFP draft for rfpId:", rfpId)
      const result = await loadRFPDraft(rfpId)

      if (result.success && result.data) {
        console.log("[v0] Draft loaded successfully:", result.data)

        // Check if RFP is sent (completed)
        if (result.data.status === "completed") {
          setIsSent(true)
        }

        // Populate form with loaded data
        setFormData({
          rfpTitle: result.data.title || "",
          rfpId: result.data.rfp_id || "",
          linkedPR: result.data.linked_pr || "",
          department: result.data.department || "",
          category: result.data.category || "",
          modeOfTenor: result.data.mode_of_tenor || "",
          bidClosingDate: result.data.bid_closing_date || "",
          expectedAwardDate: result.data.expected_award_date || "",
          purpose: result.data.purpose || "",
          scopeOfWork: result.data.scope_of_work || "",
          termsAndConditions: result.data.terms_and_conditions || "",
          expectedSubmissions: result.data.expected_submissions || "",
        })

        if (result.data.vendors) {
          setVendors(result.data.vendors)
        }

        if (result.data.attachments) {
          setUploadedDocuments(result.data.attachments)
        }
      } else {
        console.log("[v0] No existing draft found, using default values")
      }
    }

    loadDraft()
  }, [rfpId])

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const scrollPosition = contentRef.current.scrollTop + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[sections[i].id]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    const content = contentRef.current
    if (content) {
      content.addEventListener("scroll", handleScroll)
      return () => content.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section && contentRef.current) {
      const offsetTop = section.offsetTop - 20
      contentRef.current.scrollTo({ top: offsetTop, behavior: "smooth" })
    }
  }

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSaveAsDraft = async () => {
    setIsSaving(true)
    console.log("[v0] Saving RFP as draft")

    const rfpData = {
      pr_number: rfpId,
      title: formData.rfpTitle,
      rfp_id: formData.rfpId,
      linked_pr: formData.linkedPR,
      department: formData.department,
      category: formData.category,
      mode_of_tenor: formData.modeOfTenor,
      bid_closing_date: formData.bidClosingDate,
      expected_award_date: formData.expectedAwardDate,
      purpose: formData.purpose,
      scopeOfWork: formData.scopeOfWork,
      termsAndConditions: formData.termsAndConditions,
      expectedSubmissions: formData.expectedSubmissions,
      bill_of_quantity: billOfQuantityItems.map((item) => ({
        material_group: item.materialGroup,
        item_name: item.itemName,
        quantity: item.quantity,
        units_of_measure: item.uom,
        estimated_unit_price: item.price,
        expected_delivery_date: item.deliveryDate,
      })),
      vendors: vendors,
      attachments: uploadedDocuments,
    }

    const result = await saveRFPDraft(rfpData)
    setIsSaving(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    console.log("[v0] Submitting RFP form")
    setIsSaving(true)

    // First save the current data
    const rfpData = {
      pr_number: rfpId,
      title: formData.rfpTitle,
      rfp_id: formData.rfpId,
      linked_pr: formData.linkedPR,
      department: formData.department,
      category: formData.category,
      mode_of_tenor: formData.modeOfTenor,
      bid_closing_date: formData.bidClosingDate,
      expected_award_date: formData.expectedAwardDate,
      purpose: formData.purpose,
      scopeOfWork: formData.scopeOfWork,
      termsAndConditions: formData.termsAndConditions,
      expectedSubmissions: formData.expectedSubmissions,
      bill_of_quantity: billOfQuantityItems.map((item) => ({
        material_group: item.materialGroup,
        item_name: item.itemName,
        quantity: item.quantity,
        units_of_measure: item.uom,
        estimated_unit_price: item.price,
        expected_delivery_date: item.deliveryDate,
      })),
      vendors: vendors,
      attachments: uploadedDocuments,
    }

    const saveResult = await saveRFPDraft(rfpData)

    if (saveResult.success) {
      // Then send the RFP
      const sendResult = await sendRFP(rfpId)

      if (sendResult.success) {
        setIsSent(true)
        toast({
          title: "Success",
          description: "RFP sent successfully",
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: sendResult.error,
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Error",
        description: saveResult.error,
        variant: "destructive",
      })
    }

    setIsSaving(false)
  }

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[v0] Sending comment:", commentText)
      setCommentText("")
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* Full width header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Create RFP</h1>
          {isSent && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Read Only - Sent
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isSent && (
            <>
              <button
                onClick={handleSaveAsDraft}
                disabled={isSaving}
                className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-save-2-line text-base"></i>
                {isSaving ? "Saving..." : "Save As Draft"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-check-double-fill text-base"></i>
                {isSaving ? "Submitting..." : "Publish RFP"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white rounded-lg flex-shrink-0 h-full overflow-hidden flex flex-col ml-4 mt-4 transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-[281px]"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {!isSidebarCollapsed && <h3 className="text-sm font-normal text-[#45546E]">Sections</h3>}
            <button onClick={toggleSidebar} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <i className={`ri-menu-${isSidebarCollapsed ? "unfold" : "fold"}-line text-lg text-gray-600`}></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full px-6 py-3 text-left text-sm flex items-center gap-3 transition-colors relative hover:bg-gray-50 ${
                  activeSection === section.id ? "text-[#1B733D] font-medium bg-gray-50" : "text-[#45546E] font-normal"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                    activeSection === section.id ? "bg-[#1B733D]" : "bg-transparent"
                  }`}
                />
                <i className={`${section.icon} text-lg`}></i>
                {!isSidebarCollapsed && <span>{section.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main content - Full width without white spaces */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "ml-4" : "ml-4"
          } mt-4 mr-4`}
        >
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-4 pb-6">
              {/* RFP Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["RFP Details"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">RFP Details</h2>
                  <button
                    onClick={() => toggleSection("RFP Details")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["RFP Details"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["RFP Details"] && (
                  <div className="space-y-6">
                    {/* RFP Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RFP title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.rfpTitle}
                        onChange={(e) => setFormData({ ...formData, rfpTitle: e.target.value })}
                        disabled={isSent}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* RFP ID, Linked PR, Department */}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          RFP ID (Auto Generated) <Info size={14} className="text-gray-400" />
                        </label>
                        <input
                          type="text"
                          value={formData.rfpId}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Linked PR</label>
                        <input
                          type="text"
                          value={formData.linkedPR}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input
                          type="text"
                          value={formData.department}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          disabled={isSent}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] text-gray-500 disabled:bg-gray-100"
                        >
                          <option value="">Select Here</option>
                          <option value="Goods">Goods</option>
                          <option value="Services">Services</option>
                          <option value="Works">Works</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mode of tenor <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.modeOfTenor}
                          onChange={(e) => setFormData({ ...formData, modeOfTenor: e.target.value })}
                          disabled={isSent}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] text-gray-500 disabled:bg-gray-100"
                        >
                          <option value="">Select Here</option>
                          <option value="Public">Public</option>
                          <option value="Limited">Limited</option>
                          <option value="Direct">Direct</option>
                        </select>
                      </div>
                    </div>

                    {/* Time lines */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">Time lines</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bid closing date (RCD) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.bidClosingDate}
                            onChange={(e) => setFormData({ ...formData, bidClosingDate: e.target.value })}
                            placeholder="Select Date and time"
                            disabled={isSent}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] text-gray-500 disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected award date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.expectedAwardDate}
                            onChange={(e) => setFormData({ ...formData, expectedAwardDate: e.target.value })}
                            placeholder="Select Date"
                            disabled={isSent}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] text-gray-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Scope */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">Scope</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purpose <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            rows={4}
                            disabled={isSent}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Scope Of Work <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.scopeOfWork}
                            onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
                            rows={4}
                            disabled={isSent}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Of Quantity Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["Bill of Quantity"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Bill Of Quantity</h2>
                  <button
                    onClick={() => toggleSection("Bill of Quantity")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["Bill of Quantity"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["Bill of Quantity"] && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">SAR 15,000,000</p>
                        <p className="text-xs text-gray-500 mt-1">RFP Estimated Price (Without VAT)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">SAR 3,000,000</p>
                        <p className="text-xs text-gray-500 mt-1">VAT Amount</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">SAR 18,000,000</p>
                        <p className="text-xs text-gray-500 mt-1">RFP Estimated Price (With VAT)</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr style={{ backgroundColor: "#1B733D" }}>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Material Group</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Item Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">
                              Units of Measure (UOM)
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">
                              Estimated Unit Price (without VAT)
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">
                              Expected Delivery Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {billOfQuantityItems.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="px-4 py-3 text-sm text-gray-900">{item.materialGroup}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.itemName}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.uom}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.price}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.deliveryDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Terms & Conditions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Terms & Conditions <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.termsAndConditions}
                        onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                        rows={4}
                        disabled={isSent}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                      />
                    </div>

                    {/* Expected submissions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected submissions <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.expectedSubmissions}
                        onChange={(e) => setFormData({ ...formData, expectedSubmissions: e.target.value })}
                        rows={4}
                        disabled={isSent}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Choose Vendors Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["Choose vendors"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">
                    {isSent ? "Vendors" : "Choose vendors to invite for RFP"}
                  </h2>
                  <div className="flex items-center gap-3">
                    {!isSent && (
                      <button className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2">
                        <Plus size={18} />
                        Add vendor
                      </button>
                    )}
                    <button
                      onClick={() => toggleSection("Choose vendors")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["Choose vendors"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["Choose vendors"] && (
                  <>
                    {isSent && (
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">60%</span>
                            <Info size={14} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600">Technical Evaluation Weightage</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">40%</span>
                            <Info size={14} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600">Financial Weightage</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">50%</span>
                            <Info size={14} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600">Technical Evaluation Passing Percentage</p>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      {isSent ? (
                        // View-only mode table with Price Ranking, Comments, and Documents Checklist
                        <table className="w-full border-collapse">
                          <thead>
                            <tr style={{ backgroundColor: "#1B733D" }}>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">Price Ranking</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">Vendor Name</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-white">Comments</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-white">
                                Documents Checklist
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {vendorsWithStatus.map((vendor, index) => (
                              <tr key={vendor.id} className="border-b border-gray-200">
                                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-900">{vendor.name}</span>
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        vendor.statusColor === "green"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {vendor.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => setShowComments(true)}
                                      className="relative p-2 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      <MessageSquare size={20} style={{ color: "#1B733D" }} />
                                      {vendor.commentCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                                          {vendor.commentCount}
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => setShowDocumentChecklist(true)}
                                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      View
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        // Edit mode table with S.No, Vendor name, and Action
                        <table className="w-full border-collapse">
                          <thead>
                            <tr style={{ backgroundColor: "#1B733D" }}>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">S. No</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">Vendor name</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-white">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vendors.map((vendor, index) => (
                              <tr key={vendor.id} className="border-b border-gray-200">
                                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{vendor.name}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                      <Edit2 size={16} className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                      <Trash2 size={16} className="text-red-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Attachments Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["Attachments"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Attachments</h2>
                  <button
                    onClick={() => toggleSection("Attachments")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["Attachments"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["Attachments"] && (
                  <div className="space-y-6">
                    {/* Upload Area */}
                    {!isSent && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "#E8F5E9" }}
                          >
                            <Upload size={24} style={{ color: "#1B733D" }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Click or Drag file to this area to upload
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports single or for bulk upload and Max file size is 15MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Uploaded Documents */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Supporting document (Uploaded by you)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {uploadedDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                                <FileText size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <Download size={16} className="text-gray-600" />
                              </button>
                              {!isSent && (
                                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                  <Trash2 size={16} className="text-red-600" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDocumentChecklist && isSent && (
        <div className="fixed inset-y-0 right-0 w-[640px] bg-white shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Documents Check List</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Download All
              </button>
              <button
                onClick={() => setShowDocumentChecklist(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#1B733D" }}>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Type of Document</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {documentChecklist.map((doc, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-4 text-sm text-gray-900">{doc.type}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                            <FileText size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                          <Download size={20} className="text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showComments && isSent && (
        <div className="fixed inset-y-0 right-0 w-[640px] bg-gray-50 shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Comments</h2>
              <p className="text-xs text-gray-500 mt-1">All comments added in bid will be shown here.</p>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-900" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end gap-6">
            {comments.map((comment) => (
              <div key={comment.id} className={`flex gap-3 ${comment.isOwn ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex flex-col ${comment.isOwn ? "items-start" : "items-end"} flex-1 max-w-md`}>
                  <div className={`flex items-center gap-2 mb-1 ${comment.isOwn ? "flex-row" : "flex-row-reverse"}`}>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    <span className="text-xs font-medium text-gray-900">{comment.author}</span>
                  </div>
                  <div className={`px-4 py-3 rounded-lg ${comment.isOwn ? "bg-green-50" : "bg-white"} shadow-sm`}>
                    <p className="text-sm text-gray-900">{comment.message}</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  <img
                    src={comment.avatar || "/placeholder.svg"}
                    alt={comment.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="write your comments here .."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendComment()
                  }
                }}
              />
              <button
                onClick={handleSendComment}
                className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: "#1B733D" }}
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
