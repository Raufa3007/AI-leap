"use client"

import { X } from "lucide-react"

interface ContractPDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContractPDFPreviewModal({ isOpen, onClose }: ContractPDFPreviewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Contract Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe src="/contract-4600006005.pdf" className="w-full h-full" title="Contract PDF Preview" />
        </div>
      </div>
    </div>
  )
}
