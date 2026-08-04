"use client"

import { useEffect } from "react"

interface InvoiceSnapshotDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function InvoiceSnapshotDialog({ isOpen, onClose }: InvoiceSnapshotDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Invoice Snapshot</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="ri-close-line text-xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Recent Invoice snapshot */}
          <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Recent Invoice snapshot</h4>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Download
              </button>
            </div>

            <div className="space-y-6">
              {/* Invoice details */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Invoice number</p>
                  <p className="text-base font-medium text-gray-900">019401849713</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date issued</p>
                  <p className="text-base font-medium text-gray-900">23 Oct 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Due date</p>
                  <p className="text-base font-medium text-gray-900">22 Nov 2025</p>
                </div>
              </div>

              {/* Billed to / From */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Billed to:</p>
                  <p className="text-sm text-gray-700">KaapSarc</p>
                  <p className="text-sm text-gray-700">123 Market Street</p>
                  <p className="text-sm text-gray-700">San Francisco, CA 94105</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">From:</p>
                  <p className="text-sm text-gray-700">Kaar Technologies</p>
                  <p className="text-sm text-gray-700">Shyamala Towers, 8th Floor</p>
                  <p className="text-sm text-gray-700">Chennai, Tamilnadu, 600015</p>
                </div>
              </div>

              {/* Invoice items table */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price (SAR)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total price (SAR)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">Website Redesign (UI/UX)</td>
                      <td className="px-4 py-3 text-sm text-gray-900">1</td>
                      <td className="px-4 py-3 text-sm text-gray-900">5,000</td>
                      <td className="px-4 py-3 text-sm text-gray-900">5,000</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">Monthly Maintenance – October</td>
                      <td className="px-4 py-3 text-sm text-gray-900">1</td>
                      <td className="px-4 py-3 text-sm text-gray-900">1,000</td>
                      <td className="px-4 py-3 text-sm text-gray-900">1,000</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">Hosting Fee</td>
                      <td className="px-4 py-3 text-sm text-gray-900">1</td>
                      <td className="px-4 py-3 text-sm text-gray-900">500</td>
                      <td className="px-4 py-3 text-sm text-gray-900">500</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900" colSpan={3}>
                        Total
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">6,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment details */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                <div className="flex">
                  <p className="text-sm text-gray-500 w-40">Payment method</p>
                  <p className="text-sm font-medium text-gray-900">Bank transfer</p>
                </div>
                <div className="flex">
                  <p className="text-sm text-gray-500 w-40">Bank</p>
                  <p className="text-sm font-medium text-gray-900">Axis bank</p>
                </div>
                <div className="flex">
                  <p className="text-sm text-gray-500 w-40">Account number</p>
                  <p className="text-sm font-medium text-gray-900">AX123000000123456567</p>
                </div>
                <div className="flex">
                  <p className="text-sm text-gray-500 w-40">Swift code</p>
                  <p className="text-sm font-medium text-gray-900">AXIX3552</p>
                </div>
              </div>

              {/* Thank you message */}
              <div className="text-center pt-4">
                <p className="text-base font-medium text-gray-900">Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
