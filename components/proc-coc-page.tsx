"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, LayoutGrid } from "lucide-react"

interface ProcCOCPageProps {
  onBack: () => void
}

export default function ProcCOCPage({ onBack }: ProcCOCPageProps) {
  const [activeSection, setActiveSection] = useState("po-details")
  const [collapsed, setCollapsed] = useState(false)

  const poDetailsRef = useRef<HTMLDivElement>(null)
  const milestoneRef = useRef<HTMLDivElement>(null)
  const supplierRef = useRef<HTMLDivElement>(null)
  const otherSesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      if (otherSesRef.current && scrollPosition >= otherSesRef.current.offsetTop) {
        setActiveSection("other-ses")
      } else if (supplierRef.current && scrollPosition >= supplierRef.current.offsetTop) {
        setActiveSection("supplier")
      } else if (milestoneRef.current && scrollPosition >= milestoneRef.current.offsetTop) {
        setActiveSection("milestone")
      } else {
        setActiveSection("po-details")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const refs = {
      "po-details": poDetailsRef,
      milestone: milestoneRef,
      supplier: supplierRef,
      "other-ses": otherSesRef,
    }
    const ref = refs[sectionId as keyof typeof refs]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white ml-20">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded" aria-label="Go back">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-green-700">Create RFP</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            Comments
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            Generate COC
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
                { id: "po-details", label: "PO details" },
                { id: "milestone", label: "Milestone / Delivery details" },
                { id: "supplier", label: "Supplier submissions / Evidences" },
                { id: "other-ses", label: "Other SES in PO" },
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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            {/* PO Details Section */}
            <div ref={poDetailsRef} className="space-y-6">
              <h2 className="text-xl font-semibold text-green-700">PO details</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">PO Reference Number</p>
                  <p className="text-sm font-semibold text-blue-600">PO-2025-014</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">PR Reference</p>
                  <p className="text-sm font-semibold text-blue-600">542345</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Supplier</p>
                  <p className="text-sm font-medium text-gray-900">Kaar Technologies</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Deadline</p>
                  <p className="text-sm text-gray-900">12-Jun-25</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Milestone</p>
                  <p className="text-sm text-gray-900">Delivery of furnitures</p>
                </div>
              </div>
            </div>

            {/* Milestone / Delivery Details Section */}
            <div ref={milestoneRef} className="space-y-6">
              <h3 className="text-xl font-semibold text-green-700">Milestone / Delivery details</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Milestone ID</p>
                  <p className="text-sm font-medium text-gray-900">M2</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Description</p>
                  <p className="text-sm font-medium text-gray-900">Delivery of Chair, Table & furnitures</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Schedule date</p>
                  <p className="text-sm font-medium text-gray-900">14-Mar-25 ((On-time))</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Amount</p>
                  <p className="text-sm font-medium text-gray-900">1,000,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Value (%)</p>
                  <p className="text-sm font-medium text-gray-900">60% of total PO</p>
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Attachments</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded">
                        <i className="ri-file-pdf-line text-white text-xl" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Purchase order</span>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center bg-red-500 rounded hover:bg-red-600">
                      <i className="ri-file-pdf-line text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded">
                        <i className="ri-file-pdf-line text-white text-xl" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">AMC agreement</span>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center bg-red-500 rounded hover:bg-red-600">
                      <i className="ri-file-pdf-line text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Submissions & Evidences Section */}
            <div ref={supplierRef} className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">Supplier submissions & evidences</h3>

              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2">Amount</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our team successfully delivered the furniture, including the chair, on October 19, 2025. The delivery
                  was completed on schedule without any delays.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Submitted by</p>
                  <p className="text-sm font-medium text-gray-900">Mohammed - Omran</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Submitted on</p>
                  <p className="text-sm font-medium text-gray-900">12-Jun-23</p>
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Attachments</h4>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900">Evidence (1)</h5>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                        <i className="ri-download-line mr-1" />
                        Download All
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                        <i className="ri-arrow-up-s-line text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead style={{ backgroundColor: "#1B733D" }}>
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-white">Attachment</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-white">Uploaded date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="border-b border-gray-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded">
                                <i className="ri-file-pdf-line text-white text-xl" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Invoice 1</p>
                                <p className="text-xs text-gray-500">6.5kb</p>
                              </div>
                              <button className="ml-2">
                                <i className="ri-download-line text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">02-Aug-2022</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900">Supporting documents (1)</h5>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                        <i className="ri-download-line mr-1" />
                        Download All
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                        <i className="ri-arrow-up-s-line text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead style={{ backgroundColor: "#1B733D" }}>
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-white">Attachment</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-white">Uploaded date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="border-b border-gray-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded">
                                <i className="ri-file-pdf-line text-white text-xl" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Invoice 1</p>
                                <p className="text-xs text-gray-500">6.5kb</p>
                              </div>
                              <button className="ml-2">
                                <i className="ri-download-line text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">02-Aug-2022</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Other SES in PO Section */}
            <div ref={otherSesRef} className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">Other SES in PO</h3>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#1B733D" }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Milestone</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Delivered on</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">D1</td>
                      <td className="px-6 py-4 text-sm text-gray-900">IT Infrastructure Setup</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                          Pcs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-green-700 hover:text-green-800 font-medium">View certificate</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">D2</td>
                      <td className="px-6 py-4 text-sm text-gray-900">Laptop</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                          Pcs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-green-700 hover:text-green-800 font-medium">View certificate</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
