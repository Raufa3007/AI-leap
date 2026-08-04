"use client"

import type React from "react"
import { useState } from "react"

interface SignatureVerificationDialogProps {
  isOpen: boolean
  onClose: () => void
  onAcknowledge: () => void
}

export default function SignatureVerificationDialog({
  isOpen,
  onClose,
  onAcknowledge,
}: SignatureVerificationDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15 MB limit")
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedSignature(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex pointer-events-auto">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-6 relative overflow-hidden">
          <img
            src="/signature-illustration.png"
            alt="Signature illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-slate-700 p-6 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Update signature</h2>
          </div>

          {/* Content */}
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer flex-shrink-0 ${
                isDragging
                  ? "border-green-400 bg-green-500 bg-opacity-10"
                  : "border-slate-400 bg-slate-600 bg-opacity-50"
              }`}
            >
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-slate-300">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Drag & drop signature Here</p>
                    <p className="text-xs text-slate-300 mt-1">Maximum File Size 15 MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-label="Upload signature"
                />
              </label>
            </div>

            {/* Most Recent Signature */}
            <div className="flex-1 flex flex-col min-h-0">
              <p className="text-sm font-medium text-white mb-2">Most recent signature</p>
              <div className="bg-white rounded-lg p-3 flex items-center justify-center flex-1 min-h-0">
                {uploadedSignature ? (
                  <img
                    src={uploadedSignature || "/placeholder.svg"}
                    alt="Uploaded signature"
                    className="h-full max-h-20 object-contain"
                  />
                ) : (
                  <img 
                    src="/handwritten-signature.png" 
                    alt="Recent signature" 
                    className="h-full max-h-20 object-contain" 
                  />
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-shrink-0">
              <button
                onClick={onAcknowledge}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-check-line text-base" />
                Acknowledge
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-slate-400 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-close-line text-base" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
