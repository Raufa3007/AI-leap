"use client"

interface RequestorCardProps {
  requestedBy: string
  requestorManager: string
}

export default function RequestorCard({ requestedBy, requestorManager }: RequestorCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Requestor details</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-600 mb-1">Requested By</p>
          <p className="text-sm font-semibold text-gray-900">{requestedBy}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Requestor's Manger</p>
          <p className="text-sm font-semibold text-gray-900">{requestorManager}</p>
        </div>
      </div>
    </div>
  )
}
