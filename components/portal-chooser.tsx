"use client"

interface PortalChooserProps {
  onNavigate: (page: string) => void
}

export default function PortalChooser({ onNavigate }: PortalChooserProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Portal</h1>
          <p className="text-lg text-gray-600">Select which portal to open for this session</p>
        </div>

        {/* Portal Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">

          {/* Procurement Portal */}
          <button
            onClick={() => onNavigate("procurement")}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 w-full max-w-sm"
            aria-label="Open Procurement Portal"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Procurement Portal</h2>
              <p className="text-gray-600 mb-6">Manage RFPs, bids, contracts, and purchase orders</p>
              <div className="inline-flex items-center text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
                Enter Portal
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Supplier Portal */}
          <a
            href="https://kaarp2p.ktern.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 w-full max-w-sm"
            aria-label="Open Supplier Portal"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Supplier Portal</h2>
              <p className="text-gray-600 mb-6">Access supplier registration, invoices, and order tracking</p>
              <div className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                Enter Portal
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>KaarTech Procurement System</p>
        </div>
      </div>
    </div>
  )
}
