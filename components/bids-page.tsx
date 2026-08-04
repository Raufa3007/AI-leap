"use client"

import { useState } from "react"

interface BidData {
  tenderName: string
  tenderNumber: string
  rfpNumber: string
  etimadNumber: string
  openingDate: string
  status: "Completed" | "In Progress" | "Pending"
}

const bidData: BidData[] = [
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
  {
    tenderName: "P2P Procure App",
    tenderNumber: "5000000082",
    rfpNumber: "PR120900019",
    etimadNumber: "1879870987",
    openingDate: "12 Jan 2025",
    status: "Completed",
  },
]

export default function BidsPage() {
  const [showFilter, setShowFilter] = useState(false)
  const [filteredCount, setFilteredCount] = useState(50)
  const [status, setStatus] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [pendingWith, setPendingWith] = useState("")

  const handleApplyFilter = () => {
    setFilteredCount(12)
    setShowFilter(false)
  }

  const handleReset = () => {
    setStatus("")
    setFromDate("")
    setToDate("")
    setPendingWith("")
    setFilteredCount(50)
  }

  const handleDownload = () => {
    const csv = [
      ["Tender Name", "Tender Number", "RFP Number", "Etimad Number", "Opening Date", "Status"],
      ...bidData.map((bid) => [
        bid.tenderName,
        bid.tenderNumber,
        bid.rfpNumber,
        bid.etimadNumber,
        bid.openingDate,
        bid.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bids.csv"
    a.click()
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            {showFilter ? `Bids List (${filteredCount})` : `Bid List (${filteredCount})`}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by Tender Name, Tender, PR & Etimad Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <i className="ri-filter-line text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Download"
            >
              <i className="ri-download-line text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Opening Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <span className="flex items-center text-gray-400">→</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Pending With</label>
              <input
                type="text"
                value={pendingWith}
                onChange={(e) => setPendingWith(e.target.value)}
                placeholder="Search"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Apply Filter
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                ↻ Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tender Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tender Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">RFP Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Etimad Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Opening Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {bidData.map((bid, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{bid.tenderName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bid.tenderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bid.rfpNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bid.etimadNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bid.openingDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: bid.status === "Completed" ? "#D1FAE5" : "#FEF3C7",
                          color: bid.status === "Completed" ? "#065F46" : "#92400E",
                        }}
                      >
                        {bid.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-600">10 / Page</span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">←</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded font-medium">1</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">2</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">3</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">4</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">5</button>
              <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
