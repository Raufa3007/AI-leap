"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Download, CheckCircle, X } from "lucide-react"

interface SupplierData {
  id: string
  company_name: string
  business_type: string
  country_of_operation: string
  cr_number: string
  cr_issue_date: string
  date_of_incorporation: string
  company_address_line1: string
  company_address_line2: string
  company_city: string
  company_postal_code: string
  industries_served: string
  product_service_1_category: string
  product_service_1_description: string
  differentiators: string
  portfolio_files: any
  number_of_employees: string
  office_locations: string
  annual_turnover: string
  capacity_to_deliver: string
  existing_clients: string
  status: string
}

interface ProcSupplierDetailsPageProps {
  companyName?: string
  supplierId?: string
  onBack?: () => void
  isInline?: boolean
}

export default function ProcSupplierDetailsPage({
  companyName = "",
  supplierId = "",
  onBack,
  isInline = false,
}: ProcSupplierDetailsPageProps) {
  const [supplier, setSupplier] = useState<SupplierData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectComment, setRejectComment] = useState("")

  const nameToFetch = companyName || supplierId

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!nameToFetch) {
        setError("No company name provided")
        setLoading(false)
        return
      }

      try {
        console.log("[v0] Fetching supplier details for:", nameToFetch)

        const response = await fetch(`/api/suppliers/${encodeURIComponent(nameToFetch)}`)

        if (!response.ok) {
          console.error("[v0] Error response:", response.status)
          setError("Failed to load supplier data")
          setLoading(false)
          return
        }

        const { supplier: supplierData } = await response.json()

        if (supplierData) {
          console.log("[v0] Supplier loaded:", supplierData.company_name)
          setSupplier(supplierData)
        } else {
          setError("No supplier found")
        }
      } catch (err) {
        console.error("[v0] Error fetching supplier:", err)
        setError("An error occurred while loading supplier data")
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [nameToFetch])

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white" style={{ minHeight: isInline ? "400px" : "100%" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supplier details...</p>
        </div>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="flex items-center justify-center bg-white" style={{ minHeight: isInline ? "400px" : "100%" }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Supplier not found"}</p>
          {onBack && (
            <button onClick={onBack} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {!isInline && onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
              Verify & approve new supplier
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reject supplier
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Approve supplier
            </button>
          </div>
        </div>

        {/* Company Information */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Company Information</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Legal company name</p>
              <p className="text-sm font-medium text-gray-900">{supplier.company_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Business type</p>
              <p className="text-sm font-medium text-gray-900">{supplier.business_type || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Country of operation</p>
              <p className="text-sm font-medium text-gray-900">{supplier.country_of_operation || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Date of incorporation:</p>
              <p className="text-sm font-medium text-gray-900">
                {supplier.date_of_incorporation ? new Date(supplier.date_of_incorporation).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">CR number</p>
              <p className="text-sm font-medium text-gray-900">{supplier.cr_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">CR issue date</p>
              <p className="text-sm font-medium text-gray-900">
                {supplier.cr_issue_date ? new Date(supplier.cr_issue_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Company address</p>
              <p className="text-sm font-medium text-gray-900">
                {supplier.company_address_line1 || "N/A"}
                {supplier.company_address_line2 && `, ${supplier.company_address_line2}`}
              </p>
            </div>
          </div>
        </div>

        {/* Products & Services */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Products & Services</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Industries served</p>
              <p className="text-sm font-medium text-gray-900">{supplier.industries_served || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Primary Product/Service Category</p>
              <p className="text-sm font-medium text-gray-900">{supplier.product_service_1_category || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Brief Description</p>
              <p className="text-sm font-medium text-gray-900">{supplier.product_service_1_description || "N/A"}</p>
            </div>
          </div>

          {supplier.differentiators && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-normal mb-3">Product/Service differentiators:</p>
              <ul className="list-disc list-inside space-y-2">
                {supplier.differentiators.split("\n").map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {supplier.portfolio_files && (
            <div>
              <p className="text-xs text-gray-500 font-normal mb-3">Portfolio</p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg w-fit">
                <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                  <i className="ri-file-pdf-line text-white text-lg" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Portfolio Document</p>
                  <p className="text-xs text-gray-500">6.5kb</p>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                  <Download size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Business Capability & Operations */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Business Capability & Operations</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Number of Employees</p>
              <p className="text-sm font-medium text-gray-900">{supplier.number_of_employees || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Office locations</p>
              <p className="text-sm font-medium text-gray-900">{supplier.office_locations || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Annual Turnover</p>
              <p className="text-sm font-medium text-gray-900">{supplier.annual_turnover || "N/A"}</p>
            </div>
          </div>

          {supplier.capacity_to_deliver && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-normal mb-3">Capacity to Deliver:</p>
              <ul className="list-disc list-inside space-y-2">
                {supplier.capacity_to_deliver.split("\n").map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {supplier.existing_clients && (
            <div>
              <p className="text-xs text-gray-500 font-normal mb-3">Existing Clients or References:</p>
              <ul className="list-disc list-inside space-y-2">
                {supplier.existing_clients.split("\n").map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Approve Success Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4 w-80">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E6F4EC" }}>
              <CheckCircle size={36} style={{ color: "#1B733D" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Supplier Approved</h2>
            <p className="text-sm text-gray-500 text-center">The supplier has been successfully approved.</p>
            <button
              onClick={() => setShowApproveModal(false)}
              className="mt-2 px-8 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Reject Comment Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Reject Supplier</h2>
              <button onClick={() => { setShowRejectModal(false); setRejectComment("") }} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this supplier.</p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: "#1B733D" } as any}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #1B733D40")}
              onBlur={(e) => (e.target.style.boxShadow = "")}
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowRejectModal(false); setRejectComment("") }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowRejectModal(false); setRejectComment("") }}
                disabled={!rejectComment.trim()}
                className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                style={{ backgroundColor: "#1B733D" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
