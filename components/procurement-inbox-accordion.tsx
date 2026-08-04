"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface InboxMessage {
  id: string
  title: string
  count: number
  messages: Array<{
    id: string
    name: string
    email: string
    timestamp: string
    status: "pending" | "in-progress" | "completed"
    priority: "high" | "medium" | "low"
  }>
}

const inboxSections: InboxMessage[] = [
  {
    id: "verify-supplier",
    title: "Verify & approve new supplier",
    count: 3,
    messages: [
      {
        id: "1",
        name: "Kaar Technologies",
        email: "contact@kaartech.com",
        timestamp: "Today at 2:30 pm",
        status: "pending",
        priority: "high",
      },
      {
        id: "2",
        name: "Tech Solutions Inc",
        email: "info@techsol.com",
        timestamp: "Yesterday",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: "3",
        name: "Global Supplies Ltd",
        email: "support@globalsupplies.com",
        timestamp: "2 days ago",
        status: "completed",
        priority: "low",
      },
    ],
  },
  {
    id: "approve-pr",
    title: "Approve & Publish PR",
    count: 2,
    messages: [
      {
        id: "1",
        name: "PR #10001",
        email: "procurement@company.com",
        timestamp: "Today at 10:15 am",
        status: "pending",
        priority: "high",
      },
      {
        id: "2",
        name: "PR #10002",
        email: "procurement@company.com",
        timestamp: "Yesterday",
        status: "in-progress",
        priority: "medium",
      },
    ],
  },
  {
    id: "assign-committee",
    title: "Assign committee members & evaluation criteria for RFP",
    count: 1,
    messages: [
      {
        id: "1",
        name: "RFP #5001 - Committee Assignment",
        email: "rfp@company.com",
        timestamp: "Today at 9:00 am",
        status: "pending",
        priority: "high",
      },
    ],
  },
  {
    id: "technical-assessment",
    title: "Conduct Technical Assessment For RFP",
    count: 4,
    messages: [
      {
        id: "1",
        name: "RFP #5001 - Technical Eval",
        email: "rfp@company.com",
        timestamp: "Today at 3:45 pm",
        status: "in-progress",
        priority: "high",
      },
      {
        id: "2",
        name: "RFP #5002 - Technical Eval",
        email: "rfp@company.com",
        timestamp: "Yesterday",
        status: "pending",
        priority: "medium",
      },
      {
        id: "3",
        name: "RFP #5003 - Technical Eval",
        email: "rfp@company.com",
        timestamp: "2 days ago",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: "4",
        name: "RFP #5004 - Technical Eval",
        email: "rfp@company.com",
        timestamp: "3 days ago",
        status: "completed",
        priority: "low",
      },
    ],
  },
  {
    id: "commercial-assessment",
    title: "Conduct Commercial assessment for RFP",
    count: 3,
    messages: [
      {
        id: "1",
        name: "RFP #5001 - Commercial Eval",
        email: "rfp@company.com",
        timestamp: "Today at 2:00 pm",
        status: "pending",
        priority: "high",
      },
      {
        id: "2",
        name: "RFP #5002 - Commercial Eval",
        email: "rfp@company.com",
        timestamp: "Yesterday",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: "3",
        name: "RFP #5003 - Commercial Eval",
        email: "rfp@company.com",
        timestamp: "2 days ago",
        status: "completed",
        priority: "low",
      },
    ],
  },
  {
    id: "prepare-po",
    title: "Prepare PO For RFP",
    count: 2,
    messages: [
      {
        id: "1",
        name: "PO #3001 - Preparation",
        email: "po@company.com",
        timestamp: "Today at 1:30 pm",
        status: "in-progress",
        priority: "high",
      },
      {
        id: "2",
        name: "PO #3002 - Preparation",
        email: "po@company.com",
        timestamp: "Yesterday",
        status: "pending",
        priority: "medium",
      },
    ],
  },
  {
    id: "confirm-closure",
    title: "Confirm closure/delivery of the item in PO",
    count: 5,
    messages: [
      {
        id: "1",
        name: "PO #3001 - Closure Confirmation",
        email: "po@company.com",
        timestamp: "Today at 4:15 pm",
        status: "pending",
        priority: "high",
      },
      {
        id: "2",
        name: "PO #3002 - Closure Confirmation",
        email: "po@company.com",
        timestamp: "Today at 11:00 am",
        status: "in-progress",
        priority: "high",
      },
      {
        id: "3",
        name: "PO #3003 - Closure Confirmation",
        email: "po@company.com",
        timestamp: "Yesterday",
        status: "pending",
        priority: "medium",
      },
      {
        id: "4",
        name: "PO #3004 - Closure Confirmation",
        email: "po@company.com",
        timestamp: "2 days ago",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: "5",
        name: "PO #3005 - Closure Confirmation",
        email: "po@company.com",
        timestamp: "3 days ago",
        status: "completed",
        priority: "low",
      },
    ],
  },
]

export default function ProcurementInboxAccordion() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityIndicator = (priority: string) => {
    if (priority === "high") {
      return <div className="w-2 h-2 rounded-full bg-red-500" />
    }
    return null
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-600">Manage your procurement workflow tasks</p>
      </div>

      <div className="space-y-3">
        {inboxSections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Section Header */}
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {section.count} item{section.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                  {section.count}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                    expandedSection === section.id ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Section Content */}
            {expandedSection === section.id && (
              <div className="border-t border-gray-200 bg-gray-50 divide-y divide-gray-200">
                {section.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="px-6 py-4 bg-white hover:bg-gray-50 transition-colors duration-150 animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{message.name}</h4>
                          {getPriorityIndicator(message.priority)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{message.email}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-500 whitespace-nowrap">{message.timestamp}</span>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            message.status,
                          )}`}
                        >
                          {message.status === "pending"
                            ? "Pending"
                            : message.status === "in-progress"
                              ? "In Progress"
                              : "Completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
