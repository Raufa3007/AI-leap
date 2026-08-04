"use client"

import { useState, useEffect } from "react"
import ReportsPage from "./reports-page"
import PurchaseOrdersPage from "./purchase-orders-page"
import CocsPage from "./cocs-page"
import BidsPage from "./bids-page"
import ProcDashboardPage from "./proc-dashboard-page"
import ProcInboxPage from "./proc-inbox-page"
import ProcRfpsPage from "./proc-rfps-page"
import ProcVendorDirectoryPage from "./proc-vendor-directory-page"
import CreatePRForm from "./create-pr-form"
import ProcRFIForm from "./proc-rfi-form"
import ProcRFIVendorList from "./proc-rfi-vendor-list"
import ProcRFIDetails from "./proc-rfi-details"
import ProcRFPCreateForm from "./proc-rfp-create-form"
import ProcRFPViewForm from "./proc-rfp-view-form"
import ProcQuotationCreateForm from "./proc-quotation-create-form"
import ProcQuotationViewForm from "./proc-quotation-view-form"
import ToastNotification from "./toast-notification"
import ProcSupplierDetailsPage from "./proc-supplier-details-page"
import PRDetailPage from "./pr-detail-page"
import ChecklistDetailView from "./checklist-detail-view"
import DeclinedPOReviewPage from "./declined-po-review-page"
import EContractPage from "./e-contract-page"
import TechnicalEvaluationPage from "./technical-evaluation-page"
import VendorEvaluationPage from "./vendor-evaluation-page"
import CommercialEvaluationPage from "./commercial-evaluation-page"
import ProcInboxPREditRFI from "./proc_inbox_pr_edit_rfi"
import ProcInboxPREditRFP from "./proc_inbox_pr_edit_rfp"
import ProcInboxPREditQuotation from "./proc_inbox_pr_edit_quotation"
import ProcConfirmClosurePage from "./proc-confirm-closure-page"
import ProcCOCPage from "./proc-coc-page"
import ProcInboxPRAppView from "./proc-inbox-pr-app-view"

interface ProcMainContentProps {
  onNavigate?: (page: string) => void
  currentPage?: string
}

interface EContractContext {
  rfpId?: string
  poNumber?: string
  context?: "declined-po" | "new-po"
}

