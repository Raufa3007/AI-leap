"use client"

interface Relationship {
  rfpTitle: string
  rfpId: string
  requestedDepartment: string
  costCenter: string
  typeOfRFP: string
  expectedDeliveryDate: string
  paymentType: string
  completionPercentage: string
  totalProjectValue: number
  amountPaid: number
  status: string
}

interface VendorDetailsPerformanceProps {
  vendorId: string
}

const performanceData: Record<string, Relationship[]> = {
  "76567": [
    {
      rfpTitle: "Productize P2P",
      rfpId: "40000000198",
      requestedDepartment: "Procurement",
      costCenter: "PRO9901CU",
      typeOfRFP: "Service",
      expectedDeliveryDate: "12 Dec 2025",
      paymentType: "Contract",
      completionPercentage: "20%",
      totalProjectValue: 12000000,
      amountPaid: 100000,
      status: "In Progress",
    },
    {
      rfpTitle: "Laptop Delivery",
      rfpId: "51200000101",
      requestedDepartment: "IT",
      costCenter: "IT01244LP",
      typeOfRFP: "Direct purchase",
      expectedDeliveryDate: "01 July 2025",
      paymentType: "Lumsum",
      completionPercentage: "--",
      totalProjectValue: 10000000,
      amountPaid: 0,
      status: "In Progress",
    },
  ],
}

export default function VendorDetailsPerformance({ vendorId }: VendorDetailsPerformanceProps) {
  const relationships = performanceData[vendorId] || performanceData["76567"]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button className="px-4 py-2 border-b-2 border-green-700 text-green-700 font-medium">Ongoing (2)</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Completed (8)</button>
        </div>

        {/* Relationships List */}
        <div className="space-y-4">
          {relationships.map((rel, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {rel.rfpTitle} - {rel.rfpId}
                  </h4>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {rel.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Requested Department</p>
                  <p className="font-semibold text-gray-900">{rel.requestedDepartment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost Center</p>
                  <p className="font-semibold text-gray-900">{rel.costCenter}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type of RFP</p>
                  <p className="font-semibold text-gray-900">{rel.typeOfRFP}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Delivery Date</p>
                  <p className="font-semibold text-gray-900">{rel.expectedDeliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-semibold text-gray-900">{rel.paymentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Percentage</p>
                  <p className="font-semibold text-gray-900">{rel.completionPercentage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Project Value (SAR)</p>
                  <p className="font-semibold text-gray-900">{rel.totalProjectValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid (SAR)</p>
                  <p className="font-semibold text-gray-900">{rel.amountPaid.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
