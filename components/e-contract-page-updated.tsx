"use client"

import { useState } from "react"
import { ChevronLeft, FileText, Trash2, Download, Upload } from "lucide-react"

interface EContractPageProps {
  onBack: () => void
}

interface Milestone {
  id: number
  desc: string
  value: number
  price: string
  date: string
  status: string
}

interface LineItem {
  id: number
  desc: string
  qty: number
  uom: string
  price: string
  date: string
}

export default function EContractPage({ onBack }: EContractPageProps) {
  const [selectedContract, setSelectedContract] = useState<"purchase-order" | "amc" | "nda">("purchase-order")
  const [contractStartDate, setContractStartDate] = useState("2025-10-23")
  const [contractEndDate, setContractEndDate] = useState("2025-10-22")
  const [scopeOfWork, setScopeOfWork] = useState(
    "Develop a scalable application with user authentication, core features, admin panel, and third-party integrations. Utilize React/Flutter (Frontend), Node.js/ Python (Backend), and AWS/Google Cloud (Hosting); estimated completion in 3-6 months. Source code, documentation, testing, deployment, and maintenance; payment structured in milestones.",
  )

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: 1,
      desc: "14 inch laptop, Gray Colour, Windows 11",
      qty: 10,
      uom: "Count",
      price: "1,000,000",
      date: "2026-12-12",
    },
    { id: 2, desc: "Gray Colour", qty: 10, uom: "Count", price: "1,000", date: "2026-12-12" },
    { id: 3, desc: "1080 GB", qty: 2, uom: "Count", price: "10,000", date: "2026-12-12" },
    { id: 4, desc: "1 Meter", qty: 1, uom: "Meter", price: "500", date: "2026-12-12" },
    {
      id: 5,
      desc: "16 inch laptop, Gray Colour, Windows 11",
      qty: 10,
      uom: "Count",
      price: "1,020,000",
      date: "2026-12-12",
    },
  ])

  const [editingLineItemId, setEditingLineItemId] = useState<number | null>(null)

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      desc: "14 inch laptop, Gray Colour, Windows 11",
      value: 10,
      price: "1,000,000",
      date: "2026-12-12",
      status: "Pending",
    },
    { id: 2, desc: "Gray Colour", value: 10, price: "1,000", date: "2026-12-12", status: "In Progress" },
    { id: 3, desc: "1080 GB", value: 2, price: "10,000", date: "2026-12-12", status: "Pending" },
    { id: 4, desc: "1 Meter", value: 1, price: "500", date: "2026-12-12", status: "Pending" },
    {
      id: 5,
      desc: "16 inch laptop, Gray Colour, Windows 11",
      value: 10,
      price: "1,020,000",
      date: "2026-12-12",
      status: "In Progress",
    },
  ])

  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null)

  const deleteMilestone = (id: number) => {
    const updatedMilestones = milestones
      .filter((milestone) => milestone.id !== id)
      .map((milestone, index) => ({
        ...milestone,
        id: index + 1,
      }))
    setMilestones(updatedMilestones)
  }

  const updateMilestone = (id: number, field: keyof Milestone, value: string | number) => {
    setMilestones(milestones.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)))
  }

  const deleteLineItem = (id: number) => {
    const updatedLineItems = lineItems
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        id: index + 1, // Reorder S# starting from 1
      }))
    setLineItems(updatedLineItems)
    setEditingLineItemId(null)
  }

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addLineItem = () => {
    const newId = lineItems.length > 0 ? Math.max(...lineItems.map((item) => item.id)) + 1 : 1
    const newItem: LineItem = {
      id: newId,
      desc: "",
      qty: 0,
      uom: "Count",
      price: "",
      date: new Date().toISOString().split("T")[0],
    }
    setLineItems([...lineItems, newItem])
    setEditingLineItemId(newId) // Automatically edit the new row
  }

  const addMilestone = () => {
    const newId = milestones.length > 0 ? Math.max(...milestones.map((m) => m.id)) + 1 : 1
    const newMilestone: Milestone = {
      id: newId,
      desc: "",
      value: 0,
      price: "",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    }
    setMilestones([...milestones, newMilestone])
    setEditingMilestoneId(newId) // Automatically edit the new row
  }

  const handleSaveAsDraft = () => {
    const formData = {
      selectedContract,
      contractStartDate,
      contractEndDate,
      scopeOfWork,
      lineItems,
      milestones,
      poDetails: {
        poReferenceNumber: "PO 2025 014",
        prReferenceNumber: "542345",
        supplier: "Kaar Technologies",
        awardedDate: "12 Jun 25",
        procurementCategory: "Consultancy",
        bidType: "Two-envelope (Technical + Commercial)",
        contractValue: "400,000,000",
        evaluationSummary: "Vendor scored: 92.5%",
        poType: "Goods",
      },
      supplierDetails: {
        supplierName: "Kaar Technologies",
        supplierId: "542345",
        contactPerson: "Mohammed Al-Quraan",
        email: "mohammed@gmail.com",
        deliveryAddress: "#41, Alshaliah street, Riyadh",
        zakatTaxNumber: "5643565666",
      },
      financeSummary: {
        subtotal: "10,000,000",
        tax: "100,000",
        totalAmount: "10,100,000",
        currency: "SAR",
        remainingBudget: "99,000,000",
      },
    }

    console.log("[v0] E-Contract Form Data (Save As Draft):", formData)
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Green Navigation Sidebar */}

      {/* Contracts Sidebar */}
      <div className="w-[281px] bg-white flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="text-sm font-medium text-[#000525]">Contracts</h2>
        </div>

        {/* Contract List */}
        <div className="flex-1">
          {/* Purchase Order */}
          <div
            onClick={() => setSelectedContract("purchase-order")}
            className={`px-4 py-4 cursor-pointer transition-colors ${
              selectedContract === "purchase-order" ? "bg-[#F7FDF9]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="w-[37px] h-[37px] rounded-full bg-[#A6B6CA] flex items-center justify-center flex-shrink-0">
                <FileText size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-sm font-semibold ${
                      selectedContract === "purchase-order" ? "text-[#1B733D]" : "text-[#000525]"
                    }`}
                  >
                    Purchase order
                  </h3>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Trash2 size={14} className="text-[#5F6C81]" />
                  </button>
                </div>
                <p className="text-xs text-[#45546E] opacity-70">Contract not generated</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5]" />

          {/* AMC Agreement */}
          <div
            onClick={() => setSelectedContract("amc")}
            className={`px-4 py-4 cursor-pointer transition-colors ${
              selectedContract === "amc" ? "bg-[#F7FDF9]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="w-[37px] h-[37px] rounded-full bg-[#A6B6CA] flex items-center justify-center flex-shrink-0">
                <FileText size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-sm font-semibold ${
                      selectedContract === "amc" ? "text-[#1B733D]" : "text-[#000525]"
                    }`}
                  >
                    AMC Agreement
                  </h3>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Trash2 size={14} className="text-[#5F6C81]" />
                  </button>
                </div>
                <p className="text-xs text-[#45546E] opacity-70">Contract not generated</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5]" />

          {/* Non Disclosure Agreement */}
          <div
            onClick={() => setSelectedContract("nda")}
            className={`px-4 py-4 cursor-pointer transition-colors ${
              selectedContract === "nda" ? "bg-[#F7FDF9]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="w-[37px] h-[37px] rounded-full bg-[#A6B6CA] flex items-center justify-center flex-shrink-0">
                <FileText size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-sm font-semibold ${
                      selectedContract === "nda" ? "text-[#1B733D]" : "text-[#000525]"
                    }`}
                  >
                    Non Disclosure Agreement
                  </h3>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Trash2 size={14} className="text-[#5F6C81]" />
                  </button>
                </div>
                <p className="text-xs text-[#45546E] opacity-70">Letter not generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F7F8FA]">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-medium text-gray-900">Prepare PO for RFP #4542</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <i className="ri-eye-line" />
              Preview
            </button>
            <button
              onClick={handleSaveAsDraft}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <i className="ri-save-line" />
              Save As Draft
            </button>
            <button className="px-4 py-2 text-sm text-white bg-[#1B733D] rounded-lg hover:bg-[#155a2f] transition-colors">
              Generate Contract
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-w-[1200px]">
          <h2 className="text-lg font-semibold text-[#1B733D] mb-6">Prepare purchase order</h2>

          {/* PO Details */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">PO Details</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">PO Reference Number</p>
                <p className="text-sm font-medium text-gray-900">PO 2025 014</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">PR Reference number</p>
                <p className="text-sm font-medium text-gray-900">542345</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Supplier</p>
                <p className="text-sm font-medium text-gray-900">Kaar Technologies</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Awarded Date</p>
                <p className="text-sm font-medium text-gray-900">12 Jun 25</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Procurement Category</p>
                <p className="text-sm font-medium text-gray-900">Consultancy</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Bid type</p>
                <p className="text-sm font-medium text-gray-900">Two-envelope (Technical + Commercial)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract Value</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">400,000,000</p>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <i className="ri-file-copy-line text-sm text-gray-500" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Evaluation summary</p>
                <p className="text-sm font-medium text-gray-900">Vendor scored: 92.5%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">PO type *</p>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option>Goods</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract start date *</p>
                <input
                  type="date"
                  value={contractStartDate}
                  onChange={(e) => setContractStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract end date *</p>
                <input
                  type="date"
                  value={contractEndDate}
                  onChange={(e) => setContractEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Supplier details */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">Supplier details</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Supplier name</p>
                <p className="text-sm font-medium text-gray-900">Kaar Technologies</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Supplier ID</p>
                <p className="text-sm font-medium text-gray-900">542345</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment terms *</p>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option>Select Value</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contact person</p>
                <p className="text-sm font-medium text-gray-900">Mohammed Al-Quraan</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email/ Phone</p>
                <p className="text-sm font-medium text-gray-900">mohammed@gmail.com</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivery address</p>
                <p className="text-sm font-medium text-gray-900">#41, Alshaliah street, Riyadh</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Zakat tax number</p>
                <p className="text-sm font-medium text-gray-900">5643565666</p>
              </div>
            </div>
          </div>

          {/* Scope of Work */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">Scope of Work</h3>
            <textarea
              value={scopeOfWork}
              onChange={(e) => setScopeOfWork(e.target.value)}
              className="w-full px-4 py-3 text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1B733D] focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Line items/Scope table */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">Line items /Scope table</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="bg-[#1B733D]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">S#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Units of Measure (UOM)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Estimated Unit Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Delivery Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lineItems.map((item) => {
                    const isEditing = editingLineItemId === item.id
                    return (
                      <tr
                        key={item.id}
                        onClick={() => !isEditing && setEditingLineItemId(item.id)}
                        className={`${!isEditing ? "cursor-pointer hover:bg-gray-50" : ""}`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.desc}
                              onChange={(e) => updateLineItem(item.id, "desc", e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{item.desc}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateLineItem(item.id, "qty", Number.parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{item.qty}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <select
                              value={item.uom}
                              onChange={(e) => updateLineItem(item.id, "uom", e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="Count">Count</option>
                              <option value="Kg">Kg</option>
                              <option value="Meter">Meter</option>
                              <option value="Liter">Liter</option>
                            </select>
                          ) : (
                            <span>{item.uom}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => updateLineItem(item.id, "price", e.target.value)}
                              className="w-28 px-2 py-1 text-sm border border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{item.price}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => updateLineItem(item.id, "date", e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded w-36"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteLineItem(item.id)
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <button
              onClick={addLineItem}
              className="mt-4 px-4 py-2 text-sm text-white bg-[#1B733D] rounded-lg hover:bg-[#155a2f] transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line" />
              Add
            </button>
          </div>

          {/* Milestone & Deliverables */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-[#1B733D] mb-4">Milestone & Deliverables</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="bg-[#1B733D]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Milestone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Value</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Due date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {milestones.map((item) => {
                    const isEditing = editingMilestoneId === item.id
                    return (
                      <tr
                        key={item.id}
                        onClick={() => !isEditing && setEditingMilestoneId(item.id)}
                        className={`${!isEditing ? "cursor-pointer hover:bg-gray-50" : ""}`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.desc}
                              onChange={(e) => updateMilestone(item.id, "desc", e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{item.desc}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="number"
                              value={item.value}
                              onChange={(e) => updateMilestone(item.id, "value", Number.parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{item.value}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => updateMilestone(item.id, "price", e.target.value)}
                              className="w-28 px-2 py-1 text-sm border border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{item.price}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <select
                              value={item.status}
                              onChange={(e) => updateMilestone(item.id, "status", e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                            </select>
                          ) : (
                            <span>{item.status}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => updateMilestone(item.id, "date", e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded w-36"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteMilestone(item.id)
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <button
              onClick={addMilestone}
              className="mt-4 px-4 py-2 text-sm text-white bg-[#1B733D] rounded-lg hover:bg-[#155a2f] transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line" />
              Add
            </button>
          </div>

          {/* Finance summary */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-[#1B733D] mb-4">Finance summary (for internal purpose)</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">10,000,000</p>
                  <i className="ri-information-line text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tax (VAT 15%)</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">100,000</p>
                  <i className="ri-information-line text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total amount</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">10,100,000</p>
                  <i className="ri-information-line text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Currency</p>
                <p className="text-sm font-medium text-gray-900">SAR</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Remaining budget</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">99,000,000</p>
                  <i className="ri-information-line text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Retention (if any)</p>
                <input
                  type="text"
                  placeholder="Type Here"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">Terms and conditions</h3>
            <textarea
              placeholder="Type here"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white resize-none"
              rows={4}
            />
          </div>

          {/* Supporting Documents */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">Supporting Documents</h3>
              <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Download All
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="bg-[#1B733D]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Document Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Attachment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Generated On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 text-sm text-gray-900">Letter of Award</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                          <i className="ri-file-pdf-fill text-red-600 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Letter of award</p>
                          <p className="text-xs text-gray-500">6 Mb</p>
                        </div>
                        <button className="ml-auto p-2 hover:bg-gray-100 rounded transition-colors">
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">02-Oct-2025</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm text-gray-900">Other</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                          <i className="ri-file-pdf-fill text-red-600 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">MOM</p>
                          <p className="text-xs text-gray-500">6 Mb</p>
                        </div>
                        <button className="ml-auto p-2 hover:bg-gray-100 rounded transition-colors">
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">02-Oct-2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-900 mb-4">Attachments</h3>

            {/* Upload Area */}
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Click or Drag file to this area to upload</p>
                <p className="text-xs text-gray-400">Supports single or for bulk upload and Max file size is 15MB</p>
              </div>
            </div>

            {/* Supporting document (Uploaded by you) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Supporting document (Uploaded by you)</h4>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Download All
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="ri-arrow-up-s-line text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <thead className="bg-[#1B733D]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Attachment</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Uploaded by</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Uploaded date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                            <i className="ri-file-pdf-fill text-red-600 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Technical specifications</p>
                            <p className="text-xs text-gray-500">6 Mb</p>
                          </div>
                          <button className="ml-4 p-2 hover:bg-gray-100 rounded transition-colors">
                            <Download size={16} className="text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                            <Trash2 size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">Mohammed Zubair</td>
                      <td className="px-4 py-4 text-sm text-gray-900">02-Aug-2022</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                            <i className="ri-file-pdf-fill text-red-600 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Submission guidelines</p>
                            <p className="text-xs text-gray-500">6 Mb</p>
                          </div>
                          <button className="ml-4 p-2 hover:bg-gray-100 rounded transition-colors">
                            <Download size={16} className="text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                            <Trash2 size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">Mohammed Zubair</td>
                      <td className="px-4 py-4 text-sm text-gray-900">02-Aug-2022</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
