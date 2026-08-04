"use client"

import { Bell, Globe, User, LogOut, ChevronDown, Share2, Flag } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import POOverviewPage from "./po-overview-page" // Import POOverviewPage

interface PurchaseOrderPageProps {
  onNavigate: (page: "login" | "registration" | "dashboard" | "inbox" | "rfp" | "purchase-orders") => void
}

export default function PurchaseOrderPage({ onNavigate }: PurchaseOrderPageProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [selectedPO, setSelectedPO] = useState<string | null>(null)

  const handleLogout = () => {
    onNavigate("login")
  }

  const handleDashboardClick = () => {
    onNavigate("dashboard")
  }

  const handleInboxClick = () => {
    onNavigate("inbox")
  }

  const handleRFPClick = () => {
    onNavigate("rfp")
  }

  const handlePurchaseOrdersClick = () => {
    onNavigate("purchase-orders")
  }

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  const purchaseOrders = [
    {
      id: "PO-001",
      status: "Active",
      title: "IT Infrastructure Maintenance Services",
      rfpId: "PO-2025-102",
      category: "IT",
      deadline: "Jun 10, 2025 / 14 Dhul Hijjah 1446",
      poValue: "1,200,000",
      invoiceStatus: "4 of 12 Invoices Submitted",
    },
    {
      id: "PO-002",
      status: "Active",
      title: "HRMS implementation",
      rfpId: "RFP-2025-102",
      category: "IT",
      deadline: "May 30, 2025 / 2 Dhul Hijjah 1446",
      poValue: "5,200,000",
      invoiceStatus: "0 of 3 Invoices Submitted",
    },
    {
      id: "PO-003",
      status: "Active",
      title: "Annual Office Stationery Contract",
      rfpId: "RFP-2025-098",
      category: "Mechanical Parts",
      deadline: "Jun 1, 2025 / 5 Dhul Hijjah 1446",
      poValue: "3,000,000",
      invoiceStatus: "0 of 3 Invoices Submitted",
    },
    {
      id: "PO-004",
      status: "Closed",
      title: "Product design - Resources",
      rfpId: "RFP-2025-101",
      category: "IT",
      deadline: "Jan 5, 2025 / 9 Dhul Hijjah 1446",
      poValue: "2,200,000",
      invoiceStatus: "3 of 3 Invoices Submitted",
    },
    {
      id: "PO-005",
      status: "Closed",
      title: "Product development - Resources",
      rfpId: "RFP-2025-101",
      category: "IT",
      deadline: "Jan 5, 2025 / 9 Dhul Hijjah 1446",
      poValue: "1,200,000",
      invoiceStatus: "5 of 5 Invoices Submitted",
    },
    {
      id: "PO-006",
      status: "Cancelled",
      title: "Solar Panel Installation",
      rfpId: "RFP-2025-101",
      category: "Renewable Energy",
      deadline: "Jan 5, 2025 / 9 Dhul Hijjah 1446",
      poValue: "200,000",
      invoiceStatus: "0 of 5 Invoices Submitted",
    },
    {
      id: "PO-007",
      status: "Completed",
      title: "Product development - Resources",
      rfpId: "RFP-2025-102",
      category: "IT",
      deadline: "May 30, 2025 / 2 Dhul Hijjah 1446",
      poValue: "500,000",
      invoiceStatus: "5 of 5 Invoices Submitted",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-orange-100 text-orange-800"
      case "Closed":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-orange-500"
      case "Closed":
        return "bg-blue-500"
      case "Cancelled":
        return "bg-red-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (selectedPO) {
    return <POOverviewPage poId={selectedPO} onBack={() => setSelectedPO(null)} />
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 py-3 px-6">
        <div className="flex items-center justify-between">
          <Image src="/images/kaarlogo.png" alt="KaarTech logo" width={32} height={32} priority />
          <div className="text-base font-semibold text-gray-900">Purchase Order</div>
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-32 bg-white border-r border-gray-200 p-3 flex-shrink-0 overflow-hidden">
          <nav className="space-y-4">
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleDashboardClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-center">Home</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleInboxClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-center">Inbox</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleRFPClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16c2 0 3.99-.9 3.99-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="text-center">RFP</span>
            </div>
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 text-green-600 font-medium text-xs bg-green-50 rounded-lg cursor-pointer"
              onClick={handlePurchaseOrdersClick}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="text-center leading-tight">
                Purchase
                <br />
                Orders
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16V4H4c-1.1 0-2 .9-2 2v12H0v4h14v-4H4V6zm16-2v8h4V4h-4z" />
              </svg>
              <span className="text-center">Catalog</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-center">Invoices</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Title and Total */}
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Purchase Order</h1>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Total Count */}
            <div className="mb-6 text-sm font-medium text-gray-600">Total - 20</div>

            {/* Status Cards */}
            <div className="grid grid-cols-6 gap-4 mb-8">
              {/* Active Orders */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1 h-12 bg-orange-500 rounded"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Active orders</p>
                    <p className="text-2xl font-bold text-gray-900">04</p>
                  </div>
                </div>
                <button className="text-orange-600 text-sm font-medium hover:text-orange-700 flex items-center gap-1">
                  View <span>›</span>
                </button>
              </div>

              {/* Completed Orders */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1 h-12 bg-green-500 rounded"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Completed orders</p>
                    <p className="text-2xl font-bold text-gray-900">21</p>
                  </div>
                </div>
                <button className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
                  View <span>›</span>
                </button>
              </div>

              {/* Cancelled Orders */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1 h-12 bg-red-500 rounded"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Cancelled orders</p>
                    <p className="text-2xl font-bold text-gray-900">02</p>
                  </div>
                </div>
                <button className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-1">
                  View <span>›</span>
                </button>
              </div>

              {/* Closed Orders */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1 h-12 bg-blue-500 rounded"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Closed orders</p>
                    <p className="text-2xl font-bold text-gray-900">08</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                  View <span>›</span>
                </button>
              </div>

              {/* Total Order Value */}
              <div className="bg-slate-600 rounded-lg p-4 text-white">
                <p className="text-xs font-medium mb-2 opacity-90">Total order value</p>
                <p className="text-2xl font-bold">5,645,658 ⱡ</p>
              </div>

              {/* Total Payment Received */}
              <div className="bg-green-600 rounded-lg p-4 text-white">
                <p className="text-xs font-medium mb-2 opacity-90">Total payment received</p>
                <p className="text-2xl font-bold">3,578,564 ⱡ</p>
              </div>
            </div>

            {/* Purchase Orders List */}
            <div className="space-y-4">
              {purchaseOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPO(order.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusBadgeColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{order.title}</h3>
                        <div className="grid grid-cols-5 gap-8 mt-2 text-sm">
                          <div>
                            <p className="text-gray-600 text-xs">RFP ID</p>
                            <p className="text-gray-900 font-medium">{order.rfpId}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Category</p>
                            <p className="text-gray-900 font-medium">{order.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Delivery Deadline</p>
                            <p className="text-gray-900 font-medium">{order.deadline}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Total PO Value</p>
                            <p className="text-gray-900 font-medium">{order.poValue} ⱡ</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Invoice Status</p>
                            <p className="text-gray-900 font-medium">{order.invoiceStatus}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900">
                        <Share2 size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900">
                        <Flag size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900">
                        <ChevronDown
                          size={18}
                          className={`transform transition-transform ${expandedRows.includes(order.id) ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
