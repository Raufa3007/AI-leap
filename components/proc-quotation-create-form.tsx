"use client"

import { useState } from "react"
import { ArrowLeft, Info } from "lucide-react"

interface ProcQuotationCreateFormProps {
  quotationId: string
  onBack: () => void
  onSuccess: () => void
}

export default function ProcQuotationCreateForm({ quotationId, onBack, onSuccess }: ProcQuotationCreateFormProps) {
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

  const handleSubmit = () => {
    console.log("[v0] Quotation submitted")
    onSuccess()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Sections */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <span className="font-medium text-gray-700">Sections</span>
          <button className="ml-auto p-1 hover:bg-gray-100 rounded">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="p-2">
          <a
            href="#quotation-details"
            className="block px-3 py-2 text-sm font-medium rounded border-l-4 border-[#1B733D] bg-green-50 text-[#1B733D]"
          >
            Quotation Details
          </a>
          <a href="#scope" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded mt-1">
            Scope
          </a>
          <a href="#bill-of-quantity" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded mt-1">
            Bill Of Quantity
          </a>
          <a href="#vendors" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded mt-1">
            Choose vendors to invite
          </a>
          <a href="#attachments" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded mt-1">
            Attachments
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Create Quotation</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Save As Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Submit Quotation
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">
            {/* Quotation Details */}
            <section id="quotation-details" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quotation Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quotation title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={formData.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quotation ID (Auto Generated) <Info size={14} className="inline text-gray-400" />
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
                      defaultValue={formData.linkedRFP}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      defaultValue={formData.department}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent">
                      <option value="">Select Here</option>
                      <option value="goods">Goods</option>
                      <option value="services">Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode of tenor <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent">
                      <option value="">Select Here</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Time lines */}
            <section className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Time lines</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid closing date (RCD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected award date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Scope */}
            <section id="scope" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Scope</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={formData.purpose}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scope Of Work <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={formData.scopeOfWork}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Bill Of Quantity */}
            <section id="bill-of-quantity" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Bill Of Quantity</h2>

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
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "#1B733D" }}>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Material Group</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Item Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Units of Measure (UOM)</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Estimated Unit Price (without VAT)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Expected Delivery Date</th>
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
                      {
                        material: "Electronics",
                        item: "Extension box",
                        qty: 1,
                        uom: "Count",
                        price: "500",
                        date: "12/12/26",
                      },
                      {
                        material: "Electronics",
                        item: "Laptop",
                        qty: 10,
                        uom: "Count",
                        price: "1,020,000",
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
            </section>

            {/* Terms & Conditions */}
            <section className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Terms & Conditions <span className="text-red-500">*</span>
              </h2>
              <textarea
                rows={4}
                defaultValue={formData.termsAndConditions}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
              />
            </section>

            {/* Expected submissions */}
            <section className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Expected submissions <span className="text-red-500">*</span>
              </h2>
              <textarea
                rows={4}
                defaultValue={formData.expectedSubmissions}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
              />
            </section>

            {/* Choose vendors */}
            <section id="vendors" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Choose vendors to invite for Quotation</h2>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                  style={{ backgroundColor: "#1B733D" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Add vendor
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "#1B733D" }}>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">S. No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Vendor name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { no: 1, name: "Kaar Technologies Private Limited" },
                      { no: 2, name: "Aviation tech Private Limited" },
                      { no: 3, name: "Global tech" },
                    ].map((vendor) => (
                      <tr key={vendor.no} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">{vendor.no}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{vendor.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                  d="M11.333 2L14 4.667 5.333 13.333H2.667v-2.666L11.333 2z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                  d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Attachments */}
            <section id="attachments" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Attachments</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#E8F5E9" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                        stroke="#1B733D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Click or Drag file to this area to upload</p>
                  <p className="text-xs text-gray-500">Supports single or for bulk upload and Max file size is 15MB</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Supporting document (Uploaded by you)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#DC2626" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" fill="white" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Submission guidelines</p>
                      <p className="text-xs text-gray-500">4 Kb</p>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M17.5 12.5v3.333a1.667 1.667 0 01-1.667 1.667H4.167A1.667 1.667 0 012.5 15.833V12.5M14.167 8.333L10 4.167M10 4.167L5.833 8.333M10 4.167v10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-600 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M2.5 5h15M6.667 5V3.333a1.667 1.667 0 011.666-1.666h3.334a1.667 1.667 0 011.666 1.666V5m2.5 0v11.667a1.667 1.667 0 01-1.666 1.666H5.833a1.667 1.667 0 01-1.666-1.666V5h11.666z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#DC2626" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" fill="white" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Submission guidelines</p>
                      <p className="text-xs text-gray-500">6 Kb</p>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M17.5 12.5v3.333a1.667 1.667 0 01-1.667 1.667H4.167A1.667 1.667 0 012.5 15.833V12.5M14.167 8.333L10 4.167M10 4.167L5.833 8.333M10 4.167v10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-600 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M2.5 5h15M6.667 5V3.333a1.667 1.667 0 011.666-1.666h3.334a1.667 1.667 0 011.666 1.666V5m2.5 0v11.667a1.667 1.667 0 01-1.666 1.666H5.833a1.667 1.667 0 01-1.666-1.666V5h11.666z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
