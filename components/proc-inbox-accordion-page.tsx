"use client"

import { useState } from "react"
import InboxAccordionContainer from "./inbox-accordion-container"
import { Search, Filter, MoreHorizontal, RefreshCw } from "lucide-react"

interface ProcInboxAccordionPageProps {
  selectedInboxTaskId?: string | null
  onInboxTaskSelect?: (taskId: string) => void
  onViewInboxRFI?: (rfiId: string) => void
  onViewInboxRFP?: (rfpId: string) => void
  onViewInboxQuotation?: (quotationId: string) => void
}

export default function ProcInboxAccordionPage({
  selectedInboxTaskId,
  onInboxTaskSelect,
  onViewInboxRFI,
  onViewInboxRFP,
  onViewInboxQuotation,
}: ProcInboxAccordionPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-screen">
      {/* Header with Search and Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Main Content - Accordion */}
      <div className="flex-1 overflow-y-auto">
        <InboxAccordionContainer />
      </div>
    </div>
  )
}
