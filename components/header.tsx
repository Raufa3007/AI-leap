"use client"

import { ChevronDown, ArrowLeft } from "lucide-react"

interface HeaderProps {
  onBack?: () => void
  showBackButton?: boolean
}

export default function Header({ onBack, showBackButton = false }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Back to login"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="text-2xl font-bold text-green-700">KaarTech</div>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Supplier registration form</h1>
        </div>
        <button className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          English (United Kingdom)
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  )
}
