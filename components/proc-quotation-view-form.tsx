"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

interface ProcQuotationViewFormProps {
  quotationId: string
  onBack: () => void
}

export default function ProcQuotationViewForm({ quotationId, onBack }: ProcQuotationViewFormProps) {
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const documents = [
    { type: "Financial Offer", name: "Financial Offer", size: "6.5kb" },
    { type: "Technical Offer", name: "Technical Offer", size: "6.5kb" },
    {
      type: "Proof of the establishments affiliation with the local small and medium enterprises category, if applicable",
      name: "Affiliation",
      size: "6.5kb",
    },
    { type: "Bank Guarantee", name: "Bank Guarantee", size: "6.5kb" },
    { type: "Commercial registration or Statutory licences", name: "Commercial Registration", size: "6.5kb" },
    { type: "Certificate of payment of zakat or tax or both", name: "Tax", size: "6.5kb" },
    { type: "Certificate of general organization for insurance", name: "Insurance", size: "6.5kb" },
    { type: "Certificate of affiliation with chamber of commerce", name: "Chamber Affiliation", size: "6.5kb" },
    {
      type: "Certificate of achieving the required percentage for Saudization for jobs",
      name: "Saudization",
      size: "6.5kb",
    },
    { type: "Others", name: "Licences", size: "6.5kb" },
  ]

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
            Scope Of Work
          </a>
          <a href="#vendors" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded mt-1">
            Vendors
          </a>
          <a href="#bill-of-quantity" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded mt-1">
            Bill of Quantity
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Modify
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Proceed for evalation
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">
            {/* Quotation Details */}
            <section id="quotation-details" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quotation Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quotation title</label>
                  <p className="text-base text-gray-900" style={{ fontSize: "18px", fontWeight: 500 }}>
                    تطبيق الهاتف المحمول للخدمات الحكومية
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quotation ID (Auto Generated)
                    </label>
                    <p className="text-sm text-gray-900">34334</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Linked PR</label>
                    <p className="text-sm text-gray-900">32425</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <p className="text-sm text-gray-900">Kaasparc Admin</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <p className="text-sm text-gray-900">Goods</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode of tender</label>
                    <p className="text-sm text-gray-900">Public</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Time lines */}
            <section className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Time lines</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bid closing date (RCD)</label>
                  <p className="text-sm text-gray-900">29 Oct 2025, 5:00 PM</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected award date</label>
                  <p className="text-sm text-gray-900">30 Dec 2025</p>
                </div>
              </div>
            </section>

            {/* Scope of Work */}
            <section id="scope" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Scope of Work</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Develop a scalable application with user authentication, core features, admin panel, and third-party
                    integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                    (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                    maintenance; payment structured in milestones.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scope Of Work</label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Develop a scalable application with user authentication, core features, admin panel, and third-party
                    integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                    (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                    maintenance; payment structured in milestones.
                  </p>
                </div>
              </div>
            </section>

            {/* Vendors */}
            <section id="vendors" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Vendors</h2>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">60%</span>
                  <span className="text-sm text-gray-600">Technical Evaluation Weightage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">40%</span>
                  <span className="text-sm text-gray-600">Financial Weightage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">50%</span>
                  <span className="text-sm text-gray-600">Technical Evaluation Passing Percentage</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "#1B733D" }}>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Price Ranking</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Vendor Name</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-white">Comments</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-white">Documents Checklist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, name: "Kaar technologies Private Limited", status: "Submitted" },
                      { rank: 2, name: "Wipro Limited", status: "Open" },
                      { rank: 3, name: "TCS Private Limited", status: "Submitted" },
                    ].map((vendor) => (
                      <tr key={vendor.rank} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">{vendor.rank}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{vendor.name}</span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${vendor.status === "Submitted" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                            >
                              {vendor.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setShowComments(true)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path
                                d="M2 10c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8a7.96 7.96 0 01-4.472-1.362L2 18l1.362-3.528A7.96 7.96 0 012 10z"
                                stroke="#1B733D"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="10" cy="10" r="1" fill="#1B733D" />
                              <circle cx="6" cy="10" r="1" fill="#1B733D" />
                              <circle cx="14" cy="10" r="1" fill="#1B733D" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setShowDocumentChecklist(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Develop a scalable application with user authentication, core features, admin panel, and third-party
                    integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                    (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                    maintenance; payment structured in milestones.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected submissions</label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Develop a scalable application with user authentication, core features, admin panel, and third-party
                    integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                    (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                    maintenance; payment structured in milestones.
                  </p>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section id="attachments" className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Supporting documents (1)</p>
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M11.333 6.667L8 3.333M8 3.333L4.667 6.667M8 3.333v8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: "#1B733D" }}>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Attachment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Uploaded by</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Uploaded date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#DC2626" }}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5 2h6l3 3v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" fill="white" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Technical requirement</p>
                              <p className="text-xs text-gray-500">4 Kb</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">Mohammed Zubair</td>
                        <td className="px-4 py-3 text-sm text-gray-700">02-Aug-2022</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
