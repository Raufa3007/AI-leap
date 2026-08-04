"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface OngoingItem {
  id: string
  title: string
  rfpNumber: string
  requestedDepartment: string
  costCenter: string
  typeOfRFP: string
  expectedDeliveryDate: string
  paymentType: string
  completionPercentage: string
  totalProjectValue: string
  amountPaid: string
  status: "In Progress"
}

interface CompletedItem {
  id: string
  title: string
  rfpNumber: string
  requestedDepartment: string
  costCenter: string
  prValue: string
  completionDate: string
  onTimeDelivery: number
  qualityOfService: number
  overallExperience: number
  valueForMoney: number
  status: "Completed"
}

const VendorDetailsRelationship = ({ vendorId }: { vendorId: string }) => {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Mock data for ongoing items
  const ongoingItems: OngoingItem[] = [
    {
      id: "1",
      title: "Productize P2P",
      rfpNumber: "4000000198",
      requestedDepartment: "Procurement",
      costCenter: "PR09901CU",
      typeOfRFP: "Service",
      expectedDeliveryDate: "12 Dec 2025",
      paymentType: "Contract",
      completionPercentage: "20%",
      totalProjectValue: "12,000,000",
      amountPaid: "100,000",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Laptop Delivery",
      rfpNumber: "5120000101",
      requestedDepartment: "IT",
      costCenter: "IT012441LP",
      typeOfRFP: "Direct purchase",
      expectedDeliveryDate: "01 July 2025",
      paymentType: "Lumsum",
      completionPercentage: "--",
      totalProjectValue: "10,000,000",
      amountPaid: "--",
      status: "In Progress",
    },
  ]

  // Mock data for completed items
  const completedItems: CompletedItem[] = [
    {
      id: "1",
      title: "Finance Mobile app",
      rfpNumber: "51200000101",
      requestedDepartment: "Finance",
      costCenter: "PR09901CU",
      prValue: "100,000",
      completionDate: "01 Jan 2025",
      onTimeDelivery: 4,
      qualityOfService: 5,
      overallExperience: 3,
      valueForMoney: 4,
      status: "Completed",
    },
    {
      id: "2",
      title: "Human Resource - Web app",
      rfpNumber: "31200000333",
      requestedDepartment: "HR",
      costCenter: "HR09875MP",
      prValue: "20,000",
      completionDate: "10 Jan 2025",
      onTimeDelivery: 4,
      qualityOfService: 5,
      overallExperience: 4,
      valueForMoney: 4,
      status: "Completed",
    },
    {
      id: "3",
      title: "Asset Management System",
      rfpNumber: "42000000456",
      requestedDepartment: "Operations",
      costCenter: "OP01234AS",
      prValue: "50,000",
      completionDate: "15 Jan 2025",
      onTimeDelivery: 5,
      qualityOfService: 4,
      overallExperience: 4,
      valueForMoney: 5,
      status: "Completed",
    },
    {
      id: "4",
      title: "Design System",
      rfpNumber: "33000000789",
      requestedDepartment: "Design",
      costCenter: "DS05678DE",
      prValue: "30,000",
      completionDate: "20 Jan 2025",
      onTimeDelivery: 4,
      qualityOfService: 4,
      overallExperience: 4,
      valueForMoney: 4,
      status: "Completed",
    },
    {
      id: "5",
      title: "Loan Management System",
      rfpNumber: "44000000321",
      requestedDepartment: "Finance",
      costCenter: "FI09876LM",
      prValue: "75,000",
      completionDate: "25 Jan 2025",
      onTimeDelivery: 5,
      qualityOfService: 5,
      overallExperience: 5,
      valueForMoney: 4,
      status: "Completed",
    },
    {
      id: "6",
      title: "Intranet Portal",
      rfpNumber: "55000000654",
      requestedDepartment: "IT",
      costCenter: "IT12345IP",
      prValue: "45,000",
      completionDate: "28 Jan 2025",
      onTimeDelivery: 4,
      qualityOfService: 4,
      overallExperience: 3,
      valueForMoney: 4,
      status: "Completed",
    },
    {
      id: "7",
      title: "Mobile App Development",
      rfpNumber: "66000000987",
      requestedDepartment: "Product",
      costCenter: "PR98765MA",
      prValue: "60,000",
      completionDate: "02 Feb 2025",
      onTimeDelivery: 5,
      qualityOfService: 5,
      overallExperience: 4,
      valueForMoney: 5,
      status: "Completed",
    },
    {
      id: "8",
      title: "Cloud Migration",
      rfpNumber: "77000000111",
      requestedDepartment: "Infrastructure",
      costCenter: "IN54321CM",
      prValue: "85,000",
      completionDate: "05 Feb 2025",
      onTimeDelivery: 4,
      qualityOfService: 5,
      overallExperience: 5,
      valueForMoney: 4,
      status: "Completed",
    },
  ]

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-orange-400 text-lg" : "text-gray-300 text-lg"}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "ongoing"
              ? "bg-green-700 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Ongoing ({ongoingItems.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "completed"
              ? "bg-green-700 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Completed ({completedItems.length})
        </button>
      </div>

      {/* Ongoing Tab Content */}
      {activeTab === "ongoing" && (
        <div className="space-y-4">
          {ongoingItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.rfpNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                      In Progress
                    </span>
                    <button
                      className={`p-1 transition-transform ${expandedId === item.id ? "rotate-180" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === item.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Requested Department</p>
                      <p className="font-semibold text-gray-900">{item.requestedDepartment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cost Center</p>
                      <p className="font-semibold text-gray-900">{item.costCenter}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Type of RFP</p>
                      <p className="font-semibold text-gray-900">{item.typeOfRFP}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected Delivery Date</p>
                      <p className="font-semibold text-gray-900">{item.expectedDeliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Type</p>
                      <p className="font-semibold text-gray-900">{item.paymentType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion Percentage</p>
                      <p className="font-semibold text-gray-900">{item.completionPercentage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Project Value (SAR)</p>
                      <p className="font-semibold text-gray-900">{item.totalProjectValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount Paid (SAR)</p>
                      <p className="font-semibold text-gray-900">{item.amountPaid}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed Tab Content */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.rfpNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">Completed</span>
                    <button
                      className={`p-1 transition-transform ${expandedId === item.id ? "rotate-180" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === item.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Requested Department</p>
                      <p className="font-semibold text-gray-900">{item.requestedDepartment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cost Center</p>
                      <p className="font-semibold text-gray-900">{item.costCenter}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">PR Value (SAR)</p>
                      <p className="font-semibold text-gray-900">{item.prValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                      <p className="font-semibold text-gray-900">{item.completionDate}</p>
                    </div>
                  </div>

                  {/* Ratings Section */}
                  <div className="border-t border-gray-300 pt-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">On Time Delivery</p>
                        {renderStars(item.onTimeDelivery)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Quality Of Service</p>
                        {renderStars(item.qualityOfService)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Overall Experience</p>
                        {renderStars(item.overallExperience)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Value for Money</p>
                        {renderStars(item.valueForMoney)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorDetailsRelationship
