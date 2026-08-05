"use client"

import { useState, useEffect, useRef } from "react"
import { fetchSuppliers, type SupplierData } from "@/app/actions/fetch-suppliers"
import { fetchSupplierByName } from "@/app/actions/fetch-supplier-by-name"
import {
  fetchPurchaseRequisitionsForInbox,
  type PRInboxItem,
} from "@/app/actions/fetch-purchase-requisitions-for-inbox"
import ProcSupplierDetailsPage from "./proc-supplier-details-page"
import RFPOverviewPage from "./rfp-overview-page"
import PRInboxSummary from "./pr-inbox-summary"
import DecisionModal from "./decision-modal"
import PODecisionDialog from "./po-decision-dialog"
import CommitteeAssignmentPage from "./committee-assignment-page"
import CommercialAssessmentPage from "./commercial-assessment-page"
import POClosureConfirmationPage from "./po-closure-confirmation-page"
import ProcessHistoryModal from "./process-history-modal"
import ProcReviewInvoicePage from "./proc-review-invoice-page" // Import Review Invoice Page
import ProcInvoiceAppPage from "./proc-invoice-app-page" // Import Invoice App Page
import ProcRatingFeedbackPage from "./proc-rating-feedback-page" // Import Rating Feedback Page
import ProcRatingAppPage from "./proc-rating-app-page" // Import Rating App Page
import ProcClosureReportPage from "./proc-closure-report-page" // Import Closure Report Page
import ProcClosureReportAppPage from "./proc-closure-report-app-page" // Import Closure Report App Page
import AssessmentDecisionDialog from "./assessment-decision-dialog"
import COCDecisionDialog from "./coc-decision-dialog" // Import COC Decision Dialog
import VendorEvaluationPage from "./vendor-evaluation-page"

// Added imports for icons
import { Search, Filter, MoreHorizontal, RefreshCw } from "lucide-react"
import React from "react"

interface InboxTask {
  id: string
  title: string
  department: string
  timestamp: string
  owner: string
  status: "In Progress" | "Open" | "Pending"
  statusColor: "orange" | "blue"
  rfpId: string
  process: string
  dueDate: string
  createdOn: string
  owner_name: string
  requestor: string
  requestor_manager: string
  budget_remaining: string
  budget_rfp: string
  budget_after_approval: string
  other_requests: string
  department_detail: string
  cost_centre: string
  purchase_group: string
  contract_duration: string
  scope_of_work?: string
  isSupplier?: boolean
  supplierId?: string
  isPR?: boolean
  prId?: string
  prData?: PRInboxItem
  priority?: number
}

interface ProcInboxPageProps {
  selectedInboxItemId?: string | null
  onInboxItemSelect?: (id: string | null) => void
  onViewRFI?: (rfiId: string) => void
  onViewRFP?: (rfpId: string) => void
  onViewQuotation?: (quotationId: string) => void
  onViewSupplier?: (supplierId: string) => void
  onViewPRDetails?: (prId: string) => void
  onViewCommitteeApp?: () => void
  onViewDeclinedPO?: () => void
  onViewTechnicalEvaluation?: () => void
  onViewCommercialEvaluation?: () => void
  onViewVendorEvaluation?: () => void
  onViewEContract?: (rfpId?: string, poNumber?: string) => void
  onViewInboxRFI?: (rfiId: string) => void
  onViewInboxRFP?: (rfpId: string) => void
  onViewInboxQuotation?: (quotationId: string) => void
  onViewPRApp?: (prId: string, prData: any) => void
  selectedInboxTaskId?: string | null
  onInboxTaskSelect?: (id: string | null) => void
  onViewCreatePRForClosure?: () => void
  onViewConfirmClosure?: (poId: string) => void
  onViewCOCPageFullScreen?: () => void
}

const mockTasks: InboxTask[] = [
  {
    id: "vendor-evaluation-task",
    title: "Enterprise Vendor Evaluation & Scorecard (Palm Tree IT, Accenture, Deloitte)",
    department: "Procurement & Strategic Sourcing",
    timestamp: "Today, 09:30 am",
    owner: "AI Solution Architect",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "VEN-SCORECARD-2026",
    process: "Vendor Evaluation",
    dueDate: "20 Aug 2026",
    createdOn: "05 Aug 2026",
    owner_name: "Procurement AI Engine",
    requestor: "Senior Procurement Officer",
    requestor_manager: "Chief Procurement Officer",
    budget_remaining: "SAR 120,000,000",
    budget_rfp: "SAR 45,000,000",
    budget_after_approval: "SAR 75,000,000",
    other_requests: "SAR 15,000,000",
    department_detail: "Vendor Management & Governance",
    cost_centre: "VEND-EVAL-01",
    purchase_group: "Strategic Sourcing",
    contract_duration: "Multi-Year",
    scope_of_work:
      "Enterprise SAP Ariba inspired Vendor Scorecard PoC evaluating vendors using historical JSON data and Gemini 2.5 Flash AI document analysis.",
    priority: 1,
  },
  {
    id: "checklist-4542",
    title: "Assign committee members & evaluation criteria for RFP #4542",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "RFP#4542",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Aslan Arfiz",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Streamline procurement workflows, manage vendor relationships, track purchases, and control budgets.",
    priority: 4, // Updated priority
  },
  {
    id: "declined-po-3442",
    title: "Prepare PO For RFP #3442",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "RFP_10000000107",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Aslam Arfiz",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Streamline procurement workflows, manage vendor relationships, track purchases, and control budgets.",
    priority: 7, // Updated priority
  },
  {
    id: "committee-assignment-4542",
    title: "Conduct Technical Assesement For RFP #343",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "RFP#4542",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Aslam Arfiz",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations.",
    priority: 5, // Updated priority
  },
  {
    id: "commercial-assessment-343",
    title: "Conduct Commercial assessment for RFP #343",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "RFP#343",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Aslam Arfiz",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Streamline procurement workflows, manage vendor relationships, track purchases, and control budgets.",
    priority: 6, // Updated priority
  },
  {
    id: "confirm-closure-3432",
    title: "Confirm closure/delivery of the item in PO #3432",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "PO#3432",
    process: "PO",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Aslam Arfiz",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work: "Confirm closure and delivery of items in the purchase order.",
    priority: 11, // Updated priority
  },
  {
    id: "review-invoice-3432",
    title: "Review & approve invoice of item in PO#3432",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "PO#3432",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Assan Adfa",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over  in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.",
    priority: 12, // Updated priority
  },
  {
    id: "rating-feedback-3432",
    title: "Provide rating & feedback for RFP #3432",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "RFP#3432",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Assan Adfa",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over  in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.",
    priority: 13, // Updated priority
  },
  {
    id: "closure-report-3432",
    title: "Prepare closure report for PO #3432",
    department: "IT Department - Service",
    timestamp: "Tuesday, 1:20 pm",
    owner: "Mohamad Aslam",
    status: "In Progress",
    statusColor: "orange",
    rfpId: "PO#3432",
    process: "RFP",
    dueDate: "24 Oct 2025",
    createdOn: "17 Oct 2025",
    owner_name: "Assan Adfa",
    requestor: "Johnny cage",
    requestor_manager: "Rebecca ferguson",
    budget_remaining: "SAR 15,000,000",
    budget_rfp: "SAR 5,000,000",
    budget_after_approval: "SAR 10,000,000",
    other_requests: "SAR 9,000,000",
    department_detail: "IT & Services",
    cost_centre: "ITRFP108657",
    purchase_group: "Service",
    contract_duration: "1Year 6 Months",
    scope_of_work:
      "Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over  in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.",
    priority: 14, // Updated priority
  },
]

