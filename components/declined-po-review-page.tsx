"use client"

interface DeclinedPOReviewPageProps {
  onBack: () => void
  onNavigateToEContract: () => void
}

export default function DeclinedPOReviewPage({ onBack, onNavigateToEContract }: DeclinedPOReviewPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F8FA" }}>
      <div className="bg-white border-b" style={{ borderColor: "#E5E5E5" }}>
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold" style={{ color: "#1B733D" }}>RFP_10000000107</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-message-2-line text-xl text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-history-line text-xl text-gray-600" />
            </button>
            <button className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: "#1B733D" }}>
              Decide
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#000525" }}>Review and approve PO for RFP #4353</h2>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Owner</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>Aslam Arfiz</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Process</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>RFP</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Due date</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>24 Oct 2025</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Created on</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>17 Oct 2025</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>App tray</h4>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
              >
                <i className="ri-file-list-3-line text-2xl" style={{ color: "#1B733D" }} />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>PR App</p>
                <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                  View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                </button>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
              >
                <i className="ri-file-ai-line text-2xl" style={{ color: "#1B733D" }} />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>Technical evaluation app</p>
                <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                  View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                </button>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
              >
                <i className="ri-file-paper-2-line text-2xl" style={{ color: "#1B733D" }} />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>Commercial evaluation app</p>
                <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                  View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                </button>
              </div>
            </div>

            <div
              onClick={onNavigateToEContract}
              className="flex items-center gap-4 p-0 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)", height: "72px" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#F7F8FA", width: "72px", height: "72px", padding: "24px" }}
              >
                <i className="ri-file-paper-line text-2xl" style={{ color: "#1B733D" }} />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium mb-2" style={{ color: "#000525" }}>E- Contract</p>
                <button className="text-sm font-normal flex items-center gap-1" style={{ color: "#45546E" }}>
                  View More <i className="ri-arrow-right-line text-base" style={{ color: "#5F6C81" }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-base font-medium mb-4" style={{ color: "#1B733D" }}>Additional details</h4>
          <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
            <h5 className="text-base font-medium mb-4" style={{ color: "#000525" }}>Leadership Development Training Program-10000000107</h5>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Department</p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>IT & Services</p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Cost Centre</p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>ITRFP108657</p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Purchase Group</p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>Service</p>
              </div>
              <div>
                <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Contract Duration</p>
                <p className="text-sm font-medium" style={{ color: "#000525" }}>1 Year 6 Months</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>Scope Of Work</h4>
          <p className="text-sm leading-relaxed" style={{ color: "#45546E" }}>
           Targeted at mid-level managers, emerging leaders, and high-potential employees, the program will run over  in a blended format of classroom/virtual learning and on-the-job practice. Success will be measured by participant feedback, leadership assessments, and observable improvements in team performance, ultimately driving stronger leadership effectiveness and organizational growth.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>Requestor details</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Requested By</p>
                  <p className="text-sm font-medium" style={{ color: "#000525" }}>Johnny cage</p>
                </div>
                <div>
                  <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Requestor's Manager</p>
                  <p className="text-sm font-medium" style={{ color: "#000525" }}>Rebecca ferguson</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium mb-4" style={{ color: "#000525" }}>Dates</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Created Date</p>
                  <p className="text-sm font-medium" style={{ color: "#000525" }}>12 Jan 2025</p>
                </div>
                <div>
                  <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Expected Delivery Date</p>
                  <p className="text-sm font-medium" style={{ color: "#000525" }}>12 Jun 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>Goods requested</h4>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white border rounded-lg p-6" style={{ borderColor: "#E5E5E5" }}>
              <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>1,015,000</p>
              <p className="text-sm" style={{ color: "#5F6C81" }}>Total estimated cost</p>
            </div>
            <div className="bg-white border rounded-lg p-6" style={{ borderColor: "#E5E5E5" }}>
              <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>101,500</p>
              <p className="text-sm" style={{ color: "#5F6C81" }}>Tax Amount</p>
            </div>
            <div className="bg-white border rounded-lg p-6" style={{ borderColor: "#E5E5E5" }}>
              <p className="text-2xl font-semibold mb-1" style={{ color: "#000525" }}>1,116,500</p>
              <p className="text-sm" style={{ color: "#5F6C81" }}>PR Estimated Price (With Tax)</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border" style={{ borderColor: "#E5E5E5" }}>
            <table className="w-full">
              <thead style={{ backgroundColor: "#1B733D" }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Item description</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Units of measure</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Unit price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Total price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y" style={{ borderColor: "#E5E5E5" }}>
                <tr>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>Dell Latitude Laptop</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>10</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>Pcs</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>100,000</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>1,000,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>Docking Station</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>10</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>Pcs</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>1,000</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>10,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>Wireless Mouse</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>10</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>Pcs</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>500</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#000525" }}>5,000</td>
                </tr>
                <tr style={{ backgroundColor: "#F7F8FA" }}>
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#000525" }} colSpan={4}>
                    Total cost
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#000525" }}>1,015,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6" style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.12)" }}>
          <h4 className="text-base font-medium mb-6" style={{ color: "#000525" }}>Vendor overview</h4>

          {/* First Row: Vendor Info + Budget Diagram */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-semibold mb-4"
                style={{ backgroundColor: "#C85A7C" }}
              >
                KT
              </div>
              <h5 className="text-lg font-semibold mb-2" style={{ color: "#1B733D" }}>Kaar Technologies Private Limited</h5>
              <span
                className="inline-block px-3 py-1 text-sm font-medium rounded"
                style={{ backgroundColor: "#E0F2F1", color: "#00897B" }}
              >
                Within Budget
              </span>
            </div>

            <div>
              <h5 className="text-base font-medium mb-6" style={{ color: "#1B733D" }}>Budget utilization overview</h5>
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
                    <span className="text-2xl font-semibold" style={{ color: "#000525" }}>90,000,00</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F1AA33" }}></div>
                      <span className="text-sm" style={{ color: "#5F6C81" }}>Utilized Price (SAR)</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#000525" }}>90,000,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm" style={{ color: "#5F6C81" }}>Total price (SAR)</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#000525" }}>100,000,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: CR Number and Address */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>CR number</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>7890902344</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Address</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>
                223 Al Kharj Rd, New Industrial Area, Industrial Area #3, Riyadh 11472, Saudi Arabia
              </p>
            </div>
          </div>

          {/* Third Row: 3x3 Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Bank Name</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>Saudi National Bank (SNB)</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Account Number</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>123456789012</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>IBAN Number</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>SA123000000012345678901</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Tax Number</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>3001234567</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Reconciliation Account</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>4000001234</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Initial Guarantee (SAR)</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>10,000</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Phone Number</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>+966 501234567</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Email</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>kaartech@kaatech.com</p>
            </div>
            <div>
              <p className="text-xs font-normal mb-2" style={{ color: "#5F6C81" }}>Price Preference (SAR)</p>
              <p className="text-sm font-medium" style={{ color: "#000525" }}>100,000,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
