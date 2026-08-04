"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProcClosureReportAppPageProps {
  onBack: () => void
}

export default function ProcClosureReportAppPage({ onBack }: ProcClosureReportAppPageProps) {
  const [activeSection, setActiveSection] = useState("po-details")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const sections = [
    { id: "po-details", label: "PO details", icon: "ri-file-text-line" },
    { id: "key-objectives", label: "Key objectives", icon: "ri-target-line" },
    { id: "major-deliverables", label: "Major deliverables", icon: "ri-checkbox-circle-line" },
    { id: "stakeholders", label: "Stakeholders", icon: "ri-team-line" },
    { id: "lessons-learned", label: "Lessons learned/ recommended", icon: "ri-lightbulb-line" },
    { id: "financial-summary", label: "Financial summary", icon: "ri-money-dollar-circle-line" },
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const stakeholders = [
    {
      name: "Mohamad Saleem",
      role: "Finance officer",
      initials: "MS",
      color: "bg-blue-500",
    },
    {
      name: "Amina Bashir",
      role: "HR Manager",
      initials: "AB",
      color: "bg-purple-500",
    },
    {
      name: "Mohamad Saleem",
      role: "Finance officer",
      initials: "MS",
      color: "bg-blue-500",
    },
    {
      name: "John Kim",
      role: "Project Lead",
      initials: "JK",
      color: "bg-teal-500",
    },
  ]

  const lessonsLearned = [
    {
      title: "Early Stakeholder Engagement Is Critical",
      description:
        "Involving procurement, finance, and IT teams from the planning phase ensures business requirements are aligned and reduces change requests during later stages.",
    },
    {
      title: "Master Data Quality Impacts System Performance",
      description:
        "Inconsistent or outdated vendor and item master data caused integration issues and delays. Data cleansing must be prioritized before system migration.",
    },
    {
      title: "User Training and Change Management Drive Adoption",
      description:
        "End-user resistance was reduced significantly after targeted training sessions and hands-on workshops. Future rollouts should allocate more time for user onboarding.",
    },
    {
      title: "Integration Testing Requires Cross-Functional Coordination",
      description:
        "Complex integrations between ERP, vendor portals, and payment systems need joint ownership and test planning across departments to avoid post-go-live issues.",
    },
    {
      title: "Clear Communication Channels Prevent Escalations",
      description:
        "Weekly status updates and a single point of contact for issue escalation helped maintain transparency and faster decision-making.",
    },
    {
      title: "Post-Go-Live Support Ensures Smooth Transition",
      description:
        "A dedicated hypercare period and quick-response support team helped resolve initial operational issues and stabilized the system within weeks.",
    },
  ]

  const financialData = [
    {
      category: "Software Licensing / Subscription",
      planned: "120,000",
      actual: "118,500",
      variance: "-1,500",
      remarks: "Minor savings from vendor discount",
    },
    {
      category: "Implementation Services",
      planned: "200,000",
      actual: "205,000",
      variance: "+5,000",
      remarks: "Minor savings from vendor discount",
    },
    {
      category: "Infrastructure & Hosting",
      planned: "80,000",
      actual: "78,000",
      variance: "-2,000",
      remarks: "Minor savings from vendor discount",
    },
    {
      category: "Training & Change Management",
      planned: "25,000",
      actual: "23,500",
      variance: "-1,500",
      remarks: "Minor savings from vendor discount",
    },
    {
      category: "Contingency",
      planned: "15,000",
      actual: "12,000",
      variance: "-3,000",
      remarks: "Minor savings from vendor discount",
    },
    {
      category: "Total",
      planned: "440,000",
      actual: "437,000",
      variance: "-3,000",
      remarks: "Project delivered within budget tolerance",
    },
  ]

  const attachments = [
    {
      name: "Project Governance & Planning documents",
      size: "6.5kb",
      uploader: "Mohammed Zubair",
      date: "02-Aug-2022",
    },
    {
      name: "Technical & Functional documents",
      size: "6.5kb",
      uploader: "Mohammed Zubair",
      date: "02-Aug-2022",
    },
    {
      name: "Financial Documents",
      size: "6.5kb",
      uploader: "Mohammed Zubair",
      date: "02-Aug-2022",
    },
    {
      name: "Change Management & Training",
      size: "6.5kb",
      uploader: "Mohammed Zubair",
      date: "02-Aug-2022",
    },
    {
      name: "Implementation & Go-Live documents",
      size: "6.5kb",
      uploader: "Mohammed Zubair",
      date: "02-Aug-2022",
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <i className="ri-arrow-left-line text-lg"></i>
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Closure report</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 transition-colors flex items-center gap-2">
            <i className="ri-message-2-line text-base"></i>
            Comments
          </button>
          <button className="px-4 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors flex items-center gap-2 shadow-sm">
            <i className="ri-save-line text-base"></i>
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
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
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["po-details"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">PO details</h2>
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PR Number</p>
                    <p className="text-sm font-medium text-gray-900">PR2131424</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-gray-900">Procurement Department</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget code/Cost centre</p>
                    <p className="text-sm font-medium text-gray-900">BUD1751</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="font-medium text-gray-900 text-lg">تطبيق الهاتف المحمول للخدمات الحكومية</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start date</p>
                    <p className="text-sm font-medium text-gray-900">30 Sep 2024</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">End date</p>
                    <p className="text-sm font-medium text-gray-900">29 Sep 2025</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Key objectives */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["key-objectives"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">Key objectives</h2>
                <Textarea placeholder="Type here..." className="min-h-[100px] resize-none" />
              </div>

              {/* Major deliverables */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["major-deliverables"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">Major deliverables</h2>
                <Textarea placeholder="Type here..." className="min-h-[100px] resize-none" />
              </div>

              {/* Stakeholders */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["stakeholders"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">Stakeholders</h2>
                <div className="grid grid-cols-2 gap-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Avatar className={`${stakeholder.color} h-10 w-10`}>
                        <AvatarFallback className="text-white font-medium">{stakeholder.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{stakeholder.name}</p>
                        <p className="text-sm text-gray-500">{stakeholder.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons learned / recommendations */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["lessons-learned"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">Lessons learned / recommendations</h2>
                <div className="space-y-4">
                  {lessonsLearned.map((lesson, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <h3 className="font-medium text-gray-900 mb-2">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["financial-summary"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-4">Financial summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1B733D] text-white">
                        <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Planned Budget (SAR)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actual Cost (SAR)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Variance (SAR)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financialData.map((row, index) => (
                        <tr key={index} className={row.category === "Total" ? "bg-gray-50" : ""}>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.planned}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.actual}</td>
                          <td
                            className={`px-4 py-3 text-sm ${
                              row.variance.startsWith("+") ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {row.variance}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attachments */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["attachments"] = el
                }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1B733D]">Attachments</h2>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Supporting documents (5)</h3>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <i className="ri-download-line" />
                      Download All
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1B733D] text-white">
                        <th className="px-4 py-3 text-left text-sm font-medium">Attachment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Uploaded by</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Uploaded date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attachments.map((attachment, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                <i className="ri-file-pdf-line text-red-600 text-lg" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{attachment.size}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="ml-auto">
                                <i className="ri-download-line" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{attachment.uploader}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{attachment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
