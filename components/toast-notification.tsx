"use client"

import { X, Check } from "lucide-react"

interface ToastNotificationProps {
  message: string
  onClose: () => void
}

export default function ToastNotification({ message, onClose }: ToastNotificationProps) {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-lg z-50 flex items-center gap-3 border border-green-200">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Check size={20} className="text-green-600" />
      </div>
      <span className="text-gray-900 font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>
    </div>
  )
}
