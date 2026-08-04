"use client"

import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import RegistrationForm from "@/components/registration-form"

interface RegistrationPageProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  onNavigate: (page: "login" | "registration" | "dashboard" | "portal-chooser") => void
}

export default function RegistrationPage({ currentStep, setCurrentStep, onNavigate }: RegistrationPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={() => onNavigate("login")} showBackButton={true} />
      <div className="flex">
        <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <main className="flex-1 p-8">
          <RegistrationForm currentStep={currentStep} setCurrentStep={setCurrentStep} onNavigate={onNavigate} />
        </main>
      </div>
    </div>
  )
}
