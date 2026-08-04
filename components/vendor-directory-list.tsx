"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown } from "lucide-react"

interface Vendor {
  id: string
  bpId: string
  name: string
  serviceOffered: string
  location: string
  overallRating: number
  totalPOs: number
  totalPOValue: number
  tags: string[]
  status: "Active" | "Inactive" | "Verified" | "Pending completion"
  createdOn: string
}

const mockVendors: Vendor[] = [
  {
    id: "76567",
    bpId: "76567",
    name: "Palm tree IT services",
    serviceOffered: "IT Services",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 12,
    totalPOValue: 123000000,
    tags: ["Verified"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "76560",
    bpId: "76560",
    name: "YCP Group",
    serviceOffered: "IT Services",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 14,
    totalPOValue: 93000000,
    tags: ["Active"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "66789",
    bpId: "66789",
    name: "Accely",
    serviceOffered: "IT Services",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 20,
    totalPOValue: 12000000,
    tags: ["Active", "Documents expired"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "66785",
    bpId: "66785",
    name: "Traderston",
    serviceOffered: "IT Services",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 5,
    totalPOValue: 1000000,
    tags: ["Active"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "66782",
    bpId: "66782",
    name: "Supreme Group",
    serviceOffered: "IT Services",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 5,
    totalPOValue: 1000000,
    tags: ["Active"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "66780",
    bpId: "66780",
    name: "Aviaan Group",
    serviceOffered: "Recourse Providing",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 3,
    totalPOValue: 750000,
    tags: ["Pending completion"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "66779",
    bpId: "66779",
    name: "Futtiam Group",
    serviceOffered: "Recourse Providing",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 3,
    totalPOValue: 750000,
    tags: ["Inactive"],
    status: "Inactive",
    createdOn: "2022-08-02",
  },
  {
    id: "66778",
    bpId: "66778",
    name: "Emirates Group",
    serviceOffered: "Recourse Providing",
    location: "Riyadh, Saudi Arabia",
    overallRating: 4,
    totalPOs: 3,
    totalPOValue: 750000,
    tags: ["Verified"],
    status: "Active",
    createdOn: "2022-08-02",
  },
  {
    id: "66777",
    bpId: "66777",
    name: "Tech Solutions Ltd",
    serviceOffered: "IT Services",
    location: "Jeddah, Saudi Arabia",
    overallRating: 3,
    totalPOs: 8,
    totalPOValue: 45000000,
    tags: ["Active"],
    status: "Active",
    createdOn: "2022-09-15",
  },
  {
    id: "66776",
    bpId: "66776",
    name: "Global Consulting",
    serviceOffered: "Consulting Services",
    location: "Dammam, Saudi Arabia",
    overallRating: 5,
    totalPOs: 6,
    totalPOValue: 28000000,
    tags: ["Verified"],
    status: "Active",
    createdOn: "2022-10-01",
  },
]

interface VendorDirectoryListProps {
  onSelectVendor: (vendorId: string) => void
}

export default function VendorDirectoryList({ onSelectVendor }: VendorDirectoryListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const itemsPerPage = 10

  const handleShowFilters = () => {
    setShowFilters(!showFilters)
    if (!showFilters) setShowSort(false)
  }

  const handleShowSort = () => {
    setShowSort(!showSort)
    if (!showSort) setShowFilters(false)
  }

  const filteredVendors = useMemo(() => {
    const filtered = mockVendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.serviceOffered.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = !selectedTag || vendor.tags.includes(selectedTag)
      const matchesLocation = !selectedLocation || vendor.location === selectedLocation

      return matchesSearch && matchesTag && matchesLocation
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.overallRating - a.overallRating
        case "pos":
          return b.totalPOs - a.totalPOs
        case "value":
          return b.totalPOValue - a.totalPOValue
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedTag, selectedLocation, sortBy])

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const uniqueTags = Array.from(new Set(mockVendors.flatMap((v) => v.tags)))
  const uniqueLocations = Array.from(new Set(mockVendors.map((v) => v.location)))

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-orange-400 text-lg" : "text-gray-300 text-lg"}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const getTagColor = (tag: string) => {
    if (tag === "Verified") return "bg-green-100 text-green-700"
    if (tag === "Active") return "bg-green-100 text-green-700"
    if (tag === "Inactive") return "bg-red-100 text-red-700"
    if (tag === "Pending completion") return "bg-blue-100 text-blue-700"
    if (tag === "Documents expired") return "bg-orange-100 text-orange-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Directory</h1>
            <p className="text-gray-600">All Vendors ({filteredVendors.length})</p>
          </div>

          {/* Search and Action Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search By Vendor Name & Service Offered"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              Start Performance Review
            </button>
            <button
              onClick={handleShowSort}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                showSort
                  ? "bg-green-700 text-white border border-green-700"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
            <button
              onClick={handleShowFilters}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                showFilters
                  ? "bg-green-700 text-white border border-green-700"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {showSort && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PO Approved Date</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                    <option>Select order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created On</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                    <option>Select order</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium">
                  Apply Sort
                </button>
                <button
                  onClick={() => {
                    setSortBy("name")
                    setShowSort(false)
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <select
                    value={selectedTag || ""}
                    onChange={(e) => {
                      setSelectedTag(e.target.value || null)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select Tag</option>
                    {uniqueTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation || ""}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value || null)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select Location</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created On</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium">
                  Apply Filter
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedTag(null)
                    setSelectedLocation(null)
                    setCurrentPage(1)
                    setShowFilters(false)
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">BP ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendor Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service Offered</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Overall Rating</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total POs</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total PO Value (SAR)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tags</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    onClick={() => onSelectVendor(vendor.id)}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.bpId}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:underline font-medium">{vendor.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.serviceOffered}</td>
                    <td className="px-6 py-4 text-sm">{renderStars(vendor.overallRating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.totalPOs}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.totalPOValue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {vendor.tags.map((tag) => (
                          <span key={tag} className={`px-2 py-1 rounded text-xs font-medium ${getTagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredVendors.length)}</span> of{" "}
              <span className="font-medium">{filteredVendors.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === page
                      ? "bg-green-700 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
