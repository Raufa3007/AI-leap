"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import DecisionModal from "./decision-modal"

interface ProcConfirmClosurePageProps {
  poId: string
  onBack: () => void
  onViewCOC?: () => void
  onCreatePR?: () => void
}

export default function ProcConfirmClosurePage({ poId, onBack, onViewCOC, onCreatePR }: ProcConfirmClosurePageProps) {
  const [activeSection, setActiveSection] = useState("overview")
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)

  const handleDecisionComplete = (decision: string, comments?: string) => {
    console.log("[v0] Decision made:", decision, "Comments:", comments)
    // Just close the modal, don't navigate anywhere
    setIsDecisionModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <ChevronLeft size={24} className="text-muted-foreground" />
            </button>
            <div>
              <p className="text-sm text-muted-foreground">RFP_10000000107</p>
              <h1 className="text-2xl font-bold text-primary">Confirm closure/delivery of the item in the PO #3432</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <i className="ri-message-2-line text-xl text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <i className="ri-history-line text-xl text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Decide
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Owner</p>
              <p className="text-sm font-medium text-foreground">Aslam Arfiz</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Process</p>
              <p className="text-sm font-medium text-foreground">RFP</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Due date</p>
              <p className="text-sm font-medium text-foreground">24 Oct 2025</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Created on</p>
              <p className="text-sm font-medium text-foreground">17 Oct 2025</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-base font-medium mb-4 text-foreground">App tray</h4>
          <div className="grid grid-cols-3 gap-4">
            <div
              onClick={onCreatePR}
              className="flex items-center gap-4 p-0 bg-card rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-border"
              style={{ height: "72px" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 bg-accent"
                style={{ width: "72px", height: "72px", padding: "24px" }}
              >
                <i className="ri-file-list-3-line text-2xl text-primary" />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium mb-2 text-foreground">PR App</p>
                <button className="text-sm font-normal flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  View More <i className="ri-arrow-right-line text-base" />
                </button>
              </div>
            </div>

            <div
              onClick={onViewCOC}
              className="flex items-center gap-4 p-0 bg-card rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-border"
              style={{ height: "72px" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 bg-accent"
                style={{ width: "72px", height: "72px", padding: "24px" }}
              >
                <i className="ri-file-check-line text-2xl text-primary" />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium mb-2 text-foreground">COC App</p>
                <button className="text-sm font-normal flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  View More <i className="ri-arrow-right-line text-base" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-base font-medium mb-4 text-primary">Additional details</h4>
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h5 className="text-base font-medium mb-4 text-foreground">Crafting P2P Application- 10000000107</h5>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-normal mb-2 text-muted-foreground">Department</p>
                <p className="text-sm font-medium text-foreground">IT & Services</p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2 text-muted-foreground">Cost Centre</p>
                <p className="text-sm font-medium text-foreground">ITRFP108657</p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2 text-muted-foreground">Purchase Group</p>
                <p className="text-sm font-medium text-foreground">Service</p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2 text-muted-foreground">Contract Duration</p>
                <p className="text-sm font-medium text-foreground">1Year 6 Months</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
          <h4 className="text-base font-medium mb-4 text-foreground">Scope Of Work</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Streamline procurement workflows, manage vendor relationships, track purchases, and control budgets.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-medium mb-4 text-foreground">Requestor details</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs font-normal mb-2 text-muted-foreground">Requested By</p>
                  <p className="text-sm font-medium text-foreground">Johnny cage</p>
                </div>
                <div>
                  <p className="text-xs font-normal mb-2 text-muted-foreground">Requestor's Manager</p>
                  <p className="text-sm font-medium text-foreground">Rebecca ferguson</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium mb-4 text-foreground">Dates</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs font-normal mb-2 text-muted-foreground">Created Date</p>
                  <p className="text-sm font-medium text-foreground">12 Jan 2025</p>
                </div>
                <div>
                  <p className="text-xs font-normal mb-2 text-muted-foreground">Expected Delivery Date</p>
                  <p className="text-sm font-medium text-foreground">12 Jun 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
          <h4 className="text-base font-medium mb-6 text-foreground">Goods requested</h4>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-2xl font-semibold mb-1 text-foreground">1,015,000</p>
              <p className="text-sm text-muted-foreground">Total estimated cost</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-2xl font-semibold mb-1 text-foreground">101,500</p>
              <p className="text-sm text-muted-foreground">Tax Amount</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-2xl font-semibold mb-1 text-foreground">1,116,500</p>
              <p className="text-sm text-muted-foreground">PR Estimated Price (With Tax)</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-primary-foreground">Item description</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-primary-foreground">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-primary-foreground">Units of measure</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-primary-foreground">Unit price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-primary-foreground">Total price</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground">Dell Latitude Laptop</td>
                  <td className="px-6 py-4 text-sm text-foreground">10</td>
                  <td className="px-6 py-4 text-sm text-foreground">Pcs</td>
                  <td className="px-6 py-4 text-sm text-foreground">100,000</td>
                  <td className="px-6 py-4 text-sm text-foreground">1,000,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground">Docking Station</td>
                  <td className="px-6 py-4 text-sm text-foreground">10</td>
                  <td className="px-6 py-4 text-sm text-foreground">Pcs</td>
                  <td className="px-6 py-4 text-sm text-foreground">1,000</td>
                  <td className="px-6 py-4 text-sm text-foreground">10,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground">Wireless Mouse</td>
                  <td className="px-6 py-4 text-sm text-foreground">10</td>
                  <td className="px-6 py-4 text-sm text-foreground">Pcs</td>
                  <td className="px-6 py-4 text-sm text-foreground">500</td>
                  <td className="px-6 py-4 text-sm text-foreground">5,000</td>
                </tr>
                <tr className="bg-accent">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground" colSpan={4}>
                    Total cost
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">1,015,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h4 className="text-base font-medium mb-6 text-foreground">Vendor overview</h4>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left: Vendor Info with Avatar */}
            <div className="flex flex-col items-center text-center">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-semibold mb-4"
                style={{ backgroundColor: "#C85A7C" }}
              >
                KT
              </div>
              <h5 className="text-lg font-semibold mb-2 text-primary">Kaar Technologies Private Limited</h5>
              <span
                className="inline-block px-3 py-1 text-sm font-medium rounded"
                style={{ backgroundColor: "#E0F2F1", color: "#00897B" }}
              >
                Within Budget
              </span>
            </div>

            {/* Right: Budget Utilization Chart */}
            <div>
              <h5 className="text-base font-medium mb-6 text-primary">Budget utilization overview</h5>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#E5E5E5"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#F1AA33"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray="502.4"
                      strokeDashoffset="50.24"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-foreground">90,000,00</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F1AA33" }}></div>
                      <span className="text-sm text-muted-foreground">Utilized Price (SAR)</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">90,000,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm text-muted-foreground">Total price (SAR)</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">100,000,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">CR number</p>
              <p className="text-sm font-medium text-foreground">7890902344</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Address</p>
              <p className="text-sm font-medium text-foreground">
                223 Al Kharj Rd, New Industrial Area, Industrial Area #3, Riyadh 11472, Saudi Arabia
              </p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Bank Name</p>
              <p className="text-sm font-medium text-foreground">Saudi National Bank (SNB)</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Account Number</p>
              <p className="text-sm font-medium text-foreground">123456789012</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">IBAN Number</p>
              <p className="text-sm font-medium text-foreground">SA123000000012345678901</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Tax Number</p>
              <p className="text-sm font-medium text-foreground">3001234567</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Reconciliation Account</p>
              <p className="text-sm font-medium text-foreground">4000001234</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Initial Guarantee (SAR)</p>
              <p className="text-sm font-medium text-foreground">10,000</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Phone Number</p>
              <p className="text-sm font-medium text-foreground">+966 501234567</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">kaartech@kaatech.com</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2 text-muted-foreground">Price Preference (SAR)</p>
              <p className="text-sm font-medium text-foreground">100,000,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* DecisionModal component */}
      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        onComplete={handleDecisionComplete}
      />
    </div>
  )
}
