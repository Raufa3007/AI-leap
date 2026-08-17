"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  SendHorizontal,
  ChevronDown,
  ChevronUp,
  Edit3,
  Paperclip,
} from "lucide-react"
import {
  extractAndProcessPRChat,
  extractPRDetailsFromPDF,
  FullPRState,
  ChatMessage,
} from "@/app/actions/ai-pr-assistant"
import { BUDGET_CODE_OPTIONS } from "@/lib/pr-constants"

interface PRAIChatbotProps {
  prState: FullPRState
  onUpdateState: (newState: FullPRState) => void
  onSaveDraft: () => void
  onSubmitPR: () => void
  onSwitchToManualForm?: () => void
  isReadOnly?: boolean
}

export default function PRAIChatbot({
  prState,
  onUpdateState,
  onSaveDraft,
  onSubmitPR,
  onSwitchToManualForm,
  isReadOnly = false,
}: PRAIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: `Hello! I'm your RFP AI Assistant. Tell me what you'd like to requisition in natural language, and I will extract the details into your form automatically.

For example:
"Create a RFP for the IT Department to purchase 10 business laptops and 5 USB keyboards, budget code BC003."`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraftCardExpanded, setIsDraftCardExpanded] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isProcessing])

  const isBOQComplete =
    prState.billItems.length > 0 &&
    prState.billItems.every(
      (item) =>
        !!item.materialGroup?.trim() &&
        !!item.itemName?.trim() &&
        !!item.deliveryDate?.trim() &&
        !!item.quantity?.trim() &&
        !!item.unitOfMeasure?.trim() &&
        !!item.unitPrice?.trim(),
    )

  // Count completed mandatory fields (matching handleSubmitPR)
  const mandatoryFields = [
    { label: "Department", filled: !!prState.formData.department?.trim() },
    { label: "Project Name (English)", filled: !!prState.formData.project_name_english?.trim() },
    { label: "Budget Code", filled: !!prState.formData.budget_code_cost_centre?.trim() },
    { label: "Requestor Name", filled: !!prState.formData.requestor_name?.trim() },
    { label: "Contact Details", filled: !!prState.formData.requestor_contact_details?.trim() },
    { label: "Preferred Vendor", filled: prState.vendors.length > 0 },
    { label: "BOQ Items Complete", filled: isBOQComplete },
  ]
  const completedCount = mandatoryFields.filter((f) => f.filled).length
  const totalMandatory = mandatoryFields.length
  const isReadyToSubmit = completedCount === totalMandatory

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isProcessing || isReadOnly) return

    const userText = input.trim()
    const attachedFile = selectedFile

    // Clear input bar state immediately
    setInput("")
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    // Build chat message text
    let chatDisplayMsg = userText
    if (attachedFile) {
      chatDisplayMsg = userText
        ? `📄 Attached: ${attachedFile.name}\n\n${userText}`
        : `📄 Attached document: ${attachedFile.name}`
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: chatDisplayMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setIsProcessing(true)

    let currentStateToUse = prState

    try {
      // 1. Process attached PDF document if present
      if (attachedFile) {
        if (attachedFile.type !== "application/pdf" && !attachedFile.name.toLowerCase().endsWith(".pdf")) {
          const errorMsg: ChatMessage = {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: "Please upload a PDF file.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, errorMsg])
          setIsProcessing(false)
          return
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (err) => reject(err)
          reader.readAsDataURL(attachedFile)
        })

        const pdfResponse = await extractPRDetailsFromPDF(base64, currentStateToUse)

        if (pdfResponse.success && pdfResponse.updatedState) {
          currentStateToUse = pdfResponse.updatedState
          onUpdateState(currentStateToUse)
        } else {
          const errorMsg: ChatMessage = {
            id: `assistant-pdf-err-${Date.now()}`,
            role: "assistant",
            text: pdfResponse.message || "Unable to extract procurement information from the document.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, errorMsg])
          setIsProcessing(false)
          return
        }
      }

      // 2. Process text message if present (or send summary if PDF only)
      if (userText) {
        const chatResponse = await extractAndProcessPRChat(userText, newHistory, currentStateToUse)

        if (chatResponse.success && chatResponse.updatedState) {
          onUpdateState(chatResponse.updatedState)

          let replyText = chatResponse.message
          if (attachedFile) {
            replyText = `📄 **Document "${attachedFile.name}" processed & PR form updated.**\n\n` + replyText
          }

          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, assistantMsg])
        } else {
          const errorMsg: ChatMessage = {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: chatResponse.message || "Sorry, I couldn't process that — please try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, errorMsg])
        }
      } else if (attachedFile) {
        // PDF attached without text message
        const assistantMsg: ChatMessage = {
          id: `assistant-pdf-${Date.now()}`,
          role: "assistant",
          text: `📄 **PDF Document Processed Successfully!**\n\nI've extracted the procurement details from "${attachedFile.name}" and auto-filled your PR form:\n\n• Scope of Work\n• Purpose & Justification\n• Business Impact / Expected Outcome\n• Matching Procurement Checklist Items\n• Bill of Quantity Items`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, assistantMsg])
      }
    } catch (err: any) {
      console.error("Error in AI PR Assistant handleSend:", err)
      const errorMsg: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text: err?.message || "Sorry, I couldn't process that — please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getBudgetLabel = (val: string) => {
    if (!val) return "Not provided"
    const match = BUDGET_CODE_OPTIONS.find((b) => b.value === val)
    return match ? match.label : val
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">RFP AI Assistant</h2>
            <p className="text-xs text-slate-500 font-medium">AI-powered RFP creation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold rounded-full">
            Gemini 2.5
          </span> */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span>Completion:</span>
          <span className="font-bold text-green-700">
            {completedCount} / {totalMandatory} mandatory fields complete
          </span>
        </div>
        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-600 h-full transition-all duration-300"
            style={{ width: `${(completedCount / totalMandatory) * 100}%` }}
          />
        </div>
      </div>

      {/* Live Mini Draft Card */}
      {false && (
        <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
          <button
            onClick={() => setIsDraftCardExpanded(!isDraftCardExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-green-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span>RFP Draft Card — {prState.formData.pr_number}</span>
            </div>
            {isDraftCardExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isDraftCardExpanded && (
            <div className="mt-2 text-xs space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">Department:</span>{" "}
                  <span className={prState.formData.department ? "font-semibold text-slate-900" : "text-amber-600 italic"}>
                    {prState.formData.department || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Budget Code:</span>{" "}
                  <span className={prState.formData.budget_code_cost_centre ? "font-semibold text-slate-900" : "text-slate-500"}>
                    {getBudgetLabel(prState.formData.budget_code_cost_centre)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Requestor:</span>{" "}
                  <span className={prState.formData.requestor_name ? "font-semibold text-slate-900" : "text-amber-600 italic"}>
                    {prState.formData.requestor_name || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Req Date:</span>{" "}
                  <span className={prState.formData.requested_date ? "font-semibold text-slate-900" : "text-amber-600 italic"}>
                    {prState.formData.requested_date || "Not provided"}
                  </span>
                </div>
              </div>

              {/* Vendors summary */}
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Vendors:</span>{" "}
                {prState.vendors.length > 0 ? (
                  <span className="font-semibold text-slate-900">
                    {prState.vendors.map((v) => v.name).join(", ")}
                  </span>
                ) : (
                  <span className="text-amber-600 italic font-medium">
                    none yet — required before submit
                  </span>
                )}
              </div>

              {/* BOQ Summary */}
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-medium">BOQ Items ({prState.billItems.length}):</span>
                <ul className="mt-1 space-y-1">
                  {prState.billItems.map((item, idx) => {
                    const missing: string[] = []
                    if (!item.materialGroup) missing.push("Material Group")
                    if (!item.unitOfMeasure) missing.push("UOM")
                    if (!item.unitPrice) missing.push("Unit Price")
                    if (!item.deliveryDate) missing.push("Delivery Date")

                    return (
                      <li key={item.id || idx} className="text-slate-800 flex items-start gap-1">
                        <span className="font-semibold text-slate-600">{idx + 1}.</span>
                        <div>
                          <span>{item.itemName || "Unnamed Item"}</span>
                          {item.quantity && <span className="font-medium"> — Qty {item.quantity}</span>}
                          {missing.length > 0 && (
                            <span className="text-amber-600 text-[11px] block italic">
                              (missing: {missing.join(", ")})
                            </span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                msg.role === "user" ? "bg-slate-700" : "bg-green-600"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-slate-800 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
              }`}
            >
              {msg.text}
              <div
                className={`text-[10px] mt-1.5 text-right ${
                  msg.role === "user" ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex gap-3 flex-row items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Confirmation Card / Action Bar when mandatory fields complete */}
      {isReadyToSubmit && !isReadOnly && (
        <div className="p-3 bg-green-50 border-t border-green-200 shadow-inner">
          <div className="flex items-center gap-2 text-green-800 font-semibold text-xs mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>RFP is ready for submission!</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onSubmitPR}
              className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              Confirm & Submit
            </button>
            <button
              onClick={onSaveDraft}
              className="py-2 px-3 border border-slate-300 hover:bg-white text-slate-700 bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              Save Draft
            </button>
            {onSwitchToManualForm && (
              <button
                onClick={onSwitchToManualForm}
                className="py-2 px-3 border border-slate-300 hover:bg-white text-slate-700 bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                Edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Input Form */}
      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="relative flex items-end bg-slate-100 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-green-600 focus-within:border-transparent transition-all">

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing || isReadOnly}
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isReadOnly}
            className="m-1.5 p-2 text-slate-500 hover:text-green-600 hover:bg-slate-200 disabled:text-slate-300 rounded-lg transition-colors shrink-0"
            aria-label="Attach Document"
            title="Attach Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing || isReadOnly}
            placeholder={
              isReadOnly
                ? "This RFP is submitted and read-only"
                : "Describe your RFP request..."
            }
            rows={2}
            className="w-full resize-none bg-transparent px-2 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedFile) || isProcessing || isReadOnly}
            className="m-1.5 p-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg transition-colors shrink-0 shadow-sm"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-2 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-xs text-slate-700 truncate">
                {selectedFile.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 ml-2"
            >
              Remove
            </button>
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-1.5 text-center">
          Gemini extracts details & merges into form • Review draft before submitting
        </p>
      </div>
    </div>
  )
}