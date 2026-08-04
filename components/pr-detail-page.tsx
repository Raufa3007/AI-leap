"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Download, X, ChevronDown, User, Star, ArrowUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface PRDetailPageProps {
  prNumber: string
  onBack: () => void
}

interface CommitteeMember {
  id: number
  initials: string
  name: string
  role: string
  department: string
  evaluationType: string
  bgColor: string
  departmentColor: string
}

interface ProcessItem {
  id: number
  title: string
  status: "Completed" | "In Progress" | "Open"
  expanded: boolean
}

export default function PRDetailPage({ prNumber, onBack }: PRDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [activePurchaseSection, setActivePurchaseSection] = useState("RFP Details")
  const purchaseContentRef = useRef<HTMLDivElement>(null)

  const [checklistItems, setChecklistItems] = useState([
    { id: 1, question: "Is this project included as per procurement planning?", answer: false, comments: "" },
    {
      id: 2,
      question: "Were the specifications of the team work mentioned?",
      answer: true,
      comments:
        "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    },
    {
      id: 3,
      question:
        "Has the data of the person concerned with coordinating with suppliers been written down ? (Name, Mobile, Email)",
      answer: false,
      comments: "",
    },
    {
      id: 4,
      question:
        "has the information of the person concerned with receiving the samples been written down ? (Name, Mobile, Email)",
      answer: true,
      comments:
        "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
    },
    {
      id: 5,
      question: "Is the scope of work similar to the scope of existing contract? If yes please refer to the contract",
      answer: false,
      comments: "",
    },
    {
      id: 6,
      question:
        "The names of the companies summoned in the limited tender, along with writing the commercial registration number of the company",
      answer: false,
      comments: "",
    },
  ])

  const [committeeMembers] = useState<CommitteeMember[]>([
    {
      id: 1,
      initials: "MS",
      name: "Mohamad Saleem",
      role: "Finance officer",
      department: "Technical",
      evaluationType: "Evaluation",
      bgColor: "bg-blue-100 text-blue-700",
      departmentColor: "bg-orange-100 text-orange-700",
    },
    {
      id: 2,
      initials: "AA",
      name: "Abduala ahamed",
      role: "Finance officer",
      department: "Legal",
      evaluationType: "Legal",
      bgColor: "bg-blue-100 text-blue-700",
      departmentColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 3,
      initials: "AB",
      name: "Amina Bashir",
      role: "HR Manager",
      department: "Financial",
      evaluationType: "Bid evaluation",
      bgColor: "bg-gray-100 text-gray-700",
      departmentColor: "bg-green-100 text-green-700",
    },
    {
      id: 4,
      initials: "SR",
      name: "Shameer rila",
      role: "HR Manager",
      department: "Financial",
      evaluationType: "Commercial evaluation",
      bgColor: "bg-orange-100 text-orange-700",
      departmentColor: "bg-green-100 text-green-700",
    },
    {
      id: 5,
      initials: "JK",
      name: "John Kim",
      role: "Project Lead",
      department: "Legal",
      evaluationType: "Technical evaluation",
      bgColor: "bg-gray-100 text-gray-700",
      departmentColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 6,
      initials: "AA",
      name: "Ali ansari",
      role: "Project Lead",
      department: "Quality",
      evaluationType: "Bid evaluation",
      bgColor: "bg-blue-100 text-blue-700",
      departmentColor: "bg-teal-100 text-teal-700",
    },
    {
      id: 7,
      initials: "LR",
      name: "Lila Reyes ali",
      role: "Marketing Specialist",
      department: "Quality",
      evaluationType: "Quality evaluation",
      bgColor: "bg-gray-100 text-gray-700",
      departmentColor: "bg-teal-100 text-teal-700",
    },
    {
      id: 8,
      initials: "RA",
      name: "Rajveen ahmad",
      role: "Marketing Specialist",
      department: "Financial",
      evaluationType: "Financial evaluation",
      bgColor: "bg-orange-100 text-orange-700",
      departmentColor: "bg-green-100 text-green-700",
    },
  ])

  const [processItems, setProcessItems] = useState<ProcessItem[]>([
    { id: 1, title: "PR Process", status: "Completed", expanded: false },
    { id: 2, title: "RFI Process", status: "Completed", expanded: false },
    { id: 3, title: "RFQ Process", status: "Completed", expanded: false },
    { id: 4, title: "RFP Process", status: "Completed", expanded: false },
    { id: 5, title: "Approval process", status: "In Progress", expanded: false },
    { id: 6, title: "PO/ Contract process", status: "Open", expanded: false },
    { id: 7, title: "Amendment process", status: "Open", expanded: false },
    { id: 8, title: "CoC & Invoice", status: "Open", expanded: false },
  ])

  const purchaseSections = [
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

  useEffect(() => {
    const handleScroll = () => {
      if (!purchaseContentRef.current || activeTab !== "purchase-details") return

      const sections = purchaseContentRef.current.querySelectorAll("[data-purchase-section]")
      let currentSection = "RFP Details"

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.getAttribute("data-purchase-section") || "RFP Details"
        }
      })

      setActivePurchaseSection(currentSection)
    }

    const content = purchaseContentRef.current
    if (content) {
      content.addEventListener("scroll", handleScroll)
      return () => content.removeEventListener("scroll", handleScroll)
    }
  }, [activeTab])

  const scrollToPurchaseSection = (section: string) => {
    setActivePurchaseSection(section)
    const element = purchaseContentRef.current?.querySelector(`[data-purchase-section="${section}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleToggle = (id: number) => {
    setChecklistItems(checklistItems.map((item) => (item.id === id ? { ...item, answer: !item.answer } : item)))
  }

  const toggleProcessItem = (id: number) => {
    setProcessItems(processItems.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)))
  }

  const processStages = [
    { label: "PR execution", completed: true, current: false },
    { label: "Vendor selection", completed: false, current: true },
    { label: "PO creation", completed: false, current: false },
    { label: "Delivery/Service", completed: false, current: false },
    { label: "Invoice processing", completed: false, current: false },
    { label: "Payment & closure", completed: false, current: false },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600"
      case "In Progress":
        return "text-orange-600"
      case "Open":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const vendors = [
    {
      id: 1,
      name: "O Vendor",
      location: "London",
      logo: "OV",
      rating: 4,
      services: [
        { label: "Goods", color: "bg-green-100 text-green-700" },
        { label: "Digital service", color: "bg-blue-100 text-blue-700" },
        { label: "Digital equipment", color: "bg-purple-100 text-purple-700" },
      ],
      crNumber: "CR1234567890",
      address: "#124, Olaya street, Riyadh, Saudi Arabia.",
      value: "21,456",
    },
    {
      id: 2,
      name: "Voo Supplier",
      location: "New York",
      logo: "VS",
      rating: 5,
      services: [
        { label: "Services", color: "bg-green-100 text-green-700" },
        { label: "Consulting", color: "bg-blue-100 text-blue-700" },
        { label: "Software Solutions", color: "bg-purple-100 text-purple-700" },
      ],
      crNumber: "CR0987654321",
      address: "#300, Broadway Ave, New York, USA.",
      value: "35,789",
    },
    {
      id: 3,
      name: "H Distributor",
      location: "Tokyo",
      logo: "HD",
      rating: 3,
      services: [
        { label: "Retail", color: "bg-green-100 text-green-700" },
        { label: "Clothing", color: "bg-blue-100 text-blue-700" },
        { label: "Footwear", color: "bg-orange-100 text-orange-700" },
      ],
      crNumber: "CR1122334455",
      address: "#45, Ginza district, Tokyo, Japan.",
      value: "58,541",
    },
    {
      id: 4,
      name: "V Manufacturer",
      location: "Berlin",
      logo: "VM",
      rating: 2,
      services: [
        { label: "Raw Materials", color: "bg-green-100 text-green-700" },
        { label: "Steel", color: "bg-gray-100 text-gray-700" },
        { label: "Machinery", color: "bg-yellow-100 text-yellow-700" },
      ],
      crNumber: "CR5566778899",
      address: "#20, Unter den Linden, Berlin, Germany.",
      value: "72,650",
    },
    {
      id: 5,
      name: "AV Retailer",
      location: "Toronto",
      logo: "AV",
      rating: 4,
      services: [
        { label: "Consumer Goods", color: "bg-green-100 text-green-700" },
        { label: "Electronics", color: "bg-blue-100 text-blue-700" },
        { label: "Appliances", color: "bg-purple-100 text-purple-700" },
      ],
      crNumber: "CR9988776655",
      address: "#99, Queen St, Toronto, Canada.",
      value: "45,300",
    },
  ]

  const documents = [
    { id: 1, name: "Scope of work", fileName: "Scope of work", size: "6.5kb" },
    { id: 2, name: "Approval email", fileName: "Approval email", size: "15.2kb" },
    { id: 3, name: "Budget report", fileName: "Budget report", size: "9.8kb" },
    { id: 4, name: "Business overview", fileName: "Business overview", size: "2.3mb" },
    { id: 5, name: "Benchmarking products", fileName: "Benchmarking products", size: "50.1kb" },
    { id: 6, name: "PR document", fileName: "PR document", size: "1.1mb" },
  ]

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-green-600">PR_{prNumber}/Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm font-medium">
            <X className="w-4 h-4" />
            Cancel PR
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 bg-white">
        <div className="flex gap-8">
          {["Overview", "Purchase details", "Vendors", "Documents", "Process"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
              className={`py-4 px-1 border-b-2 font-medium transition-colors text-sm ${
                activeTab === tab.toLowerCase().replace(" ", "-")
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "overview" && (
        <div className="px-8 py-6 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-stretch">
              {processStages.map((stage, index) => (
                <div
                  key={index}
                  className={`relative flex-1 px-8 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    stage.completed
                      ? "bg-green-600 text-white"
                      : stage.current
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                  style={{
                    clipPath:
                      index === 0
                        ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
                        : index === processStages.length - 1
                          ? "polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 0 50%)"
                          : "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)",
                    marginLeft: index > 0 ? "-20px" : "0",
                    zIndex: processStages.length - index,
                  }}
                >
                  {stage.completed && (
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">{stage.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-green-600 mb-6">Request details</h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Request title</p>
                <p className="font-semibold text-gray-900">Leadership Development Training Program</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">PR Number</p>
                  <p className="font-semibold text-gray-900">1234567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="font-semibold text-gray-900">Learning and development</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Proposal status</p>
                  <p className="font-semibold text-orange-600">In Progress</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">PR type</p>
                  <p className="font-semibold text-gray-900">Service</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget code/Cost centre</p>
                  <p className="font-semibold text-gray-900">BXXCC12345</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated cost</p>
                  <p className="font-semibold text-gray-900">12,146,000 ر.س</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Requestor</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                      MS
                    </div>
                    <p className="font-semibold text-gray-900">Mark Siegelman</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Approvers</p>
                  <div className="flex gap-1">
                    {[
                      { initials: "MS", color: "bg-blue-500" },
                      { initials: "AB", color: "bg-green-500" },
                      { initials: "JK", color: "bg-purple-500" },
                      { initials: "LR", color: "bg-orange-500" },
                    ].map((approver, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-full ${approver.color} text-white flex items-center justify-center text-xs font-semibold`}
                      >
                        {approver.initials}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Requested date</p>
                  <p className="font-semibold text-gray-900">04/09/2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-green-600 mb-6">PR Details</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">RFP Number</p>
                  <p className="font-semibold text-gray-900">1234567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Purchase type</p>
                  <p className="font-semibold text-gray-900">RFP</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Urgency</p>
                  <p className="font-semibold text-gray-900">Normal</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start date</p>
                  <p className="font-semibold text-gray-900">01/12/2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Expected end date</p>
                  <p className="font-semibold text-gray-900">30/12/2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service location</p>
                  <p className="font-semibold text-gray-900">Riyadh, main branch</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Detailed requirement/ statement of work (SOW)</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Leadership Development Training Program will be designed to build and strengthen leadership
                  capabilities across the organization by focusing on key competencies such as strategic thinking,
                  communication, decision-making, people management, and change leadership. The program will be
                  delivered through interactive training sessions, workshops, case studies, and digital learning
                  resources, ensuring both knowledge building and practical application. Targeted at mid-level managers,
                  emerging leaders, and high-potential employees, the program will run over [insert duration] in a
                  blended format of classroom/virtual learning and on-the-job practice. Success will be measured through
                  participant feedback, leadership assessments, and observable improvements in team performance,
                  ultimately driving stronger leadership effectiveness and organizational growth.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-green-600 mb-6">Committee members</h2>

            <div className="grid grid-cols-2 gap-4">
              {committeeMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full ${member.bgColor} flex items-center justify-center font-semibold text-base flex-shrink-0`}
                  >
                    {member.initials}
                  </div>

                  {/* Name and Role */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.role}</p>
                  </div>

                  {/* Department Badge */}
                  <div className={`px-3 py-1 rounded-full ${member.departmentColor} text-xs font-medium flex-shrink-0`}>
                    {member.department}
                  </div>

                  {/* Evaluation Icon */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>

                  {/* Evaluation Type */}
                  <div className="text-xs text-gray-600 font-medium min-w-[100px] text-right">
                    {member.evaluationType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "purchase-details" && (
        <div className="flex h-[calc(100vh-140px)]">
          {/* Left Sidebar - Sections */}
          <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Sections</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto">
              {purchaseSections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToPurchaseSection(section)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    activePurchaseSection === section
                      ? "bg-green-50 text-green-700 border-l-4 border-green-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div ref={purchaseContentRef} className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 space-y-8">
              {/* PR Details Section */}
              <div data-purchase-section="RFP Details" className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-green-600 mb-6">PR Details</h2>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">PR Number</p>
                    <p className="font-semibold text-gray-900">PR2131424</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Department</p>
                    <p className="font-semibold text-gray-900">Procurement Department</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Budget code/Cost centre</p>
                    <p className="font-semibold text-gray-900">BUD1751</p>
                  </div>
                </div>

                {/* Arabic Title */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-2xl font-semibold text-green-700 text-right" dir="rtl">
                    تطبيق الهاتف المحمول للخدمات الحكومية
                  </p>
                </div>

                {/* Requestor and Dates */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Requestor name</p>
                    <p className="font-semibold text-gray-900">Mark Siegelman</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Contact details</p>
                    <p className="font-semibold text-gray-900">mark.siegelman@ancd.xyz.com</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Requested date</p>
                    <p className="font-semibold text-gray-900">21/10/2024</p>
                  </div>
                </div>

                {/* Approvers */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3">Approvers</p>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                      MS
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work Section */}
              <div data-purchase-section="Scope Of Work" className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-green-600 mb-4">Scope of Work</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Develop a scalable application with user authentication, core features, admin panel, and third-party
                  integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                  (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                  maintenance; payment structured in milestones.
                </p>
              </div>

              {/* Procurement Details Section */}
              <div
                data-purchase-section="Procurement Details"
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-4">Purpose & Justification</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Develop a scalable application with user authentication, core features, admin panel, and third-party
                  integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                  (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                  maintenance; payment structured in milestones.
                </p>
              </div>

              {/* Business Impact Section (before Procurement Checklist) */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-green-600 mb-4">Business impact / Expected outcome</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Develop a scalable application with user authentication, core features, admin panel, and third-party
                  integrations. Utilize React/Flutter (Frontend), Node.js/Python (Backend), and AWS/Google Cloud
                  (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and
                  maintenance; payment structured in milestones.
                </p>
              </div>

              {/* Procurement Check List Section */}
              <div
                data-purchase-section="Procurement Checklist"
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-6">Procurement Check List</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Check List</span>
                    <span className="text-sm text-gray-600">Click Yes/ NO</span>
                  </div>

                  {checklistItems.map((item) => (
                    <div key={item.id} className="space-y-3 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-900 flex-1 pr-4">{item.question}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Switch checked={item.answer} onCheckedChange={() => handleToggle(item.id)} />
                          <span className="text-sm font-medium text-gray-900 w-8">{item.answer ? "Yes" : "No"}</span>
                        </div>
                      </div>
                      {item.comments && (
                        <div className="ml-0">
                          <p className="text-xs text-gray-600 mb-1">Comments</p>
                          <p className="text-sm text-gray-700">{item.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Placeholder sections for remaining items */}
              <div data-purchase-section="Bill of Quantity" className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-green-600 mb-4">Bill of Quantity</h2>
                <p className="text-gray-600 text-sm">Bill of Quantity details will be displayed here.</p>
              </div>

              <div
                data-purchase-section="Technical Committee Members"
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-4">Technical Committee Members</h2>
                <p className="text-gray-600 text-sm">Technical Committee Members details will be displayed here.</p>
              </div>

              <div
                data-purchase-section="Technical Requirements"
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-4">Technical Requirements</h2>
                <p className="text-gray-600 text-sm">Technical Requirements details will be displayed here.</p>
              </div>

              <div
                data-purchase-section="Technical Evaluation Criteria"
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-4">Technical Evaluation Criteria</h2>
                <p className="text-gray-600 text-sm">Technical Evaluation Criteria details will be displayed here.</p>
              </div>

              <div
                data-purchase-section="Vendor Evaluation Weightage"
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-green-600 mb-4">Vendor Evaluation Weightage</h2>
                <p className="text-gray-600 text-sm">Vendor Evaluation Weightage details will be displayed here.</p>
              </div>

              <div data-purchase-section="Man Power" className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-green-600 mb-4">Man Power</h2>
                <p className="text-gray-600 text-sm">Man Power details will be displayed here.</p>
              </div>

              <div data-purchase-section="Attachments" className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-green-600 mb-4">Attachments</h2>
                <p className="text-gray-600 text-sm">Attachments will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "vendors" && (
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1.5fr_2.5fr_1.5fr_2.5fr_1fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-700">Vendor name</div>
              <div className="text-sm font-medium text-gray-700">Rating</div>
              <div className="text-sm font-medium text-gray-700">Services offered</div>
              <div className="text-sm font-medium text-gray-700">CR number</div>
              <div className="text-sm font-medium text-gray-700">Address</div>
              <div className="text-sm font-medium text-gray-700">Value ر.س</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="grid grid-cols-[2fr_1.5fr_2.5fr_1.5fr_2.5fr_1fr] gap-4 px-6 py-4 items-center hover:bg-gray-50"
                >
                  {/* Vendor Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {vendor.logo}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{vendor.name}</p>
                      <p className="text-xs text-gray-500">{vendor.location}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= vendor.rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                  </div>

                  {/* Services Offered */}
                  <div className="flex flex-wrap gap-2">
                    {vendor.services.map((service, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs font-medium ${service.color} whitespace-nowrap`}
                      >
                        {service.label}
                      </span>
                    ))}
                  </div>

                  {/* CR Number */}
                  <div>
                    <p className="text-sm text-gray-900">{vendor.crNumber}</p>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-sm text-gray-700">{vendor.address}</p>
                  </div>

                  {/* Value */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vendor.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Document name</span>
                <ArrowUp className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-sm font-medium text-gray-700">Attachments</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div key={doc.id} className="grid grid-cols-2 gap-4 px-6 py-4 items-center hover:bg-gray-50">
                  {/* Document Name */}
                  <div>
                    <p className="text-sm text-gray-900">{doc.name}</p>
                  </div>

                  {/* Attachments */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* PDF Icon */}
                      <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                          <path d="M14 2v6h6" />
                        </svg>
                      </div>
                      {/* File Info */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    {/* Download Button */}
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "process" && (
        <div className="px-8 py-6">
          <div className="space-y-3">
            {processItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleProcessItem(item.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform ${item.expanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {item.expanded && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                        <p className="text-sm text-gray-900">{item.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Description</p>
                        <p className="text-sm text-gray-700">
                          This process involves the {item.title.toLowerCase()} workflow and related activities.
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Last Updated</p>
                        <p className="text-sm text-gray-900">21/10/2024</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
