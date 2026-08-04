"use client"

interface BudgetCardProps {
  title: string
  amount: string
  percentage?: number
  isChart?: boolean
}

export default function BudgetCard({ title, amount, percentage, isChart }: BudgetCardProps) {
  if (isChart) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{amount}</p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeDasharray={`${(percentage || 75) * 2.827} 282.7`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-900">{percentage || 75}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-xs text-gray-600 mb-1">{title}</p>
      <p className="text-lg font-bold text-gray-900">{amount}</p>
    </div>
  )
}
