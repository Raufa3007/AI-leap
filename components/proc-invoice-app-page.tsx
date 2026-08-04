"use client"
import { useState, useEffect, useRef } from "react"
import InvoiceSnapshotDialog from "./invoice-snapshot-dialog"

interface ProcInvoiceAppPageProps {
  poId: string
  onBack: () => void
}

export default function ProcInvoiceAppPage({ poId, onBack }: ProcInvoiceAppPageProps) {
  const [activeSection, setActiveSection] = useState("po-details")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const sections = [
    { id: "po-details", label: "PO details", icon: "ri-file-text-line" },
    { id: "invoice-details", label: "Invoice details", icon: "ri-file-list-3-line" },
    { id: "3-way-validation", label: "3 way validation", icon: "ri-checkbox-multiple-line" },
    { id: "previous-invoices", label: "Previous Invoices", icon: "ri-history-line" },
    { id: "other-ses", label: "Other SES in PO", icon: "ri-folder-line" },
  ]

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
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section && contentRef.current) {
      const offsetTop = section.offsetTop - 20
      contentRef.current.scrollTo({ top: offsetTop, behavior: "smooth" })
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
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
            <i className="ri-arrow-left-line text-lg"></i>
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Invoice app</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2">
            <i className="ri-message-2-line text-base"></i>
            Comments
          </button>
          <button className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 shadow-sm">
            <i className="ri-save-line text-base"></i>
            Save
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
          } mt-4`}
        >
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-4 pb-6">
              {/* PO Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["po-details"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">PO details</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PO Reference Number</p>
                    <p className="text-sm font-medium text-[#1B733D]">PO-2025-014</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PR Reference</p>
                    <p className="text-sm font-medium text-gray-900">542345</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Supplier</p>
                    <p className="text-sm font-medium text-gray-900">Kaar Technologies</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Awarded date</p>
                    <p className="text-sm font-medium text-gray-900">12-Jun-25</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Milestone</p>
                    <p className="text-sm font-medium text-gray-900">Delivery of furnitures</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["invoice-details"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">Invoice details</h2>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invoice number</p>
                    <p className="text-sm font-semibold text-gray-900">INV 34323</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invoice date</p>
                    <p className="text-sm font-medium text-gray-900">14 Mar 2025</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment terms</p>
                    <p className="text-sm font-medium text-gray-900">Net 30 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Currency</p>
                    <p className="text-sm font-semibold text-gray-900">SAR</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tax (VAT 15%)</p>
                    <p className="text-sm font-medium text-gray-900">108,000 ₹</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total payable</p>
                    <p className="text-sm font-semibold text-gray-900">1,000,000</p>
                  </div>
                </div>

                {/* Attachments */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-3">Attachments</p>

                  {/* Invoice Attachment */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">Invoice (1)</h3>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md">
                          <i className="ri-download-line" />
                          Download All
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <i className="ri-arrow-up-s-line text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-[#1B733D]">
                        <span className="text-sm font-medium text-white">Attachment</span>
                        <span className="text-sm font-medium text-white">Uploaded date</span>
                      </div>
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setShowInvoiceDialog(true)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                            <i className="ri-file-pdf-line text-red-600 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Invoice 1</p>
                            <p className="text-xs text-gray-500">6.5kb</p>
                          </div>
                          <button
                            className="ml-2 p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Download functionality
                            }}
                          >
                            <i className="ri-download-line text-gray-600" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-600">02-Aug-2022</span>
                      </div>
                    </div>
                  </div>

                  {/* Tax Certificate */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">Tax certificate (1)</h3>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md">
                          <i className="ri-download-line" />
                          Download All
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <i className="ri-arrow-up-s-line text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-[#1B733D]">
                        <span className="text-sm font-medium text-white">Attachment</span>
                        <span className="text-sm font-medium text-white">Uploaded date</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                            <i className="ri-file-pdf-line text-red-600 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Tax certificate</p>
                            <p className="text-xs text-gray-500">6.5kb</p>
                          </div>
                          <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                            <i className="ri-download-line text-gray-600" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-600">02-Aug-2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Way Match Validation */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["3-way-validation"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">3 Way match validation</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#1B733D]">
                    <span className="text-sm font-medium text-white">Attribute</span>
                    <span className="text-sm font-medium text-white">PO</span>
                    <span className="text-sm font-medium text-white">CoC</span>
                    <span className="text-sm font-medium text-white">Invoice</span>
                    <span className="text-sm font-medium text-white">Match</span>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-200 items-center">
                    <span className="text-sm text-gray-900">Milestone ID</span>
                    <span className="text-sm text-gray-900">M2</span>
                    <span className="text-sm text-gray-900">M2</span>
                    <span className="text-sm text-gray-900">M2</span>
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-200 items-center">
                    <span className="text-sm text-gray-900">Amount</span>
                    <span className="text-sm text-gray-900">73,000</span>
                    <span className="text-sm text-gray-900">73,000</span>
                    <span className="text-sm text-gray-900">73,000</span>
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-200 items-center">
                    <span className="text-sm text-gray-900">Description</span>
                    <span className="text-sm text-gray-900">Delivery of furniture</span>
                    <span className="text-sm text-gray-900">Delivery of furniture</span>
                    <span className="text-sm text-gray-900">Delivery of furniture</span>
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-200 items-center">
                    <span className="text-sm text-gray-900">Complete date</span>
                    <span className="text-sm text-gray-900">12 Oct 2025</span>
                    <span className="text-sm text-gray-900">12 Oct 2025</span>
                    <span className="text-sm text-gray-900">16 Oct 2025</span>
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-200 items-center">
                    <span className="text-sm text-gray-900">Payment terms</span>
                    <span className="text-sm text-gray-900">Next 30 Days</span>
                    <span className="text-sm text-gray-900">Next 30 Days</span>
                    <span className="text-sm text-gray-900">Next 30 Days</span>
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Invoice */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["previous-invoices"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Previous Invoice</h2>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <i className="ri-bar-chart-line text-gray-600" />
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">Invoice reference</span>
                      <i className="ri-arrow-up-down-line text-gray-500 text-xs" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Submitted on</span>
                    <span className="text-xs font-medium text-gray-700">Approved on</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">Status</span>
                      <i className="ri-arrow-up-down-line text-gray-500 text-xs" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Attachment</span>
                    <span className="text-xs font-medium text-gray-700"></span>
                  </div>
                  <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-200 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <i className="ri-file-text-line text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-900">1070000137</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Dhul Hijjah 18, 1446</p>
                      <p className="text-xs text-gray-500">14 Jun 2025</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Moharram 30, 1447</p>
                      <p className="text-xs text-gray-500">14 Jul 2025</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                      Paid
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <i className="ri-file-pdf-line text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Invoice</p>
                        <p className="text-xs text-gray-500">6.5kb</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <i className="ri-download-line text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <i className="ri-file-text-line text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-900">0005600068</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Rabbi al-Awal 5, 1447</p>
                      <p className="text-xs text-gray-500">03 Aug 2025</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Rabi Al-Akhar 6, 1447</p>
                      <p className="text-xs text-gray-500">28 Sep 2025</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                      Paid
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <i className="ri-file-pdf-line text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Invoice</p>
                        <p className="text-xs text-gray-500">6.5kb</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <i className="ri-download-line text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Others SES in PO */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["other-ses"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Others SES in PO</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: "60%" }} />
                      </div>
                      <span className="text-sm text-gray-600">60 %</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">Milestone</span>
                      <i className="ri-arrow-up-down-line text-gray-500 text-xs" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Description</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">Status</span>
                      <i className="ri-arrow-up-down-line text-gray-500 text-xs" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Approved on</span>
                    <span className="text-xs font-medium text-gray-700">Action</span>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <i className="ri-file-list-line text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-900">1070000137</span>
                    </div>
                    <span className="text-sm text-gray-900">IT Infrastructure Setup</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                      Paid
                    </span>
                    <span className="text-sm text-gray-600">30 Jun 2026</span>
                    <button className="text-sm text-[#1B733D] hover:underline">View certificate</button>
                  </div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <i className="ri-file-list-line text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-900">0005600068</span>
                    </div>
                    <span className="text-sm text-gray-900">Laptop</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                      Paid
                    </span>
                    <span className="text-sm text-gray-600">30 Sep 2026</span>
                    <button className="text-sm text-[#1B733D] hover:underline">View certificate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Snapshot Dialog */}
      <InvoiceSnapshotDialog isOpen={showInvoiceDialog} onClose={() => setShowInvoiceDialog(false)} />
    </div>
  )
}
