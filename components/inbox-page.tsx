"use client"

import { useState } from "react"
import { Bell, Globe, User, LogOut, Search, Grid3x3, Download } from "lucide-react"
import Image from "next/image"
// import ChecklistDetailView from "./checklist-detail-view"

interface InboxPageProps {
  onNavigate: (page: "login" | "registration" | "dashboard" | "inbox" | "rfp") => void
}

interface RFQItem {
  id: string
  title: string
  priority: "High" | "Medium" | "Low"
  timestamp: string
  rfpId: string
  issuingOrg: string
  deadline: string
  budget: string
  category: string
  daysElapsed: number
  objective: string
  scopeItems: Array<{
    sNo: number
    itemName: string
    uom: string
    quantity: number
    specs: string
  }>
  documents: Array<{
    name: string
    size: string
  }>
}

const mockRFQs: RFQItem[] = [
  {
    id: "vendor-eval-task",
    title: "Enterprise Vendor Evaluation & Scorecard (Palm Tree IT, Accenture, Deloitte)",
    priority: "High",
    timestamp: "Today, 09:30 am",
    rfpId: "VEN-SCORECARD-2026",
    issuingOrg: "Procurement & Strategic Sourcing",
    deadline: "20-Aug-2026",
    budget: "120,000,000 ﷼",
    category: "Vendor Governance",
    daysElapsed: 1,
    objective: "Enterprise SAP Ariba inspired Vendor Scorecard PoC evaluating vendors using historical JSON data and Gemini AI document analysis.",
    scopeItems: [],
    documents: [],
  },
  {
    id: "approve-rfp-108",
    title: "Approve & publish RFP - 10000000108",
    priority: "Medium",
    timestamp: "Tuesday, 1:20 pm",
    rfpId: "RFP-10000000108",
    issuingOrg: "IT Department - Service",
    deadline: "25-Oct-2025",
    budget: "500,000 ﷼",
    category: "IT Services",
    daysElapsed: 5,
    objective: "Review and approve RFP for publishing",
    scopeItems: [],
    documents: [],
  },
  {
    id: "1",
    title: "Supply & Installation of Network Infrastructure for New Office Tower",
    priority: "High",
    timestamp: "20 Mins Ago",
    rfpId: "RFP-2025-0148",
    issuingOrg: "IT Infrastructure Division",
    deadline: "04-Jun-2025",
    budget: "600,000 ﷼",
    category: "IT Infrastructure",
    daysElapsed: 8,
    objective:
      "To supply, install, configure, and commission a complete structured cabling system and active networking components for Tamkeen Corp's new office tower located in Riyadh, KSA.",
    scopeItems: [
      {
        sNo: 1,
        itemName: "Cat6 Cables - UTP Cable 23 AWG, 305m box, 100% copper",
        uom: "Box",
        quantity: 40,
        specs: "Should support 1Gbps up to 100 meter",
      },
      {
        sNo: 2,
        itemName: "Faceplates & Keystone Jacks - RJ45, Compatible with Cat6, white",
        uom: "Set",
        quantity: 200,
        specs: "Modular with dust caps",
      },
      {
        sNo: 3,
        itemName: "24-Port Patch Panels - Cat6 Patch Panel, 1U rack-mountable",
        uom: "Pcs",
        quantity: 10,
        specs: "Labeled ports, loaded",
      },
      {
        sNo: 4,
        itemName: "Network Switches - 48-Port Gigabit + 4 SFP, Managed",
        uom: "Pcs",
        quantity: 57,
        specs: "Labeled ports, loaded",
      },
      {
        sNo: 5,
        itemName: "Server Rack - 42U with cooling fans & PDU",
        uom: "Pcs",
        quantity: 5,
        specs: 'Lockable, standard 19"',
      },
    ],
    documents: [
      { name: "Specs_Document.pdf", size: "26.5kb" },
      { name: "Terms_Conditions.pdf", size: "26.5kb" },
    ],
  },
  {
    id: "2",
    title: "Respond to Buyer Query for RFP-2123 by 06-Jun-2025",
    priority: "Medium",
    timestamp: "15-May-25",
    rfpId: "RFP-2025-0149",
    issuingOrg: "Procurement Division",
    deadline: "06-Jun-2025",
    budget: "450,000 ﷼",
    category: "IT Services",
    daysElapsed: 5,
    objective: "Respond to buyer queries regarding RFP-2123",
    scopeItems: [],
    documents: [],
  },
  {
    id: "3",
    title: "Respond to RFI for purchase requisition by 10-Oct-2025",
    priority: "Medium",
    timestamp: "17-Oct-25",
    rfpId: "RFP-2025-0150",
    issuingOrg: "Purchasing Division",
    deadline: "10-Oct-2025",
    budget: "300,000 ﷼",
    category: "Supplies",
    daysElapsed: 3,
    objective: "Respond to RFI for purchase requisition",
    scopeItems: [],
    documents: [],
  },
  {
    id: "4",
    title: "Update the goods that you delivered for PO-24242 by 20-Oct-2025",
    priority: "Medium",
    timestamp: "12-May-25",
    rfpId: "RFP-2025-0151",
    issuingOrg: "Inventory Division",
    deadline: "20-Oct-2025",
    budget: "250,000 ﷼",
    category: "Supplies",
    daysElapsed: 2,
    objective: "Update delivery status for PO-24242",
    scopeItems: [],
    documents: [],
  },
  {
    id: "5",
    title: "Approve/Reject Delivery Date Change",
    priority: "Medium",
    timestamp: "12-May-25",
    rfpId: "RFP-2025-0152",
    issuingOrg: "Logistics Division",
    deadline: "15-Oct-2025",
    budget: "200,000 ﷼",
    category: "Logistics",
    daysElapsed: 1,
    objective: "Review and approve delivery date change request",
    scopeItems: [],
    documents: [],
  },
  {
    id: "6",
    title: "Submit Quotation for RFP-6655 by 07-Jul-2026",
    priority: "Medium",
    timestamp: "12-May-25",
    rfpId: "RFP-2025-0153",
    issuingOrg: "Procurement Division",
    deadline: "07-Jul-2026",
    budget: "350,000 ﷼",
    category: "Services",
    daysElapsed: 4,
    objective: "Submit quotation for RFP-6655",
    scopeItems: [],
    documents: [],
  },
  {
    id: "7",
    title: "Submit revised quotation for RFP-8777 by 07-Jul-2026",
    priority: "High",
    timestamp: "10-May-25",
    rfpId: "RFP-2025-0154",
    issuingOrg: "Procurement Division",
    deadline: "07-Jul-2026",
    budget: "420,000 ﷼",
    category: "Services",
    daysElapsed: 6,
    objective: "Submit revised quotation for RFP-8777",
    scopeItems: [],
    documents: [],
  },
]

