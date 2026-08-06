import palmTreeData from "@/data/vendors/palm_tree.json"
import accentureData from "@/data/vendors/accenture.json"
import deloitteData from "@/data/vendors/deloitte.json"
import kaarData from "@/data/vendors/kaar.json"
import dellData from "@/data/vendors/dell.json"
import hpData from "@/data/vendors/hp.json"
import wiproData from "@/data/vendors/wipro.json"

export interface VendorDocumentCheck {
  cr_certificate: boolean
  vat_certificate: boolean
  iso9001: boolean
  iso27001: boolean
  insurance: boolean
  nda: boolean
  company_profile: boolean
  business_license: boolean
}

export interface OngoingProject {
  project_name: string
  project_id: string
  department: string
  cost_center: string
  expected_delivery: string
  payment_type: string
  completion_percentage: number
  project_value: number
  amount_paid: number
  status: string
  documents: string[]
}

export interface CompletedProject {
  project_name: string
  project_id: string
  department: string
  completion_date: string
  project_value: number
  ratings: {
    on_time_delivery: number
    quality: number
    value_for_money: number
    overall_experience: number
  }
}

export interface CustomerReference {
  client: string
  project: string
  rating: number
  feedback: string
}

export interface VendorData {
  vendor_id: string
  vendor_name: string
  tier: "Strategic" | "Preferred" | "Conditional" | "Watchlist"
  basic_information: {
    location: string
    cr_number: string
    address: string
  }
  summary: {
    total_pr_value: number
    total_purchase_orders: number
    total_ongoing_purchase_orders: number
    years_experience: number
    completed_projects: number
    similar_projects: number
    industry_experience: string
    project_complexity_score: number
  }
  services: string[]
  about: string
  technical_proposal: {
    manual_score: number
    maximum_score: number
  }
  delivery_performance: {
    completed_projects: number
    on_time_projects: number
    delivery_compliance: number
    average_delay_days: number
    on_time_rating: number
  }
  financial: {
    annual_revenue: number
    credit_rating: string
    financial_health_score: number
    bank_guarantee_limit: number
    available_capacity: string
  }
  risk: {
    financial_risk: string
    compliance_risk: string
    delivery_risk: string
    overall_risk_score: number
    allocated_score: number
  }
  ongoing_projects: OngoingProject[]
  completed_projects_history: CompletedProject[]
  documents: VendorDocumentCheck
  customer_references: CustomerReference[]
}

export const allVendorsList: Record<string, VendorData> = {
  "palm_tree": palmTreeData as VendorData,
  "accenture": accentureData as VendorData,
  "deloitte": deloitteData as VendorData,
  "kaar": kaarData as VendorData,
  "dell": dellData as VendorData,
  "hp": hpData as VendorData,
  "wipro": wiproData as VendorData,
}

export function calculateVendorScores(vendor: VendorData, customTechScore?: number) {
  const techScore = customTechScore !== undefined ? customTechScore : vendor.technical_proposal.manual_score

  // Past project experience (Max 15)
  // Combination of years experience, completed projects, complexity
  const yearsFactor = Math.min(4, (vendor.summary.years_experience / 20) * 4)
  const completedFactor = Math.min(5, (vendor.summary.completed_projects / 200) * 5)
  const similarFactor = Math.min(3, (vendor.summary.similar_projects / 100) * 3)
  const complexityFactor = Math.min(3, (vendor.summary.project_complexity_score / 100) * 3)
  const pastExperienceScore = Math.min(15, Number((yearsFactor + completedFactor + similarFactor + complexityFactor).toFixed(1)))

  // On-time delivery performance (Max 10)
  const deliveryScore = Number((Math.min(10, (vendor.delivery_performance.delivery_compliance / 100) * 10)).toFixed(1))

  // Compliance Documents (Max 10)
  const docKeys: (keyof VendorDocumentCheck)[] = [
    "cr_certificate",
    "vat_certificate",
    "iso9001",
    "iso27001",
    "insurance",
    "nda",
    "company_profile",
    "business_license",
  ]
  const validDocsCount = docKeys.filter((k) => vendor.documents[k]).length
  const complianceScore = Number(((validDocsCount / docKeys.length) * 10).toFixed(1))

  // Financial Stability (Max 10)
  const financialScore = Number((Math.min(10, (vendor.financial.financial_health_score / 100) * 10)).toFixed(1))

  // Customer Performance / References (Max 10)
  const avgRefRating = vendor.customer_references.length > 0
    ? vendor.customer_references.reduce((acc, r) => acc + r.rating, 0) / vendor.customer_references.length
    : 4.0
  const customerScore = Number((Math.min(10, (avgRefRating / 5.0) * 10)).toFixed(1))

  // Risk Score (Max 5)
  const riskScore = Math.min(5, vendor.risk.allocated_score)

  const totalScore = Number((techScore + pastExperienceScore + deliveryScore + complianceScore + financialScore + customerScore + riskScore).toFixed(1))

  let recommendation: "Strategic" | "Preferred" | "Conditional" | "Watchlist" = "Strategic"
  if (totalScore >= 90) recommendation = "Strategic"
  else if (totalScore >= 80) recommendation = "Preferred"
  else if (totalScore >= 70) recommendation = "Conditional"
  else recommendation = "Watchlist"

  return {
    techScore: { obtained: techScore, max: 40, weight: 40 },
    pastExperienceScore: { obtained: pastExperienceScore, max: 15, weight: 15 },
    deliveryScore: { obtained: deliveryScore, max: 10, weight: 10 },
    complianceScore: { obtained: complianceScore, max: 10, weight: 10 },
    financialScore: { obtained: financialScore, max: 10, weight: 10 },
    customerScore: { obtained: customerScore, max: 10, weight: 10 },
    riskScore: { obtained: riskScore, max: 5, weight: 5 },
    totalScore,
    recommendation,
    validDocsCount,
    totalDocs: docKeys.length,
  }
}
