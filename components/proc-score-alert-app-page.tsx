"use client"

import { useState, useRef, useEffect } from "react"

interface Props {
  onBack: () => void
}

const SCORE_DATA = {
  vendor: "Kaar Technologies",
  vendorInitials: "KT",
  vendorColor: "#C25B7C",
  currentScore: 58,
  threshold: 70,
  evaluationPeriod: "Q2 2026",
  noticeDate: "10 Jul 2026",
  planDeadline: "24 Jul 2026",
  kpis: [
    { label: "Delivery Timeliness", score: 52, weight: "30%", status: "FAIL" },
    { label: "Quality Compliance",  score: 61, weight: "25%", status: "FAIL" },
    { label: "Invoice Accuracy",    score: 70, weight: "20%", status: "PASS" },
    { label: "Responsiveness",      score: 55, weight: "15%", status: "FAIL" },
    { label: "Documentation",       score: 68, weight: "10%", status: "PASS" },
  ],
}

const PLAN_DATA = {
  submittedOn: "18 Jul 2026",
  reference: "IMP-2026-KT-001",
  rootCause:
    "Supply chain disruptions in Q1 caused cascading delays. Internal logistics team was restructured mid-quarter, impacting delivery coordination.",
  actions: [
    { action: "Appoint dedicated logistics coordinator for this account", targetDate: "01 Aug 2026", owner: "Operations Director" },
    { action: "Implement weekly delivery status reporting to procurement team", targetDate: "05 Aug 2026", owner: "Account Manager" },
    { action: "Quality checkpoint added at dispatch stage", targetDate: "10 Aug 2026", owner: "QA Lead" },
  ],
  targetScore: 75,
  reEvaluationDate: "30 Sep 2026",
}

