"use client"

import { useState } from "react"
import PDFPreviewModal from "./pdf-preview-modal"

interface Invoice {
  reference: string
  date: string
  location: string
  amount: string
  status: "Paid" | "Pending"
  file: string
}

interface VendorDetailsInvoicesProps {
  vendorId: string
}

export default function VendorDetailsInvoices({ vendorId }: VendorDetailsInvoicesProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const invoiceData = {
    "76567": [
      {
        reference: "1070000137",
        date: "14 June 2020",
        location: "Shawwal 22, 1441",
        amount: "10,000.00",
        status: "Paid" as const,
        file: "Invoice 6.5kb",
      },
      {
        reference: "0005000068",
        date: "28 June 2020",
        location: "Dhul Qadah 7, 1441",
        amount: "10,000.00",
        status: "Paid" as const,
        file: "Invoice 6.5kb",
      },
      {
        reference: "1070000136",
        date: "24 August 2020",
        location: "Muharram 5, 1441",
        amount: "10,000.00",
        status: "Paid" as const,
        file: "Invoice 6.5kb",
      },
      {
        reference: "0005000069",
        date: "15 Nov 2020",
        location: "Rabi Al-Awwal 29, 1442",
        amount: "10,000.00",
        status: "Pending" as const,
        file: "Invoice 6.5kb",
      },
      {
        reference: "1070000140",
        date: "05 Dec 2020",
        location: "Rabi Al-Thani 20, 1442",
        amount: "15,500.00",
        status: "Paid" as const,
        file: "Invoice 7.2kb",
      },
      {
        reference: "0005000075",
        date: "18 Jan 2021",
        location: "Jumada Al-Awwal 4, 1442",
        amount: "12,000.00",
        status: "Paid" as const,
        file: "Invoice 6.8kb",
      },
      {
        reference: "1070000145",
        date: "10 Feb 2021",
        location: "Jumada Al-Thani 28, 1442",
        amount: "8,500.00",
        status: "Paid" as const,
        file: "Invoice 5.9kb",
      },
      {
        reference: "0005000082",
        date: "25 Mar 2021",
        location: "Rajab 12, 1442",
        amount: "11,250.00",
        status: "Pending" as const,
        file: "Invoice 6.3kb",
      },
    ],
    "76560": [
      {
        reference: "2070000145",
        date: "10 March 2021",
        location: "Jumada Al-Awwal 26, 1442",
        amount: "15,500.00",
        status: "Paid" as const,
        file: "Invoice 7.2kb",
      },
      {
        reference: "0006000072",
        date: "05 April 2021",
        location: "Jumada Al-Thani 23, 1442",
        amount: "12,000.00",
        status: "Paid" as const,
        file: "Invoice 6.8kb",
      },
      {
        reference: "2070000150",
        date: "20 May 2021",
        location: "Shawwal 8, 1442",
        amount: "18,750.00",
        status: "Paid" as const,
        file: "Invoice 7.5kb",
      },
      {
        reference: "0006000078",
        date: "15 June 2021",
        location: "Dhul Qadah 6, 1442",
        amount: "14,200.00",
        status: "Pending" as const,
        file: "Invoice 6.9kb",
      },
    ],
    "66789": [
      {
        reference: "3070000152",
        date: "20 January 2021",
        location: "Jumada Al-Awwal 6, 1442",
        amount: "8,500.00",
        status: "Paid" as const,
        file: "Invoice 5.9kb",
      },
      {
        reference: "3070000158",
        date: "14 February 2021",
        location: "Jumada Al-Thani 2, 1442",
        amount: "9,750.00",
        status: "Paid" as const,
        file: "Invoice 6.1kb",
      },
      {
        reference: "3070000165",
        date: "10 March 2021",
        location: "Rajab 25, 1442",
        amount: "7,200.00",
        status: "Paid" as const,
        file: "Invoice 5.7kb",
      },
    ],
  }

  const data = invoiceData[vendorId as keyof typeof invoiceData] || []

  const getStatusColor = (status: string) => {
    if (status === "Paid") return "bg-green-100 text-green-700"
    if (status === "Pending") return "bg-orange-100 text-orange-700"
    return "bg-gray-100 text-gray-700"
  }

  const handleDownload = () => {
    console.log("Downloading invoice:", selectedInvoice?.reference)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((invoice) => (
                <tr key={invoice.reference} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{invoice.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{invoice.location}</div>
                    <div className="text-xs text-gray-500">{invoice.date}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{invoice.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          PDF
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm">{invoice.file}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload()}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No invoices found for this vendor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PDFPreviewModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        fileName={selectedInvoice?.file || ""}
        fileReference={selectedInvoice?.reference}
      />
    </>
  )
}
