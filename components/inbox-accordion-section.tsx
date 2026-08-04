"use client"
import { ChevronDown } from "lucide-react"

interface InboxMessage {
  id: string
  title: string
  priority: "High" | "Medium" | "Low"
  timestamp: string
  department: string
  status: "Open" | "In Progress" | "Pending"
}

interface InboxAccordionSectionProps {
  title: string
  icon: string
  description: string
  messages: InboxMessage[]
  isOpen: boolean
  onToggle: () => void
  messageCount: number
  accentColor: string
}

export default function InboxAccordionSection({
  title,
  icon,
  description,
  messages,
  isOpen,
  onToggle,
  messageCount,
  accentColor,
}: InboxAccordionSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-200 active:bg-gray-100"
      >
        <div className="flex items-center gap-4 flex-1 text-left">
          {/* Icon with animated background */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <i className={`${icon} text-xl transition-transform duration-300`} style={{ color: accentColor }} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-gray-900 transition-colors duration-200">{title}</h3>
              <span
                className="px-2.5 py-1 text-xs font-medium rounded-full text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: accentColor }}
              >
                {messageCount}
              </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        <div
          className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: accentColor }}
        >
          <ChevronDown size={24} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-4 space-y-3 max-h-96 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-left-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-gray-700 transition-colors duration-200">
                        {message.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{message.department}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                        message.priority === "High"
                          ? "bg-red-100 text-red-700 group-hover:bg-red-200"
                          : message.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 group-hover:bg-green-200"
                      }`}
                    >
                      {message.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded transition-all duration-200 ${
                        message.status === "Open"
                          ? "bg-blue-100 text-blue-700 group-hover:bg-blue-200"
                          : message.status === "In Progress"
                            ? "bg-orange-100 text-orange-700 group-hover:bg-orange-200"
                            : "bg-purple-100 text-purple-700 group-hover:bg-purple-200"
                      }`}
                    >
                      {message.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 animate-in fade-in duration-300">
                <p className="text-gray-500 text-sm">No messages in this section</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