export default function ProcMainContent({ onNavigate, currentPage = "dashboard" }: ProcMainContentProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [isCreatingPR, setIsCreatingPR] = useState(false)
  const [selectedPR, setSelectedPR] = useState<string | null>(null)
  const [editingPRNumber, setEditingPRNumber] = useState<string | null>(null)
  const [viewingPRDetailsId, setViewingPRDetailsId] = useState<string | null>(null)
  const [viewingRFIFormId, setViewingRFIFormId] = useState<string | null>(null)
  const [rfiView, setRfiView] = useState<"form" | "vendor-list" | "details">("form")
  const [viewingRFPFormId, setViewingRFPFormId] = useState<string | null>(null)
  const [viewingQuotationFormId, setViewingQuotationFormId] = useState<string | null>(null)
  const [viewingSupplierFormId, setViewingSupplierFormId] = useState<string | null>(null)
  const [viewingCommitteeApp, setViewingCommitteeApp] = useState(false)
  const [viewingDeclinedPO, setViewingDeclinedPO] = useState(false)
  const [viewingEContract, setViewingEContract] = useState(false)
  const [eContractContext, setEContractContext] = useState<EContractContext>({
    rfpId: "RFP_10000000107",
    poNumber: "PO 2025 014",
    context: "declined-po",
  })
  const [viewingTechnicalEvaluation, setViewingTechnicalEvaluation] = useState(false)
  const [viewingVendorEvaluation, setViewingVendorEvaluation] = useState(false)
  const [viewingCommercialEvaluation, setViewingCommercialEvaluation] = useState(false)
  const [evaluationType, setEvaluationType] = useState<"technical" | "commercial">("technical")
  const [viewingInboxRFIFormId, setViewingInboxRFIFormId] = useState<string | null>(null)
  const [viewingInboxRFPFormId, setViewingInboxRFPFormId] = useState<string | null>(null)
  const [viewingInboxQuotationFormId, setViewingInboxQuotationFormId] = useState<string | null>(null)
  const [viewingPRApp, setViewingPRApp] = useState<{ prId: string; prData: any } | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [selectedInboxItemId, setSelectedInboxItemId] = useState<string | null>(null)
  const [selectedInboxTaskId, setSelectedInboxTaskId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedInboxTaskId") || null
    }
    return null
  })
  const [isCreatingPRForClosure, setIsCreatingPRForClosure] = useState(false)
  const [viewingConfirmClosureFormId, setViewingConfirmClosureFormId] = useState<string | null>(null)
  const [viewingCOCPage, setViewingCOCPage] = useState(false)
  const [showCommercialEvaluationFullPage, setShowCommercialEvaluationFullPage] = useState(false)
  const [showCOCPageFullScreen, setShowCOCPageFullScreen] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedInboxTaskId) {
        localStorage.setItem("selectedInboxTaskId", selectedInboxTaskId)
      } else {
        localStorage.removeItem("selectedInboxTaskId")
      }
    }
  }, [selectedInboxTaskId])

  const mainContentClass = "flex-1 overflow-auto ml-20"
  const fullScreenContentClass = "flex-1 overflow-auto"

  if (currentPage === "vendor-directory" && selectedVendorId) {
    return (
      <div className={mainContentClass}>
        <ProcVendorDirectoryPage initialVendorId={selectedVendorId} onVendorSelect={setSelectedVendorId} />
      </div>
    )
  }

  if (showCOCPageFullScreen) {
    return (
      <div className={fullScreenContentClass}>
        <ProcCOCPage
          onBack={() => {
            setShowCOCPageFullScreen(false)
          }}
        />
      </div>
    )
  }

  if (viewingCOCPage) {
    return (
      <div className={fullScreenContentClass}>
        <ProcCOCPage
          onBack={() => {
            setViewingCOCPage(false)
            setViewingConfirmClosureFormId("PO#3432")
          }}
        />
      </div>
    )
  }

  if (viewingConfirmClosureFormId) {
    return (
      <div className={mainContentClass}>
        <ProcConfirmClosurePage
          poId={viewingConfirmClosureFormId}
          onBack={() => {
            setViewingConfirmClosureFormId(null)
            setSelectedInboxTaskId("confirm-closure-3432")
          }}
          onViewCOC={() => setViewingCOCPage(true)}
          onCreatePR={() => setIsCreatingPRForClosure(true)}
        />
      </div>
    )
  }

  if (isCreatingPRForClosure) {
    return (
      <div className={mainContentClass}>
        <CreatePRForm
          onBack={() => {
            setIsCreatingPRForClosure(false)
            setSelectedInboxTaskId("confirm-closure-3432")
          }}
          customTitle="Confirm closure/delivery of the item in the PO #3442"
        />
      </div>
    )
  }

  if (viewingInboxRFIFormId) {
    return (
      <div className={mainContentClass}>
        <ProcInboxPREditRFI
          rfiId={viewingInboxRFIFormId}
          onBack={() => setViewingInboxRFIFormId(null)}
          onSuccess={() => {
            setViewingInboxRFIFormId(null)
            setToastMessage("RFI sent successfully")
            setShowToast(true)
          }}
        />
      </div>
    )
  }

  if (viewingInboxRFPFormId) {
    return (
      <div className={mainContentClass}>
        <ProcInboxPREditRFP
          rfpId={viewingInboxRFPFormId}
          onBack={() => setViewingInboxRFPFormId(null)}
          onSuccess={() => {
            setViewingInboxRFPFormId(null)
            setToastMessage("RFP submitted successfully")
            setShowToast(true)
          }}
        />
      </div>
    )
  }

  if (viewingInboxQuotationFormId) {
    return (
      <div className={mainContentClass}>
        <ProcInboxPREditQuotation
          quotationId={viewingInboxQuotationFormId}
          onBack={() => setViewingInboxQuotationFormId(null)}
          onSuccess={() => {
            setViewingInboxQuotationFormId(null)
            setToastMessage("Quotation submitted successfully")
            setShowToast(true)
          }}
        />
      </div>
    )
  }

  if (viewingPRApp) {
    return (
      <div className={fullScreenContentClass}>
        <ProcInboxPRAppView pr={viewingPRApp.prData} onBack={() => setViewingPRApp(null)} />
      </div>
    )
  }

  if (showCommercialEvaluationFullPage) {
    return (
      <div className={mainContentClass}>
        <CommercialEvaluationPage
          onBack={() => setShowCommercialEvaluationFullPage(false)}
          onNavigateToVendorEvaluation={() => {
            setShowCommercialEvaluationFullPage(false)
            setEvaluationType("commercial")
            setViewingVendorEvaluation(true)
          }}
        />
      </div>
    )
  }

  if (viewingVendorEvaluation) {
    return (
      <div className={mainContentClass}>
        <VendorEvaluationPage onBack={() => setViewingVendorEvaluation(false)} evaluationType={evaluationType} />
      </div>
    )
  }

  if (viewingTechnicalEvaluation) {
    return (
      <div className={mainContentClass}>
        <TechnicalEvaluationPage
          onBack={() => setViewingTechnicalEvaluation(false)}
          onNavigateToVendorEvaluation={() => {
            setViewingTechnicalEvaluation(false)
            setEvaluationType("technical")
            setViewingVendorEvaluation(true)
          }}
        />
      </div>
    )
  }

  if (viewingEContract) {
    return (
      <div className={mainContentClass}>
        <EContractPage
          onBack={() => {
            setViewingEContract(false)
            setViewingDeclinedPO(false)
          }}
          rfpId={eContractContext.rfpId}
          poNumber={eContractContext.poNumber}
          context={eContractContext.context}
        />
      </div>
    )
  }

  if (viewingDeclinedPO) {
    return (
      <div className={mainContentClass}>
        <DeclinedPOReviewPage
          onBack={() => setViewingDeclinedPO(false)}
          onNavigateToEContract={handleNavigateToEContract}
        />
      </div>
    )
  }

  if (viewingCommitteeApp) {
    return (
      <div className={mainContentClass}>
        <ChecklistDetailView onBack={() => setViewingCommitteeApp(false)} />
      </div>
    )
  }

  if (viewingPRDetailsId) {
    return (
      <div className={mainContentClass}>
        <PRDetailPage prNumber={viewingPRDetailsId} onBack={() => setViewingPRDetailsId(null)} />
      </div>
    )
  }

  if (viewingSupplierFormId) {
    return (
      <div className={mainContentClass}>
        <ProcSupplierDetailsPage companyName={viewingSupplierFormId} onBack={() => setViewingSupplierFormId(null)} />
      </div>
    )
  }

  if (selectedPR) {
    return (
      <div className={mainContentClass}>
        <PRDetailPage prNumber={selectedPR} onBack={() => setSelectedPR(null)} />
      </div>
    )
  }

  if (isCreatingPR || editingPRNumber) {
    return (
      <div className={mainContentClass}>
        <CreatePRForm
          onBack={() => {
            setIsCreatingPR(false)
            setEditingPRNumber(null)
          }}
          editPrNumber={editingPRNumber || undefined}
        />
      </div>
    )
  }

  if (viewingQuotationFormId) {
    if (viewingQuotationFormId === "RFP_10000000108") {
      return (
        <div className={mainContentClass}>
          <ProcQuotationViewForm quotationId={viewingQuotationFormId} onBack={() => setViewingQuotationFormId(null)} />
        </div>
      )
    }

    return (
      <div className={mainContentClass}>
        <ProcQuotationCreateForm
          quotationId={viewingQuotationFormId}
          onBack={() => setViewingQuotationFormId(null)}
          onSuccess={handleQuotationFormSuccess}
        />
      </div>
    )
  }

  if (viewingRFPFormId) {
    if (viewingRFPFormId === "RFP_10000000108") {
      return (
        <div className={mainContentClass}>
          <ProcRFPViewForm rfpId={viewingRFPFormId} onBack={() => setViewingRFPFormId(null)} />
        </div>
      )
    }

    return (
      <div className={mainContentClass}>
        <ProcRFPCreateForm
          rfpId={viewingRFPFormId}
          onBack={() => setViewingRFPFormId(null)}
          onSuccess={handleRFPFormSuccess}
        />
      </div>
    )
  }

  if (viewingRFIFormId) {
    if (rfiView === "details") {
      return (
        <div className={mainContentClass}>
          <ProcRFIDetails
            rfiId={viewingRFIFormId}
            onBack={() => {
              setViewingRFIFormId(null)
              setRfiView("form")
            }}
            onViewRFI={() => setRfiView("vendor-list")}
          />
        </div>
      )
    }

    if (rfiView === "vendor-list") {
      return (
        <div className={mainContentClass}>
          <ProcRFIVendorList
            rfiId={viewingRFIFormId}
            onBack={() => {
              if (viewingRFIFormId === "RFP_10000000108") {
                setRfiView("details")
              } else {
                setViewingRFIFormId(null)
                setRfiView("form")
              }
            }}
          />
        </div>
      )
    }

    return (
      <div className={mainContentClass}>
        <ProcRFIForm
          rfiId={viewingRFIFormId}
          onBack={() => {
            setViewingRFIFormId(null)
            setRfiView("form")
          }}
          onSuccess={handleRFIFormSuccess}
        />
      </div>
    )
  }

  if (currentPage === "dashboard") {
    return (
      <div className={mainContentClass}>
        <ProcDashboardPage />
        {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    )
  }

  if (currentPage === "inbox") {
    return (
      <div className={mainContentClass}>
        <ProcInboxPage
          selectedInboxItemId={selectedInboxItemId}
          onInboxItemSelect={setSelectedInboxItemId}
          onViewRFI={handleViewRFI}
          onViewRFP={handleViewRFP}
          onViewQuotation={handleViewQuotation}
          onViewSupplier={handleViewSupplier}
          onViewPRDetails={handleViewPRDetails}
          onViewCommitteeApp={() => setViewingCommitteeApp(true)}
          onViewDeclinedPO={() => setViewingDeclinedPO(true)}
          onViewTechnicalEvaluation={() => setViewingTechnicalEvaluation(true)}
          onViewCommercialEvaluation={() => setShowCommercialEvaluationFullPage(true)}
          onViewEContract={handleViewEContract}
          onViewInboxRFI={handleViewInboxRFI}
          onViewInboxRFP={handleViewInboxRFP}
          onViewInboxQuotation={handleViewInboxQuotation}
          onViewPRApp={handleViewPRApp}
          selectedInboxTaskId={selectedInboxTaskId}
          onInboxTaskSelect={setSelectedInboxTaskId}
          onViewCreatePRForClosure={() => setIsCreatingPRForClosure(true)}
          onViewConfirmClosure={(poId) => setViewingConfirmClosureFormId(poId)}
          onViewCOCPageFullScreen={() => setShowCOCPageFullScreen(true)}
        />
        {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    )
  }

  if (currentPage === "rfps") {
    return (
      <div className={mainContentClass}>
        <ProcRfpsPage
          onCreatePR={() => setIsCreatingPR(true)}
          onViewPR={(prNumber) => setSelectedPR(prNumber)}
          onEditPR={(prNumber) => setEditingPRNumber(prNumber)}
        />
      </div>
    )
  }

  if (currentPage === "bids") {
    return (
      <div className={mainContentClass}>
        <BidsPage />
      </div>
    )
  }

  if (currentPage === "reports") {
    return (
      <div className={mainContentClass}>
        <ReportsPage />
      </div>
    )
  }

  if (currentPage === "purchase-orders") {
    return (
      <div className={mainContentClass}>
        <PurchaseOrdersPage />
      </div>
    )
  }

  if (currentPage === "cocs") {
    return (
      <div className={mainContentClass}>
        <CocsPage />
      </div>
    )
  }

  if (currentPage === "vendor-directory") {
    return (
      <div className={mainContentClass}>
        <ProcVendorDirectoryPage onVendorSelect={setSelectedVendorId} />
      </div>
    )
  }

  return (
    <div className={mainContentClass}>
      <ProcDashboardPage />
      {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )

  function handleViewRFP(rfpId: string) {
    console.log("[v0] Viewing RFP for:", rfpId)
    setViewingRFPFormId(rfpId)
  }

  function handleViewRFI(rfiId: string) {
    console.log("[v0] Viewing RFI for:", rfiId)

    if (rfiId === "RFP_10000000107") {
      setRfiView("form")
    } else if (rfiId === "RFP_10000000108") {
      setRfiView("details")
    } else {
      setRfiView("form")
    }

    setViewingRFIFormId(rfiId)
  }

  function handleViewQuotation(quotationId: string) {
    console.log("[v0] Viewing Quotation for:", quotationId)
    setViewingQuotationFormId(quotationId)
  }

  function handleViewSupplier(supplierId: string) {
    console.log("[v0] Viewing Supplier for:", supplierId)
    setViewingSupplierFormId(supplierId)
  }

  function handleViewPRDetails(prId: string) {
    console.log("[v0] Viewing PR Details for:", prId)
    setViewingPRDetailsId(prId)
  }

  function handleRFIFormSuccess() {
    console.log("[v0] RFI sent successfully, redirecting to inbox")
    setViewingRFIFormId(null)
    setRfiView("form")
  }

  function handleRFPFormSuccess() {
    console.log("[v0] RFP submitted successfully, showing toast and redirecting to inbox")
    setViewingRFPFormId(null)
    setToastMessage("Submitted successfully")
    setShowToast(true)
  }

  function handleQuotationFormSuccess() {
    console.log("[v0] Quotation submitted successfully, showing toast and redirecting to inbox")
    setViewingQuotationFormId(null)
    setToastMessage("Submitted successfully")
    setShowToast(true)
  }

  function handleNavigateToEContract(rfpId?: string, poNumber?: string) {
    console.log("[v0] Navigating to E-Contract from declined PO:", { rfpId, poNumber })
    setEContractContext({
      rfpId: rfpId || "RFP_10000000107",
      poNumber: poNumber || "PO 2025 014",
      context: "declined-po",
    })
    setViewingDeclinedPO(false)
    setViewingEContract(true)
  }

  function handleViewEContract(rfpId?: string, poNumber?: string) {
    console.log("[v0] Navigating directly to E-Contract:", { rfpId, poNumber })
    setEContractContext({
      rfpId: rfpId || "RFP_10000000107",
      poNumber: poNumber || "PO 2025 014",
      context: "declined-po",
    })
    setViewingEContract(true)
  }

  function handleViewInboxRFI(rfiId: string) {
    console.log("[v0] Viewing RFI from inbox app tray:", rfiId)
    setViewingInboxRFIFormId(rfiId)
  }

  function handleViewInboxRFP(rfpId: string) {
    console.log("[v0] Viewing RFP from inbox app tray:", rfpId)
    setViewingInboxRFPFormId(rfpId)
  }

  function handleViewInboxQuotation(quotationId: string) {
    console.log("[v0] Viewing Quotation from inbox app tray:", quotationId)
    setViewingInboxQuotationFormId(quotationId)
  }

  function handleViewPRApp(prId: string, prData: any) {
    console.log("[v0] Viewing PR App from inbox app tray:", prId)
    setViewingPRApp({ prId, prData })
  }
}
