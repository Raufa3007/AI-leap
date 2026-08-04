"use client"

import { Bell, Globe, User, LogOut, Download } from "lucide-react"
import Image from "next/image"

interface DashboardPageProps {
  onNavigate: (
    page: "login" | "registration" | "dashboard" | "inbox" | "rfp" | "purchase-orders" | "portal-chooser",
  ) => void
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const handleLogout = () => {
    onNavigate("portal-chooser")
  }

  const handleInboxClick = () => {
    onNavigate("inbox")
  }

  const handleRFPClick = () => {
    console.log('onNavigate("rfp")')
  }

  const handlePurchaseOrdersClick = () => {
    console.log(' onNavigate("purchase-orders")')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-3 flex items-center justify-between">
          <Image src="/images/kaarlogo.png" alt="Shipping containers" priority width={32} height={32} />
          <div className="text-lg font-semibold text-gray-900">Dashboard</div>
          <div className="flex items-center gap-6">
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-32 bg-white border-r border-gray-200 p-3 flex-shrink-0 overflow-hidden">
          <nav className="space-y-4">
            <div className="flex flex-col items-center gap-2 px-2 py-2 rounded-lg text-green-600 font-medium text-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Home</span>
            </div>
            <div
              className="flex flex-col items-center gap-2 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleInboxClick}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>Inbox</span>
            </div>
            <div
              className="flex flex-col items-center gap-2 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handleRFPClick}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" />
                <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>RFP</span>
            </div>
            <div
              className="flex flex-col items-center gap-2 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs"
              onClick={handlePurchaseOrdersClick}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span>
                Purchase
                <br />
                Orders
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16V4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v12h16V8H4z" />
              </svg>
              <span>Catalog</span>
            </div>
            <div className="flex flex-col items-center gap-2 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8 10.9c-2.27-.59-3.8-1.95-3.8-4.9 0-3.74 2.94-6.9 6.5-6.9 3.56 0 6.5 3.16 6.5 6.9 0 2.95-1.53 4.31-3.8 4.9.78.99 1.3 2.16 1.3 3.5V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.6c0-.89-.19-1.73-.48-2.51-.64.13-1.33.2-2.02.2-.69 0-1.38-.07-2.02-.2-.29.78-.48 1.62-.48 2.51V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.6c0-1.34.52-2.51 1.3-3.5zM12 4c-2.46 0-4.5 2.24-4.5 5s2.04 5 4.5 5 4.5-2.24 4.5-5-2.04-5-4.5-5z" />
              </svg>
              <span>Invoices</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Mohammed !</h1>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8 flex gap-4 items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 font-semibold">
                ✓
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Prequalification</p>
                <p className="text-sm font-semibold text-gray-900">Completed: 06/09/25</p>
              </div>
            </div>

            <div className="flex-1 h-0.5 bg-green-500 mx-2"></div>

            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-700 font-semibold">
                ✓
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Review</p>
                <p className="text-sm font-semibold text-orange-600">In progress</p>
              </div>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-semibold">
                ?
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Registration</p>
                <p className="text-sm font-semibold text-gray-900">Yet to start</p>
              </div>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-semibold">
                ?
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Verification</p>
                <p className="text-sm font-semibold text-gray-900">Yet to start</p>
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg flex gap-4">
            <div className="text-2xl flex-shrink-0">⚠️</div>
            <div>
              <h3 className="font-semibold text-gray-900">Your company is under review.</h3>
              <p className="text-sm text-gray-700 mt-1">
                While we review your company details, here are some helpful documents to get you started with our
                process
              </p>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 text-sm">Type</h3>
              <h3 className="font-semibold text-gray-900 text-sm">Attachment</h3>
              <h3 className="font-semibold text-gray-900 text-sm"></h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { type: "Supplier Onboarding Guide", file: "Guide", size: "6.5kb" },
                { type: "Procurement Policy Document", file: "Procurement_policy", size: "6.5kb" },
                { type: "Compliance & Legal Guidelines", file: "Compliance", size: "6.5kb" },
                { type: "Point of Contact / Escalation Matrix", file: "PoC", size: "6.5kb" },
                { type: "Sample RFP Template", file: "Affiliation", size: "6.5kb" },
              ].map((doc, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                  <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">{doc.type}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium">{doc.file}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-gray-600 hover:text-gray-900 p-2">
                      <Download size={20} />
                    </button>
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
