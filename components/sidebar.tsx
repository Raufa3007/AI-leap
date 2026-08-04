"use client"

import Image from "next/image"

const steps = [
  {
    number: 1,
    title: "Company information",
    description: "Provide company's official information.",
  },
  {
    number: 2,
    title: "Products & Services",
    description: "Share details about the goods or services company offers.",
  },
  {
    number: 3,
    title: "Business Capability & Operations",
    description: "Explain scale and operational strength of your organization.",
  },
  {
    number: 4,
    title: "Contact",
    description: "Your company representative & details",
  },
  {
    number: 5,
    title: "Documents Upload Section",
    description: "Upload mandatory and supporting documents.",
  },
  {
    number: 6,
    title: "Verification & password",
    description: "Verify representative details & set password.",
  },
]

interface SidebarProps {
  currentStep: number
  setCurrentStep: (step: number) => void
}

export default function Sidebar({ currentStep, setCurrentStep }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-6">
      <div className="space-y-0">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const showLine = step.number < currentStep

          return (
            <div key={step.number}>
              <button
                onClick={() => setCurrentStep(step.number)}
                className={`w-full text-left transition-colors ${
                  isCurrent ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {/* Step circle */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isCurrent
                            ? "bg-green-100 text-green-700 border-2 border-green-600"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    {/* Green line connecting steps - only shows for completed steps */}
                    {showLine && <div className="h-8 w-1 bg-green-600"></div>}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
        <div className="mt-8">
          <Image src="/images/kaarlogo.png" alt="KaarTech Logo" width={100} height={100} />
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-6">
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 rounded-full bg-green-50 p-2">
            <svg className="h-full w-full text-green-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
        </div>
        <h4 className="mb-2 text-center text-sm font-semibold text-gray-900">Having Trouble</h4>
        <p className="mb-4 text-center text-xs text-gray-600">
          Feel free to contact us and we will always help you through the process
        </p>
        <button className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Contact us
        </button>
      </div>
    </aside>
  )
}
