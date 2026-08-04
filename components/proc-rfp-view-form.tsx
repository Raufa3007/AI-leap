"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Info, X, Send, Download, FileText, MessageSquare } from "lucide-react"

interface ProcRFPViewFormProps {
  rfpId: string
  onBack: () => void
}

export default function ProcRFPViewForm({ rfpId, onBack }: ProcRFPViewFormProps) {
  const [activeSection, setActiveSection] = useState("RFP Details")
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  const sections = [
    "RFP Details",
    "Scope Of Work",
    "Procurement Details",
    "Procurement Checklist",
    "Bill of Quantity",
    "Technical Committee Members",
    "Technical Requirements",
    "Technical Evaluation Criteria",
    "Vendor Evaluation Weightage",
    "Man Power",
    "Attachments",
  ]

  const vendors = [
    { id: 1, name: "Kaar technologies Private Limited", status: "Submitted", statusColor: "green" },
    { id: 2, name: "Wipro Limited", status: "Open", statusColor: "blue" },
    { id: 3, name: "TCS Private Limited", status: "Submitted", statusColor: "green" },
  ]

  const documentChecklist = [
    { type: "Financial Offer", fileName: "Financial Offer", size: "6.5kb" },
    { type: "Technical Offer", fileName: "Technical Offer", size: "6.5kb" },
    {
      type: "Proof of the establishments affiliation with the local small and medium enterprises category, if applicable",
      fileName: "Affiliation",
      size: "6.5kb",
    },
    { type: "Bank Guarantee", fileName: "Bank Guarantee", size: "6.5kb" },
    { type: "Commercial registration or Statutory licences", fileName: "Commercial Registration", size: "6.5kb" },
    { type: "Certificate of payment of zakat or tax or both", fileName: "Tax", size: "6.5kb" },
    { type: "Certificate of general organization for insurance", fileName: "Insurance", size: "6.5kb" },
    { type: "Certificate of affiliation with chamber of commerce", fileName: "Chamber Affiliation", size: "6.5kb" },
    {
      type: "Certificate of achieving the required percentage for Saudization for jobs",
      fileName: "Saudization",
      size: "6.5kb",
    },
    { type: "Others", fileName: "Licences", size: "6.5kb" },
  ]

  const comments = [
    {
      id: 1,
      author: "Mohamad Algasair",
      timestamp: "Yesterday, 2:10 pm",
      message: "Great Work, from RFP requestor. I recommend technical team to evaluate it better",
      isOwn: false,
      avatar: "/placeholder.svg?height=34&width=34",
    },
    {
      id: 2,
      author: "Khalood Alquidly",
      timestamp: "Today, 11:10 am",
      message: "Thanks for your Comments, I have reviewed it.",
      isOwn: true,
      avatar: "/placeholder.svg?height=34&width=34",
    },
  ]

  const billOfQuantityItems = [
    {
      materialGroup: "Electronics",
      itemName: "Laptop",
      quantity: 10,
      uom: "Count",
      price: "1,000,000",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Mouse",
      quantity: 10,
      uom: "Count",
      price: "1,000",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Hard disk",
      quantity: 2,
      uom: "Count",
      price: "10,000",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Extension box",
      quantity: 1,
      uom: "Count",
      price: "500",
      deliveryDate: "12/12/26",
    },
    {
      materialGroup: "Electronics",
      itemName: "Laptop",
      quantity: 10,
      uom: "Count",
      price: "1,020,000",
      deliveryDate: "12/12/26",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const sections = contentRef.current.querySelectorAll("[data-section]")
      let currentSection = "RFP Details"

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute("data-section") || "RFP Details"
        }
      })

      setActiveSection(currentSection)
    }

    const content = contentRef.current
    if (content) {
      content.addEventListener("scroll", handleScroll)
      return () => content.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("[v0] Sending comment:", commentText)
      setCommentText("")
    }
  }

  const scrollToSection = (section: string) => {
    setActiveSection(section)
    const element = document.querySelector(`[data-section="${section}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="flex h-screen bg-white relative">
      {/* Left Sidebar - Sections */}
      <div className="w-64 border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            Sections
            <button className="p-1 hover:bg-gray-100 rounded">
              <i className="ri-layout-grid-line text-gray-600" />
            </button>
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                activeSection === section
                  ? "bg-green-50 text-green-700 border-l-4 border-green-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-medium text-gray-900">View RFP</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Modify
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Proceed for evaluation
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-more-2-fill text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl">
            {/* RFP Details Section */}
            <div data-section="RFP Details" className="mb-12">
              <h2 className="text-lg font-medium text-gray-900 mb-6">RFP Details</h2>

              {/* RFP Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">RFP title *</label>
                <p className="text-2xl font-medium text-gray-900">Mobile Application for Government Services</p>
              </div>

              {/* RFP ID, Linked PR, Department */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    RFP ID (Auto Generated) <Info size={14} className="text-gray-400" />
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Category <Info size={14} className="text-gray-400" />
                  </label>
                  <p className="text-sm text-gray-900">Goods</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode of tender</label>
                  <p className="text-sm text-gray-900">Public</p>
                </div>
              </div>

              {/* Time lines */}
              <h3 className="text-base font-medium text-gray-900 mb-4 mt-8">Time lines</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bid closing date (RCD)</label>
                  <p className="text-sm text-gray-900">29 Oct 2025, 5:00 PM</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected award date</label>
                  <p className="text-sm text-gray-900">30 Dec 2025</p>
                </div>
              </div>

              {/* Scope of Work */}
              <h3 className="text-base font-medium text-gray-900 mb-4 mt-8">Scope of Work</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Develop a scalable application with user authentication, core features, admin panel, and third-party
                  integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                  (Hosting); estimated completion in 3-6 months.
                </p>
              </div>
            </div>

            {/* Vendors Section */}
            <div data-section="Vendors" className="mb-12">
              <h3 className="text-base font-medium text-gray-900 mb-4">Vendors</h3>

              {/* Weightage Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">60%</span>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">Technical Evaluation Weightage</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">40%</span>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">Financial Weightage</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">50%</span>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">Technical Evaluation Passing Percentage</p>
                </div>
              </div>

              {/* Vendors Table */}
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
                    {vendors.map((vendor, index) => (
                      <tr key={vendor.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{vendor.name}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                vendor.statusColor === "green"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {vendor.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() => setShowComments(true)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                            >
                              <MessageSquare size={20} style={{ color: "#1B733D" }} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() => setShowDocumentChecklist(true)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bill Of Quantity Section */}
            <div data-section="Bill of Quantity" className="mb-12">
              <h3 className="text-base font-medium text-gray-900 mb-4">Bill Of Quantity</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">SAR 15,000,000</p>
                  <p className="text-xs text-gray-500 mt-1">RFP Estimated Price (Without VAT)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">SAR 3,000,000</p>
                  <p className="text-xs text-gray-500 mt-1">VAT Amount</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">SAR 18,000,000</p>
                  <p className="text-xs text-gray-500 mt-1">RFP Estimated Price (With VAT)</p>
                </div>
              </div>

              <div className="overflow-x-auto mb-6">
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
                    {billOfQuantityItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.materialGroup}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.uom}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.price}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.deliveryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attachments Section */}
            <div data-section="Attachments" className="mb-12">
              <h3 className="text-base font-medium text-gray-900 mb-4">Attachments</h3>

              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Supporting documents (1)</h4>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download size={16} />
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
                          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                            <FileText size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Technical requirement</p>
                            <p className="text-xs text-gray-500">4 Kb</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">Mohammed Zubair</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">02-Aug-2022</span>
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                            <Download size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Checklist Sidebar */}
      {showDocumentChecklist && (
        <div className="fixed inset-y-0 right-0 w-[640px] bg-white shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Documents Check List</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Download All
              </button>
              <button
                onClick={() => setShowDocumentChecklist(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#1B733D" }}>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Type of Document</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {documentChecklist.map((doc, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-4 text-sm text-gray-900">{doc.type}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                            <FileText size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                          <Download size={20} className="text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comments Sidebar */}
      {showComments && (
        <div className="fixed inset-y-0 right-0 w-[640px] bg-gray-50 shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Comments</h2>
              <p className="text-xs text-gray-500 mt-1">All comments added in bid will be shown here.</p>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-900" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end gap-6">
            {comments.map((comment) => (
              <div key={comment.id} className={`flex gap-3 ${comment.isOwn ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex flex-col ${comment.isOwn ? "items-start" : "items-end"} flex-1 max-w-md`}>
                  <div className={`flex items-center gap-2 mb-1 ${comment.isOwn ? "flex-row" : "flex-row-reverse"}`}>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    <span className="text-xs font-medium text-gray-900">{comment.author}</span>
                  </div>
                  <div className={`px-4 py-3 rounded-lg ${comment.isOwn ? "bg-green-50" : "bg-white"} shadow-sm`}>
                    <p className="text-sm text-gray-900">{comment.message}</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  <img
                    src={comment.avatar || "/placeholder.svg"}
                    alt={comment.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="write your comments here .."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendComment()
                  }
                }}
              />
              <button
                onClick={handleSendComment}
                className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: "#1B733D" }}
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
