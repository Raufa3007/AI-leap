"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, Upload, X, Calendar, Eye, FileText, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerSupplier } from "@/app/actions/register-supplier"

interface RegistrationFormProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  onNavigate?: (page: "login" | "registration" | "dashboard") => void
}

interface ProductService {
  category: string
  description: string
}

interface UploadedFile {
  name: string
  size: number
  uploadedDate: string
  preview?: string
}

interface FormData {
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
  productServices: ProductService[]
  differentiators: string
  portfolioFiles: UploadedFile[]

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
  documents: { [key: string]: UploadedFile | null }

  // Step 6: Verification
  otp: string[]
  password: string
  confirmPassword: string
}

interface ValidationErrors {
  [key: string]: string
}

export default function RegistrationForm({ currentStep, setCurrentStep, onNavigate }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    businessType: "",
    countryOfOperation: "",
    dateOfIncorporation: "",
    crNumber: "",
    crIssueDate: "",
    companyAddressLine1: "",
    companyAddressLine2: "",
    companyCity: "",
    companyPostalCode: "",
    operationalAddressLine1: "",
    operationalAddressLine2: "",
    operationalCity: "",
    operationalPostalCode: "",
    sameAsCompanyAddress: false,
    industriesServed: "",
    productServices: [
      { category: "", description: "" },
      { category: "", description: "" },
    ],
    differentiators: "",
    portfolioFiles: [],
    numberOfEmployees: "",
    officeLocations: "",
    annualTurnover: "",
    capacityToDeliver: "",
    existingClients: "",
    primaryRepFirstName: "",
    primaryRepLastName: "",
    primaryRepPhone: "",
    primaryRepPhoneCode: "+966",
    primaryRepEmail: "",
    primaryRepRelationship: "",
    primaryRepNationality: "",
    secondaryRepFirstName: "",
    secondaryRepLastName: "",
    secondaryRepPhone: "",
    secondaryRepPhoneCode: "+966",
    secondaryRepEmail: "",
    secondaryRepRelationship: "",
    secondaryRepNationality: "",
    documents: {
      businessRegistration: null,
      directorIdProof: null,
      qualityCertifications: null,
      industrySpecificCertifications: null,
      proofOfPastWork: null,
      organizationalChart: null,
    },
    otp: ["", "", "", ""],
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [registrationError, setRegistrationError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewFileName, setPreviewFileName] = useState<string>("")
  const [previewFileType, setPreviewFileType] = useState<string>("")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [expandedPortfolioPreview, setExpandedPortfolioPreview] = useState<number | null>(null)
  const [expandedDocumentPreview, setExpandedDocumentPreview] = useState<string | null>(null)
  const { toast } = useToast()

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(extension || "")) {
      return <File size={24} className="text-green-700" />
    } else if (extension === "pdf") {
      return <FileText size={24} className="text-red-600" />
    } else if (extension === "doc" || extension === "docx") {
      return <FileText size={24} className="text-blue-600" />
    } else if (extension === "xls" || extension === "xlsx") {
      return <File size={24} className="text-green-700" />
    }
    return <File size={24} className="text-gray-500" />
  }

  const isPreviewable = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "gif", "bmp", "svg", "pdf"].includes(extension || "")
  }

  const handlePreview = (file: UploadedFile) => {
    console.log("[v0] Preview clicked for file:", file.name)
    console.log("[v0] File preview URL:", file.preview)

    if (file.preview) {
      setPreviewImage(file.preview)
      setPreviewFileName(file.name)
      const extension = file.name.split(".").pop()?.toLowerCase()
      setPreviewFileType(extension === "pdf" ? "pdf" : "image")

      console.log("[v0] Preview state set - fileName:", file.name, "fileType:", extension === "pdf" ? "pdf" : "image")
    } else {
      console.log("[v0] No preview URL available for this file")
    }
  }

  const handleInputChange = (
    field: string,
    value: string | string[] | ProductService[] | UploadedFile[] | { [key: string]: UploadedFile | null } | boolean,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }))

    validateField(field, value)
  }

  const validateField = (field: string, value: any) => {
    const newErrors = { ...validationErrors }

    if (currentStep === 1) {
      if (field === "companyName" && !value) {
        newErrors.companyName = "Company name is required"
      } else if (field === "companyName") {
        delete newErrors.companyName
      }

      if (field === "businessType" && !value) {
        newErrors.businessType = "Business type is required"
      } else if (field === "businessType") {
        delete newErrors.businessType
      }

      if (field === "countryOfOperation" && !value) {
        newErrors.countryOfOperation = "Country of operation is required"
      } else if (field === "countryOfOperation") {
        delete newErrors.countryOfOperation
      }

      if (field === "dateOfIncorporation" && !value) {
        newErrors.dateOfIncorporation = "Date of incorporation is required"
      } else if (field === "dateOfIncorporation") {
        delete newErrors.dateOfIncorporation
      }

      if (field === "crNumber" && !value) {
        newErrors.crNumber = "CR number is required"
      } else if (field === "crNumber") {
        delete newErrors.crNumber
      }

      if (field === "crIssueDate" && !value) {
        newErrors.crIssueDate = "CR issue date is required"
      } else if (field === "crIssueDate") {
        delete newErrors.crIssueDate
      }

      if (field === "companyAddressLine1" && !value) {
        newErrors.companyAddressLine1 = "Address line 1 is required"
      } else if (field === "companyAddressLine1") {
        delete newErrors.companyAddressLine1
      }

      if (field === "companyCity" && !value) {
        newErrors.companyCity = "City is required"
      } else if (field === "companyCity") {
        delete newErrors.companyCity
      }

      if (field === "companyPostalCode" && !value) {
        newErrors.companyPostalCode = "Postal code is required"
      } else if (field === "companyPostalCode") {
        delete newErrors.companyPostalCode
      }
    }

    setValidationErrors(newErrors)
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const validateCurrentStep = () => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    if (currentStep === 1) {
      if (!formData.companyName) {
        newErrors.companyName = "Company name is required"
        isValid = false
      }
      if (!formData.businessType) {
        newErrors.businessType = "Business type is required"
        isValid = false
      }
      if (!formData.countryOfOperation) {
        newErrors.countryOfOperation = "Country of operation is required"
        isValid = false
      }
      if (!formData.dateOfIncorporation) {
        newErrors.dateOfIncorporation = "Date of incorporation is required"
        isValid = false
      }
      if (!formData.crNumber) {
        newErrors.crNumber = "CR number is required"
        isValid = false
      }
      if (!formData.crIssueDate) {
        newErrors.crIssueDate = "CR issue date is required"
        isValid = false
      }
      if (!formData.companyAddressLine1) {
        newErrors.companyAddressLine1 = "Address line 1 is required"
        isValid = false
      }
      if (!formData.companyCity) {
        newErrors.companyCity = "City is required"
        isValid = false
      }
      if (!formData.companyPostalCode) {
        newErrors.companyPostalCode = "Postal code is required"
        isValid = false
      }
      if (!formData.sameAsCompanyAddress) {
        if (!formData.operationalAddressLine1) {
          newErrors.operationalAddressLine1 = "Address line 1 is required"
          isValid = false
        }
        if (!formData.operationalCity) {
          newErrors.operationalCity = "City is required"
          isValid = false
        }
        if (!formData.operationalPostalCode) {
          newErrors.operationalPostalCode = "Postal code is required"
          isValid = false
        }
      }
    } else if (currentStep === 2) {
      if (!formData.industriesServed) {
        newErrors.industriesServed = "Industries served is required"
        isValid = false
      }
      formData.productServices.forEach((ps, index) => {
        if (!ps.category) {
          newErrors[`productCategory${index}`] = "Category is required"
          isValid = false
        }
        if (!ps.description) {
          newErrors[`productDescription${index}`] = "Description is required"
          isValid = false
        }
      })
      if (!formData.differentiators) {
        newErrors.differentiators = "Differentiators are required"
        isValid = false
      }
    } else if (currentStep === 3) {
      if (!formData.numberOfEmployees) {
        newErrors.numberOfEmployees = "Number of employees is required"
        isValid = false
      }
      if (!formData.officeLocations) {
        newErrors.officeLocations = "Office locations are required"
        isValid = false
      }
      if (!formData.capacityToDeliver) {
        newErrors.capacityToDeliver = "Capacity to deliver is required"
        isValid = false
      }
      if (!formData.existingClients) {
        newErrors.existingClients = "Existing clients are required"
        isValid = false
      }
    } else if (currentStep === 4) {
      if (!formData.primaryRepFirstName) {
        newErrors.primaryRepFirstName = "First name is required"
        isValid = false
      }
      if (!formData.primaryRepLastName) {
        newErrors.primaryRepLastName = "Last name is required"
        isValid = false
      }
      if (!formData.primaryRepPhone) {
        newErrors.primaryRepPhone = "Phone number is required"
        isValid = false
      }
      if (!formData.primaryRepEmail) {
        newErrors.primaryRepEmail = "Email is required"
        isValid = false
      }
      if (!formData.primaryRepRelationship) {
        newErrors.primaryRepRelationship = "Relationship is required"
        isValid = false
      }
      if (!formData.primaryRepNationality) {
        newErrors.primaryRepNationality = "Nationality is required"
        isValid = false
      }
    } else if (currentStep === 6) {
      if (formData.otp.some((digit) => digit === "")) {
        newErrors.otp = "Please enter the OTP"
        isValid = false
      }
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!passwordPattern.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and numbers"
        isValid = false
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const validateAllPreviousSteps = (): boolean => {
    // Step 1 validation
    if (
      !formData.companyName ||
      !formData.businessType ||
      !formData.countryOfOperation ||
      !formData.dateOfIncorporation ||
      !formData.crNumber ||
      !formData.crIssueDate ||
      !formData.companyAddressLine1 ||
      !formData.companyCity ||
      !formData.companyPostalCode
    ) {
      return false
    }

    // Step 2 validation
    if (
      !formData.industriesServed ||
      !formData.differentiators ||
      formData.productServices.some((ps) => !ps.category || !ps.description)
    ) {
      return false
    }

    // Step 3 validation
    if (
      !formData.numberOfEmployees ||
      !formData.officeLocations ||
      !formData.capacityToDeliver ||
      !formData.existingClients
    ) {
      return false
    }

    // Step 4 validation
    if (
      !formData.primaryRepFirstName ||
      !formData.primaryRepLastName ||
      !formData.primaryRepPhone ||
      !formData.primaryRepEmail ||
      !formData.primaryRepRelationship ||
      !formData.primaryRepNationality
    ) {
      return false
    }

    // Step 5 validation - at least one document should be uploaded
    const hasAnyDocument = Object.values(formData.documents).some((doc) => doc !== null)
    if (!hasAnyDocument) {
      return false
    }

    return true
  }

  const handleSubmitRegistration = async () => {
    if (!validateCurrentStep()) {
      return
    }

    setIsSubmitting(true)
    setRegistrationError("")

    try {
      const result = await registerSupplier(formData)

      if (!result.success) {
        setRegistrationError(result.error || "Registration failed")
        toast({
          title: "Registration Failed",
          description: result.error || "An error occurred during registration",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully. You can now login with your credentials.",
        variant: "default",
      })

      console.log("[v0] Registration successful:", result)

      // Redirect to login after a short delay
      setTimeout(() => {
        if (onNavigate) {
          onNavigate("login")
        }
      }, 1500)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      setRegistrationError("An error occurred during registration")
      toast({
        title: "Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors[field]) return null
    return (
      <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
        <AlertCircle size={14} />
        {errors[field]}
      </div>
    )
  }

  const DatePicker = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [month, setMonth] = useState(new Date(value || new Date()))
    const [yearView, setYearView] = useState(false)

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const handleDateClick = (day: number) => {
      const newDate = new Date(month.getFullYear(), month.getMonth(), day)
      onChange(newDate.toISOString().split("T")[0])
      setShowCalendar(false)
    }

    const handleYearClick = (year: number) => {
      setMonth(new Date(year, month.getMonth(), 1))
      setYearView(false)
    }

    const handleMonthClick = (monthIndex: number) => {
      setMonth(new Date(month.getFullYear(), monthIndex, 1))
    }

    const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1)
    const firstDay = getFirstDayOfMonth(month)
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 50
    const endYear = currentYear + 10
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    return (
      <div className="relative">
        <div
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <Calendar size={16} className="text-gray-500" />
          <span>{value ? new Date(value).toLocaleDateString() : "Select Date"}</span>
        </div>

        {showCalendar && (
          <div className="absolute top-full left-0 z-10 mt-2 rounded border border-gray-300 bg-white p-4 shadow-lg w-80">
            {yearView ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setMonth(new Date(month.getFullYear() - 10, month.getMonth()))}
                    className="text-gray-600 hover:text-gray-900 font-bold"
                  >
                    ←
                  </button>
                  <span className="font-semibold text-gray-900">
                    {startYear} - {endYear}
                  </span>
                  <button
                    onClick={() => setMonth(new Date(month.getFullYear() + 10, month.getMonth()))}
                    className="text-gray-600 hover:text-gray-900 font-bold"
                  >
                    →
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className={`rounded py-2 text-sm font-medium ${
                        year === month.getFullYear()
                          ? "bg-green-700 text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg"
                  >
                    ←
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setYearView(true)}
                      className="font-semibold text-gray-900 hover:text-green-700 cursor-pointer"
                    >
                      {month.getFullYear()}
                    </button>
                    <span className="font-semibold text-gray-900">{months[month.getMonth()]}</span>
                  </div>
                  <button
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg"
                  >
                    →
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2">
                  {months.map((m, index) => (
                    <button
                      key={m}
                      onClick={() => handleMonthClick(index)}
                      className={`rounded py-1 text-xs font-medium ${
                        index === month.getMonth()
                          ? "bg-green-700 text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="w-8 text-center text-xs font-semibold text-gray-600">
                      {day}
                    </div>
                  ))}
                  {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="w-8" />
                  ))}
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`w-8 rounded py-1 text-sm ${
                        value ===
                        `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                          ? "bg-green-700 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (currentStep === 1) {
    return (
      <div className="max-w-5xl space-y-8">
        {/* Basic details section */}
        <section>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Basic details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Legal company name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.companyName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="companyName" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.businessType
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              >
                <option value="">Select Here</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="service">Service Provider</option>
              </select>
              <ErrorMessage field="businessType" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Country of operation <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.countryOfOperation}
                onChange={(e) => handleInputChange("countryOfOperation", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.countryOfOperation
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              >
                <option value="">Select Here</option>
                <option value="saudi">Saudi Arabia</option>
                <option value="uae">UAE</option>
                <option value="kuwait">Kuwait</option>
              </select>
              <ErrorMessage field="countryOfOperation" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date of incorporation <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={formData.dateOfIncorporation}
                onChange={(date) => handleInputChange("dateOfIncorporation", date)}
              />
              <ErrorMessage field="dateOfIncorporation" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                CR number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={formData.crNumber}
                onChange={(e) => handleInputChange("crNumber", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.crNumber
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="crNumber" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                CR issue date <span className="text-red-500">*</span>
              </label>
              <DatePicker value={formData.crIssueDate} onChange={(date) => handleInputChange("crIssueDate", date)} />
              <ErrorMessage field="crIssueDate" />
            </div>
          </div>
        </section>

        {/* Company address section */}
        <section>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Company address</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={formData.companyAddressLine1}
                onChange={(e) => handleInputChange("companyAddressLine1", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.companyAddressLine1
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="companyAddressLine1" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address line 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={formData.companyAddressLine2}
                onChange={(e) => handleInputChange("companyAddressLine2", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.companyCity}
                onChange={(e) => handleInputChange("companyCity", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.companyCity
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              >
                <option value="">Select Here</option>
                <option value="riyadh">Riyadh</option>
                <option value="jeddah">Jeddah</option>
                <option value="dammam">Dammam</option>
              </select>
              <ErrorMessage field="companyCity" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Postal code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={formData.companyPostalCode}
                onChange={(e) => handleInputChange("companyPostalCode", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.companyPostalCode
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="companyPostalCode" />
            </div>
          </div>
        </section>

        {/* Operational Site Address section */}
        <section>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Operational Site Address(s) (if different)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                disabled={formData.sameAsCompanyAddress}
                value={formData.operationalAddressLine1}
                onChange={(e) => handleInputChange("operationalAddressLine1", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  formData.sameAsCompanyAddress
                    ? "border-gray-200 bg-gray-100 text-gray-500"
                    : errors.operationalAddressLine1
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="operationalAddressLine1" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address line 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                disabled={formData.sameAsCompanyAddress}
                value={formData.operationalAddressLine2}
                onChange={(e) => handleInputChange("operationalAddressLine2", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  formData.sameAsCompanyAddress
                    ? "border-gray-200 bg-gray-100 text-gray-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <select
                disabled={formData.sameAsCompanyAddress}
                value={formData.operationalCity}
                onChange={(e) => handleInputChange("operationalCity", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  formData.sameAsCompanyAddress
                    ? "border-gray-200 bg-gray-100 text-gray-500"
                    : errors.operationalCity
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              >
                <option value="">Select Here</option>
                <option value="riyadh">Riyadh</option>
                <option value="jeddah">Jeddah</option>
                <option value="dammam">Dammam</option>
              </select>
              <ErrorMessage field="operationalCity" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Postal code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                disabled={formData.sameAsCompanyAddress}
                value={formData.operationalPostalCode}
                onChange={(e) => handleInputChange("operationalPostalCode", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  formData.sameAsCompanyAddress
                    ? "border-gray-200 bg-gray-100 text-gray-500"
                    : errors.operationalPostalCode
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="operationalPostalCode" />
            </div>
          </div>

          {/* Same as company address toggle */}
          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              id="sameAddress"
              checked={formData.sameAsCompanyAddress}
              onChange={(e) => handleInputChange("sameAsCompanyAddress", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="sameAddress" className="text-sm font-medium text-gray-700">
              Same as company address
            </label>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={handlePrevious}
            className="rounded border border-gray-300 bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-green-700 px-6 py-2 font-medium text-white hover:bg-green-800"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        const newFiles = Array.from(files).map((file) => {
          const fileType = file.type
          let preview: string | undefined

          if (fileType.startsWith("image/")) {
            preview = URL.createObjectURL(file)
          } else if (fileType === "application/pdf") {
            preview = URL.createObjectURL(file)
          }

          return {
            name: file.name,
            size: file.size,
            uploadedDate: new Date().toLocaleDateString(),
            preview,
          }
        })
        handleInputChange("portfolioFiles", [...formData.portfolioFiles, ...newFiles])
      }
    }

    const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files) {
        const newFiles = Array.from(files).map((file) => {
          const fileType = file.type
          let preview: string | undefined

          if (fileType.startsWith("image/")) {
            preview = URL.createObjectURL(file)
          } else if (fileType === "application/pdf") {
            preview = URL.createObjectURL(file)
          }

          return {
            name: file.name,
            size: file.size,
            uploadedDate: new Date().toLocaleDateString(),
            preview,
          }
        })
        handleInputChange("portfolioFiles", [...formData.portfolioFiles, ...newFiles])
      }
    }

    return (
      <div className="max-w-4xl space-y-8">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Sector</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Industries served <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.industriesServed}
              onChange={(e) => handleInputChange("industriesServed", e.target.value)}
              className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.industriesServed
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }`}
            >
              <option value="">Select Here</option>
              <option value="logistics">Logistics</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
            </select>
            <ErrorMessage field="industriesServed" />
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Products / Services</h2>
          {formData.productServices.map((ps, index) => (
            <div key={index} className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Primary Product/Service Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={ps.category}
                  onChange={(e) => {
                    const newServices = [...formData.productServices]
                    newServices[index].category = e.target.value
                    handleInputChange("productServices", newServices)
                  }}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors[`productCategory${index}`]
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                >
                  <option value="">Select Here</option>
                  <option value="electronics">Electronics</option>
                  <option value="textiles">Textiles</option>
                  <option value="chemicals">Chemicals</option>
                </select>
                <ErrorMessage field={`productCategory${index}`} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Brief Description of Products/Services <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type Here"
                  value={ps.description}
                  onChange={(e) => {
                    const newServices = [...formData.productServices]
                    newServices[index].description = e.target.value
                    handleInputChange("productServices", newServices)
                  }}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors[`productDescription${index}`]
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
                <ErrorMessage field={`productDescription${index}`} />
              </div>
            </div>
          ))}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product/Service differentiators <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Type here..."
              value={formData.differentiators}
              onChange={(e) => handleInputChange("differentiators", e.target.value)}
              className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.differentiators
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }`}
              rows={4}
            />
            <ErrorMessage field="differentiators" />
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Portfolio Upload</h2>
          <p className="mb-4 text-sm text-gray-600">Upload brochures, catalogues, product spec sheets.</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
            className="mb-4 rounded border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors"
          >
            <Upload className="mx-auto mb-2 h-12 w-12 text-green-700" />
            <p className="mb-1 font-medium text-gray-900">Click or Drag file to this area to upload</p>
            <p className="text-xs text-gray-500">Supports single or for bulk upload and Max file size is 15MB</p>
            <input type="file" multiple onChange={handleFileUpload} className="hidden" id="portfolio-upload" />
            <label htmlFor="portfolio-upload" className="mt-4 inline-block cursor-pointer">
              <button
                type="button"
                onClick={() => document.getElementById("portfolio-upload")?.click()}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Choose File
              </button>
            </label>
          </div>
          {formData.portfolioFiles.length > 0 && (
            <div className="space-y-2">
              {formData.portfolioFiles.map((file, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-3 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB • {file.uploadedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isPreviewable(file.name) && (
                        <button
                          onClick={() => setExpandedPortfolioPreview(expandedPortfolioPreview === index ? null : index)}
                          className="flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Preview file"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const newFiles = formData.portfolioFiles.filter((_, i) => i !== index)
                          handleInputChange("portfolioFiles", newFiles)
                        }}
                        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove file"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  {expandedPortfolioPreview === index && file.preview && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {file.name.toLowerCase().endsWith(".pdf") ? (
                        <div className="bg-white rounded p-4 text-center">
                          <FileText size={48} className="mx-auto text-red-600 mb-2" />
                          <p className="text-sm text-gray-600">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">PDF Preview - Click to download</p>
                        </div>
                      ) : (
                        <img
                          src={file.preview || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-auto rounded max-h-96 object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={handlePrevious}
            className="rounded border border-gray-300 bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-green-700 px-6 py-2 font-medium text-white hover:bg-green-800"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 3) {
    return (
      <div className="max-w-4xl space-y-8">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Business Capability & Operations</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Employees <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={formData.numberOfEmployees}
                onChange={(e) => handleInputChange("numberOfEmployees", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.numberOfEmployees
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="numberOfEmployees" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Office locations <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.officeLocations}
                onChange={(e) => handleInputChange("officeLocations", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.officeLocations
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              >
                <option value="">Select Here</option>
                <option value="single">Single Location</option>
                <option value="multiple">Multiple Locations</option>
              </select>
              <ErrorMessage field="officeLocations" />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Annual Turnover</label>
            <input
              type="text"
              placeholder="Type Here"
              value={formData.annualTurnover}
              onChange={(e) => handleInputChange("annualTurnover", e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Capacity to Deliver (quantities, time, geographies) <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Type here..."
              value={formData.capacityToDeliver}
              onChange={(e) => handleInputChange("capacityToDeliver", e.target.value)}
              className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.capacityToDeliver
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }`}
              rows={4}
            />
            <ErrorMessage field="capacityToDeliver" />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Existing Clients or References <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Type here..."
              value={formData.existingClients}
              onChange={(e) => handleInputChange("existingClients", e.target.value)}
              className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.existingClients
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }`}
              rows={4}
            />
            <ErrorMessage field="existingClients" />
          </div>
        </section>

        <div className="flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={handlePrevious}
            className="rounded border border-gray-300 bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-green-700 px-6 py-2 font-medium text-white hover:bg-green-800"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 4) {
    return (
      <div className="max-w-4xl space-y-8">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Your company representatives</h2>
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800">
                Note: The email ID of the primary representative will be used for Log in.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Primary representative</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.primaryRepFirstName}
                  onChange={(e) => handleInputChange("primaryRepFirstName", e.target.value)}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.primaryRepFirstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
                <ErrorMessage field="primaryRepFirstName" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.primaryRepLastName}
                  onChange={(e) => handleInputChange("primaryRepLastName", e.target.value)}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.primaryRepLastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
                <ErrorMessage field="primaryRepLastName" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.primaryRepPhoneCode}
                    onChange={(e) => handleInputChange("primaryRepPhoneCode", e.target.value)}
                    className="w-24 rounded border border-gray-300 px-2 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="+966">+966</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Number"
                    value={formData.primaryRepPhone}
                    onChange={(e) => handleInputChange("primaryRepPhone", e.target.value)}
                    className={`flex-1 rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.primaryRepPhone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                    }`}
                  />
                </div>
                <ErrorMessage field="primaryRepPhone" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email ID"
                  value={formData.primaryRepEmail}
                  onChange={(e) => handleInputChange("primaryRepEmail", e.target.value)}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.primaryRepEmail
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
                <ErrorMessage field="primaryRepEmail" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Relationship with company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex - CEO, Manager etc."
                  value={formData.primaryRepRelationship}
                  onChange={(e) => handleInputChange("primaryRepRelationship", e.target.value)}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.primaryRepRelationship
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
                <ErrorMessage field="primaryRepRelationship" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.primaryRepNationality}
                  onChange={(e) => handleInputChange("primaryRepNationality", e.target.value)}
                  className={`w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.primaryRepNationality
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                >
                  <option value="">Select nationality</option>
                  <option value="saudi">Saudi Arabian</option>
                  <option value="emirati">Emirati</option>
                  <option value="kuwaiti">Kuwaiti</option>
                </select>
                <ErrorMessage field="primaryRepNationality" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Secondary representative</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.secondaryRepFirstName}
                  onChange={(e) => handleInputChange("secondaryRepFirstName", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.secondaryRepLastName}
                  onChange={(e) => handleInputChange("secondaryRepLastName", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone number</label>
                <div className="flex gap-2">
                  <select
                    value={formData.secondaryRepPhoneCode}
                    onChange={(e) => handleInputChange("secondaryRepPhoneCode", e.target.value)}
                    className="w-24 rounded border border-gray-300 px-2 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="+966">+966</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Number"
                    value={formData.secondaryRepPhone}
                    onChange={(e) => handleInputChange("secondaryRepPhone", e.target.value)}
                    className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter email ID"
                  value={formData.secondaryRepEmail}
                  onChange={(e) => handleInputChange("secondaryRepEmail", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Relationship with company</label>
                <input
                  type="text"
                  placeholder="Ex - CEO, Manager etc."
                  value={formData.secondaryRepRelationship}
                  onChange={(e) => handleInputChange("secondaryRepRelationship", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Nationality</label>
                <select
                  value={formData.secondaryRepNationality}
                  onChange={(e) => handleInputChange("secondaryRepNationality", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select nationality</option>
                  <option value="saudi">Saudi Arabian</option>
                  <option value="emirati">Emirati</option>
                  <option value="kuwaiti">Kuwaiti</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={handlePrevious}
            className="rounded border border-gray-300 bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-green-700 px-6 py-2 font-medium text-white hover:bg-green-800"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 5) {
    const documentTypes = [
      { key: "businessRegistration", label: "Business Registration Certificate" },
      { key: "directorIdProof", label: "Director/Owner ID Proof (e.g., National ID, Passport)" },
      { key: "qualityCertifications", label: "Quality Certifications" },
      { key: "industrySpecificCertifications", label: "Industry-Specific Certifications" },
      {
        key: "proofOfPastWork",
        label: "Proof of Past Work / Client List (References, previous purchase orders, contracts)",
      },
      {
        key: "organizationalChart",
        label: "Organizational Chart or Team Credentials (Optional: for service providers or agencies)",
      },
    ]

    const handleDocumentUpload = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const fileType = file.type
        let preview: string | undefined

        if (fileType.startsWith("image/")) {
          preview = URL.createObjectURL(file)
        } else if (fileType === "application/pdf") {
          preview = URL.createObjectURL(file)
        }

        const newDocs = { ...formData.documents }
        newDocs[docKey] = {
          name: file.name,
          size: file.size,
          uploadedDate: new Date().toLocaleDateString(),
          preview,
        }
        handleInputChange("documents", newDocs)
      }
    }

    return (
      <div className="max-w-4xl space-y-8">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Kindly upload below documents</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type of Document</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Attachment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Uploaded Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documentTypes.map((doc, index) => (
                  <tr
                    key={doc.key}
                    className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{doc.label}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formData.documents[doc.key] ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFileIcon(formData.documents[doc.key]?.name || "")}</span>
                          <span className="inline-block max-w-xs truncate" title={formData.documents[doc.key]?.name}>
                            {formData.documents[doc.key]?.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formData.documents[doc.key] ? (
                        formData.documents[doc.key]?.uploadedDate
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-3">
                        {formData.documents[doc.key] && isPreviewable(formData.documents[doc.key]?.name || "") && (
                          <button
                            onClick={() =>
                              setExpandedDocumentPreview(expandedDocumentPreview === doc.key ? null : doc.key)
                            }
                            className="flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Preview document"
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                        )}
                        <label htmlFor={`doc-${doc.key}`} className="cursor-pointer">
                          <button
                            type="button"
                            onClick={() => document.getElementById(`doc-${doc.key}`)?.click()}
                            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            {formData.documents[doc.key] ? "Replace" : "Upload"}
                          </button>
                        </label>
                      </div>
                      <input
                        id={`doc-${doc.key}`}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={(e) => handleDocumentUpload(doc.key, e)}
                        className="hidden"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expandedDocumentPreview && formData.documents[expandedDocumentPreview]?.preview && (
            <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Preview: {formData.documents[expandedDocumentPreview]?.name}
                </h3>
                <button onClick={() => setExpandedDocumentPreview(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              {formData.documents[expandedDocumentPreview]?.name?.toLowerCase().endsWith(".pdf") ? (
                <div className="bg-white rounded p-8 text-center">
                  <FileText size={64} className="mx-auto text-red-600 mb-4" />
                  <p className="text-sm text-gray-600 font-medium">
                    {formData.documents[expandedDocumentPreview]?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">PDF Preview</p>
                </div>
              ) : (
                <img
                  src={formData.documents[expandedDocumentPreview]?.preview || "/placeholder.svg"}
                  alt={formData.documents[expandedDocumentPreview]?.name}
                  className="w-full h-auto rounded max-h-96 object-contain"
                />
              )}
            </div>
          )}
        </section>

        <div className="flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={handlePrevious}
            className="rounded border border-gray-300 bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-green-700 px-6 py-2 font-medium text-white hover:bg-green-800"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 6) {
    const handleOtpChange = (index: number, value: string) => {
      if (value.length > 1) return
      if (!/^\d*$/.test(value)) return

      const newOtp = [...formData.otp]
      newOtp[index] = value
      handleInputChange("otp", newOtp)

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`)
        prevInput?.focus()
      }
    }

    const allPreviousStepsCompleted = validateAllPreviousSteps()

    return (
      <div className="max-w-4xl space-y-8">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Enter OTP sent to company representatives</h2>

          {!allPreviousStepsCompleted && (
            <div className="mb-6 flex items-center gap-3 rounded bg-yellow-50 p-4 border border-yellow-200">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Please complete all previous sections (Company Info, Products & Services, Business Capability, Contact,
                and Documents) before proceeding with registration.
              </p>
            </div>
          )}

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">User ID:</label>
              <p className="text-sm text-gray-900">{formData.primaryRepEmail}</p>
            </div>
          </div>

          {registrationError && (
            <div className="mb-6 flex items-center gap-3 rounded bg-red-50 p-4 border border-red-200">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{registrationError}</p>
            </div>
          )}

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Representative 1</label>
              <button
                onClick={() => {
                  alert("OTP has been resent to your email")
                }}
                className="text-sm font-medium text-green-700 hover:text-green-800"
              >
                Resend
              </button>
            </div>
            <div className="flex gap-3">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`h-12 w-12 rounded border text-center text-lg font-semibold focus:outline-none focus:ring-1 ${
                    errors.otp
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
              ))}
            </div>
            <ErrorMessage field="otp" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Enter password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
              <ErrorMessage field="password" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Re-enter password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`w-full rounded border px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <ErrorMessage field="confirmPassword" />
            </div>
          </div>
        </section>

        <div className="flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={handlePrevious}
            className="rounded border border-gray-300 bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleSubmitRegistration}
            disabled={isSubmitting || !allPreviousStepsCompleted}
            className="rounded bg-green-700 px-6 py-2 font-medium text-white hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Complete registration"}
          </button>
        </div>
      </div>
    )
  }

  return null
}
