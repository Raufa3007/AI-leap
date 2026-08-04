"use client"

import { ArrowLeft, Download, MoreVertical } from "lucide-react"
import { useState } from "react"
import AmendPODialog from "./amend-po-dialog"

interface POOverviewPageProps {
  poId: string
  onBack: () => void
}

export default function POOverviewPage({ poId, onBack }: POOverviewPageProps) {
  const [showAmendDialog, setShowAmendDialog] = useState(false)

  // Mock PO data - in real app, fetch based on poId
  const poData = {
    id: "PO5000000082",
    title: "Employee Welcome Kit for Upcoming Inductions",
    poNumber: "1234567",
    prNumber: "PR1131341",
    rfpNumber: "RFP24141344",
    prType: "Goods",
    department: "Learning and development",
    status: "PO issued",
    poIssuedDate: "12/08/2025",
    expectedDeliveryDate: "31/12/2025",
    totalPOValue: "12,146,000 ⱡ",
    vendor: {
      name: "Kaar Technologies",
      poValue: "100,000,000",
      email: "projectmanager@kaartech.com",
      contact: "+123 7866 2891",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kaarlogo-eFdSHghYTMP6iXhiqBNTuHylpVZm0D.png",
    },
    goods: [
      {
        description: "Dell Latitude Laptop",
        quantity: 10,
        unit: "Pcs",
        unitPrice: "1,000,000",
        totalPrice: "10,000,000",
      },
      {
        description: "HP ProBook",
        quantity: 15,
        unit: "Pcs",
        unitPrice: "1,500,000",
        totalPrice: "22,500,000",
      },
      {
        description: "Apple MacBook Pro",
        quantity: 8,
        unit: "Pcs",
        unitPrice: "2,000,000",
        totalPrice: "16,000,000",
      },
      {
        description: "Lenovo ThinkPad",
        quantity: 12,
        unit: "Pcs",
        unitPrice: "1,200,000",
        totalPrice: "14,400,000",
      },
    ],
    totalCost: "1,015,000",
  }

  const handleDownloadPO = () => {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{poData.id}/ PO overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download size={18} />
              Download PO
            </button>
            <button
              onClick={() => setShowAmendDialog(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Amend PO
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel PO
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-8">
          <button className="py-4 px-0 border-b-2 border-green-600 text-green-600 font-medium text-sm">
            PO overview
          </button>
          <button className="py-4 px-0 text-gray-600 font-medium text-sm hover:text-gray-900">Documents</button>
          <button className="py-4 px-0 text-gray-600 font-medium text-sm hover:text-gray-900">Delivery & GRN</button>
          <button className="py-4 px-0 text-gray-600 font-medium text-sm hover:text-gray-900">
            Invoices & payments
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-xs font-medium text-gray-600">Order Placed</span>
              </div>
              <div className="flex-1 h-1 bg-green-600 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-xs font-medium text-gray-600">Confirmed</span>
              </div>
              <div className="flex-1 h-1 bg-green-600 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-xs font-medium text-gray-600">In Transit</span>
              </div>
              <div className="flex-1 h-1 bg-green-600 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-xs font-medium text-gray-600">Delivered</span>
              </div>
              <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  ◆
                </div>
                <span className="text-xs font-medium text-gray-600">Delivery/Service</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                  ◆
                </div>
                <span className="text-xs font-medium text-gray-600">Invoice processing</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                  ◆
                </div>
                <span className="text-xs font-medium text-gray-600">Payment & closure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-700 mb-6">Request details</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Request title</p>
              <p className="text-sm font-semibold text-gray-900">{poData.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">PO Number</p>
              <p className="text-sm font-semibold text-gray-900">{poData.poNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">PR Number</p>
              <p className="text-sm font-semibold text-blue-600">{poData.prNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">RFP Number</p>
              <p className="text-sm font-semibold text-blue-600">{poData.rfpNumber}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">PR type</p>
              <p className="text-sm font-semibold text-gray-900">{poData.prType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Department</p>
              <p className="text-sm font-semibold text-gray-900">{poData.department}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
              <p className="text-sm font-semibold text-orange-600">{poData.status}</p>
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">PO issued date</p>
              <p className="text-sm font-semibold text-gray-900">{poData.poIssuedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Expected delivery date</p>
              <p className="text-sm font-semibold text-gray-900">{poData.expectedDeliveryDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Total PO value</p>
              <p className="text-sm font-semibold text-gray-900">{poData.totalPOValue}</p>
            </div>
            <div></div>
          </div>
        </div>

        {/* Vendor Information */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Vendor information</h2>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-600 mb-4">{poData.vendor.name}</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">PO value</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.vendor.poValue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.vendor.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Contact</p>
                  <p className="text-sm font-semibold text-gray-900">{poData.vendor.contact}</p>
                </div>
              </div>
            </div>
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <img
                src={poData.vendor.logo || "/placeholder.svg"}
                alt={poData.vendor.name}
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Goods Information */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Goods information</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Item description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Units of measure</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Unit price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Total price</th>
                </tr>
              </thead>
              <tbody>
                {poData.goods.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.unitPrice}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between items-center py-3 border-t border-gray-200 font-semibold text-gray-900">
                <span>Total cost</span>
                <span>{poData.totalCost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amend PO Dialog */}
      {showAmendDialog && <AmendPODialog poId={poData.id} onClose={() => setShowAmendDialog(false)} />}
    </div>
  )
}
