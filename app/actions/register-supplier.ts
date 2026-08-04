"use server"

import { createClient } from "@supabase/supabase-js"

interface RegistrationData {
  // Step 1: Company Information
  companyName: string
  businessType: string
  countryOfOperation: string
  dateOfIncorporation: string
  crNumber: string
  crIssueDate: string
  companyAddressLine1: string
  companyAddressLine2: string
  companyCity: string
  companyPostalCode: string
  operationalAddressLine1: string
  operationalAddressLine2: string
  operationalCity: string
  operationalPostalCode: string
  sameAsCompanyAddress: boolean

  // Step 2: Products & Services
  industriesServed: string
  productServices: Array<{ category: string; description: string }>
  differentiators: string
  portfolioFiles: Array<{ name: string; size: number; uploadedDate: string }>

  // Step 3: Business Capability
  numberOfEmployees: string
  officeLocations: string
  annualTurnover: string
  capacityToDeliver: string
  existingClients: string

  // Step 4: Contact
  primaryRepFirstName: string
  primaryRepLastName: string
  primaryRepPhone: string
  primaryRepPhoneCode: string
  primaryRepEmail: string
  primaryRepRelationship: string
  primaryRepNationality: string

  secondaryRepFirstName: string
  secondaryRepLastName: string
  secondaryRepPhone: string
  secondaryRepPhoneCode: string
  secondaryRepEmail: string
  secondaryRepRelationship: string
  secondaryRepNationality: string

  // Step 5: Documents
  documents: { [key: string]: { name: string; size: number; uploadedDate: string } | null }

  // Step 6: Verification
  password: string
  confirmPassword: string
}

export async function registerSupplier(formData: RegistrationData) {
  try {
    const supabaseUrl = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
    const serviceRoleKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

    console.log("[v0] Supabase URL:", supabaseUrl)
    console.log("[v0] Service Role Key available:", !!serviceRoleKey)

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[v0] Missing Supabase credentials")
      return {
        success: false,
        error: "Supabase credentials not configured",
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    console.log("[v0] Starting registration with email:", formData.primaryRepEmail)

    // Validate required fields
    if (!formData.companyName || !formData.primaryRepEmail || !formData.password) {
      console.log("[v0] Missing required fields")
      return {
        success: false,
        error: "Missing required fields",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.primaryRepEmail)) {
      console.log("[v0] Invalid email format")
      return {
        success: false,
        error: "Invalid email format",
      }
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      console.log("[v0] Password validation failed")
      return {
        success: false,
        error: "Password must be at least 8 characters with uppercase, lowercase, and numbers",
      }
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("[v0] Passwords do not match")
      return {
        success: false,
        error: "Passwords do not match",
      }
    }

    // Check for duplicate email
    const { data: existingSupplierByEmail, error: checkEmailError } = await supabase
      .from("supplier")
      .select("id")
      .eq("primary_rep_email", formData.primaryRepEmail)
      .maybeSingle()

    if (checkEmailError) {
      console.error("[v0] Error checking existing supplier by email:", checkEmailError)
    }

    if (existingSupplierByEmail) {
      console.log("[v0] Email already registered")
      return {
        success: false,
        error: "Email already registered",
      }
    }

    // Check for duplicate CR number
    const { data: existingSupplierByCR, error: checkCRError } = await supabase
      .from("supplier")
      .select("id")
      .eq("cr_number", formData.crNumber)
      .maybeSingle()

    if (checkCRError) {
      console.error("[v0] Error checking existing CR number:", checkCRError)
    }

    if (existingSupplierByCR) {
      console.log("[v0] CR number already registered")
      return {
        success: false,
        error: "CR number already registered. Please use a different CR number.",
      }
    }

    // Prepare supplier data
    const supplierData = {
      company_name: formData.companyName,
      business_type: formData.businessType,
      country_of_operation: formData.countryOfOperation,
      date_of_incorporation: formData.dateOfIncorporation,
      cr_number: formData.crNumber,
      cr_issue_date: formData.crIssueDate,
      company_address_line1: formData.companyAddressLine1,
      company_address_line2: formData.companyAddressLine2,
      company_city: formData.companyCity,
      company_postal_code: formData.companyPostalCode,
      operational_address_line1: formData.operationalAddressLine1,
      operational_address_line2: formData.operationalAddressLine2,
      operational_city: formData.operationalCity,
      operational_postal_code: formData.operationalPostalCode,
      same_as_company_address: formData.sameAsCompanyAddress,
      industries_served: formData.industriesServed,
      product_service_1_category: formData.productServices[0]?.category || null,
      product_service_1_description: formData.productServices[0]?.description || null,
      product_service_2_category: formData.productServices[1]?.category || null,
      product_service_2_description: formData.productServices[1]?.description || null,
      differentiators: formData.differentiators,
      portfolio_files: formData.portfolioFiles,
      number_of_employees: formData.numberOfEmployees,
      office_locations: formData.officeLocations,
      annual_turnover: formData.annualTurnover,
      capacity_to_deliver: formData.capacityToDeliver,
      existing_clients: formData.existingClients,
      primary_rep_first_name: formData.primaryRepFirstName,
      primary_rep_last_name: formData.primaryRepLastName,
      primary_rep_phone: formData.primaryRepPhone,
      primary_rep_phone_code: formData.primaryRepPhoneCode,
      primary_rep_email: formData.primaryRepEmail,
      primary_rep_relationship: formData.primaryRepRelationship,
      primary_rep_nationality: formData.primaryRepNationality,
      secondary_rep_first_name: formData.secondaryRepFirstName || null,
      secondary_rep_last_name: formData.secondaryRepLastName || null,
      secondary_rep_phone: formData.secondaryRepPhone || null,
      secondary_rep_phone_code: formData.secondaryRepPhoneCode || null,
      secondary_rep_email: formData.secondaryRepEmail || null,
      secondary_rep_relationship: formData.secondaryRepRelationship || null,
      secondary_rep_nationality: formData.secondaryRepNationality || null,
      business_registration_doc: formData.documents.businessRegistration,
      director_id_proof_doc: formData.documents.directorIdProof,
      quality_certifications_doc: formData.documents.qualityCertifications,
      industry_specific_certifications_doc: formData.documents.industrySpecificCertifications,
      proof_of_past_work_doc: formData.documents.proofOfPastWork,
      organizational_chart_doc: formData.documents.organizationalChart,
      password_hash: formData.password,
      otp_verified: true,
      status: "pending",
    }

    console.log("[v0] Inserting supplier data with SERVICE_ROLE_KEY")

    const { data, error } = await supabase.from("supplier").insert([supplierData]).select()

    if (error) {
      console.error("[v0] Supabase insert error:", error.message)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      return {
        success: false,
        error: error.message || "Failed to register supplier",
      }
    }

    console.log("[v0] Supplier registered successfully!")
    console.log("[v0] Inserted record ID:", data?.[0]?.id)
    console.log("[v0] Full data:", JSON.stringify(data, null, 2))

    return {
      success: true,
      message: "Registration successful",
      data: data,
    }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during registration",
    }
  }
}
