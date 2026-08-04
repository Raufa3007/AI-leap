"use client"
 
import { useState } from "react"
import { X, FileText, DollarSign, Package, Truck, CreditCard, BookOpen, Users, ArrowRight } from "lucide-react"
 
interface AmendPOModalProps {
  isOpen: boolean
  onClose: () => void
  poNumber: string
}
 
type AmendmentType = "quantity" | "price" | "lineitem" | "delivery" | "payment" | "legal" | "vendor" | null
 
export default function AmendPOModal({ isOpen, onClose, poNumber }: AmendPOModalProps) {
  const [selectedAmendment, setSelectedAmendment] = useState<AmendmentType>(null)
  const [justification, setJustification] = useState("")
  const [step, setStep] = useState<"select" | "details">("select")
 
  const amendments = [
    {
      id: "quantity",
      title: "Quantity change",
      description: "Modify the number of items ordered (increase or decrease).",
      icon: Package,
    },
    {
      id: "price",
      title: "Price change",
      description: "Update the unit price or total purchase order (PO) value.",
      icon: DollarSign,
    },
    {
      id: "lineitem",
      title: "Line item change",
      description: "Add new products/services or remove existing ones.",
      icon: FileText,
    },
    {
      id: "delivery",
      title: "Delivery schedule change",
      description: "Reschedule delivery dates or add milestone-based deliveries.",
      icon: Truck,
    },
    {
      id: "payment",
      title: "Payment terms change",
      description: "Adjust payment terms (e.g., from Net 30 to Net 45, or switch to milestone payments).",
      icon: CreditCard,
    },
    {
      id: "legal",
      title: "Contractual/Legal clauses update",
      description: "Revise terms for compliance, regulatory, or legal requirements.",
      icon: BookOpen,
    },
    {
      id: "vendor",
      title: "Vendor change",
      description: "Replace the current vendor and issue a new PO.",
      icon: Users,
    },
  ]
 
  const handleNext = () => {
    if (selectedAmendment) {
      setStep("details")
    }
  }
 
  const handleSubmit = () => {
    console.log("Amendment submitted:", { amendment: selectedAmendment, justification })
    onClose()
    setStep("select")
    setSelectedAmendment(null)
    setJustification("")
  }
 
  const handleCancel = () => {
    onClose()
    setStep("select")
    setSelectedAmendment(null)
    setJustification("")
  }
 
  if (!isOpen) return null
 
  const selectedAmendmentData = amendments.find((a) => a.id === selectedAmendment)
 
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex shadow-2xl">
        <div className="w-80 bg-gradient-to-b from-slate-700 to-slate-800 text-white p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-8">How it works !</h3>
 
          {/* Workflow Steps */}
          <div className="flex-1">
            {/* Request Step */}
            <div className="flex gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div className="w-1 h-12 bg-gray-600 mt-2"></div>
              </div>
              <div className="pt-1">
                <h4 className="font-semibold text-white mb-1">Request</h4>
                <p className="text-sm text-gray-300">A change is raised for the purchase order.</p>
              </div>
            </div>
 
            {/* Update Step */}
            <div className="flex gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div className="w-1 h-12 bg-gray-600 mt-2"></div>
              </div>
              <div className="pt-1">
                <h4 className="font-semibold text-white mb-1">Update</h4>
                <p className="text-sm text-gray-300">The PO is revised with the new details.</p>
              </div>
            </div>
 
            {/* Approve Step */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
              </div>
              <div className="pt-1">
                <h4 className="font-semibold text-white mb-1">Approve</h4>
                <p className="text-sm text-gray-300">The PO is revised with the new details.</p>
              </div>
            </div>
          </div>
 
          {/* Illustration placeholder */}
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-32 bg-gray-600 rounded-lg opacity-50 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Illustration</span>
            </div>
          </div>
        </div>
 
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            {step === "details" && (
              <button
                onClick={() => {
                  setStep("select")
                  setSelectedAmendment(null)
                }}
                className="text-green-700 hover:text-green-800 font-medium flex items-center gap-2"
              >
                ← Amend PO
              </button>
            )}
            {step === "select" && <h2 className="text-lg font-semibold text-green-700">Amend PO</h2>}
            {step === "details" && <h2 className="text-lg font-semibold text-green-700">Amend PO</h2>}
            <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>
 
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === "select" && (
              <>
                <p className="text-gray-600 mb-6">Kindly choose an amendment to proceed</p>
 
                {/* Amendment Options Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {amendments.map((amendment) => {
                    const IconComponent = amendment.icon
                    return (
                      <label
                        key={amendment.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAmendment === amendment.id
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="amendment"
                            value={amendment.id}
                            checked={selectedAmendment === amendment.id}
                            onChange={(e) => setSelectedAmendment(e.target.value as AmendmentType)}
                            className="mt-1 w-5 h-5 text-green-600 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent size={20} className="text-gray-600" />
                              <h3 className="font-semibold text-gray-900">{amendment.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{amendment.description}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </>
            )}
 
            {step === "details" && selectedAmendmentData && (
              <>
                <div className="mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {selectedAmendmentData.icon && <selectedAmendmentData.icon size={28} className="text-green-700" />}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Selected Amendment</p>
                      <h3 className="text-xl font-bold text-gray-900">{selectedAmendmentData.title}</h3>
                    </div>
                  </div>
                </div>
 
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Amendment justification</label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Type here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                    rows={8}
                  />
                </div>
              </>
            )}
          </div>
 
          {/* Footer Buttons */}
          <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-white">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            {step === "select" && (
              <button
                onClick={handleNext}
                disabled={!selectedAmendment}
                className="px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            )}
            {step === "details" && (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 flex items-center gap-2"
              >
                <span>✓</span> Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
