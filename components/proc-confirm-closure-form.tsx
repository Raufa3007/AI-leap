"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Check, X } from "lucide-react"

interface ConfirmClosureFormProps {
  poId: string
  onBack: () => void
  onSuccess?: () => void
}

interface Milestone {
  id: string
  name: string
  description: string
  scheduleDate: string
  amount: string
  value: string
}

interface ConfirmationState {
  isOpen: boolean
  message: string
}

interface SuccessState {
  isOpen: boolean
  message: string
}

export default function ProcConfirmClosureForm({ poId, onBack, onSuccess }: ConfirmClosureFormProps) {
  const [poDetails, setPoDetails] = useState({
    poNumber: "PO-2025-014",
    prReference: "542345",
    supplier: "Kaar Technologies",
    deadline: "2025-12-25",
    milestone: "Delivery of furnitures",
  })

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      name: "M2",
      description: "Delivery of Chair, Table & furnitures",
      scheduleDate: "14-Mar-25 (On-time)",
      amount: "1,000,000",
      value: "60% of total PO",
    },
  ])

  const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, message: "" })
  const [success, setSuccess] = useState<SuccessState>({ isOpen: false, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("po-details")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const sections = [
    { id: "po-details", label: "PO details", icon: "ri-file-text-line" },
    { id: "milestone-delivery", label: "Milestone / Delivery details", icon: "ri-layout-grid-line" },
    { id: "supplier-submissions", label: "Supplier submissions / Evidences", icon: "ri-checkbox-multiple-line" },
    { id: "other-ses", label: "Other SES in PO", icon: "ri-time-line" },
  ]

  useEffect(() => {
    setIsLoading(false)
  }, [poId])

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
    setTimeout(() => {
      setIsSavingDraft(false)
      setSuccess({
        isOpen: true,
        message: "Draft saved successfully",
      })
      setTimeout(() => {
        setSuccess({ isOpen: false, message: "" })
      }, 2000)
    }, 500)
  }

  const handleConfirm = async () => {
    setConfirmation({
      isOpen: true,
      message: "Are you sure you want to confirm closure/delivery of this item?",
    })
  }

  const handleConfirmAction = async () => {
    setConfirmation({ isOpen: false, message: "" })
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess({
        isOpen: true,
        message: "Closure confirmed successfully",
      })
      setIsReadOnly(true)

      setTimeout(() => {
        setSuccess({ isOpen: false, message: "" })
        onSuccess?.()
        onBack()
      }, 2000)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">
            Confirm closure/delivery of the item in the PO {poId}
          </h1>
          {isReadOnly && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Read Only - Confirmed
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
            onClick={handleConfirm}
            disabled={isSubmitting || isReadOnly}
            className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-check-double-fill text-base"></i>
            <span>{isSubmitting ? "Confirming..." : "Confirm"}</span>
          </button>
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
          } mt-4 mr-4`}
        >
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-4 pb-6">
              {/* PO Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["po-details"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">PO details</h2>
                  <button
                    onClick={() => toggleSection("po-details")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["po-details"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["po-details"] && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PO Reference Number</label>
                      <input
                        type="text"
                        value={poDetails.poNumber}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PR Reference</label>
                      <input
                        type="text"
                        value={poDetails.prReference}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                      <input
                        type="text"
                        value={poDetails.supplier}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                      <input
                        type="date"
                        value={poDetails.deadline}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Milestone</label>
                      <input
                        type="text"
                        value={poDetails.milestone}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B733D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Milestone / Delivery Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["milestone-delivery"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Milestone / Delivery details</h2>
                  <button
                    onClick={() => toggleSection("milestone-delivery")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["milestone-delivery"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["milestone-delivery"] && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1B733D] text-white">
                          <th className="px-4 py-3 text-left text-sm font-semibold">Milestone ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Schedule date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Value (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {milestones.map((milestone) => (
                          <tr key={milestone.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{milestone.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{milestone.description}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{milestone.scheduleDate}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{milestone.amount}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{milestone.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Supplier Submissions & Evidences Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["supplier-submissions"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Supplier submissions & evidences</h2>
                  <button
                    onClick={() => toggleSection("supplier-submissions")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["supplier-submissions"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["supplier-submissions"] && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Amount</h4>
                      <p className="text-sm text-gray-700">
                        Our team successfully delivered the furniture, including the chair, on October 19, 2025. The
                        delivery was completed on schedule without any delays.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted by</h4>
                      <p className="text-sm text-gray-700">Mohammed - Omran</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted on</h4>
                      <p className="text-sm text-gray-700">12-Jun-23</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Attachments</h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr style={{ backgroundColor: "#1B733D" }}>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Attachment</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Uploaded date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="px-4 py-3 text-sm text-gray-900">Invoice 1</td>
                              <td className="px-4 py-3 text-sm text-gray-900">02-Aug-2022</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other SES in PO Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["other-ses"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Other SES in PO</h2>
                  <button
                    onClick={() => toggleSection("other-ses")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["other-ses"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["other-ses"] && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1B733D] text-white">
                          <th className="px-4 py-3 text-left text-sm font-semibold">Milestone</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Delivered on</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">01</td>
                          <td className="px-4 py-3 text-sm text-gray-900">IT Infrastructure Setup</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Approved
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">-</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-[#1B733D] hover:underline text-sm font-medium">
                              View certificate
                            </button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">02</td>
                          <td className="px-4 py-3 text-sm text-gray-900">Laptop</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Approved
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">-</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-[#1B733D] hover:underline text-sm font-medium">
                              View certificate
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={32} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Confirm closure/delivery?</h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to confirm the closure and delivery of this item in the PO?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmation({ isOpen: false, message: "" })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#1B733D] text-white rounded-lg font-medium hover:bg-[#155a30] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Confirming..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
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
