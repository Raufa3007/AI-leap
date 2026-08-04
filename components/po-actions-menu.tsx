"use client"
 
import { useState, useRef, useEffect } from "react"
import { MoreVertical, FileText, X } from "lucide-react"
 
interface POActionsMenuProps {
  onAmendPO: () => void
  onCancelPO: () => void
}
 
export default function POActionsMenu({ onAmendPO, onCancelPO }: POActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
 
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
 
  const handleAmendPO = () => {
    onAmendPO()
    setIsOpen(false)
  }
 
  const handleCancelPO = () => {
    onCancelPO()
    setIsOpen(false)
  }
 
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
      >
        <MoreVertical size={18} />
      </button>
 
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
          <button
            onClick={handleAmendPO}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
          >
            <FileText size={18} className="text-gray-600" />
            <span>Amend PO</span>
          </button>
          <button
            onClick={handleCancelPO}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <X size={18} className="text-red-600" />
            <span>Cancel PO</span>
          </button>
        </div>
      )}
    </div>
  )
}
