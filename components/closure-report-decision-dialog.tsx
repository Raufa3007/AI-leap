"use client"

import { useState } from "react"
import { X, CheckCircle2 } from "lucide-react"

interface ClosureReportDecisionDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function ClosureReportDecisionDialog({ isOpen, onClose, onComplete }: ClosureReportDecisionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  if (!isOpen) return null

  const handleComplete = () => {
    if (selectedOption) {
      onComplete()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Dialog container with split layout */}
      <div className="relative flex flex-row items-center gap-12 p-12 bg-[#45546E] rounded-[15px] max-w-[1100px] shadow-2xl">
        {/* Decorative Background Elements */}
        <div
          className="absolute left-[82px] top-[457.88px] w-[69px] h-[119px] bg-white opacity-10 rounded"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute left-[272px] top-[47px] w-[35px] h-[60px] bg-white opacity-8 rounded rotate-45"
          style={{ zIndex: 1, opacity: 0.08 }}
        />
        <div
          className="absolute left-[365.8px] top-[416px] w-[63.04px] h-[108.07px] bg-white rounded"
          style={{ zIndex: 3, opacity: 0.02, transform: "rotate(60deg)" }}
        />

        {/* Left Section - What's Next */}
        <div className="flex flex-col justify-center items-start gap-8 w-[380px] relative z-10">
          {/* Header */}
          <div className="flex flex-row justify-center items-center px-[10px] py-[10px]">
            <h1 className="text-white tracking-[-0.02em] text-4xl font-normal">{"What's Next ?"}</h1>
          </div>

          {/* Record closure section */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-row justify-center items-center px-[10px]">
              <h3 className="text-white text-xl font-medium">Record closure</h3>
            </div>
            <div className="flex flex-row items-center px-[10px]">
              <p className="text-white opacity-60 tracking-[0.02em] text-sm leading-relaxed">
                Once you complete the closure report, the PO will be marked as closed, and the procurement and finance
                teams will proceed with final payment and record completion.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Decision Card */}
        <div className="flex flex-col justify-center items-center p-10 gap-8 bg-white rounded-[11px] w-[520px] relative z-10">
          {/* Card Header */}
          <div className="flex flex-row justify-center items-center py-1 w-full">
            <h2 className="text-[#000525] tracking-[-0.01em] text-2xl font-normal text-center">
              Kindly take a decision to proceed
            </h2>
          </div>

          {/* Options */}
          <div className="flex flex-col items-start gap-4 w-full px-6">
            {/* Radio Option - Complete */}
            <div
              className="flex flex-col items-start p-4 px-5 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
              style={{ borderColor: selectedOption === "complete" ? "#000525" : "#000000" }}
              onClick={() => setSelectedOption("complete")}
            >
              {/* Radio Row */}
              <div className="flex flex-row items-center w-full gap-3">
                {/* Radio Button */}
                <div className="flex flex-row items-center justify-center p-1 w-[18px] h-[18px] border border-black rounded-full cursor-pointer">
                  {selectedOption === "complete" && <div className="w-[10px] h-[10px] bg-black rounded-full" />}
                </div>

                {/* Label */}
                <div className="flex flex-row justify-center items-center px-[10px]">
                  <span className="tracking-[0.01em] text-black font-medium">Complete</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-row justify-center items-center py-[6px] px-[10px] ml-7">
                <p className="text-[#000525] opacity-50 tracking-[0.01em] text-sm">
                  System will mark closure report as completed
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-[10px] w-full px-6">
            {/* Complete Button */}
            <button
              onClick={handleComplete}
              disabled={!selectedOption}
              className="flex flex-row justify-center items-center p-3 gap-[10px] flex-1 bg-[#1B733D] rounded-lg hover:bg-[#145a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white tracking-[0.01em] font-medium">Complete</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="flex flex-row justify-center items-center py-[10px] px-3 gap-[10px] flex-1 border border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 text-[#5F6C81]" />
              <span className="text-[#45546E] tracking-[0.01em] font-medium">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
