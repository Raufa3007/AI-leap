"use client"

interface RelationshipItem {
  id: string
  title: string
  description?: string
  status?: string
  date?: string
}

interface RelationshipCardProps {
  item: RelationshipItem
}

export default function RelationshipCard({ item }: RelationshipCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
          {item.description && <p className="text-sm text-gray-600 mb-2">{item.description}</p>}
          {item.date && <p className="text-xs text-gray-500">{item.date}</p>}
        </div>
        {item.status && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 whitespace-nowrap">
            {item.status}
          </span>
        )}
      </div>
    </div>
  )
}
