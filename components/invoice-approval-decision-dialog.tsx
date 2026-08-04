"use client"

import { useState } from "react"
import { X, CheckCircle2 } from "lucide-react"

interface InvoiceApprovalDecisionDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (decision: string, comments?: string) => void
}

export default function InvoiceApprovalDecisionDialog({
  isOpen,
  onClose,
  onComplete,
}: InvoiceApprovalDecisionDialogProps) {
  const [selectedDecision, setSelectedDecision] = useState<string>("")
  const [comments, setComments] = useState("")

  if (!isOpen) return null

  const handleComplete = () => {
    if (!selectedDecision) return
    if (selectedDecision === "reject" && !comments.trim()) {
      alert("Please provide comments for rejection")
      return
    }
    onComplete(selectedDecision, comments)
    setSelectedDecision("")
    setComments("")
  }

  const handleCancel = () => {
    setSelectedDecision("")
    setComments("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Dialog container with split layout */}
      <div className="relative flex flex-row items-center gap-12 p-12 bg-[#45546E] rounded-[15px] max-w-[1200px] shadow-2xl">
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

          {/* Step 1 - Verify Invoice and payment */}
          <div className="flex flex-row items-start gap-4">
            <div className="flex flex-row justify-center items-center w-10 h-10 bg-white bg-opacity-20 rounded-full flex-shrink-0">
              <span className="text-white text-lg font-medium">1</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-xl font-medium">Verify Invoice and payment</h3>
              <p className="text-white opacity-60 tracking-[0.02em] text-sm leading-relaxed">
                For the submitted invoice finance team will perform payment and related details will be notified to
                requestor and procurement team
              </p>
            </div>
          </div>

          {/* Step 2 - Feedback and Rating */}
          <div className="flex flex-row items-start gap-4">
            <div className="flex flex-row justify-center items-center w-10 h-10 bg-white bg-opacity-20 rounded-full flex-shrink-0">
              <span className="text-white text-lg font-medium">2</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-xl font-medium">Feedback and Rating</h3>
              <p className="text-white opacity-60 tracking-[0.02em] text-sm leading-relaxed">
                Vendor will be rated based on his delivery, quality and time of delivery for future purchases.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Decision Card */}
        <div className="flex flex-col justify-center items-center p-10 gap-6 bg-white rounded-[11px] w-[540px] relative z-10">
          {/* Card Header */}
          <div className="flex flex-row justify-center items-center py-1 w-full">
            <h2 className="text-[#000525] tracking-[-0.01em] text-2xl font-normal text-center">
              Kindly take a decision to proceed
            </h2>
          </div>

          {/* Options */}
          <div className="flex flex-col items-start gap-4 w-full px-6">
            {/* Radio Option - Approve */}
            <div
              className="flex flex-col items-start p-4 px-5 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
              style={{ borderColor: selectedDecision === "approve" ? "#000525" : "#D1D5DB" }}
              onClick={() => setSelectedDecision("approve")}
            >
              <div className="flex flex-row items-center w-full gap-3">
                <div className="flex flex-row items-center justify-center p-1 w-[18px] h-[18px] border border-black rounded-full cursor-pointer">
                  {selectedDecision === "approve" && <div className="w-[10px] h-[10px] bg-black rounded-full" />}
                </div>
                <div className="flex flex-row justify-center items-center px-[10px]">
                  <span className="tracking-[0.01em] text-black font-medium">Approve</span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center py-[6px] px-[10px] ml-7">
                <p className="text-[#5F6C81] tracking-[0.01em] text-sm">System will approve submitted invoice</p>
              </div>
            </div>

            {/* Radio Option - Reject */}
            <div
              className="flex flex-col items-start p-4 px-5 w-full bg-white border rounded-md cursor-pointer transition-colors hover:border-gray-400"
              style={{ borderColor: selectedDecision === "reject" ? "#000525" : "#D1D5DB" }}
              onClick={() => setSelectedDecision("reject")}
            >
              <div className="flex flex-row items-center w-full gap-3">
                <div className="flex flex-row items-center justify-center p-1 w-[18px] h-[18px] border border-black rounded-full cursor-pointer">
                  {selectedDecision === "reject" && <div className="w-[10px] h-[10px] bg-black rounded-full" />}
                </div>
                <div className="flex flex-row justify-center items-center px-[10px]">
                  <span className="tracking-[0.01em] text-black font-medium">Reject</span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center py-[6px] px-[10px] ml-7">
                <p className="text-[#5F6C81] tracking-[0.01em] text-sm">
                  The invoice will remain open for clarifications
                </p>
              </div>
            </div>

            {/* Radio Option - Proceed to text task */}
          
          </div>

          {/* Comments Section */}
          <div className="w-full px-6">
            <label className="block text-sm font-medium mb-2 text-[#5F6C81]">
              Comments (only if rejected) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={selectedDecision !== "reject"}
              placeholder="Type here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 resize-none text-[#000525]"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-[10px] w-full px-6">
            {/* Complete Button */}
            <button
              onClick={handleComplete}
              disabled={!selectedDecision}
              className="flex flex-row justify-center items-center p-3 gap-[10px] flex-1 bg-[#1B733D] rounded-lg hover:bg-[#145a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white tracking-[0.01em] font-medium">Complete</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
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
