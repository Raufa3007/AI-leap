"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Download,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileCheck2,
  Brain,
  CircleDollarSign,
  PackageCheck,
  Receipt,
  UserCheck,
  CopyCheck,
} from "lucide-react"

import POActionsMenu from "./po-actions-menu"
import AmendPOModal from "./amend-po-modal"

interface PODetailPageProps {
  poNumber: string
  onBack: () => void
}

type ValidationStatus = "PASS" | "WARNING" | "FAIL"

interface ValidationItem {
  title: string
  status: ValidationStatus
  reason: string
}

interface ValidationResponse {
  validations: ValidationItem[]
  confidenceScore: number
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk"
  recommendation: {
    summary: string
    action:
      | "Post Invoice"
      | "Route for Finance Approval"
      | "Request Vendor Clarification"
      | "Reject Invoice"
    why: string[]
  }
}

export default function PODetailPage({
  poNumber,
  onBack,
}: PODetailPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "delivery" | "invoices"
  >("overview")

  const [isAmendPOOpen, setIsAmendPOOpen] = useState(false)

  const [isValidating, setIsValidating] = useState(false)

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null)

  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false)

  const [expandedReasons, setExpandedReasons] = useState<
    Record<number, boolean>
  >({})

  const [hoveredInvoice, setHoveredInvoice] = useState<string | null>(null)

  // ---------------------------------------------------------
  // MOCK PO DATA
  // ---------------------------------------------------------

  const poData = {
    id: `PO${poNumber}`,
    title: "Employee Welcome Kit for Upcoming Inductions",
    poNumber: "1234567",
    prNumber: "PR1131341",
    rfpNumber: "RFP24141344",
    prType: "Goods",
    department: "Learning and development",
    status: "PO issued",
    poIssuedDate: "12/08/2025",
    expectedDeliveryDate: "31/12/2025",
    totalPOValue: "12,146,000 ⱡ",

    vendor: {
      name: "Kaar Technologies",
      poValue: "100,000,000",
      email: "projectmanager@kaartech.com",
      contact: "+123 7866 2891",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kaarlogo-eFdSHghYTMP6iXhiqBNTuHylpVZm0D.png",
    },

    goods: [
      {
        description: "Dell Latitude Laptop",
        quantity: 10,
        unit: "Pcs",
        unitPrice: "1,000,000",
        totalPrice: "10,000,000",
      },
      {
        description: "HP ProBook",
        quantity: 15,
        unit: "Pcs",
        unitPrice: "1,500,000",
        totalPrice: "22,500,000",
      },
      {
        description: "Apple MacBook Pro",
        quantity: 8,
        unit: "Pcs",
        unitPrice: "2,000,000",
        totalPrice: "16,000,000",
      },
      {
        description: "Lenovo ThinkPad",
        quantity: 12,
        unit: "Pcs",
        unitPrice: "1,200,000",
        totalPrice: "14,400,000",
      },
    ],

    totalCost: "1,015,000",
  }

  // ---------------------------------------------------------
  // DOCUMENTS
  // ---------------------------------------------------------

  const documents = [
    {
      type: "Signed PO",
      name: "Signed PO",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
    {
      type: "Contract",
      name: "Contract",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
    {
      type: "Vendor proposal",
      name: "Vendor proposal",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
    {
      type: "Compliance docs",
      name: "Compliance docs",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
    {
      type: "Others",
      name: "Affiliation",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
    {
      type: "Others",
      name: "Affiliation",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
    {
      type: "Others",
      name: "Affiliation",
      size: "6.5kb",
      uploadedBy: "Mohammed Zubair",
      uploadedDate: "02-Aug-2022",
    },
  ]

  // ---------------------------------------------------------
  // DELIVERY DATA
  // ---------------------------------------------------------

  const deliveryData = [
    {
      grnNumber: "1070000137",
      itemDescription: "Dell Latitude Laptop",
      orderedQty: 100,
      deliveredQty: 100,
      status: "Verified",
      receivedPerson: "Mark Siegelman",
      receipt: "Invoice",
    },
    {
      grnNumber: "0005000068",
      itemDescription: "HP ProBook",
      orderedQty: 100,
      deliveredQty: 50,
      status: "Verified / Partial",
      receivedPerson: "Arbela Mohamed",
      receipt: "Invoice",
    },
    {
      grnNumber: "0005000069",
      itemDescription: "Apple MacBook Pro",
      orderedQty: 20,
      deliveredQty: 20,
      status: "Delivered",
      receivedPerson: "Zaiden ali",
      receipt: "Invoice",
    },
  ]

  // ---------------------------------------------------------
  // INVOICE DATA
  // ---------------------------------------------------------

  // const invoiceData = [
  //   {
  //     invoiceRef: "0005000069",
  //     invoiceNumber: "5100001236",
  //     invoiceDate: "16 Aug 2025",
  //     paymentDueDate: "15 Sep 2025",
  //     vendorName: "Global Engineering Ltd.",
  //     purchaseOrder: "4500001567",
  //     purchaseOrderAmount: "10000.00",
  //     purchaseOrderVendorName: "Global Engineering Ltd.",
  //     goodsReceipt: "5000012890",
  //     goodsReceiptQuantity: "10",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "10",
  //     amount: "10000.00",
  //     taxAmount: "1500.00",
  //     netAmount: "8500.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "Net 30",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000123",
  //     status: "Submitted",
  //     postingDate: "17 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000070",
  //     invoiceNumber: "5100001237",
  //     invoiceDate: "18 Aug 2025",
  //     paymentDueDate: "17 Sep 2025",
  //     vendorName: "ABC Trading Co.",
  //     purchaseOrder: "4500001234",
  //     purchaseOrderAmount: "15000.00",
  //     purchaseOrderVendorName: "ABC Trading Co.",
  //     goodsReceipt: "5000012345",
  //     goodsReceiptQuantity: "20",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "18",
  //     amount: "15000.00",
  //     taxAmount: "2250.00",
  //     netAmount: "12750.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "Net 30",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000124",
  //     status: "Paid",
  //     postingDate: "19 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000071",
  //     invoiceNumber: "5100001238",
  //     invoiceDate: "20 Aug 2025",
  //     paymentDueDate: "19 Sep 2025",
  //     vendorName: "XYZ Industrial Supplies",
  //     purchaseOrder: "",
  //     purchaseOrderAmount: "20000.00",
  //     purchaseOrderVendorName: "XYZ Industrial Supplies",
  //     goodsReceipt: "5000012678",
  //     goodsReceiptQuantity: "25",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "20",
  //     amount: "22000.00",
  //     taxAmount: "",
  //     netAmount: "22000.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000125",
  //     status: "Submitted",
  //     postingDate: "21 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000072",
  //     invoiceNumber: "5100001239",
  //     invoiceDate: "22 Aug 2025",
  //     paymentDueDate: "21 Sep 2025",
  //     vendorName: "ABC Trading Co.",
  //     purchaseOrder: "4500001456",
  //     purchaseOrderAmount: "12000.00",
  //     purchaseOrderVendorName: "XYZ Industrial Supplies",
  //     goodsReceipt: "5000012678",
  //     goodsReceiptQuantity: "15",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "10",
  //     amount: "12000.00",
  //     taxAmount: "1800.00",
  //     netAmount: "10200.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "Immediate",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000126",
  //     status: "Rejected",
  //     postingDate: "23 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000073",
  //     invoiceNumber: "5100001240",
  //     invoiceDate: "24 Aug 2025",
  //     paymentDueDate: "23 Sep 2025",
  //     vendorName: "National Steel Works",
  //     purchaseOrder: "4500001789",
  //     purchaseOrderAmount: "25000.00",
  //     purchaseOrderVendorName: "National Steel Works",
  //     goodsReceipt: "",
  //     goodsReceiptQuantity: "",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "15",
  //     amount: "24000.00",
  //     taxAmount: "0",
  //     netAmount: "24000.00",
  //     paymentTerms: "Net 45",
  //     vendorPaymentTerms: "Net 45",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000127",
  //     status: "Submitted",
  //     postingDate: "25 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000074",
  //     invoiceNumber: "5100001241",
  //     invoiceDate: "26 Aug 2025",
  //     paymentDueDate: "25 Sep 2025",
  //     vendorName: "Global Engineering Ltd.",
  //     purchaseOrder: "4500001890",
  //     purchaseOrderAmount: "18000.00",
  //     purchaseOrderVendorName: "Global Engineering Ltd.",
  //     goodsReceipt: "5000013001",
  //     goodsReceiptQuantity: "10",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "15",
  //     amount: "20000.00",
  //     taxAmount: "3000.00",
  //     netAmount: "17000.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "Immediate",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000128",
  //     status: "Submitted",
  //     postingDate: "27 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000075",
  //     invoiceNumber: "5100001242",
  //     invoiceDate: "28 Aug 2025",
  //     paymentDueDate: "27 Sep 2025",
  //     vendorName: "ABC Trading Co.",
  //     purchaseOrder: "",
  //     purchaseOrderAmount: "25000.00",
  //     purchaseOrderVendorName: "XYZ Industrial Supplies",
  //     goodsReceipt: "",
  //     goodsReceiptQuantity: "",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "20",
  //     amount: "28000.00",
  //     taxAmount: "",
  //     netAmount: "28000.00",
  //     paymentTerms: "",
  //     vendorPaymentTerms: "Immediate",
  //     paymentMethod: "-",
  //     paymentReference: "-",
  //     status: "Rejected",
  //     postingDate: "29 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice not generated",
  //   },

  //   {
  //     invoiceRef: "0005000076",
  //     invoiceNumber: "5100001243",
  //     invoiceDate: "30 Aug 2025",
  //     paymentDueDate: "29 Sep 2025",
  //     vendorName: "Eastern Electricals",
  //     purchaseOrder: "4500001991",
  //     purchaseOrderAmount: "30000.00",
  //     purchaseOrderVendorName: "Eastern Electricals",
  //     goodsReceipt: "5000013200",
  //     goodsReceiptQuantity: "30",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "25",
  //     amount: "28000.00",
  //     taxAmount: "0",
  //     netAmount: "28000.00",
  //     paymentTerms: "Net 60",
  //     vendorPaymentTerms: "Net 60",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000129",
  //     status: "Submitted",
  //     postingDate: "31 Aug 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000077",
  //     invoiceNumber: "5100001244",
  //     invoiceDate: "01 Sep 2025",
  //     paymentDueDate: "01 Oct 2025",
  //     vendorName: "Prime Industrial Services",
  //     purchaseOrder: "4500002050",
  //     purchaseOrderAmount: "12000.00",
  //     purchaseOrderVendorName: "Prime Industrial Services",
  //     goodsReceipt: "5000013300",
  //     goodsReceiptQuantity: "12",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "12",
  //     amount: "12000.00",
  //     taxAmount: "-100",
  //     netAmount: "12100.00",
  //     paymentTerms: "Net 45",
  //     vendorPaymentTerms: "",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000130",
  //     status: "Submitted",
  //     postingDate: "02 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000078",
  //     invoiceNumber: "5100001245",
  //     invoiceDate: "03 Sep 2025",
  //     paymentDueDate: "03 Oct 2025",
  //     vendorName: "ABC Trading Co.",
  //     purchaseOrder: "4500001234",
  //     purchaseOrderAmount: "15000.00",
  //     purchaseOrderVendorName: "ABC Trading Co.",
  //     goodsReceipt: "5000012345",
  //     goodsReceiptQuantity: "20",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "18",
  //     amount: "15000.00",
  //     taxAmount: "2250.00",
  //     netAmount: "12750.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "Net 30",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000131",
  //     status: "Paid",
  //     postingDate: "04 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000079",
  //     invoiceNumber: "5100001246",
  //     invoiceDate: "05 Sep 2025",
  //     paymentDueDate: "05 Oct 2025",
  //     vendorName: "Modern Industrial Co.",
  //     purchaseOrder: "4500002100",
  //     purchaseOrderAmount: "18000.00",
  //     purchaseOrderVendorName: "National Steel Works",
  //     goodsReceipt: "",
  //     goodsReceiptQuantity: "",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "12",
  //     amount: "17000.00",
  //     taxAmount: "0",
  //     netAmount: "17000.00",
  //     paymentTerms: "Immediate",
  //     vendorPaymentTerms: "Net 30",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000132",
  //     status: "Submitted",
  //     postingDate: "06 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000080",
  //     invoiceNumber: "5100001247",
  //     invoiceDate: "07 Sep 2025",
  //     paymentDueDate: "07 Oct 2025",
  //     vendorName: "Prime Industrial Services",
  //     purchaseOrder: "4500002150",
  //     purchaseOrderAmount: "10000.00",
  //     purchaseOrderVendorName: "Prime Industrial Services",
  //     goodsReceipt: "5000013400",
  //     goodsReceiptQuantity: "10",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "10",
  //     amount: "12000.00",
  //     taxAmount: "-500",
  //     netAmount: "12500.00",
  //     paymentTerms: "Net 30",
  //     vendorPaymentTerms: "Net 30",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000133",
  //     status: "Rejected",
  //     postingDate: "08 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000081",
  //     invoiceNumber: "5100001248",
  //     invoiceDate: "09 Sep 2025",
  //     paymentDueDate: "09 Oct 2025",
  //     vendorName: "Eastern Electricals",
  //     purchaseOrder: "",
  //     purchaseOrderAmount: "22000.00",
  //     purchaseOrderVendorName: "Eastern Electricals",
  //     goodsReceipt: "5000013500",
  //     goodsReceiptQuantity: "10",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "15",
  //     amount: "22000.00",
  //     taxAmount: "3300.00",
  //     netAmount: "18700.00",
  //     paymentTerms: "",
  //     vendorPaymentTerms: "Net 45",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "-",
  //     status: "Submitted",
  //     postingDate: "10 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000082",
  //     invoiceNumber: "5100001249",
  //     invoiceDate: "11 Sep 2025",
  //     paymentDueDate: "11 Oct 2025",
  //     vendorName: "ABC Trading Co.",
  //     purchaseOrder: "4500002200",
  //     purchaseOrderAmount: "16000.00",
  //     purchaseOrderVendorName: "Global Engineering Ltd.",
  //     goodsReceipt: "5000013600",
  //     goodsReceiptQuantity: "10",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "14",
  //     amount: "18000.00",
  //     taxAmount: "0",
  //     netAmount: "18000.00",
  //     paymentTerms: "Net 60",
  //     vendorPaymentTerms: "Immediate",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000134",
  //     status: "Submitted",
  //     postingDate: "12 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },

  //   {
  //     invoiceRef: "0005000083",
  //     invoiceNumber: "5100001250",
  //     invoiceDate: "13 Sep 2025",
  //     paymentDueDate: "13 Oct 2025",
  //     vendorName: "National Steel Works",
  //     purchaseOrder: "4500002250",
  //     purchaseOrderAmount: "50000.00",
  //     purchaseOrderVendorName: "National Steel Works",
  //     goodsReceipt: "5000013700",
  //     goodsReceiptQuantity: "50",
  //     fiscalYear: "2025",
  //     currency: "SAR",
  //     invoiceQuantity: "50",
  //     amount: "50000.00",
  //     taxAmount: "7500.00",
  //     netAmount: "42500.00",
  //     paymentTerms: "Net 45",
  //     vendorPaymentTerms: "Net 45",
  //     paymentMethod: "Bank Transfer",
  //     paymentReference: "1900000135",
  //     status: "Paid",
  //     postingDate: "14 Sep 2025",
  //     documentType: "Vendor Invoice",
  //     companyCode: "1000",
  //     attachment: "Invoice.pdf",
  //   },
  // ]
  const invoiceData = [
  {
    invoiceRef: "0005000069",
    invoiceNumber: "5100001236",
    contract: "4600001001",
    invoiceDate: "16 Aug 2025",
    paymentDueDate: "15 Sep 2025",
    vendorName: "Global Engineering Ltd.",
    purchaseOrder: "4500001567",
    purchaseOrderAmount: "10000.00",
    purchaseOrderVendorName: "Global Engineering Ltd.",
    goodsReceipt: "5000012890",
    goodsReceiptQuantity: "10",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "10",
    invoiceamount: "10000.00",
    taxAmount: "1500.00",
    netAmount: "8500.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000123",
    status: "Submitted",
    postingDate: "17 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000070",
    invoiceNumber: "5100001237",
    contract: "4600001002",
    invoiceDate: "18 Aug 2025",
    paymentDueDate: "17 Sep 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500001234",
    purchaseOrderAmount: "15000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000012345",
    goodsReceiptQuantity: "20",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "18",
    invoiceamount: "15000.00",
    taxAmount: "2250.00",
    netAmount: "12750.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000124",
    status: "Paid",
    postingDate: "19 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000071",
    invoiceNumber: "5100001238",
    contract: "",
    invoiceDate: "20 Aug 2025",
    paymentDueDate: "19 Sep 2025",
    vendorName: "XYZ Industrial Supplies",
    purchaseOrder: "",
    purchaseOrderAmount: "",
    purchaseOrderVendorName: "",
    goodsReceipt: "5000012678",
    goodsReceiptQuantity: "25",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "20",
    invoiceamount: "22000.00",
    taxAmount: "",
    netAmount: "22000.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000125",
    status: "Submitted",
    postingDate: "21 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000072",
    invoiceNumber: "5100001239",
    contract: "",
    invoiceDate: "22 Aug 2025",
    paymentDueDate: "21 Sep 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500001456",
    purchaseOrderAmount: "12000.00",
    purchaseOrderVendorName: "XYZ Industrial Supplies",
    goodsReceipt: "5000012678",
    goodsReceiptQuantity: "15",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "10",
    invoiceamount: "12000.00",
    taxAmount: "1800.00",
    netAmount: "10200.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Immediate",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000126",
    status: "Rejected",
    postingDate: "23 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000073",
    invoiceNumber: "5100001240",
    contract: "4600001005",
    invoiceDate: "24 Aug 2025",
    paymentDueDate: "23 Sep 2025",
    vendorName: "National Steel Works",
    purchaseOrder: "4500001789",
    purchaseOrderAmount: "25000.00",
    purchaseOrderVendorName: "National Steel Works",
    goodsReceipt: "",
    goodsReceiptQuantity: "",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "15",
    invoiceamount: "24000.00",
    taxAmount: "0",
    netAmount: "24000.00",
    paymentTerms: "Net 45",
    vendorPaymentTerms: "Net 45",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000127",
    status: "Submitted",
    postingDate: "25 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
  {
    invoiceRef: "0005000074",
    invoiceNumber: "5100001241",
    contract: "4600001006",
    invoiceDate: "26 Aug 2025",
    paymentDueDate: "25 Sep 2025",
    vendorName: "Global Engineering Ltd.",
    purchaseOrder: "4500001890",
    purchaseOrderAmount: "18000.00",
    purchaseOrderVendorName: "Global Engineering Ltd.",
    goodsReceipt: "5000013001",
    goodsReceiptQuantity: "10",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "15",
    invoiceamount: "20000.00",
    taxAmount: "3000.00",
    netAmount: "17000.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Immediate",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000128",
    status: "Submitted",
    postingDate: "27 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000075",
    invoiceNumber: "5100001242",
    contract: "4600001007",
    invoiceDate: "28 Aug 2025",
    paymentDueDate: "27 Sep 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500002890",
    purchaseOrderAmount: "25000.00",
    purchaseOrderVendorName: "XYZ Industrial Supplies",
    goodsReceipt: "",
    goodsReceiptQuantity: "",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "20",
    invoiceamount: "28000.00",
    taxAmount: "",
    netAmount: "28000.00",
    paymentTerms: "",
    vendorPaymentTerms: "Immediate",
    paymentMethod: "-",
    paymentReference: "-",
    status: "Rejected",
    postingDate: "29 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice not generated",
  },
 
  {
    invoiceRef: "0005000076",
    invoiceNumber: "5100001243",
    contract: "4600001008",
    invoiceDate: "30 Aug 2025",
    paymentDueDate: "29 Sep 2025",
    vendorName: "Eastern Electricals",
    purchaseOrder: "4500001991",
    purchaseOrderAmount: "30000.00",
    purchaseOrderVendorName: "Eastern Electricals",
    goodsReceipt: "5000013200",
    goodsReceiptQuantity: "30",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "25",
    invoiceamount: "28000.00",
    taxAmount: "0",
    netAmount: "28000.00",
    paymentTerms: "Net 60",
    vendorPaymentTerms: "Net 60",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000129",
    status: "Submitted",
    postingDate: "31 Aug 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000077",
    invoiceNumber: "5100001244",
    contract: "4600001009",
    invoiceDate: "01 Sep 2025",
    paymentDueDate: "01 Oct 2025",
    vendorName: "Prime Industrial Services",
    purchaseOrder: "4500002050",
    purchaseOrderAmount: "12000.00",
    purchaseOrderVendorName: "Prime Industrial Services",
    goodsReceipt: "5000013300",
    goodsReceiptQuantity: "12",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "12",
    invoiceamount: "12000.00",
    taxAmount: "-100",
    netAmount: "12100.00",
    paymentTerms: "Net 45",
    vendorPaymentTerms: "",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000130",
    status: "Submitted",
    postingDate: "02 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000078",
    invoiceNumber: "5100001245",
    contract: "4600001010",
    invoiceDate: "03 Sep 2025",
    paymentDueDate: "03 Oct 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500001234",
    purchaseOrderAmount: "15000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000012345",
    goodsReceiptQuantity: "20",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "18",
    invoiceamount: "15000.00",
    taxAmount: "2250.00",
    netAmount: "12750.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000131",
    status: "Paid",
    postingDate: "04 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
  {
    invoiceRef: "0005000079",
    invoiceNumber: "5100001246",
    contract: "4600001011",
    invoiceDate: "05 Sep 2025",
    paymentDueDate: "05 Oct 2025",
    vendorName: "Modern Industrial Co.",
    purchaseOrder: "4500002100",
    purchaseOrderAmount: "18000.00",
    purchaseOrderVendorName: "National Steel Works",
    goodsReceipt: "",
    goodsReceiptQuantity: "",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "12",
    invoiceamount: "17000.00",
    taxAmount: "0",
    netAmount: "17000.00",
    paymentTerms: "Immediate",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000132",
    status: "Submitted",
    postingDate: "06 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000080",
    invoiceNumber: "5100001247",
    contract: "4600001012",
    invoiceDate: "07 Sep 2025",
    paymentDueDate: "07 Oct 2025",
    vendorName: "Prime Industrial Services",
    purchaseOrder: "4500002150",
    purchaseOrderAmount: "10000.00",
    purchaseOrderVendorName: "Prime Industrial Services",
    goodsReceipt: "5000013400",
    goodsReceiptQuantity: "10",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "10",
    invoiceamount: "12000.00",
    taxAmount: "-500",
    netAmount: "12500.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000133",
    status: "Rejected",
    postingDate: "08 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000081",
    invoiceNumber: "5100001248",
    contract: "4600001013",
    invoiceDate: "09 Sep 2025",
    paymentDueDate: "09 Oct 2025",
    vendorName: "Eastern Electricals",
    purchaseOrder: "4500003200",
    purchaseOrderAmount: "22000.00",
    purchaseOrderVendorName: "Eastern Electricals",
    goodsReceipt: "5000013500",
    goodsReceiptQuantity: "10",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "15",
    invoiceamount: "22000.00",
    taxAmount: "3300.00",
    netAmount: "18700.00",
    paymentTerms: "",
    vendorPaymentTerms: "Net 45",
    paymentMethod: "Bank Transfer",
    paymentReference: "-",
    status: "Submitted",
    postingDate: "10 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000082",
    invoiceNumber: "5100001249",
    contract: "4600001014",
    invoiceDate: "11 Sep 2025",
    paymentDueDate: "11 Oct 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500002200",
    purchaseOrderAmount: "16000.00",
    purchaseOrderVendorName: "Global Engineering Ltd.",
    goodsReceipt: "5000013600",
    goodsReceiptQuantity: "10",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "14",
    invoiceamount: "18000.00",
    taxAmount: "0",
    netAmount: "18000.00",
    paymentTerms: "Net 60",
    vendorPaymentTerms: "Immediate",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000134",
    status: "Submitted",
    postingDate: "12 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000083",
    invoiceNumber: "5100001250",
    contract: "4600001015",
    invoiceDate: "13 Sep 2025",
    paymentDueDate: "13 Oct 2025",
    vendorName: "National Steel Works",
    purchaseOrder: "4500002250",
    purchaseOrderAmount: "50000.00",
    purchaseOrderVendorName: "National Steel Works",
    goodsReceipt: "5000013700",
    goodsReceiptQuantity: "50",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "50",
    invoiceamount: "50000.00",
    taxAmount: "7500.00",
    netAmount: "42500.00",
    paymentTerms: "Net 45",
    vendorPaymentTerms: "Net 45",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900000135",
    status: "Paid",
    postingDate: "14 Sep 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
  {
    invoiceRef: "0005000201",
    invoiceNumber: "5100002201",
    contract: "4600001016",
    invoiceDate: "01 Oct 2025",
    paymentDueDate: "31 Oct 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500005000",
    purchaseOrderAmount: "50000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000090001",
    goodsReceiptQuantity: "100",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "20",
    invoiceamount: "10000.00",
    taxAmount: "1500.00",
    netAmount: "8500.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900001001",
    status: "Paid",
    postingDate: "02 Oct 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000202",
    invoiceNumber: "5100002202",
    contract: "4600001017",
    invoiceDate: "05 Oct 2025",
    paymentDueDate: "04 Nov 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500005000",
    purchaseOrderAmount: "50000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000090002",
    goodsReceiptQuantity: "100",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "25",
    invoiceamount: "12000.00",
    taxAmount: "1800.00",
    netAmount: "10200.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900001002",
    status: "Paid",
    postingDate: "06 Oct 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000203",
    invoiceNumber: "5100002203",
    contract: "4600001018",
    invoiceDate: "10 Oct 2025",
    paymentDueDate: "09 Nov 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500005000",
    purchaseOrderAmount: "50000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000090003",
    goodsReceiptQuantity: "100",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "15",
    invoiceamount: "8000.00",
    taxAmount: "1200.00",
    netAmount: "6800.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900001003",
    status: "Submitted",
    postingDate: "11 Oct 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000204",
    invoiceNumber: "5100002204",
    contract: "4600001019",
    invoiceDate: "15 Oct 2025",
    paymentDueDate: "14 Nov 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500005000",
    purchaseOrderAmount: "50000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000090004",
    goodsReceiptQuantity: "100",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "20",
    invoiceamount: "9000.00",
    taxAmount: "1350.00",
    netAmount: "7650.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900001004",
    status: "Submitted",
    postingDate: "16 Oct 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
 
  {
    invoiceRef: "0005000205",
    invoiceNumber: "5100002205",
    contract: "4600001020",
    invoiceDate: "20 Oct 2025",
    paymentDueDate: "19 Nov 2025",
    vendorName: "ABC Trading Co.",
    purchaseOrder: "4500005000",
    purchaseOrderAmount: "50000.00",
    purchaseOrderVendorName: "ABC Trading Co.",
    goodsReceipt: "5000090005",
    goodsReceiptQuantity: "100",
    fiscalYear: "2025",
    currency: "SAR",
    invoiceQuantity: "20",
    invoiceamount: "15000.00",
    taxAmount: "2250.00",
    netAmount: "12750.00",
    paymentTerms: "Net 30",
    vendorPaymentTerms: "Net 30",
    paymentMethod: "Bank Transfer",
    paymentReference: "1900001005",
    status: "Submitted",
    postingDate: "21 Oct 2025",
    documentType: "Vendor Invoice",
    companyCode: "1000",
    attachment: "Invoice.pdf",
  },
  {
  invoiceRef: "0005000084",
  invoiceNumber: "5100001236",
  contract: "4600001021",
  invoiceDate: "16 Aug 2025",
  paymentDueDate: "15 Sep 2025",
  vendorName: "Global Engineering Ltd.",
  purchaseOrder: "4500001567",
  purchaseOrderAmount: "100000.00",
  purchaseOrderVendorName: "Global Engineering Ltd.",
  goodsReceipt: "5000012890",
  goodsReceiptQuantity: "10",
  fiscalYear: "2025",
  currency: "SAR",
  invoiceQuantity: "5",
  invoiceamount: "2000.00",
  taxAmount: "600.00",
  netAmount: "3400.00",
  paymentTerms: "Net 30",
  vendorPaymentTerms: "Net 30",
  paymentMethod: "Bank Transfer",
  paymentReference: "1900000123",
  status: "Submitted",
  postingDate: "17 Aug 2025",
  documentType: "Vendor Invoice",
  companyCode: "1000",
  attachment: "Invoice.pdf",
},
 
{
  invoiceRef: "0005000085",
  invoiceNumber: "5100001237",
  contract: "4600001022",
  invoiceDate: "18 Aug 2025",
  paymentDueDate: "17 Sep 2025",
  vendorName: "Global Engineering Ltd.",
  purchaseOrder: "4500001567",
  purchaseOrderAmount: "100000.00",
  purchaseOrderVendorName: "Global Engineering Ltd.",
  goodsReceipt: "5000012891",
  goodsReceiptQuantity: "10",
  fiscalYear: "2025",
  currency: "SAR",
  invoiceQuantity: "5",
  invoiceamount: "4000.00",
  taxAmount: "900.00",
  netAmount: "5100.00",
  paymentTerms: "Net 30",
  vendorPaymentTerms: "Net 30",
  paymentMethod: "Bank Transfer",
  paymentReference: "1900000124",
  status: "Paid",
  postingDate: "19 Aug 2025",
  documentType: "Vendor Invoice",
  companyCode: "1000",
  attachment: "Invoice.pdf",
},
];

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------

  const validateInvoice = async (invoice: any) => {
    if (!invoice) return

    try {
      setSelectedInvoice(invoice)
      setIsValidating(true)
      setValidationResult(null)
      setIsValidationModalOpen(true)
      setExpandedReasons({})

      const prompt = `
You are an expert Procurement and Accounts Payable Invoice Validation Assistant.

Validate ONLY the selected invoice using the exact rules below.

Do not invent values.
Do not use external information.
Do not assume missing values.

SELECTED INVOICE:
${JSON.stringify(invoice, null, 2)}

REFERENCE INVOICE DATASET:
${JSON.stringify(invoiceData, null, 2)}

VALIDATION RULES:

1. Contract Exists Validation

Field:
contract

If contract is not empty:
PASS

If contract is empty:
FAIL

Reason:
Contract does not exist.

2. Purchase Order Exists Validation

Field:
purchaseOrder

If purchaseOrder is not empty:
PASS

If purchaseOrder is empty:
FAIL

Reason:
Purchase Order does not exist.

3. Vendor Match Validation

Compare:
vendorName
purchaseOrderVendorName

If values match exactly:
PASS

If values do not match:
FAIL

Reason:
Invoice vendor does not match the Purchase Order vendor.

4. Goods Receipt Exists Validation

Field:
goodsReceipt

If goodsReceipt is not empty:
PASS

If goodsReceipt is empty:
FAIL

Reason:
Goods Receipt document not found.

5. Invoice Quantity Validation

Compare:
invoiceQuantity
goodsReceiptQuantity

Convert both values to numbers.

If Invoice Quantity <= Goods Receipt Quantity:
PASS

If Invoice Quantity > Goods Receipt Quantity:
FAIL

Reason:
Invoice quantity exceeds the Goods Receipt quantity.

6. Invoice Amount Validation

Compare:
purchaseOrderAmount
amount

Convert both values to numbers.

If Invoice Amount < Purchase Order Amount:
WARNING

If Invoice Amount == Purchase Order Amount:
PASS

If Invoice Amount > Purchase Order Amount:
FAIL

If the invoice amount exceeds the PO amount, calculate the percentage by which it exceeds the PO amount.

7. Tax Validation

Field:
taxAmount

If taxAmount > 0:
PASS

If taxAmount == 0:
WARNING

If taxAmount is empty or missing:
FAIL

8. Payment Terms Validation

Compare:
paymentTerms
vendorPaymentTerms

If both values match:
PASS

If either value is missing:
WARNING

If both exist but do not match:
FAIL

9. Similar Invoice Validation

Compare selected invoice against ALL OTHER invoices.

Exclude the selected invoice itself.

Compare ONLY:
invoiceRef
purchaseOrder
goodsReceipt
vendorName

If none match:
PASS

If one or more fields match:
WARNING

If all four fields match:
FAIL

State which fields matched and their values.

10. Cumulative Purchase Order Amount Validation

Look at ALL invoices in the REFERENCE INVOICE DATASET that share the same purchaseOrder as the selected invoice.

Sum the invoiceamount of all those invoices (including the selected invoice).

Compare the cumulative sum against the purchaseOrderAmount of the selected invoice.

If cumulative sum <= purchaseOrderAmount:
PASS

If cumulative sum > purchaseOrderAmount but selected invoice alone does not exceed it:
WARNING

If cumulative sum > purchaseOrderAmount:
FAIL

Reason:
Cumulative invoice amount for this Purchase Order exceeds the Purchase Order amount.

State the cumulative total, the PO amount, and the excess amount.

CONFIDENCE SCORE:

Determine the confidence score using ONLY these rules:

Rule 1: If ANY validation except Similar Invoice Validation returns FAIL, confidence score must be between 0% and 35% (High Risk).

Rule 2: If there are NO FAIL validations but one or more WARNING validations, confidence score must be between 36% and 79% (Medium Risk).

Rule 3: If ALL validations return PASS, confidence score must be between 80% and 100% (Low Risk).

The Similar Invoice Validation alone must NEVER reduce the confidence score below 35%. If Similar Invoice Validation is the ONLY failed validation, treat it as Medium Risk.

RISK LEVEL:

Choose:
Low Risk
Medium Risk
High Risk

AI RECOMMENDATION:

Choose exactly ONE:
Post Invoice
Route for Finance Approval
Request Vendor Clarification
Reject Invoice

The summary must be 2-4 business-friendly sentences.

Only mention WARNING and FAIL validations in the summary.

The "why" array should contain reasons ONLY for WARNING and FAIL validations.

IMPORTANT:

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Return exactly this JSON structure:

{
  "validations": [
    {
      "title": "Contract Exists",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Purchase Order Exists",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Vendor Match",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Goods Receipt Exists",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Invoice Quantity Validation",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Invoice Amount Validation",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Tax Validation",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Payment Terms Validation",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Similar Invoice Validation",
      "status": "PASS",
      "reason": "..."
    },
    {
      "title": "Cumulative Purchase Order Amount",
      "status": "PASS",
      "reason": "..."
    }
  ],
  "confidenceScore": 95,
  "riskLevel": "Low Risk",
  "recommendation": {
    "summary": "...",
    "action": "Post Invoice",
    "why": [
      "..."
    ]
  }
}
`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data = await response.json()

      const rawResult =
        data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawResult) {
        throw new Error("No validation response received from AI.")
      }

      const parsedResult: ValidationResponse = JSON.parse(rawResult)

      setValidationResult(parsedResult)
    } catch (error) {
      console.error("Invoice validation error:", error)

      setValidationResult({
        validations: [
          {
            title: "Validation Error",
            status: "FAIL",
            reason:
              "The AI validation service could not complete the validation. Please try again.",
          },
        ],
        confidenceScore: 0,
        riskLevel: "High Risk",
        recommendation: {
          summary:
            "The invoice could not be validated because the AI validation service returned an error.",
          action: "Route for Finance Approval",
          why: [
            "AI validation could not be completed successfully.",
          ],
        },
      })
    } finally {
      setIsValidating(false)
    }
  }

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const toggleReason = (index: number) => {
    setExpandedReasons((previous) => ({
      ...previous,
      [index]: !previous[index],
    }))
  }

  const closeValidationModal = () => {
    if (isValidating) return

    setIsValidationModalOpen(false)
  }

  const getStatusConfig = (status: ValidationStatus) => {
    switch (status) {
      case "PASS":
        return {
          icon: <CheckCircle2 size={20} />,
          label: "Passed",
          container:
            "border-green-200 bg-green-50",
          iconContainer:
            "bg-green-100 text-green-700",
          text: "text-green-700",
        }

      case "WARNING":
        return {
          icon: <AlertTriangle size={20} />,
          label: "Warning",
          container:
            "border-amber-200 bg-amber-50",
          iconContainer:
            "bg-amber-100 text-amber-700",
          text: "text-amber-700",
        }

      case "FAIL":
        return {
          icon: <XCircle size={20} />,
          label: "Failed",
          container:
            "border-red-200 bg-red-50",
          iconContainer:
            "bg-red-100 text-red-700",
          text: "text-red-700",
        }
    }
  }

  const getRiskConfig = (risk: string) => {
    if (risk === "Low Risk") {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: <ShieldCheck size={20} />,
      }
    }

    if (risk === "Medium Risk") {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: <AlertTriangle size={20} />,
      }
    }

    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <XCircle size={20} />,
    }
  }

  const getRecommendationConfig = (action: string) => {
    switch (action) {
      case "Post Invoice":
        return {
          icon: <CheckCircle2 size={22} />,
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
        }

      case "Route for Finance Approval":
        return {
          icon: <UserCheck size={22} />,
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
        }

      case "Request Vendor Clarification":
        return {
          icon: <AlertTriangle size={22} />,
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
        }

      case "Reject Invoice":
        return {
          icon: <XCircle size={22} />,
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
        }

      default:
        return {
          icon: <Brain size={22} />,
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
        }
    }
  }

  const handleDownloadPO = () => {}

  const handleAmendPO = () => {
    setIsAmendPOOpen(true)
  }

  const handleCancelPO = () => {
    console.log("Cancel PO clicked")
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={onBack}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <h1 className="text-lg font-semibold text-gray-900">
              {poData.id}/{" "}
              <span className="text-green-700">
                {activeTab === "overview"
                  ? "PO overview"
                  : activeTab === "documents"
                    ? "Documents"
                    : activeTab === "delivery"
                      ? "Delivery & GRN"
                      : "Invoices & payments"}
              </span>
            </h1>

          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={handleDownloadPO}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Download size={18} />
              Download PO
            </button>

            <POActionsMenu
              onAmendPO={handleAmendPO}
              onCancelPO={handleCancelPO}
            />

          </div>

        </div>
      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white px-6">

        <div className="flex gap-8">

          {[
            ["overview", "PO overview"],
            ["documents", "Documents"],
            ["delivery", "Delivery & GRN"],
            ["invoices", "Invoices & payments"],
          ].map(([key, label]) => (

            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`border-b-2 py-4 text-sm font-medium transition ${
                activeTab === key
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-6">

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        {activeTab === "overview" && (

          <div className="space-y-6">

            {/* Progress */}

            <div className="rounded-lg bg-white p-6">

              <div className="flex items-center justify-between gap-2">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex flex-1 items-center gap-1"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                      ✓
                    </div>

                    <div className="h-1 flex-1 bg-green-600" />
                  </div>
                ))}

                <div className="flex flex-1 items-center gap-1">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    ◆
                  </div>

                  <div className="h-1 flex-1 bg-gray-300" />

                </div>

                {[6, 7].map((item) => (
                  <div
                    key={item}
                    className="flex flex-1 items-center gap-1"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-600">
                      ◆
                    </div>

                    {item !== 7 && (
                      <div className="h-1 flex-1 bg-gray-300" />
                    )}

                  </div>
                ))}

              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-600">

                <span>Order Placed</span>
                <span>Confirmed</span>
                <span>In Transit</span>
                <span>Delivered</span>
                <span>Delivery/Service</span>
                <span>Invoice processing</span>
                <span>Payment & closure</span>

              </div>

            </div>

            {/* Request Details */}

            <div className="rounded-lg bg-white p-6">

              <h2 className="mb-6 text-lg font-semibold text-green-700">
                Request details
              </h2>

              <div className="grid grid-cols-4 gap-6">

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Request title
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.title}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    PO Number
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.poNumber}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    PR Number
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {poData.prNumber}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    RFP Number
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {poData.rfpNumber}
                  </p>
                </div>

              </div>

              <div className="mt-6 grid grid-cols-4 gap-6">

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    PR type
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.prType}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.department}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-orange-600">
                    {poData.status}
                  </p>
                </div>

              </div>

              <div className="mt-6 grid grid-cols-4 gap-6">

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    PO issued date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.poIssuedDate}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Expected delivery date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.expectedDeliveryDate}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Total PO value
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {poData.totalPOValue}
                  </p>
                </div>

              </div>

            </div>

            {/* Vendor */}

            <div className="rounded-lg bg-white p-6">

              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Vendor information
              </h2>

              <div className="flex items-start gap-6">

                <div className="flex-1">

                  <p className="mb-4 text-sm font-semibold text-green-600">
                    {poData.vendor.name}
                  </p>

                  <div className="grid grid-cols-2 gap-6">

                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">
                        PO value
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {poData.vendor.poValue}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {poData.vendor.email}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">
                        Contact
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {poData.vendor.contact}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">

                  <img
                    src={poData.vendor.logo}
                    alt={poData.vendor.name}
                    className="h-20 w-20 object-contain"
                  />

                </div>

              </div>

            </div>

            {/* Goods */}

            <div className="rounded-lg bg-white p-6">

              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Goods information
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-200">

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Item description
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Quantity
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Units of measure
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Unit price
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Total price
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {poData.goods.map((item, index) => (

                      <tr
                        key={index}
                        className="border-b border-gray-100"
                      >

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.description}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.unit}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.unitPrice}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.totalPrice}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              <div className="mt-4 flex justify-end">

                <div className="w-64">

                  <div className="flex items-center justify-between border-t border-gray-200 py-3 font-semibold text-gray-900">

                    <span>Total cost</span>

                    <span>{poData.totalCost}</span>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================
            DOCUMENTS
        =================================================== */}

        {activeTab === "documents" && (

          <div className="rounded-lg bg-white p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-gray-900">
                Supporting documents (10)
              </h2>

              <div className="flex gap-2">

                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Download size={18} />
                  Download All
                </button>

                <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
                  <i className="ri-upload-cloud-2-line"></i>
                  Upload
                </button>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-green-700 text-white">

                    <th className="px-6 py-3 text-left text-xs font-semibold">
                      Type of Document
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold">
                      Attachment
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold">
                      Uploaded By
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold">
                      Uploaded Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {documents.map((doc, index) => (

                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.type}
                      </td>

                      <td className="px-6 py-4 text-sm">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
                            <i className="ri-file-pdf-fill"></i>
                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-900">
                              {doc.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {doc.size}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.uploadedBy}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.uploadedDate}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* ===================================================
            DELIVERY
        =================================================== */}

        {activeTab === "delivery" && (

          <div className="rounded-lg bg-white p-6">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-gray-200">

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      GRN number
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Item description
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Ordered quantity
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Delivered quantity
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Received person
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Receipt
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {deliveryData.map((item, index) => (

                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.grnNumber}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.itemDescription}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.orderedQty}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.deliveredQty}
                      </td>

                      <td className="px-6 py-4 text-sm">

                        <div className="flex items-center gap-2">

                          {item.status.includes("Verified") && (
                            <>
                              <span className="h-2 w-2 rounded-full bg-green-600" />
                              <span className="font-medium text-green-600">
                                Verified
                              </span>
                            </>
                          )}

                          {item.status.includes("Partial") && (
                            <>
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                              <span className="font-medium text-yellow-600">
                                Partial
                              </span>
                            </>
                          )}

                          {item.status === "Delivered" && (
                            <>
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                              <span className="font-medium text-yellow-600">
                                Delivered
                              </span>
                            </>
                          )}

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.receivedPerson}
                      </td>

                      <td className="px-6 py-4 text-sm">

                        <div className="flex items-center gap-2">

                          <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-xs text-white">
                            <i className="ri-file-pdf-fill"></i>
                          </div>

                          <span>{item.receipt}</span>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* ===================================================
            INVOICES
        =================================================== */}

        {activeTab === "invoices" && (

          <div className="rounded-lg bg-white p-6">

            {/* Invoice Header */}

            <div className="mb-6 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Receipt
                      size={20}
                      className="text-green-700"
                    />
                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Invoices & payments
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select an invoice to run AI-powered validation
                    </p>

                  </div>

                </div>

              </div>

              {/* <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2">

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={16}
                    className="text-green-700"
                  />

                  <span className="text-sm font-medium text-green-700">
                    AI Validation Enabled
                  </span>

                </div>

              </div> */}

            </div>

            {/* Invoice Table */}

            <div className="overflow-x-auto rounded-lg border border-gray-200">

              <table className="w-full">

                {/* <thead>

                  <tr className="border-b border-gray-200 bg-gray-50">

                    <th className="w-12 px-4 py-3"></th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Invoice Ref.
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Invoice No.
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Invoice Date
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Vendor
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      PO Number
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      PO Amount
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      PO Vendor
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Goods Receipt
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      GR Qty
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Invoice Qty
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Due Date
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Payment Ref.
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Attachment
                    </th>

                  </tr>

                </thead> */}
                <thead>
                <tr className="border-b border-gray-200">
                  
                 
                  <th className="w-12"></th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Invoice Ref.
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Invoice No.
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Contract No.
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Invoice Date
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Vendor
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    PO Number
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    PO Amount
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    PO Vendor
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Goods Receipt
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    GR Qty
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Invoice Qty
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Invoice Amount
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Due Date
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Payment Ref.
                  </th>
 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Attachment
                  </th>
                </tr>
              </thead>
 

                <tbody>

                  {invoiceData.map((item) => {

                    const isHovered =
                      hoveredInvoice === item.invoiceRef

                    const isSelected =
                      selectedInvoice?.invoiceRef === item.invoiceRef

                    return (

                      <tr
                        key={item.invoiceRef}
                        onMouseEnter={() =>
                          setHoveredInvoice(item.invoiceRef)
                        }
                        onMouseLeave={() =>
                          setHoveredInvoice(null)
                        }
                        className={`group border-b transition ${
                          isSelected
                            ? "bg-green-50"
                            : "hover:bg-gray-50"
                        }`}
                      >

                        {/* Hover Validation Action */}

                        {/* <td className="px-4 py-4">

                          <div
                            className={`transition-all duration-200 ${
                              isHovered
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-2 opacity-0"
                            }`}
                          >

                            <button
                              disabled={isValidating}
                              onClick={() =>
                                validateInvoice(item)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                              title="Validate Invoice"
                            >
                              <Sparkles size={16} />
                            </button>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.invoiceRef}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {item.invoiceNumber}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.invoiceDate}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.vendorName}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.purchaseOrder || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.currency}{" "}
                          {item.purchaseOrderAmount}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.purchaseOrderVendorName || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.goodsReceipt || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.goodsReceiptQuantity || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.invoiceQuantity || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.paymentDueDate}
                        </td>

                        <td className="px-6 py-4 text-sm">

                          {item.status === "Paid" && (

                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-600" />
                              <span className="font-medium text-green-600">
                                Paid
                              </span>
                            </div>

                          )}

                          {item.status === "Submitted" && (

                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                              <span className="font-medium text-yellow-600">
                                Submitted
                              </span>
                            </div>

                          )}

                          {item.status === "Rejected" && (

                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-600" />
                              <span className="font-medium text-red-600">
                                Rejected
                              </span>
                            </div>

                          )}

                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.paymentReference}
                        </td>

                        <td className="px-6 py-4 text-sm">

                          {item.attachment !==
                          "Invoice not generated" ? (

                            <div className="flex items-center gap-2">

                              <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-xs text-white">
                                <i className="ri-file-pdf-fill"></i>
                              </div>

                              <span>
                                {item.attachment}
                              </span>

                            </div>

                          ) : (

                            <span className="text-gray-500">
                              {item.attachment}
                            </span>

                          )}

                        </td> */}
                        
                    <td className="px-4 py-4">

                          <div
                            className={`transition-all duration-200 ${
                              isHovered
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-2 opacity-0"
                            }`}
                          >

                            <button
                              disabled={isValidating}
                              onClick={() =>
                                validateInvoice(item)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                              title="Validate Invoice"
                            >
                              <Sparkles size={16} />
                            </button>

                          </div>

                        </td>
                     <td className="px-6 py-4 text-sm text-gray-900">
                      {item.invoiceRef}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.invoiceNumber}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.contract}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.invoiceDate}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.vendorName}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.purchaseOrder}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.currency} {item.purchaseOrderAmount}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.purchaseOrderVendorName}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.goodsReceipt}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.goodsReceiptQuantity}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.invoiceQuantity}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                    {item.invoiceamount}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.paymentDueDate}
                    </td>
 
                    <td className="px-6 py-4 text-sm">
                      {item.status === "Paid" && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-600"></span>
                          <span className="font-medium text-green-600">Paid</span>
                        </div>
                      )}
 
                      {item.status === "Submitted" && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="font-medium text-yellow-600">
                            Submitted
                          </span>
                        </div>
                      )}
 
                      {item.status === "Rejected" && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <span className="font-medium text-red-600">
                            Rejected
                          </span>
                        </div>
                      )}
                    </td>
 
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.paymentReference}
                    </td>
 
                    <td className="px-6 py-4 text-sm">
                      {item.attachment !== "Invoice not generated" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-xs text-white">
                            <i className="ri-file-pdf-fill"></i>
                          </div>
                          <span>{item.attachment}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {item.attachment}
                        </span>
                      )}
                    </td>

                      </tr>

                    )
                  })}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          AI VALIDATION MODAL
      ===================================================== */}

      {isValidationModalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">

                  <Sparkles
                    size={22}
                    className="text-green-700"
                  />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-xl font-semibold text-gray-900">
                      AI Invoice Validation
                    </h2>

                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                       AI Model
                    </span>

                  </div>

                  {selectedInvoice && (

                    <p className="mt-1 text-sm text-gray-500">

                      Invoice{" "}
                      <span className="font-medium text-gray-700">
                        {selectedInvoice.invoiceNumber}
                      </span>

                      {" · "}

                      {selectedInvoice.vendorName}

                    </p>

                  )}

                </div>

              </div>

              <button
                onClick={closeValidationModal}
                disabled={isValidating}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={21} />
              </button>

            </div>

            {/* =================================================
                LOADING STATE
            ================================================= */}

            {isValidating && (

              <div className="flex min-h-[520px] flex-col items-center justify-center px-6">

                <div className="relative">

                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">

                    <Brain
                      size={40}
                      className="text-green-700"
                    />

                  </div>

                  <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-white shadow-lg">

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  </div>

                </div>

                <h3 className="mt-7 text-xl font-semibold text-gray-900">
                  AI is validating the invoice
                </h3>

                <p className="mt-2 max-w-md text-center text-sm leading-6 text-gray-500">
                  The AI model is checking the Purchase Order, vendor,
                  Goods Receipt, quantity, amount, tax, payment terms
                  and similar invoices.
                </p>

                <div className="mt-8 flex items-center gap-2">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-600 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-600 [animation-delay:300ms]" />

                </div>

                <div className="mt-7 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-medium text-green-700">

                  <Loader2
                    size={14}
                    className="animate-spin"
                  />

                  AI model is running...

                </div>

              </div>

            )}

            {/* =================================================
                VALIDATION RESULT
            ================================================= */}

            {!isValidating && validationResult && (

              <div className="overflow-y-auto bg-gray-50 px-6 py-6">

                {/* Invoice Summary */}

                {selectedInvoice && (

                  <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                            <Receipt
                              size={19}
                              className="text-gray-600"
                            />

                          </div>

                          <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Invoice
                            </p>

                            <p className="text-lg font-semibold text-gray-900">
                              {selectedInvoice.invoiceNumber}
                            </p>

                          </div>

                        </div>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          selectedInvoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : selectedInvoice.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedInvoice.status}
                      </span>

                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-4">

                      <div className="rounded-lg bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                          Vendor
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                          {selectedInvoice.vendorName}
                        </p>

                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                          PO Number
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {selectedInvoice.purchaseOrder ||
                            "Not available"}
                        </p>

                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                          Invoice Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {selectedInvoice.currency}{" "}
                          {selectedInvoice.invoiceamount}
                        </p>

                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                          Invoice Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {selectedInvoice.invoiceDate}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* Result Header */}

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <h3 className="text-base font-semibold text-gray-900">
                      Validation results
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      AI evaluated 10 procurement validation rules
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">

                      <ShieldCheck
                        size={16}
                        className="text-green-600"
                      />

                      <span className="text-xs text-gray-500">
                        Confidence
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {validationResult.confidenceScore}%
                      </span>

                    </div>

                    {(() => {

                      const risk = getRiskConfig(
                        validationResult.riskLevel
                      )

                      return (

                        <div
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${risk.bg} ${risk.border}`}
                        >

                          <span className={risk.text}>
                            {risk.icon}
                          </span>

                          <span
                            className={`text-sm font-semibold ${risk.text}`}
                          >
                            {validationResult.riskLevel}
                          </span>

                        </div>

                      )

                    })()}

                  </div>

                </div>

                {/* Validation Cards */}

                <div className="space-y-3">

                  {validationResult.validations.map(
                    (validation, index) => {

                      const config = getStatusConfig(
                        validation.status
                      )

                      const isExpanded =
                        expandedReasons[index]

                      return (

                        <div
                          key={index}
                          className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${config.container}`}
                        >

                          <div className="flex items-center justify-between px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.iconContainer}`}
                              >
                                {config.icon}
                              </div>

                              <div>

                                <p className="text-sm font-semibold text-gray-900">
                                  {index + 1}.{" "}
                                  {validation.title}
                                </p>

                                <span
                                  className={`text-xs font-semibold ${config.text}`}
                                >
                                  {validation.status === "PASS"
                                    ? "Validation passed"
                                    : validation.status ===
                                        "WARNING"
                                      ? "Attention required"
                                      : "Validation failed"}
                                </span>

                              </div>

                            </div>

                            <div className="flex items-center gap-3">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${config.iconContainer} ${config.text}`}
                              >
                                {config.label}
                              </span>

                              {validation.reason && (
                                <button
                                  onClick={() => toggleReason(index)}
                                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                  {isExpanded ? "Hide" : "Elaborate"}
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              )}

                            </div>

                          </div>

                          {isExpanded && (

                            <div className="border-t border-gray-200 bg-white px-5 py-4">

                              <div className="flex gap-3">

                                <div className="mt-0.5 flex-shrink-0">

                                  {validation.status ===
                                    "PASS" && (

                                    <CheckCircle2
                                      size={17}
                                      className="text-green-600"
                                    />

                                  )}

                                  {validation.status ===
                                    "WARNING" && (

                                    <AlertTriangle
                                      size={17}
                                      className="text-amber-600"
                                    />

                                  )}

                                  {validation.status ===
                                    "FAIL" && (

                                    <XCircle
                                      size={17}
                                      className="text-red-600"
                                    />

                                  )}

                                </div>

                                <div>

                                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    AI reasoning
                                  </p>

                                  <p className="text-sm leading-6 text-gray-600">
                                    {validation.reason}
                                  </p>

                                </div>

                              </div>

                            </div>

                          )}

                        </div>

                      )
                    }
                  )}

                </div>

                {/* =================================================
                    AI RECOMMENDATION
                ================================================= */}

                <div className="mt-5">

                  {(() => {

                    const recommendationConfig =
                      getRecommendationConfig(
                        validationResult.recommendation.action
                      )

                    return (

                      <div
                        className={`overflow-hidden rounded-xl border ${recommendationConfig.border} ${recommendationConfig.bg}`}
                      >

                        <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white ${recommendationConfig.text}`}
                          >
                            {recommendationConfig.icon}
                          </div>

                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              AI Recommendation
                            </p>

                            <h3
                              className={`text-lg font-bold ${recommendationConfig.text}`}
                            >
                              {
                                validationResult
                                  .recommendation.action
                              }
                            </h3>

                          </div>

                        </div>

                        <div className="bg-white/70 px-5 py-5">

                          <p className="text-sm leading-6 text-gray-700">
                            {
                              validationResult
                                .recommendation.summary
                            }
                          </p>

                          {validationResult.recommendation.why
                            ?.length > 0 && (

                            <div className="mt-4">

                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Why
                              </p>

                              <ul className="space-y-2">

                                {validationResult.recommendation.why.map(
                                  (reason, index) => (

                                    <li
                                      key={index}
                                      className="flex gap-2 text-sm text-gray-600"
                                    >

                                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />

                                      <span>{reason}</span>

                                    </li>

                                  )
                                )}

                              </ul>

                            </div>

                          )}

                        </div>

                      </div>

                    )

                  })()}

                </div>

                {/* Footer */}

                <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3">

                  <div className="flex items-center gap-2 text-xs text-gray-500">

                    <Brain size={15} />

                    Validation generated by AI based on the supplied
                    invoice and reference dataset.

                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => {
                        if (!validationResult || !selectedInvoice) return
                        const lines: string[] = []
                        lines.push("AI INVOICE VALIDATION REPORT")
                        lines.push("=============================")
                        lines.push(`Invoice: ${selectedInvoice.invoiceNumber}`)
                        lines.push(`Vendor: ${selectedInvoice.vendorName}`)
                        lines.push(`Date: ${selectedInvoice.invoiceDate}`)
                        lines.push(`Amount: ${selectedInvoice.currency} ${selectedInvoice.invoiceamount}`)
                        lines.push("")
                        lines.push(`Confidence Score: ${validationResult.confidenceScore}%`)
                        lines.push(`Risk Level: ${validationResult.riskLevel}`)
                        lines.push("")
                        lines.push("VALIDATION CHECKS")
                        lines.push("-----------------")
                        validationResult.validations.forEach((v, i) => {
                          lines.push(`${i + 1}. ${v.title}: ${v.status}`)
                          if (v.reason) lines.push(`   Reason: ${v.reason}`)
                        })
                        lines.push("")
                        lines.push("AI RECOMMENDATION")
                        lines.push("-----------------")
                        lines.push(`Action: ${validationResult.recommendation.action}`)
                        lines.push(`Summary: ${validationResult.recommendation.summary}`)
                        if (validationResult.recommendation.why?.length > 0) {
                          lines.push("Why:")
                          validationResult.recommendation.why.forEach((w) => lines.push(`  - ${w}`))
                        }
                        const blob = new Blob([lines.join("\n")], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `AI-Validation-${selectedInvoice.invoiceNumber}.txt`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Download size={15} />
                      Download Report
                    </button>

                    <button
                      onClick={closeValidationModal}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

      {/* =====================================================
          AMEND PO MODAL
      ===================================================== */}

      <AmendPOModal
        isOpen={isAmendPOOpen}
        onClose={() => setIsAmendPOOpen(false)}
        poNumber={poNumber}
      />

    </div>
  )
}