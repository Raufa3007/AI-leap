"use client"

import { useState } from "react"
import { X, Download, ZoomIn, ZoomOut } from "lucide-react"

interface PDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  fileReference?: string
  invoiceData?: {
    invoiceNumber: string
    dateIssued: string
    dueDate: string
    billedTo: {
      company: string
      address1: string
      address2: string
    }
    from: {
      company: string
      address1: string
      address2: string
    }
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }>
    total: number
    paymentMethod: string
    bank: string
    accountNumber: string
    swiftCode: string
  }
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  fileName,
  fileReference,
  invoiceData,
}: PDFPreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState(100)

  if (!isOpen) return null

  const handleDownload = () => {
    console.log("Downloading:", fileName)
  }

  // Generate random invoice data if not provided
  const getInvoiceData = () => {
    if (invoiceData) return invoiceData

    const companies = ["KaapSarc", "TechCorp", "Digital Solutions", "Enterprise Systems"]
    const departments = ["Finance", "IT", "Operations", "Procurement"]
    const items = [
      { description: "Website Redesign (UI/UX)", quantity: 1, unitPrice: 5000 },
      { description: "Monthly Maintenance - October", quantity: 1, unitPrice: 1000 },
      { description: "Hosting Fee", quantity: 1, unitPrice: 500 },
      { description: "API Integration", quantity: 2, unitPrice: 2500 },
      { description: "Security Audit", quantity: 1, unitPrice: 3000 },
    ]

    const selectedItems = items.slice(0, Math.floor(Math.random() * 3) + 2)
    const total = selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    return {
      invoiceNumber: `0${Math.floor(Math.random() * 900000000000) + 100000000000}`,
      dateIssued: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      billedTo: {
        company: companies[Math.floor(Math.random() * companies.length)],
        address1: "123 Market Street",
        address2: "San Francisco, CA 94105",
      },
      from: {
        company: "Kaar Technologies",
        address1: "Shyamala Towers, 8th Floor",
        address2: "Chennai, Tamilnadu, 600015",
      },
      items: selectedItems,
      total,
      paymentMethod: "Bank transfer",
      bank: "Axis bank",
      accountNumber: "AX12300000001234567",
      swiftCode: "AXIX3552",
    }
  }

  const data = getInvoiceData()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {fileReference ? `Invoice Preview - ${fileReference}` : `Document Preview - ${fileName}`}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Content - PDF Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
          <div
            className="bg-white p-8 shadow-lg transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div className="w-96 bg-white">
              {/* Invoice Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Invoice snapshot</h1>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-600">Invoice number</p>
                    <p className="font-semibold text-gray-900">{data.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date issued</p>
                    <p className="font-semibold text-gray-900">{data.dateIssued}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due date</p>
                    <p className="font-semibold text-gray-900">{data.dueDate}</p>
                  </div>
                </div>

                <hr className="my-6" />

                {/* Billed To and From */}
                <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Billed to:</p>
                    <p className="text-gray-900 font-medium">{data.billedTo.company}</p>
                    <p className="text-gray-600">{data.billedTo.address1}</p>
                    <p className="text-gray-600">{data.billedTo.address2}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">From:</p>
                    <p className="text-gray-900 font-medium">{data.from.company}</p>
                    <p className="text-gray-600">{data.from.address1}</p>
                    <p className="text-gray-600">{data.from.address2}</p>
                  </div>
                </div>

                <hr className="my-6" />
              </div>

              {/* Line Items Table */}
              <div className="mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Description</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Quantity</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Unit Price (SAR)</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Total price (SAR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {(item.quantity * item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-end mb-6">
                <div className="w-64 bg-gray-50 p-4 rounded">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{data.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-600">Payment method</p>
                  <p className="font-semibold text-gray-900">{data.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bank</p>
                  <p className="font-semibold text-gray-900">{data.bank}</p>
                </div>
                <div>
                  <p className="text-gray-600">Account number</p>
                  <p className="font-semibold text-gray-900">{data.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Swift code</p>
                  <p className="font-semibold text-gray-900">{data.swiftCode}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-900 font-semibold">Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 font-medium w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
