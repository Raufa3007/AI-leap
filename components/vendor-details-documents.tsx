"use client"

import { useState } from "react"
import PDFPreviewModal from "./pdf-preview-modal"

interface Document {
  type: string
  fileName: string
  fileSize: string
  uploadedDate: string
  uploadedBy: string
}

interface VendorDetailsDocumentsProps {
  vendorId: string
}

const documentsData: Record<string, Document[]> = {
  "76567": [
    {
      type: "Purchase Order (PO) Document",
      fileName: "PO document",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Mohammed Al-Shammari",
    },
    {
      type: "Vendor Quotation / Proposal",
      fileName: "Quotation document",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Abdullah Al-Hadlaq",
    },
    {
      type: "Contract or Agreement",
      fileName: "Contract agreement",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Sara Ruwaisid",
    },
    {
      type: "Invoice (Draft or Final)",
      fileName: "Final Invoice",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "John doe",
    },
    {
      type: "Vendor Registration Form / Profile",
      fileName: "Registration form",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Saradesh Jade",
    },
    {
      type: "SLA (Service Level Agreement)",
      fileName: "Service agreement",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Saradesh Jade",
    },
    {
      type: "Compliance Documents",
      fileName: "Compliance documents",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "02-Aug-2022",
    },
    {
      type: "Delivery Schedule or Work Plan",
      fileName: "Delivery schedule",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Mohammed Al-Azarani",
    },
    {
      type: "Advance Payment Proof",
      fileName: "Payment proof",
      fileSize: "6.5kb",
      uploadedDate: "02-Aug-2022",
      uploadedBy: "Mohammed Al-Azarani",
    },
  ],
}

export default function VendorDetailsDocuments({ vendorId }: VendorDetailsDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const documents = documentsData[vendorId] || documentsData["76567"]

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Documents</h3>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Download All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type of Document</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attachment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Uploaded Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Uploaded by</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        PDF
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{doc.fileName}</p>
                        <p className="text-gray-500 text-xs">{doc.fileSize}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.uploadedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.uploadedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PDFPreviewModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        fileName={selectedDocument?.fileName || ""}
      />
    </>
  )
}
