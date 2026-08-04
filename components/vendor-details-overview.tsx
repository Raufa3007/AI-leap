"use client"

interface VendorOverviewProps {
  vendorId: string
}

const vendorData: Record<string, any> = {
  "76567": {
    name: "Palm tree IT services",
    location: "Riyadh, Saudi Arabia",
    crNumber: "7890902344",
    address: "#124, Olaya street, Riyadh, Saudi Arabia.",
    logo: "🌴",
    totalPRValue: "12,000,000,000",
    totalPO: "10",
    totalOngoingPO: "02",
    servicesOffered: ["Digital transformation", "SAP", "Microsoft Oracle", "UI/UX"],
    aboutVendor:
      "Palm IT Services is a technology solutions provider that specializes in delivering innovative IT services and support to businesses of all sizes. Palm IT Services is a technology solutions provider that specializes in delivering innovative IT services. The company is committed to helping clients streamline their operations, improve productivity, and drive digital transformation through tailored solutions that meet their unique business needs.",
    ratingPerProject: [
      {
        project: "Finance Mobile app - 51200000101",
        onTimeDelivery: 4,
        qualityOfService: 4,
        valueForMoney: 4,
        overallExperience: 4,
      },
      {
        project: "Human Resource - Web app- 31200000333",
        onTimeDelivery: 4,
        qualityOfService: 4,
        valueForMoney: 4,
        overallExperience: 4,
      },
      {
        project: "Asset management app",
        onTimeDelivery: 4,
        qualityOfService: 4,
        valueForMoney: 4,
        overallExperience: 4,
      },
      {
        project: "Design system",
        onTimeDelivery: 4,
        qualityOfService: 4,
        valueForMoney: 4,
        overallExperience: 4,
      },
      {
        project: "Loan management system",
        onTimeDelivery: 4,
        qualityOfService: 4,
        valueForMoney: 4,
        overallExperience: 4,
      },
      {
        project: "Intranet portal",
        onTimeDelivery: 4,
        qualityOfService: 4,
        valueForMoney: 4,
        overallExperience: 4,
      },
    ],
  },
}

export default function VendorDetailsOverview({ vendorId }: VendorOverviewProps) {
  const vendor = vendorData[vendorId] || vendorData["76567"]

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

  return (
    <div className="space-y-6">
      {/* Vendor Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-green-700 rounded-full flex items-center justify-center text-6xl flex-shrink-0">
            {vendor.logo}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{vendor.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span>📍</span>
              <span>{vendor.location}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">CR number</p>
                <p className="font-semibold text-gray-900">{vendor.crNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-900">{vendor.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total PR Value (SAR)</p>
                <p className="text-lg font-bold text-gray-900">{vendor.totalPRValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total PO</p>
                <p className="text-lg font-bold text-gray-900">{vendor.totalPO}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total ongoing PO</p>
                <p className="text-lg font-bold text-gray-900">{vendor.totalOngoingPO}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Offered */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services offered</h3>
        <div className="flex flex-wrap gap-2">
          {vendor.servicesOffered.map((service: string) => (
            <span key={service} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* About Vendor */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About vendor</h3>
        <p className="text-gray-700 leading-relaxed">{vendor.aboutVendor}</p>
      </div>

      {/* Rating per Project */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating per project</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">On Time Delivery</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quality of service</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Value for Money</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Overall experience</th>
              </tr>
            </thead>
            <tbody>
              {vendor.ratingPerProject.map((rating: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{rating.project}</td>
                  <td className="px-4 py-3 text-sm">{renderStars(rating.onTimeDelivery)}</td>
                  <td className="px-4 py-3 text-sm">{renderStars(rating.qualityOfService)}</td>
                  <td className="px-4 py-3 text-sm">{renderStars(rating.valueForMoney)}</td>
                  <td className="px-4 py-3 text-sm">{renderStars(rating.overallExperience)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
