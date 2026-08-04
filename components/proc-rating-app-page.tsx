"use client"

import { useState } from "react"

interface ProcRatingAppPageProps {
  onBack: () => void
}

export default function ProcRatingAppPage({ onBack }: ProcRatingAppPageProps) {
  const [activeSection, setActiveSection] = useState("PO details")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [ratings, setRatings] = useState({
    ontimeDelivery: 0,
    valueForMoney: 0,
    qualityOfService: 0,
    professionalism: 0,
    overallRating: 0,
  })

  const sections = [
    { id: "PO details", label: "PO details" },
    { id: "Service feedback", label: "Service feedback" },
    { id: "Feedback", label: "Feedback" },
  ]

  const ratingCriteria = [
    {
      id: "ontimeDelivery",
      label: "Onetime delivery",
      icon: "ri-time-line",
    },
    {
      id: "valueForMoney",
      label: "Value for money",
      icon: "ri-money-dollar-circle-line",
    },
    {
      id: "qualityOfService",
      label: "Quality of service",
      icon: "ri-team-line",
    },
    {
      id: "professionalism",
      label: "Professionalism",
      icon: "ri-briefcase-line",
    },
    {
      id: "overallRating",
      label: "Overall rating",
      icon: "ri-thumb-up-line",
    },
  ]

  const handleRating = (criteriaId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [criteriaId]: rating }))
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

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
          <h1 className="text-2xl font-semibold text-[#1B733D]">Rating app</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-[#1B733D] text-white rounded-md text-sm font-medium hover:bg-[#155a30] transition-colors shadow-sm">
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sections Sidebar */}
        <div
          className={`bg-white rounded-lg flex-shrink-0 h-full overflow-hidden flex flex-col ml-4 mt-4 transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-[281px]"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {!sidebarCollapsed && <h3 className="text-sm font-normal text-[#45546E]">Sections</h3>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <i className={`ri-menu-${sidebarCollapsed ? "unfold" : "fold"}-line text-lg text-gray-600`}></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full px-6 py-3 text-left text-sm flex items-center gap-3 transition-colors relative hover:bg-gray-50 ${
                  activeSection === section.id ? "text-[#1B733D] font-medium bg-gray-50" : "text-[#45546E] font-normal"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                    activeSection === section.id ? "bg-[#1B733D]" : "bg-transparent"
                  }`}
                />
                {!sidebarCollapsed && <span>{section.label}</span>}
              </button>
            ))}
          </div>

          {/* Rating Illustration */}
          {!sidebarCollapsed && (
            <div className="p-4 flex items-center justify-center border-t border-gray-200">
              <div className="relative">
                <div className="flex items-end gap-1">
                  <i className="ri-star-fill text-4xl text-orange-400" />
                  <i className="ri-star-fill text-3xl text-orange-400" />
                  <i className="ri-star-line text-2xl text-gray-300" />
                </div>
                <div className="mt-2 flex justify-center">
                  <div className="w-12 h-16 bg-gray-300 rounded-t-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
            sidebarCollapsed ? "ml-4" : "ml-4"
          } mt-4`}
        >
          <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4 pb-6">
              {/* PO Details Section */}
              <section id="PO details" className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6">
                <h2 className="text-lg font-semibold text-[#1B733D] mb-6">PO details</h2>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">PO Reference Number</p>
                    <p className="text-sm font-semibold text-gray-900">PO-2025-014</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">PR Reference</p>
                    <p className="text-sm font-semibold text-gray-900">542345</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Supplier</p>
                    <p className="text-sm font-semibold text-gray-900">Kaar Technologies</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                      Completed
                    </span>
                  </div>
                </div>
              </section>

              {/* Service Feedback Section */}
              <section id="Service feedback" className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6">
                <h2 className="text-lg font-semibold text-[#1B733D] mb-6">Service feedback</h2>
                <p className="text-base font-medium text-gray-900 mb-8">
                  How do you rate experience for this purchase ?
                </p>

                <div className="space-y-6">
                  {ratingCriteria.map((criteria) => (
                    <div key={criteria.id} className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <i className={`${criteria.icon} text-3xl text-gray-600`} />
                        </div>
                        <span className="text-base font-normal text-gray-900">{criteria.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(criteria.id, star)}
                            className="transition-colors"
                          >
                            <i
                              className={`ri-star-${
                                ratings[criteria.id as keyof typeof ratings] >= star ? "fill" : "line"
                              } text-3xl ${
                                ratings[criteria.id as keyof typeof ratings] >= star
                                  ? "text-orange-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Feedback Section */}
              <section id="Feedback" className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6">
                <h2 className="text-lg font-semibold text-[#1B733D] mb-6">Feedback</h2>
                <textarea
                  placeholder="Type here..."
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
