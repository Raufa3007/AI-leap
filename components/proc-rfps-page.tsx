"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, Plus } from "lucide-react"
import { fetchPurchaseRequisitions } from "@/app/actions/fetch-purchase-requisitions"
import PRDetailPage from "./pr-detail-page"

interface RFPData {
  projectName: string
  rfpNumber: string
  prNumber: string
  createdOn: string
  pendingWithUser: string
  status: "Draft" | "Completed" | "Submitted" | "Cancelled"
  sla: string
}

const staticRfpData: RFPData[] = [
  {
    projectName: "P2P Procure App",
    rfpNumber: "10000000107",
    prNumber: "PR120900019",
    createdOn: "12 Jan 2025",
    pendingWithUser: "Abdul Rehman Alfwaz",
    status: "Completed",
    sla: "–",
  },
  {
    projectName: "Bio fertilizer packing machine",
    rfpNumber: "10000000105",
    prNumber: "–",
    createdOn: "21 Jan 2025",
    pendingWithUser: "Alfwaz",
    status: "Submitted",
    sla: "–",
  },
  {
    projectName: "Future Ready learning Course",
    rfpNumber: "10000000103",
    prNumber: "–",
    createdOn: "10 Dec 2024",
    pendingWithUser: "Abdul Rehman",
    status: "Submitted",
    sla: "8 l",
  },
  {
    projectName: "Secure Future Financial Insurance",
    rfpNumber: "10000000100",
    prNumber: "PR120900019",
    createdOn: "24 Dec 2024",
    pendingWithUser: "Rehman",
    status: "Cancelled",
    sla: "–",
  },
  {
    projectName: "Green Path Solutions with Solar",
    rfpNumber: "10000000099",
    prNumber: "–",
    createdOn: "16 Jan 2025",
    pendingWithUser: "Abdul",
    status: "Completed",
    sla: "–",
  },
  {
    projectName: "Move Smart Logistics with Etimad",
    rfpNumber: "10000000096",
    prNumber: "–",
    createdOn: "2 Nov 2024",
    pendingWithUser: "Rehman Alfwaz",
    status: "Completed",
    sla: "15",
  },
  {
    projectName: "Guest Connect App for UAE",
    rfpNumber: "10000000088",
    prNumber: "PR120900019",
    createdOn: "23 Nov 2024",
    pendingWithUser: "Abdulaziz Aljameel",
    status: "Submitted",
    sla: "28",
  },
  {
    projectName: "Install Shield Protect for Desktops",
    rfpNumber: "10000000083",
    prNumber: "PR120900019",
    createdOn: "7 Oct 2024",
    pendingWithUser: "Aljameel",
    status: "Completed",
    sla: "–",
  },
  {
    projectName: "Creating Personal brand and Marketing Strategy",
    rfpNumber: "10000000076",
    prNumber: "–",
    createdOn: "19 Oct 2024",
    pendingWithUser: "Abdulaziz",
    status: "Submitted",
    sla: "–",
  },
  {
    projectName: "P2P Future Flow Software Development",
    rfpNumber: "10000000071",
    prNumber: "PR120900019",
    createdOn: "11 Sep 2024",
    pendingWithUser: "Umar Ali Ahmad",
    status: "Completed",
    sla: "–",
  },
  {
    projectName: "Enhancement of P2P with new Business Flow",
    rfpNumber: "10000000050",
    prNumber: "–",
    createdOn: "13 Sep 2024",
    pendingWithUser: "Ali Ahmad",
    status: "Submitted",
    sla: "1 l",
  },
  {
    projectName: "P2P Procure App 2.0",
    rfpNumber: "10000000049",
    prNumber: "PR120900019",
    createdOn: "15 Aug 2024",
    pendingWithUser: "Ahmad Safar",
    status: "Completed",
    sla: "–",
  },
]

export default function ProcRfpsPage({
  onCreatePR,
  onViewPR,
  onEditPR,
}: { onCreatePR: () => void; onViewPR?: (prNumber: string) => void; onEditPR?: (prNumber: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [allRfpData, setAllRfpData] = useState<RFPData[]>(staticRfpData)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPRNumber, setSelectedPRNumber] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const dbData = await fetchPurchaseRequisitions()
      const combinedData = [...dbData, ...staticRfpData]
      setAllRfpData(combinedData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const filteredData = allRfpData.filter(
    (item) =>
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rfpNumber.includes(searchTerm) ||
      item.prNumber.includes(searchTerm),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  if (selectedPRNumber) {
    return <PRDetailPage prNumber={selectedPRNumber} onBack={() => setSelectedPRNumber(null)} />
  }

  return (
    <div className="w-full bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Requests</h1>
      </div>

      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Project Name, PR & RFP Number"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onCreatePR}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          New purchase request
        </button>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="px-6 py-8 text-center text-gray-600">Loading data...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Project Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">RFP Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">PR Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created On</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pending With User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SL</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    setSelectedPRNumber(item.prNumber)
                  }}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{item.projectName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.rfpNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.prNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.createdOn}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.pendingWithUser}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Draft"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Submitted"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-green-600 text-white" : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            →
          </button>
        </div>
        <select className="px-3 py-1 border border-gray-300 rounded">
          <option>10/ Page</option>
          <option>20/ Page</option>
          <option>50/ Page</option>
        </select>
      </div>
    </div>
  )
}
