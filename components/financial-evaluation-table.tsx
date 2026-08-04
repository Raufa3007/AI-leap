"use client"

import { useState } from "react"
import { Info } from "lucide-react"

interface FinancialEvaluationTableProps {
  isEditable?: boolean
}

export default function FinancialEvaluationTable({ isEditable = false }: FinancialEvaluationTableProps) {
  const [totalPoints, setTotalPoints] = useState("")

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-green-700">Financial evaluation</h3>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-2 gap-4 bg-green-700 text-white p-4 font-medium text-sm">
          <div>Weightage</div>
          <div className="flex items-center gap-1">
            Points
            <Info className="w-4 h-4" />
          </div>
        </div>

        {/* Total row */}
        <div className="grid grid-cols-2 gap-4 p-4 border-t border-gray-200 bg-gray-50">
          <div className="font-medium">Total</div>
          <div>
            {isEditable ? (
              <input
                type="text"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
                placeholder="Type here"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            ) : (
              <span className="text-gray-400">Type here</span>
            )}
          </div>
        </div>

        {/* Financial capabilities row */}
        <div className="grid grid-cols-2 gap-4 p-4 border-t border-gray-200">
          <div className="font-medium">Financial capabilities (40%)</div>
          <div className="text-gray-700">Auto Filled</div>
        </div>
      </div>
    </div>
  )
}
