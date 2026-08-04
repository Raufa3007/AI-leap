"use client"

import { useState } from "react"
import { ArrowLeft, Download } from "lucide-react"
import POActionsMenu from "./po-actions-menu"
import AmendPOModal from "./amend-po-modal"

interface PODetailPageProps {
  poNumber: string
  onBack: () => void
}

export default function PODetailPage({ poNumber, onBack }: PODetailPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "delivery" | "invoices">("overview")
  const [isAmendPOOpen, setIsAmendPOOpen] = useState(false)

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
      paymentDueDate: "Shawwal 22, 1441 (14 Jun 2025)",
      amount: "10,000.00",
      status: "Paid",
      attachment: "Invoice",
    },
    {
      invoiceRef: "0005000068",
      paymentDueDate: "Dhul Qadah 7, 1441 (28 Aug 2025)",
      amount: "10,000.00",
      status: "Paid",
      attachment: "Invoice",
    },
    {
      invoiceRef: "0005000069",
      paymentDueDate: "Rabi Al-Awwal 29, 1442 (15 Sep 2020)",
      amount: "10,000.00",
      status: "Submitted",
      attachment: "Invoice not generated",
    },
  ]

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
        {activeTab === "invoices" && (
          <div className="bg-white rounded-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Invoice reference</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Payment due date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Attachment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Payment confirmation</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.invoiceRef}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{item.paymentDueDate.split("(")[0].trim()}</div>
                        <div className="text-xs text-gray-500">
                          {item.paymentDueDate.split("(")[1]?.replace(")", "")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.amount}</td>
                      <td className="px-6 py-4 text-sm">
                        {item.status === "Paid" && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span className="text-green-600 font-medium">Paid</span>
                          </div>
                        )}
                        {item.status === "Submitted" && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            <span className="text-yellow-600 font-medium">Submitted</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.attachment !== "Invoice not generated" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs">
                              <i className="ri-file-pdf-fill"></i>
                            </div>
                            <span className="text-gray-900">{item.attachment}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">{item.attachment}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.status === "Submitted" && (
                          <button className="text-blue-600 hover:text-blue-800 font-medium">Proceed to payment</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AmendPOModal isOpen={isAmendPOOpen} onClose={() => setIsAmendPOOpen(false)} poNumber={poNumber} />
    </div>
  )
}
