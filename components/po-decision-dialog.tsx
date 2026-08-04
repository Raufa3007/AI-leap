"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface PODecisionDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function PODecisionDialog({ isOpen, onClose, onComplete }: PODecisionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  const handleComplete = () => {
    if (selectedOption && onComplete) {
      onComplete()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl xl:max-w-6xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Section - Blue Background with What's Next */}
        <div
          className="flex flex-col items-start p-6 md:p-8 lg:p-12 w-full md:w-2/5 min-h-[300px] md:min-h-[400px] overflow-y-auto"
          style={{ backgroundColor: "#4A5568" }}
        >
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-light mb-6 md:mb-8 lg:mb-12">What's Next ?</h2>

          <div className="flex flex-col gap-6 md:gap-8 w-full">
            {/* Step 1 */}
            <div className="flex flex-row gap-3 md:gap-4 items-start">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex-shrink-0">
                <span className="text-white text-sm md:text-base lg:text-lg font-medium">1</span>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="text-white text-lg md:text-xl font-normal">Prepare list contracts required</h3>
                <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                  You have to prepare Purchase order document and AMC document and NDA document
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-row gap-3 md:gap-4 items-start">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex-shrink-0">
                <span className="text-white text-sm md:text-base lg:text-lg font-medium">2</span>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="text-white text-lg md:text-xl font-normal">Send for Approval</h3>
                <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                  Prepared documents will be sent for approval to respective manager
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - White Dialog */}
        <div className="flex flex-col items-center justify-center p-6 md:p-8 lg:p-12 w-full md:w-3/5 bg-white overflow-y-auto">
          {/* Dialog Header */}
          <div className="flex flex-row justify-center items-center py-1 w-full mb-6 md:mb-8">
            <h2 className="text-[#000525] tracking-[-0.01em] text-xl md:text-2xl font-normal text-center">
              Kindly take a decision to proceed
            </h2>
          </div>

          {/* Options */}
          <div className="flex flex-col items-start gap-4 w-full mb-6 md:mb-8">
            {/* Radio Option */}
            <div
              className="flex flex-col items-start p-4 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
              style={{ borderColor: selectedOption === "approval" ? "#000525" : "#E2E8F0" }}
              onClick={() => setSelectedOption("approval")}
            >
              {/* Radio Row */}
              <div className="flex flex-row items-center w-full gap-3">
                {/* Radio Button */}
                <div className="flex flex-row items-center justify-center w-4 h-4 md:w-[18px] md:h-[18px] border border-black rounded-full cursor-pointer">
                  {selectedOption === "approval" && <div className="w-2 h-2 md:w-[10px] md:h-[10px] bg-black rounded-full" />}
                </div>

                {/* Label */}
                <div className="flex flex-row justify-center items-center">
                  <span className="tracking-[0.01em] text-black font-medium text-sm md:text-base">Submit for approval</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-row justify-center items-center py-1 md:py-[6px] mt-1 md:mt-0 ml-6 md:ml-7">
                <p className="text-[#000525] opacity-50 tracking-[0.01em] text-xs md:text-sm">
                  Request will be submitted for approval
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-[10px] w-full">
            {/* Complete Button */}
            <button
              onClick={handleComplete}
              disabled={!selectedOption}
              className="flex flex-row justify-center items-center p-3 gap-2 md:gap-[10px] w-full sm:flex-1 bg-[#1B733D] rounded-lg hover:bg-[#145a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-white tracking-[0.01em] font-medium text-sm md:text-base">Complete</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="flex flex-row justify-center items-center py-2 md:py-[10px] px-3 gap-2 md:gap-[10px] w-full sm:flex-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <XCircle className="w-4 h-4 text-[#5F6C81]" />
              <span className="text-[#45546E] tracking-[0.01em] font-medium text-sm md:text-base">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
