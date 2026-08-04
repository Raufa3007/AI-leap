"use client"

import { useState } from "react"
import PODetailPage from "./po-detail-page"

interface PurchaseOrder {
  id: string
  poNumber: string
  title: string
  vendor: string
  department: string
  status: "In Progress" | "Completed"
  value: number
  closureDate: string
}

const purchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "5000000082",
    title: "IT Hardware Purchase",
    vendor: "Tech Solutions Ltd",
    department: "IT",
    status: "In Progress",
    value: 35740,
    closureDate: "12 Oct 2025",
  },
  {
    id: "2",
    poNumber: "5000000082",
    title: "IT Hardware Purchase",
    vendor: "Tech Solutions Ltd",
    department: "IT",
    status: "In Progress",
    value: 35740,
    closureDate: "12 Oct 2025",
  },
  {
    id: "3",
    poNumber: "5000000083",
    title: "Office Furniture Order",
    vendor: "Design Décor Co",
    department: "Office Supplies",
    status: "Completed",
    value: 15500,
    closureDate: "5 Nov 2025",
  },
  {
    id: "4",
    poNumber: "5000000084",
    title: "Software License Renewal",
    vendor: "Cyber Protect Inc",
    department: "Software",
    status: "In Progress",
    value: 22300,
    closureDate: "20 Nov 2025",
  },
  {
    id: "5",
    poNumber: "5000000085",
    title: "Website Redesign Project",
    vendor: "Creative Webworks",
    department: "Marketing",
    status: "In Progress",
    value: 50000,
    closureDate: "1 Dec 2025",
  },
  {
    id: "6",
    poNumber: "5000000086",
    title: "Network Upgrade",
    vendor: "Connectivity Solutions",
    department: "IT",
    status: "In Progress",
    value: 28900,
    closureDate: "15 Jan 2026",
  },
  {
    id: "7",
    poNumber: "5000000087",
    title: "Cloud Storage Subscription",
    vendor: "Cloudify Services",
    department: "IT",
    status: "Completed",
    value: 10200,
    closureDate: "30 Jan 2026",
  },
  {
    id: "8",
    poNumber: "5000000088",
    title: "Training Program for Staff",
    vendor: "Skill Up Academy",
    department: "HR",
    status: "In Progress",
    value: 12000,
    closureDate: "10 Feb 2026",
  },
  {
    id: "9",
    poNumber: "5000000089",
    title: "Marketing Campaign Launch",
    vendor: "AdVantage Group",
    department: "Marketing",
    status: "In Progress",
    value: 45000,
    closureDate: "20 Feb 2026",
  },
  {
    id: "10",
    poNumber: "5000000090",
    title: "Data Analytics Tool Purchase",
    vendor: "Insightful Tech",
    department: "IT",
    status: "Completed",
    value: 30000,
    closureDate: "1 Mar 2026",
  },
]

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedPOId, setSelectedPOId] = useState<string | null>(null)

  const filteredOrders = purchaseOrders.filter(
    (po) =>
      po.poNumber.includes(searchTerm) ||
      po.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApplyFilter = () => {
    console.log("Filters applied:", { statusFilter, fromDate, toDate })
    setShowFilterModal(false)
  }

  const handleReset = () => {
    setStatusFilter("")
    setFromDate("")
    setToDate("")
  }

  const handleDownload = () => {
    const csv = [
      ["PO number", "Title", "Vendor name", "Requested department", "Status", "PO value", "Expected closure date"],
      ...filteredOrders.map((po) => [
        po.poNumber,
        po.title,
        po.vendor,
        po.department,
        po.status,
        po.value,
        po.closureDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "purchase-orders.csv"
    a.click()
  }

  if (selectedPOId) {
    const selectedPO = purchaseOrders.find((po) => po.id === selectedPOId)
    if (selectedPO) {
      return <PODetailPage poNumber={selectedPO.poNumber} onBack={() => setSelectedPOId(null)} />
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header with Total and Search/Icons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-semibold text-green-700">Total -50</h1>

          <div className="flex-1 max-w-md flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by PO, RFP Number and Vendor name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Filter"
            >
              <i className="ri-filter-3-fill text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="List Settings">
              <i className="ri-list-settings-fill text-gray-600" />
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
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
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

      {/* Full-width Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">PO number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Vendor name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Requested department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">PO value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Expected closure date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((po) => (
              <tr
                key={po.id}
                onClick={() => setSelectedPOId(po.id)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{po.poNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{po.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{po.vendor}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{po.department}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      po.status === "In Progress" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{po.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{po.closureDate}</td>
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
