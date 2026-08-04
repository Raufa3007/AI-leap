"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Upload, Plus, Trash2, Check, X, MessageSquare, Send } from "lucide-react"
import { saveRFIDraft, sendRFI, loadRFIDraft } from "@/app/actions/save-rfi-draft"
import ProcRFIVendorList from "./proc-rfi-vendor-list"

interface RFIFormProps {
  rfiId: string
  onBack: () => void
  onSuccess?: () => void
}

interface Vendor {
  id: string
  name: string
  crNumber?: string
  companyType?: string
  primaryContact?: string
  email?: string
  contactNumber?: string
  status?: "submitted" | "open"
}

interface ConfirmationState {
  isOpen: boolean
  message: string
}

interface SuccessState {
  isOpen: boolean
  message: string
}

export default function ProcInboxPREditRFI({ rfiId, onBack, onSuccess }: RFIFormProps) {
  const [title, setTitle] = useState("Leadership Development Training Program")
  const [description, setDescription] = useState(
    "The Leadership Development Training Program will be designed to build and strengthen leadership capabilities across the organization by focusing on key competencies such as strategic thinking, communication, decision-making, people management, and change leadership. The program will be delivered through interactive training sessions, workshops, case studies, and digital learning resources, ensuring both knowledge building and practical application.",
  )
  const [scopeOfWork, setScopeOfWork] = useState(
    "Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.",
  )
  const [expectedDeliverables, setExpectedDeliverables] = useState(
    "The program will be delivered through interactive training sessions, workshops, case studies, and digital learning resources, ensuring both knowledge building and practical application. Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.",
  )
  const [responseDeadline, setResponseDeadline] = useState("2025-10-29")
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "Kaar Technologies Private Limited",
      crNumber: "7890902344",
      companyType: "service provider",
      primaryContact: "Ameed Ansari",
      email: "Ameedansari@kaartech.com",
      contactNumber: "3984791741",
      status: "submitted",
    },
    {
      id: "2",
      name: "Wipro Limited",
      crNumber: "7890902345",
      companyType: "service provider",
      primaryContact: "John Doe",
      email: "john@wipro.com",
      contactNumber: "3984791742",
      status: "open",
    },
    {
      id: "3",
      name: "TCS Private Limited",
      crNumber: "7890902346",
      companyType: "service provider",
      primaryContact: "Jane Smith",
      email: "jane@tcs.com",
      contactNumber: "3984791743",
      status: "submitted",
    },
  ])
  const [priority, setPriority] = useState("high")
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, message: "" })
  const [success, setSuccess] = useState<SuccessState>({ isOpen: false, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("basic-info")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(false)
  const [selectedVendorForComments, setSelectedVendorForComments] = useState<Vendor | null>(null)
  const [commentText, setCommentText] = useState("")
  const [showRFIDetailView, setShowRFIDetailView] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const sections = [
    { id: "basic-info", label: "Basic info", icon: "ri-file-text-line" },
    { id: "scope-of-work", label: "Scope Of Work", icon: "ri-layout-grid-line" },
    { id: "expected-deliverables", label: "Expected Deliverables", icon: "ri-checkbox-multiple-line" },
    { id: "response-deadline", label: "Response Deadline", icon: "ri-time-line" },
    { id: "priority", label: "Priority", icon: "ri-flag-line" },
    { id: "attachments", label: "Attachments", icon: "ri-attachment-line" },
    { id: "choose-vendors", label: "Choose vendors", icon: "ri-store-line" },
  ]

  useEffect(() => {
    const loadDraft = async () => {
      setIsLoading(true)
      const result = await loadRFIDraft(rfiId)

      if (result.success && result.data) {
        const data = result.data
        setTitle(data.title)
        setDescription(data.description)
        setScopeOfWork(data.scope_of_work)
        setExpectedDeliverables(data.expected_deliverables)
        setResponseDeadline(data.response_deadline)
        setPriority(data.priority)
        setVendors(data.vendors || [])

        if (data.status === "completed") {
          setIsReadOnly(true)
        }
      }

      setIsLoading(false)
    }

    loadDraft()
  }, [rfiId])

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
    setIsSavingDraft(true)

    const rfiData = {
      pr_number: rfiId,
      title,
      description,
      scope_of_work: scopeOfWork,
      expected_deliverables: expectedDeliverables,
      response_deadline: responseDeadline,
      priority,
      vendors,
    }

    const result = await saveRFIDraft(rfiData)

    setIsSavingDraft(false)

    if (result.success) {
      setSuccess({
        isOpen: true,
        message: result.message || "Draft saved successfully",
      })

      setTimeout(() => {
        setSuccess({ isOpen: false, message: "" })
      }, 2000)
    } else {
      setSuccess({
        isOpen: true,
        message: result.error || "Failed to save draft",
      })

      setTimeout(() => {
        setSuccess({ isOpen: false, message: "" })
      }, 3000)
    }
  }

  const handleSend = async () => {
    setConfirmation({
      isOpen: true,
      message: "Are you sure to send it to all suppliers?",
    })
  }

  const handleConfirmSend = async () => {
    setConfirmation({ isOpen: false, message: "" })
    setIsSubmitting(true)

    const rfiData = {
      pr_number: rfiId,
      title,
      description,
      scope_of_work: scopeOfWork,
      expected_deliverables: expectedDeliverables,
      response_deadline: responseDeadline,
      priority,
      vendors,
    }

    await saveRFIDraft(rfiData)

    const result = await sendRFI(rfiId)

    setIsSubmitting(false)

    if (result.success) {
      setSuccess({
        isOpen: true,
        message: "RFI sent successfully",
      })

      setIsReadOnly(true)

      setTimeout(() => {
        setSuccess({ isOpen: false, message: "" })
        onSuccess?.()
        onBack()
      }, 2000)
    } else {
      setSuccess({
        isOpen: true,
        message: result.error || "Failed to send RFI",
      })

      setTimeout(() => {
        setSuccess({ isOpen: false, message: "" })
      }, 3000)
    }
  }

  const handleRemoveVendor = (id: string) => {
    if (!isReadOnly) {
      setVendors(vendors.filter((v) => v.id !== id))
    }
  }

  const handleAddVendor = () => {
    if (!isReadOnly) {
      const newVendor: Vendor = {
        id: String(vendors.length + 1),
        name: "New Vendor",
      }
      setVendors([...vendors, newVendor])
    }
  }

  const handleOpenComments = (vendor: Vendor) => {
    setSelectedVendorForComments(vendor)
    setShowCommentsSidebar(true)
  }

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[v0] Sending comment:", commentText, "for vendor:", selectedVendorForComments?.name)
      setCommentText("")
      // Here you would typically call an API to save the comment
    }
  }

  const handleViewRFI = () => {
    setShowRFIDetailView(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RFI...</p>
        </div>
      </div>
    )
  }

  if (showRFIDetailView) {
    return <ProcRFIVendorList rfiId={rfiId} onBack={() => setShowRFIDetailView(false)} />
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Request for Information for {rfiId}</h1>
          {isReadOnly && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Read Only - Sent
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isReadOnly && (
            <button
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft}
              className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-save-2-line text-base"></i>
              <span>{isSavingDraft ? "Saving..." : "Save as Draft"}</span>
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={isSubmitting || isReadOnly}
            className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-check-double-fill text-base"></i>
            <span>{isSubmitting ? "Sending..." : "Send"}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
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
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["basic-info"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Basic info</h2>
                  <button
                    onClick={() => toggleSection("basic-info")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["basic-info"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["basic-info"] && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isReadOnly}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) sectionRefs.current["scope-of-work"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Scope Of Work</h2>
                  <button
                    onClick={() => toggleSection("scope-of-work")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["scope-of-work"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["scope-of-work"] && (
                  <textarea
                    value={scopeOfWork}
                    onChange={(e) => setScopeOfWork(e.target.value)}
                    disabled={isReadOnly}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  />
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) sectionRefs.current["expected-deliverables"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Expected Deliverables</h2>
                  <button
                    onClick={() => toggleSection("expected-deliverables")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["expected-deliverables"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["expected-deliverables"] && (
                  <textarea
                    value={expectedDeliverables}
                    onChange={(e) => setExpectedDeliverables(e.target.value)}
                    disabled={isReadOnly}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  />
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) sectionRefs.current["response-deadline"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Response Deadline</h2>
                  <button
                    onClick={() => toggleSection("response-deadline")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["response-deadline"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["response-deadline"] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Start Date</label>
                    <input
                      type="date"
                      value={responseDeadline}
                      onChange={(e) => setResponseDeadline(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) sectionRefs.current["priority"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Priority</h2>
                  <button
                    onClick={() => toggleSection("priority")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["priority"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["priority"] && (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "low", label: "Low", description: "The low priority is nothing but a deadline" },
                      { value: "medium", label: "Medium", description: "The low priority is nothing but a deadline" },
                      { value: "high", label: "High", description: "The low priority is nothing but a deadline" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          priority === option.value
                            ? "border-[#1B733D] bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${isReadOnly ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={priority === option.value}
                            onChange={(e) => setPriority(e.target.value)}
                            disabled={isReadOnly}
                            className="w-4 h-4 text-[#1B733D]"
                          />
                          <span
                            className={`font-medium ${option.value === "medium" ? "text-orange-600" : "text-gray-900"}`}
                          >
                            {option.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) sectionRefs.current["attachments"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
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
                  <div
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-colors ${
                      isReadOnly ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"
                    }`}
                  >
                    <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {isReadOnly ? "Attachments locked" : "Click or Drag file to this area to upload"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isReadOnly
                        ? "Cannot modify sent RFI"
                        : "Supports single or for bulk upload and Max file size is 15MB"}
                    </p>
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) sectionRefs.current["choose-vendors"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Choose vendors to invite</h2>
                  <div className="flex items-center gap-3">
                    {isReadOnly && (
                      <button
                        onClick={handleViewRFI}
                        className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors"
                      >
                        View RFI
                      </button>
                    )}
                    {!isReadOnly && (
                      <button
                        onClick={handleAddVendor}
                        className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add vendor
                      </button>
                    )}
                    <button
                      onClick={() => toggleSection("choose-vendors")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["choose-vendors"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["choose-vendors"] && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1B733D] text-white">
                          <th className="px-4 py-3 text-left text-sm font-semibold">S. No</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Vendor name</th>
                          {isReadOnly && <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>}
                          <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendors.map((vendor, idx) => (
                          <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{vendor.name}</td>
                            {isReadOnly && (
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                                  className="p-2 text-gray-600 hover:text-[#1B733D] transition-colors"
                                  title="View comments"
                                >
                                  <MessageSquare size={18} />
                                </button>
                              ) : (
                                <>
                                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">✏️</button>
                                  <button
                                    onClick={() => handleRemoveVendor(vendor.id)}
                                    className="p-2 text-red-600 hover:text-red-900 transition-colors"
                                  >
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCommentsSidebar && (
        <>
          <div
            className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowCommentsSidebar(false)}
          />

          <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                <p className="text-sm text-gray-500 mt-1">
                  All comments for {selectedVendorForComments?.name} will be shown here
                </p>
              </div>
              <button
                onClick={() => setShowCommentsSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col items-end">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="flex-1">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-xs text-gray-500">Yesterday, 4:30 PM</span>
                      <span className="text-xs font-medium text-gray-700">Arbel Zaidel (Procurement manager)</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <p className="text-sm text-gray-900">Can you define timeline for each deliverables ?</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                    AZ
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Mark Siegelman"
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">Mark Siegelman (Requestor)</span>
                      <span className="text-xs text-gray-500">Today, 10:00 AM</span>
                    </div>
                    <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-100">
                      <p className="text-sm text-gray-900">Sure Arbel, Will add & resubmit the proposal.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="flex items-end gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendComment()
                    }
                  }}
                  placeholder="write your comments here ..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] text-sm"
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentText.trim()}
                  className="px-6 py-3 bg-[#1B733D] text-white rounded-lg font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {confirmation.isOpen && (
        <div className="fixed inset-0 flex backdrop-blur-sm items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={32} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Are you sure to send it to all suppliers?
            </h3>
            <p className="text-gray-600 text-center mb-8">
              If yes, this RFI will be sent automatically to all vendors mapped to the selected service category.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmation({ isOpen: false, message: "" })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmSend}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#1B733D] text-white rounded-lg font-medium hover:bg-[#155a30] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {success.isOpen && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-lg z-50 flex items-center gap-3 border border-green-200">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={20} className="text-green-600" />
          </div>
          <span className="text-gray-900 font-medium">{success.message}</span>
          <button
            onClick={() => setSuccess({ isOpen: false, message: "" })}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
