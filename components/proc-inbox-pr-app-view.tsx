"use client"

import type { PRInboxItem } from "@/app/actions/fetch-purchase-requisitions-for-inbox"

interface ProcInboxPRAppViewProps {
  pr: PRInboxItem
  onBack: () => void
}

export default function ProcInboxPRAppView({ pr, onBack }: ProcInboxPRAppViewProps) {
  const calculatePricingTotals = () => {
    if (!pr?.bill_of_quantity || pr.bill_of_quantity.length === 0) {
      return { totalWithoutVAT: 0, totalVAT: 0, totalWithVAT: 0 }
    }

    const totalWithoutVAT = pr.bill_of_quantity.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.estimated_unit_price || 0)
      const quantity = Number.parseFloat(item.quantity || 0)
      return sum + price * quantity
    }, 0)

    const totalVAT = totalWithoutVAT * 0.15
    const totalWithVAT = totalWithoutVAT + totalVAT

    return { totalWithoutVAT, totalVAT, totalWithVAT }
  }

  const { totalWithoutVAT, totalVAT, totalWithVAT } = calculatePricingTotals()

  // Sample line items with values
  const lineItems = [
    { id: 1, description: "Laptop Computers", quantity: 15, unit: "pcs", unitPrice: 1200, totalPrice: 18000 },
    { id: 2, description: "Network Switches", quantity: 5, unit: "pcs", unitPrice: 800, totalPrice: 4000 },
    { id: 3, description: "Software Licenses", quantity: 25, unit: "users", unitPrice: 150, totalPrice: 3750 },
    { id: 4, description: "Technical Support", quantity: 40, unit: "hours", unitPrice: 75, totalPrice: 3000 }
  ]

  // Sample preferred vendors
  const preferredVendors = [
    {
      id: 1,
      vendor_name: "Kaar Technologies Private Limited",
      contact_person: "Rajesh Kumar",
      email: "rajesh.kumar@kaartech.com",
      phone: "+91-9845012345"
    },
    {
      id: 2,
      vendor_name: "Aviation tech Private Limited", 
      contact_person: "Priya Sharma",
      email: "priya.sharma@aviationtech.com",
      phone: "+91-9845067890"
    },
    {
      id: 3,
      vendor_name: "Global tech and Solutions",
      contact_person: "Michael Chen",
      email: "michael.chen@globaltech.com",
      phone: "+91-9845098765"
    }
  ]

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Procurement Team</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AM</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Amit Sharma</p>
                <p className="text-xs text-gray-500">Procurement Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">PS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Priya Singh</p>
                <p className="text-xs text-gray-500">Senior Buyer</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">RK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Rahul Kumar</p>
                <p className="text-xs text-gray-500">Procurement Specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">SK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sneha Kapoor</p>
                <p className="text-xs text-gray-500">Vendor Relations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <i className="ri-chat-3-line text-green-600 text-lg"></i>
                <span className="text-sm font-medium text-gray-700">Team Discussion</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <i className="ri-file-list-3-line text-blue-600 text-lg"></i>
                <span className="text-sm font-medium text-gray-700">Create RFQ</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <i className="ri-calendar-event-line text-purple-600 text-lg"></i>
                <span className="text-sm font-medium text-gray-700">Schedule Meeting</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PR Status</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-time-line text-yellow-600 text-lg"></i>
              <span className="text-sm font-medium text-yellow-800">Under Review</span>
            </div>
            <p className="text-xs text-yellow-700">Awaiting vendor quotations and team approval</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-arrow-left-line text-xl text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold" style={{ color: "#1B733D" }}>
              {pr.pr_number}
            </h2>
          </div>

          {/* PR Details Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                PR NUMBER
              </p>
              <p className="text-sm font-medium" style={{ color: "#1B733D" }}>
                {pr.pr_number}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                DEPARTMENT
              </p>
              <p className="text-sm font-medium text-gray-900">{pr.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                COST CENTRE
              </p>
              <p className="text-sm font-medium text-gray-900">{pr.budget_code_cost_centre || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                REQUESTOR
              </p>
              <p className="text-sm font-medium text-gray-900">{pr.requestor_name || "N/A"}</p>
            </div>
          </div>

          {/* Project Name */}
          {pr.project_name_arabic && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-4">Project Name</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900" style={{ direction: "rtl" }}>
                  {pr.project_name_arabic}
                </p>
              </div>
            </div>
          )}

          {/* Scope of Work */}
          {pr.scope_of_work && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-4">Scope Of Work</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{pr.scope_of_work}</p>
            </div>
          )}

          {/* Requestor Details and Dates */}
          <div className="grid grid-cols-2 gap-12 mb-8 pb-8 border-b border-gray-200">
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-6">Requestor details</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                    Requested By
                  </p>
                  <p className="text-sm font-medium text-gray-900">{pr.requestor_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                    Department
                  </p>
                  <p className="text-sm font-medium text-gray-900">{pr.department || "N/A"}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-6">Dates</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                    Created Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {pr.created_at ? new Date(pr.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2" style={{ opacity: 0.8 }}>
                    Expected Delivery Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {pr.expected_delivery_date ? new Date(pr.expected_delivery_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Goods Requested */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-6">Goods requested</h4>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-2xl font-semibold text-gray-900 mb-1">
                  {totalWithoutVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">Total estimated cost</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-2xl font-semibold text-gray-900 mb-1">
                  {totalVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">Tax Amount</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-2xl font-semibold text-gray-900 mb-1">
                  {totalWithVAT.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">PR Estimated Price (With Tax)</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead style={{ backgroundColor: "#1B733D" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Item description</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Units of measure</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Unit price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Total price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${item.unitPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${item.totalPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#F7F8FA" }}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900" colSpan={4}>
                      Total cost
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${lineItems.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Preferred Vendors */}
          <div className="mb-8">
            <h4 className="text-base font-medium text-gray-900 mb-6">Preferred Vendors</h4>
            
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead style={{ backgroundColor: "#1B733D" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Vendor Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Contact Person</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Phone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preferredVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.vendor_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vendor.contact_person}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vendor.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vendor.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
