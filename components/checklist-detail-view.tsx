"use client"

import { useState, useEffect, useRef } from "react"
import { saveCommitteeAssignment, fetchCommitteeAssignment } from "@/app/actions/save-committee-assignment"

interface ChecklistDetailViewProps {
  onBack: () => void
  onHistory?: () => void
  onCommitteeCompleted?: () => void
  onTechnicalCompleted?: () => void
}

interface Member {
  id: string
  name: string
  role: string
  initials: string
  evaluationsDone: number
}

interface EvaluationCriteria {
  id: string
  question: string
  score: number
}

interface Template {
  id: string
  name: string
  marks: number
  criteria: { question: string; score: number }[]
}

export default function ChecklistDetailView({
  onBack,
  onCommitteeCompleted,
  onTechnicalCompleted,
}: ChecklistDetailViewProps) {
  const [activeSection, setActiveSection] = useState("technical-committee")
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const [showSearchMemberModal, setShowSearchMemberModal] = useState(false)
  const [showProposedMembersModal, setShowProposedMembersModal] = useState(false)
  const [showAddEvaluationModal, setShowAddEvaluationModal] = useState(false)
  const [showAddCommercialEvaluationModal, setShowAddCommercialEvaluationModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showCommercialTemplatesModal, setShowCommercialTemplatesModal] = useState(false)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null)
  const [currentCommitteeType, setCurrentCommitteeType] = useState<"technical" | "commercial">("technical")

  const [technicalMembers, setTechnicalMembers] = useState<Member[]>([])
  const [commercialMembers, setCommercialMembers] = useState<Member[]>([])
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria[]>([])
  const [commercialEvaluationCriteria, setCommercialEvaluationCriteria] = useState<EvaluationCriteria[]>([])

  const [status, setStatus] = useState<"edit" | "view">("edit")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // RFP details (hardcoded for now, but can be passed as props)
  const rfpDetails = {
    rfp_id: "RFP2131424",
    pr_reference: "RFP24252",
    bid_closing_date: "29th Oct 2025, 5:00 PM",
    technical_bids_count: 4, // Changed from technical_bids_submitted string to number
    commercial_bids_count: 5, // Changed from commercial_bids_submitted string to number
    bid_type: "Two-envelope (Technical + Commercial)",
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [newCriteria, setNewCriteria] = useState<{ question: string; score: string }[]>([{ question: "", score: "" }])
  const [newCommercialCriteria, setNewCommercialCriteria] = useState<{ question: string; score: string }[]>([
    { question: "", score: "" },
  ])

  const [templateSearchQuery, setTemplateSearchQuery] = useState("")
  const [commercialTemplateSearchQuery, setCommercialTemplateSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedCommercialTemplate, setSelectedCommercialTemplate] = useState<string | null>(null)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [expandedCommercialTemplate, setExpandedCommercialTemplate] = useState<string | null>(null)

  useEffect(() => {
    const loadCommitteeAssignment = async () => {
      const result = await fetchCommitteeAssignment(rfpDetails.rfp_id)
      if (result.success && result.data) {
        console.log("[v0] Loaded committee assignment:", result.data)
        setTechnicalMembers(result.data.technical_committee || [])
        setCommercialMembers(result.data.commercial_committee || [])
        setEvaluationCriteria(result.data.technical_criteria || [])
        setCommercialEvaluationCriteria(result.data.commercial_criteria || [])
        setSelectedDecision(result.data.decision || null)
        setStatus(result.data.status || "edit")
      }
    }
    loadCommitteeAssignment()
  }, [])

  const availableMembers: Member[] = [
    { id: "1", name: "Mohamad Saleem", role: "Finance officer", initials: "MS", evaluationsDone: 5 },
    { id: "2", name: "Amina Bashir", role: "HR Manager", initials: "AB", evaluationsDone: 3 },
    { id: "3", name: "John Kim", role: "Project Lead", initials: "JK", evaluationsDone: 7 },
    { id: "4", name: "Sarah Ahmed", role: "Procurement Officer", initials: "SA", evaluationsDone: 4 },
  ]

  const sections = [
    { id: "rfp-details", label: "RFP details", icon: "ri-file-text-line" },
    { id: "vendors", label: "Vendors", icon: "ri-store-line" },
    { id: "technical-committee", label: "Technical Committee members", icon: "ri-team-line" },
    { id: "commercial-committee", label: "Commercial Committee members", icon: "ri-money-dollar-circle-line" },
    { id: "technical-evaluation", label: "Technical evaluation criteria", icon: "ri-checkbox-multiple-line" },
    { id: "commercial-evaluation", label: "Commercial evaluation criteria", icon: "ri-checkbox-multiple-line" },
    { id: "attachments", label: "Attachments", icon: "ri-attachment-line" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const scrollPosition = contentRef.current.scrollTop + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[sections[i].id]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    const content = contentRef.current
    if (content) {
      content.addEventListener("scroll", handleScroll)
      return () => content.removeEventListener("scroll", handleScroll)
    }
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section && contentRef.current) {
      const offsetTop = section.offsetTop - 20
      contentRef.current.scrollTo({ top: offsetTop, behavior: "smooth" })
    }
  }

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSaveAsDraft = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    const result = await saveCommitteeAssignment({
      ...rfpDetails,
      technical_committee: technicalMembers,
      commercial_committee: commercialMembers,
      technical_criteria: evaluationCriteria,
      commercial_criteria: commercialEvaluationCriteria,
      decision: selectedDecision,
      status: "edit",
    })

    setIsSaving(false)

    if (result.success) {
      setSaveMessage({ type: "success", text: result.message || "Saved as draft successfully" })
      setStatus("edit")
      setTimeout(() => setSaveMessage(null), 3000)
    } else {
      setSaveMessage({ type: "error", text: result.error || "Failed to save" })
    }
  }

  const handleSubmit = async () => {
    // </CHANGE> Removed decision requirement check - now saves directly without dialog
    setIsSaving(true)
    setSaveMessage(null)

    const result = await saveCommitteeAssignment({
      ...rfpDetails,
      technical_committee: technicalMembers,
      commercial_committee: commercialMembers,
      technical_criteria: evaluationCriteria,
      commercial_criteria: commercialEvaluationCriteria,
      decision: selectedDecision,
      status: "view",
    })

    setIsSaving(false)

    if (result.success) {
      setSaveMessage({ type: "success", text: result.message || "Submitted successfully" })
      setStatus("view")
      setShowDecisionModal(false)

      if (selectedDecision === "technical" && onCommitteeCompleted) {
        console.log("[v0] Committee assignment completed, triggering technical evaluation visibility")
        onCommitteeCompleted()
      }

      setTimeout(() => setSaveMessage(null), 3000)
    } else {
      setSaveMessage({ type: "error", text: result.error || "Failed to submit" })
    }
  }

  const handleAddMembers = (type: "technical" | "commercial") => {
    if (status === "view") {
      setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
      return
    }
    setCurrentCommitteeType(type)
    setShowSearchMemberModal(true)
    setSelectedMembers([])
    setSearchQuery("")
  }

  const handleViewProposedMembers = (type: "technical" | "commercial") => {
    if (status === "view") {
      setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
      return
    }
    setCurrentCommitteeType(type)
    setShowProposedMembersModal(true)
    setSelectedMembers([])
  }

  const handleAddSelectedMembers = () => {
    const membersToAdd = availableMembers.filter((m) => selectedMembers.includes(m.id))
    if (currentCommitteeType === "technical") {
      setTechnicalMembers((prev) => [...prev, ...membersToAdd])
    } else {
      setCommercialMembers((prev) => [...prev, ...membersToAdd])
    }
    setShowSearchMemberModal(false)
    setShowProposedMembersModal(false)
    setSelectedMembers([])
  }

  const handleRemoveMember = (memberId: string, type: "technical" | "commercial") => {
    if (status === "view") {
      setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
      return
    }
    if (type === "technical") {
      setTechnicalMembers((prev) => prev.filter((m) => m.id !== memberId))
    } else {
      setCommercialMembers((prev) => prev.filter((m) => m.id !== memberId))
    }
  }

  const handleAddCriteriaRow = () => {
    setNewCriteria((prev) => [...prev, { question: "", score: "" }])
  }

  const handleAddCommercialCriteriaRow = () => {
    setNewCommercialCriteria((prev) => [...prev, { question: "", score: "" }])
  }

  const handleRemoveCriteriaRow = (index: number) => {
    setNewCriteria((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveCommercialCriteriaRow = (index: number) => {
    setNewCommercialCriteria((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveCriteria = () => {
    const validCriteria = newCriteria.filter((c) => c.question && c.score)
    const newEvaluationCriteria = validCriteria.map((c, i) => ({
      id: Date.now().toString() + i,
      question: c.question,
      score: Number.parseInt(c.score),
    }))
    setEvaluationCriteria((prev) => [...prev, ...newEvaluationCriteria])
    setShowAddEvaluationModal(false)
    setNewCriteria([{ question: "", score: "" }])
  }

  const handleSaveCommercialCriteria = () => {
    const validCriteria = newCommercialCriteria.filter((c) => c.question && c.score)
    const newEvaluationCriteria = validCriteria.map((c, i) => ({
      id: Date.now().toString() + i,
      question: c.question,
      score: Number.parseInt(c.score),
    }))
    setCommercialEvaluationCriteria((prev) => [...prev, ...newEvaluationCriteria])
    setShowAddCommercialEvaluationModal(false)
    setNewCommercialCriteria([{ question: "", score: "" }])
  }

  const handleRemoveEvaluationCriteria = (id: string) => {
    if (status === "view") {
      setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
      return
    }
    setEvaluationCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const handleRemoveCommercialEvaluationCriteria = (id: string) => {
    if (status === "view") {
      setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
      return
    }
    setCommercialEvaluationCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const templates: Template[] = [
    {
      id: "1",
      name: "Furniture For The Office",
      marks: 50,
      criteria: [
        { question: "Customization Or Prototyping Capability", score: 10 },
        { question: "In-House Design And Engineering Expertise", score: 10 },
        { question: "R&D And Innovation Capability", score: 10 },
        { question: "Experience in similar projects or industries", score: 10 },
        { question: "Availability of advanced tools, machinery, or technology", score: 10 },
      ],
    },
    {
      id: "2",
      name: "Mobile App",
      marks: 50,
      criteria: [
        { question: "Customization Or Prototyping Capability", score: 10 },
        { question: "In-House Design And Engineering Expertise", score: 10 },
        { question: "R&D And Innovation Capability", score: 10 },
        { question: "Cross-platform development experience", score: 10 },
        { question: "UI/UX design capabilities", score: 10 },
      ],
    },
    {
      id: "3",
      name: "Mobile App",
      marks: 50,
      criteria: [
        { question: "Customization Or Prototyping Capability", score: 10 },
        { question: "In-House Design And Engineering Expertise", score: 10 },
        { question: "R&D And Innovation Capability", score: 10 },
      ],
    },
    {
      id: "4",
      name: "Mobile App",
      marks: 50,
      criteria: [
        { question: "Customization Or Prototyping Capability", score: 10 },
        { question: "In-House Design And Engineering Expertise", score: 10 },
        { question: "R&D And Innovation Capability", score: 10 },
      ],
    },
    {
      id: "5",
      name: "Mobile App",
      marks: 50,
      criteria: [
        { question: "Customization Or Prototyping Capability", score: 10 },
        { question: "In-House Design And Engineering Expertise", score: 10 },
        { question: "R&D And Innovation Capability", score: 10 },
      ],
    },
    {
      id: "6",
      name: "Mobile App",
      marks: 50,
      criteria: [
        { question: "Customization Or Prototyping Capability", score: 10 },
        { question: "In-House Design And Engineering Expertise", score: 10 },
        { question: "R&D And Innovation Capability", score: 10 },
      ],
    },
  ]

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) {
        const newEvaluationCriteria = template.criteria.map((c, i) => ({
          id: Date.now().toString() + i,
          question: c.question,
          score: c.score,
        }))
        setEvaluationCriteria((prev) => [...prev, ...newEvaluationCriteria])
        setShowTemplatesModal(false)
        setSelectedTemplate(null)
        setTemplateSearchQuery("")
        setExpandedTemplate(null)
      }
    }
  }

  const handleSelectCommercialTemplate = () => {
    if (selectedCommercialTemplate) {
      const template = templates.find((t) => t.id === selectedCommercialTemplate)
      if (template) {
        const newEvaluationCriteria = template.criteria.map((c, i) => ({
          id: Date.now().toString() + i,
          question: c.question,
          score: c.score,
        }))
        setCommercialEvaluationCriteria((prev) => [...prev, ...newEvaluationCriteria])
        setShowCommercialTemplatesModal(false)
        setSelectedCommercialTemplate(null)
        setCommercialTemplateSearchQuery("")
        setExpandedCommercialTemplate(null)
      }
    }
  }

  const filteredTemplates = templates.filter((t) => t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()))
  const filteredCommercialTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(commercialTemplateSearchQuery.toLowerCase()),
  )

  const filteredMembers = availableMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* Full width header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <i className="ri-arrow-left-line text-lg"></i>
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Create Committe</h1>
          {status === "view" && (
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
              Submitted (Read-only)
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <div
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                saveMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {saveMessage.text}
            </div>
          )}
          <button
            onClick={handleSaveAsDraft}
            disabled={status === "view" || isSaving}
            className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-save-2-line text-base"></i>
            {isSaving ? "Saving..." : "Save As Draft"}
          </button>
          <button
            onClick={() => {
              // </CHANGE> Save button now calls handleSubmit directly without showing dialog
              if (status === "view") {
                setSaveMessage({ type: "error", text: "Already submitted" })
                return
              }
              handleSubmit()
            }}
            disabled={status === "view" || isSaving}
            className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-check-double-fill text-base"></i>
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white rounded-lg flex-shrink-0 h-full overflow-hidden flex flex-col ml-4 mt-4 transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-[281px]"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {!isSidebarCollapsed && <h3 className="text-sm font-normal text-[#45546E]">Sections</h3>}
            <button onClick={toggleSidebar} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <i className={`ri-menu-${isSidebarCollapsed ? "unfold" : "fold"}-line text-lg text-gray-600`}></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full px-6 py-3 text-left text-sm flex items-center gap-3 transition-colors relative hover:bg-gray-50 ${
                  activeSection === section.id ? "text-[#1B733D] font-medium bg-gray-50" : "text-[#45546E] font-normal"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                    activeSection === section.id ? "bg-[#1B733D]" : "bg-transparent"
                  }`}
                />
                <i className={`${section.icon} text-lg`}></i>
                {!isSidebarCollapsed && <span>{section.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "ml-4" : "ml-4"
          } mt-4`}
        >
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-4 pb-6">
              {/* RFP Details Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["rfp-details"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Leadership Development Training Program</h2>
                  <button
                    onClick={() => toggleSection("rfp-details")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["rfp-details"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["rfp-details"] && (
                  <>
                    <div className="inline-flex items-center px-3 py-1 rounded-md bg-[#FF8D2808] text-[#FF8D28] text-xs font-medium mb-6">
                      Awaiting committee allocation
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">RFP ID</p>
                        <p className="text-sm font-medium text-gray-900">RFP2131424</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">PR Reference</p>
                        <p className="text-sm font-medium text-gray-900">RFP24252</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bid closing date/time</p>
                        <p className="text-sm font-medium text-gray-900">29th Oct 2025, 5:00 PM</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Number of technical bids submitted</p>
                        <p className="text-sm font-medium text-gray-900">
                          {rfpDetails.technical_bids_count}/5 Suppliers submitted
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Number of commercial bids submitted</p>
                        <p className="text-sm font-medium text-gray-900">
                          {rfpDetails.commercial_bids_count}/5 Suppliers submitted
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bid type</p>
                        <p className="text-sm font-medium text-gray-900">{rfpDetails.bid_type}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Vendors Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["vendors"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Vendor overview</h3>
                  <button
                    onClick={() => toggleSection("vendors")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i
                      className={`ri-arrow-${collapsedSections["vendors"] ? "down" : "up"}-s-line text-xl transition-transform`}
                    ></i>
                  </button>
                </div>

                {!collapsedSections["vendors"] && (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invited vendors</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CR number</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Proposed value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {[
                          {
                            name: "O Vendor",
                            location: "London",
                            rating: 4,
                            cr: "CR1234567890",
                            status: "Submitted",
                            value: "21,456",
                            color: "blue",
                          },
                          {
                            name: "Voo Supplier",
                            location: "New York",
                            rating: 5,
                            cr: "CR0987654321",
                            status: "Not submitted",
                            value: "35,789",
                            color: "purple",
                          },
                          {
                            name: "H Distributor",
                            location: "Tokyo",
                            rating: 3,
                            cr: "CR1122334455",
                            status: "Submitted",
                            value: "58,541",
                            color: "teal",
                          },
                          {
                            name: "V Manufacturer",
                            location: "Berlin",
                            rating: 0,
                            cr: "CR5566778899",
                            status: "Submitted",
                            value: "72,650",
                            color: "gray",
                            isNew: true,
                          },
                          {
                            name: "AV Retailer",
                            location: "Toronto",
                            rating: 4,
                            cr: "CR9988776655",
                            status: "Submitted",
                            value: "45,300",
                            color: "indigo",
                          },
                        ].map((vendor, idx) => (
                          <tr key={idx} className="border-b border-gray-200 last:border-0">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 bg-${vendor.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
                                >
                                  <span className={`text-xs font-medium text-${vendor.color}-600`}>
                                    {vendor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                                  <p className="text-xs text-gray-500">{vendor.location}</p>
                                  {vendor.isNew && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {vendor.rating > 0 ? (
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`${i < vendor.rating ? "ri-star-fill text-orange-400" : "ri-star-line text-gray-300"} text-sm`}
                                    ></i>
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No ratings available</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{vendor.cr}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  vendor.status === "Submitted"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {vendor.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{vendor.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Technical Committee Members Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["technical-committee"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1B733D]">Technical Committee members</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAddMembers("technical")}
                      disabled={status === "view"}
                      className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-add-circle-line text-base"></i>
                      Add members
                    </button>
                    <button
                      onClick={() => handleViewProposedMembers("technical")}
                      disabled={status === "view"}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      View proposed members
                    </button>
                    <button
                      onClick={() => toggleSection("technical-committee")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["technical-committee"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["technical-committee"] && (
                  <>
                    {technicalMembers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 mb-4 relative">
                          <i className="ri-clipboard-line text-6xl text-gray-300"></i>
                        </div>
                        <p className="text-sm text-gray-500">No data found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {technicalMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-blue-600">{member.initials}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.role}</p>
                              </div>
                            </div>
                            {status === "edit" && (
                              <button
                                onClick={() => handleRemoveMember(member.id, "technical")}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <i className="ri-delete-bin-line text-lg"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Commercial Committee Members Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["commercial-committee"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1B733D]">Commercial Committee members</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAddMembers("commercial")}
                      disabled={status === "view"}
                      className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-add-circle-line text-base"></i>
                      Add members
                    </button>
                    <button
                      onClick={() => handleViewProposedMembers("commercial")}
                      disabled={status === "view"}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      View proposed members
                    </button>
                    <button
                      onClick={() => toggleSection("commercial-committee")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["commercial-committee"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["commercial-committee"] && (
                  <div className="max-h-[400px] overflow-y-auto">
                    {commercialMembers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 mb-4 relative">
                          <i className="ri-clipboard-line text-6xl text-gray-300"></i>
                        </div>
                        <p className="text-sm text-gray-500">No data found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {commercialMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1B733D] hover:bg-gray-50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-blue-600">{member.initials}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.role}</p>
                              </div>
                            </div>
                            {status === "edit" && (
                              <button
                                onClick={() => handleRemoveMember(member.id, "commercial")}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <i className="ri-delete-bin-line text-lg"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Technical Evaluation Criteria Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["technical-evaluation"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1B733D]">Technical evaluation criteria</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (status === "view") {
                          setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
                          return
                        }
                        setShowAddEvaluationModal(true)
                      }}
                      disabled={status === "view"}
                      className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-add-line text-base"></i>
                      Add manually
                    </button>
                    <button
                      onClick={() => {
                        if (status === "view") {
                          setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
                          return
                        }
                        setShowTemplatesModal(true)
                      }}
                      disabled={status === "view"}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-upload-2-line text-base"></i>
                      Import from template
                    </button>
                    <button
                      onClick={() => toggleSection("technical-evaluation")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["technical-evaluation"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["technical-evaluation"] && (
                  <>
                    {evaluationCriteria.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 mb-4 relative">
                          <i className="ri-clipboard-line text-6xl text-gray-300"></i>
                        </div>
                        <p className="text-sm text-gray-500">No data found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#1B733D]">
                              <th className="px-4 py-3 text-left text-sm font-bold text-white w-16">No.</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-white">Evaluation criteria</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-white w-24">Score</th>
                              {status === "edit" && (
                                <th className="px-4 py-3 text-center text-sm font-bold text-white w-16"></th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {evaluationCriteria.map((criteria, index) => (
                              <tr key={criteria.id} className="border-b border-gray-200 last:border-0">
                                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{criteria.question}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{criteria.score}</td>
                                {status === "edit" && (
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() => handleRemoveEvaluationCriteria(criteria.id)}
                                      className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Commercial Evaluation Criteria Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["commercial-evaluation"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1B733D]">Commercial evaluation criteria</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (status === "view") {
                          setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
                          return
                        }
                        setShowAddCommercialEvaluationModal(true)
                      }}
                      disabled={status === "view"}
                      className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-add-line text-base"></i>
                      Add manually
                    </button>
                    <button
                      onClick={() => {
                        if (status === "view") {
                          setSaveMessage({ type: "error", text: "Cannot edit a submitted committee assignment" })
                          return
                        }
                        setShowCommercialTemplatesModal(true)
                      }}
                      disabled={status === "view"}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-upload-2-line text-base"></i>
                      Import from template
                    </button>
                    <button
                      onClick={() => toggleSection("commercial-evaluation")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["commercial-evaluation"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["commercial-evaluation"] && (
                  <>
                    {commercialEvaluationCriteria.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 mb-4 relative">
                          <i className="ri-clipboard-line text-6xl text-gray-300"></i>
                        </div>
                        <p className="text-sm text-gray-500">No data found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#1B733D]">
                              <th className="px-4 py-3 text-left text-sm font-bold text-white w-16">No.</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-white">Evaluation criteria</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-white w-24">Score</th>
                              {status === "edit" && (
                                <th className="px-4 py-3 text-center text-sm font-bold text-white w-16"></th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {commercialEvaluationCriteria.map((criteria, index) => (
                              <tr key={criteria.id} className="border-b border-gray-200 last:border-0">
                                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{criteria.question}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{criteria.score}</td>
                                {status === "edit" && (
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() => handleRemoveCommercialEvaluationCriteria(criteria.id)}
                                      className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Attachments Section */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["attachments"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[#1B733D]">Supporting documents (1)</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1">
                      <i className="ri-download-2-line text-sm"></i>
                      Download All
                    </button>
                    <button
                      onClick={() => toggleSection("attachments")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i
                        className={`ri-arrow-${collapsedSections["attachments"] ? "down" : "up"}-s-line text-xl transition-transform`}
                      ></i>
                    </button>
                  </div>
                </div>

                {!collapsedSections["attachments"] && (
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#1B733D]">
                            <th className="px-4 py-3 text-left text-sm font-bold text-white">Attachment</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-white">Uploaded by</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-white">Uploaded date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                  <i className="ri-file-pdf-line text-red-600 text-lg"></i>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Technical requirement</p>
                                  <p className="text-xs text-gray-500">4.5kb</p>
                                </div>
                                <button className="ml-auto text-gray-500 hover:text-[#1B733D] transition-colors">
                                  <i className="ri-download-2-line text-lg"></i>
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">Mohammed Zubair</td>
                            <td className="px-4 py-3 text-sm text-gray-900">02-Aug-2022</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All modal components */}
      {showSearchMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Search and add {currentCommitteeType} member</h2>
              <button
                onClick={() => setShowSearchMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-4">Kindly search by member name and designation</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search by member name and designation"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                />
                <button className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedMembers.length === filteredMembers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers(filteredMembers.map((m) => m.id))
                          } else {
                            setSelectedMembers([])
                          }
                        }}
                      />
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Member</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                      Number of Technical evaluation done
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300"
                          checked={selectedMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers((prev) => [...prev, member.id])
                            } else {
                              setSelectedMembers((prev) => prev.filter((id) => id !== member.id))
                            }
                          }}
                        />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">{member.initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{member.evaluationsDone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowSearchMemberModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelectedMembers}
                disabled={selectedMembers.length === 0}
                className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add selected members
              </button>
            </div>
          </div>
        </div>
      )}

      {showProposedMembersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Proposed members (05)</h2>
                <p className="text-sm text-gray-500 mt-1">Based on past RFP experiences.</p>
              </div>
              <button
                onClick={() => setShowProposedMembersModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedMembers.length === availableMembers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers(availableMembers.map((m) => m.id))
                          } else {
                            setSelectedMembers([])
                          }
                        }}
                      />
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Member</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                      Number of Technical evaluation done
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {availableMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300"
                          checked={selectedMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers((prev) => [...prev, member.id])
                            } else {
                              setSelectedMembers((prev) => prev.filter((id) => id !== member.id))
                            }
                          }}
                        />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">{member.initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{member.evaluationsDone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowProposedMembersModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelectedMembers}
                disabled={selectedMembers.length === 0}
                className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add selected members
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEvaluationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add technical evaluation</h2>
              <button
                onClick={() => setShowAddEvaluationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create new criteria</h3>
              <div className="space-y-4">
                {newCriteria.map((criteria, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Type Here"
                        value={criteria.question}
                        onChange={(e) => {
                          const updated = [...newCriteria]
                          updated[index].question = e.target.value
                          setNewCriteria(updated)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Type Here"
                        value={criteria.score}
                        onChange={(e) => {
                          const updated = [...newCriteria]
                          updated[index].score = e.target.value
                          setNewCriteria(updated)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                      />
                    </div>
                    {newCriteria.length > 1 && (
                      <button
                        onClick={() => handleRemoveCriteriaRow(index)}
                        className="mt-8 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddCriteriaRow}
                className="mt-6 px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line text-base"></i>
                Add New Item
              </button>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddEvaluationModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <i className="ri-close-circle-line text-base"></i>
                Cancel
              </button>
              <button
                onClick={handleSaveCriteria}
                className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <i className="ri-check-line text-base"></i>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCommercialEvaluationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add commercial evaluation</h2>
              <button
                onClick={() => setShowAddCommercialEvaluationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create new criteria</h3>
              <div className="space-y-4">
                {newCommercialCriteria.map((criteria, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Type Here"
                        value={criteria.question}
                        onChange={(e) => {
                          const updated = [...newCommercialCriteria]
                          updated[index].question = e.target.value
                          setNewCommercialCriteria(updated)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Type Here"
                        value={criteria.score}
                        onChange={(e) => {
                          const updated = [...newCommercialCriteria]
                          updated[index].score = e.target.value
                          setNewCommercialCriteria(updated)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                      />
                    </div>
                    {newCommercialCriteria.length > 1 && (
                      <button
                        onClick={() => handleRemoveCommercialCriteriaRow(index)}
                        className="mt-8 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddCommercialCriteriaRow}
                className="mt-6 px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line text-base"></i>
                Add New Item
              </button>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddCommercialEvaluationModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <i className="ri-close-circle-line text-base"></i>
                Cancel
              </button>
              <button
                onClick={handleSaveCommercialCriteria}
                className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <i className="ri-check-line text-base"></i>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Technical evaluation templates</h2>
                <p className="text-sm text-gray-500 mt-1">You can select one & modify</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search"
                    value={templateSearchQuery}
                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={handleSelectTemplate}
                  disabled={!selectedTemplate}
                  className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add selected template
                </button>
                <button
                  onClick={() => {
                    setShowTemplatesModal(false)
                    setSelectedTemplate(null)
                    setTemplateSearchQuery("")
                    setExpandedTemplate(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-gray-500">No templates found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 transition-all ${
                        selectedTemplate === template.id
                          ? "border-[#1B733D] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{template.marks} Marks</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                          <span>CRITERIA</span>
                          <span>SCORE</span>
                        </div>
                        <div className="space-y-2">
                          {(expandedTemplate === template.id ? template.criteria : template.criteria.slice(0, 3)).map(
                            (criteria, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <i className="ri-draggable text-gray-400"></i>
                                <span className="flex-1 text-gray-700 line-clamp-1">{criteria.question}</span>
                                <span className="text-gray-900 font-medium">{criteria.score}</span>
                              </div>
                            ),
                          )}
                        </div>
                        {template.criteria.length > 3 && (
                          <button
                            onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                            className="text-xs text-[#1B733D] mt-2 hover:underline"
                          >
                            {expandedTemplate === template.id ? "View Less" : "View All"}
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedTemplate === template.id
                            ? "bg-[#1B733D] text-white hover:bg-[#155a30]"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {selectedTemplate === template.id ? "Selected" : "Select"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCommercialTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Commercial evaluation templates</h2>
                <p className="text-sm text-gray-500 mt-1">You can select one & modify</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search"
                    value={commercialTemplateSearchQuery}
                    onChange={(e) => setCommercialTemplateSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={handleSelectCommercialTemplate}
                  disabled={!selectedCommercialTemplate}
                  className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add selected template
                </button>
                <button
                  onClick={() => {
                    setShowCommercialTemplatesModal(false)
                    setSelectedCommercialTemplate(null)
                    setCommercialTemplateSearchQuery("")
                    setExpandedCommercialTemplate(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredCommercialTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-gray-500">No templates found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {filteredCommercialTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 transition-all ${
                        selectedCommercialTemplate === template.id
                          ? "border-[#1B733D] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{template.marks} Marks</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                          <span>CRITERIA</span>
                          <span>SCORE</span>
                        </div>
                        <div className="space-y-2">
                          {(expandedCommercialTemplate === template.id
                            ? template.criteria
                            : template.criteria.slice(0, 3)
                          ).map((criteria, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <i className="ri-draggable text-gray-400"></i>
                              <span className="flex-1 text-gray-700 line-clamp-1">{criteria.question}</span>
                              <span className="text-gray-900 font-medium">{criteria.score}</span>
                            </div>
                          ))}
                        </div>
                        {template.criteria.length > 3 && (
                          <button
                            onClick={() =>
                              setExpandedCommercialTemplate(
                                expandedCommercialTemplate === template.id ? null : template.id,
                              )
                            }
                            className="text-xs text-[#1B733D] mt-2 hover:underline"
                          >
                            {expandedCommercialTemplate === template.id ? "View Less" : "View All"}
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedCommercialTemplate(template.id)}
                        className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedCommercialTemplate === template.id
                            ? "bg-[#1B733D] text-white hover:bg-[#155a30]"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {selectedCommercialTemplate === template.id ? "Selected" : "Select"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDecisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                Kindly take a decision to proceed
              </h2>

              <div className="space-y-4 mb-8">
                <label
                  className="flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#1B733D] transition-colors"
                  style={{ borderColor: selectedDecision === "technical" ? "#1B733D" : undefined }}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="technical"
                    checked={selectedDecision === "technical"}
                    onChange={(e) => setSelectedDecision(e.target.value)}
                    className="w-5 h-5 mt-1 flex-shrink-0"
                  />
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">Proceed to technical evaluation</p>
                    <p className="text-sm text-gray-500 mt-1">Request will be pushed to technical evaluation</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDecisionModal(false)
                    setSelectedDecision(null)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <i className="ri-close-circle-line text-base"></i>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedDecision || isSaving}
                  className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-check-line text-base"></i>
                  {isSaving ? "Submitting..." : "Complete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