export default function InboxPage({ onNavigate }: InboxPageProps) {
  const [selectedRFQ, setSelectedRFQ] = useState<RFQItem | null>(mockRFQs[0])
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  // const [showChecklistDetail, setShowChecklistDetail] = useState(false)

  const handleLogout = () => {
    onNavigate("login")
  }

  const handleBackToDashboard = () => {
    onNavigate("dashboard")
  }

  const handleRFPClick = () => {
    onNavigate("rfp")
  }

  const handleRFQClick = (rfq: RFQItem) => {
    setSelectedRFQ(rfq)
    // if (rfq.id === "checklist-4542") {
    //   setShowChecklistDetail(true)
    // } else {
    //   setShowChecklistDetail(false)
    // }
  }

  const filteredRFQs = mockRFQs.filter((rfq) => rfq.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 py-3 px-6">
        <div className="flex items-center justify-between">
          <Image src="/images/kaarlogo.png" alt="KaarTech logo" width={32} height={32} priority />
          <div className="text-base font-semibold text-gray-900">Inbox</div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Bell size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Globe size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <User size={18} />
            </button>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-32 bg-white border-r border-gray-200 p-3 flex-shrink-0 overflow-hidden">
          <nav className="space-y-4">
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleBackToDashboard}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-center">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-green-600 font-medium text-xs bg-green-50 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-center">Inbox</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleRFPClick}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16c2 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-center">RFP</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-center leading-tight">
                Purchase
                <br />
                Orders
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16V4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c2 0 2-.9 2-2zm0 2v12h16V8H4z" />
              </svg>
              <span className="text-center">Catalog</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8 10.9c-2.27-.59-3.8-1.95-3.8-4.9 0-3.74 2.94-6.9 6.5-6.9 3.56 0 6.5 3.16 6.5 6.9 0 2.95-1.53 4.31-3.8 4.9.78.99 1.3 2.16 1.3 3.5V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.6c0-.89-.19-1.73-.48-2.51-.64.13-1.33.2-2.02.2-.69 0-1.38-.07-2.02-.2-.29.78-.48 1.62-.48 2.51V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.6c0-1.34.52-2.51 1.3-3.5zM12 4c-2.46 0-4.5 2.24-4.5 5s2.04 5 4.5 5 4.5-2.24 4.5-5-2.04-5-4.5-5z" />
              </svg>
              <span className="text-center">Invoices</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel - Inbox Messages List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            {/* Tabs */}
            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`pb-2 font-medium text-sm border-b-2 ${
                    activeTab === "pending" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent"
                  }`}
                >
                  Pending (8)
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`pb-2 font-medium text-sm border-b-2 ${
                    activeTab === "completed" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1"
                />
                <button className="text-gray-400 hover:text-gray-600">
                  <Grid3x3 size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredRFQs.map((rfq) => (
                <div
                  key={rfq.id}
                  onClick={() => handleRFQClick(rfq)}
                  className={`px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedRFQ?.id === rfq.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div> */}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900 mb-2">{rfq.title}</h3>
                      {/* <p className="text-xs text-gray-600 mb-1">{rfq.issuingOrg}</p> */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            rfq.priority === "High" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          Priority: {rfq.priority}
                        </span>
                      </div>
                      {/* <p className="text-xs text-gray-700 mb-1">Mohamad Aslam</p> */}
                      <p className="text-xs text-gray-500">{rfq.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Message Details */}
          <div className="flex-1 overflow-y-auto bg-white">
            {
              /* {showChecklistDetail ? (
              <ChecklistDetailView onBack={() => setShowChecklistDetail(false)} />
            ) : */ selectedRFQ ? (
                <div className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 flex-1 pr-4">{selectedRFQ.title}</h1>
                    <div className="flex gap-3 flex-shrink-0">
                      <button className="px-6 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 whitespace-nowrap">
                        Decline
                      </button>
                      <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 whitespace-nowrap">
                        Accept & submit RFO
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">RFP ID</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.rfpId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Issuing Org/Department</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.issuingOrg}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Submission Deadline</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Expected Budget</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.budget}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Category</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Days Elapsed</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.daysElapsed} Days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Priority</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedRFQ.priority}</p>
                    </div>
                  </div>

                  {/* Objective */}
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-green-700 mb-3">Objective</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedRFQ.objective}</p>
                  </div>

                  {/* Scope of Work */}
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-green-700 mb-3">Scope of Work</h2>
                    <p className="text-sm text-gray-700 mb-4">The supplier shall be responsible for:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                      <li>Supplying all required passive and active networking components.</li>
                      <li>Laying structured cabling for data and voice across all floors (6 floors).</li>
                      <li>Installing network switches, wireless access points (WAPs), and patch panels.</li>
                      <li>Configuring VLANs, IP schema, and firewall rules as per IT policy.</li>
                      <li>
                        Conducting post-installation testing and documentation (including labeling, test reports, and
                        as-built diagrams).
                      </li>
                      <li>Providing on-site warranty and support for 12 months post-handover.</li>
                    </ul>
                  </div>

                  {/* Scope Table */}
                  {selectedRFQ.scopeItems.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-green-700 mb-3">Scope</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-green-700 text-white">
                              <th className="px-4 py-3 text-left text-sm font-semibold">S.No</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Item Name</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Units of Measure (UOM)</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Technical Specs / Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRFQ.scopeItems.map((item) => (
                              <tr key={item.sNo} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{item.sNo}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.itemName}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.uom}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.specs}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {selectedRFQ.documents.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-green-700 mb-4">Documents</h2>
                      <div className="flex gap-6">
                        {selectedRFQ.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">PDF</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size}</p>
                            </div>
                            <button className="text-gray-600 hover:text-gray-900 p-2">
                              <Download size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a message to view details
                </div>
              )
            }
          </div>
        </main>
      </div>
    </div>
  )
}
