"use client"

import { useState } from "react"
import VendorDirectoryList from "./vendor-directory-list"
import VendorDetailsPage from "./vendor-details-page"

interface ProcVendorDirectoryPageProps {
  onVendorSelect?: (vendorId: string | null) => void
  initialVendorId?: string | null
}

export default function ProcVendorDirectoryPage({
  onVendorSelect,
  initialVendorId = null,
}: ProcVendorDirectoryPageProps) {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(initialVendorId)

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId)
    onVendorSelect?.(vendorId)
  }

  const handleBack = () => {
    setSelectedVendorId(null)
    onVendorSelect?.(null)
  }

  if (selectedVendorId) {
    return <VendorDetailsPage vendorId={selectedVendorId} onBack={handleBack} />
  }

  return <VendorDirectoryList onSelectVendor={handleSelectVendor} />
}
