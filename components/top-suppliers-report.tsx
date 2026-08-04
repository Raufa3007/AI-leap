"use client"

import { useState } from "react"

interface SupplierData {
  rank: string
  supplier: string
  totalSpend: number
  totalPOs: number
  lastPR: string
}

const supplierData: SupplierData[] = [
  { rank: "01", supplier: "Health First Insurance", totalSpend: 85000, totalPOs: 26, lastPR: "Employee Benefits" },
  { rank: "02", supplier: "Kaar Tech", totalSpend: 150000, totalPOs: 10, lastPR: "Audit Services" },
  { rank: "03", supplier: "Digital Ads Co", totalSpend: 70000, totalPOs: 14, lastPR: "Marketing Campaign" },
  { rank: "04", supplier: "Luxury Events Ltd", totalSpend: 95000, totalPOs: 15, lastPR: "Office Renovation" },
  { rank: "05", supplier: "Tech Solutions", totalSpend: 200000, totalPOs: 6, lastPR: "IT Infra Upgrade" },
  { rank: "06", supplier: "AWS", totalSpend: 180000, totalPOs: 18, lastPR: "Cloud Migration" },
  { rank: "07", supplier: "Scientific Supplies", totalSpend: 250000, totalPOs: 10, lastPR: "Lab Equipment Purchase" },
  { rank: "08", supplier: "Law & Associates", totalSpend: 130000, totalPOs: 9, lastPR: "Legal Consultation" },
]

export default function TopSuppliersReport() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = supplierData.filter(
    (row) =>
      row.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lastPR.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Report Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-700">Top Supplier By Spend</h2>
          <div className="flex gap-2">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Supplier, Last PR"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
              />
            </div>
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
                Rank <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Total Spend <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Total POs <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Last PR</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.rank}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.supplier}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.totalSpend.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="text-green-700 underline">{row.totalPOs}</span>
                </td>
                <td className="px-6 py-4 text-sm text-green-700 underline cursor-pointer hover:text-green-800">
                  {row.lastPR}
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
