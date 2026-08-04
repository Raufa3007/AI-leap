"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import RegistrationPage from "@/components/registration-page"
import DashboardPage from "@/components/dashboard-page"
import InboxPage from "@/components/inbox-page"
import RFPPage from "@/components/rfp-page"
import PurchaseOrderPage from "@/components/purchase-order-page"
import PortalChooser from "@/components/portal-chooser"
import ProcSidebar from "@/components/proc-sidebar"
import ProcMainContent from "@/components/proc-main-content"

type PageType =
  | "login"
  | "registration"
  | "dashboard"
  | "inbox"
  | "rfp"
  | "purchase-orders"
  | "catalog"
  | "portal-chooser"
  | "procurement"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("portal-chooser")
  const [currentStep, setCurrentStep] = useState(1)
  const [procCurrentPage, setProcCurrentPage] = useState("dashboard")

  const handleProcLogout = () => {
    setCurrentPage("portal-chooser")
    setProcCurrentPage("dashboard")
  }

  if (currentPage === "login") {
    return <LoginPage onNavigate={setCurrentPage} />
  }

  if (currentPage === "registration") {
    return <RegistrationPage currentStep={currentStep} setCurrentStep={setCurrentStep} onNavigate={setCurrentPage} />
  }

  if (currentPage === "portal-chooser") {
    return <PortalChooser onNavigate={setCurrentPage} />
  }

  if (currentPage === "procurement") {
    return (
      <div className="flex h-screen bg-gray-50">
        <ProcSidebar currentPage={procCurrentPage} onNavigate={setProcCurrentPage} onLogout={handleProcLogout} />
        <ProcMainContent currentPage={procCurrentPage} onNavigate={setProcCurrentPage} />
      </div>
    )
  }

  if (currentPage === "dashboard") {
    return <DashboardPage onNavigate={setCurrentPage} />
  }

  if (currentPage === "inbox") {
    return <InboxPage onNavigate={setCurrentPage} />
  }

  if (currentPage === "rfp") {
    return <RFPPage onNavigate={setCurrentPage} />
  }

  if (currentPage === "purchase-orders") {
    return <PurchaseOrderPage onNavigate={setCurrentPage} />
  }

  if (currentPage === "catalog") {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 flex-shrink-0 py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-gray-900">Catalog</div>
            <button onClick={() => setCurrentPage("dashboard")} className="text-gray-600 hover:text-gray-900">
              ← Back
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Catalog</h2>
            <p className="text-gray-600">Catalog page coming soon</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
