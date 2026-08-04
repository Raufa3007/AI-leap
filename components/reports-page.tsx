"use client"

import { useState } from "react"
import BudgetVsActualReport from "./budget-vs-actual-report"
import ProcurementForecastReport from "./procurement-forecast-report"
import PaymentScheduleReport from "./payment-schedule-report"
import TopSuppliersReport from "./top-suppliers-report"

interface Report {
  id: string
  title: string
  category: string
  updatedAt: string
}

interface SpendData {
  department: string
  category: string
  supplier: string
  spend: number
}

const reports: Report[] = [
  { id: "1", title: "Spend Analysis Report", category: "Analysis", updatedAt: "Updated an hour ago" },
  { id: "2", title: "Budget vs. Actual Spend by Department", category: "Budget", updatedAt: "Updated four hours ago" },
  { id: "3", title: "Procurement Forecast Report", category: "Forecast", updatedAt: "Updated 12-Jun-24" },
  { id: "4", title: "Payment Schedule Report", category: "Payment", updatedAt: "Updated 12 hours ago" },
  { id: "5", title: "Top Suppliers by Spend", category: "Suppliers", updatedAt: "Updated 01-Jun-24" },
  {
    id: "6",
    title: "Supplier Performance & Compliance Reports",
    category: "Compliance",
    updatedAt: "Updated 01-Jun-24",
  },
  { id: "7", title: "RFP & Purchase Requisition Reports", category: "RFP", updatedAt: "Updated 01-Jun-24" },
]

const spendData: SpendData[] = [
  { department: "Human Resource", category: "Employee Benefits", supplier: "Health First Insurance", spend: 85000 },
  { department: "Finance & Accounting", category: "Audit Services", supplier: "Digital Ads Co", spend: 150000 },
  { department: "Marketing", category: "Advertising", supplier: "Digital Ads Co", spend: 70000 },
  { department: "Sales", category: "Client Entertainment", supplier: "Luxury Events Ltd", spend: 95000 },
  { department: "Customer Services", category: "Call Centre Software", supplier: "Tech Solutions", spend: 200000 },
  { department: "Information Technology", category: "Cloud Services", supplier: "AWS", spend: 180000 },
  { department: "R &D", category: "Lab Equipment", supplier: "Scientific Supplies", spend: 250000 },
  { department: "Legal", category: "Legal Consultation", supplier: "Law & Associates", spend: 130000 },
]

interface ReportsPageProps {
  onNavigate?: (page: string) => void
}

export default function ReportsPage({ onNavigate }: ReportsPageProps) {
  const [selectedReport, setSelectedReport] = useState("1")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSpendData = spendData.filter(
    (row) =>
      row.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderReportContent = () => {
    switch (selectedReport) {
      case "1":
        // Spend Analysis Report
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-700">Spent Analysis Report</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by Department"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <i className="ri-filter-line text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <i className="ri-download-line text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Spend (SAR)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpendData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{row.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{row.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{row.supplier}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.spend.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing 1-8 of 8 results</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">←</button>
                <button className="px-3 py-1 bg-green-700 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">→</button>
              </div>
            </div>
          </div>
        )
      case "2":
        return <BudgetVsActualReport />
      case "3":
        return <ProcurementForecastReport />
      case "4":
        return <PaymentScheduleReport />
      case "5":
        return <TopSuppliersReport />
      case "6":
      case "7":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <i className="ri-file-chart-line text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Report Coming Soon</h3>
            <p className="text-sm text-gray-500">This report is currently under development.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-green-700">Reports</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Left Sidebar - Report List */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
                    selectedReport === report.id ? "bg-green-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{report.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{report.updatedAt}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Report Details */}
          <div className="col-span-3">{renderReportContent()}</div>
        </div>
      </div>
    </div>
  )
}