const ProcInboxPage = ({
  selectedInboxItemId,
  onInboxItemSelect,
  onViewRFI,
  onViewRFP,
  onViewQuotation,
  onViewSupplier,
  onViewPRDetails,
  onViewCommitteeApp,
  onViewDeclinedPO,
  onViewTechnicalEvaluation,
  onViewCommercialEvaluation,
  onViewEContract,
  onViewInboxRFI,
  onViewInboxRFP,
  onViewInboxQuotation,
  onViewPRApp,
  selectedInboxTaskId,
  onInboxTaskSelect,
  onViewCreatePRForClosure,
  onViewConfirmClosure,
  onViewCOCPageFullScreen,
}: ProcInboxPageProps) => {
  const [selectedTask, setSelectedTask] = useState<InboxTask | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("inboxSelectedTask")
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [allTasks, setAllTasks] = useState<InboxTask[]>([]) // Initialize with empty array
  const [loading, setLoading] = useState(true)

  const [viewingSupplierDetails, setViewingSupplierDetails] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxViewingSupplierDetails") === "true"
    }
    return false
  })
  const [supplierDetailsData, setSupplierDetailsData] = useState(null)
  const [showChecklistDetail, setShowChecklistDetail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowChecklistDetail") === "true"
    }
    return false
  })
  const [showRFPOverview, setShowRFPOverview] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowRFPOverview") === "true"
    }
    return false
  })
  const [showDeclinedPODetails, setShowDeclinedPODetails] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowDeclinedPODetails") === "true"
    }
    return false
  })
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showCommitteeAssignment, setShowCommitteeAssignment] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowCommitteeAssignment") === "true"
    }
    return false
  })
  const [showCommercialAssignment, setShowCommercialAssignment] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowCommercialAssignment") === "true"
    }
    return false
  })
  const [showCommercialEvaluation, setShowCommercialEvaluation] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowCommercialEvaluation") === "true"
    }
    return false
  })
  const [showConfirmClosure, setShowConfirmClosure] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowConfirmClosure") === "true"
    }
    return false
  })
  const [showCOCAppFullPage, setShowCOCAppFullPage] = useState(false)
  const [showCOCDecisionDialog, setShowCOCDecisionDialog] = useState(false)
  const [showCommercialEvaluationFullPage, setShowCommercialEvaluationFullPage] = useState(false)
  const [showDeclinedPODecisionModal, setShowDeclinedPODecisionModal] = useState(false)
  const [showPRDecisionModal, setShowPRDecisionModal] = useState(false)
  const [showTechnicalDecisionModal, setShowTechnicalDecisionModal] = useState(false)
  const [showCommercialDecisionModal, setShowCommercialDecisionModal] = useState(false)
  const [selectedTechnicalDecision, setSelectedTechnicalDecision] = useState("")
  const [showProcessHistoryModal, setShowProcessHistoryModal] = useState(false)
  const [historyRfpNumber, setHistoryRfpNumber] = useState("")

  // Add new state variables for specific page views
  const [showPRFullPage, setShowPRFullPage] = useState(false)
  const [showTechnicalEvaluationFullPage, setShowTechnicalEvaluationFullPage] = useState(false)
  const [showCommercialAssessmentFullPage, setShowCommercialAssessmentFullPage] = useState(false)
  const [showCommitteeAssignmentFullPage, setShowCommitteeAssignmentFullPage] = useState(false)
  const [showReviewInvoice, setShowReviewInvoice] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowReviewInvoice") === "true"
    }
    return false
  })
  const [showInvoiceApp, setShowInvoiceApp] = useState(false)
  const [showRatingFeedback, setShowRatingFeedback] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowRatingFeedback") === "true"
    }
    return false
  })
  const [showRatingApp, setShowRatingApp] = useState(false)
  const [showClosureReport, setShowClosureReport] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxShowClosureReport") === "true"
    }
    return false
  })
  const [showClosureReportApp, setShowClosureReportApp] = useState(false)

  const [isRFPPublished, setIsRFPPublished] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsRFPPublished") === "true"
    }
    return false
  })
  const [isCommitteeCompleted, setIsCommitteeCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsCommitteeCompleted") === "true"
    }
    return false
  })
  const [isTechnicalCompleted, setIsTechnicalCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsTechnicalCompleted") === "true"
    }
    return false
  })
  const [isCommercialCompleted, setIsCommercialCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsCommercialCompleted") === "true"
    }
    return false
  })
  const [isPOPrepared, setIsPOPrepared] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsPOPrepared") === "true"
    }
    return false
  })
  const [isClosureConfirmed, setIsClosureConfirmed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsClosureConfirmed") === "true"
    }
    return false
  })
  const [isInvoiceReviewed, setIsInvoiceReviewed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsInvoiceReviewed") === "true"
    }
    return false
  })
  const [isRatingProvided, setIsRatingProvided] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxIsRatingProvided") === "true"
    }
    return false
  })

  const [taskEnableOrder, setTaskEnableOrder] = React.useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("inboxTaskEnableOrder")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return {}
        }
      }
    }
    return {}
  })
  const [enableCounter, setEnableCounter] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("inboxEnableCounter")
      if (saved) {
        try {
          return Number.parseInt(saved, 10)
        } catch {
          return 0
        }
      }
    }
    return 0
  })

  const [newlyAppearedTasks, setNewlyAppearedTasks] = React.useState<Set<string>>(new Set())

  const selectedTaskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedTask) {
        localStorage.setItem("inboxSelectedTask", JSON.stringify(selectedTask))
      } else {
        localStorage.removeItem("inboxSelectedTask")
      }
    }
  }, [selectedTask])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowChecklistDetail", String(showChecklistDetail))
    }
  }, [showChecklistDetail])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowRFPOverview", String(showRFPOverview))
    }
  }, [showRFPOverview])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowDeclinedPODetails", String(showDeclinedPODetails))
    }
  }, [showDeclinedPODetails])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowCommitteeAssignment", String(showCommitteeAssignment))
    }
  }, [showCommitteeAssignment])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowCommercialAssignment", String(showCommercialAssignment))
    }
  }, [showCommercialAssignment])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowCommercialEvaluation", String(showCommercialEvaluation))
    }
  }, [showCommercialEvaluation])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowConfirmClosure", String(showConfirmClosure))
    }
  }, [showConfirmClosure])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowReviewInvoice", String(showReviewInvoice))
    }
  }, [showReviewInvoice])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowRatingFeedback", String(showRatingFeedback))
    }
  }, [showRatingFeedback])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxShowClosureReport", String(showClosureReport))
    }
  }, [showClosureReport])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsRFPPublished", String(isRFPPublished))
    }
  }, [isRFPPublished])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsCommitteeCompleted", String(isCommitteeCompleted))
    }
  }, [isCommitteeCompleted])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsTechnicalCompleted", String(isTechnicalCompleted))
    }
  }, [isTechnicalCompleted])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsCommercialCompleted", String(isCommercialCompleted))
    }
  }, [isCommercialCompleted])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsPOPrepared", String(isPOPrepared))
    }
  }, [isPOPrepared])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsClosureConfirmed", String(isClosureConfirmed))
    }
  }, [isClosureConfirmed])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsInvoiceReviewed", String(isInvoiceReviewed))
    }
  }, [isInvoiceReviewed])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxIsRatingProvided", String(isRatingProvided))
    }
  }, [isRatingProvided])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxViewingSupplierDetails", String(viewingSupplierDetails))
    }
  }, [viewingSupplierDetails])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxTaskEnableOrder", JSON.stringify(taskEnableOrder))
    }
  }, [taskEnableOrder])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inboxEnableCounter", String(enableCounter))
    }
  }, [enableCounter])

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("[v0] Loading suppliers and PRs from server actions...")
        const [suppliers, prs] = await Promise.all([fetchSuppliers(), fetchPurchaseRequisitionsForInbox()])

        console.log("[v0] Suppliers received:", suppliers?.length || 0)
        console.log("[v0] PRs received:", prs?.length || 0)

        const newTasks: InboxTask[] = []

        if (suppliers && suppliers.length > 0) {
          const supplierTasks: InboxTask[] = suppliers.map((supplier: SupplierData) => ({
            id: `supplier_${supplier.id}`,
            title: `Verify & approve new supplier - ${supplier.company_name}`,
            department: "Supplier verification",
            timestamp: supplier.created_at
              ? new Date(supplier.created_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently",
            owner: ` ${supplier.primary_rep_first_name}`,
            status: "Open",
            statusColor: "blue" as const,
            rfpId: `SUPPLIER_${supplier.id.slice(0, 8).toUpperCase()}`,
            process: "Supplier",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            createdOn: supplier.created_at
              ? new Date(supplier.created_at).toLocaleDateString()
              : new Date().toLocaleDateString(),
            owner_name: "Aslam Arfiz",
            requestor: supplier.company_name,
            requestor_manager: "Rebecca ferguson",
            budget_remaining: "SAR 15,000,000",
            budget_rfp: "SAR 5,000,000",
            budget_after_approval: "SAR 10,000,000",
            other_requests: "SAR 9,000,000",
            department_detail: "Supplier Management",
            cost_centre: "SUPP001",
            purchase_group: "Supplier",
            contract_duration: "1Year 6 Months",
            isSupplier: true,
            supplierId: supplier.id,
            priority: 1, // Priority 1 for "Verify & Approve Supplier"
          }))
          newTasks.push(...supplierTasks)
        }

        if (prs && prs.length > 0) {
          const prTasks: InboxTask[] = prs.map((pr: PRInboxItem) => ({
            id: `pr_${pr.id}`,
            title: `Approve & Publish PR - ${pr.pr_number}`,
            department: pr.department || "Procurement",
            timestamp: pr.created_at
              ? new Date(pr.created_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently",
            owner: pr.requestor_name || "N/A",
            status: "Open",
            statusColor: "orange" as const,
            rfpId: pr.pr_number,
            process: "PR",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            createdOn: pr.created_at ? new Date(pr.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            owner_name: pr.requestor_name || "N/A",
            requestor: pr.project_name_arabic || pr.pr_number,
            requestor_manager: "N/A",
            budget_remaining: "N/A",
            budget_rfp: "N/A",
            budget_after_approval: "N/A",
            other_requests: "N/A",
            department_detail: pr.department || "Procurement",
            cost_centre: pr.budget_code_cost_centre || "N/A",
            purchase_group: "Procurement",
            contract_duration: "N/A",
            scope_of_work: pr.scope_of_work,
            isPR: true,
            prId: pr.id,
            prData: pr,
            priority: 2, // Priority 2 for "Approve & Publish PR"
          }))
          newTasks.push(...prTasks)
        }

        // Filtered out mockTasks from here, they are added conditionally below
        // newTasks.push(...mockTasks)

        newTasks.sort((a, b) => {
          const priorityA = a.priority ?? 999
          const priorityB = b.priority ?? 999
          return priorityA - priorityB
        })

        // Set all tasks first to determine initial selection
        setAllTasks(newTasks)

        // Conditionally add mock tasks after fetching dynamic data
        const initialTasks = [...newTasks]
        // Add mock tasks with updated priorities to ensure they are ordered correctly
        initialTasks.push(
          ...mockTasks.map((task) => ({
            ...task,
            priority: task.priority || 999, // Ensure mock tasks have a priority
          })),
        )

        initialTasks.sort((a, b) => {
          const priorityA = a.priority ?? 999
          const priorityB = b.priority ?? 999
          return priorityA - priorityB
        })

        setAllTasks(initialTasks)

        if (selectedInboxTaskId) {
          const previouslySelectedTask = initialTasks.find((task) => task.id === selectedInboxTaskId)
          if (previouslySelectedTask) {
            setSelectedTask(previouslySelectedTask)
          }
        }
        // Removed: else if (newTasks.length > 0) { setSelectedTask(newTasks[0]) }
      } catch (err) {
        console.error("[v0] Error loading data:", err)
        // Use filtered mockTasks if server actions fail
        const initialTasks = [...mockTasks]
        setAllTasks(initialTasks)

        if (selectedInboxTaskId) {
          const previouslySelectedTask = initialTasks.find((task) => task.id === selectedInboxTaskId)
          if (previouslySelectedTask) {
            setSelectedTask(previouslySelectedTask)
          }
        }
        // Removed: else { setSelectedTask(mockTasks[0]) }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedInboxTaskId, onInboxTaskSelect])

  useEffect(() => {
    if (selectedTaskRef.current) {
      selectedTaskRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [selectedTask])

  const visibleTasks = allTasks.filter((task) => {
    if (task.id === "vendor-evaluation-task") {
      return true
    }
    // Always show supplier tasks (priority 1) and PR tasks (priority 2)
    if (task.priority === 1 || task.priority === 2) {
      return true
    }

    // Show committee assignment task only after RFP is published
    if (task.id === "checklist-4542") {
      return isRFPPublished
    }

    // Show technical assessment task only after committee is completed
    if (task.id === "committee-assignment-4542") {
      return isCommitteeCompleted
    }

    // Show commercial assessment task only after technical is completed
    if (task.id === "commercial-assessment-343") {
      return isTechnicalCompleted
    }

    // Show prepare PO task only after commercial is completed
    if (task.id === "declined-po-3442") {
      return isCommercialCompleted
    }

    // Show confirm closure task only after PO is prepared
    if (task.id === "confirm-closure-3432") {
      return isPOPrepared
    }

    // Show review invoice task only after closure is confirmed
    if (task.id === "review-invoice-3432") {
      return isClosureConfirmed
    }

    // Show rating feedback task only after invoice is reviewed
    if (task.id === "rating-feedback-3432") {
      return isInvoiceReviewed
    }

    // Show closure report task only after rating is provided
    if (task.id === "closure-report-3432") {
      return isRatingProvided
    }

    // Hide all other tasks initially
    return false
  })

  // Filter tasks based on search query
  const filteredTasks = allTasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleOpenSupplierDetails = async (companyName: string) => {
    try {
      const data = await fetchSupplierByName(companyName)
      setSupplierDetailsData(data)
      setViewingSupplierDetails(true)
    } catch (err) {
      console.error("[v0] Error loading supplier details:", err)
    }
  }

  const handleBackFromSupplierDetails = () => {
    setViewingSupplierDetails(false)
    setSupplierDetailsData(null)
  }

  const handleBackFromRFPOverview = () => {
    setShowRFPOverview(false)
    setShowChecklistDetail(false)
  }

  const handleNavigateToCommittee = () => {
    onViewCommitteeApp?.()
  }

  const handleViewPRDetailsPage = (prId: string) => {
    const pr = allTasks.find((task) => task.prId === prId)?.prData
    if (pr) {
      onViewPRDetails?.(prId)
    }
  }

  const handleDecisionComplete = () => {
    setShowDecisionModal(false)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleDeclinedPODecisionComplete = () => {
    setShowDeclinedPODecisionModal(false)
    setShowSuccessToast(true)
    // </CHANGE> Trigger PO prepared callback to show next task
    handlePOPrepared()
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handlePRDecisionComplete = () => {
    setShowPRDecisionModal(false)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleTechnicalDecisionComplete = () => {
    setShowTechnicalDecisionModal(false)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleCommercialDecisionComplete = () => {
    setShowCommercialDecisionModal(false)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleTaskSelect = (task: InboxTask) => {
    setSelectedTask(task)
    // Reset all view states when selecting a new task
    setShowCOCAppFullPage(false)
    setShowCommercialEvaluationFullPage(false)
    setShowPRFullPage(false)
    setShowTechnicalEvaluationFullPage(false)
    setShowCommercialAssessmentFullPage(false)
    setShowCommitteeAssignmentFullPage(false)
    setViewingSupplierDetails(false)
    setSupplierDetailsData(null)
    setShowReviewInvoice(false)
    setShowInvoiceApp(false)
    setShowRatingFeedback(false)
    setShowRatingApp(false)
    // Reset closure report states
    setShowClosureReport(false)
    setShowClosureReportApp(false)
    setShowConfirmClosure(false) // Reset confirm closure view
    setShowRFPOverview(false) // Reset RFP overview view
    setShowChecklistDetail(false) // Reset checklist detail view
    setShowDeclinedPODetails(false) // Reset declined PO details view
    setShowCommitteeAssignment(false) // Reset committee assignment view
    setShowCommercialAssignment(false) // Reset commercial assignment view
    setShowCommercialEvaluation(false) // Reset commercial evaluation view
    setShowCOCDecisionDialog(false) // Reset COC decision dialog

    if (task.isSupplier && task.requestor) {
      handleOpenSupplierDetails(task.requestor)
    }

    // Handle conditional rendering based on task ID
    if (task.id === "confirm-closure-3432") {
      setShowConfirmClosure(true)
    } else if (task.id === "review-invoice-3432") {
      setShowReviewInvoice(true)
    } else if (task.id === "rating-feedback-3432") {
      setShowRatingFeedback(true)
    } else if (task.id === "closure-report-3432") {
      setShowClosureReport(true)
    } else if (task.id === "commercial-assessment-343") {
      setShowCommercialAssignment(true)
    } else if (task.id === "committee-assignment-4542") {
      setShowCommitteeAssignment(true)
    } else if (task.id === "declined-po-3442") {
      setShowDeclinedPODetails(true)
    } else if (task.id === "checklist-4542") {
      setShowChecklistDetail(true)
      setShowRFPOverview(true)
    }
  }

  const handleRFPPublished = React.useCallback(() => {
    console.log("[v0] RFP published, showing committee assignment task")
    setIsRFPPublished(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "checklist-4542": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("checklist-4542"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "checklist-4542")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("checklist-4542")
        return next
      })
    }, 3000) // Increased animation duration to 3 seconds
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handleCommitteeCompleted = React.useCallback(() => {
    console.log("[v0] Committee assignment completed, showing technical evaluation task")
    setIsCommitteeCompleted(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "committee-assignment-4542": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("committee-assignment-4542"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "committee-assignment-4542")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("committee-assignment-4542")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handleTechnicalCompleted = React.useCallback(() => {
    console.log("[v0] Technical evaluation completed, showing commercial evaluation task")
    setIsTechnicalCompleted(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "commercial-assessment-343": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("commercial-assessment-343"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "commercial-assessment-343")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("commercial-assessment-343")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handleCommercialCompleted = React.useCallback(() => {
    console.log("[v0] Commercial evaluation completed, showing prepare PO task")
    setIsCommercialCompleted(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "declined-po-3442": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("declined-po-3442"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "declined-po-3442")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("declined-po-3442")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handlePOPrepared = React.useCallback(() => {
    console.log("[v0] PO prepared, showing closure confirmation task")
    setIsPOPrepared(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "confirm-closure-3432": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("confirm-closure-3432"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "confirm-closure-3432")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("confirm-closure-3432")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handleClosureConfirmed = React.useCallback(() => {
    console.log("[v0] Closure confirmed, showing invoice review task")
    setIsClosureConfirmed(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "review-invoice-3432": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("review-invoice-3432"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "review-invoice-3432")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("review-invoice-3432")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handleInvoiceReviewed = React.useCallback(() => {
    console.log("[v0] Invoice reviewed, showing rating feedback task")
    setIsInvoiceReviewed(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "rating-feedback-3432": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("rating-feedback-3432"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "rating-feedback-3432")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("rating-feedback-3432")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const handleRatingProvided = React.useCallback(() => {
    console.log("[v0] Rating provided, showing closure report task")
    setIsRatingProvided(true)
    setEnableCounter((prev) => prev + 1)
    setTaskEnableOrder((prev) => ({ ...prev, "closure-report-3432": enableCounter + 1 }))
    setNewlyAppearedTasks((prev) => new Set(prev).add("closure-report-3432"))

    setTimeout(() => {
      const newTask = allTasks.find((task) => task.id === "closure-report-3432")
      if (newTask) {
        setSelectedTask(newTask)
        handleTaskSelect(newTask)
      }
    }, 100)

    setTimeout(() => {
      setNewlyAppearedTasks((prev) => {
        const next = new Set(prev)
        next.delete("closure-report-3432")
        return next
      })
    }, 3000)
  }, [enableCounter, allTasks]) // Removed handleTaskSelect from dependencies

  const sortedVisibleTasks = React.useMemo(() => {
    return [...visibleTasks].sort((a, b) => {
      const orderA = taskEnableOrder[a.id] || 0
      const orderB = taskEnableOrder[b.id] || 0

      // If both have enable orders, sort by order (newest first)
      if (orderA > 0 && orderB > 0) {
        return orderB - orderA
      }

      // If only one has an enable order, it goes first
      if (orderA > 0) return -1
      if (orderB > 0) return 1

      // Otherwise sort by priority
      return a.priority - b.priority
    })
  }, [visibleTasks, taskEnableOrder])

  // Early return for full-screen invoice app view
  if (showInvoiceApp && selectedTask?.id === "review-invoice-3432") {
    return (
      <ProcInvoiceAppPage
        poId={selectedTask.rfpId}
        onBack={() => {
          setShowInvoiceApp(false)
          setShowReviewInvoice(true)
        }}
      />
    )
  }

  // Added full-screen rendering for closure report app
  if (showClosureReportApp) {
    return (
      <ProcClosureReportAppPage
        onBack={() => {
          setShowClosureReportApp(false)
          setShowClosureReport(true)
        }}
      />
    )
  }

  if (showRatingApp) {
    return (
      <ProcRatingAppPage
        onBack={() => {
          setShowRatingApp(false)
          setShowRatingFeedback(true)
        }}
      />
    )
  }

  // Helper functions for navigating back and handling history
  const handleBackToInbox = () => {
    setSelectedTask(null)
    // Reset all view states
    setShowCOCAppFullPage(false)
    setShowCommercialEvaluationFullPage(false)
    setShowPRFullPage(false)
    setShowTechnicalEvaluationFullPage(false)
    setShowCommercialAssessmentFullPage(false)
    setShowCommitteeAssignmentFullPage(false)
    setViewingSupplierDetails(false)
    setSupplierDetailsData(null)
    setShowReviewInvoice(false)
    setShowInvoiceApp(false)
    setShowRatingFeedback(false)
    setShowRatingApp(false)
    setShowClosureReport(false)
    setShowClosureReportApp(false)
    setShowConfirmClosure(false)
    setShowRFPOverview(false)
    setShowChecklistDetail(false)
    setShowDeclinedPODetails(false)
    setShowCommitteeAssignment(false)
    setShowCommercialAssignment(false)
    setShowCommercialEvaluation(false)
    setShowCOCDecisionDialog(false) // Reset COC decision dialog
  }

  const handleHistory = (rfpNumber: string) => {
    setHistoryRfpNumber(rfpNumber)
    setShowProcessHistoryModal(true)
  }

  // Define a click handler for tasks
  const handleTaskClick = (task: InboxTask) => {
    handleTaskSelect(task)
    onInboxTaskSelect?.(task.id)
  }

  return (
    <>
      {showCOCAppFullPage ? (
        <POClosureConfirmationPage
          poId={selectedTask?.rfpId || "PO#3432"}
          onBack={() => {
            setShowCOCAppFullPage(false)
            setShowConfirmClosure(true)
          }}
          onSuccess={() => {
            console.log("[v0] Closure confirmed, showing review invoice task")
            handleClosureConfirmed()
            setShowCOCAppFullPage(false)
            setShowConfirmClosure(false)
          }}
        />
      ) : (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {" "}
          {/* Changed bg-white to bg-gray-50 for consistency */}
          {showSuccessToast && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
              <div className="bg-white border-l-4 border-green-600 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[400px]">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-check-line text-green-600 text-xl" />
                </div>
                <p className="text-sm font-medium text-gray-900">RFP Approved Successfully</p>
                <button
                  onClick={() => setShowSuccessToast(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
          )}
          <DecisionModal
            isOpen={showDecisionModal}
            onClose={() => setShowDecisionModal(false)}
            onComplete={handleDecisionComplete}
          />
          <PODecisionDialog
            isOpen={showDeclinedPODecisionModal}
            onClose={() => setShowDeclinedPODecisionModal(false)}
            onComplete={handleDeclinedPODecisionComplete}
          />
          <DecisionModal
            isOpen={showPRDecisionModal}
            onClose={() => setShowPRDecisionModal(false)}
            onComplete={handlePRDecisionComplete}
          />
          {showTechnicalDecisionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
              <AssessmentDecisionDialog
                onComplete={handleTechnicalDecisionComplete}
                onCancel={() => setShowTechnicalDecisionModal(false)}
                onDecisionChange={setSelectedTechnicalDecision}
              />
            </div>
          )}
          <DecisionModal
            isOpen={showCommercialDecisionModal}
            onClose={() => setShowCommercialDecisionModal(false)}
            onComplete={handleCommercialDecisionComplete}
          />
          <ProcessHistoryModal
            isOpen={showProcessHistoryModal}
            onClose={() => setShowProcessHistoryModal(false)}
            rfpNumber={historyRfpNumber}
          />
          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Task List */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none text-sm flex-1"
                    />
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCw size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <style>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                  .animate-highlight-pulse {
                    animation: highlight-pulse 3s ease-in-out forwards;
                  }
                  @keyframes highlight-pulse {
                    0% {
                      box-shadow: 0 0 0px rgba(59, 130, 246, 0.3);
                      transform: scale(1);
                    }
                    50% {
                      box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
                      transform: scale(1.02);
                    }
                    100% {
                      box-shadow: 0 0 0px rgba(59, 130, 246, 0);
                      transform: scale(1);
                    }
                  }
                  .animate-slide-in-top {
                    animation: slide-in-top 1s ease-out forwards;
                  }
                  @keyframes slide-in-top {
                    from {
                      transform: translateY(-100%);
                      opacity: 0;
                    }
                    to {
                      transform: translateY(0);
                      opacity: 1;
                    }
                  }
                `}</style>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500">Loading data...</p>
                    </div>
                  </div>
                ) : sortedVisibleTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">No tasks available</div>
                ) : (
                  <div className="space-y-1">
                    {sortedVisibleTasks.map((task) => {
                      const isSelected = selectedTask?.id === task.id
                      const isNewlyAppeared = newlyAppearedTasks.has(task.id)
                      return (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={`flex items-start gap-3 p-3 transition-all duration-300 border-b border-gray-100 ${
                            isSelected ? "bg-green-50" : "hover:bg-gray-50"
                          } ${isNewlyAppeared ? "animate-highlight-pulse animate-slide-in-top" : ""}`}
                          style={{
                            boxShadow: isNewlyAppeared ? "0 0 20px rgba(59, 130, 246, 0.3)" : undefined,
                          }}
                        >
                          {/* Left side: Status dot, title, and owner */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                task.statusColor === "orange" ? "bg-orange-500" : "bg-blue-500"
                              } ${isNewlyAppeared ? "animate-pulse" : ""}`}
                            />
                            <div className="flex-1 min-w-0">
                              {isNewlyAppeared && (
                                <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full mb-1 animate-pulse">
                                  🎉 NEW TASK
                                </span>
                              )}
                              <h3
                                className={`font-medium text-sm mb-1 transition-colors ${
                                  isSelected ? "text-[#1B733D]" : "text-gray-900 hover:text-[#1B733D]"
                                }`}
                              >
                                {task.title}
                              </h3>
                              <p className="text-xs text-gray-700">{task.owner}</p>
                            </div>
                          </div>

                          {/* Right side: Priority badge and timestamp */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                                task.priority === 1
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === 2
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              Priority: {task.priority === 1 ? "High" : task.priority === 2 ? "Urgent" : "Medium"}
                            </span>
                            <p className="text-xs text-gray-500 whitespace-nowrap">{task.timestamp}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Task Details */}
            <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
              {selectedTask ? (
                <div className={selectedTask.id === "checklist-4542" && showRFPOverview ? "h-full" : (selectedTask.id === "vendor-evaluation-task" ? "p-0 h-full overflow-hidden" : "p-8")}>
                  {selectedTask.id === "vendor-evaluation-task" ? (
                    <VendorEvaluationPage
                      onBack={() => {
                        if (onViewVendorEvaluation) {
                          onViewVendorEvaluation()
                        } else {
                          setSelectedTask(null)
                        }
                      }}
                    />
                  ) : selectedTask.id === "confirm-closure-3432" && showConfirmClosure ? (
                    <div className="p-8" style={{ backgroundColor: "#F7F8FA" }}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                            {selectedTask.rfpId}
                          </h2>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-message-2-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setHistoryRfpNumber(selectedTask.rfpId)
                              setShowProcessHistoryModal(true)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-history-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => setShowCOCDecisionDialog(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h3 className="text-lg font-medium mb-4" style={{ color: "#000525" }}>
                          Confirm closure/delivery of the item in the PO #3432
                        </h3>
                        <span
                          className="inline-block px-3 py-1 rounded text-sm font-medium"
                          style={{ backgroundColor: "#FFF3E0", color: "#F57C00" }}
                        >
                          In progress
                        </span>

                        <div className="grid grid-cols-4 gap-6 mt-6">
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Owner
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              Aslam Arfiz
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Process
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              RFP
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Due date
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              24 Oct 2025
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Created on
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              17 Oct 2025
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
                          App tray
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-3-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                PR App
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>
                          <div
                            onClick={() => setShowCOCAppFullPage(true)}
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-computer-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                COC App
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
                          Additional details
                        </h4>
                        <div
                          className="bg-white rounded-lg p-6 mb-6"
                          style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                        >
                          <h5 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                            Leadership Development Training Program - 10000000107
                          </h5>
                          <div className="grid grid-cols-4 gap-6">
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Department
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                IT & Services
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Cost Centre
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                ITRFP108657
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Purchase Group
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                Service
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Contract Duration
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                1 Year 6 Months
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                          Scope Of Work
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
                          Targeted at mid-level managers, emerging leaders, and high-potential employees, the program
                          will run over in a blended format of classroom/virtual learning and on-the-job practice.
                          Success will be measured by participant feedback, leadership assessments, and observable
                          improvements in team performance, ultimately driving stronger leadership effectiveness and
                          organizational growth.
                        </p>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                              Requestor details
                            </h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Requested By
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  Johnny cage
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Requestor's Manager
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  Rebecca ferguson
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                              Dates
                            </h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Created Date
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  12 Jan 2025
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Expected Delivery Date
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  12 Jun 2026
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>
                          Goods requested
                        </h4>

                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>
                              1,015,000
                            </p>
                            <p className="text-sm" style={{ color: "#5F6C81" }}>
                              Total estimated cost
                            </p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>
                              101,500
                            </p>
                            <p className="text-sm" style={{ color: "#5F6C81" }}>
                              Tax Amount
                            </p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>
                              1,116,500
                            </p>
                            <p className="text-sm" style={{ color: "#5F6C81" }}>
                              PR Estimated Price (With Tax)
                            </p>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <table className="w-full">
                            <thead style={{ backgroundColor: "#1B733D" }}>
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-white">Item description</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-white">Quantity</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-white">Units of measure</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-white">Unit price</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-white">Total price</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  Dell Latitude Laptop
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  10
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  Pcs
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  100,000
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  1,000,000
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  Docking Station
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  10
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  Pcs
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  1,000
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  10,000
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  Wireless Mouse
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  10
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  Pcs
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  500
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>
                                  5,000
                                </td>
                              </tr>
                              <tr style={{ backgroundColor: "#F7F8FA" }}>
                                <td
                                  className="px-6 py-4 text-sm font-semibold"
                                  style={{ color: "#000525" }}
                                  colSpan={4}
                                >
                                  Total cost
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#000525" }}>
                                  1,015,000
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
                        <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>
                          Vendor overview
                        </h4>

                        {/* First row: Vendor info and Budget chart side by side */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                          {/* Left side: Vendor info */}
                          <div className="flex flex-col items-center">
                            <div
                              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4"
                              style={{ backgroundColor: "#C25B7C" }}
                            >
                              KT
                            </div>
                            <h5 className="text-xl font-semibold mb-2" style={{ color: "#1B733D" }}>
                              Kaar Technologies Private Limited
                            </h5>
                            <span
                              className="inline-block px-4 py-1 rounded text-sm font-medium"
                              style={{ backgroundColor: "#E0F2F1", color: "#00897B" }}
                            >
                              Within Budget
                            </span>
                          </div>

                          {/* Right side: Budget chart */}
                          <div>
                            <h5 className="text-lg font-semibold mb-4" style={{ color: "#1B733D" }}>
                              Budget utilization overview
                            </h5>
                            <div className="flex items-center justify-center">
                              <div className="relative w-64 h-64">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E0E0E0" strokeWidth="8" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#FFA726"
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="25.12"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-3xl font-semibold" style={{ color: "#000525" }}>
                                    90,000,00
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-8 mt-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFA726" }} />
                                <div>
                                  <p className="text-xs" style={{ color: "#5F6C81" }}>
                                    Utilized Price (SAR)
                                  </p>
                                  <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                                    90,000,000
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E0E0E0" }} />
                                <div>
                                  <p className="text-xs" style={{ color: "#5F6C81" }}>
                                    Total price (SAR)
                                  </p>
                                  <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                                    100,000,000
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Bank Name
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              Saudi National Bank (SNB)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Account Number
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              123456789012
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              IBAN Number
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              SA1230000001234567890012
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Tax Number
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              3001234567
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Reconciliation Account
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              4000001234
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Initial Guarantee (SAR)
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              10,000
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Phone Number
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              +966 501234567
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Email
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              kaartech@kaatech.com
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Price Preference (SAR)
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#000525" }}>
                              100,000,000
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : // Render POClosureConfirmationPage when showCOCAppFullPage is true
                  selectedTask.id === "confirm-closure-3432" && showCOCAppFullPage ? (
                    <POClosureConfirmationPage
                      poId={selectedTask.rfpId}
                      onBack={() => {
                        setShowCOCAppFullPage(false)
                        setShowConfirmClosure(true)
                      }}
                      onSuccess={() => {
                        console.log("[v0] Closure confirmed, showing review invoice task")
                        handleClosureConfirmed()
                        setShowCOCAppFullPage(false)
                        setShowConfirmClosure(false)
                      }}
                    />
                  ) : selectedTask.id === "confirm-closure-3432" ? (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                          Confirm closure/delivery of the item in the PO #3432
                        </h2>
                        <button
                          onClick={() => setShowConfirmClosure(true)}
                          className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                          style={{ backgroundColor: "#1B733D" }}
                        >
                          View Details
                        </button>
                      </div>

                      <p className="text-gray-600">Click "View Details" to see the full task information.</p>
                    </div>
                  ) : selectedTask.id === "review-invoice-3432" && showReviewInvoice ? (
                    <ProcReviewInvoicePage
                      poId={selectedTask.rfpId}
                      onBack={() => setShowReviewInvoice(false)}
                      onViewInvoiceApp={() => {
                        setShowReviewInvoice(false)
                        setShowInvoiceApp(true)
                      }}
                      onInvoiceReviewed={handleInvoiceReviewed}
                    />
                  ) : selectedTask.id === "rating-feedback-3432" && showRatingFeedback ? (
                    <ProcRatingFeedbackPage
                      rfpId={selectedTask.rfpId}
                      onBack={() => setShowRatingFeedback(false)}
                      onViewRatingApp={() => {
                        setShowRatingFeedback(false)
                        setShowRatingApp(true)
                      }}
                      onRatingProvided={handleRatingProvided}
                    />
                  ) : // Conditional rendering for closure report pages
                  selectedTask.id === "closure-report-3432" && showClosureReport ? (
                    <ProcClosureReportPage
                      poId={selectedTask.rfpId}
                      onBack={() => setShowClosureReport(false)}
                      onViewClosureReport={() => {
                        setShowClosureReport(false)
                        setShowClosureReportApp(true)
                      }}
                      onClosureReportCompleted={() => {
                        console.log("[v0] Closure report completed - workflow finished!")
                      }}
                    />
                  ) : selectedTask.id === "commercial-assessment-343" && showCommercialAssignment ? (
                    <CommitteeAssignmentPage
                      assessmentType="commercial"
                      onBack={() => setShowCommercialAssignment(false)}
                      onNavigateToCommercialEvaluation={() => {
                        setShowCommercialAssignment(false)
                        setShowCommercialEvaluation(false)
                        onViewCommercialEvaluation?.()
                      }}
                      onHistory={() => {
                        setHistoryRfpNumber(selectedTask.rfpId)
                        setShowProcessHistoryModal(true)
                      }}
                      onCommercialCompleted={handleCommercialCompleted}
                    />
                  ) : selectedTask.id === "commercial-assessment-343" && showCommercialEvaluation ? (
                    <CommercialAssessmentPage
                      onBack={() => {
                        setShowCommercialEvaluation(false)
                        setShowCommercialAssignment(true)
                      }}
                      onNavigateToVendorEvaluation={() => {
                        onViewCommercialEvaluation?.()
                      }}
                      onHistory={() => {
                        setHistoryRfpNumber(selectedTask.rfpId)
                        setShowProcessHistoryModal(true)
                      }}
                    />
                  ) : selectedTask.isPR && selectedTask.prData ? (
                    <PRInboxSummary
                      pr={selectedTask.prData}
                      onViewDetails={() => handleViewPRDetailsPage(selectedTask.prId!)}
                      onViewInboxRFI={onViewInboxRFI}
                      onViewInboxRFP={onViewInboxRFP}
                      onViewInboxQuotation={onViewInboxQuotation}
                      onDecide={() => setShowPRDecisionModal(true)}
                      onHistory={() => {
                        setHistoryRfpNumber(selectedTask.rfpId)
                        setShowProcessHistoryModal(true)
                      }}
                      onRFPPublished={handleRFPPublished} // Pass the handler here
                    />
                  ) : selectedTask.id === "checklist-4542" && showRFPOverview ? (
                    <RFPOverviewPage
                      onBack={handleBackFromRFPOverview}
                      onNavigateToCommittee={handleNavigateToCommittee}
                      onCommitteeCompleted={handleCommitteeCompleted}
                    />
                  ) : selectedTask.id === "committee-assignment-4542" && showCommitteeAssignment ? (
                    <CommitteeAssignmentPage
                      assessmentType="technical"
                      onBack={() => setShowCommitteeAssignment(false)}
                      onNavigateToTechnicalEvaluation={onViewTechnicalEvaluation}
                      onTechnicalCompleted={handleTechnicalCompleted}
                      onHistory={() => {
                        setHistoryRfpNumber(selectedTask.rfpId)
                        setShowProcessHistoryModal(true)
                      }}
                    />
                  ) : // Show declined PO details inline when selected
                  selectedTask.id === "declined-po-3442" && showDeclinedPODetails ? (
                    <div className="p-8" style={{ backgroundColor: "#F7F8FA" }}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                            {selectedTask.rfpId}
                          </h2>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-message-2-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setHistoryRfpNumber(selectedTask.rfpId)
                              setShowProcessHistoryModal(true)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-history-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => setShowDeclinedPODecisionModal(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h3 className="text-lg font-medium mb-4" style={{ color: "#000525" }}>
                          Review and approve PO for RFP #4353
                        </h3>
                        <span
                          className="inline-block px-3 py-1 rounded text-sm font-medium"
                          style={{ backgroundColor: "#FFF3E0", color: "#F57C00" }}
                        >
                          In progress
                        </span>

                        <div className="grid grid-cols-4 gap-6 mt-6">
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Owner
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              Mohamad Aslam
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Process
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              RFP
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Due date
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              24 Oct 2025
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Created on
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              17 Oct 2025
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
                          App tray
                        </h4>
                        <div className="grid grid-cols-4 gap-4">
                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-3-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                PR App
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                Technical evaluation app
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-2-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                Commercial evaluation app
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>

                          <div
                            onClick={() => onViewEContract?.("RFP_10000000107", "PO 2025 014")}
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-text-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                E- Contract
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
                          Additional details
                        </h4>
                        <div
                          className="bg-white rounded-lg p-6 mb-6"
                          style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                        >
                          <h5 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                            Leadership Development Training Program - 10000000107
                          </h5>
                          <div className="grid grid-cols-4 gap-6">
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Department
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                IT & Services
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Cost Centre
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                ITRFP108657
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Purchase Group
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                Service
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Contract Duration
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                1 Year 6 Months
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                          Scope Of Work
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
                          Targeted at mid-level managers, emerging leaders, and high-potential employees, the program
                          will run over in a blended format of classroom/virtual learning and on-the-job practice.
                          Success will be measured by participant feedback, leadership assessments, and observable
                          improvements in team performance, ultimately driving stronger leadership effectiveness and
                          organizational growth.
                        </p>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                              Requestor details
                            </h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Requested By
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  Johnny cage
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Requestor's Manager
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  Rebecca ferguson
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                              Dates
                            </h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Created Date
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  12 Jan 2025
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Expected Delivery Date
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  12 Jun 2026
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : // Re-added the conditional rendering for the PR app view within PRInboxSummary
                  selectedTask.isPR && selectedTask.prData ? (
                    <PRInboxSummary
                      pr={selectedTask.prData}
                      onViewDetails={() => handleViewPRDetailsPage(selectedTask.prId!)}
                      onViewInboxRFI={onViewInboxRFI}
                      onViewInboxRFP={onViewInboxRFP}
                      onViewInboxQuotation={onViewInboxQuotation}
                      onDecide={() => setShowPRDecisionModal(true)}
                      onHistory={() => {
                        setHistoryRfpNumber(selectedTask.rfpId)
                        setShowProcessHistoryModal(true)
                      }}
                      onViewPRApp={onViewPRApp} // Pass the new handler
                      onRFPPublished={handleRFPPublished}
                    />
                  ) : selectedTask.id === "checklist-4542" && showRFPOverview ? (
                    <RFPOverviewPage
                      onBack={handleBackFromRFPOverview}
                      onNavigateToCommittee={handleNavigateToCommittee}
                      onCommitteeCompleted={handleCommitteeCompleted}
                    />
                  ) : selectedTask.id === "committee-assignment-4542" && showCommitteeAssignment ? (
                    <CommitteeAssignmentPage
                      assessmentType="technical"
                      onBack={() => setShowCommitteeAssignment(false)}
                      onNavigateToTechnicalEvaluation={onViewTechnicalEvaluation}
                      onTechnicalCompleted={handleTechnicalCompleted}
                      onHistory={() => {
                        setHistoryRfpNumber(selectedTask.rfpId)
                        setShowProcessHistoryModal(true)
                      }}
                    />
                  ) : // Show declined PO details inline when selected
                  selectedTask.id === "declined-po-3442" && showDeclinedPODetails ? (
                    <div className="p-8" style={{ backgroundColor: "#F7F8FA" }}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                            {selectedTask.rfpId}
                          </h2>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-message-2-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setHistoryRfpNumber(selectedTask.rfpId)
                              setShowProcessHistoryModal(true)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-history-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => setShowDeclinedPODecisionModal(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h3 className="text-lg font-medium mb-4" style={{ color: "#000525" }}>
                          Review and approve PO for RFP #4353
                        </h3>
                        <span
                          className="inline-block px-3 py-1 rounded text-sm font-medium"
                          style={{ backgroundColor: "#FFF3E0", color: "#F57C00" }}
                        >
                          In progress
                        </span>

                        <div className="grid grid-cols-4 gap-6 mt-6">
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Owner
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              Mohamad Aslam
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Process
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              RFP
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Due date
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              24 Oct 2025
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                              Created on
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#000525" }}>
                              17 Oct 2025
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
                          App tray
                        </h4>
                        <div className="grid grid-cols-4 gap-4">
                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-3-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                PR App
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                Technical evaluation app
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-list-2-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                Commercial evaluation app
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>

                          <div
                            onClick={() => onViewEContract?.("RFP_10000000107", "PO 2025 014")}
                            className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
                            >
                              <i className="ri-file-text-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>
                                E- Contract
                              </p>
                              <button
                                className="text-sm font-normal flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>
                          Additional details
                        </h4>
                        <div
                          className="bg-white rounded-lg p-6 mb-6"
                          style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                        >
                          <h5 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                            Leadership Development Training Program - 10000000107
                          </h5>
                          <div className="grid grid-cols-4 gap-6">
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Department
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                IT & Services
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Cost Centre
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                ITRFP108657
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Purchase Group
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                Service
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                Contract Duration
                              </p>
                              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                1 Year 6 Months
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                          Scope Of Work
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
                          Targeted at mid-level managers, emerging leaders, and high-potential employees, the program
                          will run over in a blended format of classroom/virtual learning and on-the-job practice.
                          Success will be measured by participant feedback, leadership assessments, and observable
                          improvements in team performance, ultimately driving stronger leadership effectiveness and
                          organizational growth.
                        </p>
                      </div>

                      <div
                        className="bg-white rounded-lg p-6 mb-6"
                        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                              Requestor details
                            </h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Requested By
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  Johnny cage
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Requestor's Manager
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  Rebecca ferguson
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>
                              Dates
                            </h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Created Date
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  12 Jan 2025
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>
                                  Expected Delivery Date
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#000525" }}>
                                  12 Jun 2026
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedTask.isSupplier &&
                    selectedTask.supplierId &&
                    viewingSupplierDetails &&
                    supplierDetailsData ? (
                    <ProcSupplierDetailsPage
                      companyName={selectedTask.requestor}
                      onBack={handleBackFromSupplierDetails}
                      isInline={true}
                    />
                  ) : selectedTask.isSupplier && selectedTask.supplierId ? (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                            Verify & approve new supplier
                          </h2>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-message-2-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setHistoryRfpNumber(selectedTask.rfpId)
                              setShowProcessHistoryModal(true)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-history-line text-xl text-gray-600" />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Reject supplier
                          </button>
                          <button
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Approve supplier
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : selectedTask.id === "1" ? ( // This condition seems to be a placeholder, might need adjustment
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                            {selectedTask.title}
                          </h2>
                        </div>
                        <button
                          onClick={() => onViewPRDetails?.(selectedTask.rfpId)}
                          className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                          style={{ backgroundColor: "#1B733D" }}
                        >
                          Open
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-6">{selectedTask.title}</h3>

                      <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Owner
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.owner_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Process
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.process}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Due date
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Created on
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.createdOn}</p>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Status</h4>
                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded">Open</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
                            {selectedTask.rfpId}
                          </h2>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-message-2-line text-xl text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setHistoryRfpNumber(selectedTask.rfpId)
                              setShowProcessHistoryModal(true)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-history-line text-xl text-gray-600" />
                          </button>
                        </div>
                        {selectedTask.id === "checklist-4542" ? (
                          <button
                            onClick={() => setShowDecisionModal(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        ) : selectedTask.id === "committee-assignment-4542" ? (
                          <button
                            onClick={() => setShowTechnicalDecisionModal(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        ) : selectedTask.id === "commercial-assessment-343" ? (
                          <button
                            onClick={() => setShowCommercialDecisionModal(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowDecisionModal(true)}
                            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#1B733D" }}
                          >
                            Decide
                          </button>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-6">{selectedTask.title}</h3>

                      <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Owner
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.owner_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Process
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.process}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Due date
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Created on
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.createdOn}</p>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-4">App tray</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            onClick={() => onViewPRApp?.(selectedTask.prId!, selectedTask.prData)}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#E8F5E9" }}
                            >
                              <i className="ri-file-list-3-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">PR App</p>
                              <button
                                className="text-sm font-medium flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line" />
                              </button>
                            </div>
                          </div>

                          <div
                            onClick={() => onViewInboxRFI?.(selectedTask.rfpId)}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#E8F5E9" }}
                            >
                              <i className="ri-inbox-archive-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">RFI App</p>
                              <button
                                className="text-sm font-medium flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line" />
                              </button>
                            </div>
                          </div>

                          <div
                            onClick={() => onViewInboxRFP?.(selectedTask.rfpId)}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#E8F5E9" }}
                            >
                              <i className="ri-file-list-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">RFP App</p>
                              <button
                                className="text-sm font-medium flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line" />
                              </button>
                            </div>
                          </div>

                          <div
                            onClick={() => onViewInboxQuotation?.(selectedTask.rfpId)}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#E8F5E9" }}
                            >
                              <i className="ri-file-list-2-line text-2xl" style={{ color: "#1B733D" }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">Quotation App</p>
                              <button
                                className="text-sm font-medium flex items-center gap-1"
                                style={{ color: "#45546E" }}
                              >
                                View More <i className="ri-arrow-right-line" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Additional details</h4>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-6">
                          Leadership Development Training Program- {selectedTask.rfpId.replace("_", "")}
                        </h4>
                        <div className="grid grid-cols-4 gap-6">
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Department
                            </p>
                            <p className="text-sm font-medium text-gray-900">{selectedTask.department_detail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Cost Centre
                            </p>
                            <p className="text-sm font-medium text-gray-900">{selectedTask.cost_centre}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Purchase Group
                            </p>
                            <p className="text-sm font-medium text-gray-900">{selectedTask.purchase_group}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Contract Duration
                            </p>
                            <p className="text-sm font-medium text-gray-900">{selectedTask.contract_duration}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Budget</h4>
                        <div className="flex items-start gap-8">
                          <div className="flex-1 grid grid-cols-1 gap-6">
                            <div>
                              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                                Remaining Budget
                              </p>
                              <p className="text-sm font-medium text-gray-900">{selectedTask.budget_remaining}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                                RFP Amount (Current)
                              </p>
                              <p className="text-sm font-medium text-gray-900">{selectedTask.budget_rfp}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                                Remaining Budget after approval
                              </p>
                              <p className="text-sm font-medium text-gray-900">{selectedTask.budget_after_approval}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-24">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="none"
                                  stroke="#D9D9D9"
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="none"
                                  stroke="#F1AA33"
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                  strokeDasharray="188.4"
                                  strokeDashoffset="47.1"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium" style={{ color: "#45546E" }}>
                                  75% Left
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                            Other requests (Pending approval)
                          </p>
                          <p className="text-sm font-medium text-gray-900">{selectedTask.other_requests}</p>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 mb-6">Requestor details</h4>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Requested By
                            </p>
                            <p className="text-sm font-medium text-gray-900">{selectedTask.requestor}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Created Date
                            </p>
                            <p className="text-sm font-medium text-gray-900">12 Jan 2025</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Requestor's Manger
                            </p>
                            <p className="text-sm font-medium text-gray-900">{selectedTask.requestor_manager}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                              Expected Delivery Date
                            </p>
                            <p className="text-sm font-medium text-gray-900">12 Jun 2026</p>
                          </div>
                        </div>
                      </div>

                      {selectedTask.scope_of_work && (
                        <div className="mb-8">
                          <h4 className="text-base font-medium text-gray-900 mb-4">Scope Of Work</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedTask.scope_of_work}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-6">Technical Committee Members</h4>
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 font-normal mb-3" style={{ opacity: 0.8 }}>
                            Manager
                          </p>
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Aljoharah Alfayez</p>
                            <p className="text-xs text-gray-500">Finance manger - Finance Department</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-normal mb-3" style={{ opacity: 0.8 }}>
                            Technical Members
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-1">Abdullah Al-Eid</p>
                              <p className="text-xs text-gray-500">Member - Finance Department</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-1">Kholoud Alaqeely</p>
                              <p className="text-xs text-gray-500">Member - Procurement Department</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md px-6">
                    <div className="mb-6 flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                        <i className="ri-mail-open-line text-5xl" style={{ color: "#1B733D" }} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a message to view</h3>
                    <p className="text-gray-500 text-base leading-relaxed">
                      Choose a message from the list on the left to see its details and take action
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
                      <i className="ri-information-line text-lg" />
                      <span>
                        You have {filteredTasks.length} message{filteredTasks.length !== 1 ? "s" : ""} in your inbox
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCOCDecisionDialog && (
        <COCDecisionDialog
          onComplete={() => {
            console.log("[v0] COC Decision completed, showing review invoice task")
            handleClosureConfirmed()
            setShowCOCDecisionDialog(false)
            setShowConfirmClosure(false)
          }}
          onCancel={() => {
            setShowCOCDecisionDialog(false)
          }}
        />
      )}
    </>
  )
}

// </CHANGE> Added default export at the end of the file
export default ProcInboxPage
