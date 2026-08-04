"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface AssessmentDecisionDialogProps {
  onComplete?: () => void
  onCancel?: () => void
  onDecisionChange?: (decision: string) => void
}

export default function AssessmentDecisionDialog({
  onComplete,
  onCancel,
  onDecisionChange,
}: AssessmentDecisionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    if (onDecisionChange) {
      onDecisionChange(option)
    }
  }

  const handleComplete = () => {
    if (selectedOption && onComplete) {
      onComplete()
    }
  }

  return (
    <div className="relative flex flex-row items-center gap-20 p-20 bg-[#45546E] rounded-[15px] max-w-[1256px] isolate">
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
        className="absolute left-[955px] top-[22px] w-[35px] h-[60px] bg-white opacity-8 rounded rotate-45"
        style={{ zIndex: 2, opacity: 0.08 }}
      />
      <div
        className="absolute left-[365.8px] top-[416px] w-[63.04px] h-[108.07px] bg-white rounded"
        style={{ zIndex: 3, opacity: 0.02, transform: "rotate(60deg)" }}
      />
      <div
        className="absolute left-[387px] top-[193px] w-[30px] h-[51px] bg-white rounded"
        style={{ zIndex: 4, opacity: 0.02 }}
      />
      <div
        className="absolute left-[141px] top-[457.88px] w-[29px] h-[98px] bg-white opacity-10 rounded"
        style={{ zIndex: 5 }}
      />
      <div
        className="absolute left-[125px] top-[71px] w-[17.61px] h-[59.87px] bg-white rounded"
        style={{ zIndex: 6, opacity: 0.05, transform: "rotate(-15deg)" }}
      />

      {/* Left Section - What's Next */}
      <div className="flex flex-col justify-center items-start gap-8 w-[443px] relative z-10">
        {/* Header */}
        <div className="flex flex-row justify-center items-center px-[10px] py-[10px]">
          <h1 className="text-white tracking-[-0.02em] text-4xl font-normal">{"What's Next ?"}</h1>
        </div>

        {/* Steps */}
        <div className="flex flex-row items-start py-4 w-full">
          {/* Step Indicators */}
          <div className="flex flex-col items-center gap-2 relative z-10 -mx-1">
            {/* Circle 1 */}
            <div className="w-10 h-10 rounded-full bg-[#F7F8FA] opacity-40 flex items-center justify-center">
              <span className="text-white opacity-80 text-base font-medium">1</span>
            </div>

            {/* Connecting Line */}
            <div className="w-0.5 h-[69px] bg-[#F7F8FA] opacity-40" />

            {/* Circle 2 */}
            <div className="w-10 h-10 rounded-full bg-[#F7F8FA] opacity-40 flex items-center justify-center">
              <span className="text-white opacity-80 text-base font-medium">2</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex flex-col items-start gap-10 flex-1 ml-4">
            {/* Step 1 */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex flex-row justify-center items-center px-[10px]">
                <h3 className="text-white text-xl font-medium">Technical evaluation</h3>
              </div>
              <div className="flex flex-row items-center px-[10px]">
                <p className="text-white opacity-60 tracking-[0.02em] text-sm leading-relaxed">
                  Vendors who meet the technical requirements will be forwarded for commercial evaluation.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex flex-row justify-center items-center px-[10px]">
                <h3 className="text-white text-xl font-medium">Review and consolidation</h3>
              </div>
              <div className="flex flex-row justify-center items-center px-[10px]">
                <p className="text-white opacity-50 tracking-[0.02em] text-sm leading-relaxed">
                  During the technical evaluation process, please record and share your observations and recommendations
                  with the manager for review and consolidation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Decision Card */}
      <div className="flex flex-col justify-center items-center p-10 gap-8 bg-white rounded-[11px] w-[573px] relative z-10">
        {/* Card Header */}
        <div className="flex flex-row justify-center items-center py-1 w-full">
          <h2 className="text-[#000525] tracking-[-0.01em] text-2xl font-normal text-center">
            Kindly take a decision to proceed
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col items-start gap-4 w-full px-8">
          {/* Radio Option 1 */}
          <div
            className="flex flex-col items-start p-4 px-5 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
            style={{ borderColor: selectedOption === "completed" ? "#000525" : "#000000" }}
            onClick={() => handleOptionSelect("completed")}
          >
            {/* Radio Row */}
            <div className="flex flex-row items-center w-full gap-3">
              {/* Radio Button */}
              <div className="flex flex-row items-center justify-center p-1 w-[18px] h-[18px] border border-black rounded-full cursor-pointer">
                {selectedOption === "completed" && <div className="w-[10px] h-[10px] bg-black rounded-full" />}
              </div>

              {/* Label */}
              <div className="flex flex-row justify-center items-center px-[10px]">
                <span className="tracking-[0.01em] text-black font-medium">Technical Evaluation completed</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-row justify-center items-center py-[6px] px-[10px] ml-7">
              <p className="text-[#000525] opacity-50 tracking-[0.01em] text-sm">
                Technical evaluation will be marked as completed
              </p>
            </div>
          </div>

          {/* Radio Option 2 */}
          <div
            className="flex flex-col items-start p-4 px-5 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
            style={{ borderColor: selectedOption === "return" ? "#000525" : "#000000" }}
            onClick={() => handleOptionSelect("return")}
          >
            {/* Radio Row */}
            <div className="flex flex-row items-center w-full gap-3">
              {/* Radio Button */}
              <div className="flex flex-row items-center justify-center p-1 w-[18px] h-[18px] border border-black rounded-full cursor-pointer">
                {selectedOption === "return" && <div className="w-[10px] h-[10px] bg-black rounded-full" />}
              </div>

              {/* Label */}
              <div className="flex flex-row justify-center items-center px-[10px]">
                <span className="tracking-[0.01em] text-black font-medium">Return to procurement officer</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-row justify-center items-center py-[6px] px-[10px] ml-7">
              <p className="text-[#000525] opacity-50 tracking-[0.01em] text-sm">
                Request will be returned to procurement officer
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-[10px] w-full px-8">
          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={!selectedOption}
            className="flex flex-row justify-center items-center p-3 gap-[10px] flex-1 bg-[#1B733D] rounded-lg hover:bg-[#145a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            <span className="text-white tracking-[0.01em] font-medium">Complete</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="flex flex-row justify-center items-center py-[10px] px-3 gap-[10px] flex-1 border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            <XCircle className="w-4 h-4 text-[#5F6C81]" />
            <span className="text-[#45546E] tracking-[0.01em] font-medium">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  )
}
