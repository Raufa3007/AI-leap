"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"

interface DecisionModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (decision: string, comments?: string) => void
}

export default function DecisionModal({ isOpen, onClose, onComplete }: DecisionModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("commercial-completed")
  const [comments, setComments] = useState("")

  if (!isOpen) return null

  const handleComplete = () => {
    onComplete(selectedOption, comments)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#4A5F7F]/40 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container with What's Next sidebar */}
      <div className="relative z-10 flex gap-0 max-w-5xl w-full">
        {/* What's Next Sidebar */}
        <div
          className="w-80 rounded-l-2xl p-8 flex flex-col"
          style={{
            background: "linear-gradient(135deg, #4A5F7F 0%, #2C3E50 100%)",
          }}
        >
          <h3 className="text-white text-2xl font-semibold mb-8">What's Next ?</h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  1
                </div>
                <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }} />
              </div>
              <div className="flex-1 pb-6">
                <h4 className="text-white font-semibold text-lg mb-2">Commercial evaluation</h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  The vendors who have been technically qualified will be referred to you for commercial evaluation and
                  review.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  2
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg mb-2">Review and consolidation</h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  The individuals selected for this task will act as members of the Commercial Evaluation Committee
                  responsible for assessing the financial proposals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Card */}
        <div className="flex-1 bg-white rounded-r-2xl shadow-2xl">
          {/* Modal Content */}
          <div className="p-8">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">Kindly take a decision to proceed</h2>

            {/* Radio Options */}
            <div className="space-y-4 mb-8">
              <div
                onClick={() => setSelectedOption("commercial-completed")}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                  selectedOption === "commercial-completed" ? "border-gray-400 bg-gray-50" : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === "commercial-completed" ? "border-gray-700" : "border-gray-400"
                      }`}
                    >
                      {selectedOption === "commercial-completed" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Commercial evaluation completed</h4>
                    <p className="text-sm text-gray-600">Technical evaluation will be marked as completed</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedOption("return-to-officer")}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                  selectedOption === "return-to-officer" ? "border-gray-400 bg-gray-50" : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === "return-to-officer" ? "border-gray-700" : "border-gray-400"
                      }`}
                    >
                      {selectedOption === "return-to-officer" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Return to procurement officer</h4>
                    <p className="text-sm text-gray-600">Request will be returned to procurement officer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Check size={20} />
                Complete
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
