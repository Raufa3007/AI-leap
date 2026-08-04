"use client"

import { useState } from "react"
import { ChevronLeft, Download, X } from "lucide-react"

interface Vendor {
  id: number
  name: string
  status: "Submitted" | "Open"
}

interface Attachment {
  name: string
  uploadedBy: string
  uploadedDate: string
}

interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmSendDialog({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure to send it to all suppliers?</h3>
        <p className="text-gray-600 text-sm mb-6">
          If yes, this RFI will be sent automatically to all vendors mapped to the selected service category.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            style={{ backgroundColor: "#1B733D" }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

interface SuccessToastProps {
  isVisible: boolean
}

function SuccessToast({ isVisible }: SuccessToastProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-gray-900 font-medium">RFI sent successfully</span>
      <button className="text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>
    </div>
  )
}

interface ProcRfiDetailViewProps {
  rfiId: string
  onBack: () => void
}

export default function ProcRfiDetailView({ rfiId, onBack }: ProcRfiDetailViewProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const vendors: Vendor[] = [
    { id: 1, name: "Kaar technologies Private Limited", status: "Submitted" },
    { id: 2, name: "Wipro Limited", status: "Open" },
    { id: 3, name: "TCS Private Limited", status: "Submitted" },
  ]

  const attachments: Attachment[] = [{ name: "MOM", uploadedBy: "Mohammed Zubair", uploadedDate: "02-Aug-2022" }]

  const handleSendClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSend = () => {
    setShowConfirmDialog(false)
    setShowSuccessToast(true)
    setTimeout(() => {
      onBack()
    }, 2000)
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Request for information for {rfiId}</h1>
        </div>
        <button
          onClick={handleSendClick}
          className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
          style={{ backgroundColor: "#1B733D" }}
        >
          Send
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Sections</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {[
                "Basic info",
                "Scope Of Work",
                "Expected Deliverables",
                "Response Deadline",
                "Priority",
                "Attachments",
                "Add suppliers",
              ].map((section) => (
                <button
                  key={section}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    section === "Basic info"
                      ? "bg-green-50 text-green-700 border-l-4 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={section === "Basic info" ? { borderLeftColor: "#1B733D", color: "#1B733D" } : {}}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="p-8 max-w-4xl">
            {/* Basic Info Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B733D" }}>
                Basic info
              </h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">تطبيق الهاتف المحمول للخدمات الحكومية</h3>
                  <p className="text-gray-600 text-sm">Title</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    The Leadership Development Training Program will be designed to build and strengthen leadership
                    capabilities across the organization by focusing on key competencies such as strategic thinking,
                    communication, decision-making, people management, and change leadership. The program will be
                    delivered through interactive training sessions, workshops, case studies, and digital learning
                    resources, ensuring both knowledge building and practical application.
                  </p>
                </div>
              </div>
            </div>

            {/* SOW Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B733D" }}>
                SOW
              </h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run
                  over [insert duration] in a blended format of classroom/virtual learning and on-the-job practice.
                  Success will be measured through participant feedback, leadership assessments, and observable
                  improvements in team performance, ultimately driving stronger leadership effectiveness and
                  organizational growth.
                </p>
              </div>
            </div>

            {/* Expected Deliverables Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B733D" }}>
                Expected Deliverables
              </h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">
                  The program will be delivered through interactive training sessions, workshops, case studies, and
                  digital learning resources, ensuring both knowledge building and practical application. Targeted at
                  mid-level managers, emerging leaders, and high-potential employees, the program will run over [insert
                  duration] in a blended format of classroom/virtual learning and on-the-job practice. Success will be
                  measured through participant feedback, leadership assessments, and observable improvements in team
                  performance, ultimately driving stronger leadership effectiveness and organizational growth.
                </p>
              </div>
            </div>

            {/* Response Deadline Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B733D" }}>
                Response Deadline
              </h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 font-semibold">29/10/2025</p>
              </div>
            </div>

            {/* Choose Vendors Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: "#1B733D" }}>
                  Choose vendors to invite for Information
                </h2>
                <button
                  className="px-4 py-2 text-white rounded-lg font-medium text-sm hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "#1B733D" }}
                >
                  View RFI
                </button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-white" style={{ backgroundColor: "#1B733D" }}>
                      <th className="px-6 py-3 text-left text-sm font-semibold">S. No</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Vendor name</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{vendor.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{vendor.name}</td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-sm font-medium ${vendor.status === "Submitted" ? "text-green-600" : "text-blue-600"}`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Priority Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B733D" }}>
                Priority
              </h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-600">High</p>
                    <p className="text-sm text-gray-600">The low priority is nothing but a deadline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B733D" }}>
                Attachments
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Supporting documents (1)</h3>
                  <button
                    className="flex items-center gap-2 font-medium text-sm hover:opacity-80 transition-colors"
                    style={{ color: "#1B733D" }}
                  >
                    <Download size={16} />
                    Download All
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-white" style={{ backgroundColor: "#1B733D" }}>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Attachment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Uploaded by</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Uploaded date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attachments.map((attachment, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                              <span className="text-red-600 font-bold text-xs">M</span>
                            </div>
                            <span className="text-sm text-gray-900">{attachment.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{attachment.uploadedBy}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{attachment.uploadedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs and Toasts */}
      <ConfirmSendDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmSend}
        onCancel={() => setShowConfirmDialog(false)}
      />
      <SuccessToast isVisible={showSuccessToast} />
    </div>
  )
}
