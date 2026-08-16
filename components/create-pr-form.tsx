"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, Sparkles } from "lucide-react"
import { savePRDraft, submitPR, loadPRDraft } from "@/app/actions/save-pr-draft"
import { useToast } from "@/hooks/use-toast"
import { BUDGET_CODE_OPTIONS, MATERIAL_GROUP_OPTIONS, UNIT_OF_MEASURE_OPTIONS } from "@/lib/pr-constants"
import PRAIChatbot from "./pr-ai-chatbot"
import { FullPRState, extractPRDetailsFromPDF } from "@/app/actions/ai-pr-assistant"

interface Vendor {
  id: number
  name: string
}

interface ChecklistItem {
  id: number
  question: string
  answer: boolean
}

interface BillItem {
  id: number
  materialGroup: string
  itemName: string
  deliveryDate: string
  quantity: string
  unitOfMeasure: string
  unitPrice: string
  description: string
}


function generatePRNumber() {
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-GB").split("/").join("")
  const timeStr = now.getTime().toString().slice(-4)
  return `PR_${dateStr}_${timeStr}`
}

export default function CreatePRForm({
  onBack,
  editPrNumber,
  customTitle,
}: {
  onBack: () => void
  editPrNumber?: string
  customTitle?: string
}) {
  const [formData, setFormData] = useState({
    pr_number: editPrNumber || generatePRNumber(),
    department: "",
    budget_code_cost_centre: "",
    project_name_english: "",
    project_name_arabic: "",
    requestor_name: "",
    requestor_contact_details: "",
    requested_date: "",
    scope_of_work: "",
    purpose_and_justification: "",
    business_impact_expected_outcome: "",
  })

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [billItems, setBillItems] = useState<BillItem[]>([
    {
      id: 1,
      materialGroup: "",
      itemName: "",
      deliveryDate: "",
      quantity: "",
      unitOfMeasure: "",
      unitPrice: "",
      description: "",
    },
  ])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, question: "Is this project included as per procurement planning?", answer: false },
    { id: 2, question: "Were the specifications of the team work mentioned?", answer: false },
    {
      id: 3,
      question:
        "Has the data of the person concerned with coordinating with suppliers been written down ? (Name, Mobile, Email)",
      answer: false,
    },
    {
      id: 4,
      question:
        "has the information of the person concerned with receiving the samples been written down ? (Name, Mobile, Email)",
      answer: false,
    },
    {
      id: 5,
      question: "Is the scope of work similar to the scope of existing contract? If yes please refer to the contract",
      answer: false,
    },
    {
      id: 6,
      question:
        "The names of the companies summoned in the limited tender, along with writing the commercial registration number of the company",
      answer: false,
    },
  ])

  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIChat, setShowAIChat] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [isExtractingPDF, setIsExtractingPDF] = useState(false)

  const handlePDFUpload = async (file: File) => {
    if (!file) return
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive",
      })
      return
    }

    setIsExtractingPDF(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (err) => reject(err)
        reader.readAsDataURL(file)
      })

      const currentState: FullPRState = {
        formData,
        vendors,
        billItems,
        checklist,
      }

      const response = await extractPRDetailsFromPDF(base64, currentState)

      if (response.success && response.updatedState) {
        setFormData(response.updatedState.formData)
        setVendors(response.updatedState.vendors)
        setBillItems(response.updatedState.billItems)
        setChecklist(response.updatedState.checklist)

        toast({
          title: "PDF Processed Successfully",
          description: "PR fields have been auto-filled from the document.",
          duration: 4000,
        })
      } else {
        toast({
          title: "PDF Extraction Failed",
          description: response.message || "Unable to extract procurement information from the document.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("PDF upload error:", err)
      toast({
        title: "Error Reading PDF",
        description: err?.message || "Unable to read this PDF. Please try another document.",
        variant: "destructive",
      })
    } finally {
      setIsExtractingPDF(false)
    }
  }


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddVendor = () => {
    if (newVendor.name.trim()) {
      setVendors([...vendors, { id: Math.max(...vendors.map((v) => v.id), 0) + 1, name: newVendor.name }])
      setNewVendor({ name: "", email: "", phone: "", cr_number: "" })
      setShowVendorModal(false)
    }
  }

  const handleBillItemChange = (id: number, field: string, value: string) => {
    setBillItems(billItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSaveAsDraft = async () => {
    if (!formData.pr_number.trim()) {
      toast({ title: "Error", description: "PR Number is required", variant: "destructive" })
      return
    }

    setIsSaving(true)

    try {
      const result = await savePRDraft({
        ...formData,
        preferred_vendors: vendors.map((v) => ({ name: v.name })),
        bill_of_quantity: billItems.map((item) => ({
          material_group: item.materialGroup,
          item_name: item.itemName,
          delivery_date: item.deliveryDate,
          quantity: item.quantity,
          unit_of_measure: item.unitOfMeasure,
          unit_price: item.unitPrice,
          description: item.description,
        })),
        checklist_project_in_procurement_plan: checklist[0]?.answer || false,
        checklist_team_specifications_mentioned: checklist[1]?.answer || false,
        checklist_supplier_coordinator_details: checklist[2]?.answer || false,
        checklist_sample_receiver_details: checklist[3]?.answer || false,
        checklist_scope_similar_to_existing_contract: checklist[4]?.answer || false,
        checklist_limited_tender_companies_listed: checklist[5]?.answer || false,
      })

      if (result.success) {
        toast({
          title: "Draft Saved Successfully",
          description: "Your PR draft has been saved and can be edited later.",
          duration: 3000,
        })
        setTimeout(() => {
          onBack()
        }, 1200)
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save draft", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitPR = async () => {
    if (!formData.pr_number.trim()) {
      toast({ title: "Error", description: "PR Number is required", variant: "destructive" })
      return
    }
    if (!formData.department.trim()) {
      toast({ title: "Error", description: "Department is required", variant: "destructive" })
      return
    }
    if (!formData.project_name_english.trim() && !formData.project_name_arabic.trim()) {
      toast({ title: "Error", description: "Project Name is required", variant: "destructive" })
      return
    }
    if (!formData.budget_code_cost_centre.trim()) {
      toast({ title: "Error", description: "Budget code/Cost centre is required", variant: "destructive" })
      return
    }
    if (!formData.requestor_name.trim()) {
      toast({ title: "Error", description: "Requestor name is required", variant: "destructive" })
      return
    }
    if (!formData.requestor_contact_details.trim()) {
      toast({ title: "Error", description: "Contact details are required", variant: "destructive" })
      return
    }
    if (vendors.length === 0) {
      toast({ title: "Error", description: "At least one vendor is required", variant: "destructive" })
      return
    }

    if (billItems.length === 0) {
      toast({ title: "Error", description: "At least one Bill of Quantity (BOQ) item is required", variant: "destructive" })
      return
    }

    for (let i = 0; i < billItems.length; i++) {
      const item = billItems[i]
      const itemNum = i + 1
      if (!item.materialGroup?.trim()) {
        toast({ title: "Error", description: `BOQ Item #${itemNum}: Material Group is required`, variant: "destructive" })
        return
      }
      if (!item.itemName?.trim()) {
        toast({ title: "Error", description: `BOQ Item #${itemNum}: Item Name is required`, variant: "destructive" })
        return
      }
      if (!item.deliveryDate?.trim()) {
        toast({ title: "Error", description: `BOQ Item #${itemNum}: Expected Delivery Date is required`, variant: "destructive" })
        return
      }
      if (!item.quantity?.trim()) {
        toast({ title: "Error", description: `BOQ Item #${itemNum}: Quantity is required`, variant: "destructive" })
        return
      }
      if (!item.unitOfMeasure?.trim()) {
        toast({ title: "Error", description: `BOQ Item #${itemNum}: Unit of Measure (UOM) is required`, variant: "destructive" })
        return
      }
      if (!item.unitPrice?.trim()) {
        toast({ title: "Error", description: `BOQ Item #${itemNum}: Estimated Unit Price is required`, variant: "destructive" })
        return
      }
    }

    setIsSubmitting(true)

    try {
      const saveResult = await savePRDraft({
        ...formData,
        preferred_vendors: vendors.map((v) => ({ name: v.name })),
        bill_of_quantity: billItems.map((item) => ({
          material_group: item.materialGroup,
          item_name: item.itemName,
          delivery_date: item.deliveryDate,
          quantity: item.quantity,
          unit_of_measure: item.unitOfMeasure,
          unit_price: item.unitPrice,
          description: item.description,
        })),
        checklist_project_in_procurement_plan: checklist[0]?.answer || false,
        checklist_team_specifications_mentioned: checklist[1]?.answer || false,
        checklist_supplier_coordinator_details: checklist[2]?.answer || false,
        checklist_sample_receiver_details: checklist[3]?.answer || false,
        checklist_scope_similar_to_existing_contract: checklist[4]?.answer || false,
        checklist_limited_tender_companies_listed: checklist[5]?.answer || false,
      })

      if (!saveResult.success) {
        toast({ title: "Error", description: saveResult.error, variant: "destructive" })
        return
      }

      const submitResult = await submitPR(formData.pr_number)

      if (submitResult.success) {
        toast({
          title: "PR Submitted Successfully",
          description: `PR ${formData.pr_number} has been submitted for approval.`,
          duration: 2500,
        })
        setIsReadOnly(true)
        setTimeout(() => {
          onBack()
        }, 1200)
      } else {
        toast({ title: "Error", description: submitResult.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit PR", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const [showVendorModal, setShowVendorModal] = useState(false)
  const [newVendor, setNewVendor] = useState({ name: "", email: "", phone: "", cr_number: "" })

  useEffect(() => {
    const loadDraft = async () => {
      if (editPrNumber) {
        console.log("[v0] Loading PR draft for:", editPrNumber)
        const result = await loadPRDraft(editPrNumber)

        if (result.success && result.data) {
          console.log("[v0] Draft loaded successfully:", result.data)
          const data = result.data
          console.log(data)

          setFormData({
            pr_number: data.pr_number || "5672",
            department: data.department || "",
            budget_code_cost_centre: data.budget_code_cost_centre || "",
            project_name_english: data.project_name_english || "",
            project_name_arabic: data.project_name_arabic || "",
            requestor_name: data.requestor_name || "",
            requestor_contact_details: data.requestor_contact_details || "",
            requested_date: data.requested_date || "",
            scope_of_work: data.scope_of_work || "",
            purpose_and_justification: data.purpose_and_justification || "",
            business_impact_expected_outcome: data.business_impact_expected_outcome || "",
          })

          if (data.preferred_vendors && Array.isArray(data.preferred_vendors)) {
            setVendors(
              data.preferred_vendors.map((v: any, idx: number) => ({
                id: idx + 1,
                name: v.name || "",
              })),
            )
          }

          if (data.bill_of_quantity && Array.isArray(data.bill_of_quantity)) {
            setBillItems(
              data.bill_of_quantity.map((item: any, idx: number) => ({
                id: idx + 1,
                materialGroup: item.material_group || "",
                itemName: item.item_name || "",
                deliveryDate: item.delivery_date || "",
                quantity: item.quantity || "",
                unitOfMeasure: item.unit_of_measure || "",
                unitPrice: item.unit_price || "",
                description: item.description || "",
              })),
            )
          }

          setChecklist([
            {
              id: 1,
              question: "Is this project included as per procurement planning?",
              answer: data.checklist_project_in_procurement_plan || false,
            },
            {
              id: 2,
              question: "Were the specifications of the team work mentioned?",
              answer: data.checklist_team_specifications_mentioned || false,
            },
            {
              id: 3,
              question:
                "Has the data of the person concerned with coordinating with suppliers been written down ? (Name, Mobile, Email)",
              answer: data.checklist_supplier_coordinator_details || false,
            },
            {
              id: 4,
              question:
                "has the information of the person concerned with receiving the samples been written down ? (Name, Mobile, Email)",
              answer: data.checklist_sample_receiver_details || false,
            },
            {
              id: 5,
              question:
                "Is the scope of work similar to the scope of existing contract? If yes please refer to the contract",
              answer: data.checklist_scope_similar_to_existing_contract || false,
            },
            {
              id: 6,
              question:
                "The names of the companies summoned in the limited tender, along with writing the commercial registration number of the company",
              answer: data.checklist_limited_tender_companies_listed || false,
            },
          ])

          if (data.pr_status === "submitted") {
            setIsReadOnly(true)
          }
        } else {
          console.log(result)
        }
      }
    }

    loadDraft()
  }, [editPrNumber])

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded" aria-label="Go back">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-green-700">
            {customTitle || (isReadOnly ? "View RFP (Submitted)" : editPrNumber ? "Edit RFP Draft" : "Create RFP")}
          </h1>
          {isReadOnly && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Read Only - Submitted
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextShow = !showAIChat
              setShowAIChat(nextShow)
              if (nextShow) {
                setIsSidebarCollapsed(true)
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              showAIChat
                ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {showAIChat ? "Fill manually" : "Fill with AI"}
          </button>
          {!isReadOnly && (
            <>
              <button
                onClick={handleSaveAsDraft}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save As Draft"}
              </button>
              <button
                onClick={handleSubmitPR}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit RFP"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {isSidebarCollapsed ? (
          <div className="w-14 border-r border-gray-200 bg-gray-50 flex flex-col items-center py-4 flex-shrink-0 transition-all">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-1.5 hover:bg-gray-200 rounded text-gray-600 mb-4"
              title="Expand Sections Sidebar"
              aria-label="Expand Sections Sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="space-y-3 w-full flex flex-col items-center">
              {[
                { title: "RFP Details", icon: "ri-file-list-line" },
                { title: "Bill of Quantity", icon: "ri-shopping-cart-line" },
                { title: "Scope Of Work", icon: "ri-draft-line" },
                { title: "Purpose & Justification", icon: "ri-file-text-line" },
                { title: "Business Impact / Expected Outcome", icon: "ri-bar-chart-box-line" },
                { title: "Vendor Selection", icon: "ri-user-follow-line" },
                { title: "Procurement Checklist", icon: "ri-checkbox-line" },
                { title: "Attachments", icon: "ri-attachment-line" },
              ].map((sec) => (
                <button
                  key={sec.title}
                  onClick={() => setIsSidebarCollapsed(false)}
                  title={sec.title}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-green-700 transition-colors"
                >
                  <i className={`${sec.icon} text-lg`} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 transition-all">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">Sections</h2>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-600"
                  title="Collapse Sections Sidebar"
                  aria-label="Collapse Sections Sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {[
                  "RFP Details",
                  "Bill of Quantity",
                  "Scope Of Work",
                  "Purpose & Justification",
                  "Business Impact / Expected Outcome",
                  "Vendor Selection",
                  "Procurement Checklist",
                  "Attachments",
                ].map((section) => (
                  <button
                    key={section}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      section === "RFP Details"
                        ? "bg-green-100 text-green-700 border-l-4 border-green-600 font-medium"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">RFP Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PR Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter PR Number"
                      value={formData.pr_number}
                      onChange={(e) => handleInputChange("pr_number", e.target.value)}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget code/Cost centre <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.budget_code_cost_centre}
                      onChange={(e) => handleInputChange("budget_code_cost_centre", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select here</option>
                      {BUDGET_CODE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type Here"
                      value={formData.project_name_english}
                      onChange={(e) => handleInputChange("project_name_english", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name in Arabic <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type Here"
                      value={formData.project_name_arabic}
                      onChange={(e) => handleInputChange("project_name_arabic", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requestor name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Requestor Name"
                      value={formData.requestor_name}
                      onChange={(e) => handleInputChange("requestor_name", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact details <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Contact Details"
                      value={formData.requestor_contact_details}
                      onChange={(e) => handleInputChange("requestor_contact_details", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requested date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.requested_date}
                      onChange={(e) => handleInputChange("requested_date", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>
                  <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Bill Of Quantity</h2>
              <div className="space-y-4">
                {billItems.map((item) => {
                  const quantity = Number(item.quantity) || 0
                  const unitPrice = Number(item.unitPrice) || 0
                  const total = quantity * unitPrice
                  const formattedTotal = total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })

                  return (
                    <div key={item.id} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Material Group <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={item.materialGroup}
                            onChange={(e) => handleBillItemChange(item.id, "materialGroup", e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                          >
                            <option value="">Search & Select Here</option>
                            {MATERIAL_GROUP_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Item Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Type Here"
                            value={item.itemName}
                            onChange={(e) => handleBillItemChange(item.id, "itemName", e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expected Delivery Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={item.deliveryDate}
                            onChange={(e) => handleBillItemChange(item.id, "deliveryDate", e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Type Here"
                            value={item.quantity}
                            onChange={(e) => handleBillItemChange(item.id, "quantity", e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Units of Measure <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={item.unitOfMeasure}
                            onChange={(e) => handleBillItemChange(item.id, "unitOfMeasure", e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                          >
                            <option value="">Search & Select Here</option>
                            {UNIT_OF_MEASURE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Unit Price (Without VAT) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Type Here"
                            value={item.unitPrice}
                            onChange={(e) => handleBillItemChange(item.id, "unitPrice", e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total (Without VAT)</label>
                          <input
                            type="text"
                            value={formattedTotal}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Type here..."
                          value={item.description}
                          onChange={(e) => handleBillItemChange(item.id, "description", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    setBillItems([
                      ...billItems,
                      {
                        id: Math.max(...billItems.map((b) => b.id), 0) + 1,
                        materialGroup: "",
                        itemName: "",
                        deliveryDate: "",
                        quantity: "",
                        unitOfMeasure: "",
                        unitPrice: "",
                        description: "",
                      },
                    ])
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={isReadOnly}
                >
                  <Plus className="w-4 h-4" />
                  Add New Item
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled={isReadOnly}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Item
                </button>
              </div>
            </div>

                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">Approvers</label>
                  <div className="flex gap-2">
                    <div className="text-sm text-gray-500">No approvers assigned yet</div>
                  </div> */}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Scope of Work</h2>
              <textarea
                placeholder="Type here..."
                value={formData.scope_of_work}
                onChange={(e) => handleInputChange("scope_of_work", e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Purpose & Justification</h2>
              <textarea
                placeholder="Type here..."
                value={formData.purpose_and_justification}
                onChange={(e) => handleInputChange("purpose_and_justification", e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Business impact / Expected outcome</h2>
              <textarea
                placeholder="Type here..."
                value={formData.business_impact_expected_outcome}
                onChange={(e) => handleInputChange("business_impact_expected_outcome", e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-green-700">Choose any preferred vendors</h2>
                <button
                  onClick={() => setShowVendorModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                  disabled={isReadOnly}
                >
                  <Plus className="w-4 h-4" />
                  Add vendor
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="px-4 py-2 text-left text-sm font-medium">S. No</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Vendor name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{vendor.id}</td>
                        <td className="px-4 py-2 text-sm">{vendor.name}</td>
                        <td className="px-4 py-2 text-sm flex gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-50" disabled={isReadOnly}>
                            <i className="ri-edit-line text-gray-600" />
                          </button>
                          <button
                            onClick={() => setVendors(vendors.filter((v) => v.id !== vendor.id))}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                            disabled={isReadOnly}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Procurement Check List</h2>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <label className="text-sm text-gray-700">{item.question}</label>
                    <button
                      onClick={() =>
                        setChecklist(checklist.map((c) => (c.id === item.id ? { ...c, answer: !c.answer } : c)))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.answer ? "bg-green-600" : "bg-gray-300"
                      } disabled:opacity-50`}
                      disabled={isReadOnly}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.answer ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          

            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Attachments</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors relative">
                {/* <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={isReadOnly || isExtractingPDF}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handlePDFUpload(file)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                /> */}
                <div className="text-center space-y-3">
                  {isExtractingPDF ? (
                    <div className="py-4 space-y-2">
                      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm font-semibold text-green-700">Reading PDF...</p>
                      <p className="text-xs text-gray-500">Extracting procurement information & updating PR form...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-green-600 mx-auto" />
                      <div>
                        <p className="text-base font-bold text-gray-800">Upload Procurement Document</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload an RFP, Scope of Work, quotation, proposal, or other procurement document.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="h-8" />
          </div>
        </div>

        {showAIChat && (
          <div className="w-[420px] h-full flex-shrink-0">
            <PRAIChatbot
              prState={{
                formData,
                vendors,
                billItems,
                checklist,
              }}
              onUpdateState={(newState: FullPRState) => {
                setFormData(newState.formData)
                setVendors(newState.vendors)
                setBillItems(newState.billItems)
                setChecklist(newState.checklist)
              }}
              onSaveDraft={handleSaveAsDraft}
              onSubmitPR={handleSubmitPR}
              onSwitchToManualForm={() => setShowAIChat(false)}
              isReadOnly={isReadOnly}
            />
          </div>
        )}
      </div>

      {showVendorModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Vendor</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                <input
                  type="text"
                  placeholder="Enter vendor name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CR Number</label>
                <input
                  type="text"
                  placeholder="Enter CR number"
                  value={newVendor.cr_number}
                  onChange={(e) => setNewVendor({ ...newVendor, cr_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowVendorModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
