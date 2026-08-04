"use client"

import { useState } from "react"
import { X, CheckCircle2 } from "lucide-react"

interface RatingFeedbackDecisionDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (decision: string) => void
}

export default function RatingFeedbackDecisionDialog({
  isOpen,
  onClose,
  onComplete,
}: RatingFeedbackDecisionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  if (!isOpen) return null

  const handleComplete = () => {
    if (selectedOption) {
      onComplete(selectedOption)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog Container */}
      <div
        className="relative flex flex-row w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Left Section - What's Next */}
        <div className="w-2/5 p-12 flex flex-col" style={{ backgroundColor: "#45546E" }}>
          <h2 className="text-3xl font-bold text-white mb-12">What's Next ?</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                1
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-semibold text-white mb-2">Feedback and ratings</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  All rating provided for vendor will be saved for future and all these rating incorporated in vendor
                  directory in overall ratings and project wise ratings
                </p>
              </div>
            </div>

            {/* Connector Line */}
            <div className="ml-6 h-8 w-0.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                2
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-semibold text-white mb-2">Final closure</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  A closure report needs to be prepared at final stage of project
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Decision Card */}
        <div className="w-3/5 bg-white p-12 overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#000525" }}>
            Kindly take a decision to proceed
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {/* Complete Option */}
            <div
              onClick={() => setSelectedOption("complete")}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedOption === "complete" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === "complete" ? "border-green-600 bg-green-600" : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "complete" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#000525" }}>
                    Complete
                  </h3>
                  <p className="text-sm" style={{ color: "#5F6C81" }}>
                    System will save that rating provided for customer
                  </p>
                </div>
              </div>
            </div>

            {/* Proceed to text task Option */}
            <div
              onClick={() => setSelectedOption("proceed")}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedOption === "proceed" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === "proceed" ? "border-green-600 bg-green-600" : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "proceed" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#000525" }}>
                    Proceed to text task
                  </h3>
                  <p className="text-sm" style={{ color: "#5F6C81" }}>
                    This just for Demo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleComplete}
              disabled={!selectedOption}
              className="flex-1 py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1B733D" }}
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium border-2 transition-all flex items-center justify-center gap-2"
              style={{ borderColor: "#E0E0E0", color: "#45546E" }}
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
