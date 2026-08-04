"use client"

import { useState } from "react"
import { ArrowLeft, Download } from "lucide-react"

interface ProcRFIDetailsProps {
  rfiId: string
  onBack: () => void
  onViewRFI: () => void
}

const mockVendors = [
  { id: "1", vendor_name: "Kaar technologies Private Limited", status: "submitted" },
  { id: "2", vendor_name: "Wipro Limited", status: "open" },
  { id: "3", vendor_name: "TCS Private Limited", status: "submitted" },
]

export default function ProcRFIDetails({ rfiId, onBack, onViewRFI }: ProcRFIDetailsProps) {
  const [activeSection, setActiveSection] = useState("basic-info")

  const sections = [
    { id: "basic-info", label: "Basic info" },
    { id: "scope-of-work", label: "Scope Of Work" },
    { id: "expected-deliverables", label: "Expected Deliverables" },
    { id: "response-deadline", label: "Response Deadline" },
    { id: "priority", label: "Priority" },
    { id: "attachments", label: "Attachments" },
    { id: "add-suppliers", label: "Add suppliers" },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Sections */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <ArrowLeft size={20} style={{ color: "#1B733D" }} />
            </button>
            <h2 className="text-sm font-medium text-gray-900">Request for information for PR_121314</h2>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">Sections</span>
            <button className="ml-auto p-1 hover:bg-gray-100 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>

          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-green-50 text-green-700 font-medium border-l-4 border-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeSection === "basic-info" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Basic info</h2>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">تطبيق الهاتف المحمول للخدمات الحكومية</h3>

            <div className="mb-8">
              <h4 className="text-base font-bold text-gray-900 mb-4">Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                The Leadership Development Training Program will be designed to build and strengthen leadership
                capabilities across the organization by focusing on key competencies such as strategic thinking,
                communication, decision-making, people management, and change leadership. The program will be delivered
                through interactive training sessions, workshops, case studies, and digital learning resources, ensuring
                both knowledge building and practical application.
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-base font-bold text-gray-900 mb-4">SOW</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                Success will be measured through participant feedback, leadership assessments, and observable
                improvements in team performance, ultimately driving stronger leadership effectiveness and
                organizational growth.
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-base font-bold text-gray-900 mb-4">Expected Deliverables</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                The program will be delivered through interactive training sessions, workshops, case studies, and
                digital learning resources, ensuring both knowledge building and practical application. Targeted at
                mid-level managers, emerging leaders, and high-potential employees, the program will run over [insert
                duration] in a blended format of classroom/virtual learning and on-the-job practice. Success will be
                measured through participant feedback, leadership assessments, and observable improvements in team
                performance, ultimately driving stronger leadership effectiveness and organizational growth.
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-base font-bold text-gray-900 mb-4">Response Deadline</h4>
              <p className="text-sm text-gray-900">29/10/2025</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-gray-900">Choose vendors to invite for Information</h4>
                <button
                  onClick={onViewRFI}
                  className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "#1B733D" }}
                >
                  View RFI
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-green-700 text-white">
                  <div className="grid grid-cols-12 gap-4 px-6 py-3">
                    <div className="col-span-1 text-sm font-medium">S. No</div>
                    <div className="col-span-9 text-sm font-medium">Vendor name</div>
                    <div className="col-span-2 text-sm font-medium text-right">Action</div>
                  </div>
                </div>
                {mockVendors.map((vendor, index) => (
                  <div key={vendor.id} className="border-t border-gray-200">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                      <div className="col-span-1 text-sm text-gray-900">{index + 1}</div>
                      <div className="col-span-9 text-sm text-gray-900">{vendor.vendor_name}</div>
                      <div className="col-span-2 flex items-center justify-end gap-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            vendor.status === "submitted" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {vendor.status === "submitted" ? "Submitted" : "Open"}
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600">
                            <path
                              d="M3 6h14M3 10h14M3 14h14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-base font-bold text-gray-900 mb-4">Priority</h4>
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <p className="text-sm font-medium text-red-700 mb-1">High</p>
                <p className="text-xs text-red-600">The low priority is nothing but a deadline</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-gray-900">Attachments</h4>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Supporting documents (1)</span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                      <Download size={16} />
                      Download All
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                        <path d="M4 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-green-700 text-white">
                    <div className="grid grid-cols-3 gap-4 px-6 py-3">
                      <div className="text-sm font-medium">Attachment</div>
                      <div className="text-sm font-medium">Uploaded by</div>
                      <div className="text-sm font-medium">Uploaded date</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                            <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">MOM</p>
                          <p className="text-xs text-gray-500">4.4kb</p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-900">Mohammed Zubair</div>
                      <div className="text-sm text-gray-900">02-Aug-2022</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection !== "basic-info" && (
          <div className="text-center text-gray-500 py-12">
            <p>Content for {sections.find((s) => s.id === activeSection)?.label} section</p>
          </div>
        )}
      </div>
    </div>
  )
}
