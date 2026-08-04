"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Search, Filter, MoreHorizontal, RefreshCw } from "lucide-react"
import DocumentPreviewModal from "./document-preview-modal"

interface InboxTask {
  id: string
  title: string
  department: string
  timestamp: string
  owner: string
  status: "In Progress" | "Open" | "Pending"
  statusColor: "orange" | "blue"
  rfpId: string
  process: string
  dueDate: string
  createdOn: string
  owner_name: string
  requestor: string
  requestor_manager: string
  budget_remaining: string
  budget_rfp: string
  budget_after_approval: string
  other_requests: string
  department_detail: string
  cost_centre: string
  purchase_group: string
  contract_duration: string
  scope_of_work?: string
  isSupplier?: boolean
  supplierId?: string
  isPR?: boolean
  prId?: string
  priority?: number
  attachments?: Array<{
    id: string
    name: string
    type: "pdf" | "image" | "invoice" | "document"
    url?: string
  }>
}

interface AccordionSection {
  id: string
  title: string
  icon: string
  tasks: InboxTask[]
}

interface ProcInboxAccordionNewProps {
  tasks: InboxTask[]
  selectedTaskId?: string | null
  onTaskSelect?: (task: InboxTask) => void
  onSearchChange?: (query: string) => void
  loading?: boolean
}

export default function ProcInboxAccordionNew({
  tasks,
  selectedTaskId,
  onTaskSelect,
  onSearchChange,
  loading = false,
}: ProcInboxAccordionNewProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string
    type: "pdf" | "image" | "invoice" | "document"
    url?: string
  } | null>(null)

  // Define the 7 procurement workflow sections
  const sectionDefinitions = [
    {
      id: "verify-supplier",
      title: "Verify & approve new supplier",
      icon: "ri-user-check-line",
      keywords: ["supplier", "verify", "approve"],
    },
    {
      id: "approve-pr",
      title: "Approve & Publish PR",
      icon: "ri-file-check-line",
      keywords: ["pr", "approve", "publish"],
    },
    {
      id: "assign-committee",
      title: "Assign committee members & evaluation criteria for RFP",
      icon: "ri-team-line",
      keywords: ["committee", "assign", "evaluation"],
    },
    {
      id: "technical-assessment",
      title: "Conduct Technical Assessment For RFP",
      icon: "ri-tools-line",
      keywords: ["technical", "assessment"],
    },
    {
      id: "commercial-assessment",
      title: "Conduct Commercial assessment for RFP",
      icon: "ri-money-dollar-circle-line",
      keywords: ["commercial", "assessment"],
    },
    {
      id: "prepare-po",
      title: "Prepare PO For RFP",
      icon: "ri-file-list-line",
      keywords: ["po", "prepare"],
    },
    {
      id: "confirm-closure",
      title: "Confirm closure/delivery of the item in PO",
      icon: "ri-checkbox-circle-line",
      keywords: ["closure", "delivery", "confirm"],
    },
  ]

  // Group tasks by section
  const groupTasksBySection = (): AccordionSection[] => {
    return sectionDefinitions.map((section) => {
      const sectionTasks = tasks.filter((task) => {
        const taskText = `${task.title} ${task.department} ${task.process}`.toLowerCase()
        return section.keywords.some((keyword) => taskText.includes(keyword.toLowerCase()))
      })
      return {
        id: section.id,
        title: section.title,
        icon: section.icon,
        tasks: sectionTasks,
      }
    })
  }

  const sections = groupTasksBySection()

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearchChange?.(e.target.value)
  }

  const handleDocumentClick = (doc: { name: string; type: "pdf" | "image" | "invoice" | "document"; url?: string }) => {
    setSelectedDocument(doc)
  }

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-50 h-screen">
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Accordion Task List */}
          <div className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Header with Search */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-transparent outline-none text-sm flex-1"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>

              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Loading data...</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sections.map((section) => (
                    <div key={section.id} className="border-b border-gray-200">
                      {/* Section Header - Accordion Toggle */}
                      <button
                        onClick={() => handleSectionToggle(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <i className={`${section.icon} text-lg text-green-600`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-green-700 transition-colors">
                              {section.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {section.tasks.length} item{section.tasks.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {section.tasks.length}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`text-gray-400 transition-transform duration-300 ${
                              expandedSection === section.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Section Content - Tasks List */}
                      {expandedSection === section.id && (
                        <div className="bg-gray-50 divide-y divide-gray-200 animate-in fade-in duration-200">
                          {section.tasks.length > 0 ? (
                            section.tasks.map((task, index) => (
                              <div
                                key={task.id}
                                onClick={() => onTaskSelect?.(task)}
                                className={`px-6 py-4 cursor-pointer hover:bg-white transition-colors ${
                                  selectedTaskId === task.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                                }`}
                                style={{
                                  animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                      task.statusColor === "orange" ? "bg-orange-500" : "bg-blue-500"
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 w-full">
                                      <div className="flex-1">
                                        <h4
                                          className={`font-medium text-sm mb-1 ${
                                            selectedTaskId === task.id ? "text-green-700" : "text-gray-900"
                                          }`}
                                        >
                                          {task.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 mb-1">{task.department}</p>
                                        <p className="text-xs text-gray-500">{task.owner}</p>
                                        {task.attachments && task.attachments.length > 0 && (
                                          <div className="mt-2 flex flex-wrap gap-2">
                                            {task.attachments.map((attachment) => (
                                              <button
                                                key={attachment.id}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleDocumentClick({
                                                    name: attachment.name,
                                                    type: attachment.type,
                                                    url: attachment.url,
                                                  })
                                                }}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                                              >
                                                <span className="font-bold">PDF</span>
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-gray-500 mb-2">{task.timestamp}</p>
                                        <span
                                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                            task.status === "In Progress"
                                              ? "bg-orange-100 text-orange-600"
                                              : "bg-blue-100 text-blue-600"
                                          }`}
                                        >
                                          {task.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-6 py-8 text-center">
                              <p className="text-sm text-gray-500">No items in this section</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Placeholder */}
          <div className="flex-1 bg-white flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                  <i className="ri-mail-open-line text-5xl" style={{ color: "#1B733D" }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a message to view</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Choose a message from the accordion sections on the left to see its details and take action
              </p>
            </div>
          </div>
        </div>

        {/* Animation Styles */}
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      <DocumentPreviewModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        fileName={selectedDocument?.name || ""}
        fileType={selectedDocument?.type || "document"}
        fileUrl={selectedDocument?.url}
      />
    </>
  )
}
