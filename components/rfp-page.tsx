"use client"

import { useState } from "react"
import Image from "next/image"
import { Bell, Globe, User, LogOut, Share2, Flag, ChevronDown } from "lucide-react"
// import kaarlogo from "./images/kaarlogo.png"

interface RFPPageProps {
  onNavigate: (page: "login" | "registration" | "dashboard" | "inbox" | "rfp") => void
}

export default function RFPPage({ onNavigate }: RFPPageProps) {
  const [expandedRFP, setExpandedRFP] = useState<string | null>(null)

  const statusCards = [
    { label: "Submitted", count: "04", color: "orange" },
    { label: "Approved", count: "21", color: "green" },
    { label: "Rejected", count: "12", color: "red" },
    { label: "Closed", count: "08", color: "blue" },
    { label: "RFP value submitted", value: "645,658 ⱡ", color: "slate" },
    { label: "RFP approved", value: "578,564 ⱡ", color: "green-dark" },
  ]

  const rfpItems = [
    {
      id: "RFP-2025-101",
      title: "Supply of Industrial Valves",
      category: "Mechanical Parts",
      deadline: "Jun 10, 2025 / 14 Dhul Hijjah 1446",
      submittedBy: "Fadhel Al-Shammei",
      daysElapsed: "14",
      status: "Submitted",
    },
    {
      id: "RFP-2025-102",
      title: "IT Infrastructure Maintenance Services",
      category: "IT",
      deadline: "May 30, 2025 / 2 Dhul Hijjah 1446",
      submittedBy: "Fadhel Al-Shammei",
      daysElapsed: "56",
      status: "Approved",
    },
    {
      id: "RFP-2025-098",
      title: "Annual Office Stationery Contract",
      category: "Mechanical Parts",
      deadline: "Jun 1, 2025 / 5 Dhul Hijjah 1446",
      submittedBy: "Fadhel Al-Shammei",
      daysElapsed: "68",
      status: "Rejected",
    },
    {
      id: "RFP-2025-101",
      title: "Product design - Resources",
      category: "IT",
      deadline: "Jan 5, 2025 / 9 Dhul Hijjah 1446",
      submittedBy: "Fadhel Al-Shammei",
      daysElapsed: "190",
      status: "Closed",
    },
    {
      id: "RFP-2025-101",
      title: "Product development - Resources",
      category: "IT",
      deadline: "Jan 5, 2025 / 9 Dhul Hijjah 1446",
      submittedBy: "Fadhel Al-Shammei",
      daysElapsed: "190",
      status: "Closed",
    },
  ]

  const getCardColor = (color: string) => {
    const colors: Record<string, string> = {
      orange: "border-l-4 border-orange-500",
      green: "border-l-4 border-green-500",
      red: "border-l-4 border-red-500",
      blue: "border-l-4 border-blue-500",
      slate: "bg-slate-600 border-l-4 border-slate-700",
      "green-dark": "bg-green-600 border-l-4 border-green-700",
    }
    return colors[color] || ""
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Submitted: "bg-orange-100 text-orange-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Closed: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const handleDashboardClick = () => {
    onNavigate("dashboard")
  }

  const handleLogout = () => {
    onNavigate("login")
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="bg-white border-b border-gray-200 flex-shrink-0 py-3 px-6">
        <div className="flex items-center justify-between">
          <Image src="/images/kaarlogo.png" alt="KaarTech logo" width={32} height={32} priority />
          <div className="text-base font-semibold text-gray-900">RFP</div>
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
        <aside className="w-32 bg-white border-r border-gray-200 p-3 flex-shrink-0 overflow-hidden">
          <nav className="space-y-4">
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={() => onNavigate("dashboard")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-center">Home</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={() => onNavigate("inbox")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-center">Inbox</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-green-600 font-medium text-xs bg-green-50 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" />
              </svg>
              <span className="text-center">RFP</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={() => onNavigate("purchase-orders")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="text-center leading-tight">
                Purchase
                <br />
                Orders
              </span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={() => onNavigate("catalog")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16V4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v12h16V8H4z" />
              </svg>
              <span className="text-center">Catalog</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={() => onNavigate("invoices")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8 10.9c-2.27-.59-3.8-1.95-3.8-4.9 0-3.74 2.94-6.9 6.5-6.9 3.56 0 6.5 3.16 6.5 6.9 0 2.95-1.53 4.31-3.8 4.9.78.99 1.3 2.16 1.3 3.5V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.6c0-.89-.19-1.73-.48-2.51-.64.13-1.33.2-2.02.2-.69 0-1.38-.07-2.02-.2-.29.78-.48 1.62-.48 2.51V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.6c0-1.34.52-2.51 1.3-3.5zM12 4c-2.46 0-4.5 2.24-4.5 5s2.04 5 4.5 5 4.5-2.24 4.5-5-2.04-5-4.5-5z" />
              </svg>
              <span className="text-center">Invoices</span>
            </div>
          </nav>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Total Count */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Total - 20</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-gray-600">🔍</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-gray-600">🔄</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-gray-600">📊</span>
              </button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {statusCards.map((card, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  card.color === "slate" || card.color === "green-dark"
                    ? getCardColor(card.color)
                    : `bg-white ${getCardColor(card.color)}`
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    card.color === "slate" || card.color === "green-dark" ? "text-white" : "text-gray-600"
                  }`}
                >
                  {card.label}
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    card.color === "slate" || card.color === "green-dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {card.count || card.value}
                </p>
                {!card.value && (
                  <p
                    className={`text-sm mt-3 ${
                      card.color === "slate" || card.color === "green-dark" ? "text-white" : "text-gray-600"
                    } hover:underline cursor-pointer`}
                  >
                    View →
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* RFP List */}
          <div className="space-y-4">
            {rfpItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedRFP(expandedRFP === item.id + index ? null : item.id + index)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="grid grid-cols-5 gap-8 mt-2 text-sm text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">RFP ID</p>
                          <p className="font-medium text-gray-900">{item.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="font-medium text-gray-900">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-medium text-gray-900">{item.deadline}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Submitted By</p>
                          <p className="font-medium text-gray-900">📌 {item.submittedBy}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Days Elapsed</p>
                          <p className="font-medium text-gray-900">{item.daysElapsed}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Share2 size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Flag size={18} className="text-gray-600" />
                    </button>
                    <ChevronDown
                      size={20}
                      className={`text-gray-600 transition-transform ${
                        expandedRFP === item.id + index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
