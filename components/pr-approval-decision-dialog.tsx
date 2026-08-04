"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface PRApprovalDecisionDialogProps {
  isOpen: boolean
  onComplete?: () => void
  onCancel?: () => void
}

export default function PRApprovalDecisionDialog({ isOpen, onComplete, onCancel }: PRApprovalDecisionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [comments, setComments] = useState<string>("")

  if (!isOpen) return null

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleComplete = () => {
    if (selectedOption && onComplete) {
      console.log("[v0] Decision:", selectedOption)
      console.log("[v0] Comments:", comments)
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10" onClick={onCancel} />

      <div className="relative flex flex-row items-center gap-8 p-8 bg-[#45546E] rounded-[15px] max-w-[900px] w-full max-h-[85vh] isolate">
        {/* Decorative Background Elements - Reduced size */}
        <div
          className="absolute left-[60px] top-[320px] w-[50px] h-[85px] bg-white opacity-10 rounded"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute left-[200px] top-[35px] w-[25px] h-[45px] bg-white opacity-8 rounded rotate-45"
          style={{ zIndex: 1, opacity: 0.08 }}
        />
        <div
          className="absolute left-[680px] top-[15px] w-[25px] h-[45px] bg-white opacity-8 rounded rotate-45"
          style={{ zIndex: 2, opacity: 0.08 }}
        />
        <div
          className="absolute left-[260px] top-[300px] w-[45px] h-[80px] bg-white rounded"
          style={{ zIndex: 3, opacity: 0.02, transform: "rotate(60deg)" }}
        />
        <div
          className="absolute left-[280px] top-[140px] w-[22px] h-[38px] bg-white rounded"
          style={{ zIndex: 4, opacity: 0.02 }}
        />
        <div
          className="absolute left-[100px] top-[320px] w-[22px] h-[70px] bg-white opacity-10 rounded"
          style={{ zIndex: 5 }}
        />
        <div
          className="absolute left-[90px] top-[50px] w-[13px] h-[45px] bg-white rounded"
          style={{ zIndex: 6, opacity: 0.05, transform: "rotate(-15deg)" }}
        />

        {/* Left Section - What's Next */}
        <div className="flex flex-col justify-center items-start gap-6 w-[320px] relative z-10">
          {/* Header */}
          <div className="flex flex-row justify-center items-center px-2 py-2">
            <h1 className="text-white tracking-[-0.02em] text-2xl font-normal">{"What's Next ?"}</h1>
          </div>

          {/* Steps */}
          <div className="flex flex-row items-start py-2 w-full">
            {/* Step Indicators */}
            <div className="flex flex-col items-center gap-1 relative z-10 -mx-1">
              {/* Circle 1 */}
              <div className="w-8 h-8 rounded-full bg-[#F7F8FA] opacity-40 flex items-center justify-center">
                <span className="text-white opacity-80 text-sm font-medium">1</span>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-[50px] bg-[#F7F8FA] opacity-40" />

              {/* Circle 2 */}
              <div className="w-8 h-8 rounded-full bg-[#F7F8FA] opacity-40 flex items-center justify-center">
                <span className="text-white opacity-80 text-sm font-medium">2</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="flex flex-col items-start gap-6 flex-1 ml-3">
              {/* Step 1 */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex flex-row justify-center items-center px-2">
                  <h3 className="text-white text-lg font-medium">Request will be forwarded for approval</h3>
                </div>
                <div className="flex flex-row items-center px-2">
                  <p className="text-white opacity-60 tracking-[0.02em] text-xs leading-relaxed">
                    The requester and procurement team will be notified of the approval. The procurement team will
                    proceed with RFQ/RFP creation as per standard process.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex flex-row justify-center items-center px-2">
                  <h3 className="text-white text-lg font-medium">Request for proposal/ Quotation</h3>
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                  <p className="text-white opacity-50 tracking-[0.02em] text-xs leading-relaxed">
                    Procurement team issues an RFP to invite vendors to submit bids. Vendors provide pricing, timelines,
                    and technical proposals. Team will gor RFI if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Decision Card */}
        <div className="flex flex-col justify-center items-center p-6 gap-6 bg-white rounded-[11px] w-[420px] relative z-10">
          {/* Card Header */}
          <div className="flex flex-row justify-center items-center py-1 w-full">
            <h2 className="text-[#000525] tracking-[-0.01em] text-xl font-normal text-center">
              Kindly take a decision to proceed
            </h2>
          </div>

          {/* Options */}
          <div className="flex flex-col items-start gap-3 w-full px-6">
           <div
              className="flex flex-col items-start p-3 px-4 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
              style={{ borderColor: selectedOption === "proceed" ? "#000525" : "#000000" }}
              onClick={() => handleOptionSelect("proceed")}
            >
              <div className="flex flex-row items-center w-full gap-3">
                <div className="flex flex-row items-center justify-center p-1 w-[16px] h-[16px] border border-black rounded-full cursor-pointer">
                  {selectedOption === "proceed" && <div className="w-[8px] h-[8px] bg-black rounded-full" />}
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                  <span className="tracking-[0.01em] text-black font-medium text-sm">Proceed to Bid Evaluation</span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center py-1 px-2 ml-6">
                <p className="text-[#000525] opacity-50 tracking-[0.01em] text-xs">
                  System will initiate task to prepare bids for evaluation
                </p>
              </div>
            </div>
            {/* Radio Option 1 - Reject */}
            <div
              className="flex flex-col items-start p-3 px-4 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
              style={{ borderColor: selectedOption === "reject" ? "#000525" : "#000000" }}
              onClick={() => handleOptionSelect("reject")}
            >
              <div className="flex flex-row items-center w-full gap-3">
                <div className="flex flex-row items-center justify-center p-1 w-[16px] h-[16px] border border-black rounded-full cursor-pointer">
                  {selectedOption === "reject" && <div className="w-[8px] h-[8px] bg-black rounded-full" />}
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                  <span className="tracking-[0.01em] text-black font-medium text-sm">Reject</span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center py-1 px-2 ml-6">
                <p className="text-[#000525] opacity-50 tracking-[0.01em] text-xs">Request will be rejected</p>
              </div>
            </div>

            {/* Radio Option 2 - Proceed to Bid Evaluation */}
           
          </div>

          {/* Comments Field */}
          <div className="flex flex-col items-start gap-2 w-full px-6">
            <label className="text-[#000525] text-xs font-medium">
              Comments (only if rejected) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Type here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none text-sm"
              rows={2}
              style={{ color: "#000525" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-2 w-full px-6">
            {/* Complete Button */}
            <button
              onClick={handleComplete}
              disabled={!selectedOption}
              className="flex flex-row justify-center items-center p-2 gap-2 flex-1 bg-[#1B733D] rounded-lg hover:bg-[#145a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-white tracking-[0.01em] font-medium text-sm">Complete</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="flex flex-row justify-center items-center py-2 px-3 gap-2 flex-1 border border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              <XCircle className="w-4 h-4 text-[#5F6C81]" />
              <span className="text-[#45546E] tracking-[0.01em] font-medium text-sm">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
