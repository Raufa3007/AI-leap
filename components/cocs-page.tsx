"use client"

import { useState } from "react"

interface CoC {
  id: string
  contractNumber: string
  poNumber: string
  invoiceNumber: string
  createdOn: string
  status: "Completed" | "Pending" | "Rejected"
  pendingWith: string
  sla: string
}

const cocsData: CoC[] = [
  {
    id: "1",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "2",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "3",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "4",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "5",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "6",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "7",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
  {
    id: "8",
    contractNumber: "4300000018",
    poNumber: "4300000018",
    invoiceNumber: "4300000018",
    createdOn: "12 Jan 2025",
    status: "Completed",
    pendingWith: "Mesheri Saud Mohammad Alquayazani",
    sla: "--",
  },
]

export default function CocsPage() {
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [cocSearch, setCocSearch] = useState("")

  const handleApplyFilter = () => {
    console.log("Filters applied:", { statusFilter, fromDate, toDate, cocSearch })
    setShowFilterModal(false)
  }

  const handleReset = () => {
    setStatusFilter("")
    setFromDate("")
    setToDate("")
    setCocSearch("")
  }

  const handleDownload = () => {
    const csv = [
      ["Contract Number", "PO Number", "Invoice Number", "Created On", "Status", "Pending with", "SLA"],
      ...cocsData.map((coc) => [
        coc.contractNumber,
        coc.poNumber,
        coc.invoiceNumber,
        coc.createdOn,
        coc.status,
        coc.pendingWith,
        coc.sla,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cocs.csv"
    a.click()
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Certificate of Completion List (12)</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Filter"
          >
            <i className="ri-filter-3-fill text-gray-600" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Download"
          >
            <i className="ri-download-line text-gray-600" />
          </button>
        </div>
      </div>

      {showFilterModal && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Created">Created</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Created On</label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">COC Number</label>
              <input
                type="text"
                value={cocSearch}
                onChange={(e) => setCocSearch(e.target.value)}
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleApplyFilter}
              className="px-6 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
            >
              Apply Filter
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              ↻ Reset
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Contract Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">PO Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Invoice Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created On</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Pending with</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">SLA</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {cocsData.map((coc) => (
              <tr key={coc.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{coc.contractNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coc.poNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coc.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coc.createdOn}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {coc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{coc.pendingWith}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coc.sla}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <button className="hover:text-green-700">›</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">10/ Page</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">←</button>
          <button className="px-3 py-1 bg-green-700 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">4</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">5</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">→</button>
        </div>
      </div>
    </div>
  )
}
