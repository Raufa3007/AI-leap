"use client"

import { useState } from "react"
import { ChevronLeft, Upload, Plus, Trash2, Check, X } from "lucide-react"

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
}

interface ConfirmationState {
  isOpen: boolean
  message: string
}

interface SuccessState {
  isOpen: boolean
  message: string
}

export default function ProcRFIForm({ rfiId, onBack, onSuccess }: RFIFormProps) {
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
    },
    {
      id: "2",
      name: "Aviation tech Private Limited",
      crNumber: "7890902345",
      companyType: "service provider",
      primaryContact: "John Doe",
      email: "john@wipro.com",
      contactNumber: "3984791742",
    },
    {
      id: "3",
      name: "Global tech",
      crNumber: "7890902346",
      companyType: "service provider",
      primaryContact: "Jane Smith",
      email: "jane@tcs.com",
      contactNumber: "3984791743",
    },
  ])
  const [priority, setPriority] = useState("high")
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, message: "" })
  const [success, setSuccess] = useState<SuccessState>({ isOpen: false, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSend = async () => {
    setConfirmation({
      isOpen: true,
      message: "Are you sure to send it to all suppliers?",
    })
  }

  const handleConfirmSend = async () => {
    setConfirmation({ isOpen: false, message: "" })
    setIsSubmitting(true)

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSuccess({
      isOpen: true,
      message: "RFI sent successfully",
    })

    setTimeout(() => {
      setSuccess({ isOpen: false, message: "" })
      onSuccess?.()
      onBack()
    }, 2000)
  }

  const handleRemoveVendor = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id))
  }

  const handleAddVendor = () => {
    const newVendor: Vendor = {
      id: String(vendors.length + 1),
      name: "New Vendor",
    }
    setVendors([...vendors, newVendor])
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Removed section navigation */}
      <div className="w-64 border-r border-gray-200 p-6 overflow-y-auto scrollbar-hide bg-white">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sections</h3>
        <nav className="space-y-2">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="px-4 py-2 text-gray-700 font-medium">Basic info</div>
            <div className="px-4 py-2 text-gray-600">Scope Of Work</div>
            <div className="px-4 py-2 text-gray-600">Expected Deliverables</div>
            <div className="px-4 py-2 text-gray-600">Response Deadline</div>
            <div className="px-4 py-2 text-gray-600">Priority</div>
            <div className="px-4 py-2 text-gray-600">Attachments</div>
            <div className="px-4 py-2 text-gray-600">Choose vendors</div>
          </div>
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Request for information for {rfiId}</h2>
          </div>
          <button
            onClick={handleSend}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? "Sending..." : "Send"}</span>
          </button>
        </div>

        {/* Content Area - All sections visible on single page */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-6">
          <div className="max-w-4xl space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-green-700 mb-6">Basic info</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Scope of Work Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-green-700 mb-6">SOW</h3>
              <textarea
                value={scopeOfWork}
                onChange={(e) => setScopeOfWork(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Expected Deliverables Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-green-700 mb-6">Expected Deliverables</h3>
              <textarea
                value={expectedDeliverables}
                onChange={(e) => setExpectedDeliverables(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Response Deadline Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-green-700 mb-6">Response Deadline</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Start Date</label>
                <input
                  type="date"
                  value={responseDeadline}
                  onChange={(e) => setResponseDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Priority Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-green-700 mb-6">Priority</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "low", label: "Low", description: "The low priority is nothing but a deadline" },
                  { value: "medium", label: "Medium", description: "The low priority is nothing but a deadline" },
                  { value: "high", label: "High", description: "The low priority is nothing but a deadline" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      priority === option.value
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={priority === option.value}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className={`font-medium ${option.value === "medium" ? "text-orange-600" : ""}`}>
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-green-700 mb-6">Attachments</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Click or Drag file to this area to upload</p>
                <p className="text-xs text-gray-500">Supports single or for bulk upload and Max file size is 15MB</p>
              </div>
            </div>

            {/* Choose Vendors Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-green-700">Choose vendors to invite for Quotation</h3>
                <button
                  onClick={handleAddVendor}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add vendor
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="px-4 py-3 text-left text-sm font-semibold">S. No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Vendor name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor, idx) => (
                      <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{vendor.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">✏️</button>
                          <button
                            onClick={() => handleRemoveVendor(vendor.id)}
                            className="p-2 text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
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
