"use client"

import { useState } from "react"

interface ForecastData {
  month: string
  predictedSpend: number
}

const forecastData: ForecastData[] = [
  { month: "January", predictedSpend: 120000 },
  { month: "February", predictedSpend: 210000 },
  { month: "March", predictedSpend: 150000 },
  { month: "April", predictedSpend: 220000 },
  { month: "May", predictedSpend: 120000 },
  { month: "June", predictedSpend: 150000 },
  { month: "July", predictedSpend: 520000 },
  { month: "August", predictedSpend: 110000 },
  { month: "September", predictedSpend: 180000 },
  { month: "October", predictedSpend: 250000 },
  { month: "November", predictedSpend: 190000 },
  { month: "December", predictedSpend: 280000 },
]

export default function ProcurementForecastReport() {
  const [selectedYear, setSelectedYear] = useState("2024")

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Report Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-700">Procurement Forecast Report</h2>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Month</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Predicted Spend (SAR) <i className="ri-arrow-up-down-line ml-1" />
              </th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.month}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.predictedSpend.toLocaleString()}</td>
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
