"use client"

import { useState, useEffect } from "react"
import InboxAccordionSection from "./inbox-accordion-section"

interface InboxMessage {
  id: string
  title: string
  priority: "High" | "Medium" | "Low"
  timestamp: string
  department: string
  status: "Open" | "In Progress" | "Pending"
}

interface AccordionSection {
  id: string
  title: string
  icon: string
  description: string
  messages: InboxMessage[]
  accentColor: string
}

const ACCORDION_SECTIONS: AccordionSection[] = [
  {
    id: "verify-supplier",
    title: "Verify & Approve New Supplier",
    icon: "ri-user-check-line",
    description: "Review and approve new supplier registrations",
    accentColor: "#1B733D",
    messages: [
      {
        id: "msg-1",
        title: "New Supplier Registration - TechCorp Solutions",
        priority: "High",
        timestamp: "2 hours ago",
        department: "Procurement",
        status: "Open",
      },
      {
        id: "msg-2",
        title: "Supplier Update - Global Logistics Inc",
        priority: "Medium",
        timestamp: "5 hours ago",
        department: "Vendor Management",
        status: "In Progress",
      },
    ],
  },
  {
    id: "approve-publish-pr",
    title: "Approve & Publish PR",
    icon: "ri-file-check-line",
    description: "Review and publish purchase requisitions",
    accentColor: "#0066CC",
    messages: [
      {
        id: "msg-3",
        title: "PR-2025-001 - Office Supplies Approval",
        priority: "Medium",
        timestamp: "1 hour ago",
        department: "Finance",
        status: "Pending",
      },
      {
        id: "msg-4",
        title: "PR-2025-002 - IT Equipment Request",
        priority: "High",
        timestamp: "3 hours ago",
        department: "IT Department",
        status: "Open",
      },
      {
        id: "msg-5",
        title: "PR-2025-003 - Maintenance Services",
        priority: "Low",
        timestamp: "1 day ago",
        department: "Operations",
        status: "In Progress",
      },
    ],
  },
  {
    id: "assign-committee",
    title: "Assign Committee Members & Evaluation Criteria for RFP",
    icon: "ri-team-line",
    description: "Set up evaluation committees and define criteria",
    accentColor: "#FF6B35",
    messages: [
      {
        id: "msg-6",
        title: "RFP-2025-0107 - Committee Assignment",
        priority: "High",
        timestamp: "30 mins ago",
        department: "Procurement",
        status: "Open",
      },
    ],
  },
  {
    id: "technical-assessment",
    title: "Conduct Technical Assessment For RFP",
    icon: "ri-tools-line",
    description: "Evaluate technical proposals and specifications",
    accentColor: "#7C3AED",
    messages: [
      {
        id: "msg-7",
        title: "RFP-2025-0108 - Technical Evaluation",
        priority: "High",
        timestamp: "45 mins ago",
        department: "Technical Team",
        status: "In Progress",
      },
      {
        id: "msg-8",
        title: "RFP-2025-0109 - Spec Review Required",
        priority: "Medium",
        timestamp: "2 hours ago",
        department: "Engineering",
        status: "Open",
      },
    ],
  },
  {
    id: "commercial-assessment",
    title: "Conduct Commercial Assessment for RFP",
    icon: "ri-money-dollar-circle-line",
    description: "Review pricing and commercial terms",
    accentColor: "#DC2626",
    messages: [
      {
        id: "msg-9",
        title: "RFP-2025-0107 - Commercial Evaluation",
        priority: "Medium",
        timestamp: "1 hour ago",
        department: "Finance",
        status: "Pending",
      },
    ],
  },
  {
    id: "prepare-po",
    title: "Prepare PO For RFP",
    icon: "ri-file-list-line",
    description: "Create and finalize purchase orders",
    accentColor: "#059669",
    messages: [
      {
        id: "msg-10",
        title: "PO-2025-001 - Generate from RFP-0107",
        priority: "High",
        timestamp: "20 mins ago",
        department: "Procurement",
        status: "Open",
      },
      {
        id: "msg-11",
        title: "PO-2025-002 - Terms Review",
        priority: "Medium",
        timestamp: "4 hours ago",
        department: "Legal",
        status: "In Progress",
      },
    ],
  },
  {
    id: "confirm-closure",
    title: "Confirm Closure/Delivery of the Item in PO",
    icon: "ri-checkbox-circle-line",
    description: "Verify delivery and close purchase orders",
    accentColor: "#0891B2",
    messages: [
      {
        id: "msg-12",
        title: "PO-2025-001 - Delivery Confirmation",
        priority: "Medium",
        timestamp: "3 hours ago",
        department: "Warehouse",
        status: "Pending",
      },
      {
        id: "msg-13",
        title: "PO-2025-003 - Partial Delivery Update",
        priority: "Low",
        timestamp: "1 day ago",
        department: "Logistics",
        status: "In Progress",
      },
    ],
  },
]

export default function InboxAccordionContainer() {
  const [openSectionId, setOpenSectionId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inboxOpenSection") || null
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (openSectionId) {
        localStorage.setItem("inboxOpenSection", openSectionId)
      } else {
        localStorage.removeItem("inboxOpenSection")
      }
    }
  }, [openSectionId])

  const handleToggle = (sectionId: string) => {
    setOpenSectionId(openSectionId === sectionId ? null : sectionId)
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-600 text-lg">
          Manage your procurement workflow tasks. Click on any section to expand and view messages.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Messages",
            value: ACCORDION_SECTIONS.reduce((sum, section) => sum + section.messages.length, 0),
            color: "text-gray-900",
            bgColor: "bg-gray-50",
          },
          {
            label: "High Priority",
            value: ACCORDION_SECTIONS.reduce(
              (sum, section) => sum + section.messages.filter((m) => m.priority === "High").length,
              0,
            ),
            color: "text-red-600",
            bgColor: "bg-red-50",
          },
          {
            label: "In Progress",
            value: ACCORDION_SECTIONS.reduce(
              (sum, section) => sum + section.messages.filter((m) => m.status === "In Progress").length,
              0,
            ),
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
          {
            label: "Pending",
            value: ACCORDION_SECTIONS.reduce(
              (sum, section) => sum + section.messages.filter((m) => m.status === "Pending").length,
              0,
            ),
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-gray-300 animate-in fade-in slide-in-from-bottom-2`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-0">
        {ACCORDION_SECTIONS.map((section, index) => (
          <div
            key={section.id}
            className="animate-in fade-in slide-in-from-left-4 duration-500"
            style={{
              animationDelay: `${index * 75}ms`,
            }}
          >
            <InboxAccordionSection
              title={section.title}
              icon={section.icon}
              description={section.description}
              messages={section.messages}
              isOpen={openSectionId === section.id}
              onToggle={() => handleToggle(section.id)}
              messageCount={section.messages.length}
              accentColor={section.accentColor}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Only one section can be expanded at a time. Click on any section header to view its
          messages and take action.
        </p>
      </div>
    </div>
  )
}
