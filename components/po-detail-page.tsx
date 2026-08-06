"use client"

import { useState } from "react"
import { ArrowLeft, Download } from "lucide-react"
import POActionsMenu from "./po-actions-menu"
import AmendPOModal from "./amend-po-modal"
// import { GoogleGenAI } from "@google/genai"

interface PODetailPageProps {
  poNumber: string
  onBack: () => void
}

export default function PODetailPage({ poNumber, onBack }: PODetailPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "delivery" | "invoices">("overview")
  const [isAmendPOOpen, setIsAmendPOOpen] = useState(false)
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const GEMINI_API_KEY = "AIzaSyAvBWoB2E9bGtn3IXJRfEsy9spov9K0J8E";

  // Mock PO data
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

  const documents = [
    { type: "Signed PO", name: "Signed PO", size: "6.5kb", uploadedBy: "Mohammed Zubair", uploadedDate: "02-Aug-2022" },
    { type: "Contract", name: "Contract", size: "6.5kb", uploadedBy: "Mohammed Zubair", uploadedDate: "02-Aug-2022" },
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
    { type: "Others", name: "Affiliation", size: "6.5kb", uploadedBy: "Mohammed Zubair", uploadedDate: "02-Aug-2022" },
    { type: "Others", name: "Affiliation", size: "6.5kb", uploadedBy: "Mohammed Zubair", uploadedDate: "02-Aug-2022" },
    { type: "Others", name: "Affiliation", size: "6.5kb", uploadedBy: "Mohammed Zubair", uploadedDate: "02-Aug-2022" },
  ]

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


  
  const validateInvoice = async () => {

    if (!selectedInvoice) {
        alert("Please select an invoice.");
        return;
    }

    try {
        setIsValidating(true);
        setValidationResult("");

        const prompt = `
You are an expert Procurement and Accounts Payable Invoice Validation Assistant.

Your task is to validate ONE selected invoice using the business validation rules provided below.

Do not assume or invent any values.

Use ONLY the data provided.

Perform all calculations yourself from the supplied invoice fields.

Do not make assumptions beyond the stated validation rules.

Return the response in clean GitHub-flavored Markdown.

Use headings, bullet lists, and emojis (✅ ⚠ ❌) exactly as specified.

Do not wrap the output in code fences.

==========================================================
SELECTED INVOICE
==========================================================

${JSON.stringify(selectedInvoice, null, 2)}

==========================================================
REFERENCE INVOICE DATASET
==========================================================

The following invoices are provided ONLY for comparison during Similar Invoice Validation.

The selected invoice above is the invoice being validated.

${JSON.stringify(invoiceData, null, 2)}

==========================================================
VALIDATION RULES
==========================================================

Perform ALL validations below in the exact order they are listed.

Evaluate every validation independently.

Never stop validation after a failure.

Every validation rule must always be evaluated and included in the final output.

Do not infer or assume missing values.

Use ONLY the values present in the selected invoice unless explicitly instructed otherwise.

----------------------------------------------------------
1. Contract Exists Validation
----------------------------------------------------------

Field:

contract

Rules:

- contract is not empty
    PASS

- contract is empty
    FAIL

Reason:
contract does not exist.

----------------------------------------------------------
2. Purchase Order Exists Validation
----------------------------------------------------------

Field:

purchaseOrder

Rules:

- purchaseOrder is not empty
    PASS

- purchaseOrder is empty
    FAIL

Reason:
Purchase Order does not exist.

----------------------------------------------------------
3. Vendor Match Validation
----------------------------------------------------------

Compare:

vendorName

purchaseOrderVendorName

Rules:

- Values match exactly
    PASS

- Values do not match
    FAIL

Reason:
Invoice vendor does not match the Purchase Order vendor.

----------------------------------------------------------
4. Goods Receipt Exists Validation
----------------------------------------------------------

Field:

goodsReceipt

Rules:

- goodsReceipt is not empty
    PASS

- goodsReceipt is empty
    FAIL

Reason:
Goods Receipt document not found.

----------------------------------------------------------
5. Invoice Quantity Validation
----------------------------------------------------------

Compare:

invoiceQuantity

goodsReceiptQuantity

Convert both string values to numbers before comparison.

Rules:

- Invoice Quantity <= Goods Receipt Quantity
    PASS

- Invoice Quantity > Goods Receipt Quantity
    FAIL

Reason:
Invoice quantity exceeds the Goods Receipt quantity.

----------------------------------------------------------
6. Invoice Amount Validation
----------------------------------------------------------

Compare:

purchaseOrderAmount

invoiceamount

Convert both string values to numbers before comparison.

Rules:

- Invoice Amount < Purchase Order Amount
    WARNING

- Invoice Amount == Purchase Order Amount
    PASS

- Invoice Amount > Purchase Order Amount
    FAIL

Calculate the percentage by which the invoice exceeds the Purchase Order amount.

Example:

Invoice amount exceeds Purchase Order amount by 8%.

----------------------------------------------------------
7. Tax Validation
----------------------------------------------------------

Field:

taxAmount

Rules:

- taxAmount > 0
    PASS

- taxAmount == 0
    WARNING

- taxAmount is empty or missing
    FAIL

----------------------------------------------------------
8. Payment Terms Validation
----------------------------------------------------------

Compare:

paymentTerms

vendorPaymentTerms

Rules:

- Both values match
    PASS

- Either value is missing
    WARNING

- Values do not match
    FAIL

----------------------------------------------------------
9. Similar Invoice Validation
----------------------------------------------------------

Compare the selected invoice against ALL OTHER invoices in the reference dataset.

The selected invoice will also appear inside the dataset.

Exclude it before performing the comparison.

Compare ONLY these fields:

invoiceRef

purchaseOrder

goodsReceipt

vendorName

Rules:

- None of the fields match
    PASS

- One or more fields match
    WARNING

- All four fields match
    FAIL

----------------------------------------------------------
10. Cumulative Purchase Order Amount Validation
----------------------------------------------------------

The selected invoice is already present in the Reference Invoice Dataset.

Use ONLY the Reference Invoice Dataset for this validation.

Do NOT count the selected invoice separately.

Find all invoices where:

purchaseOrder == selectedInvoice.purchaseOrder

For every matching invoice:

Read ONLY the field:

invoiceamount

Ignore every other monetary field including:

purchaseOrderAmount
amount
netAmount
taxAmount

Calculate:

Total Invoice Amount =
Sum(invoiceamount of all matching invoices)

Do NOT sum purchaseOrderAmount.

Do NOT multiply purchaseOrderAmount by the number of invoices.

purchaseOrderAmount is the Purchase Order limit and must NOT be included in the calculation.

After calculating:

Compare

Total Invoice Amount

with

purchaseOrderAmount

Rules

Total Invoice Amount <= purchaseOrderAmount
PASS

Total Invoice Amount > purchaseOrderAmount
FAIL

For FAIL return

Reason:
"The cumulative invoice amount exceeds the Purchase Order amount."

Also display

Purchase Order Amount

Total Invoice Amount

Difference

State which fields matched and their corresponding values.

==========================================================
OVERALL CONFIDENCE SCORE
==========================================================

Based ONLY on the validation results above, provide:

Confidence Score:
0-100%

Risk Level:

Low Risk

Medium Risk

High Risk

Do not use external assumptions.

==========================================================
AI RECOMMENDATION
==========================================================

Based ONLY on the validation results above, provide:

1. Concise Overall Summary

Summarize the validation outcome in 2-4 business-friendly sentences.

Mention only the validations that produced WARNING or FAIL.

----------------------------------------------------------

2. Recommended Action

Choose ONE:

- Post Invoice
- Route for Finance Approval
- Request Vendor Clarification
- Reject Invoice

----------------------------------------------------------

3. Why

Provide concise reasons ONLY for validations with WARNING or FAIL.

Do NOT explain PASS validations.

==========================================================
OUTPUT FORMAT
==========================================================

Return ONLY Markdown.

Use EXACTLY this structure.

# Invoice Validation

## Validation Results

1. contract Exists

✅ PASS

OR

❌ FAIL

Reason:
contract does not exist.

---

2. Purchase Order Exists

✅ PASS

OR

❌ FAIL

Reason:
Purchase Order does not exist.

---

3. Vendor Match

✅ PASS

OR

❌ FAIL

Reason:
Invoice vendor does not match the Purchase Order vendor.

---

4. Goods Receipt Exists

✅ PASS

OR

❌ FAIL

Reason:
Goods Receipt document not found.

---

5. Invoice Quantity Validation

✅ PASS

OR

❌ FAIL

Reason:
Invoice quantity exceeds the Goods Receipt quantity.

---

6. Invoice Amount Validation

✅ PASS

OR

⚠ WARNING

OR

❌ FAIL

Reason:
...

---

7. Tax Validation

✅ PASS

OR

⚠ WARNING

OR

❌ FAIL

Reason:
...

---

8. Payment Terms Validation

✅ PASS

OR

⚠ WARNING

OR

❌ FAIL

Reason:
...

---

9. Similar Invoice Validation

✅ PASS

OR

⚠ WARNING

OR

❌ FAIL

Reason:
...

---

10. Cumulative Purchase Order Amount Validation

✅ PASS

OR

⚠ WARNING

OR

❌ FAIL

Reason:
...

---

## Confidence Score

92%

Risk Level

Medium Risk

---

## AI Recommendation

### Overall Summary

...

### Recommended Action

...

### Why

...
`;
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
                }),
            }
        );

        const data = await response.json();

        setValidationResult(
            data.candidates?.[0]?.content?.parts?.[0]?.text ??
            "No response."
        );
    }
    catch(err){
        console.error(err);
    }
    finally{
        setIsValidating(false);
    }
};


  const handleDownloadPO = () => {}

  const handleAmendPO = () => {
    setIsAmendPOOpen(true)
  }

  const handleCancelPO = () => {
    console.log("Cancel PO clicked")
    // Add cancel PO logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download size={18} />
              Download PO
            </button>
            <POActionsMenu onAmendPO={handleAmendPO} onCancelPO={handleCancelPO} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-0 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "overview"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            PO overview
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`py-4 px-0 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "documents"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`py-4 px-0 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "delivery"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Delivery & GRN
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`py-4 px-0 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "invoices"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Invoices & payments
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* PO Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div className="flex-1 h-1 bg-green-600"></div>
                </div>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div className="flex-1 h-1 bg-green-600"></div>
                </div>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div className="flex-1 h-1 bg-green-600"></div>
                </div>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div className="flex-1 h-1 bg-blue-600"></div>
                </div>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    ◆
                  </div>
                  <div className="flex-1 h-1 bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                    ◆
                  </div>
                  <div className="flex-1 h-1 bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                    ◆
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-3">
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
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-700 mb-6">Request details</h2>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Request title</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">PO Number</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.poNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">PR Number</p>
                  <p className="text-sm font-semibold text-blue-600">{poData.prNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">RFP Number</p>
                  <p className="text-sm font-semibold text-blue-600">{poData.rfpNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 mt-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">PR type</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.prType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Department</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                  <p className="text-sm font-semibold text-orange-600">{poData.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 mt-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">PO issued date</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.poIssuedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Expected delivery date</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.expectedDeliveryDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Total PO value</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.totalPOValue}</p>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Vendor information</h2>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-600 mb-4">{poData.vendor.name}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">PO value</p>
                      <p className="text-sm font-semibold text-gray-900">{poData.vendor.poValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{poData.vendor.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Contact</p>
                      <p className="text-sm font-semibold text-gray-900">{poData.vendor.contact}</p>
                    </div>
                  </div>
                </div>
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={poData.vendor.logo || "/placeholder.svg"}
                    alt={poData.vendor.name}
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Goods Information */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Goods information</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Item description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Units of measure</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Unit price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Total price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poData.goods.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.unitPrice}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between items-center py-3 border-t border-gray-200 font-semibold text-gray-900">
                    <span>Total cost</span>
                    <span>{poData.totalCost}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Supporting documents (10)</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={18} />
                  Download All
                </button>
                <button className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 flex items-center gap-2">
                  <i className="ri-upload-cloud-2-line"></i>
                  Upload
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-6 py-3 text-left text-xs font-semibold">Type of Document</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold">Attachment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold">Uploaded By</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold">Uploaded Date</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.type}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            <i className="ri-file-pdf-fill"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.uploadedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.uploadedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delivery & GRN Tab */}
        {activeTab === "delivery" && (
          <div className="bg-white rounded-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">GRN number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Item description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Ordered quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Delivered quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Received person</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.grnNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.itemDescription}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.orderedQty}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.deliveredQty}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {item.status.includes("Verified") && (
                            <>
                              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                              <span className="text-green-600 font-medium">Verified</span>
                            </>
                          )}
                          {item.status.includes("Partial") && (
                            <>
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              <span className="text-yellow-600 font-medium">Partial</span>
                            </>
                          )}
                          {item.status === "Delivered" && (
                            <>
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              <span className="text-yellow-600 font-medium">Delivered</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.receivedPerson}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs">
                            <i className="ri-file-pdf-fill"></i>
                          </div>
                          <span className="text-gray-900">{item.receipt}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoices & Payments Tab */}
        {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-lg p-6">
          <div className="mb-5 flex items-center justify-between">
          {/* <div>
            {selectedInvoice ? (
              <div className="text-sm text-gray-600">
                Selected Invoice:
                <span className="ml-2 font-semibold text-green-700">
                  {selectedInvoice.invoiceNumber}
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Select an invoice to validate
              </div>
            )}
          </div> */}

          <div>
            {selectedInvoice ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Selected Invoice
                </p>

                <div className="mt-1 flex items-center gap-3">
                  <span className="text-lg font-semibold text-green-700">
                    {selectedInvoice.invoiceNumber}
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {selectedInvoice.status}
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-600">
                  {selectedInvoice.vendorName}
                </div>

                <div className="text-xs text-gray-500">
                  PO: {selectedInvoice.purchaseOrder} • {selectedInvoice.currency}{" "}
                  {selectedInvoice.amount}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Select an invoice from the table to validate.
              </div>
            )}
          </div>

          <button
            disabled={!selectedInvoice || isValidating}
            onClick={validateInvoice}
            className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isValidating ? "Validating..." : "Validate Invoice"}
          </button>

        </div>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    purchaseOrderAmount
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
                {invoiceData.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedInvoice(item)}
                    className={`cursor-pointer border-b transition-colors
                      ${
                        selectedInvoice?.invoiceRef === item.invoiceRef
                          ? "bg-green-50 border-green-300"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                  >
                    <td className="px-3 py-4">
                      <input
                        type="radio"
                        checked={selectedInvoice?.invoiceRef === item.invoiceRef}
                        onChange={() => setSelectedInvoice(item)}
                        onClick={(e) => e.stopPropagation()}
                      />
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
                ))}
              </tbody>
            </table>
          </div>

          {validationResult && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <i className="ri-ai-generate text-xl text-green-700"></i>
                <h2 className="text-lg font-semibold text-green-700">
                  AI Invoice Validation
                </h2>
              </div>

              <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {validationResult}
              </pre>
            </div>
          )}
        </div>
      )}
      </div>

      <AmendPOModal isOpen={isAmendPOOpen} onClose={() => setIsAmendPOOpen(false)} poNumber={poNumber} />
    </div>
  )
}