export default function ProcScoreAlertAppPage({ onBack }: Props) {
  const [activeSection, setActiveSection] = useState("score-summary")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [noticeSent, setNoticeSent] = useState(false)
  const [decision, setDecision] = useState<"" | "accept" | "reject">("")
  const [decisionComment, setDecisionComment] = useState("")
  const [decisionSubmitted, setDecisionSubmitted] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const sections = [
    { id: "score-summary",    label: "Score Summary",       icon: "ri-bar-chart-line" },
    { id: "formal-notice",    label: "Formal Notice",       icon: "ri-notification-3-line" },
    { id: "improvement-plan", label: "Improvement Plan",    icon: "ri-file-text-line" },
    { id: "review-decision",  label: "Review & Decision",   icon: "ri-checkbox-circle-line" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const scrollPosition = contentRef.current.scrollTop + 100
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[sections[i].id]
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }
    const el = contentRef.current
    el?.addEventListener("scroll", handleScroll)
    return () => el?.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id]
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" })
    }
  }

  const scoreColor = SCORE_DATA.currentScore >= SCORE_DATA.threshold ? "#1B733D" : "#DC2626"
  const scorePct = (SCORE_DATA.currentScore / 100) * 100

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">

      {/* HEADER */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#1B733D] text-white flex items-center justify-center hover:bg-[#155a30] transition-colors"
          >
            <i className="ri-arrow-left-line text-lg" />
          </button>
          <h1 className="text-2xl font-semibold text-[#1B733D]">Score Alert App</h1>
          {/* <span className="text-xs text-gray-400 font-normal mt-1">BR-32</span> */}
        </div>
        {/* <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-[#B9C0CA] rounded-md text-sm font-medium text-[#45546E] hover:bg-gray-50 flex items-center gap-2">
            <i className="ri-message-2-line" />
            Comments
          </button>
        </div> */}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex overflow-hidden">

        {/* SIDEBAR */}
        <div className={`bg-white rounded-lg flex-shrink-0 h-full overflow-hidden flex flex-col ml-4 mt-4 transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-[260px]"}`}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {!isSidebarCollapsed && <h3 className="text-sm font-normal text-[#45546E]">Sections</h3>}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1 hover:bg-gray-100 rounded">
              <i className={`ri-menu-${isSidebarCollapsed ? "unfold" : "fold"}-line text-lg text-gray-600`} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full px-6 py-3 text-left text-sm flex items-center gap-3 transition-colors relative hover:bg-gray-50 ${activeSection === s.id ? "text-[#1B733D] font-medium bg-gray-50" : "text-[#45546E]"} ${isSidebarCollapsed ? "justify-center" : ""}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeSection === s.id ? "bg-[#1B733D]" : "bg-transparent"}`} />
                <i className={`${s.icon} text-lg`} />
                {!isSidebarCollapsed && <span>{s.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col h-full overflow-hidden ml-4 mt-4">
          <div ref={contentRef} className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-4 pb-6">

              {/* ── SCORE SUMMARY ── */}
              <div
                ref={(el) => { if (el) sectionRefs.current["score-summary"] = el }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-1">Score Summary</h2>
                <p className="text-sm text-gray-500 mb-6">Vendor performance score for {SCORE_DATA.evaluationPeriod}</p>

                {/* vendor + score */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ backgroundColor: SCORE_DATA.vendorColor }}>
                    {SCORE_DATA.vendorInitials}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{SCORE_DATA.vendor}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Evaluation Period: {SCORE_DATA.evaluationPeriod}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500 mb-1">Current Score</p>
                    <p className="text-4xl font-bold" style={{ color: scoreColor }}>{SCORE_DATA.currentScore}</p>
                    <p className="text-xs text-gray-400">Threshold: {SCORE_DATA.threshold}</p>
                  </div>
                </div>

                {/* score bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0</span><span>Threshold ({SCORE_DATA.threshold})</span><span>100</span>
                  </div>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all" style={{ width: `${scorePct}%` }} />
                    <div className="absolute top-0 h-full w-0.5 bg-orange-400" style={{ left: `${SCORE_DATA.threshold}%` }} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      Below Threshold
                    </span>
                    <span className="text-xs text-gray-500">Score is {SCORE_DATA.threshold - SCORE_DATA.currentScore} points below the minimum acceptable threshold</span>
                  </div>
                </div>

                {/* KPI table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#1B733D] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold">KPI</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold">Weight</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold">Score</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCORE_DATA.kpis.map((kpi, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-900">{kpi.label}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{kpi.weight}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-bold ${kpi.status === "PASS" ? "text-[#1B733D]" : "text-red-600"}`}>{kpi.score}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${kpi.status === "PASS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {kpi.status === "PASS" ? "✓" : "✗"} {kpi.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── FORMAL NOTICE ── */}
              <div
                ref={(el) => { if (el) sectionRefs.current["formal-notice"] = el }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-1">Formal Notice</h2>
                <p className="text-sm text-gray-500 mb-6">System-generated notice to be sent </p>

                {/* notice preview */}
                <div className="border border-gray-200 rounded-xl p-5 mb-5 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notice Preview</p>
                    {noticeSent && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <i className="ri-checkbox-circle-line" /> Sent on {SCORE_DATA.noticeDate}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700 leading-6">
                    <p><span className="font-semibold">To:</span> {SCORE_DATA.vendor}</p>
                    <p><span className="font-semibold">Subject:</span> Vendor Performance Score Below Acceptable Threshold — Action Required</p>
                    <p className="mt-3">
                      Your vendor performance score for <span className="font-semibold">{SCORE_DATA.evaluationPeriod}</span> has been recorded at <span className="font-semibold text-red-600">{SCORE_DATA.currentScore}</span>, which is below the minimum acceptable threshold of <span className="font-semibold">{SCORE_DATA.threshold}</span> as defined by procurement policy .
                    </p>
                    <p>
                      Per policy, no action will be taken against your account before you have been given the opportunity to submit a formal Improvement Plan. You are required to submit your plan through the supplier portal by <span className="font-semibold">{SCORE_DATA.planDeadline}</span>.
                    </p>
                    <p>Failure to submit within the deadline may result in further review by the procurement committee.</p>
                  </div>
                </div>

                {!noticeSent ? (
                  <button
                    onClick={() => setNoticeSent(true)}
                    className="px-5 py-2.5 bg-[#1B733D] text-white rounded-lg text-sm font-semibold hover:bg-[#155a30] flex items-center gap-2"
                  >
                    <i className="ri-send-plane-line" />
                    Send Formal Notice to Vendor
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <i className="ri-checkbox-circle-fill text-lg" />
                    Notice sent successfully. Vendor has been notified via the supplier portal.
                  </div>
                )}
              </div>

              {/* ── IMPROVEMENT PLAN ── */}
              <div
                ref={(el) => { if (el) sectionRefs.current["improvement-plan"] = el }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-1">Improvement Plan</h2>
                <p className="text-sm text-gray-500 mb-6">Submitted by the vendor through the supplier portal</p>

                {/* submission meta */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                    <p className="text-sm font-semibold text-gray-900">{PLAN_DATA.submittedOn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reference</p>
                    <p className="text-sm font-semibold text-[#1B733D]">{PLAN_DATA.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Target Re-evaluation</p>
                    <p className="text-sm font-semibold text-gray-900">{PLAN_DATA.reEvaluationDate}</p>
                  </div>
                </div>

                {/* root cause */}
                <div className="border border-gray-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Root Cause Analysis</p>
                  <p className="text-sm text-gray-700 leading-6">{PLAN_DATA.rootCause}</p>
                </div>

                {/* action items */}
                <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">Corrective Action Items</p>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Target Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PLAN_DATA.actions.map((a, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-700">{a.action}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{a.owner}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{a.targetDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                  <i className="ri-information-line text-blue-500" />
                  <p className="text-sm text-blue-700">
                    Vendor commits to reaching a score of <span className="font-semibold">{PLAN_DATA.targetScore}</span> by the re-evaluation date of <span className="font-semibold">{PLAN_DATA.reEvaluationDate}</span>.
                  </p>
                </div>
              </div>

              {/* ── REVIEW & DECISION ── */}
              <div
                ref={(el) => { if (el) sectionRefs.current["review-decision"] = el }}
                className="bg-white rounded-lg shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#1B733D] mb-1">Review & Decision</h2>
                <p className="text-sm text-gray-500 mb-6">Accept or reject the vendor's improvement plan</p>

                {!decisionSubmitted ? (
                  <div className="space-y-5">
                    {/* decision options */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setDecision("accept")}
                        className={`border-2 rounded-xl p-4 text-left transition-all ${decision === "accept" ? "border-[#1B733D] bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${decision === "accept" ? "bg-[#1B733D] text-white" : "bg-gray-100 text-gray-400"}`}>
                            <i className="ri-check-line" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Accept Plan</p>
                        </div>
                        <p className="text-xs text-gray-500">The improvement plan is satisfactory. Vendor will be re-evaluated on the target date.</p>
                      </button>

                      <button
                        onClick={() => setDecision("reject")}
                        className={`border-2 rounded-xl p-4 text-left transition-all ${decision === "reject" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${decision === "reject" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                            <i className="ri-close-line" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Reject Plan</p>
                        </div>
                        <p className="text-xs text-gray-500">The plan is insufficient. Vendor will be escalated to the procurement committee.</p>
                      </button>
                    </div>

                    {/* re-evaluation date */}
                    {decision === "accept" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Re-evaluation Date</label>
                        <input
                          type="date"
                          defaultValue="2026-09-30"
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B733D]"
                        />
                      </div>
                    )}

                    {/* comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Comments</label>
                      <textarea
                        rows={4}
                        value={decisionComment}
                        onChange={(e) => setDecisionComment(e.target.value)}
                        placeholder="Add your review comments..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-[#1B733D]"
                      />
                    </div>

                    <button
                      disabled={!decision || !decisionComment.trim()}
                      onClick={() => setDecisionSubmitted(true)}
                      className="px-5 py-2.5 bg-[#1B733D] text-white rounded-lg text-sm font-semibold hover:bg-[#155a30] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <i className="ri-save-line" />
                      Submit Decision
                    </button>
                  </div>
                ) : (
                  <div className={`rounded-xl border p-5 flex items-start gap-4 ${decision === "accept" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                    <i className={`text-2xl mt-0.5 ${decision === "accept" ? "ri-checkbox-circle-fill text-green-600" : "ri-close-circle-fill text-red-600"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${decision === "accept" ? "text-green-700" : "text-red-700"}`}>
                        {decision === "accept" ? "Improvement Plan Accepted" : "Improvement Plan Rejected"}
                      </p>
                      <p className={`text-sm mt-1 ${decision === "accept" ? "text-green-600" : "text-red-600"}`}>
                        {decision === "accept"
                          ? `Vendor will be re-evaluated on ${PLAN_DATA.reEvaluationDate}. They have been notified via the supplier portal.`
                          : "The case has been escalated to the procurement committee. Vendor has been notified."}
                      </p>
                      {decisionComment && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{decisionComment}"</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
