"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Info, Upload, Plus, Trash2, FileText, Eye, MessageSquare } from "lucide-react"
import { saveQuotationDraft, sendQuotation, loadQuotationDraft } from "@/app/actions/save-quotation-draft"
import ProcRFIVendorList from "./proc-rfi-vendor-list"
import { useToast } from "@/hooks/use-toast"

interface ProcQuotationCreateFormProps {
  quotationId: string
  onBack: () => void
  onSuccess: () => void
}

interface Attachment {
  id: string
  name: string
  size: string
  type: string
  url?: string
  preview?: string
}

interface Vendor {
  id: string
  name: string
  status: "submitted" | "open"
}

export default function ProcInboxPREditQuotation({ quotationId, onBack, onSuccess }: ProcQuotationCreateFormProps) {
  const { toast } = useToast()

  console.log("[v0] Component mounted, toast available:", typeof toast)

  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState("quotationDetails")
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const [showCommentsSidebar, setShowCommentsSidebar] = useState(false)
  const [selectedVendorForComments, setSelectedVendorForComments] = useState<Vendor | null>(null)
  const [commentText, setCommentText] = useState("")
  const [showVendorListView, setShowVendorListView] = useState(false)

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: "1", name: "Kaar Technologies Private Limited", status: "submitted" },
    { id: "2", name: "Wipro Limited", status: "open" },
    { id: "3", name: "TCS Private Limited", status: "submitted" },
  ])

  const [formData, setFormData] = useState({
    title: "Leadership training program quotation",
    linkedRFP: "32425",
    department: "Kaasparc Admin",
    category: "",
    modeOfTenor: "",
    bidClosingDate: "",
    expectedAwardDate: "",
    purpose:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    scopeOfWork:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    termsAndConditions:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    expectedSubmissions:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
  })

  // Sections configuration
  const sections = [
    { id: "quotationDetails", label: "Quotation Details", icon: "ri-file-text-line" },
    { id: "timelines", label: "Time lines", icon: "ri-time-line" },
    { id: "scope", label: "Scope", icon: "ri-layout-grid-line" },
    { id: "billOfQuantity", label: "Bill Of Quantity", icon: "ri-table-2" },
    { id: "termsAndConditions", label: "Terms & Conditions", icon: "ri-file-list-line" },
    { id: "expectedSubmissions", label: "Expected submissions", icon: "ri-checkbox-multiple-line" },
    { id: "vendors", label: "Choose vendors", icon: "ri-store-line" },
    { id: "attachments", label: "Attachments", icon: "ri-attachment-line" },
  ]

  useEffect(() => {
    const loadDraft = async () => {
      const result = await loadQuotationDraft(quotationId)
      if (result.success && result.data) {
        setFormData({
          title: result.data.title || "",
          linkedRFP: result.data.linked_rfp || "",
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
        if (result.data.status === "completed") {
          setIsReadOnly(true)
        }
      }
    }
    loadDraft()
  }, [quotationId])

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
    console.log("[v0] BUTTON CLICKED - handleSaveAsDraft called")

    if (isSaving) {
      console.log("[v0] Already saving, ignoring click")
      return
    }

    setIsSaving(true)

    try {
      const quotationData = {
        pr_number: quotationId,
        title: formData.title,
        quotation_id: "34534",
        linked_rfp: formData.linkedRFP,
        department: formData.department,
        category: formData.category,
        mode_of_tenor: formData.modeOfTenor,
        bid_closing_date: formData.bidClosingDate,
        expected_award_date: formData.expectedAwardDate,
        purpose: formData.purpose,
        scope_of_work: formData.scopeOfWork,
        bill_of_quantity: [
          {
            material_group: "Electronics",
            item_name: "Laptop",
            quantity: 10,
            units_of_measure: "Count",
            estimated_unit_price: "1000000",
            expected_delivery_date: "12/12/26",
          },
        ],
        terms_and_conditions: formData.termsAndConditions,
        expected_submissions: formData.expectedSubmissions,
        vendors: vendors.map((v) => ({ id: v.id, name: v.name })),
        attachments: attachments,
      }

      console.log("[v0] About to call saveQuotationDraft")
      const result = await saveQuotationDraft(quotationData)
      console.log("[v0] Result received:", result)

      if (result.success) {
        console.log("[v0] Success - showing toast")
        toast({
          title: "Draft Saved Successfully",
          description: "Your quotation draft has been saved and can be edited later.",
          duration: 3000,
        })
      } else {
        console.log("[v0] Error - showing error toast")
        toast({
          title: "Error",
          description: result.error || "Failed to save draft. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Exception caught:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      console.log("[v0] Setting isSaving to false")
      setIsSaving(false)
    }
  }

  const handleSubmit = async () => {
    console.log("[v0] handleSubmit called")

    try {
      await handleSaveAsDraft()

      console.log("[v0] Calling sendQuotation...")
      const result = await sendQuotation(quotationId)
      console.log("[v0] sendQuotation result:", result)

      if (result.success) {
        setIsReadOnly(true)
        toast({
          title: "Quotation Submitted Successfully",
          description: `Quotation ${quotationId} has been submitted to vendors.`,
          duration: 2500,
        })
onBack();
     
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit quotation. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error in handleSubmit:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const newAttachment: Attachment = {
        id: String(Date.now() + Math.random()),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      }

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newAttachment.preview = e.target?.result as string
          setAttachments((prev) => [...prev, newAttachment])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachments((prev) => [...prev, newAttachment])
      }
    })
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
    if (expandedPreview === id) {
      setExpandedPreview(null)
    }
  }

  const handleOpenComments = (vendor: Vendor) => {
    setSelectedVendorForComments(vendor)
    setShowCommentsSidebar(true)
  }

  const handleCloseComments = () => {
    setShowCommentsSidebar(false)
    setSelectedVendorForComments(null)
    setCommentText("")
  }

  const handleSendComment = () => {
    if (commentText.trim() && selectedVendorForComments) {
      console.log(`Sending comment for ${selectedVendorForComments.name}: ${commentText}`)
      setCommentText("")
    }
  }

  const handleViewQuotation = () => {
    setShowVendorListView(true)
  }

  const handleBackFromVendorList = () => {
    setShowVendorListView(false)
  }

  if (showVendorListView) {
    return <ProcRFIVendorList rfiId={quotationId} onBack={handleBackFromVendorList} type="quotation" />
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Full width header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Request for Quotation</h1>
          {isReadOnly && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Read Only - Sent
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  console.log("[v0] Save button clicked!", e)
                  e.preventDefault()
                  e.stopPropagation()
                  handleSaveAsDraft()
                }}
                disabled={isSaving}
                className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-save-2-line text-base"></i>
                {isSaving ? "Saving..." : "Save As Draft"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-check-double-fill text-base"></i>
                Submit Quotation
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

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "ml-4" : "ml-4"
          } mt-4 mr-0`}
        >
          <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="space-y-4 pb-6 pr-4">
              {/* Quotation Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["quotationDetails"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Quotation Details</h2>
                  <button
                    onClick={() => toggleSection("quotationDetails")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["quotationDetails"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["quotationDetails"] && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quotation title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          Quotation ID (Auto Generated) <Info size={14} className="text-gray-400" />
                        </label>
                        <input
                          type="text"
                          defaultValue="34534"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Linked RFP</label>
                        <input
                          type="text"
                          value={formData.linkedRFP}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input
                          type="text"
                          value={formData.department}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="">Select Here</option>
                          <option value="goods">Goods</option>
                          <option value="services">Services</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode of tenor *</label>
                        <select
                          value={formData.modeOfTenor}
                          onChange={(e) => setFormData({ ...formData, modeOfTenor: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="">Select Here</option>
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Time lines Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["timelines"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Time lines</h2>
                  <button
                    onClick={() => toggleSection("timelines")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["timelines"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["timelines"] && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bid closing date (RCD) *</label>
                      <input
                        type="datetime-local"
                        value={formData.bidClosingDate}
                        onChange={(e) => setFormData({ ...formData, bidClosingDate: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected award date *</label>
                      <input
                        type="date"
                        value={formData.expectedAwardDate}
                        onChange={(e) => setFormData({ ...formData, expectedAwardDate: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Scope Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["scope"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Scope</h2>
                  <button
                    onClick={() => toggleSection("scope")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["scope"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["scope"] && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
                      <textarea
                        rows={4}
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100 scrollbar-hide resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scope Of Work *</label>
                      <textarea
                        rows={4}
                        value={formData.scopeOfWork}
                        onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100 scrollbar-hide resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Of Quantity Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["billOfQuantity"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Bill Of Quantity</h2>
                  <button
                    onClick={() => toggleSection("billOfQuantity")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["billOfQuantity"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["billOfQuantity"] && (
                  <div>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">SAR 15,000,000</p>
                        <p className="text-xs text-gray-500">Quotation Estimated Price (Without VAT)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">SAR 3,000,000</p>
                        <p className="text-xs text-gray-500">VAT Amount</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">SAR 18,000,000</p>
                        <p className="text-xs text-gray-500">Quotation Estimated Price (With VAT)</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
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
                          {[
                            {
                              material: "Electronics",
                              item: "Laptop",
                              qty: 10,
                              uom: "Count",
                              price: "1,000,000",
                              date: "12/12/26",
                            },
                            {
                              material: "Electronics",
                              item: "Mouse",
                              qty: 10,
                              uom: "Count",
                              price: "1,000",
                              date: "12/12/26",
                            },
                            {
                              material: "Electronics",
                              item: "Hard disk",
                              qty: 2,
                              uom: "Count",
                              price: "10,000",
                              date: "12/12/26",
                            },
                          ].map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-200">
                              <td className="px-4 py-3 text-sm text-gray-700">{row.material}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{row.item}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{row.qty}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{row.uom}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{row.price}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Conditions Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["termsAndConditions"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Terms & Conditions</h2>
                  <button
                    onClick={() => toggleSection("termsAndConditions")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["termsAndConditions"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["termsAndConditions"] && (
                  <textarea
                    rows={4}
                    value={formData.termsAndConditions}
                    onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100 scrollbar-hide resize-none"
                  />
                )}
              </div>

              {/* Expected submissions Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["expectedSubmissions"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Expected submissions</h2>
                  <button
                    onClick={() => toggleSection("expectedSubmissions")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["expectedSubmissions"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["expectedSubmissions"] && (
                  <textarea
                    rows={4}
                    value={formData.expectedSubmissions}
                    onChange={(e) => setFormData({ ...formData, expectedSubmissions: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent disabled:bg-gray-100 scrollbar-hide resize-none"
                  />
                )}
              </div>

              {/* Choose vendors Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["vendors"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Choose vendors to invite for Quotation</h2>
                  <div className="flex items-center gap-3">
                    {isReadOnly && (
                      <button
                        onClick={handleViewQuotation}
                        className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors"
                      >
                        View Quotation
                      </button>
                    )}
                    {!isReadOnly && (
                      <button className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2">
                        <Plus size={18} />
                        Add vendor
                      </button>
                    )}
                    <button
                      onClick={() => toggleSection("vendors")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["vendors"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["vendors"] && (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ backgroundColor: "#1B733D" }}>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">S. No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Vendor name</th>
                            {isReadOnly && (
                              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                            )}
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendors.map((vendor, index) => (
                            <tr key={vendor.id} className="border-b border-gray-200">
                              <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{vendor.name}</td>
                              {isReadOnly && (
                                <td className="px-4 py-3 text-sm">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      vendor.status === "submitted"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {vendor.status === "submitted" ? "Submitted" : "Open"}
                                  </span>
                                </td>
                              )}
                              <td className="px-4 py-3 text-sm">
                                {isReadOnly ? (
                                  <button
                                    onClick={() => handleOpenComments(vendor)}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <MessageSquare size={18} className="text-gray-600" />
                                  </button>
                                ) : (
                                  <>
                                    <button className="p-1 hover:bg-gray-100 rounded">✏️</button>
                                    <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["attachments"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Attachments</h2>
                  <button
                    onClick={() => toggleSection("attachments")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["attachments"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["attachments"] && (
                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <Upload size={32} className="mx-auto text-[#1B733D] mb-3" />
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Click or Drag file to this area to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports single or for bulk upload and Max file size is 15MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((attachment) => (
                          <div key={attachment.id} className="space-y-2">
                            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                              {attachment.preview ? (
                                <img
                                  src={attachment.preview || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <FileText size={24} className="text-gray-400" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{attachment.size}</p>
                              </div>
                              {attachment.preview && (
                                <button
                                  onClick={() =>
                                    setExpandedPreview(expandedPreview === attachment.id ? null : attachment.id)
                                  }
                                  className="p-2 text-gray-600 hover:text-[#1B733D] transition-colors"
                                >
                                  <Eye size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveAttachment(attachment.id)}
                                className="p-2 text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {expandedPreview === attachment.id && attachment.preview && (
                              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <img
                                  src={attachment.preview || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-full h-auto rounded"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCommentsSidebar && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={handleCloseComments} />
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
                <p className="text-sm text-gray-500 mt-1">All comments for {selectedVendorForComments?.name}</p>
              </div>
              <button onClick={handleCloseComments} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col items-end">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">Yesterday, 4:30 PM</span>
                      <span className="text-xs font-medium text-gray-700">Arbel Zaidel (Procurement manager)</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-900">Can you define timeline for each deliverables ?</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    AZ
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">Mark Siegelman (Requestor)</span>
                    <span className="text-xs text-gray-500">Today, 10:00 AM</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-sm text-gray-900">Sure Arbel, Will add & resubmit the proposal.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="write your comments here ..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendComment()
                    }
                  }}
                />
                <button
                  onClick={handleSendComment}
                  className="px-6 py-2 bg-[#1B733D] text-white rounded-lg hover:bg-[#155a30] transition-colors flex items-center gap-2 font-medium"
                >
                  <i className="ri-send-plane-fill"></i>
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
