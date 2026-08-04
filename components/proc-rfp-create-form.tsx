"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Info, Download, FileText, Upload, Edit2, Trash2, Plus } from "lucide-react"

interface ProcRFPCreateFormProps {
  rfpId: string
  onBack: () => void
  onSuccess: () => void
}

export default function ProcRFPCreateForm({ rfpId, onBack, onSuccess }: ProcRFPCreateFormProps) {
  const [activeSection, setActiveSection] = useState("RFP Details")
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    rfpTitle: "Leadership training program",
    rfpId: "34534",
    linkedPR: "32425",
    department: "Kaasparc Admin",
    category: "",
    modeOfTenor: "",
    bidClosingDate: "",
    expectedAwardDate: "",
    purpose:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    scopeOfWork:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    termsAndConditions:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    expectedSubmissions:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
  })

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

  const [vendors, setVendors] = useState([
    { id: 1, name: "Kaar Technologies Private Limited" },
    { id: 2, name: "Aviation tech Private Limited" },
    { id: 3, name: "Global tech" },
  ])

  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: 1, name: "Submission guidelines", size: "4 Kb" },
    { id: 2, name: "Submission guidelines", size: "6 Kb" },
  ])

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

  const handleSubmit = () => {
    console.log("[v0] Submitting RFP form")
    onSuccess()
  }

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
            <h1 className="text-lg font-medium text-gray-900">Create RFP</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <i className="ri-save-line" />
              Save As Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#1B733D" }}
            >
              Submit RFP
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            {/* RFP Details Section */}
            <div data-section="RFP Details" className="mb-12">
              <h2 className="text-lg font-medium text-gray-900 mb-6">RFP Details</h2>

              {/* RFP Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFP title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.rfpTitle}
                  onChange={(e) => setFormData({ ...formData, rfpTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* RFP ID, Linked PR, Department */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    RFP ID (Auto Generated) <Info size={14} className="text-gray-400" />
                  </label>
                  <input
                    type="text"
                    defaultValue={formData.rfpId}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Linked PR</label>
                  <input
                    type="text"
                    defaultValue={formData.linkedPR}
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
                  >
                    <option value="">Select Here</option>
                    <option value="Goods">Goods</option>
                    <option value="Services">Services</option>
                    <option value="Works">Works</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode of tenor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.modeOfTenor}
                    onChange={(e) => setFormData({ ...formData, modeOfTenor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
                  >
                    <option value="">Select Here</option>
                    <option value="Public">Public</option>
                    <option value="Limited">Limited</option>
                    <option value="Direct">Direct</option>
                  </select>
                </div>
              </div>

              {/* Time lines */}
              <h3 className="text-base font-medium text-gray-900 mb-4 mt-8">Time lines</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid closing date (RCD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bidClosingDate}
                    onChange={(e) => setFormData({ ...formData, bidClosingDate: e.target.value })}
                    placeholder="Select Date and time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected award date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expectedAwardDate}
                    onChange={(e) => setFormData({ ...formData, expectedAwardDate: e.target.value })}
                    placeholder="Select Date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
                  />
                </div>
              </div>

              {/* Scope */}
              <h3 className="text-base font-medium text-gray-900 mb-4 mt-8">Scope</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope Of Work <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.scopeOfWork}
                  onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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

              {/* Terms & Conditions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Expected submissions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected submissions <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.expectedSubmissions}
                  onChange={(e) => setFormData({ ...formData, expectedSubmissions: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div data-section="Choose vendors" className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Choose vendors to invite for RFP</h3>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors flex items-center gap-2"
                  style={{ backgroundColor: "#1B733D" }}
                >
                  <Plus size={16} />
                  Add vendor
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "#1B733D" }}>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">S. No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Vendor name</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor, index) => (
                      <tr key={vendor.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{vendor.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                              <Edit2 size={16} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div data-section="Attachments" className="mb-12">
              <h3 className="text-base font-medium text-gray-900 mb-4">Attachments</h3>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#E8F5E9" }}
                  >
                    <Upload size={24} style={{ color: "#1B733D" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Click or Drag file to this area to upload</p>
                    <p className="text-xs text-gray-500">
                      Supports single or for bulk upload and Max file size is 15MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Supporting document (Uploaded by you)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <Download size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
