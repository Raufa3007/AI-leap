
"use client"

import { useState } from "react"
import { ArrowLeft, Download, Sparkles, FileText, Building2, Receipt, ShieldCheck } from "lucide-react"
import POActionsMenu from "./po-actions-menu"
import AmendPOModal from "./amend-po-modal"

interface PODetailPageProps {
  poNumber: string
  onBack: () => void
}

interface ValidationDetail {
  label: string
  value: string
}

interface ValidationCheck {
  name: string
  status: "passed" | "warning" | "failed"
  title: string
  details: ValidationDetail[]
  explanation?: string
}

interface InvoiceValidationResult {
  confidenceScore: number
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk"
  overallStatus: "Compliant" | "Action Required" | "Rejected"
  summary: string
  validations: ValidationCheck[]
  recommendation: {
    action: string
    reason: string
  }
}

export default function PODetailPage({ poNumber, onBack }: PODetailPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "delivery" | "invoices"
  >("overview")

  const [isAmendPOOpen, setIsAmendPOOpen] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] =
    useState<InvoiceValidationResult | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  // const GEMINI_API_KEY = ""

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
      invoiceRef: "1070000137",
      invoiceNumber: "5100001234",
      invoiceDate: "20 May 2025",
      paymentDueDate: "14 Jun 2025",
      vendorName: "ABC Trading Co.",
      purchaseOrder: "4500001234",
      purchaseOrderAmount: "12,500.00",
      goodsReceipt: "5000012345",
      fiscalYear: "2025",
      currency: "SAR",
      amount: "10,000.00",
      taxAmount: "1,500.00",
      netAmount: "8,500.00",
      paymentTerms: "Net 30",
      vendorPaymentTerms: "Net 45",
      paymentMethod: "Bank Transfer",
      paymentReference: "1900000123",
      status: "Paid",
      postingDate: "22 May 2025",
      documentType: "Vendor Invoice",
      companyCode: "1000",
      attachment: "Invoice.pdf",
    },
    {
      invoiceRef: "0005000068",
      invoiceNumber: "5100001235",
      invoiceDate: "29 Jul 2025",
      paymentDueDate: "28 Aug 2025",
      vendorName: "XYZ Industrial Supplies",
      purchaseOrder: "4500001456",
      purchaseOrderAmount: "15,000.00",
      goodsReceipt: "5000012678",
      fiscalYear: "2025",
      currency: "SAR",
      amount: "10,000.00",
      taxAmount: "1,500.00",
      netAmount: "8,500.00",
      paymentTerms: "Net 30",
      vendorPaymentTerms: "Net 30",
      paymentMethod: "Bank Transfer",
      paymentReference: "1900000124",
      status: "Paid",
      postingDate: "30 Jul 2025",
      documentType: "Vendor Invoice",
      companyCode: "1000",
      attachment: "Invoice.pdf",
    },
    {
      invoiceRef: "0005000069",
      invoiceNumber: "5100001236",
      invoiceDate: "16 Aug 2020",
      paymentDueDate: "15 Sep 2020",
      vendorName: "Global Engineering Ltd.",
      purchaseOrder: "4500001567",
      purchaseOrderAmount: "10,000.00",
      goodsReceipt: "5000012890",
      fiscalYear: "2020",
      currency: "SAR",
      amount: "10,000.00",
      taxAmount: "1,500.00",
      netAmount: "8,500.00",
      paymentTerms: "Net 30",
      vendorPaymentTerms: "Immediate",
      paymentMethod: "-",
      paymentReference: "-",
      status: "Submitted",
      postingDate: "17 Aug 2020",
      documentType: "Vendor Invoice",
      companyCode: "1000",
      attachment: "Invoice not generated",
    },
  ]

  const validateInvoice = async () => {
    if (!selectedInvoice) {
      alert("Please select an invoice.")
      return
    }

    try {
      setIsValidating(true)
      setValidationResult(null)

      const prompt = `
You are an Procurement and Accounts Payable Invoice Validation Assistant.

Your task is to validate ONE selected invoice using the business validation rules provided below.

Do not assume or invent any values.

Use ONLY the data provided.

Perform all calculations yourself from the supplied invoice fields.

Do not make assumptions beyond the stated validation rules.

Return ONLY valid JSON.

==========================================================
SELECTED INVOICE
==========================================================

${JSON.stringify(selectedInvoice, null, 2)}

==========================================================
REFERENCE INVOICE DATASET
==========================================================

${JSON.stringify(invoiceData, null, 2)}

==========================================================
VALIDATION RULES
==========================================================

1. Invoice Amount Validation

Compare:

purchaseOrderAmount
amount

Rules:

- If Invoice Amount < Purchase Order Amount
    WARNING

- If Invoice Amount == Purchase Order Amount
    PASS

- If Invoice Amount > Purchase Order Amount
    FAIL

----------------------------------------------------------

2. Tax Validation

Use field:

taxAmount

Rules:

- taxAmount > 0
    PASS

- taxAmount == 0
    WARNING

- taxAmount is empty or missing
    FAIL

----------------------------------------------------------

3. Payment Terms Validation

Compare:

paymentTerms
vendorPaymentTerms

Rules:

- Both values equal
    PASS

- Either value missing
    WARNING

- Values different
    FAIL

----------------------------------------------------------

4. Similar Invoice Validation

Compare the selected invoice against ALL OTHER invoices.

Exclude the selected invoice.

Compare ONLY:

invoiceRef
purchaseOrder
goodsReceipt
vendorName

Rules:

- None match
    PASS

- One or more fields match
    WARNING

- All four fields match
    FAIL

==========================================================
OVERALL CONFIDENCE SCORE
==========================================================

Provide:

Confidence Score:
0-100%

Risk Level:

Low Risk
Medium Risk
High Risk

==========================================================
AI RECOMMENDATION
==========================================================

Provide:

Concise Overall Summary

Recommended Action

Explain WHY

==========================================================
OUTPUT FORMAT
==========================================================

Return ONLY valid JSON.

Do not return Markdown.
Do not use code fences.
Do not add any text before or after the JSON.

Use exactly this structure:

{
  "confidenceScore": 80,
  "riskLevel": "Medium Risk",
  "overallStatus": "Action Required",
  "summary": "Invoice amount is lower than the Purchase Order amount.",
  "validations": [
    {
      "name": "Invoice Amount",
      "status": "warning",
      "title": "Variance detected",
      "details": [
        { "label": "Invoice", "value": "SAR 10,000" },
        { "label": "PO Amount", "value": "SAR 15,000" },
        { "label": "Difference", "value": "SAR 5,000 lower" }
      ],
      "explanation": "The invoice amount is lower than the Purchase Order amount."
    },
    {
      "name": "Tax Validation",
      "status": "passed",
      "title": "Passed",
      "details": [
        { "label": "Tax amount", "value": "SAR 1,500" }
      ],
      "explanation": "Tax amount is greater than 0."
    },
    {
      "name": "Payment Terms",
      "status": "passed",
      "title": "Passed",
      "details": [
        { "label": "Payment Terms", "value": "Net 30 = Net 30" }
      ],
      "explanation": "Payment terms match the vendor payment terms."
    },
    {
      "name": "Duplicate Check",
      "status": "passed",
      "title": "Passed",
      "details": [
        { "label": "Result", "value": "No similar invoices found" }
      ],
      "explanation": "No similar invoices were found."
    }
  ],
  "recommendation": {
    "action": "Route for Finance Approval",
    "reason": "The invoice amount is lower than the PO amount. Verify whether this is due to partial delivery, a price change, or an adjustment to the purchase order."
  }
}
`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      )

      const data = await response.json()

      const rawResult =
        data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

      const cleanedResult = rawResult
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()

      try {
        setValidationResult(JSON.parse(cleanedResult))
      } catch (parseError) {
        console.error(
          "Failed to parse AI validation response:",
          parseError
        )
        setValidationResult(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleDownloadPO = () => {}

  const handleAmendPO = () => {
    setIsAmendPOOpen(true)
  }

  const handleCancelPO = () => {
    console.log("Cancel PO clicked")
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-gray-900">

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Purchase Order
              </p>

              <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                {poData.id}
                <span className="mx-2 text-gray-300">/</span>
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
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={handleDownloadPO}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            >
              <Download size={17} />
              Download PO
            </button>

            <POActionsMenu
              onAmendPO={handleAmendPO}
              onCancelPO={handleCancelPO}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] gap-7 overflow-x-auto">

          {[
            ["overview", "PO overview"],
            ["documents", "Documents"],
            ["delivery", "Delivery & GRN"],
            ["invoices", "Invoices & payments"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setActiveTab(
                  value as
                    | "overview"
                    | "documents"
                    | "delivery"
                    | "invoices"
                )
              }
              className={`relative whitespace-nowrap py-4 text-sm font-medium transition ${
                activeTab === value
                  ? "text-green-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}

              {activeTab === value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6">

        {/* PO Overview */}
        {activeTab === "overview" && (
          <div className="space-y-5">

            {/* Progress */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center justify-between gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
                  <div
                    key={step}
                    className="flex flex-1 items-center last:flex-none"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        index < 4
                          ? "bg-green-600 text-white"
                          : index === 4
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {index < 4 ? "✓" : "◆"}
                    </div>

                    {index < 6 && (
                      <div
                        className={`mx-1 h-1 flex-1 rounded-full ${
                          index < 3
                            ? "bg-green-600"
                            : index === 3
                              ? "bg-blue-600"
                              : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 hidden justify-between text-[11px] text-gray-500 lg:flex">
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
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-6 text-base font-bold text-gray-900">
                Request details
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Request title", poData.title],
                  ["PO Number", poData.poNumber],
                  ["PR Number", poData.prNumber],
                  ["RFP Number", poData.rfpNumber],
                  ["PR type", poData.prType],
                  ["Department", poData.department],
                  ["Status", poData.status],
                  ["PO issued date", poData.poIssuedDate],
                  ["Expected delivery date", poData.expectedDeliveryDate],
                  ["Total PO value", poData.totalPOValue],
                ].map(([label, value], index) => (
                  <div key={label}>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {label}
                    </p>

                    <p
                      className={`text-sm font-semibold ${
                        label === "PR Number" || label === "RFP Number"
                          ? "text-blue-600"
                          : label === "Status"
                            ? "text-orange-600"
                            : "text-gray-900"
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-2">
                <Building2 size={18} className="text-green-700" />
                <h2 className="text-base font-bold text-gray-900">
                  Vendor information
                </h2>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <p className="mb-4 text-sm font-bold text-green-700">
                    {poData.vendor.name}
                  </p>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        PO value
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {poData.vendor.poValue}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Email
                      </p>
                      <p className="break-all text-sm font-semibold text-gray-900">
                        {poData.vendor.email}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Contact
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {poData.vendor.contact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                  <img
                    src={poData.vendor.logo || "/placeholder.svg"}
                    alt={poData.vendor.name}
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Goods */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <h2 className="text-base font-bold text-gray-900">
                  Goods information
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-gray-200 bg-gray-50">
                      {[
                        "Item description",
                        "Quantity",
                        "Units of measure",
                        "Unit price",
                        "Total price",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {poData.goods.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {item.unit}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {item.unitPrice}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                          {item.totalPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end p-5 sm:p-6">
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <span className="text-sm font-semibold text-gray-600">
                      Total cost
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {poData.totalCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === "documents" && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Documents
                </p>
                <h2 className="mt-1 text-base font-bold text-gray-900">
                  Supporting documents
                  <span className="ml-2 text-sm font-medium text-gray-400">
                    (10)
                  </span>
                </h2>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Download size={17} />
                  Download All
                </button>

                <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
                  <i className="ri-upload-cloud-2-line" />
                  Upload
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                      Type of Document
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                      Attachment
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                      Uploaded By
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                      Uploaded Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((doc, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.type}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <i className="ri-file-pdf-fill text-lg" />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {doc.size}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doc.uploadedBy}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doc.uploadedDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delivery */}
        {activeTab === "delivery" && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Fulfilment
              </p>
              <h2 className="mt-1 text-base font-bold text-gray-900">
                Delivery & GRN
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-gray-200 bg-gray-50">
                    {[
                      "GRN number",
                      "Item description",
                      "Ordered quantity",
                      "Delivered quantity",
                      "Status",
                      "Received person",
                      "Receipt",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {deliveryData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.grnNumber}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.itemDescription}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.orderedQty}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.deliveredQty}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              item.status.includes("Partial")
                                ? "bg-yellow-500"
                                : "bg-green-600"
                            }`}
                          />

                          <span
                            className={`font-medium ${
                              item.status.includes("Partial")
                                ? "text-yellow-700"
                                : "text-green-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.receivedPerson}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-red-50 text-red-600">
                            <i className="ri-file-pdf-fill" />
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

        {/* Invoices */}
        {activeTab === "invoices" && (
          <div className="space-y-5">

            {/* ======================================================
                SELECTED INVOICE / VALIDATION CONTROL
            ======================================================= */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Receipt size={18} className="text-green-700" />

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Invoice Validation
                    </p>
                    <p className="text-xs text-gray-400">
                      Select an invoice and run AI-powered validation
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">

                {selectedInvoice ? (

                  /* ================= SELECTED INVOICE CARD ================= */
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0 flex-1">

                      {/* Invoice identity */}
                      <div className="flex flex-wrap items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                          <FileText size={20} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                              Selected Invoice
                            </p>

                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                              {selectedInvoice.status}
                            </span>
                          </div>

                          <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                            {selectedInvoice.invoiceNumber}
                          </h2>
                        </div>
                      </div>

                      {/* Invoice metadata */}
                      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Building2 size={14} />
                            <p className="text-[10px] font-bold uppercase tracking-wider">
                              Vendor
                            </p>
                          </div>

                          <p className="mt-1.5 truncate text-sm font-semibold text-gray-900">
                            {selectedInvoice.vendorName}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Purchase Order
                          </p>

                          <p className="mt-1.5 text-sm font-semibold text-gray-900">
                            {selectedInvoice.purchaseOrder}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Invoice Amount
                          </p>

                          <p className="mt-1.5 text-sm font-bold text-gray-900">
                            {selectedInvoice.currency}{" "}
                            {selectedInvoice.amount}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Due Date
                          </p>

                          <p className="mt-1.5 text-sm font-semibold text-gray-900">
                            {selectedInvoice.paymentDueDate}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Validation action */}
                    <div className="shrink-0 lg:pl-4">

                      <button
                        disabled={!selectedInvoice || isValidating}
                        onClick={validateInvoice}
                        className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
                      >
                        {isValidating ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={17} />
                            Validate Invoice
                          </>
                        )}
                      </button>

                      <p className="mt-2 text-center text-[10px] text-gray-400 lg:text-right">
                        AI-powered validation
                      </p>

                    </div>

                  </div>

                ) : (

                  /* ================= EMPTY SELECTION STATE ================= */
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-8 text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <FileText size={21} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No invoice selected
                    </p>

                    <p className="mt-1 max-w-md text-xs leading-5 text-gray-400">
                      Select an invoice from the table below to review its
                      details and run AI validation.
                    </p>

                  </div>
                )}

              </div>
            </div>

            {/* Invoice table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Accounts Payable
                    </p>

                    <h2 className="mt-1 text-base font-bold text-gray-900">
                      Invoices & payments
                    </h2>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                    {invoiceData.length} invoices
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-y border-gray-200 bg-gray-50">

                      <th className="w-12 px-3 py-3" />

                      {[
                        "Invoice Ref.",
                        "Invoice No.",
                        "Invoice Date",
                        "PO Number",
                        "Amount",
                        "Due Date",
                        "Status",
                        "Payment Ref.",
                        "Attachment",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500"
                        >
                          {header}
                        </th>
                      ))}

                    </tr>
                  </thead>

                  <tbody>
                    {invoiceData.map((item, idx) => {

                      const isSelected =
                        selectedInvoice?.invoiceRef === item.invoiceRef

                      return (
                        <tr
                          key={idx}
                          onClick={() => {
                            setSelectedInvoice(item)
                            setValidationResult(null)
                          }}
                          className={`cursor-pointer border-b transition ${
                            isSelected
                              ? "border-green-200 bg-green-50/70"
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >

                          <td className="px-3 py-4">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedInvoice(item)
                                setValidationResult(null)
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-green-700"
                            />
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.invoiceRef}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {item.invoiceNumber}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.invoiceDate}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.purchaseOrder}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {item.currency} {item.amount}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.paymentDueDate}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">

                              <span
                                className={`h-2 w-2 rounded-full ${
                                  item.status === "Paid"
                                    ? "bg-green-600"
                                    : item.status === "Rejected"
                                      ? "bg-red-600"
                                      : "bg-yellow-500"
                                }`}
                              />

                              <span
                                className={`font-medium ${
                                  item.status === "Paid"
                                    ? "text-green-700"
                                    : item.status === "Rejected"
                                      ? "text-red-700"
                                      : "text-yellow-700"
                                }`}
                              >
                                {item.status}
                              </span>

                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.paymentReference}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {item.attachment !== "Invoice not generated" ? (
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                  <i className="ri-file-pdf-fill" />
                                </div>
                                <span className="text-gray-700">
                                  {item.attachment}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">
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

            {/* AI Validation Result */}
            {validationResult && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6 bg-green-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Sparkles size={19} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                        AI Analysis
                      </p>

                      <h2 className="text-base font-bold text-gray-900">
                        Invoice Validation
                      </h2>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="text-right">
                      <p className="text-xl font-bold leading-none text-gray-900">
                        {validationResult.confidenceScore}%
                      </p>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Confidence
                      </p>
                    </div>

                    <div
                      className={`rounded-lg px-3 py-1.5 text-center text-[10px] font-bold uppercase leading-tight tracking-wider ${
                        validationResult.riskLevel === "Low Risk"
                          ? "bg-green-50 text-green-700"
                          : validationResult.riskLevel === "High Risk"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {validationResult.riskLevel.replace(" Risk", "")}
                      <br />
                      RISK
                    </div>

                  </div>
                </div>

                {/* Summary */}
                <div className="border-b border-gray-200 px-5 py-5 sm:px-6">

                  <div className="flex items-start gap-3">

                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        validationResult.overallStatus === "Compliant"
                          ? "bg-green-100 text-green-700"
                          : validationResult.overallStatus === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <i
                        className={
                          validationResult.overallStatus === "Compliant"
                            ? "ri-check-line"
                            : validationResult.overallStatus === "Rejected"
                              ? "ri-close-line"
                              : "ri-alert-line"
                        }
                      />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${
                          validationResult.overallStatus === "Compliant"
                            ? "text-green-700"
                            : validationResult.overallStatus === "Rejected"
                              ? "text-red-700"
                              : "text-yellow-700"
                        }`}
                      >
                        {validationResult.overallStatus}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        {validationResult.summary}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Validation Checks */}
                <div className="border-b border-gray-200 px-5 py-5 sm:px-6">

                  <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Validation Checks
                  </h3>

                  <div className="space-y-5">

                    {validationResult.validations.map(
                      (validation, index) => {

                        const isPassed =
                          validation.status === "passed"

                        const isFailed =
                          validation.status === "failed"

                        return (
                          <div
                            key={`${validation.name}-${index}`}
                            className="flex items-start gap-3"
                          >

                            <div
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                isPassed
                                  ? "bg-green-100 text-green-700"
                                  : isFailed
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              <i
                                className={
                                  isPassed
                                    ? "ri-check-line"
                                    : isFailed
                                      ? "ri-close-line"
                                      : "ri-alert-line"
                                }
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-wrap items-center gap-2">

                                <p className="text-sm font-bold text-gray-900">
                                  {validation.name}
                                </p>

                                <span
                                  className={`text-xs font-semibold ${
                                    isPassed
                                      ? "text-green-700"
                                      : isFailed
                                        ? "text-red-700"
                                        : "text-yellow-700"
                                  }`}
                                >
                                  {validation.title}
                                </span>

                              </div>

                              <div className="mt-2 space-y-1.5">

                                {validation.details.map(
                                  (detail, detailIndex) => (
                                    <div
                                      key={`${detail.label}-${detailIndex}`}
                                      className="flex flex-wrap gap-x-3 text-sm"
                                    >
                                      <span className="min-w-[105px] font-medium text-gray-500">
                                        {detail.label}
                                      </span>

                                      <span className="font-semibold text-gray-800">
                                        {detail.value}
                                      </span>
                                    </div>
                                  )
                                )}

                              </div>

                              {validation.explanation && (
                                <p className="mt-2 text-xs leading-5 text-gray-500">
                                  {validation.explanation}
                                </p>
                              )}

                            </div>
                          </div>
                        )
                      }
                    )}

                  </div>
                </div>

                {/* Recommended Action */}
                <div className="px-5 py-5 sm:px-6 bg-green-50">

                  <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Recommended Action
                  </h3>

                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                      <i className="ri-arrow-right-line" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {validationResult.recommendation.action}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {validationResult.recommendation.reason}
                      </p>
                    </div>

                  </div>
                </div>

              </section>
            )}

          </div>
        )}
      </div>

      <AmendPOModal
        isOpen={isAmendPOOpen}
        onClose={() => setIsAmendPOOpen(false)}
        poNumber={poNumber}
      />
    </div>
  )
}

