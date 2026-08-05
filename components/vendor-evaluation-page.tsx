"use client"

import { useState, useMemo } from "react"
import {
  ChevronLeft,
  ShieldCheck,
  Building2,
  Award,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  FileText,
  DollarSign,
  Briefcase,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { allVendorsList, calculateVendorScores, type VendorData } from "@/lib/vendor-data"

interface VendorEvaluationPageProps {
  onBack: () => void
  evaluationType?: "technical" | "commercial"
}

export default function VendorEvaluationPage({ onBack }: VendorEvaluationPageProps) {
  const [selectedVendorKey, setSelectedVendorKey] = useState<string>("palm_tree")
  const [customTechScore, setCustomTechScore] = useState<number | null>(null)
  const [isAiEvaluating, setIsAiEvaluating] = useState<boolean>(false)
  const [aiReportGenerated, setAiReportGenerated] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"scorecard" | "ongoing" | "history" | "compliance" | "financial" | "risk">("scorecard")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false)
  const [uploadedDocName, setUploadedDocName] = useState<string>("")
  const [docSimulating, setDocSimulating] = useState<boolean>(false)
  const [customDocsState, setCustomDocsState] = useState<Record<string, Record<string, boolean>>>({})

  const vendorData: VendorData = useMemo(() => {
    const base = allVendorsList[selectedVendorKey] || allVendorsList["palm_tree"]
    if (customDocsState[selectedVendorKey]) {
      return {
        ...base,
        documents: {
          ...base.documents,
          ...customDocsState[selectedVendorKey],
        },
      }
    }
    return base
  }, [selectedVendorKey, customDocsState])

  const techScoreToUse = customTechScore !== null ? customTechScore : vendorData.technical_proposal.manual_score

  const scores = useMemo(() => {
    return calculateVendorScores(vendorData, techScoreToUse)
  }, [vendorData, techScoreToUse])

  const handleVendorSelect = (key: string) => {
    setSelectedVendorKey(key)
    setCustomTechScore(null)
    setAiReportGenerated(false)
  }

  const handleManualScoreChange = (val: number) => {
    const clamped = Math.max(0, Math.min(40, val))
    setCustomTechScore(clamped)
  }

  const handleRunAiEvaluation = () => {
    setIsAiEvaluating(true)
    setTimeout(() => {
      setIsAiEvaluating(false)
      setAiReportGenerated(true)
    }, 1800)
  }

  const handleSimulateUpload = () => {
    if (!uploadedDocName.trim()) return
    setDocSimulating(true)
    setTimeout(() => {
      setDocSimulating(false)
      setUploadModalOpen(false)
      setCustomDocsState((prev) => ({
        ...prev,
        [selectedVendorKey]: {
          ...(prev[selectedVendorKey] || {}),
          iso27001: true,
        },
      }))
      setUploadedDocName("")
    }, 1500)
  }

  const formatSAR = (num: number) => {
    if (num >= 1_000_000_000) {
      return `SAR ${(num / 1_000_000_000).toFixed(2)}B`
    }
    if (num >= 1_000_000) {
      return `SAR ${(num / 1_000_000).toFixed(2)}M`
    }
    return `SAR ${num.toLocaleString()}`
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Strategic":
        return "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-amber-500/20"
      case "Preferred":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      case "Conditional":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40"
      default:
        return "bg-red-500/20 text-red-300 border-red-500/40"
    }
  }

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "Strategic":
        return {
          label: "STRATEGIC PARTNER",
          bg: "bg-amber-500/10 border-amber-500/40 text-amber-300",
          icon: <Award className="w-4 h-4 text-amber-400" />,
        }
      case "Preferred":
        return {
          label: "PREFERRED VENDOR",
          bg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        }
      case "Conditional":
        return {
          label: "CONDITIONAL APPROVAL",
          bg: "bg-yellow-500/10 border-yellow-500/40 text-yellow-300",
          icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
        }
      default:
        return {
          label: "WATCHLIST / REVIEW",
          bg: "bg-red-500/10 border-red-500/40 text-red-300",
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
        }
    }
  }

  const vendorListKeys = Object.keys(allVendorsList).filter((k) =>
    allVendorsList[k].vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const recBadge = getRecommendationBadge(scores.recommendation)

  return (
    <div className="w-full min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0C1220]/90 backdrop-blur-md border-b border-amber-500/20 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-all text-xs font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Inbox
          </button>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-500/30">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">{vendorData.vendor_name}</h1>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${getTierColor(vendorData.tier)}`}>
                  {vendorData.tier} Tier
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Vendor ID: {vendorData.vendor_id}</span>
                <span>•</span>
                <span>CR: {vendorData.basic_information.cr_number}</span>
                <span>•</span>
                <span>{vendorData.basic_information.location}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold ${recBadge.bg}`}>
            {recBadge.icon}
            <span>{recBadge.label}</span>
          </div>

          <button
            onClick={handleRunAiEvaluation}
            disabled={isAiEvaluating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAiEvaluating ? "animate-spin" : ""}`} />
            {isAiEvaluating ? "Analyzing Docs with Gemini 2.5..." : "Re-evaluate with Gemini AI"}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Vendor Selector */}
        <aside className="w-80 border-r border-slate-800 bg-[#0C1220]/60 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-800/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2">Select Vendor</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {vendorListKeys.map((key) => {
              const item = allVendorsList[key]
              const isSelected = key === selectedVendorKey
              const vScores = calculateVendorScores(item)

              return (
                <button
                  key={key}
                  onClick={() => handleVendorSelect(key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500/10 via-slate-800 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5"
                      : "bg-slate-900/40 hover:bg-slate-800/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-yellow-600" />
                  )}
                  <div className="flex items-start justify-between mb-1 pl-1">
                    <span className={`font-semibold text-xs ${isSelected ? "text-amber-300" : "text-slate-200"}`}>
                      {item.vendor_name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-400/90">
                      {vScores.totalScore}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pl-1">
                    <span>{item.tier}</span>
                    <span>{item.delivery_performance.delivery_compliance}% On-time</span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Center/Right Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Section: Circular Score + Executive Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Circular Score & Score Breakdown Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#111A2E] to-[#0D1424] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">SAP Ariba Scorecard</h2>
                  <p className="text-lg font-bold text-white">Overall Vendor Rating</p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                  {scores.recommendation.toUpperCase()} TIER
                </div>
              </div>

              {/* Circular Meter SVG */}
              <div className="flex items-center justify-center my-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="url(#goldGradient)"
                      strokeWidth="8"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * scores.totalScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">
                      {scores.totalScore}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Out of 100</span>
                    <span className="mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Weighted Total
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-center">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Technical</p>
                  <p className="text-xs font-bold font-mono text-amber-400">{scores.techScore.obtained}/40</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Delivery</p>
                  <p className="text-xs font-bold font-mono text-emerald-400">{scores.deliveryScore.obtained}/10</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Compliance</p>
                  <p className="text-xs font-bold font-mono text-cyan-400">{scores.complianceScore.obtained}/10</p>
                </div>
              </div>
            </div>

            {/* Overall AI Summary Paragraph */}
            <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Overall AI Summary (Gemini 2.5 Flash)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Live AI Evaluation</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs leading-relaxed text-slate-300 space-y-3">
                  <p>
                    <strong className="text-white">{vendorData.vendor_name}</strong> is currently categorized as a{" "}
                    <span className="text-amber-300 font-semibold">{scores.recommendation} Supplier</span> with an overall evaluated score of{" "}
                    <span className="font-mono font-bold text-amber-400">{scores.totalScore}/100</span>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                      <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Strengths
                      </p>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        <li>High delivery compliance ({vendorData.delivery_performance.delivery_compliance}%)</li>
                        <li>Financial Health Score: {vendorData.financial.financial_health_score}/100</li>
                        <li>Technical Proposal score: {scores.techScore.obtained}/40</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                      <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Areas & Risks
                      </p>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        <li>Avg Delay: {vendorData.delivery_performance.average_delay_days} days</li>
                        <li>Delivery Risk: {vendorData.risk.delivery_risk}</li>
                        <li>ISO 27001 Status: {vendorData.documents.iso27001 ? "Verified" : "Missing/Pending"}</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 italic">
                    <strong className="text-amber-400">AI Recommendation:</strong> Proceed with contract award under {scores.recommendation} governance framework. Maintain quarterly SLA audits.
                  </p>
                </div>
              </div>

              {/* Vendor Info Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total PR Value</span>
                  <span className="font-mono font-bold text-amber-400">{formatSAR(vendorData.summary.total_pr_value)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Purchase Orders</span>
                  <span className="font-semibold text-white">{vendorData.summary.total_purchase_orders} Total ({vendorData.summary.total_ongoing_purchase_orders} Ongoing)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Years Experience</span>
                  <span className="font-semibold text-white">{vendorData.summary.years_experience} Years</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Completed Projects</span>
                  <span className="font-semibold text-white">{vendorData.summary.completed_projects} Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Scorecard (Weighted Parameters Progress Bars) */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  Performance Scorecard & Weighted Parameter Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Calculated against the 7 Enterprise Procurement evaluation criteria (Total 100%).
                </p>
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <span className="text-xs font-semibold text-slate-300">Technical Proposal Manual Score:</span>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={techScoreToUse}
                  onChange={(e) => handleManualScoreChange(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded bg-slate-950 border border-amber-500/50 font-mono text-center text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-500">/ 40</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Parameter 1: Technical Proposal */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">1. Technical Proposal</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                      Weight: 40%
                    </span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-amber-400">{scores.techScore.obtained}</span> / {scores.techScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.techScore.obtained / scores.techScore.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Parameter 2: Past Project Experience */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">2. Past Project Experience</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
                      Weight: 15%
                    </span>
                    <span className="text-[10px] text-slate-400">({vendorData.summary.years_experience} yrs, {vendorData.summary.completed_projects} completed)</span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-blue-400">{scores.pastExperienceScore.obtained}</span> / {scores.pastExperienceScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.pastExperienceScore.obtained / scores.pastExperienceScore.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Parameter 3: On-Time Delivery */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">3. On-Time Delivery Performance</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Weight: 10%
                    </span>
                    <span className="text-[10px] text-slate-400">({vendorData.delivery_performance.delivery_compliance}% compliance)</span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-emerald-400">{scores.deliveryScore.obtained}</span> / {scores.deliveryScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.deliveryScore.obtained / scores.deliveryScore.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Parameter 4: Compliance Documents */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">4. Compliance Documents</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                      Weight: 10%
                    </span>
                    <span className="text-[10px] text-slate-400">({scores.validDocsCount}/{scores.totalDocs} Verified)</span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-cyan-400">{scores.complianceScore.obtained}</span> / {scores.complianceScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.complianceScore.obtained / scores.complianceScore.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Parameter 5: Financial Stability */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">5. Financial Stability</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
                      Weight: 10%
                    </span>
                    <span className="text-[10px] text-slate-400">(Rating {vendorData.financial.credit_rating}, Score {vendorData.financial.financial_health_score})</span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-purple-400">{scores.financialScore.obtained}</span> / {scores.financialScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.financialScore.obtained / scores.financialScore.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Parameter 6: Customer Performance */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">6. Customer References</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 font-semibold">
                      Weight: 10%
                    </span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-yellow-400">{scores.customerScore.obtained}</span> / {scores.customerScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.customerScore.obtained / scores.customerScore.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Parameter 7: Risk Score */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">7. Risk Score</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold">
                      Weight: 5%
                    </span>
                  </div>
                  <div className="font-mono text-slate-300 font-bold">
                    <span className="text-rose-400">{scores.riskScore.obtained}</span> / {scores.riskScore.max} pts
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${(scores.riskScore.obtained / scores.riskScore.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            {[
              { id: "scorecard", label: "Vendor Overview", icon: <Building2 className="w-4 h-4" /> },
              { id: "ongoing", label: "Ongoing Project", icon: <Clock className="w-4 h-4" /> },
              { id: "history", label: "Completed Projects", icon: <Briefcase className="w-4 h-4" /> },
              { id: "compliance", label: "Compliance Documents", icon: <FileCheck2 className="w-4 h-4" /> },
              { id: "financial", label: "Financial Summary", icon: <DollarSign className="w-4 h-4" /> },
              { id: "risk", label: "Risk Analysis", icon: <AlertTriangle className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Vendor Overview */}
          {activeTab === "scorecard" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vendor Info Card */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Vendor Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">CR Number</span>
                    <span className="font-mono text-white">{vendorData.basic_information.cr_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Location</span>
                    <span className="text-white">{vendorData.basic_information.location}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase">Address</span>
                    <span className="text-white">{vendorData.basic_information.address}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">Services Offered</span>
                    <div className="flex flex-wrap gap-1.5">
                      {vendorData.services.map((svc) => (
                        <span key={svc} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-amber-300">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">About Vendor</span>
                    <p className="text-slate-300 text-xs leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      {vendorData.about}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Statistics */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Vendor Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Total PR Value</span>
                    <span className="text-lg font-bold font-mono text-amber-400">{formatSAR(vendorData.summary.total_pr_value)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Purchase Orders</span>
                    <span className="text-lg font-bold font-mono text-white">{vendorData.summary.total_purchase_orders} Orders</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Ongoing POs</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{vendorData.summary.total_ongoing_purchase_orders} Active</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Completed Projects</span>
                    <span className="text-lg font-bold font-mono text-blue-400">{vendorData.summary.completed_projects} Projects</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Years Experience</span>
                    <span className="text-lg font-bold font-mono text-white">{vendorData.summary.years_experience} Years</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Similar Projects</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">{vendorData.summary.similar_projects} Projects</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ongoing Project Card */}
          {activeTab === "ongoing" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Active Ongoing Projects ({vendorData.ongoing_projects.length})
              </h3>
              {vendorData.ongoing_projects.map((proj) => (
                <div key={proj.project_id} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-white">{proj.project_name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-semibold uppercase">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Project ID: <span className="font-mono text-slate-200">{proj.project_id}</span> | Department: {proj.department} | Cost Center: {proj.cost_center}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Project Value</p>
                      <p className="text-base font-bold font-mono text-amber-400">{formatSAR(proj.project_value)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase">Expected Delivery</span>
                      <span className="font-medium text-white">{proj.expected_delivery}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase">Payment Type</span>
                      <span className="font-medium text-white">{proj.payment_type}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase">Amount Paid</span>
                      <span className="font-mono font-semibold text-emerald-400">{formatSAR(proj.amount_paid)}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase">Completion</span>
                      <span className="font-mono font-bold text-amber-300">{proj.completion_percentage}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Overall Progress</span>
                      <span className="font-mono text-amber-400 font-bold">{proj.completion_percentage}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full"
                        style={{ width: `${proj.completion_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-300 block mb-2">Uploaded Documents:</span>
                    <div className="flex flex-wrap gap-2">
                      {proj.documents.map((doc) => (
                        <div key={doc} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Completed Projects History */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Completed Projects History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorData.completed_projects_history.map((hist) => (
                  <div key={hist.project_id} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{hist.project_name}</h4>
                        <p className="text-[11px] text-slate-400">ID: {hist.project_id} | {hist.department}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">{formatSAR(hist.project_value)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Completed Date: <span className="text-slate-200">{hist.completion_date}</span></p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400">On-Time Delivery</span>
                        <span className="font-bold text-amber-400">{hist.ratings.on_time_delivery} / 5</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400">Quality Rating</span>
                        <span className="font-bold text-emerald-400">{hist.ratings.quality} / 5</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400">Value for Money</span>
                        <span className="font-bold text-cyan-400">{hist.ratings.value_for_money} / 5</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400">Overall Experience</span>
                        <span className="font-bold text-yellow-400">{hist.ratings.overall_experience} / 5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Compliance Documents */}
          {activeTab === "compliance" && (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4" /> Compliance & Regulatory Documents Table
                  </h3>
                  <p className="text-xs text-slate-400">Verified automatically using Gemini 2.5 Flash document analyzer</p>
                </div>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30"
                >
                  + Upload New Compliance Doc
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Document Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Verified By</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {[
                      { name: "CR Certificate (Commercial Registration)", key: "cr_certificate", expiry: "2027-12-31" },
                      { name: "VAT Certificate", key: "vat_certificate", expiry: "2027-06-30" },
                      { name: "ISO 9001 Quality Management", key: "iso9001", expiry: "2026-11-15" },
                      { name: "ISO 27001 Information Security", key: "iso27001", expiry: "2026-09-01" },
                      { name: "General Insurance Certificate", key: "insurance", expiry: "2026-12-01" },
                      { name: "Tax Certificate / Zakat", key: "company_profile", expiry: "2027-01-01" },
                      { name: "Business License", key: "business_license", expiry: "2028-03-30" },
                      { name: "Executed NDA Agreement", key: "nda", expiry: "Permanent" },
                    ].map((doc) => {
                      const isValid = vendorData.documents[doc.key as keyof typeof vendorData.documents]

                      return (
                        <tr key={doc.key} className="hover:bg-slate-900/40">
                          <td className="p-3 font-medium text-white flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            {doc.name}
                          </td>
                          <td className="p-3">
                            {isValid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-[10px] font-bold">
                                <XCircle className="w-3 h-3" /> MISSING / EXPIRED
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono">{doc.expiry}</td>
                          <td className="p-3 text-slate-400">Gemini 2.5 AI Engine</td>
                          <td className="p-3 text-slate-400">{isValid ? "Valid document on file" : "Requires urgent update"}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Financial Summary */}
          {activeTab === "financial" && (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Financial Stability & Liquidity Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Annual Revenue</span>
                  <span className="text-base font-bold font-mono text-amber-400">{formatSAR(vendorData.financial.annual_revenue)}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Credit Rating</span>
                  <span className="text-base font-bold font-mono text-emerald-400">{vendorData.financial.credit_rating}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Financial Health</span>
                  <span className="text-base font-bold font-mono text-cyan-400">{vendorData.financial.financial_health_score} / 100</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Bank Guarantee Limit</span>
                  <span className="text-base font-bold font-mono text-purple-400">{formatSAR(vendorData.financial.bank_guarantee_limit)}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Available Capacity</span>
                  <span className="text-base font-bold text-white">{vendorData.financial.available_capacity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Risk Analysis */}
          {activeTab === "risk" && (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Enterprise Risk Matrix
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Financial Risk</span>
                  <span className="font-bold text-emerald-400 text-sm">{vendorData.risk.financial_risk}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Compliance Risk</span>
                  <span className="font-bold text-emerald-400 text-sm">{vendorData.risk.compliance_risk}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Delivery Risk</span>
                  <span className="font-bold text-amber-400 text-sm">{vendorData.risk.delivery_risk}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                  <span className="text-[10px] text-amber-400 uppercase block mb-1">Overall Risk Score</span>
                  <span className="font-bold font-mono text-white text-sm">{vendorData.risk.overall_risk_score} / 5</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer References Block */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Star className="w-4 h-4" /> Customer References & Feedback Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendorData.customer_references.map((ref, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{ref.client}</span>
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {ref.rating} / 5
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Project: {ref.project}</p>
                  <p className="text-slate-300 italic p-2 rounded bg-slate-950/60 border border-slate-900">
                    "{ref.feedback}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#0F172A] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Upload & Analyze Compliance Document</h3>
            <p className="text-xs text-slate-400">Select document to parse with Gemini 2.5 Flash OCR engine.</p>
            <input
              type="text"
              placeholder="e.g. ISO27001_Certificate_2026.pdf"
              value={uploadedDocName}
              onChange={(e) => setUploadedDocName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateUpload}
                disabled={docSimulating || !uploadedDocName.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-50 flex items-center gap-2"
              >
                {docSimulating ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : null}
                {docSimulating ? "AI Processing..." : "Upload & Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
