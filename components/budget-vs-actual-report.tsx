"use client"

import { useState } from "react"

interface BudgetData {
  department: string
  budget: number
  actualSpend: number
  balance: number
}

const budgetData: BudgetData[] = [
  { department: "Human Resource", budget: 500000, actualSpend: 480000, balance: 20000 },
  { department: "Finance & Accounting", budget: 400000, actualSpend: 390000, balance: 10000 },
  { department: "Marketing", budget: 700000, actualSpend: 750000, balance: -50000 },
  { department: "Sales", budget: 600000, actualSpend: 620000, balance: -20000 },
  { department: "Customer Services", budget: 350000, actualSpend: 340000, balance: 10000 },
  { department: "Information Technology", budget: 1200000, actualSpend: 1150000, balance: 50000 },
  { department: "R &D", budget: 1500000, actualSpend: 1450000, balance: 50000 },
  { department: "Legal", budget: 300000, actualSpend: 310000, balance: -10000 },
]

export default function BudgetVsActualReport() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("2024")

  const filteredData = budgetData.filter((row) => row.department.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Report Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-700">Budget vs Actual Spend by Department</h2>
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <input
              type="text"
              placeholder="Search by Department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Budget (SAR) <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Actual Spend (SAR) <i className="ri-arrow-up-down-line ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Balance (SAR) <i className="ri-arrow-up-down-line ml-1" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.department}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.budget.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.actualSpend.toLocaleString()}</td>
                <td className={`px-6 py-4 text-sm font-medium ${row.balance < 0 ? "text-red-600" : "text-gray-900"}`}>
                  {row.balance.toLocaleString()}
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
