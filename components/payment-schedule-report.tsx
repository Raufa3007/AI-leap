"use client"

import { useState } from "react"

interface PaymentData {
  invoiceId: string
  supplier: string
  invoiceAmount: number
  dueDate: string
  status: "Paid" | "Pending"
}

const paymentData: PaymentData[] = [
  {
    invoiceId: "INV- 202401",
    supplier: "Health First Insurance",
    invoiceAmount: 85000,
    dueDate: "10 Feb 2024",
    status: "Pending",
  },
  { invoiceId: "INV- 202402", supplier: "Kaar Tech", invoiceAmount: 150000, dueDate: "15 Feb 2024", status: "Paid" },
  {
    invoiceId: "INV- 202403",
    supplier: "Digital Ads Co",
    invoiceAmount: 70000,
    dueDate: "20 Mar 2024",
    status: "Pending",
  },
  {
    invoiceId: "INV- 202404",
    supplier: "Luxury Events Ltd",
    invoiceAmount: 95000,
    dueDate: "25 Apr 2024",
    status: "Paid",
  },
  {
    invoiceId: "INV- 202405",
    supplier: "Tech Solutions",
    invoiceAmount: 200000,
    dueDate: "19 May 2024",
    status: "Paid",
  },
  { invoiceId: "INV- 202406", supplier: "AWS", invoiceAmount: 180000, dueDate: "30 Jun 2024", status: "Paid" },
  {
    invoiceId: "INV- 202407",
    supplier: "Scientific Supplies",
    invoiceAmount: 250000,
    dueDate: "05 Jul 2024",
    status: "Pending",
  },
  {
    invoiceId: "INV- 202408",
    supplier: "Law & Associates",
    invoiceAmount: 130000,
    dueDate: "10 Aug 2024",
    status: "Paid",
  },
]

export default function PaymentScheduleReport() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = paymentData.filter(
    (row) =>
      row.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Report Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-700">Payment Schedule Report</h2>
          <div className="flex gap-2">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Invoice ID, Supplier"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <i className="ri-filter-line text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <i className="ri-download-line text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Invoice ID <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Invoice Amount (SAR) <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.invoiceId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.supplier}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.invoiceAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.dueDate}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      row.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            <i className="ri-arrow-left-s-line" />
          </button>
          <button className="px-3 py-1 bg-green-700 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">4</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">5</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>
        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>10/ Page</option>
          <option>25/ Page</option>
          <option>50/ Page</option>
        </select>
      </div>
    </div>
  )
}
