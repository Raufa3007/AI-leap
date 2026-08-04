"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchProcessHistory, type ProcessHistoryStage } from "@/app/actions/fetch-process-history"

interface ProcessHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  rfpNumber: string
}

export default function ProcessHistoryModal({ isOpen, onClose, rfpNumber }: ProcessHistoryModalProps) {
  const [stages, setStages] = useState<ProcessHistoryStage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && rfpNumber) {
      loadHistory()
    }
  }, [isOpen, rfpNumber])

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("[v0] Fetching process history for:", rfpNumber)
      const historyData = await fetchProcessHistory(rfpNumber)
      setStages(historyData)
    } catch (err) {
      console.error("[v0] Error loading history:", err)
      setError("Failed to load process history")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card - Right aligned */}
      <div className="relative z-10 w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{rfpNumber} Process History</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
                <p className="text-gray-600">Loading process history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        stage.statusColor === "orange"
                          ? "bg-orange-500"
                          : stage.statusColor === "green"
                            ? "bg-green-500"
                            : "bg-gray-300"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white" />
                    </div>
                    {index < stages.length - 1 && <div className="w-0.5 h-full min-h-[60px] bg-gray-200 mt-2" />}
                  </div>

                  {/* Stage content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900">{stage.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          stage.statusColor === "orange"
                            ? "bg-orange-100 text-orange-600"
                            : stage.statusColor === "green"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>

                    {/* Steps */}
                    {stage.steps.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {stage.steps.map((step, stepIndex) => (
                          <p key={stepIndex} className="text-sm text-gray-700">
                            {step}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
