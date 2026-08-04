"use client"
 
import { ArrowLeft, X, ChevronRight } from "lucide-react"
import { useState } from "react"
 
interface AmendPODialogProps {
  poId: string
  onClose: () => void
}
 
type AmendmentType =
  | "quantity-change"
  | "price-change"
  | "line-item-change"
  | "delivery-schedule-change"
  | "payment-terms-change"
  | "contractual-legal-clauses"
  | "vendor-change"
 
export default function AmendPODialog({ poId, onClose }: AmendPODialogProps) {
  const [step, setStep] = useState<"select" | "form">("select")
  const [selectedAmendment, setSelectedAmendment] = useState<AmendmentType | null>(null)
  const [justification, setJustification] = useState("")
  const [newQuantity, setNewQuantity] = useState("")
 
  const amendments: Array<{
    id: AmendmentType
    title: string
    description: string
    icon: string
  }> = [
    {
      id: "quantity-change",
      title: "Quantity change",
      description: "Modify the number of items ordered (increase or decrease).",
      icon: "#",
    },
    {
      id: "price-change",
      title: "Price change",
      description: "Update the unit price or total purchase order (PO) value.",
      icon: "₹",
    },
    {
      id: "line-item-change",
      title: "Line item change",
      description: "Add new products/services or remove existing ones.",
      icon: "≡",
    },
    {
      id: "delivery-schedule-change",
      title: "Delivery schedule change",
      description: "Reschedule delivery dates or add milestone-based deliveries.",
      icon: "🚚",
    },
    {
      id: "payment-terms-change",
      title: "Payment terms change",
      description: "Adjust payment terms (e.g., from Net 30 to Net 45, or switch to milestone payments).",
      icon: "💳",
    },
    {
      id: "contractual-legal-clauses",
      title: "Contractual/Legal clauses update",
      description: "Revise terms for compliance, regulatory, or legal requirements.",
      icon: "📋",
    },
    {
      id: "vendor-change",
      title: "Vendor change",
      description: "Replace the current vendor and issue a new PO.",
      icon: "📄",
    },
  ]
 
  const handleSelectAmendment = (id: AmendmentType) => {
    setSelectedAmendment(id)
    setStep("form")
  }
 
  const handleBack = () => {
    setStep("select")
    setSelectedAmendment(null)
    setJustification("")
    setNewQuantity("")
  }
 
  const handleSubmit = () => {
    console.log("Amendment submitted:", {
      poId,
      type: selectedAmendment,
      justification,
      newQuantity,
    })
    onClose()
  }
 
  const selectedAmendmentData = amendments.find((a) => a.id === selectedAmendment)
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === "form" && (
              <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-green-700">Amend PO</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-600">
            <X size={20} />
          </button>
        </div>
 
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "select" ? (
            <div>
              <p className="text-gray-700 font-medium mb-6">Kindly choose an amendment to proceed</p>
 
              {/* Left Sidebar - How it works */}
              <div className="flex gap-6">
                <div className="w-64 bg-slate-600 text-white rounded-lg p-6 flex-shrink-0">
                  <h3 className="text-lg font-semibold mb-6">How it works !</h3>
                  <div className="space-y-6">
                    {/* Request Step */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">
                          ●
                        </div>
                        <div className="w-0.5 h-12 bg-gray-400 my-1"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Request</p>
                        <p className="text-xs text-gray-300 mt-1">A change is raised for the purchase order.</p>
                      </div>
                    </div>
 
                    {/* Update Step */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold">
                          ●
                        </div>
                        <div className="w-0.5 h-12 bg-gray-400 my-1"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Update</p>
                        <p className="text-xs text-gray-300 mt-1">The PO is revised with the new details.</p>
                      </div>
                    </div>
 
                    {/* Approve Step */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold">
                          ●
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Approve</p>
                        <p className="text-xs text-gray-300 mt-1">The PO is revised with the new details.</p>
                      </div>
                    </div>
                  </div>
 
                  {/* Illustration */}
                  <div className="mt-8 flex justify-center">
                    <div className="text-center text-xs text-gray-300">
                      <div className="text-4xl mb-2">📋</div>
                      <p>Amendment Process</p>
                    </div>
                  </div>
                </div>
 
                {/* Amendment Options Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {amendments.map((amendment) => (
                    <button
                      key={amendment.id}
                      onClick={() => handleSelectAmendment(amendment.id)}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-600 flex-shrink-0">
                          {amendment.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{amendment.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{amendment.description}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Form Step */}
              <div className="flex gap-6">
                <div className="w-64 bg-slate-600 text-white rounded-lg p-6 flex-shrink-0">
                  <h3 className="text-lg font-semibold mb-6">How it works !</h3>
                  <div className="space-y-6">
                    {/* Request Step - Active */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                        <div className="w-0.5 h-12 bg-orange-500 my-1"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Request</p>
                        <p className="text-xs text-gray-300 mt-1">A change is raised for the purchase order.</p>
                      </div>
                    </div>
 
                    {/* Update Step */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold">
                          ●
                        </div>
                        <div className="w-0.5 h-12 bg-gray-400 my-1"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Update</p>
                        <p className="text-xs text-gray-300 mt-1">The PO is revised with the new details.</p>
                      </div>
                    </div>
 
                    {/* Approve Step */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold">
                          ●
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Approve</p>
                        <p className="text-xs text-gray-300 mt-1">The PO is revised with the new details.</p>
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Form Content */}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-600 flex-shrink-0">
                        {selectedAmendmentData?.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedAmendmentData?.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedAmendmentData?.description}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                        ✓
                      </div>
                    </div>
                  </div>
 
                  {/* Amendment Justification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Amendment justification</label>
                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Type here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={6}
                    />
                  </div>
 
                  {/* Quantity Change Specific Field */}
                  {selectedAmendment === "quantity-change" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">New Quantity</label>
                      <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        placeholder="Enter new quantity"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
 
        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {step === "select" ? (
            <button
              disabled={!selectedAmendment}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
            >
              ✓ Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
