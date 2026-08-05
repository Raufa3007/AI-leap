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
  const GEMINI_API_KEY = "AIzaSyDo3I3zv6gCd1A2Iz3Giy_plhLRiCnAPuQ";

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
        alert("Please select an invoice.");
        return;
    }

    try {
        setIsValidating(true);
        setValidationResult("");

        const prompt = `
You are an Procurement and Accounts Payable Invoice Validation Assistant.

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

The following invoices are provided ONLY for comparison.
The selected invoice above is the invoice being validated.

${JSON.stringify(invoiceData, null, 2)}

==========================================================
VALIDATION RULES
==========================================================

Perform ONLY the following validations.
Try to be concise and clear in your output.

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

Calculate the percentage by which the invoice exceeds the PO amount.

Example:

Invoice amount exceeds Purchase Order amount by 8%.

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

Compare the selected invoice against ALL OTHER invoices in the dataset.

The selected invoice will also appear inside the reference dataset.
Exclude it before performing the Similar Invoice Validation.

Compare ONLY these fields:

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

State which fields didn't match and their data.

==========================================================
OVERALL CONFIDENCE SCORE
==========================================================

Based on the validation results, provide:

Confidence Score:
0-100%

Risk Level:

Low Risk
Medium Risk
High Risk

Use your judgement based ONLY on the above validations.

==========================================================
AI RECOMMENDATION
==========================================================

Provide:

1. Concise Overall Summary

Example:

This invoice is generally compliant.

However,

• Price variance exceeds tolerance.

• Similar invoice detected.

----------------------------------------------------------

2. Recommended Action

Examples:
Post invoice
Route for Finance Approval
Request Vendor Clarification
Reject Invoice

----------------------------------------------------------

3. Explain WHY

Explain every warning or failure in business language.

==========================================================
OUTPUT FORMAT
==========================================================

Return ONLY markdown.

Use exactly this structure.

# Invoice Validation

## Validation Results

✅ Invoice Amount Validation

...

⚠ Tax Validation

...

❌ Payment Terms Validation

...

⚠ Similar Invoice Validation

...

---

## Confidence Score

92%

Risk Level

Medium Risk

---

AI Recommendation

...

---

Why

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
                    Invoice Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    PO Number
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Amount
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
                      {item.invoiceDate}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.purchaseOrder}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.currency} {item.amount}
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
