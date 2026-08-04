"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Clock, MessageSquare, Upload, Download, Trash2 } from "lucide-react"
import { fetchPRDetails } from "@/app/actions/fetch-pr-details"

interface RFPData {
  id: string
  pr_number: string
  project_name_arabic: string
  department: string
  budget_code_cost_centre: string
  scope_of_work?: string
  purpose_and_justification?: string
  bill_of_quantity?: any[]
  preferred_vendors?: any[]
  technical_requirements?: string
  attachments?: any[]
  pr_status: string
  created_at: string
  requestor_name?: string
}

interface ProcRFPDetailsPageProps {
  rfpId?: string
  onBack?: () => void
}

export default function ProcRFPDetailsPage({ rfpId = "default", onBack }: ProcRFPDetailsPageProps) {
  const [rfp, setRfp] = useState<RFPData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    const loadRFP = async () => {
      try {
        const data = await fetchPRDetails(rfpId)

        if (data) {
          // Enhance the data with hardcoded values
          const enhancedData = {
            ...data,
            bill_of_quantity: [
              {
                material_group: "IT Hardware",
                item_name: "Laptop Dell XPS 15",
                quantity: "25",
                units_of_measure: "Units",
                estimated_unit_price: "4500",
                expected_delivery: "15 Days"
              },
              {
                material_group: "Software",
                item_name: "Microsoft Office 365",
                quantity: "50",
                units_of_measure: "Licenses",
                estimated_unit_price: "1200",
                expected_delivery: "7 Days"
              },
              {
                material_group: "Networking",
                item_name: "Cisco Switch 48-port",
                quantity: "5",
                units_of_measure: "Units",
                estimated_unit_price: "8500",
                expected_delivery: "21 Days"
              }
            ],
            preferred_vendors: [
              {
                vendor_name: "Kaar Technologies Private Limited",
                contact_person: "Rajesh Kumar",
                email: "rajesh.kumar@kaartech.com",
                phone: "+966-11-234-5678",
                status: "Submitted"
              },
              {
                vendor_name: "Wipro Limited",
                contact_person: "Priya Sharma",
                email: "priya.sharma@wipro.com",
                phone: "+966-11-345-6789",
                status: "Open"
              },
              {
                vendor_name: "TCS Private Limited",
                contact_person: "Amit Patel",
                email: "amit.patel@tcs.com",
                phone: "+966-11-456-7890",
                status: "Pending"
              }
            ],
            attachments: [
              {
                file_name: "Technical_Specifications.pdf",
                file_size: "2.4 MB"
              },
              {
                file_name: "Project_Timeline.docx",
                file_size: "1.1 MB"
              }
            ]
          }
          setRfp(enhancedData as RFPData)
        } else {
          setError("No RFP found")
        }
      } catch (err) {
        console.error("[v0] Error:", err)
        setError("An error occurred while loading RFP data")
      } finally {
        setLoading(false)
      }
    }

    loadRFP()
  }, [rfpId])

  const calculatePricingTotals = () => {
    if (!rfp?.bill_of_quantity || rfp.bill_of_quantity.length === 0) {
      return { totalWithoutVAT: 228500, totalVAT: 34275, totalWithVAT: 262775 }
    }

    const totalWithoutVAT = rfp.bill_of_quantity.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.estimated_unit_price || 0)
      const quantity = Number.parseFloat(item.quantity || 0)
      return sum + price * quantity
    }, 0)

    const totalVAT = totalWithoutVAT * 0.15
    const totalWithVAT = totalWithoutVAT + totalVAT

    return { totalWithoutVAT, totalVAT, totalWithVAT }
  }

  const { totalWithoutVAT, totalVAT, totalWithVAT } = calculatePricingTotals()

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[v0] Sending comment:", commentText)
      setCommentText("")
      setShowCommentsModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RFP details...</p>
        </div>
      </div>
    )
  }

  if (error || !rfp) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "RFP not found"}</p>
          <button onClick={onBack} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
              {rfp.pr_number || "RFP-2024-001"}
            </h1>
            <button 
              onClick={() => setShowCommentsModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Clock size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View RFP
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Create RFI
            </button>
            <button
              className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Publish RFP
            </button>
          </div>
        </div>

        {/* RFP Details Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">RFP Details</h2>
          {rfp.project_name_arabic && (
            <p className="text-lg font-medium text-gray-900 mb-6 text-right" style={{ direction: "rtl" }}>
              {rfp.project_name_arabic || "نظام إدارة المشتريات الذكي"}
            </p>
          )}

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Department</p>
              <p className="text-sm font-medium text-gray-900">{rfp.department || "IT Department"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Cost Centre</p>
              <p className="text-sm font-medium text-gray-900">{rfp.budget_code_cost_centre || "CC-IT-2024"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2">Requestor</p>
              <p className="text-sm font-medium text-gray-900">{rfp.requestor_name || "Ahmed Al-Saud"}</p>
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        {rfp.scope_of_work && (
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Scope of Work</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {rfp.scope_of_work || "Implementation of enterprise resource planning system including hardware procurement, software licensing, and professional services for system integration and customization."}
            </p>
          </div>
        )}

        {rfp.bill_of_quantity && rfp.bill_of_quantity.length > 0 && (
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Line Items</h2>

            {/* Pricing Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 font-medium mb-2">RFP Estimated Price (Without VAT)</p>
                <p className="text-xl font-bold text-blue-600">
                  SAR {totalWithoutVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg border border-orange-100">
                <p className="text-xs text-gray-600 font-medium mb-2">VAT Amount (15%)</p>
                <p className="text-xl font-bold text-orange-600">
                  SAR {totalVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
                <p className="text-xs text-gray-600 font-medium mb-2">RFP Estimated Price (With VAT)</p>
                <p className="text-xl font-bold" style={{ color: "#1B733D" }}>
                  SAR {totalWithVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#1B733D" }}>
                    <th className="px-4 py-3 text-left text-white font-semibold">Material Group</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Item Name</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Quantity</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Units of Measure (UOM)</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Estimated Unit Price (without VAT)</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Expected Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {rfp.bill_of_quantity.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.material_group || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.item_name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.quantity || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.units_of_measure || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.estimated_unit_price
                          ? `SAR ${Number.parseFloat(item.estimated_unit_price).toLocaleString()}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.expected_delivery || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Preferred Vendors Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">PREFERRED VENDORS</h2>
          {rfp.preferred_vendors && rfp.preferred_vendors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#1B733D" }}>
                    <th className="px-4 py-3 text-left text-white font-semibold">S. No</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Vendor Name</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Contact Person</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rfp.preferred_vendors.map((vendor: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{vendor.vendor_name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{vendor.contact_person || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{vendor.email || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{vendor.phone || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor:
                              vendor.status === "Submitted"
                                ? "#D1FAE5"
                                : vendor.status === "Open"
                                  ? "#FEF3C7"
                                  : "#F3E8E8",
                            color:
                              vendor.status === "Submitted"
                                ? "#065F46"
                                : vendor.status === "Open"
                                  ? "#92400E"
                                  : "#7F1D1D",
                          }}
                        >
                          {vendor.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="pb-6">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Attachments</h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <Upload className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-700 font-medium mb-1">Click or Drag file to this area to upload</p>
            <p className="text-xs text-gray-500">Supports single or for bulk upload and Max file size is 15MB</p>
          </div>

          {/* Supporting Documents */}
          {rfp.attachments && rfp.attachments.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Supporting document (Uploaded by you)</p>
              <div className="space-y-2">
                {rfp.attachments.map((attachment: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">PDF</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.file_name || "Document"}</p>
                        <p className="text-xs text-gray-500">{attachment.file_size || "Unknown size"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                        <Download size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowCommentsModal(false)} />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl"
            style={{
              animation: "slideInRight 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold" style={{ color: "#000525" }}>
                  Comments
                </h3>
                <p className="text-sm mt-1" style={{ color: "#5F6C81" }}>
                  All comments added for this PR will be shown here
                </p>
              </div>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex flex-col items-end">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="flex-1">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-xs" style={{ color: "#5F6C81" }}>
                          Yesterday, 4:30 PM
                        </span>
                        <span className="text-xs font-medium" style={{ color: "#000525" }}>
                          Arbel Zaidel (Procurement manager)
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm" style={{ color: "#000525" }}>
                          Can you define timeline for each deliverables ?
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
                    >
                      AZ
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Mark Siegelman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: "#000525" }}>
                        Mark Siegelman (Requestor)
                      </span>
                      <span className="text-xs" style={{ color: "#5F6C81" }}>
                        Today, 10:00 AM
                      </span>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: "#E8F5E9" }}>
                      <p className="text-sm" style={{ color: "#000525" }}>
                        Sure Arbel, Will add & resubmit the proposal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="write your comments here ..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  style={{ color: "#000525" }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendComment()
                    }
                  }}
                />
                <button
                  onClick={handleSendComment}
                  className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors flex items-center gap-2"
                  style={{ backgroundColor: "#1B733D" }}
                >
                  <i className="ri-send-plane-fill text-lg" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
